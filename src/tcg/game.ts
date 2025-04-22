import Card from "./card";
import Character from "./character";
import { GameAdditionalMetadata } from "./additionalMetadata/gameAdditionalMetadata";
import { MessageCache } from "../tcgChatInteractions/messageCache";
import { TCGThread } from "../tcgChatInteractions/sendGameMessage";
import { CharacterName } from "./characters/metadata/CharacterName";
import type { GamePlugin } from "./gamePlugin";

export default class Game {
  characters: [Character, Character];
  turnCount: number;
  gameOver: boolean;
  additionalMetadata: GameAdditionalMetadata;

  messageCache: MessageCache;

  plugins: GamePlugin[];

  constructor(
    characters: [Character, Character],
    messageCache: MessageCache,
    plugins: GamePlugin[] = []
  ) {
    this.characters = characters;
    this.gameOver = false;
    this.additionalMetadata = {
      attackMissed: {
        0: false,
        1: false,
      },
      // whether a character's attack was already countered
      attackCountered: {
        0: false,
        1: false,
      },
      attackModifier: {
        0: 1,
        1: 1,
      },
      currentDraws: {},
      lastUsedCards: {},
      forfeited: {
        0: false,
        1: false,
      },
    };
    this.turnCount = 0;

    this.messageCache = messageCache;

    this.plugins = plugins;
  }

  gameStart() {
    this.plugins.forEach((plugin) => {
      plugin.modifyInitialStats?.(this);
    });
    this.characters.forEach((character) => character.drawStartingHand());
    this.plugins.forEach((plugin) => {
      plugin.onGameStart?.(this);
    });
  }

  // handle character attack. returns attack amount
  attack(attackProps: {
    attackerIndex: number;
    damage: number;
    isTimedEffectAttack: boolean;
  }): number {
    const attacker = this.getCharacter(attackProps.attackerIndex);
    const defender = this.getCharacter(1 - attackProps.attackerIndex);
    if (attackProps.isTimedEffectAttack) {
      attacker.additionalMetadata.timedEffectAttackedThisTurn = true;
    } else {
      attacker.additionalMetadata.attackedThisTurn = true;
    }

    // handle attacker/defender ability
    if (attacker.ability.abilityAttackEffect) {
      attacker.ability.abilityAttackEffect(
        this,
        attackProps.attackerIndex,
        this.messageCache
      );
    }
    // counter attacks should not be under defend effect
    if (defender.ability.abilityDefendEffect) {
      defender.ability.abilityDefendEffect(
        this,
        1 - attackProps.attackerIndex,
        this.messageCache,
        attackProps.damage
      );
    }

    // damage calculation
    let actualDamage = 0;
    if (this.additionalMetadata.attackMissed[attackProps.attackerIndex]) {
      this.messageCache.push(`# ${attacker.name} missed!`, TCGThread.Gameroom);
    } else {
      let baseDamage =
        attackProps.damage *
        this.additionalMetadata.attackModifier[attackProps.attackerIndex];

      baseDamage = this.calculateDamage(
        baseDamage,
        attacker.stats.stats.ATK,
        defender.stats.stats.DEF,
        defender.additionalMetadata.defenseDamageReduction
      );

      // allow plugins to modify damage before applying
      this.plugins.forEach((plugin) => {
        baseDamage =
          plugin.modifyDamage?.(
            this,
            baseDamage,
            attackProps.attackerIndex,
            1 - attackProps.attackerIndex
          ) ?? baseDamage;
      });

      actualDamage = baseDamage;

      const defenderRemainingHp = Number(
        (defender.stats.stats.HP - actualDamage).toFixed(2)
      );
      defender.stats.stats.HP = defenderRemainingHp;
      const hpLeft: string = defender.additionalMetadata.manaSuppressed
        ? ""
        : `${defender.name} has ${defender.stats.stats.HP} left!`;
      this.messageCache.push(
        `# ${attacker.cosmetic.emoji} ${attacker.name} attacks ${defender.cosmetic.emoji} ${defender.name} for ${actualDamage.toFixed(2)} damage! ${hpLeft}`,
        TCGThread.Gameroom
      );

      // early exit if opponent's already defeated
      // to prevent counter ability from firing off in defeat
      if (defenderRemainingHp <= 0) {
        if (
          this.checkCharacterDefeated(defender, 1 - attackProps.attackerIndex)
        ) {
          return actualDamage;
        }
      }
    }

    // there should only be 1 counter trigger per attack step
    // essentially, if attacker not countered this attack step, perform the counter
    if (
      !this.additionalMetadata.attackCountered[attackProps.attackerIndex] &&
      defender.ability.abilityCounterEffect
    ) {
      this.additionalMetadata.attackCountered[attackProps.attackerIndex] = true; // countered
      defender.ability.abilityCounterEffect(
        this,
        1 - attackProps.attackerIndex,
        this.messageCache,
        attackProps.damage
      );
    }

    // if attack didn't miss
    if (!this.additionalMetadata.attackMissed[attackProps.attackerIndex]) {
      if (attackProps.isTimedEffectAttack) {
        if (attacker.ability.abilityAfterTimedAttackEffect) {
          attacker.ability.abilityAfterTimedAttackEffect(
            this,
            attackProps.attackerIndex,
            this.messageCache
          );
        }
      } else {
        if (attacker.ability.abilityAfterDirectAttackEffect) {
          attacker.ability.abilityAfterDirectAttackEffect(
            this,
            attackProps.attackerIndex,
            this.messageCache
          );
        }
      }
    }

    // PLUGIN HOOK HERE   END OF ATTACK METHOD
    this.plugins.forEach((plugin) => {
      plugin.onAttackComplete?.(this, attackProps.attackerIndex, actualDamage);
    });

    // reset metadata
    this.additionalMetadata.attackMissed[attackProps.attackerIndex] = false;
    this.additionalMetadata.attackCountered[attackProps.attackerIndex] = false;

    return actualDamage;
  }

  // check to see which character should move first
  getFirstMove(characterToMoveMap: Record<number, Card>): number {
    if (!(0 in characterToMoveMap)) {
      return 1;
    }
    if (!(1 in characterToMoveMap)) {
      return 0;
    }

    if (characterToMoveMap[0].priority > characterToMoveMap[1].priority) {
      return 0;
    } else if (
      characterToMoveMap[1].priority > characterToMoveMap[0].priority
    ) {
      return 1;
    } else {
      if (
        this.characters[0].stats.stats.SPD > this.characters[1].stats.stats.SPD
      ) {
        return 0;
      } else if (
        this.characters[1].stats.stats.SPD > this.characters[0].stats.stats.SPD
      ) {
        return 1;
      } else {
        return Math.floor(Math.random() * 2);
      }
    }
  }

  getCharacter(characterIndex: number): Character {
    if (characterIndex !== 0 && characterIndex !== 1) {
      throw new Error("characterIndex must be 0 or 1");
    }

    return this.characters[characterIndex];
  }

  checkGameOver(): number {
    let losingIndex = 0;
    this.characters.forEach((character, index) => {
      if (!this.gameOver) {
        if (this.checkCharacterDefeated(character, index)) {
          this.messageCache.push(
            `# ${character.name} has been defeated!`,
            TCGThread.Gameroom
          );
          this.gameOver = true;

          losingIndex = index;
          return;
        }
      }
    });

    return losingIndex;
  }

  private checkCharacterDefeated(
    character: Character,
    characterIndex: number
  ): boolean {
    let characterDefeated = false;

    if (
      character.stats.stats.HP <= 0 &&
      character.name !== CharacterName.Denken
    ) {
      characterDefeated = true;
    }

    if (this.additionalMetadata.forfeited[characterIndex]) {
      characterDefeated = true;
    }

    return characterDefeated;
  }

  private calculateDamage(
    moveDamage: number,
    attackerAttack: number,
    defenderDefense: number,
    defenderDamageReduction: number
  ) {
    return (
      Math.max(1, moveDamage + attackerAttack - defenderDefense) *
      (1 - defenderDamageReduction)
    );
  }
}

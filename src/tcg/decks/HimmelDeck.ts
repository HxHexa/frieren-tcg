import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Game from "@tcg/game";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";

const a_FrierenStrikeTheirWeakpoint = new Card({
  title: "Frieren! Strike Their Weakpoint!",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg, oppDef]) =>
    `Opponent's DEF-${oppDef} for 2 turns. Frieren attacks for ${dmg} DMG. At next turn's end, Frieren attacks for an additional ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1362092606695145482/GIF_1369578971.gif?ex=68086357&is=680711d7&hm=07c26c17a9a859865c2f107f8358b50df98cc49d49ed0daa2f659c6acb494f1e&",
  },
  effects: [7, 1],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Frieren!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} targetted the opponent's weakpoint.`,
        TCGThread.Gameroom
      );
    }

    const damage = this.calculateEffectValue(this.effects[0]);
    const oppDefDebuff = this.calculateEffectValue(this.effects[1]);
    opponent.adjustStat(-1 * oppDefDebuff, StatsEnum.DEF);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "frieren",
      new TimedEffect({
        name: `${isHimmel ? "Frieren" : "Mage"}: Weakpoint Analysis`,
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 2,
        metadata: { frieren: true },
        activateEndOfTurnActionThisTurn: false,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: function (this, game, characterIndex) {
          const otherCharacter = game.characters[characterIndex];
          messageCache.push(
            `${isHimmel ? "Frieren" : `${otherCharacter.name}`} strikes the weakpoint!`,
            TCGThread.Gameroom
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
        endOfTimedEffectAction: function (this, _game, _characterIndex) {
          opponent.adjustStat(oppDefDebuff, StatsEnum.DEF);
        },
      })
    );

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

const a_FrierenBackMeUp = new Card({
  title: "Frieren! Back Me Up!",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg, oppDef]) =>
    `Opponent's DEF-${oppDef} for 3 turns. Frieren attacks for ${dmg} DMG. For the next 3 turn ends, Frieren attacks for an additional ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [3, 2],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Frieren!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} unleashed a barrage of Zoltraak.`,
        TCGThread.Gameroom
      );
    }

    const damage = this.calculateEffectValue(this.effects[0]);
    const oppDefDebuff = this.calculateEffectValue(this.effects[1]);
    opponent.adjustStat(-1 * oppDefDebuff, StatsEnum.DEF);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "frieren",
      new TimedEffect({
        name: `${isHimmel ? "Frieren: " : "Mage: "}Backing Fire`,
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 3,
        metadata: { frieren: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: function (this, game, characterIndex) {
          const otherCharacter = game.characters[characterIndex];
          messageCache.push(
            `${isHimmel ? "Frieren" : `${otherCharacter.name}`} sends supporting fire!`,
            TCGThread.Gameroom
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
        endOfTimedEffectAction: function (this, game, characterIndex) {
          const otherCharacter = game.characters[characterIndex];
          messageCache.push(
            `${isHimmel ? "Frieren" : `${otherCharacter.name}`} let up the supporting fire.`,
            TCGThread.Gameroom
          );
          opponent.adjustStat(oppDefDebuff, StatsEnum.DEF);
        },
      })
    );

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

export const a_FrierenNow = new Card({
  title: "Frieren! Now!",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [8],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Frieren!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} sent forth hellfire.`,
        TCGThread.Gameroom
      );
    }
    const damage = this.calculateEffectValue(this.effects[0]);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "frieren",
      new TimedEffect({
        name: `${isHimmel ? "Frieren: " : "Mage: "}Strike`,
        description: `Deal ${damage}.`,
        turnDuration: 1,
        metadata: { frieren: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: function (this, game, characterIndex) {
          const otherCharacter = game.characters[characterIndex];
          messageCache.push(
            `${isHimmel ? "Frieren" : `${otherCharacter.name}`} stepped back after ${isHimmel ? "her" : otherCharacter.cosmetic.pronouns.possessive} attack.`,
            TCGThread.Gameroom
          );
        },
      })
    );

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

const a_EisenTheEnemysOpen = new Card({
  title: "Eisen! The Enemy's Open!",
  cardMetadata: { nature: Nature.Util },
  description: ([def, dmg]) =>
    `Eisen winds up. DEF+${def} for 2 turns. At next turn's end, deal ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [2, 10],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Eisen!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(`${character.name} winds up.`, TCGThread.Gameroom);
    }
    const def = this.calculateEffectValue(this.effects[0]);
    const damage = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(def, StatsEnum.DEF);

    const endOfTimedEffectAction = function (
      _game: Game,
      _characterIndex: number,
      messageCache: MessageCache
    ) {
      const otherCharacter = game.characters[characterIndex];
      messageCache.push(
        `${isHimmel ? "Eisen shifted his stance." : `${otherCharacter.name} shifted ${otherCharacter.cosmetic.pronouns.possessive} stance.`}`,
        TCGThread.Gameroom
      );
      character.adjustStat(-def, StatsEnum.DEF);
    };

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "eisen",
      new TimedEffect({
        name: `${isHimmel ? "Eisen: " : "Warrior: "}Winding Up`,
        description: `DEF+${def}. Deal ${damage} at end of timed effect.`,
        turnDuration: 2,
        metadata: { eisen: true },
        activateEndOfTurnActionThisTurn: false,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: function (this, game, characterIndex) {
          const otherCharacter = game.characters[characterIndex];
          messageCache.push(
            `${isHimmel ? "Eisen lands his attack!" : `${otherCharacter.name} lands ${otherCharacter.cosmetic.pronouns.possessive} attack!`}`,
            TCGThread.Gameroom
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
        endOfTimedEffectAction: endOfTimedEffectAction,
        replacedAction: endOfTimedEffectAction,
      })
    );
  },
});

const a_EisenCoverMyBack = new Card({
  title: "Eisen! Cover My Back!",
  cardMetadata: { nature: Nature.Util },
  description: ([def, dmg]) =>
    `Eisen provides cover. DEF+${def} for 3 turns. Once per turn, when an opponent attacks, counter for ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [3, 5],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Eisen!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} readies to counter.`,
        TCGThread.Gameroom
      );
    }
    const def = this.calculateEffectValue(this.effects[0]);
    const counterDmg = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(def, StatsEnum.DEF);

    character.additionalMetadata.himmelEisenReadyToCounter = true;

    character.ability.abilityCounterEffect = (
      game,
      characterIndex,
      messageCache: MessageCache,
      _attackDamage
    ) => {
      if (character.additionalMetadata.himmelEisenReadyToCounter) {
        const otherCharacter = game.characters[characterIndex];
        messageCache.push(
          `${isHimmel ? "Eisen" : `${otherCharacter.name}`} counters the attack!`,
          TCGThread.Gameroom
        );
        CommonCardAction.commonAttack(game, characterIndex, {
          damage: counterDmg,
          hpCost: 0,
        });
        character.additionalMetadata.himmelEisenReadyToCounter = false;
      }
    };

    const endOfTimedEffectAction = function (
      _game: Game,
      _characterIndex: number,
      messageCache: MessageCache
    ) {
      const otherCharacter = game.characters[characterIndex];
      messageCache.push(
        `${isHimmel ? "Eisen shifted his stance." : `${otherCharacter.name} shifted ${otherCharacter.cosmetic.pronouns.possessive} stance.`}`,
        TCGThread.Gameroom
      );
      character.adjustStat(-def, StatsEnum.DEF);
      character.ability.abilityCounterEffect = undefined;
      character.additionalMetadata.himmelEisenReadyToCounter = false;
    };

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "eisen",
      new TimedEffect({
        name: `${isHimmel ? "Eisen: " : "Warrior: "}On the Lookout`,
        description: `DEF+${def}. When an opponent attacks, counter for ${counterDmg} DMG`,
        turnDuration: 3,
        priority: -99,
        metadata: { eisen: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: function (this, _game, _characterIndex) {
          // priority -99 means it would always go after everything else, to make a pseudo-start-of-turn effect
          character.additionalMetadata.himmelEisenReadyToCounter = true;
        },
        endOfTimedEffectAction: endOfTimedEffectAction,
        replacedAction: endOfTimedEffectAction,
      })
    );
  },
});

const eisenHoldTheLine = new Card({
  title: "Eisen! Hold The Line!",
  cardMetadata: { nature: Nature.Util },
  description: ([def]) => `Eisen holds the line. DEF+${def} for 4 turns.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [3],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Eisen!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} prepares to defend.`,
        TCGThread.Gameroom
      );
    }
    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);

    const endOfTimedEffectAction = function (
      _game: Game,
      _characterIndex: number,
      messageCache: MessageCache
    ) {
      const otherCharacter = game.characters[characterIndex];
      messageCache.push(
        `${isHimmel ? "Eisen" : `${otherCharacter.name}`} backed down.`,
        TCGThread.Gameroom
      );
      character.adjustStat(-def, StatsEnum.DEF);
    };

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "eisen",
      new TimedEffect({
        name: `${isHimmel ? "Eisen: " : "Warrior: "}Hold the Line`,
        description: `DEF+${def}.`,
        turnDuration: 4,
        metadata: { eisen: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: endOfTimedEffectAction,
        replacedAction: endOfTimedEffectAction,
      })
    );
  },
});

const heiterEmergency = new Card({
  title: "Heiter! Emergency!",
  cardMetadata: { nature: Nature.Util },
  description: ([heal]) =>
    `Heiter heals the party for ${heal}HP. At next turn's end, heal an additional ${heal} HP.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [5],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Heiter!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} applies first-aid.`,
        TCGThread.Gameroom
      );
    }
    const heal = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(heal, StatsEnum.HP);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "heiter",
      new TimedEffect({
        name: `${isHimmel ? "Heiter" : "Priest"}: First-Aid`,
        description: `Heal ${heal} at end of timed effect.`,
        turnDuration: 2,
        metadata: { heiter: true },
        executeEndOfTimedEffectActionOnRemoval: false,
        endOfTimedEffectAction: function (this, game, characterIndex) {
          const otherCharacter = game.characters[characterIndex];
          messageCache.push(
            `${isHimmel ? "Heiter provides" : `${otherCharacter.name} applies`} first-aid!`,
            TCGThread.Gameroom
          );
          character.adjustStat(heal, StatsEnum.HP);
        },
      })
    );
  },
});

const a_heiterThreeSpears = new Card({
  title: "Heiter! Don't give them an opening!",
  cardMetadata: { nature: Nature.Attack },
  description: ([heal]) =>
    `Heiter casts Three Spears of the Goddess! At next 3 turn's end, deal ${heal} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [5],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Heiter!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} summons Three Spears of the Goddess!`,
        TCGThread.Gameroom
      );
    }
    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "heiter",
      new TimedEffect({
        name: `${isHimmel ? "Heiter" : "Priest"}: Three Spears of the Goddess`,
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 3,
        metadata: { heiter: true },
        executeEndOfTimedEffectActionOnRemoval: false,
        endOfTurnAction: (game, characterIndex) => {
          messageCache.push(
            "The goddess' spears continue to rain!",
            TCGThread.Gameroom
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      })
    );
  },
});

const heiterTrustYou = new Card({
  title: "I trust you, Heiter.",
  cardMetadata: { nature: Nature.Util },
  description: ([atkSpd]) =>
    `Heiter supports the party. ATK+${atkSpd}, SPD+${atkSpd} for 4 turns.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [3],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} called on help from Heiter!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} used Awakening.`,
        TCGThread.Gameroom
      );
    }
    const atkSpd = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(atkSpd, StatsEnum.ATK);
    character.adjustStat(atkSpd, StatsEnum.SPD);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "heiter",
      new TimedEffect({
        name: `${isHimmel ? "Heiter" : "Priest"}: Awakening`,
        description: `ATK+${atkSpd}. SPD+${atkSpd}.`,
        turnDuration: 4,
        metadata: { heiter: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: function (this, _game, _characterIndex) {
          messageCache.push(
            `${isHimmel ? "Heiter needs to take a breather." : "The goddess' aura fades."}`,
            TCGThread.Gameroom
          );
          character.adjustStat(-atkSpd, StatsEnum.ATK);
          character.adjustStat(-atkSpd, StatsEnum.SPD);
        },
        replacedAction: function (this, _game, _characterIndex) {
          messageCache.push(
            `${isHimmel ? "Heiter halted his support." : "The goddess' aura fades."}`,
            TCGThread.Gameroom
          );
          character.adjustStat(-atkSpd, StatsEnum.ATK);
          character.adjustStat(-atkSpd, StatsEnum.SPD);
        },
      })
    );
  },
});

export const quickBlock = new Card({
  title: "Quick Block",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) => `Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.HIMMEL_CARD,
  priority: 3,
  effects: [20],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} swiftly readied ${character.cosmetic.pronouns.possessive} sword to prepare for the opponent's attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Quick Block",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

const rally = new Card({
  title: "Rally",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, stat]) =>
    `HP+${hp}. ATK+${stat}. DEF+${stat}. SPD+${stat}. An additional HP+${hp}, ATK+${stat}, DEF+${stat}, SPD+${stat} for each one of your active allies.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [2, 1],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const isHimmel = character.name === CharacterName.Himmel;
    if (isHimmel) {
      messageCache.push(
        `${character.name} rallied ${character.cosmetic.pronouns.possessive} allies!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} rallied ${character.cosmetic.pronouns.reflexive}.`,
        TCGThread.Gameroom
      );
    }

    const activeAllies = 1 + character.timedEffects.length;
    const hp = activeAllies * this.calculateEffectValue(this.effects[0]);
    const stat = activeAllies * this.calculateEffectValue(this.effects[1]);

    character.adjustStat(hp, StatsEnum.HP);
    character.adjustStat(stat, StatsEnum.ATK);
    character.adjustStat(stat, StatsEnum.DEF);
    character.adjustStat(stat, StatsEnum.SPD);
  },
});

export const a_extremeSpeed = new Card({
  title: "Extreme Speed",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}`,
  emoji: CardEmoji.HIMMEL_CARD,
  priority: 1,
  effects: [12],
  hpCost: 8,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361210956872421497/IMG_3122.gif?ex=6807d13e&is=68067fbe&hm=3ac9b147ffc7c93d02121986546428f4b36f0bb08a2c8bc526d5ba51df5a4bd6&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} dashed at the opponent!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: this.hpCost,
    });
  },
});

export const a_realHeroSwing = new Card({
  title: "A Real Hero's Swing",
  description: ([dmg]) => `DMG ${dmg}`,
  emoji: CardEmoji.HIMMEL_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [18],
  hpCost: 12,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361777461620248576/GIF_1092034222.gif?ex=6807e697&is=68069517&hm=853f7d8910a4ab79010685a4399cd55c0af1f343295e0b2e04c49f829b54eee7&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const isHimmel = character.name === CharacterName.Himmel;
    messageCache.push(
      `${isHimmel ? "The Hero " : ""}${character.name} heaved ${character.cosmetic.pronouns.possessive} sword!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 12 });
  },
});

const himmelDeck = [
  { card: a_FrierenNow, count: 1 },
  { card: a_FrierenStrikeTheirWeakpoint, count: 1 },
  { card: a_FrierenBackMeUp, count: 1 },
  { card: a_EisenTheEnemysOpen, count: 1 },
  { card: a_EisenCoverMyBack, count: 1 },
  { card: eisenHoldTheLine, count: 1 },
  { card: heiterEmergency, count: 1 },
  { card: a_heiterThreeSpears, count: 1 },
  { card: heiterTrustYou, count: 1 },
  { card: quickBlock, count: 2 },
  { card: rally, count: 2 },
  { card: a_extremeSpeed, count: 2 },
  { card: a_realHeroSwing, count: 1 },
];

export default himmelDeck;

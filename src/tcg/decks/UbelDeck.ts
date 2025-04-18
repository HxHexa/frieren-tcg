import Card from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import Rolls from "../util/rolls";
import { CardEmoji } from "../formatting/emojis";
import { MessageCache } from "../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_reelseiden = new Card({
  title: "Reelseiden",
  description: ([dmg]) =>
    `HP-6. Has a 20% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [8],
  cardMetadata: { nature: "Attack", ubelFailureRate: 20 },
  hpCost: 6,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} slashed at ${opponent.name}!`,
      TCGThread.Gameroom
    );

    CommonCardAction.pierceAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 6,
      pierceFactor: pierceFactor,
    });
  },
});

const a_cleave = new Card({
  title: "Cleave",
  description: ([dmg]) =>
    `HP-8. Has a 40% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [12],
  cardMetadata: { nature: "Attack", ubelFailureRate: 40 },
  hpCost: 8,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} slashed at ${opponent.name}!`,
      TCGThread.Gameroom
    );

    CommonCardAction.pierceAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 8,
      pierceFactor: pierceFactor,
    });
  },
});

const a_dismantle = new Card({
  title: "Dismantle",
  description: ([dmg]) =>
    `HP-12. Has a 60% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [16],
  cardMetadata: { nature: "Attack", ubelFailureRate: 60 },
  hpCost: 12,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} slashed at ${opponent.name}!`,
      TCGThread.Gameroom
    );

    CommonCardAction.pierceAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 12,
      pierceFactor: pierceFactor,
    });
  },
});

export const a_malevolentShrine = new Card({
  title: "Malevolent Shrine",
  description: ([dmg]) =>
    `HP-15. Has a 80% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  cardMetadata: { nature: "Attack", signature: true, ubelFailureRate: 80 },
  effects: [22],
  hpCost: 15,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} slashed at ${opponent.name}!`,
      TCGThread.Gameroom
    );

    CommonCardAction.pierceAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 15,
      pierceFactor: pierceFactor,
    });
  },
});

export const rushdown = new Card({
  title: "Rushdown",
  cardMetadata: { nature: "Util" },
  description: ([spd]) =>
    `Increases SPD by ${spd} for 3 turns. Attacks will not miss during this period. At the end of every turn, HP-5.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} rushes towards the ennemy!`,
      TCGThread.Gameroom
    );
    //character.additionalMetadata.sureHit = "sureHit";

    const turnCount = 3;
    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "ubelSpeedModifiers",
      new TimedEffect({
        name: "Rushdown",
        description: `Increases SPD by ${spdIncrease} for ${turnCount} turns. Attacks will not miss`,
        turnDuration: turnCount,
        tags: { ubelSpeedModifiers: 1 },
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} is being reckless.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-5, StatsEnum.HP);
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(`${character.name} retreats.`, TCGThread.Gameroom);
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
          //character.additionalMetadata.sureHit = "regular";
        },
        replacedAction: function (this, _game, characterIndex) {
          messageCache.push(`${character.name} retreats.`, TCGThread.Gameroom);
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
          //character.additionalMetadata.sureHit = "regular";
        },
      })
    );

    character.timedEffects.push();
  },
});

const recompose = new Card({
  title: "Recompose",
  cardMetadata: { nature: "Util" },
  description: ([hp]) => `SPD-10 for 3 turns. Heal ${hp}HP.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(`${character.name} calms down.`, TCGThread.Gameroom);
    //character.additionalMetadata.sureHit = "sureMiss";

    character.adjustStat(-10, StatsEnum.SPD);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );
    const turnCount = 2;

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "ubelSpeedModifiers",
      new TimedEffect({
        name: "Recompose",
        description: `Decreases SPD by 10 for ${turnCount} turns. Attacks will not hit`,
        turnDuration: turnCount,
        tags: { ubelSpeedModifiers: 1 },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} has recomposed ${character.cosmetic.pronouns.reflexive}.`,
            TCGThread.Gameroom
          );
          character.adjustStat(10, StatsEnum.SPD);
          //character.additionalMetadata.sureHit = "regular";
        },
        replacedAction: function (this, _game, characterIndex) {
          character.adjustStat(10, StatsEnum.SPD);
          //character.additionalMetadata.sureHit = "regular";
        },
      })
    );
  },
});

const defend = new Card({
  title: "Defend",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to defend against an incoming attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Defend",
        description: `Increases DEF by ${def} until the end of the turn.`,
        turnDuration: 1,
        priority: -1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const sorganeil = new Card({
  title: "Sorganeil",
  cardMetadata: { nature: "Util" },
  description: () =>
    `Priority-1. Opponent can only wait next turn. Attacks will hit with 100% certainty.`,
  emoji: CardEmoji.UBEL_CARD,
  priority: -2,
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const currentPierceFactor = character.additionalMetadata.pierceFactor;
    opponent.skipTurn = true;
    const currentHittingStatus = character.additionalMetadata.sureHit;
    //character.additionalMetadata.sureHit = "sureHit";
    character.additionalMetadata.pierceFactor = 1;
    messageCache.push(
      `${opponent.name} got trapped in ${character.name}'s gaze!`,
      TCGThread.Gameroom
    );
    character.timedEffects.push(
      new TimedEffect({
        name: "Sorganeil",
        description: `Cannot miss next turn's attack`,
        turnDuration: 2,
        priority: -1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          // character.additionalMetadata.sureHit = currentHittingStatus;
          character.additionalMetadata.pierceFactor = currentPierceFactor;
          messageCache.push(
            `${character.name} averted ${character.cosmetic.pronouns.possessive} gaze.`,
            TCGThread.Gameroom
          );
        },
      })
    );
  },
});

export const empathy = new Card({
  title: `Empathy`,
  cardMetadata: { nature: "Util" },
  description: () =>
    `Use the opponent signature spell. Will fail if used before turn 5.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} tries to empathize with ${opponent.name}...`,
      TCGThread.Gameroom
    );

    if (game.turnCount < 2) {
      messageCache.push(
        `but ${character.name} didn't get the time to know ${opponent.name} well enough!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} learned some new magic`,
        TCGThread.Gameroom
      );

      const opponentDeck = opponent.cards;
      const cardlist = opponentDeck.map((x) => x.card);
      const signatureMove = cardlist.filter(
        (Card) => Card.cardMetadata.signature
      )[0];

      //const learnedMagic = signatureMoves[opponent.name];
      const usedMagic = new Card({
        ...signatureMove,
        empowerLevel: this.empowerLevel - 2,
      });

      messageCache.push(
        `${character.name} used **${usedMagic.getTitle()}**!`,
        TCGThread.Gameroom
      );
      const characterEffectsNames = character.timedEffects.map(
        (eff) => eff.name
      );
      if (
        usedMagic.cardMetadata.nature === "Attack" &&
        characterEffectsNames.find((effname) => effname === "Recompose")
      ) {
        messageCache.push("The attack misses!", TCGThread.Gameroom);
      }
      usedMagic.cardAction(game, characterIndex, messageCache);
    }
  },
});

export const ubelDeck = [
  { card: a_reelseiden, count: 3 },
  { card: a_cleave, count: 2 },
  { card: a_dismantle, count: 2 },
  { card: a_malevolentShrine, count: 1 },
  { card: rushdown, count: 2 },
  { card: defend, count: 1 },
  { card: recompose, count: 2 },
  { card: sorganeil, count: 1 },
  { card: empathy, count: 1 },
];

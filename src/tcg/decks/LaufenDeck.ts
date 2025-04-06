import Deck from "../deck";
import Card from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_staffStrike = new Card({
  title: "Staff Strike",
  description: ([spd, dmg]) =>
    `SPD+${spd}. Afterwards, HP-4, attack for DMG ${dmg}+SPD/6`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [2, 10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} struck with ${character.cosmetic.pronouns.possessive} staff!`,
      TCGThread.Gameroom,
    );

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.SPD / 6;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 4 });
  },
});

const a_staffBash = new Card({
  title: "Staff Bash",
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-4, DMG ${dmg}+SPD/5`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [2, 8],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} bashed ${character.cosmetic.pronouns.possessive} staff!`,
      TCGThread.Gameroom,
    );

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.SPD / 5;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 4 });
  },
});

export const a_whip = new Card({
  title: "Whip",
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-5, DMG ${dmg}+SPD/4`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [1, 6],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} turned ${character.cosmetic.pronouns.possessive} staff into a whip!`,
      TCGThread.Gameroom,
    );

    const speed = this.calculateEffectValue(this.effects[0]);
    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.SPD / 4;
    character.adjustStat(speed, StatsEnum.SPD);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });
  },
});

export const hide = new Card({
  title: "Hide",
  description: ([spd, spdBuff, hp]) =>
    `SPD+${spd}. Increases SPD by an additional ${spdBuff} until the end of the turn. Heal ${hp} HP.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 7, 12],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} hid behind coverings!`,
      TCGThread.Gameroom,
    );

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);
    const spdIncreaseTemp = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(spdIncreaseTemp, StatsEnum.SPD);

    character.timedEffects.push(
      new TimedEffect({
        name: "Hide",
        description: `Increases SPD by ${spdIncreaseTemp} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-1 * spdIncreaseTemp, StatsEnum.SPD);
        },
      }),
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.HP,
    );
  },
});

export const a_supersonicStrike = new Card({
  title: "Supersonic Strike",
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-7, DMG ${dmg}+SPD/3`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} struck at supersonic speed!`,
      TCGThread.Gameroom,
    );

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.SPD / 3;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 7 });
  },
});

const quickDodge = new Card({
  title: "Quick Dodge",
  description: ([spd, spdBuff]) =>
    `Priority+2. SPD+${spd}. Increases SPD by an additional ${spdBuff} until the end of the turn.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [5, 25],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} dodged away!`, TCGThread.Gameroom);

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);
    const spdIncreaseTemp = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(spdIncreaseTemp, StatsEnum.SPD);

    character.timedEffects.push(
      new TimedEffect({
        name: "Quick Dodge",
        description: `Increases SPD by ${spdIncreaseTemp} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-1 * spdIncreaseTemp, StatsEnum.SPD);
        },
      }),
    );
  },
});

const parry = new Card({
  title: "Parry",
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} switched to a parrying stance!`,
      TCGThread.Gameroom,
    );

    const defIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defIncrease, StatsEnum.DEF);

    character.timedEffects.push(
      new TimedEffect({
        name: "Parry",
        description: `Increases DEF by ${defIncrease} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-1 * defIncrease, StatsEnum.DEF);
        },
      }),
    );
  },
});

export const jilwer = new Card({
  title: "Jilwer",
  description: ([spd]) =>
    `Increases SPD by ${spd} for 2 turns. At the end of every turn, HP-10.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [50],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} used Jilwer!`, TCGThread.Gameroom);

    const turnCount = 2;
    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    character.timedEffects.push(
      new TimedEffect({
        name: "Jilwer",
        description: `Increases SPD by ${spdIncrease} for ${turnCount} turns.`,
        turnDuration: turnCount,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} tires ${character.cosmetic.pronouns.reflexive} out.`,
            TCGThread.Gameroom,
          );
          character.adjustStat(-10, StatsEnum.HP);
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} exits ${character.cosmetic.pronouns.possessive} Jilwer state.`,
            TCGThread.Gameroom,
          );
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
        },
      }),
    );
  },
});

export const laufenDeck = [
  { card: a_staffStrike, count: 2 },
  { card: a_staffBash, count: 2 },
  { card: a_whip, count: 2 },
  { card: hide, count: 2 },
  { card: a_supersonicStrike, count: 2 },
  { card: quickDodge, count: 2 },
  { card: parry, count: 1 },
  { card: jilwer, count: 2 },
];

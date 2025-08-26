import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const a_staffStrike = new Card({
  title: "Staff Strike",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) =>
    `SPD+${spd}. Afterwards, DMG ${dmg}+SPD/8 with SPDDiff% Pierce (max: 100%).`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 7],
  hpCost: 5,
  cosmetic: {
    cardGif: mediaLinks.laufen_staffStrike_gif,
  },
  cardAction: function (
    this: Card,
    {
      name,
      sendToGameroom,
      calcEffect,
      selfStats,
      opponentStats,
      possessive,
      flatAttack,
      selfStat,
    }
  ) {
    sendToGameroom(`${name} struck with ${possessive} staff!`);
    selfStat(0, StatsEnum.SPD);

    const damage = calcEffect(1) + selfStats.SPD / 8;

    const spdDiffPercentage = (selfStats.SPD - opponentStats.SPD) / 100;
    const pierceFactor = Math.min(Math.max(spdDiffPercentage, 0), 1);
    flatAttack(damage, pierceFactor);
  },
});

const a_staffBash = new Card({
  title: "Staff Bash",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) =>
    `SPD+${spd}. Afterwards, DMG ${dmg}+SPD/6 with (SPDDiff / 2)% Pierce (max: 50%).`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [2, 8],
  hpCost: 5,
  cosmetic: {
    cardGif: mediaLinks.laufen_staffBash_gif,
  },
  cardAction: function (
    this: Card,
    {
      name,
      sendToGameroom,
      calcEffect,
      selfStats,
      opponentStats,
      possessive,
      flatAttack,
      selfStat,
    }
  ) {
    sendToGameroom(`${name} bashed ${possessive} staff!`);
    selfStat(0, StatsEnum.SPD);

    const damage = calcEffect(1) + selfStats.SPD / 6;
    const spdDiffPercentage = (selfStats.SPD - opponentStats.SPD) / 100;
    const pierceFactor = Math.min(Math.max(spdDiffPercentage / 2, 0), 0.5);
    flatAttack(damage, pierceFactor);
  },
});

export const a_whip = new Card({
  title: "Whip",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, DMG ${dmg}+SPD/5.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [2, 9],
  hpCost: 5,
  cosmetic: {
    cardGif: mediaLinks.laufen_whip_gif,
  },
  cardAction: function (
    this: Card,
    {
      sendToGameroom,
      name,
      possessive,
      selfStats,
      calcEffect,
      selfStat,
      flatAttack,
    }
  ) {
    sendToGameroom(`${name} turned ${possessive} staff into a whip!`);
    selfStat(0, StatsEnum.SPD);
    const damage = calcEffect(1) + selfStats.SPD / 5;
    flatAttack(damage);
  },
});

export const a_supersonicStrike = new Card({
  title: "Supersonic Strike",
  description: ([dmg]) => `DMG ${dmg}+SPD/4.`,
  emoji: CardEmoji.LAUFEN_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [10],
  hpCost: 5,
  cosmetic: {
    cardGif: mediaLinks.laufen_supersonicStrike_gif,
  },
  cardAction: function (
    this: Card,
    { sendToGameroom, name, calcEffect, selfStats, flatAttack }
  ) {
    sendToGameroom(`${name} struck at supersonic speed!`);
    const damage = calcEffect(0) + selfStats.SPD / 4;
    flatAttack(damage);
  },
});

export const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, hp]) => `SPD+${spd}. Heal ${hp} HP.`,
  emoji: CardEmoji.DONUT_CARD,
  effects: [2, 7],
  cosmetic: {
    cardGif: mediaLinks.laufen_hide_gif,
  },
  cardAction: function (this: Card, { sendToGameroom, name, selfStat }) {
    sendToGameroom(`${name} hid behind coverings!`);
    selfStat(0, StatsEnum.SPD);
    selfStat(1, StatsEnum.HP);
  },
});

const quickDodge = new Card({
  title: "Quick Dodge",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, spdBuff]) =>
    `SPD+${spd}. Increases SPD by an additional ${spdBuff} until the end of the turn.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [5, 35],
  priority: 2,
  cosmetic: {
    cardGif: mediaLinks.laufen_quickDodge_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, selfStat, calcEffect }
  ) {
    sendToGameroom(`${name} dodged away!`);
    selfStat(0, StatsEnum.SPD);
    selfStat(1, StatsEnum.SPD);
    const tempSpd = calcEffect(1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Quick Dodge",
        description: `Increases SPD by ${tempSpd} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-1 * tempSpd, StatsEnum.SPD, game);
        },
      })
    );
  },
});

export const parry = new Card({
  title: "Parry",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [20],
  priority: 2,
  cosmetic: {
    cardGif: mediaLinks.laufen_parrry_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, calcEffect, selfStat }
  ) {
    sendToGameroom(`${name} switched to a parrying stance!`);
    selfStat(0, StatsEnum.TrueDEF);
    const tempDef = calcEffect(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Parry",
        description: `Increases TrueDEF by ${tempDef} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-1 * tempDef, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

export const jilwer = new Card({
  title: "Jilwer",
  cardMetadata: { nature: Nature.Util },
  description: ([spd]) =>
    `Increases SPD by ${spd} for 2 turns. At the end of every turn, HP-10.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [50],
  cosmetic: {
    cardGif: mediaLinks.laufen_jilwer_gif,
  },
  cardAction: function (
    this: Card,
    {
      game,
      self,
      name,
      sendToGameroom,
      calcEffect,
      selfStat,
      reflexive,
      possessive,
    }
  ) {
    const turnCount = 2;
    sendToGameroom(`${name} cast Jilwer!`);
    selfStat(0, StatsEnum.SPD);
    const tempSpd = calcEffect(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Jilwer",
        description: `Increases SPD by ${tempSpd} for ${turnCount} turns.`,
        turnDuration: turnCount,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${name} tires ${reflexive} out.`,
            TCGThread.Gameroom
          );
          self.adjustStat(-10, StatsEnum.HP, game);
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${name} exits ${possessive} Jilwer state.`,
            TCGThread.Gameroom
          );
          self.adjustStat(-1 * tempSpd, StatsEnum.SPD, game);
        },
      })
    );
  },
});

const laufenDeck = [
  { card: a_staffStrike, count: 2 },
  { card: a_staffBash, count: 2 },
  { card: a_whip, count: 2 },
  { card: hide, count: 2 },
  { card: a_supersonicStrike, count: 2 },
  { card: quickDodge, count: 2 },
  { card: parry, count: 2 },
  { card: jilwer, count: 2 },
];

export default laufenDeck;

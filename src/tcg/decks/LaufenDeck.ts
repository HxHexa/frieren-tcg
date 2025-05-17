import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

const a_staffStrike = new Card({
  title: "Staff Strike",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) =>
    `SPD+${spd}. Afterwards, HP-2, attack for DMG ${dmg}+SPD/7`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 7],
  hpCost: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365418943023681656/GIF_0570739142.gif?ex=681088bc&is=680f373c&hm=11d929f2c7b8bbc30b003a0d981cf02eb802b3651ba64f281ca1f5e0fa36b358&",
  },
  cardAction: function (
    this: Card,
    {
      name,
      sendToGameroom,
      calcEffect,
      selfStats,
      possessive,
      flatAttack,
      selfStat,
    }
  ) {
    sendToGameroom(`${name} struck with ${possessive} staff!`);
    selfStat(0, StatsEnum.SPD);
    const damage = calcEffect(1) + selfStats.SPD / 7;
    flatAttack(damage, this.hpCost);
  },
});

const a_staffBash = new Card({
  title: "Staff Bash",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-3, DMG ${dmg}+SPD/6`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [2, 8],
  hpCost: 3,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365418943023681656/GIF_0570739142.gif?ex=681088bc&is=680f373c&hm=11d929f2c7b8bbc30b003a0d981cf02eb802b3651ba64f281ca1f5e0fa36b358&",
  },
  cardAction: function (
    this: Card,
    {
      name,
      sendToGameroom,
      calcEffect,
      selfStats,
      possessive,
      flatAttack,
      selfStat,
    }
  ) {
    sendToGameroom(`${name} bashed ${possessive} staff!`);
    selfStat(0, StatsEnum.SPD);
    const damage = calcEffect(1) + selfStats.SPD / 6;
    flatAttack(damage, this.hpCost);
  },
});

export const a_whip = new Card({
  title: "Whip",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-4, DMG ${dmg}+SPD/5`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [1, 9],
  hpCost: 4,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365419009721499718/GIF_3626022317.gif?ex=681088cc&is=680f374c&hm=838847fac81db2afc9448524255aceece7c3015a4af205b3014cd79ba565380c&",
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
    flatAttack(damage, this.hpCost);
  },
});

export const a_supersonicStrike = new Card({
  title: "Supersonic Strike",
  description: ([dmg]) => `DMG ${dmg}+SPD/4`,
  emoji: CardEmoji.LAUFEN_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [10],
  hpCost: 5,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1366373963789242388/GIF_0816288304-ezgif.com-optimize.gif?ex=6810b66a&is=680f64ea&hm=04b17a787656912d7075211221d149c8eaca57ca5ca916c27ab634fedaa75fb0&",
  },
  cardAction: function (
    this: Card,
    { sendToGameroom, name, calcEffect, selfStats, flatAttack }
  ) {
    sendToGameroom(`${name} struck at supersonic speed!`);
    const damage = calcEffect(0) + selfStats.SPD / 4;
    flatAttack(damage, this.hpCost);
  },
});

export const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, hp]) => `SPD+${spd}. Heal ${hp} HP.`,
  emoji: CardEmoji.DONUT_CARD,
  effects: [2, 7],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365422814097707120/GIF_3467240538.gif?ex=68108c57&is=680f3ad7&hm=afdbfcbce169548db1583e2f07027c57cf975b395500daee05e77e21a6b96b48&",
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
  effects: [3, 27],
  priority: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365419393307377684/GIF_1047990200.gif?ex=68108927&is=680f37a7&hm=f99fc20e4da10efce076e95809cf6f4349da36e3fdd8600003877c1589a37ea6&",
  },
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, selfStat, calcEffect }
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
          self.adjustStat(-1 * tempSpd, StatsEnum.SPD);
        },
      })
    );
  },
});

export const parry = new Card({
  title: "Parry",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) => `Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [20],
  priority: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365423837218472137/GIF_2008541989.gif?ex=68108d4b&is=680f3bcb&hm=886ee4f02a75662b1f11b3b64fbe46edada132bdffb20d022907d8df3ba15a33&",
  },
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, calcEffect, selfStat }
  ) {
    sendToGameroom(`${name} switched to a parrying stance!`);
    selfStat(0, StatsEnum.DEF);
    const tempDef = calcEffect(1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Parry",
        description: `Increases DEF by ${tempDef} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-1 * tempDef, StatsEnum.DEF);
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
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1363008456306725004/Jilwer.gif?ex=6807c3cb&is=6806724b&hm=21c109a6e16515d4ee652bb3d730625a7dda49bacb56ad286a0b303d39c26d72&",
  },
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, calcEffect, selfStat, reflexive, possessive }
  ) {
    const turnCount = 2;
    sendToGameroom(`${name} cast Jilwer!`);
    selfStat(0, StatsEnum.SPD);
    const tempSpd = calcEffect(1);

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
          self.adjustStat(-10, StatsEnum.HP);
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${name} exits ${possessive} Jilwer state.`,
            TCGThread.Gameroom
          );
          self.adjustStat(-1 * tempSpd, StatsEnum.SPD);
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

import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "@tcg/formatting/mediaLinks";

export const a_zoltraak = new Card({
  title: "Offensive Magic Analysis: Zoltraak",
  cardMetadata: { nature: Nature.Attack, postAnalysis: 1 },
  description: ([dmg]) =>
    `DMG ${dmg}. 1 Analysis stacks will be gained after attack.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.zoltraak_image,
    cardGif: mediaLinks.zoltraak_gif,
  },
  effects: [8],
  cardAction: function (this: Card, { sendToGameroom, name, basicAttack }) {
    sendToGameroom(`${name} fired Zoltraak!`);
    basicAttack(0, this.hpCost);
  },
});

export const fieldOfFlower = new Card({
  title: "Spell to make a Field of Flowers",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 3 turn ends, heal ${endHp}.`,
  cosmetic: {
    cardGif: mediaLinks.fieldOfFlowers_gif,
    // mediaLinks.fieldOfFlowers_image_old
    cardImageUrl: mediaLinks.fieldOfFlowers_image,
  },
  emoji: CardEmoji.FLOWER_FIELD,
  effects: [5, 3],
  cardAction: function (
    this: Card,
    { self, name, selfStat, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} conjured a field of flowers!`);

    selfStat(0, StatsEnum.HP);
    const endOfTurnHealing = calcEffect(1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `The Field of Flowers soothes ${name}.`,
            TCGThread.Gameroom
          );
          game.characters[characterIndex].adjustStat(
            endOfTurnHealing,
            StatsEnum.HP
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push("The Field of Flowers fades.", TCGThread.Gameroom);
        },
      })
    );
  },
});

export const a_judradjim = new Card({
  title: "Destructive Lightning: Judradjim",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.judradjim_image,
    cardGif: mediaLinks.judradjim_gif,
  },
  effects: [13],
  hpCost: 7,
  cardAction: function (this: Card, { name, sendToGameroom, basicAttack }) {
    sendToGameroom(`${name} sent forth Judradjim!`);
    basicAttack(0, this.hpCost);
  },
});

export const a_vollzanbel = new Card({
  title: "Hellfire Summoning: Vollzanbel",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.vollzanbel_image,
    cardGif: mediaLinks.vollzanbel_gif,
  },
  effects: [18],
  hpCost: 10,
  cardAction: function (this: Card, { name, sendToGameroom, basicAttack }) {
    sendToGameroom(`${name} summoned Vollzanbel!`);
    basicAttack(0, 10);
  },
});

export const barrierMagicAnalysis = new Card({
  title: "Barrier Magic Analysis",
  cardMetadata: { nature: Nature.Util, analysis: 2 },
  description: ([atk, spd, def]) =>
    `ATK+${atk}. SPD+${spd}. Opponent's DEF-${def}`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.barrierAnalysis_image,
    cardGif: mediaLinks.barrierAnalysis_gif,
  },
  effects: [2, 1, 1],
  cardAction: function (
    this: Card,
    { name, sendToGameroom, selfStat, opponentStat }
  ) {
    sendToGameroom(`${name} analyzed the opponent's defense!`);
    selfStat(0, StatsEnum.ATK);
    selfStat(1, StatsEnum.SPD);
    opponentStat(2, StatsEnum.DEF, -1);
  },
});

export const demonMagicAnalysis = new Card({
  title: "Demon Magic Analysis",
  cardMetadata: { nature: Nature.Util, analysis: 2 },
  description: ([atk, spd, def]) => `ATK+${atk}. SPD+${spd}. DEF+${def}.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.demonAnalysis_image,
    cardGif: mediaLinks.demonAnalysis_gif,
  },
  effects: [2, 2, 1],
  cardAction: function (this: Card, { name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} analyzed ancient demon's magic!`);
    selfStat(0, StatsEnum.ATK);
    selfStat(1, StatsEnum.SPD);
    selfStat(2, StatsEnum.DEF);
  },
});

export const ordinaryDefensiveMagic = new Card({
  title: "Ordinary Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) => `Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.ordinaryDefensiveMagic_image,
    cardGif: mediaLinks.ordinaryDefensiveMagic_gif,
  },
  effects: [20],
  priority: 2,
  cardAction: function (
    this: Card,
    { name, self, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} cast ordinary defensive magic!`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.DEF);

    self.timedEffects.push(
      new TimedEffect({
        name: "Ordinary Defensive Magic",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_theHeightOfMagicBase = new Card({
  title: `"The Height of Magic"`,
  description: ([dmg]) =>
    `When used with HP <= 25, Priority+1. Strike for DMG ${dmg}. Afterward, decreases DEF and SPD by 20, and set HP to 1. Treat this card as "Spell to make a Field of Flowers" when used with HP > 25.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.heightOfMagic_image,
    cardGif: mediaLinks.heightOfMagic_gif,
  },
  cardMetadata: { nature: Nature.Attack, signature: true },
  priority: 1,
  effects: [30],
  cardAction: function (
    this: Card,
    { self, name, selfStats, sendToGameroom, basicAttack }
  ) {
    sendToGameroom(`${name} used "The Height of Magic"`);

    if (selfStats.HP > 25) {
      sendToGameroom(`${name}'s HP is greater than 25. The move failed!`);
      return;
    }

    sendToGameroom("The Height of Magic is on display.");
    basicAttack(0, 0);

    self.adjustStat(-20, StatsEnum.DEF);
    self.adjustStat(-20, StatsEnum.SPD);
    self.setStat(1, StatsEnum.HP);
  },
});

export const a_theHeightOfMagic = new Card({
  ...a_theHeightOfMagicBase,
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP > 25) {
      return new Card({
        ...fieldOfFlower,
        description: ([hp, endHp]) =>
          `This card is treated as "The Height of Magic" if your HP is <= 25. Heal ${hp} HP. At the next 3 turn ends, heal ${endHp}.`,
        empowerLevel: this.empowerLevel,
        priority: 0,
      });
    } else {
      return new Card({
        ...a_theHeightOfMagicBase,
        empowerLevel: this.empowerLevel,
        priority: 1,
      });
    }
  },
});

const frierenDeck = [
  { card: a_zoltraak, count: 2 },
  { card: a_judradjim, count: 2 },
  { card: a_vollzanbel, count: 2 },
  { card: barrierMagicAnalysis, count: 3 },
  { card: demonMagicAnalysis, count: 2 },
  { card: ordinaryDefensiveMagic, count: 2 },
  { card: fieldOfFlower, count: 2 },
  { card: a_theHeightOfMagic, count: 1 },
];

export default frierenDeck;

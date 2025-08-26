import Card, { Nature } from "@tcg/card";
import {
  serie_offensiveMagic_common,
  serie_offensiveMagic_rare,
  serie_offensiveMagic_unusual,
  serie_utilityMagic_recovery,
  serie_utilityMagic_tactics,
} from "./utilDecks/serieMagic";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { fieldOfFlower } from "./FrierenDeck";
import { CardEmoji } from "@tcg/formatting/emojis";
import { ancientBarrierMagic } from "./utilDecks/serieSignature";
import CommonCardAction from "../util/commonCardActions";
import mediaLinks from "../formatting/mediaLinks";

export const a_livingGrimoireOffenseCommon = new Card({
  title: "Living Grimoire: Offense Chapter. 3rd Class Magic Section.",
  cardMetadata: { nature: Nature.Attack },
  description: () => "Use a random common offensive magic.",
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_livingGrimoireOffenseCommon_image,
  },
  effects: [],
  cardAction: function (this: Card, context) {
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_offensiveMagic_common,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
  },
});

export const a_livingGrimoireOffenseRare = new Card({
  title: "Living Grimoire: Offense Chapter. 1st Class Magic Section.",
  cardMetadata: { nature: Nature.Attack },
  description: () => "Use a random rare offensive magic.",
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_livingGrimoireOffenseRare_image,
  },
  effects: [],
  cardAction: function (this: Card, context) {
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_offensiveMagic_rare,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
  },
});

export const a_livingGrimoireOffenseUnusual = new Card({
  title: "Living Grimoire: Offense Chapter. Great Mage's Magic Section.",
  cardMetadata: { nature: Nature.Attack },
  description: () => "Use a random unusual offensive magic.",
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_livingGrimoireOffenseUnusual_image,
  },
  effects: [],
  cardAction: function (this: Card, context) {
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_offensiveMagic_unusual,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
  },
});

export const a_livingGrimoireUtilityTactics = new Card({
  title: "Living Grimoire: Utility Chapter. Tactics Section.",
  cardMetadata: { nature: Nature.Util },
  description: () => "Use a random stats adjusting utility magic.",
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_livingGrimoireUtilityTactics_image,
  },
  effects: [],
  cardAction: function (this: Card, context) {
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_utilityMagic_tactics,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
  },
});

export const a_livingGrimoireUtilityRecovery = new Card({
  title: "Living Grimoire: Utility Chapter. Recovery Section.",
  cardMetadata: { nature: Nature.Util },
  description: () => "Use a random HP recovery utility magic.",
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_livingGrimoireUtilityRecovery_image,
  },
  effects: [],
  cardAction: function (this: Card, context) {
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_utilityMagic_recovery,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
  },
});

export const mock = new Card({
  title: "Mock",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, spd, def]) =>
    `HP+${hp}. SPD+${spd}. Opponent's DEF-${def}.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_mock_image,
  },
  effects: [3, 2, 1],
  cardAction: function (
    this: Card,
    { name, sendToGameroom, selfStat, opponentStat }
  ) {
    sendToGameroom(`${name} mocked the opponent.`);

    selfStat(0, StatsEnum.HP);
    selfStat(1, StatsEnum.SPD);
    opponentStat(2, StatsEnum.DEF, -1);
  },
});

export const basicDefensiveMagic = new Card({
  title: "Basic Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_basicDefensiveMagic_image,
  },
  effects: [20],
  priority: 2,
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} cast a basic defensive magic!`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Ordinary Defensive Magic",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

export const unbreakableBarrier = new Card({
  title: "Unbreakable Barrier",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, oppSpd]) =>
    `HP-2 at the end of the next 5 turns. ATK+${atk}, DEF+${def} and Opponent's SPD-${oppSpd} for 5 turns.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_unbreakableBarrier_image,
  },
  effects: [5, 5, 5],
  hpCost: 5,
  cardAction: function (
    this: Card,
    {
      game,
      self,
      name,
      opponent,
      sendToGameroom,
      selfStat,
      opponentStat,
      calcEffect,
    }
  ) {
    sendToGameroom(`${name} deployed an unbreakable barrier.`);

    const atkBuff = calcEffect(0);
    const defBuff = calcEffect(1);
    const spdDebuff = calcEffect(2);

    selfStat(0, StatsEnum.ATK);
    selfStat(1, StatsEnum.DEF);
    opponentStat(2, StatsEnum.SPD, -1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Unbreakable Barrier",
        description: `ATK+${atkBuff}. DEF+${defBuff}, Opponent's SPD -${spdDebuff} for 5 turns.`,
        turnDuration: 5,
        priority: -1,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex) => {
          sendToGameroom("The unbreakable barrier looms...");
          self.adjustStat(-2, StatsEnum.HP, game);
        },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          sendToGameroom("The barrier dissipated");
          self.adjustStat(-1 * atkBuff, StatsEnum.ATK, game);
          self.adjustStat(-1 * defBuff, StatsEnum.DEF, game);
          opponent.adjustStat(spdDebuff, StatsEnum.SPD, game);
        },
      })
    );
  },
});

const serieDeck = [
  { card: a_livingGrimoireOffenseCommon, count: 3 },
  { card: a_livingGrimoireOffenseRare, count: 2 },
  { card: a_livingGrimoireOffenseUnusual, count: 1 },
  { card: a_livingGrimoireUtilityTactics, count: 1 },
  { card: a_livingGrimoireUtilityRecovery, count: 1 },
  { card: fieldOfFlower, count: 1 },
  { card: mock, count: 2 },
  { card: basicDefensiveMagic, count: 2 },
  { card: unbreakableBarrier, count: 2 },
  { card: ancientBarrierMagic, count: 1 },
];

export default serieDeck;

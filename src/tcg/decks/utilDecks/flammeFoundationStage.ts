import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import { StatsEnum } from "@tcg/stats";
import { incantationIncreaseSigil } from "../FlammeDeck";
import { GameMessageContext } from "@tcg/gameContextProvider";
import {
  serie_offensiveMagic_rare,
  serie_offensiveMagic_unusual,
} from "./serieMagic";
import CommonCardAction from "@tcg/util/commonCardActions";

export const a_foundationOfHumanitysMagicBase = new Card({
  title: "Foundation of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Deal ${stat} DMG. Gain 5 Sigils.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [1],
  cardAction: function (
    this: Card,
    { self, messageCache, sendToGameroom, selfStat, basicAttack }
  ) {
    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);
    basicAttack(0);
    sendToGameroom(`Humanity's Magic is still in its infancy.`);
    incantationIncreaseSigil(self, messageCache, 5);
  },
});

export const a_firstPageOfHumanitysMagicBase = new Card({
  title: "First Page of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat, dmg]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. DMG ${dmg}. Gain 3 Sigils.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [2, 8],
  hpCost: 4,
  cardAction: function (
    this: Card,
    { selfStat, self, name, sendToGameroom, messageCache, basicAttack }
  ) {
    sendToGameroom(`${name} developed a basic offensive spell.`);
    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);
    basicAttack(1);
    incantationIncreaseSigil(self, messageCache, 3);
  },
});

export const a_secondPageOfHumanitysMagicBase = new Card({
  title: "Second Page of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Use a random rare offensive magic. Gain 2 Sigils.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [2],
  cardAction: function (this: Card, context: GameMessageContext) {
    const { selfStat, self, messageCache } = context;
    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_offensiveMagic_rare,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
    incantationIncreaseSigil(self, messageCache, 2);
  },
});

export const a_thirdPageOfHumanitysMagicBase = new Card({
  title: "Third Page of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat, dmg]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Deal ${dmg} DMG. Gain 1 Sigil.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [3, 17],
  hpCost: 10,
  cardAction: function (
    this: Card,
    { name, sendToGameroom, selfStat, basicAttack, self, messageCache }
  ) {
    sendToGameroom(`${name} called upon Hellfire.`);
    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);
    basicAttack(1);
    incantationIncreaseSigil(self, messageCache, 1);
  },
});

export const a_lastPageOfHumanitysMagicBase = new Card({
  title: "Last Page of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Use a random unusual offensive magic.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [3],
  cardAction: function (this: Card, context: GameMessageContext) {
    const { selfStat } = context;
    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_offensiveMagic_unusual,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
  },
});

export const flammeFoundationStage = [
  a_foundationOfHumanitysMagicBase,
  a_firstPageOfHumanitysMagicBase,
  a_secondPageOfHumanitysMagicBase,
  a_thirdPageOfHumanitysMagicBase,
  a_lastPageOfHumanitysMagicBase,
];

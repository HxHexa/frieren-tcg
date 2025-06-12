import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import { StatsEnum } from "@tcg/stats";
import { incantationIncreaseSigil } from "../FlammeDeck";
import { GameMessageContext } from "@tcg/gameContextProvider";
import { serie_offensiveMagic_rare } from "./serieMagic";
import CommonCardAction from "@tcg/util/commonCardActions";

export const a_foundationOfHumanitysMagicBase = new Card({
  title: "Foundation of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Deal ${stat} DMG.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [1],
  cardAction: function (
    this: Card,
    { game, sendToGameroom, selfStat, basicAttack }
  ) {
    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);
    basicAttack(0);
    sendToGameroom(`Humanity's Magic is still in its infancy.`);
  },
});

export const a_firstPageOfHumanitysMagicBase = new Card({
  title: "First Page of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat, dmg]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. DMG ${dmg}. Gain 1 Sigil.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [2, 7],
  hpCost: 4,
  cardAction: function (
    this: Card,
    { game, selfStat, self, name, sendToGameroom, messageCache, basicAttack }
  ) {
    sendToGameroom(`${name} developed a basic offensive spell.`);
    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);
    basicAttack(1);
    incantationIncreaseSigil(self, messageCache, 1);
  },
});

export const a_secondPageOfHumanitysMagicBase = new Card({
  title: "Second Page of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Use a random rare offensive magic.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [2],
  cardAction: function (this: Card, context: GameMessageContext) {
    const { game, selfStat } = context;
    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);
    const newCard = CommonCardAction.useRandomCard({
      cardPool: serie_offensiveMagic_rare,
      empowerLevel: this.empowerLevel,
      context,
    });
    newCard.cardAction(context.duplicateContext(newCard));
  },
});

export const a_lastPageOfHumanitysMagicBase = new Card({
  title: "Last Page of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat, dmg]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Deal ${dmg} DMG.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [3, 17],
  hpCost: 10,
  cardAction: function (
    this: Card,
    { game, name, sendToGameroom, selfStat, basicAttack }
  ) {
    sendToGameroom(`${name} called upon Hellfire.`);
    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);
    basicAttack(1);
  },
});

export const a_pinnacleOfHumanitysMagicBase = new Card({
  title: "Pinnacle of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Deal ${stat} DMG.`,
  emoji: CardEmoji.FLAMME_CARD,
  priority: 100,
  effects: [100],
  cardAction: function (
    this: Card,
    { game, sendToGameroom, selfStat, flatSelfStat, basicAttack }
  ) {
    sendToGameroom(`The Pinnacle of Humanity's Magic is on display.`);
    flatSelfStat(1, StatsEnum.Ability, game);
    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);
    basicAttack(0);
  },
});

export const flammeFoundationStage = [
  a_foundationOfHumanitysMagicBase,
  a_firstPageOfHumanitysMagicBase,
  a_secondPageOfHumanitysMagicBase,
  a_lastPageOfHumanitysMagicBase,
  a_pinnacleOfHumanitysMagicBase,
];

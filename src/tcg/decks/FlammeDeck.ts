import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import {
  FlammeResearch,
  FlammeTheory,
} from "../additionalMetadata/gameAdditionalMetadata";
import { CharacterName } from "../characters/metadata/CharacterName";
import mediaLinks from "../formatting/mediaLinks";
import {
  a_foundationOfHumanitysMagicBase,
  a_firstPageOfHumanitysMagicBase,
  a_secondPageOfHumanitysMagicBase,
  a_thirdPageOfHumanitysMagicBase,
  a_lastPageOfHumanitysMagicBase,
} from "./utilDecks/flammeFoundationStage";
import incantationFieldOfFlowers from "./utilDecks/flammeSignature";

// const incantationSeductionTechnique = new Card({
//   title: "Incantation: Seduction Technique",
//   cardMetadata: { nature: Nature.Util },
//   description: ([hp, oppAtkDecrease, oppSpdDecrease]) =>
//     `Heal ${hp} HP. Opp's ATK-${oppAtkDecrease}. Opp's SPD-${oppSpdDecrease}.`,
//   emoji: CardEmoji.FLAMME_CARD,
//   effects: [3, 2, 1],
//   cosmetic: {
//     cardGif: mediaLinks.flamme_seduction_gif,
//   },
//   cardAction: function (this: Card, context) {
//     const { name, sendToGameroom, selfStat, opponentStat } = context;
//     sendToGameroom(`${name} showcases her seduction technique.`);
//     selfStat(0, StatsEnum.HP);
//     opponentStat(1, StatsEnum.ATK, -1);
//     opponentStat(2, StatsEnum.SPD, -1);
//   },
// });

const milleniumBarrier = new Card({
  title: "Millenium Barrier",
  cardMetadata: { nature: Nature.Util },
  description: ([def, spd, hp]) =>
    `DEF+${def} and SPD+${spd} for 5 turns. If Theory of Irreversibilty is active, all opponent's stat increases are set to 0. While active, heal ${hp}HP at each turn's end.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 5, 3],
  hpCost: 15,
  cardAction: function (
    this: Card,
    { self, game, selfIndex, sendToGameroom, calcEffect, flatSelfStat }
  ) {
    sendToGameroom(`A barrier blankets the land.`);
    const defIncrease = calcEffect(0);
    const spdIncrease = calcEffect(1);
    flatSelfStat(defIncrease, StatsEnum.DEF);
    flatSelfStat(spdIncrease, StatsEnum.SPD);

    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.MilleniumBarrier
    ] = true;

    const endOfTurnHealing = calcEffect(2);
    self.timedEffects.push(
      new TimedEffect({
        name: "Millenium Barrier",
        description: `DEF+${defIncrease}. SPD+${spdIncrease}. If Theory of Irreversibilty is active, all opponent's stat increases are set to 0. HP+${endOfTurnHealing} at turn end.`,
        turnDuration: 5,
        metadata: { removableBySorganeil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        priority: -2,
        endOfTurnAction: function (this: TimedEffect, _game, _characterIndex) {
          flatSelfStat(endOfTurnHealing, StatsEnum.HP);
        },
        endOfTimedEffectAction: function () {
          if (game.additionalMetadata.flammeTheory.Irreversibility) {
            sendToGameroom("The legacy of someone long gone remains unbroken.");
          } else {
            sendToGameroom("The barrier crumbles. It is yet strong enough.");
          }
          flatSelfStat(defIncrease, StatsEnum.DEF, -1);
          flatSelfStat(spdIncrease, StatsEnum.SPD, -1);
          game.additionalMetadata.flammeResearch[selfIndex][
            FlammeResearch.MilleniumBarrier
          ] = false;
        },
      })
    );
  },
});

const thousandYearSanctuary = new Card({
  title: "Thousand Year Sanctuary",
  cardMetadata: { nature: Nature.Util },
  description: ([oppAtkDecrease, oppSpdDecrease, hp]) =>
    `Opp's ATK-${oppAtkDecrease} and SPD-${oppSpdDecrease}. If Theory of Balance is active, the turn count stops increasing. While active, heal ${hp}HP at each turn's end.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 5, 3],
  hpCost: 15,
  cosmetic: {
    cardGif: mediaLinks.flamme_sanctuary_gif,
  },
  cardAction: function (
    this: Card,
    {
      self,
      game,
      selfIndex,
      name,
      sendToGameroom,
      calcEffect,
      flatOpponentStat,
      flatSelfStat,
    }
  ) {
    sendToGameroom(`${name} raises a towering sanctuary.`);
    const oppAtkDecrease = calcEffect(0);
    const oppSpdDecrease = calcEffect(1);
    flatOpponentStat(oppAtkDecrease, StatsEnum.ATK, -1);
    flatOpponentStat(oppSpdDecrease, StatsEnum.SPD, -1);

    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.ThousandYearSanctuary
    ] = true;

    const endOfTurnHealing = calcEffect(2);
    self.timedEffects.push(
      new TimedEffect({
        name: "Thousand Year Sanctuary",
        description: `Opp's ATK-${oppAtkDecrease}. Opp's SPD-${oppSpdDecrease}. If Theory of Balance is active, the turn count stops increasing. HP+${endOfTurnHealing} at turn end.`,
        turnDuration: 5,
        metadata: { removableBySorganeil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        priority: -2,
        endOfTurnAction: function (
          this: TimedEffect,
          _game,
          _characterIndex,
          _messageCache
        ) {
          flatSelfStat(endOfTurnHealing, StatsEnum.HP);
        },
        endOfTimedEffectAction: function () {
          if (game.additionalMetadata.flammeTheory.Irreversibility) {
            sendToGameroom("The sanctuary watches quietly over the land.");
          } else {
            sendToGameroom("The sanctuary collapses. It is yet strong enough.");
          }
          flatOpponentStat(oppAtkDecrease, StatsEnum.ATK);
          flatOpponentStat(oppSpdDecrease, StatsEnum.SPD);
          game.additionalMetadata.flammeResearch[selfIndex][
            FlammeResearch.ThousandYearSanctuary
          ] = false;
        },
      })
    );
  },
});

const treeOfLife = new Card({
  title: "Tree of Life",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) =>
    `Heal ${hp} HP. For the next 7 turns, roll an additional dice during card activation phase. If Theory of Prescience is active, this roll of dice will always be 5.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [10],
  cosmetic: {
    cardGif: mediaLinks.flamme_treeOfLife_gif,
  },
  cardAction: function (
    this: Card,
    { self, game, selfIndex, name, sendToGameroom, selfStat }
  ) {
    sendToGameroom(`${name} plants a sapling for someone 1000 years from now.`);
    selfStat(0, StatsEnum.HP);

    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.TreeOfLife
    ] = true;

    self.timedEffects.push(
      new TimedEffect({
        name: "Tree of Life",
        description: `Roll an additional dice during card activation phase. If Theory of Prescience is active, this roll of dice will always be 5.`,
        turnDuration: 7,
        metadata: { removableBySorganeil: true },
        priority: -2,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: function () {
          sendToGameroom("The tree stands strong and unmoving.");
          game.additionalMetadata.flammeResearch[selfIndex][
            FlammeResearch.TreeOfLife
          ] = false;
        },
      })
    );
  },
});

const flammesNote = new Card({
  title: "Flamme's Note",
  cardMetadata: { nature: Nature.Util, isFlammesNote: true },
  description: ([hp, hpSoul]) =>
    `HP+${hp}. Heal an additional ${hpSoul}HP if Theory of Soul is active. Discard a random card. If there is no Theory card in your deck, draw 1 card. Otherwise, add a random Theory card to your hand.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [6, 4],
  cosmetic: {
    cardGif: mediaLinks.flamme_flammesNotes_gif,
  },
  cardAction: function (
    this: Card,
    { self, game, name, characterName, personal, selfStat, sendToGameroom }
  ) {
    const isFlamme = characterName === CharacterName.Flamme;
    if (isFlamme) {
      sendToGameroom(`Flamme formulated a theory and notes down her research.`);
    } else {
      sendToGameroom(
        `${name} shuffles through Flamme's notes. ${name} drew 1 card.`
      );
    }
    self.discardRandomCard();
    selfStat(0, StatsEnum.HP);

    if (game.additionalMetadata.flammeTheory.Soul) {
      sendToGameroom("The souls offer a guidance.");
      selfStat(1, StatsEnum.HP);
    }

    // collect theory
    const theoriesIndices: Array<[Card[], number]> = [];
    self.deck.activePile.forEach((card, i) => {
      if (card.cardMetadata.theory) {
        theoriesIndices.push([self.deck.activePile, i]);
      }
    });
    self.deck.discardPile.forEach((card, i) => {
      if (card.cardMetadata.theory) {
        theoriesIndices.push([self.deck.discardPile, i]);
      }
    });

    if (theoriesIndices.length > 0) {
      const randomTheoryIndex = Math.floor(
        Math.random() * theoriesIndices.length
      );
      const [pile, pileIndex] = theoriesIndices[randomTheoryIndex];

      const theoryCard = pile.splice(pileIndex, 1)[0];
      sendToGameroom(`${name} formulated the **${theoryCard.title}**.`);
      self.hand.push(theoryCard);
    } else {
      sendToGameroom(
        `It doesn't seem like ${personal} found anything ${personal} doesn't already know. ${name} draws 1 card.`
      );
      self.drawCard();
    }
  },
});

const primitiveDefensiveTechnique = new Card({
  title: "Primitive Defensive Technique",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) => `TrueDEF+${def} for 1 turn.`,
  emoji: CardEmoji.FLAMME_CARD,
  priority: 2,
  effects: [20],
  cardAction: function (
    this: Card,
    { game, name, self, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} quickly put up a primitive emergency barrier.`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Primitive Defensive Technique",
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

const theoryOfIrreversibility = new Card({
  title: "Theory of Irreversibility",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `All ATK/DEF/SPD changes for both players are halved. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cosmetic: {
    cardGif: mediaLinks.flamme_theory_gif,
  },
  cardAction: function (this: Card, { game, name, sendToGameroom }) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Irreversibility]) {
      sendToGameroom(
        `${name} discovered the Theory of Irreversibility. **All ATK/DEF/SPD changes for both players are halved.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Irreversibility] = true;
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Irreversibility. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

const theoryOfBalance = new Card({
  title: "Theory of Balance",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `The Empower level for all card is now equal to the Turn Count. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cosmetic: {
    cardGif: mediaLinks.flamme_theory_gif,
  },
  cardAction: function (this: Card, { game, name, sendToGameroom }) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Balance]) {
      sendToGameroom(
        `${name} discovered the Theory of Balance. **The Empower level for all card is now equal to the Turn Count.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Balance] = true;
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Balance. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

const theoryOfPrescience = new Card({
  title: "Theory of Prescience",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `The roll of the first 4 dices for both players for which cards are active for any given turn will always be 0, 1, 2, 3. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cosmetic: {
    cardGif: mediaLinks.flamme_theory2_gif,
  },
  cardAction: function (this: Card, { game, name, sendToGameroom }) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Prescience]) {
      sendToGameroom(
        `${name} discovered the Theory of Prescience. **The roll of the first 4 dices for both players for which cards are active for any given turn will always be 0, 1, 2, 3.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Prescience] = true;
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Prescience. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

const theoryOfSoul = new Card({
  title: "Theory of Soul",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `Both players swap their own active and discard piles. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cosmetic: {
    cardGif: mediaLinks.flamme_theory2_gif,
  },
  cardAction: function (
    this: Card,
    { game, name, sendToGameroom, self, opponent }
  ) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Soul]) {
      sendToGameroom(
        `${name} discovered the Theory of Soul. **Both players swap their own active and discard piles.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Soul] = true;

      [self.deck.activePile, self.deck.discardPile] = [
        self.deck.discardPile,
        self.deck.activePile,
      ];
      [opponent.deck.activePile, opponent.deck.discardPile] = [
        opponent.deck.discardPile,
        opponent.deck.activePile,
      ];
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Soul. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

export const a_foundationOfHumanitysMagic = new Card({
  title: "Foundation of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: () =>
    "This card's effect changes based on how many Theory cards you have played.",
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.Ability === 0) {
      return new Card({
        ...a_foundationOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else if (character.stats.stats.Ability === 1) {
      return new Card({
        ...a_firstPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else if (character.stats.stats.Ability === 2) {
      return new Card({
        ...a_secondPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else if (character.stats.stats.Ability === 3) {
      return new Card({
        ...a_thirdPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_lastPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

const flammeDeck = [
  { card: a_foundationOfHumanitysMagic, count: 6 },
  { card: incantationFieldOfFlowers, count: 2 },
  { card: milleniumBarrier, count: 1 },
  { card: thousandYearSanctuary, count: 1 },
  { card: treeOfLife, count: 1 },
  { card: flammesNote, count: 3 },
  { card: primitiveDefensiveTechnique, count: 2 },
  { card: theoryOfIrreversibility, count: 1 },
  { card: theoryOfBalance, count: 1 },
  { card: theoryOfPrescience, count: 1 },
  { card: theoryOfSoul, count: 1 },
];

export default flammeDeck;

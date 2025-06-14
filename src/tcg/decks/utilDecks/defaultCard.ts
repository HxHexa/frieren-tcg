import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import { StatsEnum } from "@tcg/stats";

export default class DefaultCards {
  static readonly discardCard: Card = new Card({
    title: "Discard",
    cardMetadata: { nature: Nature.Default, hideEmpower: true },
    description: () =>
      "ATK+1. DEF+1. SPD+1. Discards all of your current active cards. Draw the same number of cards you discarded. Empower all cards in your hand afterwards.",
    effects: [],
    emoji: CardEmoji.RECYCLE,
    cardAction: ({ self, selfIndex, name, sendToGameroom, game }) => {
      self.adjustStat(1, StatsEnum.ATK, game);
      self.adjustStat(1, StatsEnum.DEF, game);
      self.adjustStat(1, StatsEnum.SPD, game);

      const handsIndicesDescending = Object.keys(
        game.additionalMetadata.currentPlayableMoves[selfIndex]
      )
        .map((stringIndex: string) => parseInt(stringIndex))
        .filter((a) => a < 6)
        .sort((a, b) => b - a);
      for (const index of handsIndicesDescending) {
        self.discardCard(index);
        self.drawCard();
      }

      self.empowerHand();
      sendToGameroom(`All cards in ${name}'s hand are empowered!`);
    },
  });

  static readonly waitCard: Card = new Card({
    title: "Wait",
    cardMetadata: { nature: Nature.Default, hideEmpower: true },
    description: () =>
      "Heals 10 HP. Empower all cards in your hand afterwards.",
    effects: [],
    emoji: CardEmoji.WAIT,
    cardAction: ({ game, name, self, sendToGameroom }) => {
      self.empowerHand();
      sendToGameroom(
        `${name} waited it out! All cards in ${name}'s hand are empowered!`
      );
      self.adjustStat(10, StatsEnum.HP, game);
    },
  });

  static readonly doNothing: Card = new Card({
    title: "Do Nothing.",
    description: () =>
      "Does nothing. Empower all cards in your hand afterwards.",
    cardMetadata: { nature: Nature.Default, hideEmpower: true },
    effects: [],
    emoji: CardEmoji.WAIT,
    cardAction: ({ self, name, sendToGameroom }) => {
      self.empowerHand();
      sendToGameroom(
        `${name} did nothing. All cards in ${name}'s hand are empowered.`
      );
    },
  });

  static readonly forfeitCard: Card = new Card({
    title: "Forfeit",
    cardMetadata: {
      nature: Nature.Default,
      hidePriority: true,
      hideEmpower: true,
    },
    description: () => "Forfeits the game.",
    effects: [],
    emoji: CardEmoji.RANDOM,
    priority: 999,
    cardAction: ({ game, selfIndex: characterIndex, name, sendToGameroom }) => {
      sendToGameroom(`${name} forfeited the game!`);
      game.additionalMetadata.forfeited[characterIndex] = true;
    },
  });
}

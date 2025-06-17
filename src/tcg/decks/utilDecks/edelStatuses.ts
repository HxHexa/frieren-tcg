import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import CommonCardAction from "@tcg/util/commonCardActions";
import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";

export const sleepy = new Card({
  title: "Sleepy",
  cardMetadata: { nature: Nature.None, temporary: true, hideEmpower: true },
  emoji: CardEmoji.EDEL_STATUS_CARD,
  description: () =>
    "If you do not play this card, remove all of your timed effects, skip next turn. This card is removed from your deck after it becomes playable, regardless of it was played.",
  effects: [],
  cardAction: function (this: Card, { name, self, sendToGameroom }) {
    sendToGameroom(`${name} was falling asleep but woke up!`);
    self.removeCard(this);
  },
  onNotPlayed: function (
    this: Card,
    { self, sendToGameroom, name, game, selfIndex, messageCache }
  ) {
    sendToGameroom(`${name} fell asleep!`);
    self.removeCard(this);
    CommonCardAction.removeCharacterTimedEffect(game, selfIndex, messageCache);
    self.skipTurn = true;
  },
});

export const mesmerized = new Card({
  title: "Mesmerized",
  cardMetadata: { nature: Nature.None, temporary: true },
  emoji: CardEmoji.EDEL_STATUS_CARD,
  description: ([hp]) =>
    `If you play this card on the first turn it is playable, it is removed from your deck. Otherwise, until the end of the game, at each turn's end, lose ${hp}HP, your opponent heals ${hp}HP, and this card can no longer be removed from your deck.`,
  effects: [2],
  cardAction: function (this: Card, { self, name, opponent, sendToGameroom }) {
    if (this.cardMetadata.temporary) {
      sendToGameroom(
        `${name} was mesmerized by ${opponent.name}'s eyes but snapped out of it!`
      );
      self.removeCard(this);
    } else {
      sendToGameroom(`${name} is already trapped in ${opponent.name}'s eyes!`);
    }
  },
  onNotPlayed: function (
    this: Card,
    { name, self, opponent, game, calcEffect, sendToGameroom }
  ) {
    sendToGameroom(`${name} was mesmerized by ${opponent.name}'s eyes!`);
    this.cardMetadata.temporary = false;
    this.description = ([hp]) =>
      ` This card cannot be removed from your deck. If it's not played, until the end of the game, at each turn's end, lose ${hp}HP, your opponent heals ${hp}HP.`;

    const hp = calcEffect(0);
    self.timedEffects.push(
      new TimedEffect({
        name: "Mesmerized",
        description: `Your opponent heals ${hp}HP and you lose ${hp}HP at each turn's end.`,
        turnDuration: game.turnCount + 1,
        metadata: { removableBySorganeil: false },
        endOfTurnAction: function (this, game, characterIndex, _messageCache) {
          const character = game.getCharacter(characterIndex);
          const opponent = game.getCharacter(1 - characterIndex);

          opponent.adjustStat(hp, StatsEnum.HP, game);
          character.adjustStat(-hp, StatsEnum.HP, game);

          this.turnDuration = game.turnCount + 1;
        },
      })
    );
  },
});

export const weakened = new Card({
  title: "Weakened",
  cardMetadata: { nature: Nature.None, temporary: true },
  emoji: CardEmoji.EDEL_STATUS_CARD,
  description: ([debuff]) =>
    `If you do not play this card, reduce ATK, DEF, SPD by ${debuff}. This card is removed from your deck after it becomes playable, regardless of it was played.`,
  effects: [2],
  cardAction: function (this: Card, { name, self, opponent, sendToGameroom }) {
    sendToGameroom(
      `${name} felt compelled by ${opponent.name} to surrender but didn't give in!`
    );
    self.removeCard(this);
  },
  onNotPlayed: function (this: Card, { self, name, selfStat, sendToGameroom }) {
    sendToGameroom(`${name} felt weakened!`);
    self.removeCard(this);

    [StatsEnum.ATK, StatsEnum.DEF, StatsEnum.SPD].forEach((stat) => {
      selfStat(0, stat, -1);
    });
  },
});

export const edelStatusCards = [sleepy, mesmerized, weakened];

import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import mediaLinks from "@tcg/formatting/mediaLinks";
import { StatsEnum } from "@tcg/stats";
import { incantationIncreaseSigil } from "../FlammeDeck";
import TimedEffect from "@tcg/timedEffect";

const incantationFieldOfFlowers = new Card({
  title: "Incantation: Field of Flowers",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. Gain 3 Sigils. At the next 3 turns' ends, heal ${endHp} HP. Gain 2 Sigils at the end of every turn.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 3],
  cosmetic: {
    cardGif: mediaLinks.flamme_fieldOfFlower_gif,
  },
  cardAction: function (
    this: Card,
    {
      game,
      self,
      name,
      sendToGameroom,
      selfStat,
      calcEffect,
      messageCache,
      flatSelfStat,
    }
  ) {
    sendToGameroom(`${name} conjured a field of flowers.`);
    selfStat(0, StatsEnum.HP, game);

    const endOfTurnHealing = calcEffect(1);
    incantationIncreaseSigil(self, messageCache, 3);

    self.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP. Gain 2 Sigils.`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          const character = game.getCharacter(characterIndex);
          sendToGameroom(`The Field of Flowers soothe ${name}.`);
          flatSelfStat(endOfTurnHealing, StatsEnum.HP, game);
          incantationIncreaseSigil(character, messageCache, 2);
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom("The Field of Flowers fade.");
        },
      })
    );
  },
});

export default incantationFieldOfFlowers;

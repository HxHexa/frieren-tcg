import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

export const ancientBarrierMagic = new Card({
  title: "Ancient Barrier Magic",
  description: ([atk, def, oppSpd]) =>
    `HP-2 at the end of the next 7 turns. ATK+${atk}, Opponent's DEF-${def} and Opponent's SPD -${oppSpd} for 7 turns.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.serie_ancientBarrierMagic_image,
    cardGif: mediaLinks.serie_ancientBarrierMagic_gif,
  },
  cardMetadata: { nature: Nature.Util, signature: true },
  effects: [5, 5, 5],
  hpCost: 5,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} expanded an ancient barrier magic.`,
      TCGThread.Gameroom
    );

    const opponent = game.getCharacter(1 - characterIndex);
    const atkBuff = this.calculateEffectValue(this.effects[0]);
    const defDebuff = this.calculateEffectValue(this.effects[1]);
    const spdDebuff = this.calculateEffectValue(this.effects[2]);

    character.adjustStat(atkBuff, StatsEnum.ATK, game);
    opponent.adjustStat(-1 * defDebuff, StatsEnum.DEF, game);
    opponent.adjustStat(-1 * spdDebuff, StatsEnum.SPD, game);

    character.timedEffects.push(
      new TimedEffect({
        name: "Ancient Barrier Magic",
        description: `ATK+${atkBuff}, Opponent's DEF-${defDebuff}, Opponent's SPD -${spdDebuff} for 5 turns.`,
        turnDuration: 7,
        priority: -1,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex) => {
          messageCache.push(
            `An ominous barrier envelopes the battlefield...`,
            TCGThread.Gameroom
          );
          character.adjustStat(-2, StatsEnum.HP, game);
        },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          messageCache.push("The barrier dissipated.", TCGThread.Gameroom);

          character.adjustStat(-1 * atkBuff, StatsEnum.ATK, game);
          opponent.adjustStat(defDebuff, StatsEnum.DEF, game);
          opponent.adjustStat(spdDebuff, StatsEnum.SPD, game);
        },
      })
    );
  },
});

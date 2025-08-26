import Card, { Nature } from "@tcg/card";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

export const a_malevolentShrine = new Card({
  title: "Reelseiden: Malevolent Shrine",
  description: ([dmg, atkSpd]) =>
    `DMG ${dmg}. If used by Übel, has a 80% of missing if the opponent didn't use an Attack card before this move is used. If the attack misses, ATK+${atkSpd}, SPD+${atkSpd}.`,
  cosmetic: {
    cardGif: mediaLinks.ubel_malevolentShrine_gif,
  },
  emoji: CardEmoji.UBEL_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true, ubelFailureRate: 80 },
  effects: [22, 5],
  hpCost: 11,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `# ጠ ል ረ ቿ ሀ ዐ ረ ቿ ክ ፕ    ነ ዘ ዪ ጎ ክ ቿ!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      additionalPierceFactor:
        character.additionalMetadata.ubelSlashMovesPierceFactor,
    });
  },
});

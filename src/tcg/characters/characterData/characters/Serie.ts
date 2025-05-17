import { CharacterData } from "../characterData";
import serieDeck from "@decks/SerieDeck";
import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import Game from "@tcg/game";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const SERIE_TOYING_DAMAGE_BONUS = 0.3;

const serieStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 14.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: 0.0,
});

const afterAttackEffect = function (
  game: Game,
  characterIndex: number,
  _messageCache: MessageCache
) {
  const character = game.getCharacter(characterIndex);
  if (!character.additionalMetadata.serieToyingTurn) {
    character.additionalMetadata.serieToyingNextTurn = true;
  }
};

const Serie = new CharacterData({
  name: CharacterName.Serie,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.SERIE,
    color: 0xe8b961,
    imageUrl: mediaLinks.serieVangerisuCard,
  },
  stats: serieStats,
  cards: serieDeck,
  ability: {
    abilityName: "Toying Around",
    abilityEffectString: `Any attack used by this character has its DMG+${(SERIE_TOYING_DAMAGE_BONUS * 100).toFixed(2)}%. 
      The turn after this character performs any attack, DMG-${(SERIE_TOYING_DAMAGE_BONUS * 100).toFixed(2)}%.`,
    subAbilities: [
      {
        name: "Mana Suppression",
        description: `Hide the amount of HP this character has.`,
      },
      {
        name: "Serie's Intuition",
        description: `See past the opponent's Mana Suppression.`,
      },
    ],
    abilityStartOfTurnEffect(game, characterIndex, messageCache) {
      const character = game.getCharacter(characterIndex);
      if (character.additionalMetadata.serieToyingNextTurn) {
        messageCache.push("## Serie acts aloof.", TCGThread.Gameroom);
        character.additionalMetadata.serieToyingTurn = true;
        character.additionalMetadata.serieToyingNextTurn = false;
        character.setStat(
          1 - SERIE_TOYING_DAMAGE_BONUS,
          StatsEnum.Ability,
          false
        );
      } else {
        character.additionalMetadata.serieToyingTurn = false;
        character.setStat(
          1 + SERIE_TOYING_DAMAGE_BONUS,
          StatsEnum.Ability,
          false
        );
      }
    },
    abilityAttackEffect(game, characterIndex, _messageCache) {
      const character = game.getCharacter(characterIndex);
      if (character.additionalMetadata.serieToyingTurn) {
        game.additionalMetadata.attackModifier[characterIndex] =
          1 - SERIE_TOYING_DAMAGE_BONUS;
      } else {
        game.additionalMetadata.attackModifier[characterIndex] =
          1 + SERIE_TOYING_DAMAGE_BONUS;
      }
    },
    abilityAfterDirectAttackEffect: afterAttackEffect,
    abilityAfterTimedAttackEffect: afterAttackEffect,
  },
  additionalMetadata: {
    manaSuppressed: true,
    ignoreManaSuppressed: true,
    serieToyingNextTurn: false,
    serieToyingTurn: false,
  },
});

export default Serie;

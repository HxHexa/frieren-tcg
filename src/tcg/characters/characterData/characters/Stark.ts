import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import starkDeck from "@decks/StarkDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";

const starkStats = new Stats({
  [StatsEnum.HP]: 125.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 8.0,
  [StatsEnum.Ability]: 0.0,
});

const Stark = new CharacterData({
  characterName: CharacterName.Stark,
  cosmetic: {
    pronouns: Pronouns.Masculine,
    emoji: CharacterEmoji.STARK,
    color: 0xb30c0c,
    imageUrl: mediaLinks.starkPortrait,
  },
  stats: starkStats,
  cards: starkDeck,
  ability: {
    abilityName: "Bravest Coward",
    abilityEffectString: `Using attacks while your (Resolve) is negative reduces its DMG by 20%.
        Using attacks while your (Resolve) is positive increases its DMG by 20%.
        Your attacks stay the same when your (Resolve) is 0.`,
    abilityAfterOwnCardUse: function (
      game,
      characterIndex,
      _messageCache,
      card
    ) {
      const character = game.getCharacter(characterIndex);
      if (card.cardMetadata.resolve) {
        character.adjustStat(
          card.cardMetadata.resolve,
          StatsEnum.Ability,
          game
        );
      }
    },
    abilityAttackEffect: function (game, characterIndex) {
      const character = game.getCharacter(characterIndex);
      if (character.stats.stats.Ability > 0) {
        game.additionalMetadata.attackModifier[characterIndex] = 1.2;
      } else if (character.stats.stats.Ability < 0) {
        game.additionalMetadata.attackModifier[characterIndex] = 0.8;
      } else {
        game.additionalMetadata.attackModifier[characterIndex] = 1.0;
      }
    },
  },
});

export default Stark;

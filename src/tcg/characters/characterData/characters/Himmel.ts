import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import himmelDeck from "@decks/HimmelDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";

const HIMMEL_HERO_PARTY_DAMAGE_BONUS = 0.15;

const himmelStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 16.0,
  [StatsEnum.Ability]: 0.0,
});

const Himmel = new CharacterData({
  characterName: CharacterName.Himmel,
  cosmetic: {
    pronouns: Pronouns.Masculine,
    emoji: CharacterEmoji.HIMMEL,
    color: 0xb4c9e7,
    imageUrl: mediaLinks.himmelPortrait,
  },
  stats: himmelStats,
  cards: himmelDeck,
  ability: {
    abilityName: "The Hero Party",
    abilityEffectString: `For each one of Frieren/Heiter/Eisen active as a timed effect,
        all of this character's attacks and timed effect attacks deal an additional ${(HIMMEL_HERO_PARTY_DAMAGE_BONUS * 100).toFixed(2)}% damage.`,
    abilityStartOfTurnEffect: function (
      this,
      game,
      characterIndex,
      _messageCache
    ) {
      const character = game.characters[characterIndex];
      character.setStat(
        character.timedEffects.length,
        StatsEnum.Ability,
        false
      );
    },
    abilityAttackEffect(game, characterIndex, _messageCache) {
      const character = game.getCharacter(characterIndex);
      game.additionalMetadata.attackModifier[characterIndex] =
        1 + HIMMEL_HERO_PARTY_DAMAGE_BONUS * character.timedEffects.length;
    },
  },
});

export default Himmel;

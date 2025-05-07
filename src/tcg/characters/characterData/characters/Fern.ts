import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import fernDeck from "@decks/FernDeck";
import Pronouns from "@tcg/pronoun";

const imageUrl: Record<string, string> = {
  icon: "https://static.wikia.nocookie.net/frieren/images/6/65/Fern_anime_portrait.png/revision/latest?cb=20231017083448",
};

const fernStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

const Fern = new CharacterData({
  name: CharacterName.Fern,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.FERN,
    color: 0x8e528e,
    imageUrl: imageUrl.icon,
  },
  stats: fernStats,
  cards: fernDeck,
  ability: {
    abilityName: "Prodigy",
    abilityEffectString: `One random card in your hand gets empowered every turn.

    **Sub-Ability: Mana Suppression** - Hide the amount of HP this character has.
    **Sub-Ability: Keen Eye** - See past the opponent's Mana Suppression.`,
    abilityStartOfTurnEffect(
      game,
      characterIndex,
      messageCache,
      _additionalParam
    ) {
      // get a random card from hand
      const character = game.getCharacter(characterIndex);
      const hand = character.hand;
      const randomIndex = Math.floor(Math.random() * hand.length);
      const selectedCard = hand[randomIndex];

      selectedCard.empowerLevel += 1;
      messageCache.push(
        `## ${character.name} empowered ${selectedCard.title} to +${selectedCard.empowerLevel}`,
        character.characterThread
      );
    },
  },
  additionalMetadata: {
    manaSuppressed: true,
    ignoreManaSuppressed: true,
    fernBarrage: 0,
  },
});

export default Fern;

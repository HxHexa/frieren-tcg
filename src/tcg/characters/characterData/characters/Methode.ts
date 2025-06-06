import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import Pronouns from "@tcg/pronoun";
import { CharacterEmoji } from "@src/tcg/formatting/emojis";
import mediaLinks from "@src/tcg/formatting/mediaLinks";
import methodeDeck from "@src/tcg/decks/MethodeDeck";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

const methodeStats = new Stats({
  [StatsEnum.HP]: 100,
  [StatsEnum.ATK]: 12,
  [StatsEnum.DEF]: 12,
  [StatsEnum.TrueDEF]: 0,
  [StatsEnum.SPD]: 10,
  [StatsEnum.Ability]: 0,
});

const Methode = new CharacterData({
  characterName: CharacterName.Methode,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.METHODE,
    color: 0x8a2be2, // default
    imageUrl: mediaLinks.edelPortrait, // default
  },
  stats: methodeStats,
  cards: methodeDeck,

  ability: {
    abilityName: "Jack-of-all-trades",
    abilityEffectString: "Roll an extra die",
    subAbilities: [
      {
        name: '"I think you\'re cute"',
        description: "ATK+1 and DEF-1 against Frieren, Fern, Serie and Edel",
      },
    ],
    abilityStartOfTurnEffect: (game, characterIndex, messageCache) => {
      if (game.turnCount !== 1) return;

      const opp = game.getCharacter(1 - characterIndex);
      if (!opp.additionalMetadata.methodeFindsCute) return;

      const self = game.getCharacter(characterIndex);
      messageCache.push(
        `${self.name} finds ${opp.name} cute!`,
        TCGThread.Gameroom
      );
      self.adjustStat(1, StatsEnum.ATK, game);
      self.adjustStat(-1, StatsEnum.DEF, game);
    },
  },

  additionalMetadata: {
    rollsCount: 7,
  },
});

export default Methode;

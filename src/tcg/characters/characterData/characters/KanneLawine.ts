import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import laufenDeck from "@decks/LaufenDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Game from "@tcg/game";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";

const laufenStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 8.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 30.0,
  [StatsEnum.Ability]: 0.0,
});

const KanneLawine = new CharacterData({
  characterName: CharacterName.KanneLawine,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.KANNELAWINE,
    color: 0xcf7457,
    imageUrl: mediaLinks.kanneLawineImage,
  },
  stats: laufenStats,
  cards: laufenDeck,
  ability: {
    abilityName: "Graze",
    abilityEffectString: `Reduce the opponent's attack damage by SPDDiff%.`,
    abilityStartOfTurnEffect: function (
      this,
      game,
      characterIndex,
      _messageCache
    ) {
      const character = game.characters[characterIndex];
      const opponent = game.getCharacter(1 - characterIndex);
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;

      character.setStat(spdDiff, StatsEnum.Ability, false);
    },
    abilityDefendEffect: (
      game: Game,
      characterIndex,
      _messageCache: MessageCache,
      _attackDamage
    ) => {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;
      const grazeReduction = Math.min(Math.max(spdDiff / 100, 0), 1);

      character.additionalMetadata.defenderDamageScaling = 1 - grazeReduction;
    },
  },
});

export default KanneLawine;

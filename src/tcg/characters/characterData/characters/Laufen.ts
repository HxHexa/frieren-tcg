import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import laufenDeck from "@decks/LaufenDeck";
import Rolls from "@tcg/util/rolls";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
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

const Laufen = new CharacterData({
  characterName: CharacterName.Laufen,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.LAUFEN,
    color: 0xcf7457,
    imageUrl: mediaLinks.laufenPortrait,
  },
  stats: laufenStats,
  cards: laufenDeck,
  ability: {
    abilityName: "Graze",
    abilityEffectString: `When the opponent attacks, roll a D100. The lower the roll, the less damage the move deals. 
      The move deals maximum damage if the roll is higher than the difference between the 2 character’s SPD. 
      The opponent’s attack deals at minimum 0% damage, and at maximum only (100 - This character’s SPD + Opponent’s SPD)% damage.`,
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
      messageCache: MessageCache,
      _attackDamage
    ) => {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;
      const grazeReduction = Math.min(Math.max(spdDiff / 100, 0), 1);
      const spdDiffPrinted = Math.round((spdDiff) * 100) / 100;

      const roll = Rolls.rollD100();
      messageCache.push(`### **SPD diff**: ${spdDiffPrinted}`, TCGThread.Gameroom);
      messageCache.push(`### Roll: ${roll}`, TCGThread.Gameroom);

      const evasionReduction =
        spdDiff > 0 ? Math.min(Math.max(roll / spdDiff, 0), 1) : 1;

      if (roll < spdDiff) {
        messageCache.push(
          "## The attack barely grazed Laufen!",
          TCGThread.Gameroom
        );
      } else {
        messageCache.push(
          "## Laufen failed to evade the attack!",
          TCGThread.Gameroom
        );
      }

      character.additionalMetadata.defenderDamageScaling =
        (1 - grazeReduction) * evasionReduction;
    },
  },
});

export default Laufen;

import { CharacterData } from "../characterData";
import stilleDeck from "@decks/StilleDeck";
import Stats, { StatsEnum } from "@tcg/stats";
import Rolls from "@tcg/util/rolls";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const STILLE_REFLECT_SCALE = 0.75;

const stilleStats = new Stats({
  [StatsEnum.HP]: 20.0,
  [StatsEnum.ATK]: 1.0,
  [StatsEnum.DEF]: 20.0,
  [StatsEnum.SPD]: 99.0,
  [StatsEnum.Ability]: 0.0,
});

const Stille = new CharacterData({
  name: CharacterName.Stille,
  cosmetic: {
    pronouns: Pronouns.Impersonal,
    emoji: CharacterEmoji.STILLE,
    color: 0xe74c3c,
    imageUrl: mediaLinks.stillePortrait,
  },
  stats: stilleStats,
  cards: stilleDeck,
  ability: {
    abilityName: "High-speed Escape",
    abilityEffectString: `When the opponent attacks, roll a D100. 
        If the result is less than the character's SPD minus the opponent's SPD, ignore the attack.
        Afterwards, attack the opponent with DMG equivalent to ${(STILLE_REFLECT_SCALE * 100).toFixed(0)}% of (opponent's ATK + opponent's move DMG).`,
    subAbilities: [
      {
        name: "Birdwatching",
        description: `Both characters don't have access to default card options (Discard/Wait).`,
      },
    ],
    abilityStartOfTurnEffect: (
      game,
      characterIndex,
      _messageCache: MessageCache
    ) => {
      const character = game.characters[characterIndex];
      const opponent = game.getCharacter(1 - characterIndex);
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;

      character.setStat(100 - spdDiff, StatsEnum.Ability, false);
      character.additionalMetadata.accessToDefaultCardOptions = false;
      opponent.additionalMetadata.accessToDefaultCardOptions = false;
    },
    abilityDefendEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
      _attackDamage
    ) => {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const roll = Rolls.rollD100();
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;
      messageCache.push(`## **SPD diff**: ${spdDiff}`, TCGThread.Gameroom);
      messageCache.push(`# Roll: ${roll}`, TCGThread.Gameroom);

      if (roll < spdDiff) {
        messageCache.push("## Stille evaded the attack!", TCGThread.Gameroom);
        game.additionalMetadata.attackMissed[1 - characterIndex] = true;
      } else {
        messageCache.push(
          "## Stille failed to evade the attack!",
          TCGThread.Gameroom
        );
        game.additionalMetadata.attackMissed[1 - characterIndex] = false;
      }
    },
    abilityCounterEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
      attackDamage
    ) => {
      const opponent = game.getCharacter(1 - characterIndex);

      if (game.additionalMetadata.attackMissed[1 - characterIndex]) {
        messageCache.push(
          "## The Stille's high speed escape reflected the opponent's damage!",
          TCGThread.Gameroom
        );
        game.attack({
          attackerIndex: characterIndex,
          damage:
            STILLE_REFLECT_SCALE * (opponent.stats.stats.ATK + attackDamage),
          isTimedEffectAttack: false,
        });
      }
    },
  },
  additionalMetadata: {
    accessToDefaultCardOptions: false,
  },
});

export default Stille;

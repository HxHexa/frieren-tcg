import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import linieDeck from "@decks/LinieDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";

const LINIE_CHAIN_BONUS = 0.07;
const LINIE_CHAIN_RESET_TURN_COUNT = 2;

const linieStats = new Stats({
  [StatsEnum.HP]: 95.0,
  [StatsEnum.ATK]: 13.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 0.0,
});

const Linie = new CharacterData({
  characterName: CharacterName.Linie,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.LINIE,
    color: 0xf7c1b1,
    imageUrl: mediaLinks.liniePortrait,
    hasMonsterSoul: true,
  },
  stats: linieStats,
  cards: linieDeck,
  ability: {
    abilityName: "Chain Attack",
    abilityEffectString: `After this character uses an attack, gain 1 Chain stack.
        All attacks this character does has its damage increased by <#Chain>*${(LINIE_CHAIN_BONUS * 100).toFixed(2)}%.
        When this character does not attack in ${LINIE_CHAIN_RESET_TURN_COUNT} turns in a row, reset the count to 0.`,
    abilityAttackEffect: (game, characterIndex) => {
      const character = game.getCharacter(characterIndex);
      game.additionalMetadata.attackModifier[characterIndex] =
        1 + character.stats.stats[StatsEnum.Ability] * LINIE_CHAIN_BONUS;
    },
    abilityAfterOwnCardUse: function (
      game,
      characterIndex,
      _messageCache,
      card
    ) {
      const character = game.getCharacter(characterIndex);
      if (card.cardMetadata.chain) {
        character.adjustStat(card.cardMetadata.chain, StatsEnum.Ability, game);
      }
    },
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache
    ) => {
      const character = game.getCharacter(characterIndex);
      if (
        character.additionalMetadata.attackedThisTurn ||
        character.additionalMetadata.timedEffectAttackedThisTurn
      ) {
        if (character.stats.stats.Ability === 0) {
          messageCache.push("Linie started her chain", TCGThread.Gameroom);
        } else {
          messageCache.push("Linie continued her chain", TCGThread.Gameroom);
        }
        character.adjustStat(1, StatsEnum.Ability, game);
        character.additionalMetadata.linieEmptyTurnCount ??=
          LINIE_CHAIN_RESET_TURN_COUNT;
      } else {
        character.additionalMetadata.linieEmptyTurnCount ??=
          LINIE_CHAIN_RESET_TURN_COUNT;
        character.additionalMetadata.linieEmptyTurnCount = Math.max(
          character.additionalMetadata.linieEmptyTurnCount - 1,
          0
        );
        if (character.additionalMetadata.linieEmptyTurnCount === 0) {
          if (character.stats.stats.Ability > 0) {
            messageCache.push("Linie ended her chain", TCGThread.Gameroom);
          }
          character.setStat(0, StatsEnum.Ability);
          character.additionalMetadata.linieEmptyTurnCount =
            LINIE_CHAIN_RESET_TURN_COUNT;
        }
      }
    },
  },
  additionalMetadata: {
    linieEmptyTurnCount: LINIE_CHAIN_RESET_TURN_COUNT,
  },
});

export default Linie;

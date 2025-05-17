import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import frierenDeck from "@decks/FrierenDeck";
import { CharacterName } from "../../metadata/CharacterName";
import TimedEffect from "@tcg/timedEffect";
import Game from "@tcg/game";
import Card from "@tcg/card";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const ANALYSIS_BOOST = 0.05;
const ANALYSIS_STACK_CAP = 20;

const frierenStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 12.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 0.0,
});

const afterAttackEffect = function (
  game: Game,
  characterIndex: number,
  _messageCache: MessageCache
) {
  const character = game.getCharacter(characterIndex);
  character.setStat(0, StatsEnum.Ability);
};

const Frieren = new CharacterData({
  name: CharacterName.Frieren,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.FRIEREN,
    color: 0xc5c3cc,
    imageUrl: mediaLinks.frierenVangerisuCard,
  },
  stats: frierenStats,
  cards: frierenDeck,
  ability: {
    abilityName: "Analysis",
    abilityEffectString: `At the end of every turn, gain 1 Analysis stack.
        Whenever an "Analysis" move is used, gain 2 Analysis stacks.
        When an attack is used, its damage is increased by ${(ANALYSIS_BOOST * 100).toFixed(2)}% * the number of Analysis stacks.
        After an attack is used, Analysis stacks is reset to 0.
        A maximum of ${ANALYSIS_STACK_CAP} Analysis stacks can be held at any time.`,
    subAbilities: [
      {
        name: "Mana Suppression",
        description: "Hide the amount of HP this character has.",
      },
      {
        name: "Flamme's Teachings",
        description: "See past the opponent's Mana Suppression.",
      },
    ],
    abilityAfterOwnCardUse: function (
      game: Game,
      characterIndex: number,
      _messageCache: MessageCache,
      card: Card
    ) {
      const character = game.getCharacter(characterIndex);
      if (card.cardMetadata.analysis) {
        character.adjustStat(card.cardMetadata.analysis, StatsEnum.Ability);
        if (character.stats.stats.Ability > ANALYSIS_STACK_CAP) {
          character.setStat(ANALYSIS_STACK_CAP, StatsEnum.Ability);
        }
      }

      const postAnalysis = card.cardMetadata.postAnalysis;
      if (postAnalysis) {
        character.timedEffects.push(
          new TimedEffect({
            name: "Post Analysis",
            description: `At this turn's resolution, gain ${postAnalysis} Analysis stack.`,
            turnDuration: 1,
            metadata: { removableBySorganeil: false },
            endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
              messageCache.push(
                "Frieren performed her analysis.",
                TCGThread.Gameroom
              );
              character.adjustStat(
                postAnalysis,
                StatsEnum.Ability
              );
            },
          })
        );
      }
    },
    abilityAttackEffect: function (
      game: Game,
      characterIndex: number,
      _messageCache: MessageCache
    ) {
      const character = game.getCharacter(characterIndex);
      game.additionalMetadata.attackModifier[characterIndex] =
        1 + character.stats.stats[StatsEnum.Ability] * ANALYSIS_BOOST;
    },
    abilityAfterDirectAttackEffect: afterAttackEffect,
    abilityAfterTimedAttackEffect: afterAttackEffect,
    abilityEndOfTurnEffect: function (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache
    ) {
      const character = game.getCharacter(characterIndex);
      if (character.stats.stats.Ability < ANALYSIS_STACK_CAP) {
        messageCache.push(
          "Frieren continues her Analysis.",
          TCGThread.Gameroom
        );
        character.adjustStat(1, StatsEnum.Ability);
      }
    },
  },
  additionalMetadata: {
    manaSuppressed: true,
    ignoreManaSuppressed: true,
    defenderDamageScaling: 1,
  },
});

export default Frieren;

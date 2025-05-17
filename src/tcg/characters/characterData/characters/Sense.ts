import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import senseDeck from "@decks/SenseDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";
// import config from "@src/config";

// config module not found for some reason
// const PROCTOR_STACK_COUNT = config.debugMode ? 1 : 15;
const PROCTOR_STACK_COUNT = 15;
const PROCTOR_STACK_ATTACK_DEDUCTION = 1;
const TEA_TIME_STACK_TURN_SKIP = 3;

const senseStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 12.0,
  [StatsEnum.SPD]: 8.0,
  [StatsEnum.Ability]: 0.0,
});

const Sense = new CharacterData({
  name: CharacterName.Sense,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.SENSE,
    color: 0xb6a493,
    imageUrl: mediaLinks.sensePortrait,
  },
  stats: senseStats,
  cards: senseDeck,
  ability: {
    abilityName: "Proctor",
    abilityEffectString: `Every turn this character doesn't attack, gain 1 observation. Every turn this character attacks, lose ${PROCTOR_STACK_ATTACK_DEDUCTION} observation. (min 0)
	This character wins when the test is over after ${PROCTOR_STACK_COUNT} observations.`,
    subAbilities: [
      {
        name: "Tea Time",
        description: `When this character has ${TEA_TIME_STACK_TURN_SKIP} Tea Time Snacks, skip the turn for both characters and eat ${TEA_TIME_STACK_TURN_SKIP} Tea Time Snacks.`,
      },
    ],
    abilityAfterOwnCardUse: function (
      game,
      characterIndex,
      messageCache: MessageCache,
      card
    ) {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);
      if (card.cardMetadata.teaTime) {
        character.additionalMetadata.senseTeaTimeStacks ??= 0;

        character.additionalMetadata.senseTeaTimeStacks +=
          card.cardMetadata.teaTime;
        if (
          character.additionalMetadata.senseTeaTimeStacks >=
          TEA_TIME_STACK_TURN_SKIP
        ) {
          messageCache.push(
            "Sense holds a tea party! Both characters take a turn to enjoy the tea.",
            TCGThread.Gameroom
          );
          character.additionalMetadata.senseTeaTimeStacks -=
            TEA_TIME_STACK_TURN_SKIP;
          character.skipTurn = true;
          opponent.skipTurn = true;
        }
      }
    },
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache
    ) => {
      const character = game.characters[characterIndex];
      if (character.additionalMetadata.attackedThisTurn) {
        messageCache.push("Sense went on the offensive!", TCGThread.Gameroom);
        const newAbilityCount = Math.max(
          0,
          character.stats.stats.Ability - PROCTOR_STACK_ATTACK_DEDUCTION
        );
        character.setStat(newAbilityCount, StatsEnum.Ability);
      } else {
        messageCache.push(
          `${character.name} continued to observe peacefully.`,
          TCGThread.Gameroom
        );
        character.adjustStat(1, StatsEnum.Ability);

        if (character.stats.stats.Ability === PROCTOR_STACK_COUNT) {
          messageCache.push(
            `# ${character.name} has finished proctoring ${character.cosmetic.pronouns.possessive} test. The examinee did not pass in time.`,
            TCGThread.Gameroom
          );
          game.additionalMetadata.forfeited[1 - characterIndex] = true;
        }
      }
    },
  },
  additionalMetadata: {
    senseTeaTimeStacks: 0,
  },
});

export default Sense;

import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg//formatting/emojis";
import denkenDeck from "@decks/DenkenDeck";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const DENKEN_PRESERVERANCE_COUNT = 3;
export const DENKEN_DEATH_HP = -50;

const denkenStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 11.0,
  [StatsEnum.DEF]: 11.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: DENKEN_PRESERVERANCE_COUNT,
});

const Denken = new CharacterData({
  name: CharacterName.Denken,
  cosmetic: {
    pronouns: Pronouns.Masculine,
    emoji: CharacterEmoji.DENKEN,
    color: 0x82574f,
    imageUrl: mediaLinks.denkenPortrait,
  },
  stats: denkenStats,
  cards: denkenDeck,
  ability: {
    abilityName: "Preserverance",
    abilityEffectString: `This character starts with ${DENKEN_PRESERVERANCE_COUNT} Preserverance stacks.
    1 Stack is taken away when the character's HP is <= 0 at the end of the turn. 
    An additional stack is taken away when the character's HP is <= ${DENKEN_DEATH_HP / 2}. 
    The character loses when the number of Preserverance stack is 0, or if the character's HP is <= ${DENKEN_DEATH_HP}.`,
    abilityEndOfTurnEffect: function (
      this,
      game,
      characterIndex,
      messageCache
    ) {
      const character = game.characters[characterIndex];

      if (character.stats.stats.HP <= 0) {
        character.adjustStat(-1, StatsEnum.Ability);

        if (character.stats.stats.HP <= DENKEN_DEATH_HP / 2) {
          character.adjustStat(-1, StatsEnum.Ability);
        }

        if (character.stats.stats.Ability > 0) {
          messageCache.push(`Denken steels himself!`, TCGThread.Gameroom);
        } else {
          messageCache.push(`Denken's strength fades.`, TCGThread.Gameroom);
          game.additionalMetadata.forfeited[characterIndex] = true;
        }
      }
    },
  },
});

export default Denken;

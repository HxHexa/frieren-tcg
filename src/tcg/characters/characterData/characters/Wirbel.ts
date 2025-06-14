import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import wirbelDeck from "@tcg/decks/WirbelDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";
import Game from "@tcg/game";

const WIRBEL_RESOLVE_DMG_BONUS = 0.2;
const WIRBEL_RESOLVE_DMG_CAP = 0.2;

const wirbelStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 13.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 13.0,
  [StatsEnum.Ability]: 0.0,
});

const Wirbel = new CharacterData({
  characterName: CharacterName.Wirbel,
  cosmetic: {
    pronouns: Pronouns.Masculine,
    emoji: CharacterEmoji.WIRBEL,
    color: 0xa4a8b9,
    imageUrl: mediaLinks.wirbelPortrait,
  },
  stats: wirbelStats,
  cards: wirbelDeck,
  ability: {
    abilityName: "Resolve to Kill",
    abilityEffectString: `When the opponent attacks you while your TrueDEF is >0, increase your ATK by ${(WIRBEL_RESOLVE_DMG_BONUS * 100).toFixed(2)}% of the attack's damage, to a maximum of ${(WIRBEL_RESOLVE_DMG_CAP * 100).toFixed(2)}% of your TrueDEF`,
    abilityDefendEffect: (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache,
      attackDamage: number
    ) => {
      const character = game.getCharacter(characterIndex);

      if (character.stats.stats.TrueDEF > 0) {
        const resolveAttackGain = Math.min(
          attackDamage * WIRBEL_RESOLVE_DMG_BONUS,
          character.stats.stats.TrueDEF * WIRBEL_RESOLVE_DMG_CAP
        );

        messageCache.push(
          `Wirbel feels the need to steel his resolve.`,
          TCGThread.Gameroom
        );
        character.adjustStat(resolveAttackGain, StatsEnum.ATK, game);
      }
    },
  },
});

export default Wirbel;

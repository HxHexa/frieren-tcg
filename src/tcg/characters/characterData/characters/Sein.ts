import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import seinDeck from "@decks/SeinDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";

const SEIN_BASE_HEALING = 2;
const SEIN_HEALING_RAMP = 0.1;

const seinStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 11.0,
  [StatsEnum.DEF]: 11.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: 0.0,
});

const Sein = new CharacterData({
  characterName: CharacterName.Sein,
  cosmetic: {
    pronouns: Pronouns.Masculine,
    emoji: CharacterEmoji.SEIN,
    color: 0xa3caca,
    imageUrl: mediaLinks.seinVangerisuCard,
  },
  stats: seinStats,
  cards: seinDeck,
  ability: {
    abilityName: "Goddess' Blessing",
    abilityEffectString: `Heal for ${SEIN_BASE_HEALING}HP + ${SEIN_BASE_HEALING} * (Turn Count * ${(SEIN_HEALING_RAMP * 100).toFixed(2)}%) at the end of every turn.
        This character can be healed past their maxHP.`,
    abilityStartOfTurnEffect: function (
      this,
      game,
      characterIndex,
      _messageCache
    ) {
      const character = game.characters[characterIndex];
      const healing =
        SEIN_BASE_HEALING +
        SEIN_BASE_HEALING * (game.turnCount * SEIN_HEALING_RAMP);

      character.setStat(healing, StatsEnum.Ability, false);
    },
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache
    ) => {
      messageCache.push(
        "Sein sought the Goddess' Blessings.",
        TCGThread.Gameroom
      );
      const character = game.characters[characterIndex];
      character.adjustStat(character.stats.stats.Ability, StatsEnum.HP, game);
    },
  },
  additionalMetadata: {
    overheal: true,
  },
});

export default Sein;

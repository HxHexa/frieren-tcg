import { VISIBLE_CHARACTERS } from "@tcg/characters/characterList";
import type { Rank } from "./commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";

export const FRIEREN_DISCORD_SERVER_AUBERST_CHANNEL_ID = "1357179037428088862";
export const FRIEREN_DISCORD_SERVER =
  process.env["MAIN_GUILD_ID"] ?? "738445835234181211";

export const MAX_TEXT_SPEED = 3000;
export const DEFAULT_TEXT_SPEED = 1500;
export const MIN_TEXT_SPEED = 100;

export const MAX_INVITE_LENGTH = 15;
export const DEFAULT_INVITE_LENGTH = 5;
export const MIN_INVITE_LENGTH = 1;

export const CHAR_OPTIONS = Object.entries(VISIBLE_CHARACTERS)
  .filter(([, character]) => character.additionalMetadata.hidden !== true)
  .map(([, character]) => ({
    name: character.characterName,
    value: character.characterName,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Maps rank score thresholds to rank details including title and Discord role ID
 * Players with scores at or above each threshold will be assigned the corresponding rank
 */
export const RANK_SCORE_TO_RANK_MAPPING: Record<number, Rank> = {
  0: {
    rankLevel: 0,
    rankTitle: "Apprentice Battle Mage",
    rankRoleId: ``,
  },
  100: {
    rankLevel: 1,
    rankTitle: "5th-class Battle Mage",
    rankRoleId: `1374904577219891220`,
  },
  200: {
    rankLevel: 2,
    rankTitle: "4th-class Battle Mage",
    rankRoleId: `1374904722477158511`,
  },
  300: {
    rankLevel: 3,
    rankTitle: "3rd-class Battle Mage",
    rankRoleId: `1374905514978447540`,
  },
  400: {
    rankLevel: 4,
    rankTitle: "2nd-class Battle Mage",
    rankRoleId: `1374905592661147740`,
  },
  500: {
    rankLevel: 5,
    rankTitle: "1st-class Battle Mage",
    rankRoleId: `1374905683777945680`,
  },
};

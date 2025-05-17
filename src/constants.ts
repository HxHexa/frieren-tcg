import { CHARACTER_LIST } from "@tcg/characters/characterList";
import type { Rank } from "./commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";

export const FRIEREN_DISCORD_SERVER_AUBERST_CHANNEL_ID = "738445835234181211";
export const FRIEREN_DISCORD_SERVER =
  process.env["MAIN_GUILD_ID"] ?? "738445835234181211";

export const MAX_TEXT_SPEED = 3000;
export const DEFAULT_TEXT_SPEED = 1500;
export const MIN_TEXT_SPEED = 100;

export const CHAR_OPTIONS = Object.entries(CHARACTER_LIST).map(
  ([, character]) => ({
    name: character.name,
    value: character.name,
  })
);

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
    rankRoleId: `1372948399074316338`,
  },
  200: {
    rankLevel: 2,
    rankTitle: "4th-class Battle Mage",
    rankRoleId: `1372948364395806801`,
  },
  300: {
    rankLevel: 3,
    rankTitle: "3rd-class Battle Mage",
    rankRoleId: `1372948340781748246`,
  },
  400: {
    rankLevel: 4,
    rankTitle: "2nd-class Battle Mage",
    rankRoleId: `1372948305713303582`,
  },
  500: {
    rankLevel: 5,
    rankTitle: "1st-class Battle Mage",
    rankRoleId: `1372922202453708900`,
  },
};

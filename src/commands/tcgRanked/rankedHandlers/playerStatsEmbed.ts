import { EmbedBuilder, User } from "discord.js";
import { PlayerRankedStats } from "./playerStats";
import {
  getRelativeRank,
  getRelativeCharacterRank,
  getTotalPlayers,
  getTotalCharacterPlayers,
} from "./getRelativeRank";
import { getRank } from "@src/commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";

export default async function playerStatsEmbed(
  stats: PlayerRankedStats,
  user: User
) {
  const ladderRankFields = await Promise.all(
    stats.ladderRanks.map(async (ladderRank) => {
      const relativeRank = await getRelativeRank(
        ladderRank.ladderReset.id,
        ladderRank.rankPoints
      );
      const totalPlayers = await getTotalPlayers(ladderRank.ladderReset.id);

      const rankTitle = getRank(ladderRank.rankPoints).rankTitle;
      const capitalizedRankTitle =
        rankTitle.charAt(0).toUpperCase() + rankTitle.slice(1);
      return {
        name: `${ladderRank.ladderReset.ladder.name}: ${capitalizedRankTitle}`,
        value: `Points: ${ladderRank.rankPoints} (#**${relativeRank}**/${totalPlayers})`,
      };
    })
  );

  const characterLines = await Promise.all(
    stats.characterMasteries.map(async (mastery) => {
      const relativeCharacterRank = await getRelativeCharacterRank(
        mastery.masteryPoints,
        mastery.character.id
      );
      const totalCharacterPlayers = await getTotalCharacterPlayers(
        mastery.character.id
      );
	  const characterData = CHARACTER_LIST.find(
        (c) => c.name === mastery.character.name
      );
      const emoji = characterData?.cosmetic.emoji || "";
      return `${emoji} **${mastery.character.name}** - ${mastery.masteryPoints} (#**${relativeCharacterRank}**/${totalCharacterPlayers})`;
    })
  );

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(`${user.displayName}'s ranked stats`)
    .setDescription("Character Masteries:\n" + characterLines.join("\n"))
    .addFields(ladderRankFields);

  return embed;
}

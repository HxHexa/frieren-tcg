import { EmbedBuilder, User } from "discord.js";
import { PlayerRankedStats } from "./playerStats";
import {
  getRelativeRank,
  getRelativeCharacterRank,
  getTotalPlayers,
  getTotalCharacterPlayers,
} from "./getRelativeRank";
import { getRank } from "@src/commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";

export default async function playerStatsEmbed(
  stats: PlayerRankedStats,
  user: User,
) {
  const ladderRankFields = await Promise.all(
    stats.ladderRanks.map(async (ladderRank) => {
      const relativeRank = await getRelativeRank(
        ladderRank.ladderReset.id,
        ladderRank.rankPoints,
      );
      const totalPlayers = await getTotalPlayers(ladderRank.ladderReset.id);
      return {
        name: `${ladderRank.ladderReset.ladder.name}: ${
          getRank(ladderRank.rankPoints).rankTitle
        }`,
        value: `**Points:** ${ladderRank.rankPoints} (#**${relativeRank}**/${totalPlayers})`,
      };
    }),
  );

  const characterLines = await Promise.all(
    stats.characterMasteries.map(async (mastery) => {
      const relativeCharacterRank = await getRelativeCharacterRank(
        mastery.masteryPoints,
        mastery.character.id,
      );
      const totalCharacterPlayers = await getTotalCharacterPlayers(
        mastery.character.id,
      );
      return `**${mastery.character.name}** - ${mastery.masteryPoints} (#**${relativeCharacterRank}**/${totalCharacterPlayers})`;
    }),
  );

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(`${user.username}'s ranked stats`)
    .addFields({
      name: "Ladder Ranks:",
      value: ladderRankFields
        .map((field) => `${field.name}\n${field.value}`)
        .join("\n\n"),
    })
    .addFields({
      name: "Characters Masteries:",
      value: characterLines.join("\n"),
    });

  return embed;
}

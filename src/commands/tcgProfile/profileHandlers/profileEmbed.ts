import { EmbedBuilder, User } from "discord.js";
import { PlayerProfile } from "./profileHandler";
import {
  getRelativeRank,
  getRelativeCharacterRank,
  getTotalPlayers,
  getTotalCharacterPlayers,
} from "./getRelativeRank";
import { getRank } from "@src/commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";
import { capitalizeFirstLetter } from "@src/util/utils";
import prismaClient from "@prismaClient";

export default async function profileEmbed(profile: PlayerProfile, user: User) {
  const achievementMap = profile.achievements.map((achievement) => {
    const { name, description } = achievement;
    let achText = `${name}\n`;
    if (description) {
      achText += `${description}\n`;
    }
    return achText;
  });

  const achievementSection =
    achievementMap.length > 0
      ? achievementMap.join("\n")
      : "This player has no achievements";

  const achievementField = {
    name: "Achievements",
    value: achievementSection,
  };

  const ladderRankFields = await Promise.all(
    profile.ladderRanks.map(async (ladderRank) => {
      const [relativeRank, totalPlayers, matchCounts] = await Promise.all([
        getRelativeRank(ladderRank.ladderReset.id, ladderRank.rankPoints),
        getTotalPlayers(ladderRank.ladderReset.id),
        countPlayerMatches(profile.id, ladderRank.ladderReset.id),
      ]);

      const ladderName = ladderRank.ladderReset.ladder.name;
      const capitalizedLadderName = capitalizeFirstLetter(ladderName);
      const rankName = getRank(ladderRank.rankPoints).rankTitle;

      return {
        name: `${capitalizedLadderName}: ${rankName}`,
        value:
          `**Points:** ${ladderRank.rankPoints} (#**${relativeRank}**/${totalPlayers})` +
          `\n${winRateLine(matchCounts.wins, matchCounts.losses)}\n`,
      };
    })
  );

  const sortedMasteries = profile.characterMasteries.sort(
    (a, b) => b.masteryPoints - a.masteryPoints
  );

  const characterLines = await Promise.all(
    sortedMasteries.map(async (mastery) => {
      const [relativeCharacterRank, totalCharacterPlayers] = await Promise.all([
        getRelativeCharacterRank(mastery.masteryPoints, mastery.character.id),
        getTotalCharacterPlayers(mastery.character.id),
      ]);

      const character = CHARACTER_LIST.find(
        (character) => character.name === mastery.character.name
      );
      const emojiLine = character?.cosmetic.emoji + " " || "";

      return `${emojiLine}**${mastery.character.name}** - ${mastery.masteryPoints} (#**${relativeCharacterRank}**/${totalCharacterPlayers}) ${winRateLine(mastery.wins, mastery.losses)}`;
    })
  );

  const ladderFields =
    ladderRankFields.length > 0
      ? ladderRankFields
      : [
          {
            name: "Ranked Stats",
            value: "This player hasn't played any ranked games yet",
          },
        ];

  const masteryField = {
    name: "Character Masteries",
    value:
      characterLines.length > 0
        ? characterLines.join("\n")
        : "This player has no character masteries",
  };

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(`${user.displayName}'s profile`)
    .addFields([...ladderFields, masteryField, achievementField]);

  return embed;
}

function winRateLine(wins: number, losses: number) {
  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? wins / totalGames : 0;
  return `(${wins}W / ${losses}L / WR: ${(winRate * 100).toFixed(1)}%)`;
}

async function countPlayerMatches(
  id: number,
  ladderResetId: number
): Promise<{ wins: number; losses: number }> {
  const [wins, losses] = await prismaClient.$transaction([
    prismaClient.match.count({ where: { winnerId: id, ladderResetId } }),
    prismaClient.match.count({ where: { loserId: id, ladderResetId } }),
  ]);
  return { wins, losses };
}

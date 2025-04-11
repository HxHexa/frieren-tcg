import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { characterNameToEmoji } from "@src/tcg/formatting/emojis";
import { EmbedBuilder } from "discord.js";

const rankEmotes: Record<number, String> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function getRankString(rank: number, id: string): string {
  const hasRankEmotes = rank in rankEmotes;
  let rankString = `${hasRankEmotes ? `${rankEmotes[rank]} ` : ""}${rank}. <@${id}>`;
  if (hasRankEmotes) {
    return "**" + rankString + "**";
  } else {
    return rankString;
  }
}

export default async function leaderboardEmbed(props: {
  idsToPoints: { id: string; points: number }[];
  leaderboard: string;
  isCharacterLeaderboard: boolean;
  page?: number;
  pageSize?: number;
}): Promise<EmbedBuilder> {
  const {
    idsToPoints,
    leaderboard,
    isCharacterLeaderboard,
    page = 1,
    pageSize = 10,
  } = props;

  // when isCharacterLeaderboard is true, leaderboard is a character name, otherwise it's the name of a ladder (classic, blitz, etc.)
  const charEmoji = isCharacterLeaderboard
    ? characterNameToEmoji[leaderboard as CharacterName] + " "
    : "";
  const leaderboardTitle = `${charEmoji}${leaderboard} Ranked Global Leaderboard`;

  const userLines = idsToPoints.map((idtoPoint, index) => {
    const { id, points } = idtoPoint;
    const rank = index + 1 + (page - 1) * pageSize;
    return `${getRankString(rank, id)}: ${points} pts`;
  });

  return new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(leaderboardTitle)
    .addFields({
      name: "Top Players",
      value: userLines.join("\n"),
    });
}

import prismaClient from "@prismaClient";
import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import { getLatestLadderReset } from "@src/util/db/getLatestLadderReset";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Prisma } from "@prisma/client";
import { capitalizeFirstLetter } from "@src/util/utils";
import leaderboardEmbed from "./leaderboardEmbed";
import {
  LazyPaginatedMessage,
  type PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";

export type LadderRankWithPlayer = Prisma.LadderRankGetPayload<{
  include: { player: true };
}>;

const getTopNPlayersInGamemode = async function (
  gamemode: GameMode,
  count: number
): Promise<LadderRankWithPlayer[] | null> {
  const currLadderReset = await getLatestLadderReset({ gamemode });

  if (currLadderReset) {
    const topN = await prismaClient.ladderRank.findMany({
      where: { ladderResetId: currLadderReset.id },
      orderBy: { rankPoints: "desc" },
      take: count,
      include: {
        player: true,
      },
    });

    return topN;
  } else {
    return null;
  }
};

export async function handleGlobalStats(
  interaction: ChatInputCommandInteraction
) {
  const gamemode: GameMode =
    (interaction.options.getString("gamemode") as GameMode) ?? GameMode.CLASSIC;

  const top100 = await getTopNPlayersInGamemode(gamemode, 100);
  if (!top100) {
    await interaction.editReply({
      content: "Failed to fetch Global Leaderboard.",
    });
    return;
  }

  const idsToPoints = top100.map(({ player, rankPoints }) => ({
    id: player.discordId,
    points: rankPoints,
  }));

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(idsToPoints.length / PAGE_SIZE);

  const pages = Array.from({ length: totalPages }, (_, i) => async () => {
    const pageData = idsToPoints.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
    const embed = await leaderboardEmbed({
      idsToPoints: pageData,
      leaderboard: capitalizeFirstLetter(gamemode),
      isCharacterLeaderboard: false,
      page: i + 1,
      pageSize: PAGE_SIZE,
    });

    const page: PaginatedMessageMessageOptionsUnion = {
      embeds: [embed],
    };

    return page;
  });

  if (pages.length === 0) {
    const leaderboardTitle = `${capitalizeFirstLetter(gamemode)} Ranked Global Leaderboard`;
    const noPlayersFoundEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(leaderboardTitle)
      .setDescription(
        "No players found in this leaderboard. Maybe you could be the first one?"
      );

    await interaction.editReply({
      embeds: [noPlayersFoundEmbed],
    });
    return;
  }

  const paginated = new LazyPaginatedMessage({ pages });
  // you can change the message settings here

  await paginated.run(interaction);
}

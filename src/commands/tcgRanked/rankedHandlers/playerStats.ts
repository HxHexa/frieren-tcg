import { ChatInputCommandInteraction } from "discord.js";
import prismaClient from "@prismaClient";
import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import playerStatsEmbed from "./playerStatsEmbed";
import { Prisma } from "@prisma/client";

// validates a query, function is used for code reuse, so the type can be extracted and the discordId can be passed when it is available
const playerRankedStats = (discordId?: string) => {
  return Prisma.validator<Prisma.PlayerFindUniqueArgs>()({
    where: {
      discordId: discordId,
    },
    select: {
      discordId: true,
      characterMasteries: {
        select: {
          character: { select: { id: true, name: true } },
          masteryPoints: true,
        },
      },
      ladderRanks: {
        where: {
          ladderReset: {
            ladder: {
              name: { in: Array.from(Object.values(GameMode)) },
            },
          },
        },
        include: {
          ladderReset: {
            include: {
              ladder: true,
            },
          },
        },
        orderBy: {
          ladderReset: {
            startDate: "desc",
          },
        },
      },
    },
  });
};

// extract the type of the query
export type PlayerRankedStats = Prisma.PlayerGetPayload<
  ReturnType<typeof playerRankedStats>
>;

export default async function handlePlayerStats(
  interaction: ChatInputCommandInteraction,
) {
  const targetPlayer = interaction.options.getUser("user") || interaction.user;

  interaction.editReply({
    content: `Fetching stats for ${targetPlayer}...`,
  });

  const player: PlayerRankedStats | null = await prismaClient.player.findUnique(
    playerRankedStats(targetPlayer.id),
  );

  if (!player) {
    return await interaction.editReply({
      content: `No player found for ${targetPlayer}`,
    });
  }
  if (!(player.discordId === targetPlayer.id)) {
    return await interaction.editReply({
      content: `Player ${targetPlayer} has a mismatched Discord ID in the database (${player.discordId})`,
    });
  }

  // This will contain 0-3 ladderRank entries, the latest one for each gamemode, it may be possible to filter in the query itself, which would be better
  player.ladderRanks = Array.from(
    player.ladderRanks
      .reduce(
        (map, rank) =>
          map.has(rank.ladderReset.ladder.name)
            ? map
            : map.set(rank.ladderReset.ladder.name, rank),
        new Map(),
      )
      .values(),
  );

  // yes, all that typescript earlier was just to move it to another function 😭
  const embed = await playerStatsEmbed(player, targetPlayer);

  await interaction.editReply({
    embeds: [embed],
  });
}

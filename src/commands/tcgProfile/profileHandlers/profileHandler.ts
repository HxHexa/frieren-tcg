import { ChatInputCommandInteraction } from "discord.js";
import prismaClient from "@prismaClient";
import { Prisma } from "@prisma/client";
import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import profileEmbed from "./profileEmbed";

// validates a query, function is used for code reuse, so the type can be extracted and the discordId can be passed when it is available
const playerProfile = (discordId?: string) => {
  return Prisma.validator<Prisma.PlayerFindUniqueArgs>()({
    where: {
      discordId: discordId,
    },
    select: {
      id: true,
      discordId: true,
	  achievements: true,
      characterMasteries: {
        select: {
          character: { select: { id: true, name: true } },
          masteryPoints: true,
          wins: true,
          losses: true,
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
export type PlayerProfile = Prisma.PlayerGetPayload<
  ReturnType<typeof playerProfile>
>;

export default async function handlePlayerStats(
  interaction: ChatInputCommandInteraction
) {
  const targetPlayer = interaction.options.getUser("user") ?? interaction.user;

  interaction.editReply({
    content: `Fetching stats for ${targetPlayer}...`,
  });

  const player: PlayerProfile | null = await prismaClient.player.findUnique(
    playerProfile(targetPlayer.id)
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
        new Map()
      )
      .values()
  );

  const embed = await profileEmbed(player, targetPlayer);

  await interaction.editReply({
	content: "",
    embeds: [embed],
  });
}

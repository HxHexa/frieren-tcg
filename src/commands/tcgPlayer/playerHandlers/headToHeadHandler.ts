import prismaClient from "@prismaClient";
import {
  LazyPaginatedMessage,
  type PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import type { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { charWithEmoji } from "@src/tcg/formatting/emojis";
import { buildThreadLink } from "@src/util/formatting/links";
import {
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

const PAGE_SIZE = 10;

export async function handleHeadToHead(
  interaction: ChatInputCommandInteraction
) {
  const player = interaction.options.getUser("player", true);
  const matchesAgainstPlayer = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
      OR: [
        {
          winner: {
            discordId: player.id,
          },
        },
        {
          loser: {
            discordId: player.id,
          },
        },
      ],
    },
    include: {
      winnerCharacter: {
        select: {
          name: true,
        },
      },
      loserCharacter: {
        select: {
          name: true,
        },
      },
      winner: {
        select: {
          discordId: true,
        },
      },
      loser: {
        select: {
          discordId: true,
        },
      },
    },
    orderBy: {
      finishedAt: "desc",
    },
  });

  if (matchesAgainstPlayer.length === 0) {
    await interaction.editReply({
      content: `${player} has no head to head records against other players in the current ladder.`,
    });
    return;
  }

  const totalMatches = matchesAgainstPlayer.length;
  const wins = matchesAgainstPlayer.filter(
    (match) => match.winner.discordId === interaction.user.id
  ).length;
  const losses = totalMatches - wins;
  const winRate = totalMatches === 0 ? 0 : (wins / totalMatches) * 100;

  const chunks: (typeof matchesAgainstPlayer)[] = [];
  for (let i = 0; i < matchesAgainstPlayer.length; i += PAGE_SIZE) {
    chunks.push(matchesAgainstPlayer.slice(i, i + PAGE_SIZE));
  }

  const pages = chunks.map((chunk, pageIndex) => {
    const description = chunk
      .map((match, matchIndex) => {
        const globalMatchNumber =
          matchesAgainstPlayer.length - (pageIndex * PAGE_SIZE + matchIndex);

        const { winnerCharacter, loserCharacter, finishedAt, winner, loser } =
          match;
        const won = winner.discordId === player.id;
        const result = won ? "🏆 **Won**" : "💥 **Lost**";
        const character = charWithEmoji(
          (won ? winnerCharacter.name : loserCharacter.name) as CharacterName
        );
        const opponent = `<@${won ? loser.discordId : winner.discordId}>`;
        const opponentCharacter = charWithEmoji(
          (won ? loserCharacter.name : winnerCharacter.name) as CharacterName
        );
        const timestamp = `<t:${Math.floor(
          new Date(finishedAt).getTime() / 1000
        )}:R>`;
        const resultText = match.threadId
          ? `[${result}](${buildThreadLink(match.threadId)})`
          : `${result}`;

        return `${globalMatchNumber}\\. ${resultText} with ${character} ${timestamp}\n against ${opponent} as ${opponentCharacter}`;
      })
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`Head to Head Record against ${player.displayName}`)
      .setDescription(
        `**Overall Record:** ${wins} wins - ${losses} losses (${winRate.toFixed(
          2
        )}% win rate)\n\n${description}`
      )
      .setColor("Blurple");

    const page: PaginatedMessageMessageOptionsUnion = {
      embeds: [embed],
    };

    return page;
  });

  const paginated = new LazyPaginatedMessage({ pages });
  paginated.actions.forEach((action) => {
    if (action.type === ComponentType.Button) {
      action.style = ButtonStyle.Secondary;
    }
  });

  await paginated.run(interaction);
}

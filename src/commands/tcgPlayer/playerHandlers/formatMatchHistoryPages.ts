import {
  EmbedBuilder,
  ComponentType,
  ButtonStyle,
  type User,
} from "discord.js";
import {
  LazyPaginatedMessage,
  PaginatedMessage,
  type PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import { charWithEmoji } from "@tcg/formatting/emojis";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { buildThreadLink } from "@src/util/formatting/links";
import type { Match } from "@prisma/client";
import { chunkify } from "@src/util/utils";

const PAGE_SIZE = 10;

type FormatMatchHistoryPageExtras = {
  startingPage?: number;
  prependDescription?: string;
};

/**
 * Formats a list of matches into paginated embeds for a Discord message.
 *
 * @param matches - The array of match objects to format.
 * @param player - The Discord User object for whom the history is being displayed (used for context like display name and determining win/loss).
 * @param embedTitle - The title for the embed.
 * @param prependDescription - Optional string to prepend to the description (e.g., overall record summary).
 * @returns A LazyPaginatedMessage instance ready to be run.
 */
export function formatMatchHistoryPages(
  matches: Match[],
  player: User,
  embedTitle: string,
  extras?: FormatMatchHistoryPageExtras
) {
  const { startingPage = 1, prependDescription = "" } = extras ?? {};
  const chunks = chunkify(matches, PAGE_SIZE);

  const pages = chunks.map((chunk, pageIndex) => {
    const description = chunk
      .map((match, matchIndex) => {
        const globalMatchNumber =
          matches.length - (pageIndex * PAGE_SIZE + matchIndex);

        const {
          winnerCharacter,
          loserCharacter,
          finishedAt,
          winner,
          loser,
          threadId,
        } = match as Match & {
          winner: { discordId: string };
          loser: { discordId: string };
          winnerCharacter: { name: CharacterName };
          loserCharacter: { name: CharacterName };
        };

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
        const resultText = threadId
          ? `[${result}](${buildThreadLink(threadId)})`
          : `${result}`;

        return `${globalMatchNumber}\\. ${resultText} with ${character} ${timestamp}\n against ${opponent} as ${opponentCharacter}`;
      })
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(embedTitle)
      .setColor("Blurple")
      .setDescription(`${prependDescription}${description}`);

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

  const actions = [...PaginatedMessage.defaultActions].filter(
    (item) => item.type !== ComponentType.StringSelect
  );

  const pageIndex = Math.min(startingPage - 1, pages.length - 1);
  paginated.setActions(actions);
  paginated.index = pageIndex;

  return paginated;
}

import prismaClient from "@prismaClient";
import { getOrCreateCharacters } from "@src/util/db/getCharacter";
import { ChatInputCommandInteraction } from "discord.js";
import { Prisma } from "@prisma/client";
import leaderboardEmbed from "./leaderboardEmbed";
import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import {
  LazyPaginatedMessage,
  PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import { CHARACTER_MAP } from "@src/tcg/characters/characterList";

export type CharacterMasteryWithPlayer = Prisma.CharacterMasteryGetPayload<{
  include: { player: true };
}>;

const getTopNPlayersPerCharacter = async function (
  character: CharacterName,
  count: number
): Promise<CharacterMasteryWithPlayer[] | null> {
  const characterObject = (await getOrCreateCharacters([character]))[0];
  if (characterObject) {
    const topN = await prismaClient.characterMastery.findMany({
      where: { characterId: characterObject.id },
      orderBy: { masteryPoints: "desc" },
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

export async function handleCharacterGlobalStats(
  interaction: ChatInputCommandInteraction
) {
  const character: CharacterName =
    (interaction.options.getString("character") as CharacterName) ??
    CharacterName.Frieren;

  const color = CHARACTER_MAP[character].cosmetic.color;

  const top100 = await getTopNPlayersPerCharacter(character, 100);

  if (!top100) {
    await interaction.editReply({
      content: "Failed to fetch Global Leaderboard.",
    });
    return;
  }
  const idsToPoints = top100.map(({ player, masteryPoints }) => ({
    id: player.discordId,
    points: masteryPoints,
  }));

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(idsToPoints.length / PAGE_SIZE);

  const pages = Array.from({ length: totalPages }, (_, i) => async () => {
    const pageData = idsToPoints.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
    const embed = await leaderboardEmbed({
      idsToPoints: pageData,
      leaderboard: character,
      isCharacterLeaderboard: false,
      page: i + 1,
      pageSize: PAGE_SIZE,
      color,
    });

    const page: PaginatedMessageMessageOptionsUnion = {
      embeds: [embed],
    };

    return page;
  });

  const paginated = new LazyPaginatedMessage({ pages });
  await paginated.run(interaction);
}

import { ComponentType, EmbedBuilder, RepliableInteraction } from "discord.js";
import prismaClient from "@prismaClient";
import { characterNameToEmoji } from "@src/tcg/formatting/emojis";
import { CHARACTER_MAP } from "@src/tcg/characters/characterList";
import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { getWinrate } from "@src/util/utils";
import characterSelect from "@src/util/messageComponents/characterSelect";

const charStatSelectMenuCustomId = "character-stat-select";

export async function handleCharacterStats(
  interaction: RepliableInteraction,
  character: string | null
) {
  let embed: EmbedBuilder | null;
  if (character) {
    embed = await breakdownCase(character);
  } else {
    embed = await overviewCase();
  }

  if (!embed) {
    await interaction.editReply({
      content: "No data found for the specified character.",
    });
    return;
  }

  const { charSelectActionRow } = characterSelect({
    customId: charStatSelectMenuCustomId,
    nameValues: true,
    includeOverview: true,
  });

  const response = await interaction.editReply({
    embeds: [embed],
    components: [charSelectActionRow],
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 450_000,
    filter: (i) => i.customId === charStatSelectMenuCustomId,
  });

  collector.on("collect", async (i) => {
    try {
      const selectedCharacter = i.values[0];
      const embed =
        selectedCharacter === "overview"
          ? await overviewCase()
          : await breakdownCase(selectedCharacter);
      if (!embed) {
        await i.update({
          content: "No data found for the specified character.",
          embeds: [],
          components: [],
        });
        return;
      }
      await i.update({
        embeds: [embed],
        components: [charSelectActionRow],
      });
    } catch (error) {
      console.error(error);
      await i.update({
        content: "There was an error fetching character stats.",
        components: [charSelectActionRow],
      });
      collector.stop("An error occurred");
    }
  });

  collector.on("end", async () => {
    charSelectActionRow.components[0].setDisabled(true);
    await interaction.editReply({
      components: [charSelectActionRow],
    });
  });
}

async function overviewCase(): Promise<EmbedBuilder> {
  const characters = await prismaClient.character.findMany({
    select: {
      name: true,
      _count: {
        select: {
          winnerMatches: true,
          loserMatches: true,
        },
      },
    },
  });

  const description = characters.map((char) => {
    const { name, _count } = char;
    const { winnerMatches, loserMatches } = _count;
    const { winrate } = getWinrate(winnerMatches, loserMatches);
    const emoji =
      characterNameToEmoji[name as keyof typeof characterNameToEmoji];
    const formattedEmoji = emoji ? `${emoji} ` : "";

    return `${formattedEmoji}${name}: ${winnerMatches} Wins, ${loserMatches} Losses, Winrate: ${winrate}%`;
  });

  const embed = new EmbedBuilder()
    .setTitle("Character Stats")
    .setColor("Blurple")
    .setDescription(
      description.length > 0 ? description.join("\n") : "No characters found."
    );

  return embed;
}

async function breakdownCase(character: string): Promise<EmbedBuilder | null> {
  const data = await prismaClient.character.findUnique({
    where: { name: character },
    select: {
      winnerMatches: {
        where: {
          ladderReset: { endDate: null },
          loserCharacter: { name: { not: character } },
        },
        include: {
          loserCharacter: {
            select: { name: true },
          },
        },
      },
      loserMatches: {
        where: {
          ladderReset: { endDate: null },
          winnerCharacter: { name: { not: character } },
        },
        include: {
          winnerCharacter: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!data) {
    return null;
  }

  // opponent name -> match history against opponent
  const matchRecord = new Map<string, { wins: number; losses: number }>();
  const overallStats = { wins: 0, losses: 0 };

  for (const match of data.winnerMatches) {
    const loserCharacter = match.loserCharacter.name;
    const record = matchRecord.get(loserCharacter) ?? { wins: 0, losses: 0 };

    record.wins++;
    overallStats.wins++;
    matchRecord.set(loserCharacter, record);
  }

  for (const match of data.loserMatches) {
    const winnerCharacter = match.winnerCharacter.name;
    const record = matchRecord.get(winnerCharacter) ?? { wins: 0, losses: 0 };

    record.losses++;
    overallStats.losses++;
    matchRecord.set(winnerCharacter, record);
  }

  const overallWinrate =
    (overallStats.wins / (overallStats.wins + overallStats.losses)) * 100;

  const formattedRecord = Array.from(matchRecord.entries())
    .sort(([, recordA], [, recordB]) => {
      const winRateA = getWinrate(recordA.wins, recordA.losses).winrate;
      const winRateB = getWinrate(recordB.wins, recordB.losses).winrate;

      return winRateB - winRateA;
    })
    .map(([opponent, record]) => {
      const emoji =
        characterNameToEmoji[opponent as keyof typeof characterNameToEmoji];
      const formattedEmoji = emoji ? `${emoji} ` : "";
      const { wins, losses } = record;
      const { winrate } = getWinrate(wins, losses);

      return `${formattedEmoji}${opponent}: ${wins} Wins, ${losses} Losses, Winrate: ${winrate.toFixed(1)}%`;
    });

  const description = [
    `${overallStats.wins} Wins, ${overallStats.losses} Losses, Winrate: ${overallWinrate.toFixed(1)}%\n`,
    "Record against opponents",
    ...formattedRecord,
  ];

  const color = CHARACTER_MAP[character as CharacterName].cosmetic.color;

  const embed = new EmbedBuilder()
    .setTitle(`Match Stats for ${character}`)
    .setColor(color ?? "Blurple")
    .setDescription(
      description.length > 0 ? description.join("\n") : "No matches found."
    );

  return embed;
}

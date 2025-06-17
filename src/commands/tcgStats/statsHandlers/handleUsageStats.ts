import {
  ChatInputCommandInteraction,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
} from "discord.js";
import { CHARACTER_MAP } from "@tcg/characters/characterList";
import prismaClient from "@prismaClient";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { charWithEmoji } from "@tcg/formatting/emojis";
import querySeason from "@src/util/db/querySeason";

export default async function handleUsageStats(
  interaction: ChatInputCommandInteraction
) {
  const seasonId = interaction.options.getInteger("season");
  const seasonQuery = seasonId ? await querySeason(seasonId) : null;

  const data = await prismaClient.match.findMany({
    where: {
      ladderReset: seasonQuery ?? { endDate: null },
    },
    select: {
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
    },
  });

  const visibleMap = Object.entries(CHARACTER_MAP).filter(
    ([, character]) => character.additionalMetadata.hidden !== true
  );

  const usageMap = visibleMap.reduce(
    (map, [, character]) => {
      map[character.characterName] = {
        wins: 0,
        losses: 0,
      };
      return map;
    },
    {} as Record<string, { wins: number; losses: number }>
  );

  data.forEach((match) => {
    if (usageMap[match.winnerCharacter.name]) {
      usageMap[match.winnerCharacter.name].wins++;
    }
    if (usageMap[match.loserCharacter.name]) {
      usageMap[match.loserCharacter.name].losses++;
    }
  });

  const component = makeComponent(usageMap);

  await interaction.editReply({
    components: [component],
    flags: "IsComponentsV2",
  });
}

function makeComponent(
  usage: Record<CharacterName, { wins: number; losses: number }>
) {
  const totalSelections = Object.values(usage).reduce(
    (acc, stats) => acc + stats.wins + stats.losses,
    0
  );

  const sortedUsage = Object.entries(usage).sort(
    ([, a], [, b]) => b.wins + b.losses - (a.wins + a.losses)
  );

  const charCount = Object.entries(usage).length;
  const expectedUsage =
    charCount > 0 ? Math.round((100 / charCount) * 10) / 10 : 0;

  return new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("## Usage stats"),
      new TextDisplayBuilder().setContent(
        `### Total matches: ${totalSelections / 2}`
      ),
      new TextDisplayBuilder().setContent(`Expected usage: ${expectedUsage}%`)
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
    .addTextDisplayComponents(
      sortedUsage.map(([name, stats]) => {
        const { wins, losses } = stats;
        const characterMatches = wins + losses;
        const usagePercent =
          totalSelections > 0
            ? Math.round((characterMatches / totalSelections) * 1000) / 10
            : 0;

        return new TextDisplayBuilder().setContent(
          `${charWithEmoji(name as CharacterName)} - ${characterMatches} picks, ${usagePercent}% usage`
        );
      })
    );
}

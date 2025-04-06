import prismaClient from "@prismaClient";

export async function getRelativeRank(
  ladderResetId: number,
  playerRankPoints: number,
) {
  const relativeRank = await prismaClient.player.count({
    where: {
      ladderRanks: {
        some: {
          ladderResetId: ladderResetId,
          rankPoints: { gt: playerRankPoints },
        },
      },
    },
  });

  return relativeRank + 1;
}

export async function getRelativeCharacterRank(
  playerMasteryPoints: number,
  characterId: number,
) {
  const relativeRank = await prismaClient.player.count({
    where: {
      characterMasteries: {
        some: {
          characterId: characterId,
          masteryPoints: { gt: playerMasteryPoints },
        },
      },
    },
  });

  return relativeRank + 1;
}

export async function getTotalPlayers(ladderResetId: number) {
  return await prismaClient.player.count({
    where: {
      ladderRanks: {
        some: {
          ladderResetId,
        },
      },
    },
  });
}

export async function getTotalCharacterPlayers(characterId: number) {
  return await prismaClient.player.count({
    where: {
      characterMasteries: {
        some: {
          characterId,
        },
      },
    },
  });
}

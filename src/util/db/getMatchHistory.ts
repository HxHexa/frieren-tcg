import prismaClient from "@prismaClient";

export async function getMatchHistory(playerId: string) {
  const matches = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
      OR: [
        {
          winner: {
            discordId: playerId,
          },
        },
        {
          loser: {
            discordId: playerId,
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

  return matches;
}

export async function getMatchHistoryAgainstPlayer(
  player1: string,
  player2: string
) {
  const headToHeadMatches = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
      OR: [
        {
          winner: {
            discordId: player1,
          },
          loser: {
            discordId: player2,
          },
        },
        {
          winner: {
            discordId: player2,
          },
          loser: {
            discordId: player1,
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

  return headToHeadMatches;
}

export async function getMatchHistoryAgainstCharacter(
  playerId: string,
  characterId: string
) {
  const matches = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
      OR: [
        {
          winner: {
            discordId: playerId,
          },
        },
        {
          loser: {
            discordId: characterId,
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

  return matches;
}

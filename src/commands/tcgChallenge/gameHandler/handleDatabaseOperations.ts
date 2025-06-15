import { User, type ThreadChannel } from "discord.js";
import { GameMode } from "./gameSettings";
import prismaClient from "@prismaClient";
import { getOrCreatePlayers } from "@src/util/db/getPlayer";
import { getOrCreateCharacters } from "@src/util/db/getCharacter";
import { getCharacterMasteries } from "@src/util/db/getCharacterMastery";
import { getLadderRanks } from "@src/util/db/getLadderRank";
import {
  getRank,
  updateMemberRoles,
  Rank,
} from "./rankScoresToRankTitleMapping";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { createMatch } from "@src/util/db/createMatch";
import { getLatestLadderReset } from "@src/util/db/getLatestLadderReset";

const BASE_RANKED_POINT_GAIN = 20;

export type DatabaseOperationResult = {
  winnerRank: Rank | null;
  loserRank: Rank | null;
  winnerNewRank: Rank | null;
  loserNewRank: Rank | null;
  winnerRankedUp: boolean;
  loserRankedDown: boolean;
  winnerScoreGain: number | null;
  loserScoreLoss: number | null;
  winnerNewPoints: number | null;
  loserNewPoints: number | null;
};

export const handleDatabaseOperations = async (props: {
  winner: User;
  loser: User;
  winnerCharacter: CharacterName;
  loserCharacter: CharacterName;
  ranked: boolean;
  gameMode: GameMode;
  gameThread: ThreadChannel;
}): Promise<DatabaseOperationResult> => {
  const {
    winner,
    loser,
    winnerCharacter,
    loserCharacter,
    ranked,
    gameMode,
    gameThread,
  } = props;

  let winnerRank: Rank | null = null,
    loserRank: Rank | null = null,
    winnerRankedUp: boolean = false,
    loserRankedDown: boolean = false,
    winnerNewRank: Rank | null = null,
    loserNewRank: Rank | null = null,
    winnerScoreGain: number | null = null,
    loserScoreLoss: number | null = null,
    winnerNewPoints: number | null = null,
    loserNewPoints: number | null = null;

  const client = gameThread.client;

  // get latest reset
  const currLadderReset = await getLatestLadderReset({ gamemode: gameMode });

  if (currLadderReset) {
    // fetch the players and characters
    const [winnerDbObject, loserDbObject] = await getOrCreatePlayers([
      winner.id,
      loser.id,
    ]);
    const [winnerCharacterDbObject, loserCharacterDbObject] =
      await getOrCreateCharacters([winnerCharacter, loserCharacter]);
    if (
      winnerDbObject &&
      loserDbObject &&
      winnerCharacterDbObject &&
      loserCharacterDbObject
    ) {
      // create the match object for stat tracking
      createMatch({
        ladderResetId: currLadderReset.id,
        winnerId: winnerDbObject.id,
        winnerCharacterId: winnerCharacterDbObject.id,
        loserId: loserDbObject.id,
        loserCharacterId: loserCharacterDbObject.id,
        threadId: gameThread.id,
      });

      // fetch respective ladderrank and charactermastery objects if ranked
      if (ranked) {
        const [winnerLadderRank, loserLadderRank] = await getLadderRanks([
          {
            playerId: winnerDbObject.id,
            ladderResetId: currLadderReset.id,
          },
          {
            playerId: loserDbObject.id,
            ladderResetId: currLadderReset.id,
          },
        ]);

        const [winnerCharacterMastery, loserCharacterMastery] =
          await getCharacterMasteries([
            {
              playerId: winnerDbObject.id,
              characterId: winnerCharacterDbObject.id,
            },
            {
              playerId: loserDbObject.id,
              characterId: loserCharacterDbObject.id,
            },
          ]);

        if (winnerLadderRank && loserLadderRank) {
          // score gain and loss calculation
          winnerRank = getRank(winnerLadderRank.rankPoints);
          loserRank = getRank(loserLadderRank.rankPoints);

          const rankDiff = loserRank.rankLevel - winnerRank.rankLevel;
          const cappedRankDiff = Math.min(1, Math.max(-2, rankDiff));
          winnerScoreGain = BASE_RANKED_POINT_GAIN * 2 ** cappedRankDiff;
          loserScoreLoss = loserRank.rankLevel >= 3 ? winnerScoreGain / 2 : 0;

          winnerNewPoints = winnerLadderRank.rankPoints + winnerScoreGain;
          loserNewPoints = loserLadderRank.rankPoints - loserScoreLoss;
          winnerNewRank = getRank(winnerNewPoints);
          loserNewRank = getRank(loserNewPoints);

          winnerRankedUp = winnerNewRank.rankLevel > winnerRank.rankLevel;
          loserRankedDown = loserNewRank.rankLevel < loserRank.rankLevel;

          if (winnerRankedUp) {
            await updateMemberRoles(client, winner, winnerNewRank);
          }

          if (loserRankedDown) {
            await updateMemberRoles(client, loser, loserNewRank);
          }

          // update ladder rank
          prismaClient.$transaction(async (tx) => {
            await Promise.all([
              tx.ladderRank.update({
                where: {
                  id: winnerLadderRank.id,
                },
                data: {
                  rankPoints: {
                    increment: winnerScoreGain ?? 0,
                  },
                },
              }),
              tx.ladderRank.update({
                where: {
                  id: loserLadderRank.id,
                },
                data: {
                  rankPoints: {
                    decrement: loserScoreLoss ?? 0,
                  },
                },
              }),
            ]);
          });

          // update character mastery
          if (winnerCharacterMastery && loserCharacterMastery) {
            prismaClient.$transaction(async (tx) => {
              await Promise.all([
                tx.characterMastery.update({
                  where: {
                    id: winnerCharacterMastery.id,
                  },
                  data: {
                    masteryPoints: {
                      increment: winnerScoreGain ?? 0,
                    },
                    wins: {
                      increment: 1,
                    },
                  },
                }),
                tx.characterMastery.update({
                  where: {
                    id: loserCharacterMastery.id,
                  },
                  data: {
                    masteryPoints: {
                      decrement: loserScoreLoss ?? 0,
                    },
                    losses: {
                      increment: 1,
                    },
                  },
                }),
              ]);
            });
          } else {
            const errors = [];
            if (!winnerCharacterMastery) {
              errors.push(
                `Failed to find or create winner character mastery for player ${winner.id} and character ${winnerCharacter}`
              );
            }
            if (!loserCharacterMastery) {
              errors.push(
                `Failed to find or create loser character mastery for player ${winner.id} and character ${loserCharacter}`
              );
            }
            throw new Error(errors.join(";"));
          }
        } else {
          const errors = [];
          if (!winnerLadderRank) {
            errors.push(
              `Failed to find or create winner ladder rank for player ${winner.id} and ladderReset ${currLadderReset.id}`
            );
          }
          if (!loserLadderRank) {
            errors.push(
              `Failed to find or create loser ladder rank for player ${winner.id} and ladderReset ${currLadderReset.id}`
            );
          }
          throw new Error(errors.join(";"));
        }
      }
    } else {
      const errors = [];
      if (!winnerDbObject) {
        errors.push(
          `Failed to find or create winning player ${winner.id} in database`
        );
      }
      if (!winnerCharacterDbObject) {
        errors.push(
          `Failed to find winning character ${winnerCharacter} in database`
        );
      }
      if (!loserDbObject) {
        errors.push(
          `Failed to find or create losing player ${loser.id} in database`
        );
      }
      if (!loserCharacterDbObject) {
        errors.push(
          `Failed to find losing character ${loserCharacter} in database`
        );
      }
      throw new Error(errors.join(";"));
    }
  } else {
    throw new Error(`No active ladder reset found for gameMode ${gameMode}`);
  }

  return {
    winnerRank,
    loserRank,
    winnerNewRank,
    loserNewRank,
    winnerRankedUp,
    loserRankedDown,
    winnerScoreGain,
    loserScoreLoss,
    winnerNewPoints,
    loserNewPoints,
  };
};

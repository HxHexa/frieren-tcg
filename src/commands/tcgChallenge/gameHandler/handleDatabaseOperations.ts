import { EmbedBuilder, User, type ThreadChannel } from "discord.js";
import { GameMode } from "./gameSettings";
import prismaClient from "../../../../prisma/client";
import { getOrCreatePlayers } from "@src/util/db/getPlayer";
import { getOrCreateCharacters } from "@src/util/db/getCharacter";
import { getCharacterMasteries } from "@src/util/db/getCharacterMastery";
import { getLadderRanks } from "@src/util/db/getLadderRank";
import { getRank, updateMemberRoles } from "./rankScoresToRankTitleMapping";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { createMatch } from "@src/util/db/createMatch";
import { getLatestLadderReset } from "@src/util/db/getLatestLadderReset";

const BASE_RANKED_POINT_GAIN = 20;

export const handleDatabaseOperationsWithResultEmbedSideEffect = async (props: {
  winner: User;
  loser: User;
  winnerCharacter: CharacterName;
  loserCharacter: CharacterName;
  ranked: boolean;
  gameMode: GameMode;
  resultEmbed: EmbedBuilder;
  gameThread: ThreadChannel;
}): Promise<EmbedBuilder> => {
  const {
    winner,
    loser,
    winnerCharacter,
    loserCharacter,
    ranked,
    gameMode,
    resultEmbed,
    gameThread,
  } = props;

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
          const winnerRank = getRank(winnerLadderRank.rankPoints);
          const loserRank = getRank(loserLadderRank.rankPoints);

          const rankDiff = loserRank.rankLevel - winnerRank.rankLevel;
          const cappedRankDiff = Math.min(1, Math.max(-2, rankDiff));
          const winnerScoreGain = BASE_RANKED_POINT_GAIN * 2 ** cappedRankDiff;
          const loserScoreLoss =
            loserRank.rankLevel >= 3 ? winnerScoreGain / 2 : 0;

          // update embed
          const winnerNewPoints = winnerLadderRank.rankPoints + winnerScoreGain;
          const loserNewPoints = loserLadderRank.rankPoints - loserScoreLoss;
          const winnerNewRank = getRank(winnerNewPoints);
          const loserNewRank = getRank(loserNewPoints);

          const winnerRankedUp = winnerNewRank.rankLevel > winnerRank.rankLevel;
          const loserRankedDown = loserNewRank.rankLevel < loserRank.rankLevel;

          if (winnerRankedUp) {
            await updateMemberRoles(client, winner, winnerNewRank);
          }

          if (loserRankedDown) {
            await updateMemberRoles(client, loser, loserNewRank);
          }

          resultEmbed.addFields(
            {
              name: `Winner: ${winner.displayName}`,
              value: `Rank Points: ${winnerNewPoints} (${winnerScoreGain > 0 ? `+**${winnerScoreGain}**` : "Unchanged"}) ${winnerRankedUp ? `(Rank Up! New Rank: **${winnerNewRank.rankTitle}**)` : ""}`,
            },
            {
              name: `Loser: ${loser.displayName}`,
              value: `Rank Points: ${loserNewPoints} (${loserScoreLoss > 0 ? `-**${loserScoreLoss}**` : "Unchanged"}) ${loserRankedDown ? `(Rank Down... New Rank: **${loserNewRank.rankTitle}**)` : ""}`,
            }
          );

          // update ladder rank
          prismaClient.$transaction(async (tx) => {
            await Promise.all([
              tx.ladderRank.update({
                where: {
                  id: winnerLadderRank.id,
                },
                data: {
                  rankPoints: {
                    increment: winnerScoreGain,
                  },
                },
              }),
              tx.ladderRank.update({
                where: {
                  id: loserLadderRank.id,
                },
                data: {
                  rankPoints: {
                    decrement: loserScoreLoss,
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
                      increment: winnerScoreGain,
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
                      decrement: loserScoreLoss,
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

  return resultEmbed;
};

import {
  PublicThreadChannel,
  PrivateThreadChannel,
  User,
  ThreadChannel,
} from "discord.js";
import { GameSettings } from "./commands/tcgChallenge/gameHandler/gameSettings";
import Character from "./tcg/character";
import { getPlayerCharacter } from "./tcgChatInteractions/getPlayerCharacter";
import Game from "./tcg/game";
import { MessageCache } from "./tcgChatInteractions/messageCache";
import {
  sendToThread,
  TCGThread,
  TCGThreads,
} from "./tcgChatInteractions/sendGameMessage";
import { printGameState } from "./tcgChatInteractions/printGameState";
import Card from "./tcg/card";
import { printCharacter } from "./tcgChatInteractions/printCharacter";
import TimedEffect from "./tcg/timedEffect";
import { playSelectedMove } from "./tcgChatInteractions/playSelectedMove";
import { CharacterName } from "./tcg/characters/metadata/CharacterName";

const TURN_LIMIT = 50;

export const tcgMain = async (
  challenger: User,
  opponent: User,
  gameThread: PublicThreadChannel<false>,
  challengerThread: PrivateThreadChannel,
  opponentThread: ThreadChannel<false>,
  gameSettings: GameSettings,
): Promise<{
  winner?: User;
  winnerCharacter?: CharacterName;
  loser?: User;
  loserCharacter?: CharacterName;
}> => {
  let result: {
    winner?: User;
    winnerCharacter?: CharacterName;
    loser?: User;
    loserCharacter?: CharacterName;
  } = {
    winner: undefined,
    loser: undefined,
  };

  const indexToUserMapping: Record<number, User> = {
    0: challenger,
    1: opponent,
  };

  // game start - ask for character selection
  const challengerCharacterResponsePromise = getPlayerCharacter(
    challenger,
    challengerThread,
  );
  const opponentCharacterResponsePromise = getPlayerCharacter(
    opponent,
    opponentThread,
  );
  const [challengerCharacter, opponentCharacter] = await Promise.all([
    challengerCharacterResponsePromise,
    opponentCharacterResponsePromise,
  ]);

  if (!challengerCharacter || !opponentCharacter) {
    return result;
  }
  const challengerCharacterName = challengerCharacter.name as CharacterName;
  const opponentCharacterName = opponentCharacter.name as CharacterName;

  const messageCache = new MessageCache();
  const threadsMapping: TCGThreads = {
    [TCGThread.Gameroom]: gameThread,
    [TCGThread.ChallengerThread]: challengerThread,
    [TCGThread.OpponentThread]: opponentThread,
  };

  const game = new Game(
    [
      new Character({
        characterData: challengerCharacter.clone(),
        messageCache: messageCache,
        characterUser: challenger,
        characterThread: TCGThread.ChallengerThread,
      }),
      new Character({
        characterData: opponentCharacter.clone(),
        messageCache: messageCache,
        characterUser: opponent,
        characterThread: TCGThread.OpponentThread,
      }),
    ],
    messageCache,
  );
  game.gameStart();

  // game loop
  while (!game.gameOver) {
    game.turnCount += 1;
    messageCache.push(`# Turn ${game.turnCount}`, TCGThread.Gameroom);

    // start of turn resolution
    game.characters.forEach((character: Character, characterIndex: number) => {
      character.additionalMetadata.attackedThisTurn = false;
      character.additionalMetadata.timedEffectAttackedThisTurn = false;
      character.ability.abilityStartOfTurnEffect?.(
        game,
        characterIndex,
        messageCache,
      );
    });
    printGameState(game, messageCache);

    if (game.turnCount === TURN_LIMIT) {
      game.gameOver = true;
      messageCache.push(
        `## 50 Turn Limit Reached - Game Over!`,
        TCGThread.Gameroom,
      );
    }

    await sendToThread(
      messageCache.flush(TCGThread.Gameroom),
      TCGThread.Gameroom,
      threadsMapping,
      1000,
    );

    if (game.turnCount === TURN_LIMIT) {
      return {
        winner: undefined,
        loser: undefined,
      };
    }

    // display playable cards
    const characterToPlayableMoveMap: Record<number, Record<string, Card>> = {};
    const characterToDetailsString: Record<
      number,
      { draw: string; hand: string }
    > = {
      0: { draw: "", hand: "" },
      1: { draw: "", hand: "" },
    };

    // get playable cards for round
    await Promise.all(
      game.characters.map(async (character, index) => {
        const useChannel =
          index === 0 ? TCGThread.ChallengerThread : TCGThread.OpponentThread;
        messageCache.push(printCharacter(character, false), useChannel);
        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          1000,
        );

        if (character.skipTurn) {
          messageCache.push(
            `## ${character.name} skips this turn!`,
            useChannel,
          );
          character.empowerHand();
          messageCache.push(
            `All cards in ${character.name}'s hand are empowered!`,
            TCGThread.Gameroom,
          );
          messageCache.push(
            `All cards in ${character.name}'s hand are empowered!`,
            useChannel,
          );
        } else {
          character.printHand(useChannel);
          if (gameSettings.revealHand) {
            characterToDetailsString[index].hand =
              messageCache.messages[useChannel].join("\n");
          }

          const currUsableCards = character.getUsableCardsForRound(useChannel);
          characterToPlayableMoveMap[index] = currUsableCards;
          await sendToThread(
            messageCache.flush(useChannel),
            useChannel,
            threadsMapping,
            1000,
          );

          messageCache.push(`## ${character.name}'s Draws:`, useChannel);
          await sendToThread(
            messageCache.flush(useChannel),
            useChannel,
            threadsMapping,
            1000,
          );

          let draws: string[] = [];
          // let vpollOptionsList = "";
          // const optionsCount = Object.keys(currUsableCards).length;

          Object.keys(currUsableCards).forEach((key: string) => {
            const currCard = currUsableCards[key];
            draws.push(currCard.printCard(`- ${key}: `));
            // vpollOptionsList += `${key}: ${currCard.getTitle()}`;
            // if (index < optionsCount - 1) {
            //   vpollOptionsList += ", ";
            // }
          });

          const draw = draws.join("\n");
          messageCache.push(draw, useChannel);
          // messageCache.push(
          //   `Vpoll command - /vpoll name:Which Move To Use? options:${vpollOptionsList} end-time:2m multiselect:True`,
          //   useChannel,
          // );

          if (gameSettings.revealDraw) {
            characterToDetailsString[index].draw = draw;
          }
        }

        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          1000,
        );
      }),
    );

    // reveal hand and draw if set
    for (const [index, character] of game.characters.entries()) {
      if (gameSettings.revealHand) {
        await sendToThread(
          [characterToDetailsString[index].hand],
          TCGThread.Gameroom,
          threadsMapping,
          100,
        );
      }
      if (gameSettings.revealDraw) {
        await sendToThread(
          [
            `## ${character.name}'s Draws: `,
            characterToDetailsString[index].draw,
          ],
          TCGThread.Gameroom,
          threadsMapping,
          100,
        );
      }
    }

    // move selection step
    game.additionalMetadata.currentDraws = characterToPlayableMoveMap;

    const challengerSelectedMovePromise = playSelectedMove(
      challenger,
      challengerThread,
      game.characters[0],
      characterToPlayableMoveMap[0],
      gameSettings.turnDurationSeconds,
    );
    const opponentSelectedMovePromise = playSelectedMove(
      opponent,
      opponentThread,
      game.characters[1],
      characterToPlayableMoveMap[1],
      gameSettings.turnDurationSeconds,
    );
    const [challengerSelectedMove, opponentSelectedMove] = await Promise.all([
      challengerSelectedMovePromise,
      opponentSelectedMovePromise,
    ]);

    const characterToSelectedMoveMap: Record<number, Card> = {};
    if (challengerSelectedMove) {
      characterToSelectedMoveMap[0] = challengerSelectedMove;
    }
    if (opponentSelectedMove) {
      characterToSelectedMoveMap[1] = opponentSelectedMove;
    }

    // move resolution step
    const moveFirst = game.getFirstMove(characterToSelectedMoveMap);
    const moveOrder = [moveFirst, 1 - moveFirst];

    messageCache.push(
      `## ================================`,
      TCGThread.Gameroom,
    );
    moveOrder.forEach(async (characterIndex: number) => {
      if (!game.gameOver) {
        const card = characterToSelectedMoveMap[characterIndex];
        if (card) {
          const character = game.getCharacter(characterIndex);
          messageCache.push(
            `## ${character.cosmetic.emoji} ${character.name} (${characterIndex === 0 ? `${challenger.username}` : `${opponent.username}`}) used **${card.emoji} ${card.getTitle()}**${card.cosmetic?.cardImageUrl ? `[⠀](${card.cosmetic?.cardImageUrl})` : "!"}`,
            TCGThread.Gameroom,
          );
          if (card.cosmetic?.cardGif) {
            messageCache.push(
              `[⠀](${card.cosmetic?.cardGif})`,
              TCGThread.Gameroom,
            );
          }
          card.cardAction?.(game, characterIndex, messageCache);
          if (character.ability.abilityOnCardUse) {
            character.ability.abilityOnCardUse(
              game,
              characterIndex,
              messageCache,
              card,
            );
          }
        }

        // check game over state after each move if the player didn't forfeit
        if (!game.additionalMetadata.forfeited[characterIndex]) {
          const losingCharacterIndex = game.checkGameOver();
          if (game.gameOver) {
            result = {
              winner: indexToUserMapping[1 - losingCharacterIndex!],
              winnerCharacter:
                losingCharacterIndex === 0
                  ? opponentCharacterName
                  : challengerCharacterName,
              loser: indexToUserMapping[losingCharacterIndex!],
              loserCharacter:
                losingCharacterIndex === 0
                  ? challengerCharacterName
                  : opponentCharacterName,
            };
            return;
          }
        }
      }
    });

    // check forfeited tie cases
    if (
      game.additionalMetadata.forfeited[0] &&
      game.additionalMetadata.forfeited[1]
    ) {
      game.gameOver = true;
      result = {
        winner: undefined,
        loser: undefined,
      };
      messageCache.push(
        "# Both side foreited! The game ended in a draw!",
        TCGThread.Gameroom,
      );
    }

    // end of turn resolution
    // gather timed effects
    messageCache.push(
      `## ================================`,
      TCGThread.Gameroom,
    );
    let priorityToTimedEffect: Record<
      number,
      Record<number, TimedEffect[]>
    > = {};
    game.characters.forEach((character: Character, characterIndex: number) => {
      character.timedEffects.forEach((timedEffect: TimedEffect) => {
        if (!priorityToTimedEffect[timedEffect.priority]) {
          priorityToTimedEffect[timedEffect.priority] = {};
        }
        if (!priorityToTimedEffect[timedEffect.priority][characterIndex]) {
          priorityToTimedEffect[timedEffect.priority][characterIndex] = [];
        }
        priorityToTimedEffect[timedEffect.priority][characterIndex].push(
          timedEffect,
        );
      });
    });

    // timed effect resolution
    const sortedPriorities = Object.keys(priorityToTimedEffect)
      .map(Number)
      .sort((a, b) => b - a);

    for (const priority of sortedPriorities) {
      moveOrder.forEach((characterIndex: number) => {
        if (!game.gameOver) {
          const currTimedEffects =
            priorityToTimedEffect[priority][characterIndex];

          if (currTimedEffects) {
            currTimedEffects.forEach((timedEffect: TimedEffect) => {
              timedEffect.reduceTimedEffect(game, characterIndex, messageCache);
            });

            const losingCharacterIndex = game.checkGameOver();
            if (game.gameOver) {
              result = {
                winner: indexToUserMapping[1 - losingCharacterIndex!],
                winnerCharacter:
                  losingCharacterIndex === 0
                    ? opponentCharacterName
                    : challengerCharacterName,
                loser: indexToUserMapping[losingCharacterIndex!],
                loserCharacter:
                  losingCharacterIndex === 0
                    ? challengerCharacterName
                    : opponentCharacterName,
              };
              return;
            }
          }
        }
      });
    }

    // handle end of turn ability and clean up
    moveOrder.forEach((characterIndex: number) => {
      if (!game.gameOver) {
        const character = game.getCharacter(characterIndex);
        character.removeExpiredTimedEffects();
        character.ability.abilityEndOfTurnEffect?.(
          game,
          characterIndex,
          messageCache,
        );

        const losingCharacterIndex = game.checkGameOver();
        if (game.gameOver) {
          result = {
            winner: indexToUserMapping[1 - losingCharacterIndex!],
            winnerCharacter:
              losingCharacterIndex === 0
                ? opponentCharacterName
                : challengerCharacterName,
            loser: indexToUserMapping[losingCharacterIndex!],
            loserCharacter:
              losingCharacterIndex === 0
                ? challengerCharacterName
                : opponentCharacterName,
          };
          return;
        }
      }
    });
    game.additionalMetadata.lastUsedCards = characterToSelectedMoveMap;

    if (game.gameOver) {
      // immediately flush message cache
      printGameState(game, messageCache, false);
      messageCache.push("# Game over!", TCGThread.Gameroom);
      await sendToThread(
        messageCache.flush(TCGThread.Gameroom),
        TCGThread.Gameroom,
        threadsMapping,
        1000,
      );
    }
  }

  return result;
};

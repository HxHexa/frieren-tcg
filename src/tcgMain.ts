import goddessDeck from "@decks/utilDecks/goddessDeck";
import Card, { Nature } from "@tcg/card";
import Character from "@tcg/character";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { charWithEmoji } from "@tcg/formatting/emojis";
import Game from "@tcg/game";
import {
  gameAndMessageContext,
  timedEffectContext,
} from "@tcg/gameContextProvider";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import {
  PrivateThreadChannel,
  PublicThreadChannel,
  ThreadChannel,
  User,
} from "discord.js";
import { GameSettings } from "./commands/tcgChallenge/gameHandler/gameSettings";
import { FlammeResearch } from "./tcg/additionalMetadata/gameAdditionalMetadata";
import { getPlayerBans } from "./tcgChatInteractions/getPlayerBans";
import { getPlayerCharacter } from "./tcgChatInteractions/getPlayerCharacter";
import { CharacterSelectionType } from "./tcgChatInteractions/handleCharacterSelection";
import { MessageCache } from "./tcgChatInteractions/messageCache";
import { playSelectedMove } from "./tcgChatInteractions/playSelectedMove";
import { printCharacter } from "./tcgChatInteractions/printCharacter";
import { printGameState } from "./tcgChatInteractions/printGameState";
import {
  sendToThread,
  TCGThread,
  TCGThreads,
} from "./tcgChatInteractions/sendGameMessage";

const TURN_LIMIT = 50;

const formatInlineList = (items: string[]): string => {
  if (items.length === 0) {
    return "";
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

export type TCGResult = {
  winner?: User;
  winnerCharacter?: CharacterName;
  loser?: User;
  loserCharacter?: CharacterName;
  challengerCharacter?: CharacterName;
  opponentCharacter?: CharacterName;
};

export const tcgMain = async (
  challenger: User,
  opponent: User,
  gameThread: PublicThreadChannel<false>,
  challengerThread: PrivateThreadChannel,
  opponentThread: ThreadChannel<false>,
  gameSettings: GameSettings,
  textSpeedMs: number
): Promise<TCGResult> => {
  let result: TCGResult = {
    winner: undefined,
    loser: undefined,
  };

  const indexToUserMapping: Record<number, User> = {
    0: challenger,
    1: opponent,
  };

  const messageCache = new MessageCache();
  const threadsMapping: TCGThreads = {
    [TCGThread.Gameroom]: gameThread,
    [TCGThread.ChallengerThread]: challengerThread,
    [TCGThread.OpponentThread]: opponentThread,
  };

  const bansPerPlayer = Math.max(0, Math.min(4, gameSettings.banCount ?? 0));
  const bannedCharacterSet = new Set<CharacterName>();

  if (bansPerPlayer > 0) {
    const banPhaseIntro =
      bansPerPlayer === 1
        ? "⭕ Ban phase started! Each player may ban 1 character."
        : `⭕ Ban phase started! Each player may ban ${bansPerPlayer} characters.`;
    messageCache.push(`## ${banPhaseIntro}`, TCGThread.Gameroom);
    await sendToThread(
      messageCache.flush(TCGThread.Gameroom),
      TCGThread.Gameroom,
      threadsMapping,
      textSpeedMs
    );

    const [challengerBans, opponentBans] = await Promise.all([
      getPlayerBans(challenger, challengerThread, bansPerPlayer),
      getPlayerBans(opponent, opponentThread, bansPerPlayer),
    ]);

    [...challengerBans, ...opponentBans].forEach((name) =>
      bannedCharacterSet.add(name)
    );

    const bannedCharacters = Array.from(bannedCharacterSet).sort((a, b) =>
      a.localeCompare(b)
    );

    if (bannedCharacters.length > 0) {
      const formattedList = formatInlineList(
        bannedCharacters.map((name) => charWithEmoji(name))
      );
      const announcement = `🚫 Banned characters: ${formattedList}!`;

      messageCache.push(`## ${announcement}`, TCGThread.Gameroom);
      messageCache.push(`## ${announcement}`, TCGThread.ChallengerThread);
      messageCache.push(`## ${announcement}`, TCGThread.OpponentThread);

      await Promise.all([
        sendToThread(
          messageCache.flush(TCGThread.Gameroom),
          TCGThread.Gameroom,
          threadsMapping,
          textSpeedMs
        ),
        sendToThread(
          messageCache.flush(TCGThread.ChallengerThread),
          TCGThread.ChallengerThread,
          threadsMapping,
          Math.max(200, textSpeedMs / 2)
        ),
        sendToThread(
          messageCache.flush(TCGThread.OpponentThread),
          TCGThread.OpponentThread,
          threadsMapping,
          Math.max(200, textSpeedMs / 2)
        ),
      ]);
    }
  }

  const handleGameResult = (
    props: { losingCharacterIndex: number } | { tie: true }
  ) => {
    let newResultInfo = {};

    if ("tie" in props && props.tie) {
      newResultInfo = { winner: undefined, loser: undefined };
    } else {
      const losingCharacterIndex = (props as { losingCharacterIndex: number })
        .losingCharacterIndex;
      newResultInfo = {
        winner: indexToUserMapping[1 - losingCharacterIndex],
        winnerCharacter:
          losingCharacterIndex === 0
            ? opponentCharacterName
            : challengerCharacterName,
        loser: indexToUserMapping[losingCharacterIndex],
        loserCharacter:
          losingCharacterIndex === 0
            ? challengerCharacterName
            : opponentCharacterName,
      };
    }

    result = { ...result, ...newResultInfo };
  };

  // game start - ask for character selection
  const challengerCharacterResponsePromise = getPlayerCharacter(
    challenger,
    challengerThread,
    bannedCharacterSet
  );
  const opponentCharacterResponsePromise = getPlayerCharacter(
    opponent,
    opponentThread,
    bannedCharacterSet
  );
  const [challengerSelection, opponentSelection] = await Promise.all([
    challengerCharacterResponsePromise,
    opponentCharacterResponsePromise,
  ]);

  if (!challengerSelection || !opponentSelection) {
    return result;
  }
  const challengerCharacterName = challengerSelection.char.characterName;
  const opponentCharacterName = opponentSelection.char.characterName;

  result.challengerCharacter = challengerCharacterName;
  result.opponentCharacter = opponentCharacterName;

  const challengerChar = challengerSelection.char.clone();
  const opponentChar = opponentSelection.char.clone();

  if (gameSettings.goddessMode) {
    [challengerChar, opponentChar].forEach((selection) => {
      selection.cards = goddessDeck.map((card) => ({
        card: card.clone(),
        count: 1,
      }));
    });
  }

  const game = new Game(
    [
      new Character({
        characterData: challengerChar,
        messageCache: messageCache,
        characterUser: challenger,
        characterThread: TCGThread.ChallengerThread,
      }),
      new Character({
        characterData: opponentChar,
        messageCache: messageCache,
        characterUser: opponent,
        characterThread: TCGThread.OpponentThread,
      }),
    ],
    messageCache,
    gameSettings
  );

  // update manaSuppression
  game.characters.forEach((character: Character, characterIndex: number) => {
    const opponent = game.getCharacter(1 - characterIndex);
    if (opponent.additionalMetadata.ignoreManaSuppressed) {
      character.additionalMetadata.manaSuppressed = false;
    }
  });

  game.gameStart();

  [challengerSelection, opponentSelection].forEach((selection, i) => {
    const username = i === 0 ? challenger.displayName : opponent.displayName;
    let message: string;

    switch (selection.selectionType) {
      case CharacterSelectionType.Random:
        message = `## ${username} rolled the dice and got ${selection.char.cosmetic.emoji} **${selection.char.characterName}**!`;
        break;
      case CharacterSelectionType.FavouriteRandom:
        message = `## ${username} rolled the dice from their favourite characters and got ${selection.char.cosmetic.emoji} **${selection.char.characterName}**!`;
        break;
      default:
        message = `## ${username} selected ${selection.char.cosmetic.emoji} **${selection.char.characterName}**!`;
        break;
    }

    messageCache.push(message, TCGThread.Gameroom);
  });

  // game loop
  while (!game.gameOver) {
    if (
      !game.additionalMetadata.flammeTheory.Balance ||
      !(
        game.additionalMetadata.flammeResearch?.[0]?.[
          FlammeResearch.ThousandYearSanctuary
        ] ||
        game.additionalMetadata.flammeResearch?.[1]?.[
          FlammeResearch.ThousandYearSanctuary
        ]
      )
    ) {
      game.turnCount += 1;
    }

    messageCache.push(`# Turn ${game.turnCount}`, TCGThread.Gameroom);

    // start of turn resolution
    game.characters.forEach((character: Character, characterIndex: number) => {
      character.additionalMetadata.attackedThisTurn = false;
      character.additionalMetadata.timedEffectAttackedThisTurn = false;
      character.ability.abilityStartOfTurnEffect?.(
        game,
        characterIndex,
        messageCache
      );

      if (game.additionalMetadata.flammeTheory.Balance) {
        character.hand.forEach((card) => {
          card.empowerLevel = game.turnCount;
        });
      }

      if (game.additionalMetadata.flammeTheory.Irreversibility) {
        if (
          game.additionalMetadata.flammeResearch[1 - characterIndex][
            FlammeResearch.MilleniumBarrier
          ]
        ) {
          character.additionalMetadata.opponentMilleniumBarrierActive = true;
        } else {
          character.additionalMetadata.opponentMilleniumBarrierActive = false;
        }
      }
    });
    printGameState(game, messageCache);

    if (game.turnCount === TURN_LIMIT) {
      game.gameOver = true;
      messageCache.push(
        `## ${TURN_LIMIT} Turn Limit Reached - Game Over!`,
        TCGThread.Gameroom
      );
    }

    await sendToThread(
      messageCache.flush(TCGThread.Gameroom),
      TCGThread.Gameroom,
      threadsMapping,
      textSpeedMs
    );

    if (game.turnCount === TURN_LIMIT) {
      handleGameResult({ tie: true });
      return result;
    }

    // display playable cards
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
        messageCache.push(printCharacter(game, character, false), useChannel);
        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          textSpeedMs
        );

        if (character.skipTurn) {
          messageCache.push(
            `## ${character.name} skips this turn!`,
            useChannel
          );
        }

        character.printHand(useChannel);
        if (gameSettings.revealHand) {
          characterToDetailsString[index].hand =
            messageCache.messages[useChannel].join("\n");
        }

        const currUsableCards = character.getUsableCardsForRound(
          useChannel,
          game,
          index
        );

        // executeAfterCardRolls, but before display to ensure the player sees the effects
        game.additionalMetadata.currentPlayableMoves[index] = currUsableCards;
        character.timedEffects.forEach((timedEffect) => {
          if (timedEffect.executeAfterCardRolls) {
            const context = timedEffectContext(game, index, messageCache);
            timedEffect.executeAfterCardRolls(context);
          }
        });

        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          textSpeedMs
        );

        messageCache.push(`## ${character.name}'s Active Cards:`, useChannel);
        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          textSpeedMs
        );

        const draws: string[] = [];
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

        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          textSpeedMs
        );
      })
    );

    // reveal hand and draw if set
    for (const [index, character] of game.characters.entries()) {
      if (gameSettings.revealHand) {
        await sendToThread(
          [characterToDetailsString[index].hand],
          TCGThread.Gameroom,
          threadsMapping,
          textSpeedMs / 10
        );
      }
      if (gameSettings.revealDraw) {
        await sendToThread(
          [
            `## ${character.name}'s Active Cards: `,
            characterToDetailsString[index].draw,
          ],
          TCGThread.Gameroom,
          threadsMapping,
          textSpeedMs / 10
        );
      }
    }

    // move selection step
    const challengerSelectedMovePromise = playSelectedMove(
      challenger,
      challengerThread,
      game.characters[0],
      game.additionalMetadata.currentPlayableMoves[0],
      gameSettings.turnDurationSeconds
    );
    const opponentSelectedMovePromise = playSelectedMove(
      opponent,
      opponentThread,
      game.characters[1],
      game.additionalMetadata.currentPlayableMoves[1],
      gameSettings.turnDurationSeconds
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

    // set the selected moves for each character to be used as metadata
    Object.entries(characterToSelectedMoveMap).forEach(([key, value]) => {
      game.characters[Number(key)].additionalMetadata.selectedCard = value;
    });

    // move resolution step
    game.characters.forEach((character: Character, characterIndex: number) => {
      if (character.ability.abilitySelectedMoveModifierEffect) {
        // do not modify status cards
        if (
          characterToSelectedMoveMap[characterIndex].cardMetadata.nature !==
          Nature.Status
        ) {
          characterToSelectedMoveMap[characterIndex] =
            character.ability.abilitySelectedMoveModifierEffect(
              game,
              characterIndex,
              messageCache,
              characterToSelectedMoveMap[characterIndex].clone()
            );
        }
      }
    });
    const moveFirst = game.getFirstMove(characterToSelectedMoveMap);
    const moveOrder = [moveFirst, 1 - moveFirst];

    messageCache.push(
      `## ================================`,
      TCGThread.Gameroom
    );
    moveOrder.forEach(async (characterIndex: number) => {
      if (!game.gameOver) {
        const card = characterToSelectedMoveMap[characterIndex];
        if (card) {
          const character = game.getCharacter(characterIndex);
          const opponentCharacter = game.getCharacter(1 - characterIndex);
          messageCache.push(
            `## ${character.cosmetic.emoji} ${character.name} used **${card.emoji} ${card.getTitle()}**${card.cosmetic?.cardImageUrl && !game.gameSettings.liteMode ? `[⠀](${card.cosmetic?.cardImageUrl})` : "!"}`,
            TCGThread.Gameroom
          );
          if (card.cosmetic?.cardGif && !game.gameSettings.liteMode) {
            // look into discord's new media components from components v2 for this
            messageCache.push(
              `[⠀](${card.cosmetic?.cardGif})`,
              TCGThread.Gameroom
            );
          }
          const context = gameAndMessageContext.call(
            card,
            game,
            messageCache,
            game.additionalMetadata.auserleseContextReversal[characterIndex]
              ? 1 - characterIndex
              : characterIndex
          );

          // use hpCost
          if (card.hpCost && card.hpCost !== 0) {
            character.adjustStat(-card.hpCost, StatsEnum.HP, game);
          }

          if (character.ability.abilityOwnCardEffectWrapper) {
            character.ability.abilityOwnCardEffectWrapper(context, card);
          } else {
            card.cardAction?.(context);
          }
          if (opponentCharacter.ability.abilityAfterOpponentsMoveEffect) {
            opponentCharacter.ability.abilityAfterOpponentsMoveEffect(
              game,
              1 - characterIndex,
              messageCache,
              card
            );
          }
          if (character.ability.abilityAfterOwnCardUse) {
            character.ability.abilityAfterOwnCardUse(
              game,
              characterIndex,
              messageCache,
              card
            );
          }
        }

        // check game over state after each move if the player didn't forfeit
        if (!game.additionalMetadata.forfeited[characterIndex]) {
          const losingCharacterIndex = game.checkGameOver();
          if (game.gameOver) {
            handleGameResult({ losingCharacterIndex });
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
      handleGameResult({ tie: true });
      messageCache.push(
        "# Both players foreited! The game ended in a draw!",
        TCGThread.Gameroom
      );
    }

    // run effects for unplayed playable cards
    game.characters.forEach((_, index) => {
      const playableCards = Object.values(
        game.additionalMetadata.currentPlayableMoves[index]
      );
      const selectedCard = characterToSelectedMoveMap[index];
      playableCards.forEach((card) => {
        if (card !== selectedCard && card.onNotPlayed) {
          const context = gameAndMessageContext.call(
            card,
            game,
            messageCache,
            index
          );

          card.onNotPlayed(context);
        }
      });
    });

    // end of turn resolution
    // start of endphase resolution
    moveOrder.forEach((characterIndex: number) => {
      if (!game.gameOver) {
        const character = game.getCharacter(characterIndex);
        character.ability.abilityStartOfEndPhaseEffect?.(
          game,
          characterIndex,
          messageCache
        );

        const losingCharacterIndex = game.checkGameOver();
        if (game.gameOver) {
          handleGameResult({ losingCharacterIndex });
          return;
        }
      }
    });

    // gather timed effects
    messageCache.push(
      `## ================================`,
      TCGThread.Gameroom
    );
    const priorityToTimedEffect: Record<
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
          timedEffect
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
              handleGameResult({ losingCharacterIndex });
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
          messageCache
        );

        const losingCharacterIndex = game.checkGameOver();
        if (game.gameOver) {
          handleGameResult({ losingCharacterIndex });
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
        textSpeedMs
      );
    }
  }

  return result;
};

// Imports
import Game from "@tcg/game";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { StatsEnum } from "@tcg/stats";
import Character from "@tcg/character";
import Card from "@tcg/card";
import CommonCardAction from "./util/commonCardActions";

// Constants
const EMPOWER_BOOST = 0.1;

// Utility Functions
const calculateEffectValue = (baseValue: number, empowerLevel: number) => {
  return Number((baseValue * (1 + empowerLevel * EMPOWER_BOOST)).toFixed(2));
};

// Character-Based Context
function characterBasedContext(game: Game, characterIndex: number) {
  const self = game.getCharacter(characterIndex);
  const opponent = game.getCharacter(1 - characterIndex);

  const changeStat = (
    target: Character,
    amount: number,
    stat: StatsEnum,
    multiplier: number = 1
  ) => {
    const change = amount * multiplier;
    target.adjustStat(change, stat);
    return change;
  };

  const flatAttack = (damage: number, additionalPierceFactor?: number) => {
    return CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      additionalPierceFactor,
    });
  };

  return {
    // Self properties
    self,
    selfIndex: characterIndex,
    selfStats: self.stats.stats,
    name: self.name,
    reflexive: self.cosmetic.pronouns.reflexive,
    possessive: self.cosmetic.pronouns.possessive,

    // Self stat
    flatSelfStat: changeStat.bind(null, self),

    // Attacks
    flatAttack,

    // Opponent properties
    opponent,
    opponentName: opponent.name,
    opponentIndex: 1 - characterIndex,
    opponentStats: opponent.stats.stats,

    // Opponent stat
    flatOpponentStat: changeStat.bind(null, opponent),

    // Game
    game,
  };
}

// Card Context Provider
export function gameContextProvider(
  this: Card,
  game: Game,
  characterIndex: number
) {
  const characterContext = characterBasedContext(game, characterIndex);
  const { self, opponent, flatAttack } = characterContext;

  const calcEffect = (effectIndex: number) => {
    return calculateEffectValue(this.effects[effectIndex], this.empowerLevel);
  };

  const changeStatWithEmpower = (
    target: Character,
    effectIndex: number,
    stat: StatsEnum,
    multiplier: number = 1
  ) => {
    const empowered = calculateEffectValue(
      this.effects[effectIndex],
      this.empowerLevel
    );
    const change = empowered * multiplier;
    target.adjustStat(change, stat);
    return change;
  };

  return {
    ...characterContext,

    // Self stat
    selfStat: changeStatWithEmpower.bind(null, self),

    // Attacks
    basicAttack: (effectIndex: number, additionalPierceFactor?: number) => {
      const damage = calculateEffectValue(
        this.effects[effectIndex],
        this.empowerLevel
      );
      flatAttack(damage, additionalPierceFactor);
      return damage;
    },

    // Self misc
    calcEffect,

    // Opponent stat
    opponentStat: changeStatWithEmpower.bind(null, opponent),
  };
}

// Message Context
function messageContext(messageCache: MessageCache) {
  const sendToGameroom = (message: string) => {
    messageCache.push(message, TCGThread.Gameroom);
  };

  return {
    // Thread messaging
    sendToGameroom,
    messageCache,
  };
}

// Combined Game and Message Context
export function gameAndMessageContext(
  this: Card,
  game: Game,
  messageCache: MessageCache,
  characterIndex: number
) {
  const duplicateContext = (newCard: Card) =>
    gameAndMessageContext.call(newCard, game, messageCache, characterIndex);

  return {
    ...gameContextProvider.call(this, game, characterIndex),
    ...messageContext(messageCache),
    duplicateContext,
  };
}

// Timed Effect Context
export function timedEffectContext(
  game: Game,
  characterIndex: number,
  messageCache: MessageCache
) {
  return {
    ...messageContext(messageCache),
    ...characterBasedContext(game, characterIndex),
  };
}

// Types
export type GameContext = ReturnType<typeof gameContextProvider>;
export type GameMessageContext = ReturnType<typeof gameAndMessageContext>;
export type TimedEffectContext = ReturnType<typeof timedEffectContext>;

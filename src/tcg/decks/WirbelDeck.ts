import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import { CharacterName } from "../characters/metadata/CharacterName";
import { GameMessageContext } from "../gameContextProvider";
import mediaLinks from "../formatting/mediaLinks";
import CommonCardAction from "../util/commonCardActions";

export const tacticalRetreat = new Card({
  title: "Tactical Retreat",
  cardMetadata: { nature: Nature.Util },
  description: ([trueDef]) =>
    `TrueDEF+${trueDef} for 2 turns. Using an attack aside from "Ehre: Bulletstorm - Doragate" will cost an additional 10HP while the effect is active, and will end the effect.`,
  effects: [10],
  emoji: CardEmoji.WIRBEL_CARD,
  cosmetic: {
    cardGif: mediaLinks.wirbel_tacticalRetreat_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, selfStat, calcEffect }
  ) {
    sendToGameroom(`${name} performed a tactical retreat.`);

    const trueDef = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF);

    self.ability.abilityOwnCardEffectWrapper = function (
      context: GameMessageContext,
      card: Card
    ) {
      const {
        self,
        game,
        selfIndex,
        messageCache,
        name,
        sendToGameroom,
        flatSelfStat,
      } = context;

      // specific check for if an attack is used while tactical retreat is in effect
      if (
        card.cardMetadata.nature == Nature.Attack &&
        !card.cardMetadata.isEhreDoragate
      ) {
        const newTimedEffects = [];
        for (const timedEffect of self.timedEffects) {
          if (timedEffect.metadata.wirbelIsTacticalRetreat) {
            sendToGameroom(`${name} abruptly returned to the battlefield.`);
            flatSelfStat(-10, StatsEnum.HP);
            timedEffect.endOfTimedEffectAction?.(game, selfIndex, messageCache);
          } else {
            newTimedEffects.push(timedEffect);
          }
        }
        self.timedEffects = newTimedEffects;
      }

      card.cardAction?.(context);
    };

    self.timedEffects.push(
      new TimedEffect({
        name: "Tactical Retreat",
        description: `Increases TrueDEF by ${trueDef}. Using an attack aside from "Ehre: Bulletstorm - Doragate" will cost an additional 10HP while the effect is active, and will end the effect.`,
        priority: -1,
        turnDuration: 2,
        metadata: { removableBySorganeil: true, wirbelIsTacticalRetreat: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-1 * trueDef, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

export const scharfJubelade = new Card({
  title: "Scharf: Barrier of Steel Petals - Jubelade",
  cardMetadata: { nature: Nature.Util },
  description: ([def]) => `Increases TrueDEF by ${def} for 3 turns.`,
  effects: [4],
  emoji: CardEmoji.WIRBEL_CARD,
  cosmetic: {
    cardGif: mediaLinks.wirbel_jubelade_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, characterName, selfStat, sendToGameroom, calcEffect }
  ) {
    const isWirbel = characterName === CharacterName.Wirbel;
    if (isWirbel) {
      sendToGameroom(
        `Wirbel commanded Scharf to put up a Barrier of Steel Petals!`
      );
    } else {
      sendToGameroom(`${name} erected a Barrier of Steel Petals!`);
    }

    const def = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF);

    self.timedEffects.push(
      new TimedEffect({
        name: "Barrier of Steel Petals - Jubelade",
        description: `Increases TrueDEF by ${def}.`,
        priority: -1,
        turnDuration: 3,
        metadata: { removableBySorganeil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-1 * def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

export const emergencyDefensiveBarrier = new Card({
  title: "Emergency Defensive Barrier",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  effects: [20],
  emoji: CardEmoji.WIRBEL_CARD,
  priority: 2,
  cosmetic: {
    cardGif: mediaLinks.wirbel_emergencyDefensiveBarrier_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, selfStat, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} erected an emergency barrier!`);

    const def = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF);

    self.timedEffects.push(
      new TimedEffect({
        name: "Emergency Defensive Barrier",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-1 * def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

const a_spearRush = new Card({
  title: "Spear Rush",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) =>
    `SPD+${spd}. DMG ${dmg} x 3. Pierces 15% of DEF.`,
  emoji: CardEmoji.WIRBEL_CARD,
  effects: [2, 3],
  hpCost: 7,
  cosmetic: {
    cardGif: mediaLinks.wirbel_spearRush_gif,
  },
  cardAction: function (
    this: Card,
    { name, sendToGameroom, calcEffect, possessive, flatAttack, selfStat }
  ) {
    sendToGameroom(`${name} rushed forward with ${possessive} spear!`);
    selfStat(0, StatsEnum.SPD);

    const damage = calcEffect(1);
    const pierceFactor = 0.15;
    for (let i = 0; i < 3; i++) {
      flatAttack(damage, pierceFactor);
    }
  },
});

const a_captainsOrderBase = new Card({
  title: "Captain's Order",
  cardMetadata: { nature: Nature.Attack },
  description: ([atk, def, spd, dmg]) =>
    `If the Opp's DEF > your ATK, ATK+${atk}, DEF+${def}, SPD+${spd}. Else, DMG ${dmg}.`,
  emoji: CardEmoji.WIRBEL_CARD,
  effects: [3, 1, 2, 10],
  hpCost: 4,
  cosmetic: {
    cardGif: mediaLinks.wirbel_captainsOrder_gif,
  },
  cardAction: function (this: Card, context) {
    const { opponentStats, selfStats, selfStat, basicAttack } = context;

    if (opponentStats.DEF > selfStats.ATK) {
      selfStat(0, StatsEnum.ATK);
      selfStat(1, StatsEnum.DEF);
      selfStat(2, StatsEnum.SPD);
    } else {
      basicAttack(3);
    }
  },
});

const captainsOrder = new Card({
  ...a_captainsOrderBase,
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];
    const opponent = game.characters[1 - characterIndex];

    if (opponent.stats.stats.DEF > character.stats.stats.ATK) {
      return new Card({
        ...a_captainsOrderBase,
        cardMetadata: { nature: Nature.Util },
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_captainsOrderBase,
        cardMetadata: { nature: Nature.Attack },
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

export const a_ehreDoragate = new Card({
  title: "Ehre: Bulletstorm - Doragate",
  cardMetadata: { nature: Nature.Attack, isEhreDoragate: true },
  description: ([dmg]) =>
    `DMG ${dmg}. At the end of the next 2 turns, DMG ${dmg}. Pierces 30% of DEF.`,
  emoji: CardEmoji.WIRBEL_CARD,
  effects: [1],
  cosmetic: {
    cardGif: mediaLinks.wirbel_ehreDoragate_gif,
  },
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, calcEffect, flatAttack }
  ) {
    const isWirbel = name === CharacterName.Wirbel;
    if (isWirbel) {
      sendToGameroom(`Wirbel commanded Ehre to let fall a storm of bullets!`);
    } else {
      sendToGameroom(
        `${name} casted Doragate! ${name} summoned a storm of bullets!`
      );
    }

    const damage = calcEffect(0);
    const pierceFactor = 0.3;
    flatAttack(damage, pierceFactor);

    self.timedEffects.push(
      new TimedEffect({
        name: "Bulletstorm - Doragate",
        description: `Deal ${damage} at each turn's end, with ${(pierceFactor * 100).toFixed(2)}% Pierce.`,
        turnDuration: 3,
        activateEndOfTurnActionThisTurn: false,
        endOfTurnAction: function (this: TimedEffect, _game, _characterIndex) {
          sendToGameroom(`The bulletstorm keeps raining down!`);
          flatAttack(damage, pierceFactor);
        },
      })
    );
  },
});

export const perfectSorganeil = new Card({
  title: "Perfect Sorganeil",
  cardMetadata: {
    nature: Nature.Attack,
    signature: true,
    signatureMoveOf: CharacterName.Wirbel,
  },
  description: ([dmg]) =>
    `DMG ${dmg}. Will fail if the opponent's SPD is higher than your SPD by 50 or more. Set opponent's SPD to 1. Clear opponent's timed effects. Opponent can only perform Default actions next turn.`,
  emoji: CardEmoji.WIRBEL_CARD,
  priority: -1,
  effects: [1],
  cosmetic: {
    cardGif: mediaLinks.wirbel_sorganeil_gif,
  },
  cardAction: function (this: Card, context: GameMessageContext) {
    const {
      self,
      game,
      opponentIndex,
      messageCache,
      opponent,
      name,
      opponentName,
      basicAttack,
      selfStats,
      opponentStats,
      flatOpponentStat,
      possessive,
      sendToGameroom,
    } = context;
    if (opponentStats.SPD - selfStats.SPD >= 50) {
      sendToGameroom(
        `${name}'s gaze cannot keep up with ${opponentName}'s speed!`
      );
      return;
    }

    sendToGameroom(`${name} traps ${opponentName} in ${possessive} gaze!`);
    basicAttack(0);
    opponent.skipTurn = true;

    CommonCardAction.removeCharacterTimedEffect(
      game,
      opponentIndex,
      messageCache
    );

    // handle speed diff after timed effect removal
    const opponentOriginalSpeedDiff = opponentStats.SPD - 1;
    flatOpponentStat(-1 * opponentOriginalSpeedDiff, StatsEnum.SPD);

    self.timedEffects.push(
      new TimedEffect({
        name: "Sorganeil",
        description: `Traps the opponent in place.`,
        turnDuration: 2,
        priority: -1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(
            `${name} averted ${possessive} gaze. ${opponentName} got free from ${name}'s Sorganeil.`
          );
          flatOpponentStat(opponentOriginalSpeedDiff, StatsEnum.SPD);
        },
      })
    );
  },
});

export const a_concentratedZoltraakBolt = new Card({
  title: "Concentrated Zoltraak Bolt",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}.`,
  emoji: CardEmoji.WIRBEL_CARD,
  effects: [16],
  hpCost: 10,
  cosmetic: {
    cardGif: mediaLinks.wirbel_concentratedZoltraakBolt_gif,
  },
  cardAction: function (this: Card, { name, sendToGameroom, basicAttack }) {
    sendToGameroom(`${name} shot forth a deadly Zoltraak Bolt!`);
    if (Math.random() < 0.5) {
      sendToGameroom(`The bolt collapses the ceiling above!`);
    } else {
      sendToGameroom(`The bolt hit the target head on!`);
    }
    basicAttack(0);
  },
});

const wirbelDeck = [
  { card: tacticalRetreat, count: 2 },
  { card: emergencyDefensiveBarrier, count: 2 },
  { card: scharfJubelade, count: 2 },
  { card: captainsOrder, count: 2 },
  { card: a_spearRush, count: 2 },
  { card: a_ehreDoragate, count: 2 },
  { card: perfectSorganeil, count: 2 },
  { card: a_concentratedZoltraakBolt, count: 2 },
];

export default wirbelDeck;

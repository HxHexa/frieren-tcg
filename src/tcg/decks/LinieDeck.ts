import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CardEmoji } from "@tcg/formatting/emojis";
import { GameMessageContext } from "@tcg/gameContextProvider";
import mediaLinks from "../formatting/mediaLinks";

export const imitate = new Card({
  title: "Imitate",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: () =>
    `Use the card the opponent used last turn at this card's empower level -2.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [],
  cosmetic: {
    cardGif: mediaLinks.linie_imitate_gif,
  },
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const lastCard =
      game.additionalMetadata.lastUsedCards?.[1 - characterIndex];
    if (lastCard) {
      return new Card({
        ...lastCard,
        empowerLevel: this.empowerLevel - 2,
        imitated: true,
      });
    } else {
      return new Card({
        title: "Empty Imitation",
        cardMetadata: { nature: Nature.Default },
        description: () => "No card to imitate. This move will fail.",
        effects: [],
        emoji: CardEmoji.LINIE_CARD,
        cardAction: ({ sendToGameroom }) => {
          sendToGameroom(`No card to imitate. The move failed!`);
        },
        imitated: true,
      });
    }
  },
});

export const adapt = new Card({
  title: "Adapt",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, atkDef, hp]) =>
    `SPD+${spd}. If HP > 50, ATK+${atkDef}, DEF+${atkDef}. If HP <= 50, heal ${hp} HP.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [2, 2, 10],
  cosmetic: {
    cardGif: mediaLinks.linie_adapt_gif,
  },
  cardAction: ({ selfStats, name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} adapts to the situation.`);
    selfStat(0, StatsEnum.SPD);

    if (selfStats.HP > 50) {
      selfStat(1, StatsEnum.ATK);
      selfStat(1, StatsEnum.DEF);
    } else {
      selfStat(2, StatsEnum.HP);
    }
  },
});

export const manaDetectionBaseCardAction = (context: GameMessageContext) => {
  const {
    name,
    sendToGameroom,
    opponent,
    flatSelfStat,
    calcEffect,
    selfStat,
    opponentStats,
  } = context;
  sendToGameroom(`${name} detects the opponent's mana flow.`);
  selfStat(0, StatsEnum.SPD);

  const bigNumber = calcEffect(1);
  const smallNumber = calcEffect(2);

  if (opponentStats.DEF >= opponentStats.ATK) {
    flatSelfStat(bigNumber, StatsEnum.ATK);
    flatSelfStat(smallNumber, StatsEnum.DEF);
  } else {
    flatSelfStat(smallNumber, StatsEnum.ATK);
    flatSelfStat(bigNumber, StatsEnum.DEF);
  }

  // reveal empower
  const currentHighestEmpoweredCard = opponent.hand.reduce(
    (highest, card) =>
      card.empowerLevel > highest.empowerLevel ? card : highest,
    opponent.hand[0]
  );
  sendToGameroom(
    `### ${opponent.name} is concentrating ${opponent.cosmetic.pronouns.possessive} power on the move **${currentHighestEmpoweredCard.getTitle()}**!`
  );
};

export const manaDetection = new Card({
  title: "Mana Detection",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, bigNumber, smallNumber]) =>
    `SPD+${spd}. If Opp's DEF >= Opp's ATK, ATK+${bigNumber}, DEF+${smallNumber}. Otherwise, ATK+${smallNumber}, DEF+${bigNumber}. Reveal the opponent's highest empowered card.`,
  emoji: CardEmoji.MANA_CARD,
  effects: [2, 2, 1],
  cosmetic: {
    cardGif: mediaLinks.fern_manaDetection_gif,
  },
  cardAction: manaDetectionBaseCardAction,
});

const parry = new Card({
  title: "Parry",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [20],
  priority: 2,
  cardAction: ({ name, sendToGameroom, calcEffect, selfEffect, selfStat }) => {
    sendToGameroom(`${name} prepares to parry the opponent's attack.`);

    const def = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF);
    selfEffect({
      name: "Parry",
      description: `Increases DEF by ${def} until the end of the turn.`,
      priority: -1,
      turnDuration: 1,
      metadata: { removableBySorganeil: false },
      endOfTimedEffectAction: () => {
        selfStat(0, StatsEnum.TrueDEF, -1);
      },
    });
  },
});

export const a_erfassenAxe = new Card({
  title: "Erfassen: Axe",
  description: ([dmg]) => `DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  cardMetadata: { nature: Nature.Attack },
  effects: [12],
  hpCost: 4,
  cosmetic: {
    cardGif: mediaLinks.linie_erfassenAxe_gif,
  },
  cardAction: ({ name, sendToGameroom, possessive, basicAttack }) => {
    sendToGameroom(`${name} recalls ${possessive} Axe imitation.`);
    basicAttack(0);
  },
});

export const a_erfassenJavelin = new Card({
  title: "Erfassen: Javelin",
  description: ([dmg]) => `DMG ${dmg}. Deal ${dmg} at the end of next turn.`,
  emoji: CardEmoji.LINIE_CARD,
  cardMetadata: { nature: Nature.Attack },
  effects: [6],
  hpCost: 3,
  cosmetic: {
    cardGif: mediaLinks.linie_erfassenJavelin_gif,
  },
  cardAction: ({
    name,
    sendToGameroom,
    possessive,
    basicAttack,
    selfEffect,
  }) => {
    sendToGameroom(`${name} recalls ${possessive} Javelin imitation.`);
    const damage = basicAttack(0);

    selfEffect({
      name: "Erfassen: Javelin",
      description: `Deal ${damage} at the end of the effect.`,
      turnDuration: 2,
      activateEndOfTurnActionThisTurn: false,
      endOfTurnAction: (game, characterIndex) => {
        sendToGameroom(`${name} launches a javelin!`);
        CommonCardAction.commonAttack(game, characterIndex, {
          damage,
          isTimedEffectAttack: true,
        });
      },
    });
  },
});

export const a_erfassenSword = new Card({
  title: "Erfassen: Sword",
  cardMetadata: { nature: Nature.Attack, chain: 1 },
  description: ([dmg]) => `DMG ${dmg}. Gain 1 Chain stack.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [8],
  hpCost: 2,
  cosmetic: {
    cardGif: mediaLinks.linie_erfassenSword_gif,
  },
  cardAction: ({ name, sendToGameroom, possessive, basicAttack }) => {
    sendToGameroom(`${name} recalls ${possessive} Sword imitation.`);
    basicAttack(0);
  },
});

export const a_erfassenKnife = new Card({
  title: "Erfassen: Knife",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `DMG ${dmg}. At the end of the next 2 turns, deal ${dmg}.`,
  emoji: CardEmoji.LINIE_CARD,
  cosmetic: {
    cardGif: mediaLinks.linie_erfassenKnife_gif,
  },
  effects: [3],
  hpCost: 1,
  cardAction: ({
    name,
    possessive,
    sendToGameroom,
    basicAttack,
    calcEffect,
    selfEffect,
  }) => {
    sendToGameroom(`${name} recalls ${possessive} Knife throw imitation.`);
    basicAttack(0);

    const damage = calcEffect(0);
    selfEffect({
      name: "Erfassen: Knife",
      description: `Deal ${damage} at each turn's end.`,
      turnDuration: 3,
      activateEndOfTurnActionThisTurn: false,
      endOfTurnAction: function (this: TimedEffect, _game, _characterIndex) {
        sendToGameroom(`${name} flings a knife at the opponent!`);
        basicAttack(0);
      },
    });
  },
});

const linieDeck = [
  { card: imitate, count: 2 },
  { card: adapt, count: 2 },
  { card: manaDetection, count: 2 },
  { card: parry, count: 2 },
  { card: a_erfassenAxe, count: 2 },
  { card: a_erfassenJavelin, count: 2 },
  { card: a_erfassenSword, count: 2 },
  { card: a_erfassenKnife, count: 2 },
];

export default linieDeck;

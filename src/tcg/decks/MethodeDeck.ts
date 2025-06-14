import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";

const scatterShot = new Card({
  title: "Scatter Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of next turn`,
  effects: [3],
  hpCost: 6,
  cardAction: ({
    self,
    name,
    opponent,
    calcEffect,
    basicAttack,
    sendToGameroom,
  }) => {
    sendToGameroom(`${name} fires a scatter shot!`);
    const dmg = calcEffect(0);
    self.timedEffects.push(
      new TimedEffect({
        name: "Scatter Shot",
        description: `Deal ${dmg} x2 at the end of your turn.`,
        turnDuration: 2,
        endOfTimedEffectAction: () => {
          sendToGameroom(
            `${name}'s scatter shots concentrate on ${opponent.name}!`
          );
          basicAttack(0);
          basicAttack(0);
        },
      })
    );
  },
});

const delayedShot = new Card({
  title: "Delayed Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of 2 turns from now.`,
  effects: [3],
  hpCost: 6,
  cardAction: ({ self, name, calcEffect, basicAttack, sendToGameroom }) => {
    sendToGameroom(`${name} fires a delayed shot!`);
    const dmg = calcEffect(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Delayed Shot",
        description: `Deal ${dmg} x2 at the end of your turn.`,
        turnDuration: 3,
        endOfTimedEffectAction: () => {
          sendToGameroom(`${name}'s delayed shot hits!`);
          basicAttack(0);
          basicAttack(0);
        },
      })
    );
  },
});

const piercingShot = new Card({
  title: "Piercing Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg, bonus]) =>
    `DMG ${dmg}. If this character did not use an attacking move last turn, deal an additional ${bonus} DMG with 50% pierce.`,
  effects: [9, 4],
  hpCost: 8,
  cardAction: ({ name, sendToGameroom, lastCard, basicAttack }) => {
    sendToGameroom(`${name} fires a piercing shot!`);
    basicAttack(0);
    if (lastCard.cardMetadata.nature !== Nature.Attack) {
      basicAttack(1, 0.5);
    }
  },
});

const polymath = new Card({
  title: "Polymath",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([buff]) =>
    `ATK+${buff}, DEF+${buff}, SPD+${buff}. Redraw your hand and roll 1 extra die next turn.`,
  effects: [1],
  cardAction: ({ self, name, game, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} used Polymath`);

    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);

    for (let i = 0; i < self.hand.length; i++) {
      self.discardCard(0);
      self.drawCard();
    }

    self.additionalMetadata.rollsCount += 1;
    self.timedEffects.push(
      new TimedEffect({
        name: "Polymath",
        description: "Roll an extra die this turn.",
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.additionalMetadata.rollsCount -= 1;
        },
      })
    );
  },
});

const ordinaryDefensiveMagic = new Card({
  title: "Ordinary Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) => `TrueDEF+${def} for 1 turn.`,
  effects: [20],
  priority: 2,
  cardAction: ({ self, name, game, sendToGameroom, calcEffect }) => {
    sendToGameroom(`${name} puts up an ordinary barrier.`);
    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Ordinary Defensive Magic",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

const manaDetection = new Card({
  title: "Mana Detection",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) =>
    `TrueDEF+${def} for 1 turn. If the opponent uses an attacking move this turn, next turn, all your moves have Priority+1.`,
  effects: [20],
  priority: 2,
  cardAction: ({ name, opponent, sendToGameroom, self, game, calcEffect }) => {
    sendToGameroom(`${name} detects ${opponent.name}'s mana.`);
    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.ability.abilityCounterEffect = (
      _game,
      _charIndex,
      _msgCache,
      _atkDmg
    ) => {
      sendToGameroom(`${name} was ready for ${opponent.name}'s attack!`);
      self.ability.abilitySelectedMoveModifierEffect = (
        _game,
        _charIdx,
        _msgCache,
        card
      ) => {
        card.priority += 1;
        self.ability.abilitySelectedMoveModifierEffect = undefined;
        return card;
      };
    };

    self.timedEffects.push(
      new TimedEffect({
        name: "Mana Detecting",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
          self.ability.abilityCounterEffect = undefined;
        },
      })
    );
  },
});

const reversePolarity = new Card({
  title: "Reverse Polarity",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) =>
    `TrueDEF+${def} for 1 turn. If the opponent uses an attacking move this turn, at this turn's end, attack with base DMG equal to the move's DMG.`,
  effects: [20],
  priority: 2,
  cardAction: ({
    sendToGameroom,
    self,
    opponent,
    calcEffect,
    game,
    flatAttack,
  }) => {
    sendToGameroom(`${self.name} puts up a reflective barrier.`);
    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.ability.abilityCounterEffect = (
      _game,
      _charIndex,
      _msgCache,
      atkDmg
    ) => {
      self.ability.abilityCounterEffect = undefined;
      self.timedEffects.push(
        new TimedEffect({
          name: "Reverse Polarity",
          description: `Reflects with ${atkDmg} base DMG back at the attacker at the end of this turn.`,
          turnDuration: 1,
          endOfTurnAction(_game, _characterIndex, _messageCache) {
            sendToGameroom(`${self.name} reflects ${opponent.name}'s attack!`);
            flatAttack(atkDmg);
          },
        })
      );
    };
  },
});

const goddessHealingMagic = new Card({
  title: "Goddess' Healing Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([hp, bonusHp, def]) =>
    `Heal ${hp} HP. Heal an additional ${bonusHp} HP and gain ${def} DEF if the opponent did not use an offensive move this turn.`,
  effects: [7, 3, 2],
  cardAction: ({
    name,
    self,
    game,
    opponentLastCard,
    calcEffect,
    sendToGameroom,
    selfStat,
  }) => {
    sendToGameroom(`${name} calls upon the Goddess for healing magic.`);
    selfStat(0, StatsEnum.HP, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Goddess' Healing Magic",
        description: `Gain ${calcEffect(1)} DEF and Heal ${calcEffect(2)} HP if the opponent did not use an offensive move this turn.`,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: () => {
          if (opponentLastCard.cardMetadata.nature !== Nature.Attack) {
            sendToGameroom(`${name} receives the Goddess' blessing!`);
            selfStat(1, StatsEnum.HP, game);
            selfStat(2, StatsEnum.DEF, game);
          }
        },
      })
    );
  },
});

const restraintMagic = new Card({
  title: "Restraint Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([debuff]) =>
    `Set your DEF to 1 until this turn's end. Opp's ATK-${debuff}, DEF-${debuff}, SPD-${debuff} for the next 4 turns.`,
  effects: [4],
  priority: 1,
  cardAction: ({
    name,
    self,
    game,
    sendToGameroom,
    opponent,
    calcEffect,
    flatSelfStat,
    opponentStat,
    selfStats,
  }) => {
    sendToGameroom(`${name} casts restraint magic on ${opponent.name}.`);
    const defDebuff = selfStats.DEF - 1;
    flatSelfStat(-defDebuff, StatsEnum.DEF, game);

    opponentStat(0, StatsEnum.ATK, game, -1);
    opponentStat(0, StatsEnum.DEF, game, -1);
    opponentStat(0, StatsEnum.SPD, game, -1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Restraining",
        description: `Your DEF is set to 1 until the end of this turn.`,
        turnDuration: 1,
        priority: -1,
        endOfTimedEffectAction: () => {
          flatSelfStat(defDebuff, StatsEnum.DEF, game);
        },
      })
    );

    const restraint = calcEffect(0);
    opponent.timedEffects.push(
      new TimedEffect({
        name: "Restrained",
        description: `ATK-${restraint}, DEF-${restraint}, SPD-${restraint}.`,
        turnDuration: 4,
        endOfTimedEffectAction: () => {
          opponentStat(0, StatsEnum.ATK, game);
          opponentStat(0, StatsEnum.DEF, game);
          opponentStat(0, StatsEnum.SPD, game);
        },
      })
    );
  },
});

const hypnoticCompulsion = new Card({
  title: "Hypnotic Compulsion",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([atkDebuff]) =>
    `Opponent's ATK-${atkDebuff}. Your opponent only has their last used move next turn.`,
  effects: [],
  cardAction: ({
    name,
    opponent,
    game,
    opponentLastCard,
    sendToGameroom,
    opponentStat,
  }) => {
    sendToGameroom(`${name} hypnotizes ${opponent.name}.`);
    opponentStat(0, StatsEnum.ATK, game, -1);
    opponent.skipTurn = true;
    opponent.additionalMetadata.accessToDefaultCardOptions = false;
    opponent.additionalMetadata.nextCardToPlay = opponentLastCard;

    opponent.timedEffects.push(
      new TimedEffect({
        name: "Compelled",
        description: `Use your last used move next turn.`,
        turnDuration: 1,
        endOfTimedEffectAction: () => {
          opponent.additionalMetadata.accessToDefaultCardOptions = true;
          opponent.additionalMetadata.nextCardToPlay = undefined;
        },
      })
    );
  },
});

const spotWeakness = new Card({
  title: "Spot Weakness",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([spd, atk, bonusAtk]) =>
    `SPD+${spd} ATK+${atk}. If the opponent uses an offensive move this turn, at the end of turn, ATK+${bonusAtk}.`,
  effects: [2, 1, 3],
  cardAction: ({
    self,
    name,
    opponent,
    game,
    opponentLastCard,
    selfStat,
    sendToGameroom,
    calcEffect,
  }) => {
    sendToGameroom(
      `${name} is on the lookout for ${opponent.name}'s weaknesses.`
    );
    selfStat(0, StatsEnum.SPD, game);
    selfStat(1, StatsEnum.ATK, game);

    const bonusAtk = calcEffect(2);

    self.timedEffects.push(
      new TimedEffect({
        name: "Spotting Weaknesses",
        description: `If the opponent uses an offensive move this turn, at the end of turn, ATK+${bonusAtk}`,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: () => {
          if (opponentLastCard.cardMetadata.nature === Nature.Attack) {
            sendToGameroom(
              `${name} found an opening in ${opponent.name}'s attack!`
            );
            selfStat(2, StatsEnum.ATK, game);
          }
        },
      })
    );
  },
});

const methodeDeck = [
  { card: scatterShot, count: 2 },
  { card: delayedShot, count: 2 },
  { card: piercingShot, count: 2 },
  { card: polymath, count: 2 },
  { card: ordinaryDefensiveMagic, count: 1 },
  { card: manaDetection, count: 1 },
  { card: reversePolarity, count: 1 },
  { card: goddessHealingMagic, count: 2 },
  { card: restraintMagic, count: 1 },
  { card: hypnoticCompulsion, count: 1 },
  { card: spotWeakness, count: 1 },
];

export default methodeDeck;

import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import TimedEffect from "../timedEffect";
import { StatsEnum } from "@tcg/stats";

const scatterShot = new Card({
  title: "Scatter Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of next turn`,
  effects: [3],
  hpCost: 6,
  cardAction: () => {},
});

const delayedShot = new Card({
  title: "Delayed Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of 2 turns from now.`,
  effects: [3],
  hpCost: 6,
  cardAction: () => {},
});

const piercingShot = new Card({
  title: "Piercing Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg, bonus]) =>
    `DMG ${dmg}. If this character did not use an attacking move last turn, deal an additional ${bonus} DMG with 50% pierce.`,
  effects: [9, 4],
  hpCost: 8,
  cardAction: () => {},
});

const polymath = new Card({
  title: "Polymath",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([buff]) =>
    `ATK+${buff}, DEF+${buff}, SPD+${buff}. Redraw your hand and roll 1 extra die next turn.`,
  effects: [],
  cardAction: () => {},
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

    self.timedEffects.push(
      new TimedEffect({
        name: "Mana Detecting",
        description: `Increases TrueDEF by ${def} until the end of the turn, ${name} is ready for the next attack.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
          if (opponent.additionalMetadata.attackedThisTurn) {
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
          }
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

    self.timedEffects.push(
      new TimedEffect({
        name: "Reverse Polarity",
        description: `Increases TrueDEF by ${def} until the end of the turn, reflects damage back at the attacker.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
          if (opponent.additionalMetadata.attackedThisTurn) {
            sendToGameroom(`${self.name} reflects ${opponent.name}'s attack!`);
            // who knows how to calc the damage
            const dmg = 10;
            flatAttack(dmg);
          }
        },
      })
    );
  },
});

const goddessHealingMagic = new Card({
  title: "Goddess' Healing Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([hp, bonusHp, def]) =>
    `Heal ${hp} HP. Heal an additional ${bonusHp} HP and gain ${def} DEF if the opponent did not use an attacking move this turn.`,
  effects: [7, 3, 2],
  cardAction: () => {},
});

const restraintMagic = new Card({
  title: "Restraint Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([debuff]) =>
    `Set your DEF to 1 until this turn's end. Opp's ATK-${debuff}, DEF-${debuff}, SPD-${debuff} for the next 4 turns.`,
  effects: [4],
  priority: 1,
  cardAction: () => {},
});

const hypnoticCompulsion = new Card({
  title: "Hypnotic Compulsion",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([atkDebuff]) =>
    `Opponent's ATK-${atkDebuff}. They repeat the move they used last turn next turn.`,
  effects: [],
  cardAction: () => {},
});

const spotWeakness = new Card({
  title: "Spot Weakness",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([spd, atk, bonusAtk]) =>
    `SPD+${spd} ATK+${atk}. If the opponent uses an attacking move this turn, ATK+${bonusAtk}.`,
  effects: [2, 1, 3],
  cardAction: ({
    self,
    name,
    opponent,
    game,
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
        name: "Spot Weakness",
        description: `If the opponent attacks this turn, ATK+${bonusAtk}`,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: () => {
          if (opponent.additionalMetadata.attackedThisTurn) {
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

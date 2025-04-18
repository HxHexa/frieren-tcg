import Card from "../card";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import TimedEffect from "../timedEffect";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_jab = new Card({
  title: "Jab",
  cardMetadata: { nature: "Attack" },
  description: ([hp, def, spd, dmg]) =>
    `HP+${hp}. DEF+${def}. SPD+${spd}. DMG ${dmg}.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 1, 1, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} jabbed with ${character.cosmetic.pronouns.possessive} fist.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.DEF
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[3]),
      hpCost: 0,
    });
  },
});

const a_hook = new Card({
  title: "Hook",
  cardMetadata: { nature: "Attack" },
  description: ([hp, atk, dmg]) => `HP+${hp}. ATK+${atk}. DMG ${dmg}.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 2, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} threw out a hook!`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[2]),
      hpCost: 0,
    });
  },
});

const a_uppercut = new Card({
  title: "Uppercut",
  cardMetadata: { nature: "Attack" },
  description: ([hp, atk, spd, dmg]) =>
    `HP+${hp}. ATK+${atk}. SPD+${spd}. DMG ${dmg}.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 1, 1, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    const damage = this.calculateEffectValue(this.effects[3]);
    messageCache.push(
      `${character.name} threw out ${damage > 10 ? "a sharp" : "an"} uppercut from below!`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: 0,
    });
  },
});

const bareHandedBlock = new Card({
  title: "Bare-handed Block",
  cardMetadata: { nature: "Attack" },
  description: ([def, tempDef]) =>
    `Priority+2. DEF+${def}. Increases DEF by an additional ${tempDef} until the end of the turn.`,
  emoji: CardEmoji.DENKEN_CARD,
  priority: 2,
  effects: [2, 8],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} raised his hands to prepare to block the opponent's attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);

    const tempDef = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(tempDef, StatsEnum.DEF);

    character.timedEffects.push(
      new TimedEffect({
        name: "Block",
        description: `Increases DEF by ${tempDef} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-tempDef, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_waldgoseBase = new Card({
  title: "Tornado Winds: Waldgose",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) =>
    `HP-7. DMG ${dmg}. At the next 3 turn ends, deal ${dmg} DMG. Treat this card as "Jab" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      const jab = new Card({
        ...a_jab,
        empowerLevel: this.empowerLevel,
      });
      jab.cardAction(game, characterIndex, messageCache);
    } else {
      messageCache.push(
        `${character.name} whipped up a tornado!`,
        TCGThread.Gameroom
      );
      const damage = this.calculateEffectValue(this.effects[0]);
      CommonCardAction.commonAttack(game, characterIndex, {
        damage,
        hpCost: 7,
      });

      character.timedEffects.push(
        new TimedEffect({
          name: "Tornado Winds: Waldgose",
          description: `Deal ${this.tags?.WaldgoseDamage ?? damage} at each turn's end.`,
          turnDuration: 3,
          tags: { WaldgoseDamage: damage },
          endOfTurnAction: function (this, game, characterIndex) {
            messageCache.push("The wind rages on!", TCGThread.Gameroom);

            let waldgoseDmg: number;
            if (this.tags?.WaldgoseDamage) {
              waldgoseDmg = this.tags.WaldgoseDamage;
            } else {
              waldgoseDmg = damage;
            }

            CommonCardAction.commonAttack(game, characterIndex, {
              damage: waldgoseDmg,
              hpCost: 0,
              isTimedEffectAttack: true,
            });
          },
        })
      );
    }
  },
});

const a_waldgose = new Card({
  title: "Tornado Winds: Waldgose",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) =>
    `HP-7. DMG ${dmg}. At the next 3 turn ends, deal ${dmg} DMG. Treat this card as "Jab" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [3],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...a_jab,
        title: "Jab (Tornado Winds: Waldgose)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_waldgoseBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

export const a_daosdorgBase = new Card({
  title: "Hellfire: Daosdorg",
  cardMetadata: { nature: "Attack" },
  description: ([dmg, waldgoseDmgBonus]) =>
    `HP-9. DMG ${dmg}. If Waldgose is active, increase its turn end damage by ${waldgoseDmgBonus}. Treat this card as "Hook" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [12, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    if (character.stats.stats.HP <= 0) {
      const hook = new Card({
        ...a_hook,
        empowerLevel: this.empowerLevel,
      });
      hook.cardAction(game, characterIndex, messageCache);
    } else {
      messageCache.push(
        `${character.name} set the sky aflame.`,
        TCGThread.Gameroom
      );

      CommonCardAction.commonAttack(game, characterIndex, {
        damage: this.calculateEffectValue(this.effects[0]),
        hpCost: 9,
      });

      let hasWaldgose: boolean = false;

      for (const timedEffect of character.timedEffects) {
        if ("WaldgoseDamage" in timedEffect.tags) {
          timedEffect.tags.WaldgoseDamage += this.calculateEffectValue(
            this.effects[1]
          );
          hasWaldgose = true;
        }
      }

      if (hasWaldgose) {
        messageCache.push(
          `The hellfire infused itself into the raging winds!`,
          TCGThread.Gameroom
        );
      }
    }
  },
});

const a_daosdorg = new Card({
  title: "Hellfire: Daosdorg",
  cardMetadata: { nature: "Attack" },
  description: ([dmg, waldgoseDmgBonus]) =>
    `HP-9. DMG ${dmg}. If Waldgose is active, increase its turn end damage by ${waldgoseDmgBonus}. Treat this card as "Hook" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [12, 3],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...a_hook,
        title: "Hook (Hellfire: Daosdorg)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_daosdorgBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

export const a_catastraviaBase = new Card({
  title: "Lights of Judgment: Catastravia",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) =>
    `HP-15. DMG ${dmg}. At the next 5 turn ends, deal ${dmg} DMG. Treat this card as "Uppercut" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [4],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    if (character.stats.stats.HP <= 0) {
      const uppercut = new Card({
        ...a_uppercut,
        empowerLevel: this.empowerLevel,
      });
      uppercut.cardAction(game, characterIndex, messageCache);
    } else {
      messageCache.push(
        `${character.name} covered the sky in stars.`,
        TCGThread.Gameroom
      );

      const damage = this.calculateEffectValue(this.effects[0]);
      CommonCardAction.commonAttack(game, characterIndex, {
        damage,
        hpCost: 15,
      });

      character.timedEffects.push(
        new TimedEffect({
          name: "Lights of Judgment: Catastravia",
          description: `Deal ${damage} at each turn's end.`,
          turnDuration: 5,
          endOfTurnAction: (game, characterIndex) => {
            messageCache.push(
              "The lights of judgment lit up the sky.",
              TCGThread.Gameroom
            );
            CommonCardAction.commonAttack(game, characterIndex, {
              damage,
              hpCost: 0,
              isTimedEffectAttack: true,
            });
          },
        })
      );
    }
  },
});

const a_catastravia = new Card({
  title: "Lights of Judgment: Catastravia",
  description: ([dmg]) =>
    `HP-15. DMG ${dmg}. At the next 5 turn ends, deal ${dmg} DMG. Treat this card as "Uppercut" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  cardMetadata: { nature: "Attack", signature: true },
  effects: [4],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...a_uppercut,
        title: "Uppercut (Lights of Judgment: Catastravia)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_catastraviaBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

const elementaryDefensiveMagicBase = new Card({
  title: "Elementary Defensive Magic",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn. Treat this card as "Bare-handed Block" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  priority: 2,
  effects: [20],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];

    messageCache.push(
      `${character.name} casted an elementary defensive spell!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Elementary Defensive Magic",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const elementaryDefensiveMagic = new Card({
  title: "Elementary Defensive Magic",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn. Treat this card as "Bare-handed Block" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  priority: 2,
  effects: [20],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...bareHandedBlock,
        title: "Bare-handed Block (Elementary Defensive Magic)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...elementaryDefensiveMagicBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

export const a_concentratedOffensiveMagicZoltraak = new Card({
  title: "Concentrated Offensive Magic: Zoltraak",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-8. DMG ${dmg}.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [14],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} sent forth a concentrated blast of Zoltraak.`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 8,
    });
  },
});

export const denkenDeck = [
  { card: a_jab, count: 2 },
  { card: a_hook, count: 2 },
  { card: a_uppercut, count: 2 },
  { card: bareHandedBlock, count: 1 },
  { card: a_waldgose, count: 2 },
  { card: a_daosdorg, count: 2 },
  { card: a_catastravia, count: 1 },
  { card: elementaryDefensiveMagic, count: 1 },
  { card: a_concentratedOffensiveMagicZoltraak, count: 2 },
];

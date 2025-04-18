import Card from "../card";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import CommonCardAction from "../util/commonCardActions";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";

const imitate = new Card({
  title: "Imitate",
  cardMetadata: { nature: "Util" },
  description: () =>
    `Use the card the opponent used last turn at this card's empower level -2.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [],
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
        cardMetadata: { nature: "Default" },
        description: () => "No card to imitate. This move will fail.",
        effects: [],
        emoji: CardEmoji.LINIE_CARD,
        cardAction: (_game, _characterIndex, messageCache: MessageCache) => {
          messageCache.push(
            `No card to imitate. The move failed!`,
            TCGThread.Gameroom
          );
        },
        imitated: true,
      });
    }
  },
});

export const adapt = new Card({
  title: "Adapt",
  cardMetadata: { nature: "Util" },
  description: ([spd, atkDef, hp]) =>
    `SPD+${spd}. If HP > 50, ATK+${atkDef}, DEF+${atkDef}. If HP <= 50, heal ${hp} HP.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [2, 2, 10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} adapts to the situation.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD
    );

    const atkDefAdjust = this.calculateEffectValue(this.effects[1]);
    if (character.stats.stats.HP > 50) {
      character.adjustStat(atkDefAdjust, StatsEnum.ATK);
      character.adjustStat(atkDefAdjust, StatsEnum.DEF);
    } else {
      character.adjustStat(
        this.calculateEffectValue(this.effects[2]),
        StatsEnum.HP
      );
    }
  },
});

export const manaDetection = new Card({
  title: "Mana Detection",
  cardMetadata: { nature: "Util" },
  description: ([spd, bigNumber, smallNumber]) =>
    `SPD+${spd}. If Opp's DEF >= Opp's ATK, ATK+${bigNumber}, DEF+${smallNumber}. Otherwise, ATK+${smallNumber}, DEF+${bigNumber}.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [2, 2, 1],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} detects the opponent's mana flow.`,
      TCGThread.Gameroom
    );

    const opponent = game.getCharacter(1 - characterIndex);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD
    );

    const bigNumber = this.calculateEffectValue(this.effects[1]);
    const smallNumber = this.calculateEffectValue(this.effects[2]);

    if (opponent.stats.stats.DEF >= opponent.stats.stats.ATK) {
      character.adjustStat(bigNumber, StatsEnum.ATK);
      character.adjustStat(smallNumber, StatsEnum.DEF);
    } else {
      character.adjustStat(smallNumber, StatsEnum.ATK);
      character.adjustStat(bigNumber, StatsEnum.DEF);
    }
  },
});

const parry = new Card({
  title: "Parry",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to parry the opponent's attack.`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Parry",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (game, characterIndex) => {
          game.characters[characterIndex].adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_erfassenAxe = new Card({
  title: "Erfassen: Axe",
  description: ([dmg]) => `HP-3. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  cardMetadata: { nature: "Attack", signature: true },
  effects: [11],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Axe imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 3 });
  },
});

export const a_erfassenSword = new Card({
  title: "Erfassen: Sword",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-2. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [9],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Sword imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 2 });
  },
});

export const a_erfassenSpear = new Card({
  title: "Erfassen: Spear",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-1. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Spear imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 1 });
  },
});

export const a_erfassenKnife = new Card({
  title: "Erfassen: Knife",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Knife throw imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

export const linieDeck = [
  { card: imitate, count: 2 },
  { card: adapt, count: 2 },
  { card: manaDetection, count: 2 },
  { card: parry, count: 1 },
  { card: a_erfassenAxe, count: 2 },
  { card: a_erfassenSword, count: 2 },
  { card: a_erfassenSpear, count: 2 },
  { card: a_erfassenKnife, count: 2 },
];

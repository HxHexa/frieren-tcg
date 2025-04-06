import Card from "../card";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import TimedEffect from "../timedEffect";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Game from "../game";

const a_FrierenStrikeTheirWeakpoint = new Card({
  title: "Frieren! Strike Their Weakpoint!",
  description: ([dmg]) =>
    `Frieren attacks for ${dmg} DMG. At next turn's end, Frieren attacks for an additional ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Frieren!`,
      TCGThread.Gameroom,
    );
    const damage = this.calculateEffectValue(this.effects[0]);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Frieren",
      new TimedEffect({
        name: "Frieren: Weakpoint Analysis",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 2,
        tags: { Frieren: 1 },
        endOfTimedEffectAction: function (this, game, characterIndex) {
          messageCache.push(
            "Frieren strikes the weakpoint!",
            TCGThread.Gameroom,
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      }),
    );

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

const a_FrierenBackMeUp = new Card({
  title: "Frieren! Back Me Up!",
  description: ([dmg]) =>
    `Frieren attacks for ${dmg} DMG. For the next 3 turn ends, Frieren attacks for an additional ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Frieren!`,
      TCGThread.Gameroom,
    );
    const damage = this.calculateEffectValue(this.effects[0]);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Frieren",
      new TimedEffect({
        name: "Frieren: Backing Fire",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 3,
        tags: { Frieren: 1 },
        endOfTurnAction: function (this, game, characterIndex) {
          messageCache.push(
            "Frieren provides supporting fire!",
            TCGThread.Gameroom,
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      }),
    );

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

const a_EisenTheEnemysOpen = new Card({
  title: "Eisen! The Enemy's Open!",
  description: ([def, dmg]) =>
    `Eisen winds up. DEF+${def} for 2 turns. At next turn's end, deal ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [2, 10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Eisen!`,
      TCGThread.Gameroom,
    );
    const def = this.calculateEffectValue(this.effects[0]);
    const damage = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(def, StatsEnum.DEF);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Eisen",
      new TimedEffect({
        name: "Eisen: Winding Up",
        description: `DEF+${def}. Deal ${damage} at end of timed effect.`,
        turnDuration: 2,
        tags: { Eisen: 1 },
        endOfTimedEffectAction: function (this, game, characterIndex) {
          messageCache.push("Eisen lands his attack!", TCGThread.Gameroom);
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
          character.adjustStat(-def, StatsEnum.DEF);
        },
        replacedAction: function (this, _game, _characterIndex) {
          messageCache.push("Eisen shifted his stance.", TCGThread.Gameroom);
          character.adjustStat(-def, StatsEnum.DEF);
        },
      }),
    );
  },
});

const a_EisenCoverMyBack = new Card({
  title: "Eisen! Cover My Back!",
  description: ([def, dmg]) =>
    `Eisen provides cover. DEF+${def} for 3 turns. When an opponent attacks, counter for ${dmg} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [3, 5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Eisen!`,
      TCGThread.Gameroom,
    );
    const def = this.calculateEffectValue(this.effects[0]);
    const counterDmg = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(def, StatsEnum.DEF);

    character.ability.abilityCounterEffect = (
      game,
      characterIndex,
      messageCache: MessageCache,
      _attackDamage,
    ) => {
      messageCache.push("Eisen counters the attack!", TCGThread.Gameroom);
      CommonCardAction.commonAttack(game, characterIndex, {
        damage: counterDmg,
        hpCost: 0,
      });
    };

    const endOfTimedEffectAction = function (
      _game: Game,
      _characterIndex: number,
      messageCache: MessageCache,
    ) {
      messageCache.push("Eisen shifted his stance.", TCGThread.Gameroom);
      character.adjustStat(-def, StatsEnum.DEF);
      character.ability.abilityCounterEffect = undefined;
    };

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Eisen",
      new TimedEffect({
        name: "Eisen: On the Lookout",
        description: `DEF+${def}. When an opponent attacks, counter for ${counterDmg} DMG`,
        turnDuration: 3,
        tags: { Eisen: 1 },
        endOfTimedEffectAction: endOfTimedEffectAction,
        replacedAction: endOfTimedEffectAction,
      }),
    );
  },
});

const eisenHoldTheLine = new Card({
  title: "Eisen! Hold The Line!",
  description: ([def]) => `Eisen holds the line. DEF+${def} for 5 turns.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [4],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Eisen!`,
      TCGThread.Gameroom,
    );
    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);

    const endOfTimedEffectAction = function (
      _game: Game,
      _characterIndex: number,
      messageCache: MessageCache,
    ) {
      messageCache.push("Eisen backed down.", TCGThread.Gameroom);
      character.adjustStat(-def, StatsEnum.DEF);
    };

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Eisen",
      new TimedEffect({
        name: "Eisen: Hold the Line",
        description: `DEF+${def}.`,
        turnDuration: 5,
        tags: { Eisen: 1 },
        endOfTimedEffectAction: endOfTimedEffectAction,
        replacedAction: endOfTimedEffectAction,
      }),
    );
  },
});

const heiterEmergency = new Card({
  title: "Heiter! Emergency!",
  description: ([heal]) =>
    `Heiter heals the party for ${heal}HP. At next turn's end, heal an additional ${heal} HP.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [6],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Heiter!`,
      TCGThread.Gameroom,
    );
    const heal = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(heal, StatsEnum.HP);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Heiter",
      new TimedEffect({
        name: "Heiter: First-Aid",
        description: `Heal ${heal} at end of timed effect.`,
        turnDuration: 2,
        tags: { Heiter: 1 },
        endOfTimedEffectAction: function (this, _game, _characterIndex) {
          messageCache.push("Heiter provides first-aid!", TCGThread.Gameroom);
          character.adjustStat(heal, StatsEnum.HP);
        },
      }),
    );
  },
});

const a_heiterThreeSpears = new Card({
  title: "Heiter! Don't give them an opening!",
  description: ([heal]) =>
    `Heiter casts Three Spears of the Goddess! At next 3 turn's end, deal ${heal} DMG.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Heiter!`,
      TCGThread.Gameroom,
    );
    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Heiter",
      new TimedEffect({
        name: "Heiter: Three Spears of the Goddess",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 3,
        tags: { Heiter: 1 },
        endOfTurnAction: (game, characterIndex) => {
          messageCache.push(
            "The goddess' spears continue to rain!",
            TCGThread.Gameroom,
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      }),
    );
  },
});

const heiterTrustYou = new Card({
  title: "I trust you, Heiter.",
  description: ([atkSpd]) =>
    `Heiter supports the party. ATK+${atkSpd}, SPD+${atkSpd} for 5 turns.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [4],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called on help from Heiter!`,
      TCGThread.Gameroom,
    );
    const atkSpd = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(atkSpd, StatsEnum.ATK);
    character.adjustStat(atkSpd, StatsEnum.SPD);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "Heiter",
      new TimedEffect({
        name: "Heiter: Awakening",
        description: `ATK+${atkSpd}. SPD+${atkSpd}.`,
        turnDuration: 5,
        tags: { Heiter: 1 },
        endOfTimedEffectAction: function (this, _game, _characterIndex) {
          messageCache.push(
            "Heiter needs to take a breather.",
            TCGThread.Gameroom,
          );
          character.adjustStat(-atkSpd, StatsEnum.ATK);
          character.adjustStat(-atkSpd, StatsEnum.SPD);
        },
        replacedAction: function (this, _game, _characterIndex) {
          messageCache.push("Heiter halted his support.", TCGThread.Gameroom);
          character.adjustStat(-atkSpd, StatsEnum.ATK);
          character.adjustStat(-atkSpd, StatsEnum.SPD);
        },
      }),
    );
  },
});

const quickBlock = new Card({
  title: "Quick Block",
  description: ([def]) =>
    `Priority+3. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.HIMMEL_CARD,
  priority: 3,
  effects: [25],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} swiftly readied ${character.cosmetic.pronouns.possessive} sword to prepare for the opponent's attack!`,
      TCGThread.Gameroom,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Quick Block",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      }),
    );
  },
});

const rally = new Card({
  title: "Rally",
  description: ([hp, stat]) =>
    `HP+${hp}. ATK+${stat}. DEF+${stat}. SPD+${stat}. An additional HP+${hp}, ATK+${stat}, DEF+${stat}, SPD+${stat} for each one of your active allies.`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [2, 1],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} rallied ${character.cosmetic.pronouns.possessive} allies!`,
      TCGThread.Gameroom,
    );

    const activeAllies = 1 + character.timedEffects.length;
    const hp = activeAllies * this.calculateEffectValue(this.effects[0]);
    const stat = activeAllies * this.calculateEffectValue(this.effects[1]);

    character.adjustStat(hp, StatsEnum.HP);
    character.adjustStat(stat, StatsEnum.ATK);
    character.adjustStat(stat, StatsEnum.DEF);
    character.adjustStat(stat, StatsEnum.SPD);
  },
});

export const a_extremeSpeed = new Card({
  title: "Extreme Speed",
  description: ([dmg]) => `Priority+1. HP-8. DMG ${dmg}`,
  emoji: CardEmoji.HIMMEL_CARD,
  priority: 1,
  effects: [12],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} dashed at the opponent!`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 8 });
  },
});

export const a_realHeroSwing = new Card({
  title: "A Real Hero's Swing",
  description: ([dmg]) => `HP-12. DMG ${dmg}`,
  emoji: CardEmoji.HIMMEL_CARD,
  effects: [20],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `The Hero ${character.name} heaved his sword!`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 12 });
  },
});

export const himmelDeck = [
  { card: a_FrierenStrikeTheirWeakpoint, count: 1 },
  { card: a_FrierenBackMeUp, count: 1 },
  { card: a_EisenTheEnemysOpen, count: 1 },
  { card: a_EisenCoverMyBack, count: 1 },
  { card: eisenHoldTheLine, count: 1 },
  { card: heiterEmergency, count: 1 },
  { card: a_heiterThreeSpears, count: 1 },
  { card: heiterTrustYou, count: 1 },
  { card: quickBlock, count: 1 },
  { card: rally, count: 2 },
  { card: a_extremeSpeed, count: 2 },
  { card: a_realHeroSwing, count: 2 },
];

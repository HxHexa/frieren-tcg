import Deck from "../deck";
import Card from "../card";
import TimedEffect from "../timedEffect";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import Rolls from "../util/rolls";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

export const a_hairWhip = new Card({
  title: "Hair Whip",
  description: ([def, dmg]) =>
    `DEF+${def}. Afterwards, HP-4, DMG ${dmg}+DEF/4.`,
  effects: [2, 7],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} whipped ${character.cosmetic.pronouns.possessive} hair!`,
      TCGThread.Gameroom,
    );

    const defIncrease = this.calculateEffectValue(this.effects[0]);
    const newDef = character.stats.stats.DEF + defIncrease;
    character.adjustStat(defIncrease, StatsEnum.DEF);
    const damage = this.calculateEffectValue(this.effects[1]) + newDef / 4;

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 4 });
  },
});

export const harden = new Card({
  title: "Harden",
  description: ([def]) => `HP-2. DEF+${def}`,
  effects: [2],
  emoji: CardEmoji.SHIELD,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} toughened ${character.cosmetic.pronouns.possessive} hair defense!`,
      TCGThread.Gameroom,
    );

    if (character.adjustStat(-2, StatsEnum.HP)) {
      character.adjustStat(
        this.calculateEffectValue(this.effects[0]),
        StatsEnum.DEF,
      );
    }
  },
});

// export const holeUp = new Card({
//   title: "Hole Up",
//   description: ([def]) =>
//     `Discard 1 card at random and draw 1 card. SPD-2. DEF+${def}`,
//   effects: [2],
//   emoji: CardEmoji.DICE,
//   cardAction: function (this: Card, game, characterIndex, messageCache) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} holed ${character.cosmetic.pronouns.reflexive} up!`,
//       TCGThread.Gameroom,
//     );

//     character.discardCard(Rolls.rollDAny(5));
//     character.drawCard();
//     character.adjustStat(-2, StatsEnum.SPD);
//     character.adjustStat(
//       this.calculateEffectValue(this.effects[0]),
//       StatsEnum.DEF,
//     );
//   },
// });

export const rest = new Card({
  title: "Rest",
  description: ([hp]) => `DEF-4. Heal ${hp} HP`,
  effects: [10],
  emoji: CardEmoji.HEART,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} rests up.`, TCGThread.Gameroom);
    character.adjustStat(-4, StatsEnum.DEF);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP,
    );
  },
});

export const a_pierce = new Card({
  title: "Pierce",
  description: ([def, dmg]) =>
    `HP-7. DEF+${def}. Afterwards, DMG ${dmg} + (DEF/4). Pierces through 1/4 of the opponent's defense.`,
  effects: [1, 10],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} pierced the opponent!`,
      TCGThread.Gameroom,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.DEF / 4 +
      opponent.stats.stats.DEF / 4;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 7 });
  },
});

const hairBarrier = new Card({
  title: "Hair Barrier",
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  effects: [20],
  emoji: CardEmoji.HOURGLASS,
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} surrounded ${character.cosmetic.pronouns.reflexive} in ${character.cosmetic.pronouns.possessive} hair barrier!`,
      TCGThread.Gameroom,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Hair Barrier",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-1 * def, StatsEnum.DEF);
        },
      }),
    );
  },
});

export const teaTime = new Card({
  title: "Tea Time",
  description: ([def, hp]) =>
    `DEF+${def} for both characters. Heal ${hp} for both characters. Gain 1 Tea Time snack.`,
  effects: [1, 5],
  tags: { TeaTime: 1 },
  emoji: CardEmoji.HEART,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} enjoyed a cup of tea.`,
      TCGThread.Gameroom,
    );
    const defBuff = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defBuff, StatsEnum.DEF);
    opponent.adjustStat(defBuff, StatsEnum.DEF);

    const hpHeal = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(hpHeal, StatsEnum.HP);
    opponent.adjustStat(hpHeal, StatsEnum.HP);
  },
});

export const teaParty = new Card({
  title: "Tea Party",
  description: ([def, hp]) =>
    `DEF+${def} for both characters. Heal ${hp} for both characters. Gain 2 Tea Time snacks.`,
  effects: [2, 7],
  tags: { TeaTime: 2 },
  emoji: CardEmoji.RANDOM,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} held a tea party!`,
      TCGThread.Gameroom,
    );
    const defBuff = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defBuff, StatsEnum.DEF);
    opponent.adjustStat(defBuff, StatsEnum.DEF);

    const hpHeal = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(hpHeal, StatsEnum.HP);
    opponent.adjustStat(hpHeal, StatsEnum.HP);
  },
});

export const a_piercingDrill = new Card({
  title: "Piercing Drill",
  description: ([dmg]) =>
    `HP-12. DMG ${dmg} + DEF/3. Pierces through 1/3 of the opponent's defense.`,
  effects: [14],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} used a piercing drill!`,
      TCGThread.Gameroom,
    );
    const damage =
      this.calculateEffectValue(this.effects[0]) +
      character.stats.stats.DEF / 3 +
      opponent.stats.stats.DEF / 3;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 12 });
  },
});

export const senseDeck = [
  { card: a_hairWhip, count: 2 },
  { card: harden, count: 2 },
  { card: rest, count: 1 },
  { card: a_pierce, count: 2 },
  { card: hairBarrier, count: 3 },
  { card: teaTime, count: 2 },
  { card: teaParty, count: 1 },
  { card: a_piercingDrill, count: 2 },
];

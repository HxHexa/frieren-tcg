import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
import { generateCustomRandomString } from "../../../util/utils";
import Card from "../../card";
import { CardEmoji } from "../../formatting/emojis";
import { StatsEnum } from "../../stats";
import TimedEffect from "../../timedEffect";
import CommonCardAction from "../../util/commonCardActions";

const madness = new Card({
  title: "Madness",
  cardMetadata: { nature: "Util" },
  description: ([atk, def]) => `ATK+${atk}. DEF+${def}`,
  emoji: CardEmoji.HOURGLASS,
  effects: [3, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const randomMessage = generateCustomRandomString(60, {
      useLowercase: true,
      useUppercase: true,
      randomizeLength: true,
    });
    messageCache.push(randomMessage, TCGThread.Gameroom);

    const atk = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(atk, StatsEnum.ATK);
    const def = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(def, StatsEnum.DEF);
  },
});

const earPiercingScream = new Card({
  title: "Ear Piercing Scream",
  cardMetadata: { nature: "Util" },
  description: ([def]) => `HP-2. Opponent's DEF-${def}.`,
  emoji: CardEmoji.ENERGY,
  effects: [3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const randomMessage = generateCustomRandomString(60, {
      useUppercase: true,
      randomizeLength: true,
    });
    messageCache.push(randomMessage, TCGThread.Gameroom);
    messageCache.push(`You hear an ear-piercing scream.`, TCGThread.Gameroom);

    character.adjustStat(-2, StatsEnum.HP);
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF
    );
  },
});

export const solitude = new Card({
  title: "Solitude",
  cardMetadata: { nature: "Util" },
  description: ([hp]) => `Heal for ${hp}.`,
  emoji: CardEmoji.HEART,
  effects: [12],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const randomMessage = generateCustomRandomString(30, {
      useLowercase: true,
      randomizeLength: true,
      minimumLength: 10,
    });
    messageCache.push(randomMessage, TCGThread.Gameroom);

    const hp = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(hp, StatsEnum.HP);
  },
});

export const a_curse = new Card({
  title: "Curse",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-11. DMG ${dmg} at turn end for 5 turns.`,
  emoji: CardEmoji.PUNCH,
  effects: [5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    const randomMessage = generateCustomRandomString(80, {
      useNumbers: true,
      useSpecial: true,
      randomizeLength: true,
      minimumLength: 40,
    });
    messageCache.push(randomMessage, TCGThread.Gameroom);

    character.adjustStat(-11, StatsEnum.HP);
    const damage = this.calculateEffectValue(this.effects[0]);
    character.timedEffects.push(
      new TimedEffect({
        name: "Curse",
        description: `Deal ${damage} at the end of each turn.`,
        turnDuration: 5,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            "You feel something gnaws at you from behind.",
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
  },
});

const guiltTrip = new Card({
  title: "Guilt Trip",
  cardMetadata: { nature: "Util" },
  description: ([def, spd]) => `Opp's DEF-${def}. Opp's SPD-${spd}`,
  emoji: CardEmoji.HOURGLASS,
  effects: [3, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const randomMessage = generateCustomRandomString(100, {
      useUppercase: true,
      useSpecial: true,
      minimumLength: 60,
      randomizeLength: true,
    });
    messageCache.push(randomMessage, TCGThread.Gameroom);

    const opponent = game.getCharacter(1 - characterIndex);
    const def = this.calculateEffectValue(this.effects[0]);
    opponent.adjustStat(-def, StatsEnum.DEF);
    const spd = this.calculateEffectValue(this.effects[1]);
    opponent.adjustStat(-spd, StatsEnum.SPD);
  },
});

export const a_killingMagic = new Card({
  title: "Killing Magic",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-10. DMG ${dmg}`,
  emoji: CardEmoji.PUNCH,
  effects: [15],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const randomMessage = generateCustomRandomString(90, {
      useUppercase: true,
      useSpecial: true,
      useLowercase: true,
      useNumbers: true,
      minimumLength: 50,
      randomizeLength: true,
    });
    messageCache.push(randomMessage, TCGThread.Gameroom);

    const character = game.getCharacter(characterIndex);
    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 10 });
  },
});

// we are not giving Serie this - she doesn't need 2 HoMs
export const a_solitaryPractice = new Card({
  title: `Solitary Practice`,
  description: ([dmg]) =>
    `HP-40. At this turn's resolution, strike for DMG ${dmg}. Afterward, decreases DEF and SPD by 20. `,
  emoji: CardEmoji.ENERGY,
  effects: [30],
  cardMetadata: { nature: "Attack", signature: true },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`solitary practice`, TCGThread.Gameroom);
    const endOfTurnDamage = this.calculateEffectValue(this.effects[0]);
    if (character.adjustStat(-1 * 40, StatsEnum.HP)) {
      character.timedEffects.push(
        new TimedEffect({
          name: "Impending: Solitary Practice",
          description: `At this turn's resolution, strike for ${endOfTurnDamage}. Afterwards, DEF-20, SPD-20.`,
          turnDuration: 1,
          endOfTimedEffectAction: (game, characterIndex) => {
            messageCache.push(
              "The Height of one's Solitary Practice is on display.",
              TCGThread.Gameroom
            );
            game.attack({
              attackerIndex: characterIndex,
              damage: endOfTurnDamage,
              isTimedEffectAttack: true,
            });
            character.adjustStat(-20, StatsEnum.DEF);
            character.adjustStat(-20, StatsEnum.SPD);
          },
        })
      );
    }
  },
});

export const cosmicTonDeck = [
  { card: madness, count: 2 },
  { card: earPiercingScream, count: 1 },
  { card: solitude, count: 3 },
  { card: a_curse, count: 2 },
  { card: guiltTrip, count: 2 },
  { card: a_killingMagic, count: 4 },
  { card: a_solitaryPractice, count: 1 },
];

import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
import Card from "../../card";
import { CardEmoji } from "../../formatting/emojis";
import { StatsEnum } from "../../stats";
import TimedEffect from "../../timedEffect";
import CommonCardAction from "../../util/commonCardActions";

export const a_charge = new Card({
  title: "Charge",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-5. DMG ${dmg}.`,
  emoji: CardEmoji.PUNCH,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} charged ahead!`, TCGThread.Gameroom);

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });
  },
});

const earPiercingScream = new Card({
  title: "Ear Piercing Scream",
  cardMetadata: { nature: "Util" },
  description: ([def]) => `HP-2. Opponent's DEF-${def}.`,
  emoji: CardEmoji.ENERGY,
  effects: [5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} let out an ear-piercing scream!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-2, StatsEnum.HP);
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF
    );
  },
});

const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SHIELD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} made a quick retreat!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Hide",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_roomCollapse = new Card({
  title: `Room Collapse`,
  description: ([dmg]) =>
    `DMG ${dmg}. Reduces the user's HP to 1. Does not factor in ATK in Damage calculation.`,
  emoji: CardEmoji.PUNCH,
  effects: [40],
  cardMetadata: { nature: "Attack", signature: true },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} collapsed the ceiling!`,
      TCGThread.Gameroom
    );
    character.setStat(1, StatsEnum.HP);
    const damage =
      this.calculateEffectValue(this.effects[0]) - character.stats.stats.ATK;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

export const stoneGeiselDeck = [
  { card: a_charge, count: 5 },
  { card: hide, count: 5 },
  { card: earPiercingScream, count: 4 },
  { card: a_roomCollapse, count: 1 },
];

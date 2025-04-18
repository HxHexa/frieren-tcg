import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
import Card from "../../card";
import { CardEmoji } from "../../formatting/emojis";
import { StatsEnum } from "../../stats";
import TimedEffect from "../../timedEffect";
import CommonCardAction from "../../util/commonCardActions";

const a_flame = new Card({
  title: "Flame",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-5. DMG ${dmg}.`,
  emoji: CardEmoji.PUNCH,
  effects: [12],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} sets the floor ablaze!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });
  },
});

const a_burn = new Card({
  title: "Burn",
  cardMetadata: { nature: "Attack" },
  description: ([dmg, def]) => `HP-4. DMG ${dmg}. Opponent's DEF-${def}.`,
  emoji: CardEmoji.ENERGY,
  effects: [10, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} torches the opposition!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 4 });

    opponent.adjustStat(
      this.calculateEffectValue(-this.effects[1]),
      StatsEnum.DEF
    );
  },
});

const extinguish = new Card({
  title: "Extinguish",
  cardMetadata: { nature: "Util" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} for 2 turns. ATK-10.`,
  emoji: CardEmoji.SHIELD,
  priority: 2,
  effects: [50],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} extinguishes itself!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-10, StatsEnum.ATK);

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Extinguish",
        description: `Increases DEF by ${def} for 2 turns.`,
        priority: -1,
        turnDuration: 2,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

const a_inferno = new Card({
  title: `Inferno`,
  description: ([dmg]) => `DMG ${dmg}. Reduces the user's HP to 1.`,
  emoji: CardEmoji.ENERGY,
  effects: [30],
  cardMetadata: { nature: "Attack", signature: true },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} lets out a gigantic inferno!`,
      TCGThread.Gameroom
    );
    character.setStat(1, StatsEnum.HP);
    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

export const fireGolemDeck = [
  { card: a_flame, count: 5 },
  { card: a_burn, count: 4 },
  { card: extinguish, count: 5 },
  { card: a_inferno, count: 1 },
];

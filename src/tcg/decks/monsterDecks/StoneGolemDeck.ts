import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
import Card from "../../card";
import { CardEmoji } from "../../formatting/emojis";
import { StatsEnum } from "../../stats";
import TimedEffect from "../../timedEffect";
import CommonCardAction from "../../util/commonCardActions";
import { a_roomCollapse } from "./StoneGeiselDeck";

export const a_rockTomb = new Card({
  title: "Rock Tomb",
  cardMetadata: { nature: "Attack" },
  description: ([dmg, spd]) => `HP-3. DMG ${dmg}. Opponent's SPD-${spd}`,
  emoji: CardEmoji.PUNCH,
  effects: [10, 5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} formed a tomb of rock!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });

    const spdLoss = this.calculateEffectValue(this.effects[1]);
    opponent.adjustStat(-spdLoss, StatsEnum.SPD);
  },
});

const crystalize = new Card({
  title: "Crystalize",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} for 2 turns. ATK-15 for 2 turns.`,
  emoji: CardEmoji.SHIELD,
  priority: 2,
  effects: [30],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} crystalizes ${character.cosmetic.pronouns.reflexive}!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.adjustStat(-15, StatsEnum.ATK);
    character.timedEffects.push(
      new TimedEffect({
        name: "Hide",
        description: `Increases DEF by ${def} for 2 turns. ATK-15 for 2 turns.`,
        priority: -1,
        turnDuration: 2,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} breaks out of ${character.cosmetic.pronouns.possessive} crystalization.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-def, StatsEnum.DEF);
          character.adjustStat(15, StatsEnum.ATK);
        },
      })
    );
  },
});

const a_crusher = new Card({
  title: "Crusher",
  cardMetadata: { nature: "Attack" },
  description: ([dmg, spd]) => `HP-5. DMG ${dmg}. Opponent's SPD-${spd}.`,
  emoji: CardEmoji.PUNCH,
  effects: [15, 7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} crushes the opposition!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });

    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD
    );
  },
});

export const stoneGeiselDeck = [
  { card: a_rockTomb, count: 5 },
  { card: crystalize, count: 5 },
  { card: a_crusher, count: 4 },
  { card: a_roomCollapse, count: 1 },
];

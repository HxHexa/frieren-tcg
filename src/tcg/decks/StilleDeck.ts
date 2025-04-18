import Card from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import Rolls from "../util/rolls";
import { CardEmoji } from "../formatting/emojis";
import { MessageCache } from "../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_peck = new Card({
  title: "Peck",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) =>
    `SPD-2. Discard a random card in hand and draw 1 card. DMG ${dmg}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [5],
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} pecked the opposition!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-2, StatsEnum.SPD);
    character.discardCard(Rolls.rollDAny(5));
    character.drawCard();
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 0,
    });
  },
});

const a_ironFeather = new Card({
  title: "Iron Feather",
  cardMetadata: { nature: "Attack" },
  description: ([def, dmg]) => `SPD-3. DEF+${def}. DMG ${dmg}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [1, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} sharpened ${character.cosmetic.pronouns.possessive} feathers!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-3, StatsEnum.SPD);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[1]),
      hpCost: 0,
    });
  },
});

const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: "Util" },
  description: ([def]) => `SPD-3. DEF+${def}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} hid ${character.cosmetic.pronouns.reflexive} and flew to safety!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-3, StatsEnum.SPD);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF
    );
  },
});

const roost = new Card({
  title: "Roost",
  cardMetadata: { nature: "Util" },
  description: ([hp]) => `SPD-5 for 3 turns. DEF-3 for 2 turns. Heal ${hp}HP.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} landed on the ground.`,
      TCGThread.Gameroom
    );

    character.adjustStat(-5, StatsEnum.SPD);
    character.adjustStat(-3, StatsEnum.DEF);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `DEF-3 for 2 turns.`,
        turnDuration: 2,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} opened its wings.`,
            TCGThread.Gameroom
          );
          character.adjustStat(3, StatsEnum.DEF);
        },
      })
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `SPD-5 for 3 turns.`,
        turnDuration: 3,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} took flight again!`,
            TCGThread.Gameroom
          );
          character.adjustStat(5, StatsEnum.SPD);
        },
      })
    );
  },
});

export const deflect = new Card({
  title: "Deflect",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to deflect an attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Deflect",
        description: `Increases DEF by ${def} until the end of the turn.`,
        turnDuration: 1,
        priority: -1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

const flyAway = new Card({
  title: "Fly Away",
  cardMetadata: { nature: "Util" },
  description: ([spd]) => `Priority+2. SPD + ${spd} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  priority: 2,
  effects: [25],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} flew away!`, TCGThread.Gameroom);

    const spd = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spd, StatsEnum.SPD);
    character.timedEffects.push(
      new TimedEffect({
        name: "Deflect",
        description: `Increases SPD by ${spd} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-spd, StatsEnum.SPD);
        },
      })
    );
  },
});

export const a_geisel = new Card({
  title: "Geisel",
  description: ([dmg]) =>
    `SPD-20. Lands on a tree and asks its fellow Geisel for help! Geisel (ATK: 15) will show up to attack for ${dmg}DMG between 1 - 3 turns.`,
  emoji: CardEmoji.STILLE_CARD,
  cardMetadata: { nature: "Attack", signature: true },
  effects: [15],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called its fellow friends the Geisel for help!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-20, StatsEnum.SPD);
    const damage = this.calculateEffectValue(this.effects[0]);
    const turnCount = Rolls.rollDAny(3) + 1;
    character.timedEffects.push(
      new TimedEffect({
        name: "Geisel Strike!",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: turnCount,
        endOfTurnAction: (game, characterIndex) => {
          messageCache.push("The Geisel doesn't stop!", TCGThread.Gameroom);
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage + 15,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      })
    );
  },
});

export const stilleDeck = [
  { card: a_peck, count: 2 },
  { card: a_ironFeather, count: 3 },
  { card: hide, count: 2 },
  { card: roost, count: 2 },
  { card: deflect, count: 1 },
  { card: flyAway, count: 3 },
  { card: a_geisel, count: 2 },
];

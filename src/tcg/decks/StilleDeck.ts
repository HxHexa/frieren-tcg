import Card, { Nature } from "@tcg/card";
import CommonCardAction from "@tcg/util/commonCardActions";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import Rolls from "@tcg/util/rolls";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "../formatting/mediaLinks";

const a_peck = new Card({
  title: "Peck",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `SPD-2. Discard a random card in hand and draw 1 card. DMG ${dmg}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [5],
  cardAction: function (
    this: Card,
    { game, name, self, sendToGameroom, basicAttack }
  ) {
    sendToGameroom(`${name} pecked the opposition!`);

    self.adjustStat(-2, StatsEnum.SPD, game);
    self.discardCard(Rolls.rollDAny(5));
    self.drawCard();
    basicAttack(0);
  },
});

const a_ironFeather = new Card({
  title: "Iron Feather",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) => `SPD-3. DEF+${def}. DMG ${dmg}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [1, 3],
  cosmetic: {
    cardGif: mediaLinks.stille_ironFeather_gif,
  },
  cardAction: function (
    this: Card,
    { possessive, name, sendToGameroom, basicAttack, flatSelfStat, selfStat }
  ) {
    sendToGameroom(`${name} sharpened ${possessive} feathers!`);

    flatSelfStat(-3, StatsEnum.SPD);
    selfStat(0, StatsEnum.DEF);

    basicAttack(1);
  },
});

const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: Nature.Util },
  description: ([def]) => `SPD-3. DEF+${def}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [2],
  cosmetic: {
    cardGif: mediaLinks.stille_hide_gif,
  },
  cardAction: function (
    this: Card,
    { name, reflexive, selfStat, flatSelfStat, sendToGameroom }
  ) {
    sendToGameroom(`${name} hid ${reflexive} and flew to safety!`);

    flatSelfStat(-3, StatsEnum.SPD);
    selfStat(0, StatsEnum.DEF);
  },
});

const roost = new Card({
  title: "Roost",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) => `SPD-5 for 3 turns. DEF-3 for 2 turns. Heal ${hp}HP.`,
  emoji: CardEmoji.ROOST_CARD,
  effects: [5],
  cosmetic: {
    cardGif: mediaLinks.stille_roost_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, selfStat, flatSelfStat }
  ) {
    sendToGameroom(`${name} landed on the ground.`);

    flatSelfStat(-5, StatsEnum.SPD);
    flatSelfStat(-3, StatsEnum.DEF);
    selfStat(0, StatsEnum.HP);

    self.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `DEF-3 for 2 turns.`,
        turnDuration: 2,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(`${name} opened its wings.`, TCGThread.Gameroom);
          self.adjustStat(3, StatsEnum.DEF, game);
        },
      })
    );

    self.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `SPD-5 for 3 turns.`,
        turnDuration: 3,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(`${name} took flight again!`, TCGThread.Gameroom);
          self.adjustStat(5, StatsEnum.SPD, game);
        },
      })
    );
  },
});

export const deflect = new Card({
  title: "Deflect",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} prepares to deflect an attack!`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Deflect",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        turnDuration: 1,
        priority: -1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

const flyAway = new Card({
  title: "Fly Away",
  cardMetadata: { nature: Nature.Util },
  description: ([spd]) => `SPD + ${spd} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  priority: 2,
  effects: [25],
  cosmetic: {
    cardGif: mediaLinks.stille_flyAway_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} flew away!`);

    const spd = calcEffect(0);
    self.adjustStat(spd, StatsEnum.SPD, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Fly Away",
        description: `Increases SPD by ${spd} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-spd, StatsEnum.SPD, game);
        },
      })
    );
  },
});

export const a_geisel = new Card({
  title: "Geisel",
  description: ([dmg]) =>
    `SPD-20. Lands on a tree and asks its fellow Geisel for help! Geisel (ATK: 15) will show up to attack for ${dmg}DMG for 2 turns.`,
  emoji: CardEmoji.STILLE_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [15],
  cosmetic: {
    cardGif: mediaLinks.stille_geisel_gif,
  },
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} called its fellow friends the Geisel for help!`);

    self.adjustStat(-20, StatsEnum.SPD, game);
    const damage = calcEffect(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Geisel Strike!",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 2,
        endOfTurnAction: (game, characterIndex) => {
          sendToGameroom("The Geisel doesn't stop!");
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage + 15,
            isTimedEffectAttack: true,
          });
        },
      })
    );
  },
});

const stilleDeck = [
  { card: a_peck, count: 2 },
  { card: a_ironFeather, count: 3 },
  { card: hide, count: 2 },
  { card: roost, count: 2 },
  { card: deflect, count: 2 },
  { card: flyAway, count: 3 },
  { card: a_geisel, count: 2 },
];

export default stilleDeck;

import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CardEmoji } from "@tcg/formatting/emojis";

const a_axeSwipe = new Card({
  title: "Axe Swipe",
  cardMetadata: { nature: Nature.Attack, resolve: 0 },
  description: ([dmg]) => `DMG ${dmg}. Uses 0 Resolve.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [9],
  hpCost: 5,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361125002761605140/IMG_3109.gif?ex=680829f1&is=6806d871&hm=ae00597c479d370662a52ae4f04cb024103354b0c758c483ff09946a0c1288ec&",
  },
  cardAction: function (
    this: Card,
    { sendToGameroom, name, possessive, basicAttack }
  ) {
    sendToGameroom(`${name} swiped ${possessive} axe!`);
    basicAttack(0);
  },
});

const offensiveStance = new Card({
  title: "Offensive Stance",
  cardMetadata: { nature: Nature.Util, resolve: 1 },
  description: ([atk, spd]) =>
    `ATK+${atk}. DEF-2 for 2 turns. SPD+${spd}. Gain 1 <Resolve>.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [2, 2],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361122664416018593/IMG_3106.gif?ex=680827c3&is=6806d643&hm=d6fdc758cc5b780bad809f674a6d3bf88f19ff038136bd96dca94e7c09ce18ed&",
  },
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, selfStat, possessive }
  ) {
    sendToGameroom(`${name} took an offensive stance!`);

    selfStat(0, StatsEnum.ATK);
    self.adjustStat(-2, StatsEnum.DEF, game);
    selfStat(1, StatsEnum.SPD);

    self.timedEffects.push(
      new TimedEffect({
        name: "Offensive Stance",
        description: `DEF-2 for 2 turns.`,
        turnDuration: 2,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(`${name} shifts ${possessive} stance.`);
          self.adjustStat(2, StatsEnum.DEF, game);
        },
      })
    );
  },
});

const defensiveStance = new Card({
  title: "Defensive Stance",
  cardMetadata: { nature: Nature.Util, resolve: 1 },
  description: ([def, spd]) =>
    `DEF+${def}. ATK-2 for 2 turns. SPD+${spd}. Gain 1 <Resolve>.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [2, 2],
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, selfStat, possessive }
  ) {
    sendToGameroom(`${name} took a defensive stance!`);

    self.adjustStat(-2, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF);
    selfStat(1, StatsEnum.SPD);

    self.timedEffects.push(
      new TimedEffect({
        name: "Defensive Stance",
        description: `ATK-2 for 2 turns.`,
        turnDuration: 2,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(`${name} shifts ${possessive} stance.`);
          self.adjustStat(2, StatsEnum.ATK, game);
        },
      })
    );
  },
});

const jumboBerrySpecialBreak = new Card({
  title: "Jumbo Berry Special Break",
  cardMetadata: { nature: Nature.Util },
  description: ([def, hp]) =>
    `SPD-2 for 2 turns. DEF+${def} for 2 turns. Heal ${hp} HP. Gain 1 <Resolve> at the end of next turn.`,
  emoji: CardEmoji.JUMBO_BERRY_CARD,
  effects: [2, 10],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1360990957671153826/IMG_3099.gif?ex=680855da&is=6807045a&hm=7b11f297c0dc63b3bd8e9e19d7b7cb316001a389454bd05213d99686879f4f3c&",
  },
  cardAction: function (
    this: Card,
    { sendToGameroom, name, self, calcEffect, game, selfStat, reflexive }
  ) {
    sendToGameroom(`${name} chowed down on a Jumbo Berry Special!`);

    const defChange = calcEffect(0);
    self.adjustStat(-2, StatsEnum.SPD, game);
    self.adjustStat(defChange, StatsEnum.DEF, game);
    selfStat(1, StatsEnum.HP);

    self.timedEffects.push(
      new TimedEffect({
        name: "Jumbo Berry Special Break",
        description: `SPD-2 for 2 turns. DEF+${defChange} for 2 turns.`,
        turnDuration: 2,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: (game, _characterIndex, _messageCache) => {
          sendToGameroom(`The break is over. ${name} recomposes ${reflexive}.`);
          self.adjustStat(2, StatsEnum.SPD, game);
          self.adjustStat(-1 * defChange, StatsEnum.DEF, game);
          self.adjustStat(1, StatsEnum.Ability, game);
        },
      })
    );
  },
});

export const block = new Card({
  title: "Block",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [20],
  priority: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1360996196788867283/IMG_3102.gif?ex=68085abb&is=6807093b&hm=0602a1a0ef9278e1544911aa3e5b873617d0ab8cdd84c958c62e94f162bfe111&",
  },
  cardAction: function (
    this: Card,
    { name, self, game, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} prepares to block an attack!`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);
    self.timedEffects.push(
      new TimedEffect({
        name: "Block",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

const concentration = new Card({
  title: "Concentration",
  cardMetadata: { nature: Nature.Util, resolve: 2 },
  description: ([spd]) => `Increases SPD by ${spd}. Gain 2 <Resolve>.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [3],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1360979639362781304/IMG_3087.gif?ex=68084b4f&is=6806f9cf&hm=98d20b75a63aca3116965b33fac4adac213feaefa4895cf0751976527dd483a0&",
  },
  cardAction: function (this: Card, { name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} concentrates on the battle.`);
    selfStat(0, StatsEnum.SPD);
  },
});

const a_ordensSlashTechnique = new Card({
  title: "Orden's Slash Technique",
  cardMetadata: { nature: Nature.Attack, resolve: -1 },
  description: ([dmg]) => `DMG ${dmg}. Uses 1 Resolve.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [14],
  hpCost: 8,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361187449522356324/IMG_3119.gif?ex=68086419&is=68071299&hm=f010c6a8f3b17eb25cdb15c8605dfb69ea06a323b0ca5aaed2484cce741ed4e6&",
  },
  cardAction: function (this: Card, { sendToGameroom, name, basicAttack }) {
    sendToGameroom(`${name} used Orden's Slash Technique!`);
    basicAttack(0);
  },
});

const fearBroughtMeThisFar = new Card({
  title: "Fear Brought Me This Far",
  cardMetadata: { nature: Nature.Util, resolve: 2 },
  description: ([atkDef]) =>
    `Increases ATK and DEF by ${atkDef}. Gain 2 <Resolve>.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [3],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1360983005946183957/IMG_3091.gif?ex=68084e72&is=6806fcf2&hm=5e9453189ccb1c31a4def06862e8dc7d2468c471eff0f8faa63d6288c8127c6c&",
  },
  cardAction: function (this: Card, { name, sendToGameroom, selfStat }) {
    sendToGameroom(
      `${name}'s hands can't stop shaking, but ${name} is determined.`
    );

    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
  },
});

const a_eisensAxeCleave = new Card({
  title: "Eisen's Axe Cleave",
  cardMetadata: { nature: Nature.Attack, resolve: -2 },
  description: ([dmg]) => `DMG ${dmg}. Uses up 2 Resolve stack.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [19],
  hpCost: 11,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361191191533719602/IMG_3110.gif?ex=68086795&is=68071615&hm=e80ebb6c7098f7f020cc5a67819287df12f6ea5fa9427231382b6a8b026f3e47&",
  },
  cardAction: function (
    this: Card,
    { name, sendToGameroom, possessive, basicAttack }
  ) {
    if (name === CharacterName.Stark) {
      sendToGameroom(
        `${name} recalls memory of ${possessive} master's Axe Cleave!`
      );
    } else {
      sendToGameroom(`${name} cleaves ${possessive} axe.`);
    }

    basicAttack(0);
  },
});

export const a_lastStand = new Card({
  title: "Last Stand",
  description: ([dmg]) =>
    `DEF-5 for 2 turns. This character's HP cannot drop below 1 for 2 turns. At the end of next turn, HP-20, use 2 Resolves, strike for DMG ${dmg}. This attack cannot be interrupted.`,
  emoji: CardEmoji.STARK_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [25],
  priority: 1,
  cardAction: function (
    this: Card,
    { name, self, sendToGameroom, game, calcEffect, personal }
  ) {
    sendToGameroom(`${name} winds up...`);
    const damage = calcEffect(0);

    self.additionalMetadata.minimumPossibleHp = 1;
    self.adjustStat(-5, StatsEnum.DEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Impending Lightning",
        description: `Strike for ${damage} damage. Uninterruptable.`,
        turnDuration: 2,
        metadata: { removableBySorganeil: false },
        executeEndOfTimedEffectActionOnRemoval: false,
        activateEndOfTurnActionThisTurn: false,
        endOfTimedEffectAction: (game, characterIndex) => {
          if (!game.gameSettings.liteMode) {
            sendToGameroom(
              `[⠀](https://c.tenor.com/eHxDKoFxr2YAAAAC/tenor.gif)`
            );
          }
          self.adjustStat(-20, StatsEnum.HP, game);
          self.adjustStat(5, StatsEnum.DEF, game);
          sendToGameroom(`${name} performs Lightning Strike!`);
          CommonCardAction.commonAttack(game, characterIndex, {
            damage,
            isTimedEffectAttack: true,
          });
          self.adjustStat(-2, StatsEnum.Ability, game);
        },
      })
    );

    self.timedEffects.push(
      new TimedEffect({
        name: "A Warrior's Last Stand",
        description: `HP cannot fall below 1 this turn.`,
        turnDuration: 2,
        priority: -1,
        metadata: { removableBySorganeil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          sendToGameroom(
            `${name} let out all ${personal} has. ${name} is no longer Sturdy.`
          );
          self.additionalMetadata.minimumPossibleHp = undefined;
        },
      })
    );
  },
});

const starkDeck = [
  { card: a_axeSwipe, count: 2 },
  { card: offensiveStance, count: 2 },
  { card: defensiveStance, count: 2 },
  { card: jumboBerrySpecialBreak, count: 2 },
  { card: block, count: 2 },
  { card: concentration, count: 1 },
  { card: a_ordensSlashTechnique, count: 2 },
  { card: fearBroughtMeThisFar, count: 1 },
  { card: a_eisensAxeCleave, count: 1 },
  { card: a_lastStand, count: 1 },
];

export default starkDeck;

import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CardEmoji } from "@tcg/formatting/emojis";
import mediaLinks from "../formatting/mediaLinks";

export const a_trustInYourAllyFrierensZoltraak = new Card({
  title: "Trust in Your Ally: Frieren's Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg} + HP/9`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_frierensZoltraak_image,
    cardGif: mediaLinks.sein_frierensZoltraak_gif,
  },
  effects: [5],
  hpCost: 6,
  cardAction: ({
    name,
    characterName,
    sendToGameroom,
    calcEffect,
    flatAttack,
    selfStats,
  }) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on help from Frieren!`
        : `${name} used Zoltraak.`
    );

    const damage = Number((calcEffect(0) + selfStats.HP / 9).toFixed(2));
    flatAttack(damage);
  },
});

export const a_trustInYourAllyFernsBarrage = new Card({
  title: "Trust in Your Ally: Fern's Barrage",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `DMG ${dmg}+HP/10 DMG. Next turn, deal ${dmg}+HP/10 DMG at turn end.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_fernsBarrage_image,
    cardGif: mediaLinks.sein_fernsBarrage_gif,
  },
  effects: [3],
  hpCost: 8,
  cardAction: ({
    sendToGameroom,
    name,
    selfStats,
    characterName,
    calcEffect,
    flatAttack,
    selfEffect,
  }) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on help from Fern!`
        : `${name} used a simple offensive spell barrage.`
    );
    const damage = Number((calcEffect(0) + selfStats.HP / 10).toFixed(2));

    flatAttack(damage);

    selfEffect({
      name: "Barrage",
      description: `Deal ${damage} at the end of the effect.`,
      turnDuration: 2,
      activateEndOfTurnActionThisTurn: false,
      endOfTurnAction: (game, charIdx, _msgCache) => {
        sendToGameroom(`The barrage continues!`);
        CommonCardAction.commonAttack(game, charIdx, {
          damage,
          isTimedEffectAttack: true,
        });
      },
    });
  },
});

const a_trustInYourAllyStarksLightningStrike = new Card({
  title: "Trust in Your Ally: Stark's Lightning Strike",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}+HP/8.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_starksLightningStrike_image,
  },
  effects: [10],
  hpCost: 10,
  cardAction: ({
    name,
    characterName,
    selfStats,
    sendToGameroom,
    calcEffect,
    flatAttack,
  }) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on help from Stark!`
        : `${name} used lightning strike.`
    );

    const damage = Number((calcEffect(0) + selfStats.HP / 8).toFixed(2));
    flatAttack(damage);
  },
});

export const mugOfBeer = new Card({
  title: "Mug of Beer",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, atk]) =>
    `HP+${hp}. ATK+${atk}. DEF-2 and SPD-2 for 3 turns.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_mugOfBeer_image,
    cardGif: mediaLinks.sein_mugOfBeer_gif,
  },
  effects: [7, 2],
  cardAction: ({
    name,
    sendToGameroom,
    selfStat,
    flatSelfStat,
    selfEffect,
  }) => {
    sendToGameroom(`${name} downed a mug of beer.`);
    selfStat(0, StatsEnum.HP);
    selfStat(1, StatsEnum.ATK);
    flatSelfStat(-2, StatsEnum.DEF);
    flatSelfStat(-2, StatsEnum.SPD);

    selfEffect({
      name: "Drunk",
      description: `DEF-2. SPD-2.`,
      turnDuration: 3,
      metadata: { removableBySorganeil: false },
      endOfTimedEffectAction: (_game, _charIdx, _msgCache) => {
        sendToGameroom(`${name}'s drowsiness faded.`);
        flatSelfStat(2, StatsEnum.DEF);
        flatSelfStat(2, StatsEnum.SPD);
      },
    });
  },
});

export const smokeBreak = new Card({
  title: "Smoke Break",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, spd]) => `ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_smokeBreak_image,
    cardGif: mediaLinks.sein_smokeBreak_gif,
  },
  effects: [3, 2, 2],
  hpCost: 5,
  cardAction: ({ name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} took a smoke break.`);
    selfStat(0, StatsEnum.ATK);
    selfStat(1, StatsEnum.DEF);
    selfStat(2, StatsEnum.SPD);
  },
});

export const awakening = new Card({
  title: "Awakening",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, spd]) => `ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_awakening_image,
    cardGif: mediaLinks.sein_awakening_gif,
  },
  effects: [2, 1, 2],
  cardAction: ({ name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} used Awakening!`);
    selfStat(0, StatsEnum.ATK);
    selfStat(1, StatsEnum.DEF);
    selfStat(2, StatsEnum.SPD);
  },
});

export const poisonCure = new Card({
  title: "Poison Cure",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) => `HP+${hp}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_poisonCure_image,
    cardGif: mediaLinks.sein_poisonCure_gif,
  },
  effects: [10],
  cardAction: ({ name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} applied a poison cure.`);
    selfStat(0, StatsEnum.HP);
  },
});

export const braceYourself = new Card({
  title: "Brace Yourself",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_braceYourself_image,
    cardGif: mediaLinks.sein_braceYourself_gif,
  },
  priority: 2,
  effects: [20],
  cardAction: ({
    name,
    sendToGameroom,
    selfStat,
    selfEffect,
    characterName,
    calcEffect,
    possessive,
    reflexive,
  }) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on ${possessive} allies to brace themselves!`
        : `${name} braced ${reflexive}.`
    );

    const def = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF);

    selfEffect({
      name: "Brace Yourself",
      description: `Increases TrueDEF by ${def} until the end of the turn.`,
      priority: -1,
      turnDuration: 1,
      metadata: { removableBySorganeil: false },
      endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
        selfStat(0, StatsEnum.TrueDEF, -1);
      },
    });
  },
});

export const a_threeSpearsOfTheGoddess = new Card({
  title: "Three Spears of the Goddess",
  description: ([dmg]) => `At the next 3 turn ends, deal ${dmg}+HP/11 DMG.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl: mediaLinks.sein_threeSpearsOfTheGoddess_image,
    cardGif: mediaLinks.sein_threeSpearsOfTheGoddess_gif,
  },
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [5],
  hpCost: 10,
  cardAction: ({ name, selfStats, sendToGameroom, calcEffect, selfEffect }) => {
    sendToGameroom(`${name} used Three Spears of the Goddess!`);

    const damage = Number((calcEffect(0) + selfStats.HP / 11).toFixed(2));

    selfEffect({
      name: "Three Spears of the Goddess",
      description: `Deal ${damage} at each turn's end.`,
      turnDuration: 3,
      endOfTurnAction: (game, characterIndex) => {
        sendToGameroom("The goddess' spears continue to rain!");
        CommonCardAction.commonAttack(game, characterIndex, {
          damage,
          isTimedEffectAttack: true,
        });
      },
    });
  },
});

const seinDeck = [
  { card: a_trustInYourAllyFrierensZoltraak, count: 2 },
  { card: a_trustInYourAllyStarksLightningStrike, count: 2 },
  { card: a_trustInYourAllyFernsBarrage, count: 2 },
  { card: mugOfBeer, count: 2 },
  { card: smokeBreak, count: 1 },
  { card: awakening, count: 2 },
  { card: poisonCure, count: 2 },
  { card: braceYourself, count: 2 },
  { card: a_threeSpearsOfTheGoddess, count: 1 },
];

export default seinDeck;

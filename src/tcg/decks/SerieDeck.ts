import Deck from "../deck";
import Card from "../card";
import {
  serie_offensiveMagic,
  serie_utilityMagic,
} from "./utilDecks/serieMagic";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import { fieldOfFlower } from "./FrierenDeck";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

export const a_livingGrimoireOffensive = new Card({
  title: "Living Grimoire: Offense Chapter",
  description: () => "Use a random offensive magic.",
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014785740800/Living_Grimoire_1.png?ex=67df98ad&is=67de472d&hm=4e4a0d4882573e7b51f3eacc7fcdd5e77d515168b05e319b221b368a9cfe2d67&",
  },
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} found an interesting magic.`,
      TCGThread.Gameroom,
    );

    const baseCard =
      serie_offensiveMagic[
        Math.floor(Math.random() * serie_offensiveMagic.length)
      ];
    const newCard = new Card({
      ...baseCard,
      empowerLevel: this.empowerLevel,
    });

    messageCache.push(
      `${character.name} used **${newCard.getTitle()}**.`,
      TCGThread.Gameroom,
    );
    newCard.cardAction(game, characterIndex, messageCache);
  },
});

export const a_livingGrimoireUtility = new Card({
  title: "Living Grimoire: Utility Chapter",
  description: () => "Use a random utility magic.",
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014785740800/Living_Grimoire_1.png?ex=67df98ad&is=67de472d&hm=4e4a0d4882573e7b51f3eacc7fcdd5e77d515168b05e319b221b368a9cfe2d67&",
  },
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} found an interesting magic.`,
      TCGThread.Gameroom,
    );

    const baseCard =
      serie_utilityMagic[Math.floor(Math.random() * serie_utilityMagic.length)];
    const newCard = new Card({
      ...baseCard,
      empowerLevel: this.empowerLevel,
    });

    messageCache.push(
      `${character.name} used **${newCard.getTitle()}**.`,
      TCGThread.Gameroom,
    );
    newCard.cardAction(game, characterIndex, messageCache);
  },
});

export const a_livingGrimoireOffensive1 = new Card({
  ...a_livingGrimoireOffensive,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873015121150022/Living_Grimoire1_1.png?ex=67df98ad&is=67de472d&hm=db27a11288f3168c98e39af2a3351c777dd280922231f3d422f7f397041b5bbd&",
  },
  empowerLevel: 1,
});

const a_livingGrimoireOffensive2 = new Card({
  ...a_livingGrimoireOffensive,
  empowerLevel: 2,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873015825924147/Living_Grimoire2_1.png?ex=67df98ae&is=67de472e&hm=e92e90b0be578e1e09fcfa9d0b9f07af1920f96ca6a66703b20e5360990ebf5c&",
  },
});

export const mock = new Card({
  title: "Mock",
  description: ([hp, def, spd]) =>
    `HP+${hp}. Opponent's DEF-${def}. Opponent's SPD-${spd}`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873015502966825/Mock_1.png?ex=67df98ae&is=67de472e&hm=b4bfad8c4a548745a18660e2fcb39e7927661f269b17f9f8c73b66fa780f3d04&",
  },
  effects: [3, 2, 1],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} mocked the opponent.`,
      TCGThread.Gameroom,
    );

    const opponent = game.getCharacter(1 - characterIndex);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP,
    );
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[1]),
      StatsEnum.DEF,
    );
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD,
    );
  },
});

export const basicDefensiveMagic = new Card({
  title: "Basic Defensive Magic",
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014416506932/Basic_Defense_Magic.png?ex=67df98ad&is=67de472d&hm=79bab34bdef07e7fa529c5ac67ed093e7bfa2b69914f644ac434e4a564c47396&",
  },
  effects: [30],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} casted a basic defensive magic!`,
      TCGThread.Gameroom,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Ordinary Defensive Magic",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      }),
    );
  },
});

export const unbreakableBarrier = new Card({
  title: "Unbreakable Barrier",
  description: ([atk, def, oppSpd]) =>
    `HP-10. ATK+${atk} for 5 turns. DEF+${def} for 5 turns. Opponent's SPD-${oppSpd} for 5 turns.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873016182177984/Unbreakable_Barrier.png?ex=67df98ae&is=67de472e&hm=ecaf6053851a3bb12e9d9b0ba65dc932f11a6e97c3efe3c4af20126fc8407ba3&",
  },
  effects: [5, 5, 5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} deployed an unbreakable barrier.`,
      TCGThread.Gameroom,
    );

    if (character.adjustStat(-10, StatsEnum.HP)) {
      const opponent = game.getCharacter(1 - characterIndex);
      const atkBuff = this.calculateEffectValue(this.effects[0]);
      const defBuff = this.calculateEffectValue(this.effects[1]);
      const spdDebuff = this.calculateEffectValue(this.effects[2]);

      character.adjustStat(atkBuff, StatsEnum.ATK);
      character.adjustStat(defBuff, StatsEnum.DEF);
      opponent.adjustStat(-1 * spdDebuff, StatsEnum.SPD);

      character.timedEffects.push(
        new TimedEffect({
          name: "Unbreakable Barrier",
          description: `ATK+${atkBuff}. DEF+${defBuff}, Opponent's SPD -${spdDebuff} for 5 turns.`,
          turnDuration: 5,
          priority: -1,
          endOfTimedEffectAction: (_game, _characterIndex) => {
            messageCache.push("The barrier dissipated.", TCGThread.Gameroom);
            character.adjustStat(-1 * atkBuff, StatsEnum.ATK);
            character.adjustStat(-1 * defBuff, StatsEnum.DEF);
            opponent.adjustStat(spdDebuff, StatsEnum.SPD);
          },
        }),
      );
    }
  },
});

export const ancientBarrierMagic = new Card({
  title: "Ancient Barrier Magic",
  description: ([atk, def, oppSpd]) =>
    `HP-20. ATK+${atk} for 7 turns. Opponent's DEF-${def} for 7 turns. Opponent's SPD -${oppSpd} for 7 turns.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014080966718/Ancient_Barrier_Magic_1.png?ex=67df98ad&is=67de472d&hm=c0b00575790207a93d00398d3351e5cd914f371b0c2118855f8f2dc259634420&",
  },
  effects: [7, 7, 7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} expanded an ancient barrier magic.`,
      TCGThread.Gameroom,
    );

    if (character.adjustStat(-20, StatsEnum.HP)) {
      const opponent = game.getCharacter(1 - characterIndex);
      const atkBuff = this.calculateEffectValue(this.effects[0]);
      const defDebuff = this.calculateEffectValue(this.effects[1]);
      const spdDebuff = this.calculateEffectValue(this.effects[2]);

      character.adjustStat(atkBuff, StatsEnum.ATK);
      opponent.adjustStat(-1 * defDebuff, StatsEnum.DEF);
      opponent.adjustStat(-1 * spdDebuff, StatsEnum.SPD);

      character.timedEffects.push(
        new TimedEffect({
          name: "Ancient Barrier Magic",
          description: `An ominous barrier envelopes the battlefield...`,
          turnDuration: 7,
          priority: -1,
          endOfTimedEffectAction: (_game, _characterIndex) => {
            messageCache.push("The barrier dissipated.", TCGThread.Gameroom);

            character.adjustStat(-1 * atkBuff, StatsEnum.ATK);
            opponent.adjustStat(defDebuff, StatsEnum.DEF);
            opponent.adjustStat(spdDebuff, StatsEnum.SPD);
          },
        }),
      );
    }
  },
});

export const serieDeck = [
  { card: a_livingGrimoireOffensive, count: 2 },
  { card: a_livingGrimoireOffensive1, count: 2 },
  { card: a_livingGrimoireOffensive2, count: 2 },
  { card: a_livingGrimoireUtility, count: 2 },
  { card: fieldOfFlower, count: 1 },
  { card: mock, count: 2 },
  { card: basicDefensiveMagic, count: 1 },
  { card: unbreakableBarrier, count: 2 },
  { card: ancientBarrierMagic, count: 1 },
];

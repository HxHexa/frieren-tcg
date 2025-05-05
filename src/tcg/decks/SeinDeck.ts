import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

export const a_trustInYourAllyFrierensZoltraak = new Card({
  title: "Trust in Your Ally: Frieren's Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `HP-5. DMG ${dmg} + HP/9`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035311357362268/Trust_in_your_Ally_Frierens_Zoltraak_1.png?ex=67e02fd4&is=67dede54&hm=6cb8d375f497cf7bca2637de8d70a900901116aa53f0b0aa3e977ddc27a5def8&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361022845664104740/GIF_0907854706.gif?ex=6807cacc&is=6806794c&hm=c4c3d7908005bbcd23defb42f4c9b756135c8a5c1726330d0a52495998ec2c53&",
  },
  effects: [5],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on help from Frieren!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(`${character.name} used Zoltraak.`, TCGThread.Gameroom);
    }

    const damage = Number(
      (
        this.calculateEffectValue(this.effects[0]) +
        character.stats.stats.HP / 9
      ).toFixed(2)
    );
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });
  },
});

export const a_trustInYourAllyFernsBarrage = new Card({
  title: "Trust in Your Ally: Fern's Barrage",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `HP-7. DMG ${dmg}+HP/10 DMG. Next turn, deal ${dmg}+HP/10 DMG at turn end.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035310996394024/Trust_in_your_Ally_Ferns_Barrage.png?ex=67e02fd4&is=67dede54&hm=57cae7a03eefb0dacaa8649910e48ab411d50ca94a9855b078098e751b92ae75&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361022927788834966/GIF_2294206836.gif?ex=6807cae0&is=68067960&hm=ca32887d358b3c43ad2d4c5618373b8cab1a11d0acdcc496a7203544936a9244&",
  },
  effects: [3],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on help from Fern!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} used a simple offensive spell barrage.`,
        TCGThread.Gameroom
      );
    }

    if (character.adjustStat(-7, StatsEnum.HP)) {
      const damage = Number(
        (
          this.calculateEffectValue(this.effects[0]) +
          character.stats.stats.HP / 10
        ).toFixed(2)
      );
      CommonCardAction.commonAttack(game, characterIndex, {
        damage,
        hpCost: 0,
      });
      character.timedEffects.push(
        new TimedEffect({
          name: "Barrage",
          description: `Deal ${damage} at the end of the effect.`,
          turnDuration: 2,
          activateEndOfTurnActionThisTurn: false,
          endOfTurnAction: (game, characterIndex, messageCache) => {
            messageCache.push("The barrage continues!", TCGThread.Gameroom);
            CommonCardAction.commonAttack(game, characterIndex, {
              damage,
              hpCost: 0,
              isTimedEffectAttack: true,
            });
          },
        })
      );
    }
  },
});

const a_trustInYourAllyStarksLightningStrike = new Card({
  title: "Trust in Your Ally: Stark's Lightning Strike",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `Priority-1. HP-9. DMG ${dmg}+HP/7.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035310677622845/Trust_in_your_Ally_Starks_Lightning_Strike.png?ex=67e02fd4&is=67dede54&hm=608a0bc2795f44b1512ecb7d26b29213aedada2f9f9db64b178447be0dd98476&",
  },
  effects: [7],
  priority: -1,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on help from Stark!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} used lightning strike.`,
        TCGThread.Gameroom
      );
    }

    const damage = Number(
      (
        this.calculateEffectValue(this.effects[0]) +
        character.stats.stats.HP / 7
      ).toFixed(2)
    );
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 9 });
  },
});

export const mugOfBeer = new Card({
  title: "Mug of Beer",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, atk]) => `HP+${hp}. ATK+${atk}. DEF-2. SPD-1.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353038477805228073/Mug_of_Beer_2.png?ex=67e032c7&is=67dee147&hm=9e453e019c32d60027135834549e42bd19f16995569570a3012b9626a5fdf6f4&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361017071886012681/GIF_3575013087.gif?ex=6807c56c&is=680673ec&hm=1e20739be8a75140974b9babb65729cf83c31d4f3d991bc35c90207fda41cd34&",
  },
  effects: [6, 2],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} downed a mug of beer.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK
    );
    character.adjustStat(-2, StatsEnum.DEF);
    character.adjustStat(-1, StatsEnum.SPD);
  },
});

export const smokeBreak = new Card({
  title: "Smoke Break",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, spd]) => `HP-5. ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035309906133052/Smoke_Break.png?ex=67e02fd4&is=67dede54&hm=a6eaadebd1ce83f74e2819c16eb7cb57e8fb0f9888f8083248ac49b54119ccf4&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361017954392866997/3.2.1.sein.gif?ex=6807c63e&is=680674be&hm=110488d337d86b35ac2b84cfec08e01c070a3ecb4563ccdfb3c1df602c5249f9&",
  },
  effects: [3, 2, 2],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} took a smoke break.`,
      TCGThread.Gameroom
    );
    if (character.adjustStat(-5, StatsEnum.HP)) {
      character.adjustStat(
        this.calculateEffectValue(this.effects[0]),
        StatsEnum.ATK
      );
      character.adjustStat(
        this.calculateEffectValue(this.effects[1]),
        StatsEnum.DEF
      );
      character.adjustStat(
        this.calculateEffectValue(this.effects[2]),
        StatsEnum.SPD
      );
    }
  },
});

export const awakening = new Card({
  title: "Awakening",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, spd]) => `ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035309436375121/Awakening.png?ex=67e02fd3&is=67dede53&hm=48c7275f912f8927990fa0073b3f8a6c2e7279042e5bd8edfe1a925261a0e5b5&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361016482263208137/GIF_1188387197.gif?ex=6807c4df&is=6806735f&hm=f5ed7c521144db3412cf1a52b1417497950c1adf96d45301ff7421b5a75d8ca7&",
  },
  effects: [2, 1, 2],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(`${character.name} used Awakening!`, TCGThread.Gameroom);

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.DEF
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD
    );
  },
});

export const poisonCure = new Card({
  title: "Poison Cure",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) => `HP+${hp}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://media.discordapp.net/attachments/1351391350398128159/1353035308844974100/Poison_Cure.png?ex=67e02fd3&is=67dede53&hm=76216578c19115f3ddcd9bff1c497b0c7c2f9ee87152f02c4085d681dd0dc6ae&=&format=webp&quality=lossless&width=908&height=1160",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361016416488390776/GIF_0966802288.gif?ex=6807c4d0&is=68067350&hm=2d09267ccc0505a949b0c57e6c9bb84fc99decb89d35637cadced435723f5904&",
  },
  effects: [10],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} applied a poison cure.`,
      TCGThread.Gameroom
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );
  },
});

export const braceYourself = new Card({
  title: "Brace Yourself",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035308182147102/Brace_Yourself.png?ex=67e02fd3&is=67dede53&hm=b4bcacc46cae5fcd120b76d666ef606186621d3edc230a851e09a77976fce8eb&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364568772136140810/GIF_1787578930.gif?ex=680a2533&is=6808d3b3&hm=1cfb307428d03155177b0ce8439cc92792a63fc2588d8483cf618682105449a3&",
  },
  priority: 2,
  effects: [20],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on ${character.cosmetic.pronouns.possessive} allies to brace themselves!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        `${character.name} braced ${character.cosmetic.pronouns.reflexive}.`,
        TCGThread.Gameroom
      );
    }

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Brace Yourself",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_threeSpearsOfTheGoddess = new Card({
  title: "Three Spears of the Goddess",
  description: ([dmg]) =>
    `HP-15. At the next 3 turn ends, deal ${dmg}+HP/10 DMG.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035307397681172/Three_Spears_of_the_Godess.png?ex=67e02fd3&is=67dede53&hm=671b75347795840779fe6e5007f8a0918b04e3b6a558b561ca9ce4b4c18694a8&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1360972240732291242/GIF_0993654948.gif?ex=6808446b&is=6806f2eb&hm=90213c37d073b6d0b0354a3893d14b16c727fa9b04c457693110512a142c0338&",
  },
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [7],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} used Three Spears of the Goddess!`,
      TCGThread.Gameroom
    );
    if (character.adjustStat(-15, StatsEnum.HP)) {
      const damage = Number(
        (
          this.calculateEffectValue(this.effects[0]) +
          character.stats.stats.HP / 10
        ).toFixed(2)
      );
      character.timedEffects.push(
        new TimedEffect({
          name: "Three Spears of the Goddess",
          description: `Deal ${damage} at each turn's end.`,
          turnDuration: 3,
          endOfTurnAction: (game, characterIndex) => {
            messageCache.push(
              "The goddess' spears continue to rain!",
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
    }
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
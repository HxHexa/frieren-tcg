import Card from "../card";
import TimedEffect from "../timedEffect";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

export const a_zoltraak = new Card({
  title: "Offensive Magic Analysis: Zoltraak",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) =>
    `HP-5. DMG ${dmg}. 2 Analysis stacks will be gained after attack.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588256267501888/Offensive_Magic_Analysis_Zoltraak.png?ex=67e97971&is=67e827f1&hm=193fb4668269bd8509f7b4ce4a092c12af7b44ac8fd5264dfac08c5da5a349bf&",
  },
  tags: { PostAnalysis: 2 },
  effects: [7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} fired Zoltraak!`, TCGThread.Gameroom);

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });
  },
});

export const fieldOfFlower = new Card({
  title: "Spell to make a Field of Flowers",
  cardMetadata: { nature: "Util" },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 3 turn ends, heal ${endHp}.`,
  cosmetic: {
    cardGif: "https://c.tenor.com/Sd_BDB5kVZ8AAAAd/tenor.gif",
    cardImageUrl:
      // "https://cdn.discordapp.com/attachments/1351391350398128159/1352873016660590653/Spell_to_make_a_field_of_flowers_4.png?ex=67df98ae&is=67de472e&hm=e5080e39c9818eee5f9a3d559a829b6f3ecab15be85b9897fb6c28ea27c6e674&",
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255269130370/Spell_to_make_a_field_of_flowers_New.png?ex=67e97971&is=67e827f1&hm=b03c906280c5f4f09d212bae40f29b671377145e137dbfe5f4d5da93be130dd7&",
  },
  emoji: CardEmoji.FLOWER_FIELD,
  effects: [5, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} conjured a field of flowers!`,
      TCGThread.Gameroom
    );

    const initialHealing = this.calculateEffectValue(this.effects[0]);
    const endOfTurnHealing = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(initialHealing, StatsEnum.HP);
    character.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP`,
        turnDuration: 3,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `The Field of Flowers soothes ${character.name}.`,
            TCGThread.Gameroom
          );
          game.characters[characterIndex].adjustStat(
            endOfTurnHealing,
            StatsEnum.HP
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push("The Field of Flowers fades.", TCGThread.Gameroom);
        },
      })
    );
  },
});

export const a_judradjim = new Card({
  title: "Destructive Lightning Analysis: Judradjim",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) =>
    `HP-7. DMG ${dmg}. 1 Analysis stack will be gained after attack.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588256728748365/Destructive_Lightning_Analysis_Judradjim.png?ex=67e97972&is=67e827f2&hm=15cd0d0ef4df4a3d1559b405c3e8843ecbda4b64b349e2149fb9d22db3c5e817&",
  },
  tags: { PostAnalysis: 1 },
  effects: [12],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} sent forth Judradjim!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 7 });
  },
});

export const a_vollzanbel = new Card({
  title: "Hellfire Summoning: Vollzanbel",
  cardMetadata: { nature: "Attack" },
  description: ([dmg]) => `HP-10. DMG ${dmg}`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255923572736/Hellfire_Summoning_Vollzanbel.png?ex=67e97971&is=67e827f1&hm=c31d35c7ce7820b3d386f7f3119f463538d83576ad2a4f0ed2a83370390ce87c&",
  },
  effects: [18],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} summoned Vollzanbel!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 10 });
  },
});

export const barrierMagicAnalysis = new Card({
  title: "Barrier Magic Analysis",
  cardMetadata: { nature: "Util" },
  description: ([atk, spd, def]) =>
    `ATK+${atk}. SPD+${spd}. Opponent's DEF-${def}`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254463951029/Barrier_Magic_Analysis.png?ex=67e97971&is=67e827f1&hm=d65bb623550e93604fbedbc80cb6638c52b8ead8f1a70114e410a52df1260605&",
  },
  effects: [2, 1, 1],
  tags: { Analysis: 2 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} analyzed the opponent's defense!`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD
    );
    game.characters[1 - characterIndex].adjustStat(
      -1 * this.calculateEffectValue(this.effects[2]),
      StatsEnum.DEF
    );
  },
});

export const demonMagicAnalysis = new Card({
  title: "Demon Magic Analysis",
  cardMetadata: { nature: "Util" },
  description: ([atk, spd, def]) => `ATK+${atk}. SPD+${spd}. DEF+${def}.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254107439245/Demon_Magic_Analysis.png?ex=67e97971&is=67e827f1&hm=8318bc5d0892f966e0bc07d29fd6042ab37cc93cdc86a3d58feb438631b3b354&",
  },
  effects: [2, 2, 1],
  tags: { Analysis: 2 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} analyzed ancient demon's magic!`,
      TCGThread.Gameroom
    );

    game.characters[characterIndex].adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK
    );
    game.characters[characterIndex].adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD
    );
    game.characters[characterIndex].adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.DEF
    );
  },
});

export const ordinaryDefensiveMagic = new Card({
  title: "Ordinary Defensive Magic",
  cardMetadata: { nature: "Defense" },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255554470018/Ordinary_Defensive_Magic.png?ex=67e97971&is=67e827f1&hm=6e44ae1f09dc7b05f29ddb6a646f9852692ff2427e333e1c0c4562c296918ce9&",
  },
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} cast ordinary defensive magic!`,
      TCGThread.Gameroom
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
      })
    );
  },
});

export const a_theHeightOfMagic = new Card({
  title: `"The Height of Magic"`,
  description: ([dmg]) =>
    `Priority+1. Will fail if used while HP > 25. Strike for DMG ${dmg}. Afterward, decreases DEF and SPD by 20, and set HP to 1.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254866473161/The_Height_of_Magic.png?ex=67e97971&is=67e827f1&hm=0bddcf6c49f763947308ba3e63c58a8727730a9af0ff9c0175e948af704e29b3&",
  },
  cardMetadata: { nature: "Attack", signature: true },
  priority: 1,
  effects: [30],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} used "The Height of Magic"`,
      TCGThread.Gameroom
    );

    if (character.stats.stats.HP > 25) {
      messageCache.push(
        `${character.name}'s HP is greater than 25. The move failed!`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        "The Height of Magic is on display.",
        TCGThread.Gameroom
      );
      const damage = this.calculateEffectValue(this.effects[0]);
      CommonCardAction.commonAttack(game, characterIndex, {
        damage,
        hpCost: 0,
      });
      character.adjustStat(-20, StatsEnum.DEF);
      character.adjustStat(-20, StatsEnum.SPD);
      character.setStat(1, StatsEnum.HP);
    }
  },
});

export const frierenDeck = [
  { card: a_zoltraak, count: 2 },
  { card: a_judradjim, count: 2 },
  { card: a_vollzanbel, count: 2 },
  { card: barrierMagicAnalysis, count: 3 },
  { card: demonMagicAnalysis, count: 2 },
  { card: ordinaryDefensiveMagic, count: 1 },
  { card: fieldOfFlower, count: 2 },
  { card: a_theHeightOfMagic, count: 1 },
];

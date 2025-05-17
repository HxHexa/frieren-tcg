import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { manaDetection } from "./LinieDeck";

export const a_fernZoltraak = new Card({
  title: "Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}. Gain 1 Barrage count.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [7],
  hpCost: 4,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364355690780557404/GIF_4110295150.gif?ex=680a0781&is=6808b601&hm=4aa279af5d5b3ae167099775570328a51c55d8572aac6369a9748565b950f8a1&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} fired Zoltraak!`, TCGThread.Gameroom);

    const damage = this.calculateEffectValue(this.effects[0]);
    character.additionalMetadata.fernBarrage =
      (character.additionalMetadata.fernBarrage ?? 0) + 1;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: this.hpCost,
    });
  },
});

export const a_fernBarrage = new Card({
  title: "Barrage",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `DMG ${dmg} with 25% Pierce. Gain 1 Barrage count. At the end of each turn, -1 Barrage count, HP-4, deal ${dmg} DMG with 25% Pierce, until Barrage count reaches 0.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [5],
  hpCost: 4,
  cosmetic: {
    cardGif: "https://c.tenor.com/2RAJbNpiLI4AAAAd/tenor.gif",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} initiated her barrage!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    const newBarrageCount = (character.additionalMetadata.fernBarrage ?? 0) + 1;
    character.additionalMetadata.fernBarrage = newBarrageCount;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: this.hpCost,
      additionalPierceFactor: 0.25,
    });

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "barrage",
      new TimedEffect({
        name: "Barrage",
        description: `Deal ${damage} DMG.`,
        turnDuration: newBarrageCount,
        metadata: { barrage: 1 },
        endOfTurnAction: function (
          this: TimedEffect,
          game,
          characterIndex,
          _messageCache
        ) {
          const character = game.getCharacter(characterIndex);
          character.additionalMetadata.fernBarrage ??= 0;

          if (character.additionalMetadata.fernBarrage > 0) {
            messageCache.push(
              `${character.name} puts on the pressure!`,
              TCGThread.Gameroom
            );
            character.additionalMetadata.fernBarrage = Math.max(
              0,
              (character.additionalMetadata.fernBarrage ?? 0) - 1
            );
            messageCache.push(
              `${character.name} lost 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
              TCGThread.Gameroom
            );
            CommonCardAction.commonAttack(game, characterIndex, {
              damage,
              hpCost: 4,
              additionalPierceFactor: 0.25,
            });
          } else {
            messageCache.push(
              `${character.name} lets up ${character.cosmetic.pronouns.possessive} barrage.`,
              TCGThread.Gameroom
            );
          }

          this.turnDuration = character.additionalMetadata.fernBarrage;
        },
      })
    );
  },
});

const a_fernConcentratedZoltraakSnipe = new Card({
  title: "Concentrated Zoltraak Snipe",
  cardMetadata: { nature: Nature.Attack },
  description: ([baseDmg, dmg]) =>
    `Deal ${baseDmg} + ${dmg} DMG x Barrage count, with 50% Pierce. Reset Barrage count to 0.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [6, 2],
  hpCost: 12,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364357151111385098/GIF_1619936813.gif?ex=6809601d&is=68080e9d&hm=d315925c27f678c96ed238bcc826abd1c209e5e1dae651b445b7fa4760e0cf09&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} sniped at the opponent!`,
      TCGThread.Gameroom
    );

    const baseDamage = this.calculateEffectValue(this.effects[0]);
    const singleBarrageDamage = this.calculateEffectValue(this.effects[1]);
    CommonCardAction.commonAttack(game, characterIndex, {
      damage:
        baseDamage +
        singleBarrageDamage * (character.additionalMetadata.fernBarrage ??= 0),
      hpCost: this.hpCost,
      additionalPierceFactor: 0.5,
    });

    character.additionalMetadata.fernBarrage = 0;
    messageCache.push(
      `${character.name}'s barrage count is set to 0.`,
      TCGThread.Gameroom
    );
  },
});

const disapprovingPout = new Card({
  title: "Disapproving Pout",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, oppAtkDecrease]) =>
    `HP+${hp}. Opp's ATK-${oppAtkDecrease}.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [3, 2],
  cosmetic: {
    cardGif: "https://c.tenor.com/V1ad9v260E8AAAAd/tenor.gif",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} looks down on the opponent.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK
    );
  },
});

export const manaConcealment = new Card({
  title: "Mana Concealment",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def]) =>
    `ATK+${atk}. DEF+${def}. Receive Priority+1 and additional 50% Pierce on attacks for next turn.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [1, 2],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} conceals ${character.cosmetic.pronouns.possessive} presence.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.DEF
    );

    character.ability.abilitySelectedMoveModifierEffect = function (
      _game,
      _characterIndex,
      _messageCache,
      selectedCard
    ) {
      if (selectedCard.cardMetadata.nature === Nature.Attack) {
        selectedCard.priority = 1;
      }
    };
    character.additionalMetadata.pierceFactor = 0.5;

    character.timedEffects.push(
      new TimedEffect({
        name: "Mana Concealment",
        description: `Attacking moves receive Priority+1 and 50% Pierce.`,
        turnDuration: 2,
        priority: -1,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} unveiled ${character.cosmetic.pronouns.possessive} presence.`,
            TCGThread.Gameroom
          );
          character.ability.abilitySelectedMoveModifierEffect = undefined;
          character.additionalMetadata.pierceFactor = 0;
        },
      })
    );
  },
});

export const spellToCreateManaButterflies = new Card({
  title: "Spell to Create Mana Butterflies",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 4 turn ends, heal ${endHp} and gain 0.5 Barrage count.`,
  cosmetic: {
    cardGif: "https://c.tenor.com/B93aR7oWJ4IAAAAC/tenor.gif",
  },
  emoji: CardEmoji.FERN_CARD,
  effects: [6, 2],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} conjured a field of mana butterflies.`,
      TCGThread.Gameroom
    );

    const initialHealing = this.calculateEffectValue(this.effects[0]);
    const endOfTurnHealing = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(initialHealing, StatsEnum.HP);

    character.timedEffects.push(
      new TimedEffect({
        name: "Field of Butterflies",
        description: `Heal ${endOfTurnHealing} HP`,
        turnDuration: 4,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `The Mana Butterflies soothe ${character.name}.`,
            TCGThread.Gameroom
          );
          game.characters[characterIndex].adjustStat(
            endOfTurnHealing,
            StatsEnum.HP
          );

          character.additionalMetadata.fernBarrage =
            (character.additionalMetadata.fernBarrage ?? 0) + 0.5;
          messageCache.push(
            `${character.name} gained 0.5 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
            TCGThread.Gameroom
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push("The Mana Butterflies fade.", TCGThread.Gameroom);
        },
      })
    );
  },
});

export const commonDefensiveMagic = new Card({
  title: "Common Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases DEF by ${def} until the end of the turn. Reduce 1 Barrage count.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [20],
  priority: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364255159529767005/GIF_2894655091.gif?ex=68090120&is=6807afa0&hm=e81b702e207fea882babeffd4b376e8db66a1afac7b19191892b3e6e29a9772c&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} put up a common defensive spell.`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.additionalMetadata.fernBarrage = Math.max(
      0,
      (character.additionalMetadata.fernBarrage ?? 0) - 1
    );
    messageCache.push(
      `${character.name} lost 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Common Defensive Magic",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

const fernDeck = [
  { card: a_fernZoltraak, count: 3 },
  { card: a_fernBarrage, count: 2 },
  { card: a_fernConcentratedZoltraakSnipe, count: 2 },
  { card: disapprovingPout, count: 2 },
  { card: manaConcealment, count: 2 },
  { card: manaDetection, count: 1 },
  { card: commonDefensiveMagic, count: 2 },
  { card: spellToCreateManaButterflies, count: 2 },
];

export default fernDeck;

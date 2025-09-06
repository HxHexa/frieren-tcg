import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { manaDetection } from "./LinieDeck";
import { CharacterName } from "../characters/metadata/CharacterName";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

export const a_fernZoltraak = new Card({
  title: "Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}. Gain 1 Barrage count.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [7],
  hpCost: 4,
  cosmetic: {
    cardGif: mediaLinks.fern_zoltraak_gif,
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
    });
  },
});

export const a_fernBarrage = new Card({
  title: "Barrage",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `DMG ${dmg} with 25% Pierce. Gain 1 Barrage count. At the end of each turn, -1 Barrage count, HP-4, deal ${dmg} DMG with 25% Pierce, until Barrage count reaches 0. Using this card while Barrage is already active will replace the active Barrage with this card's effect.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [5],
  hpCost: 4,
  cosmetic: {
    cardGif: mediaLinks.fern_barrage_gif,
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
            character.adjustStat(-4, StatsEnum.HP, game);
            CommonCardAction.commonAttack(game, characterIndex, {
              damage,
              isTimedEffectAttack: true,
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
  effects: [7, 3],
  hpCost: 8,
  cosmetic: {
    cardGif: mediaLinks.fern_concentratedZoltraakSnipe_gif,
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
  description: ([hp, atk, oppAtkDecrease]) =>
    `HP+${hp}. ATK+${atk}. Opp's ATK-${oppAtkDecrease}.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [3, 1, 2],
  cosmetic: {
    cardGif: mediaLinks.fern_disapproving_pout_gif,
  },
  cardAction: function (
    this: Card,
    {
      name,
      sendToGameroom,
      selfStat,
      opponentStat,
      flatOpponentStat,
      opponentName,
      opponentCharacterName,
    }
  ) {
    sendToGameroom(`${name} looks down on the opponent.`);
    selfStat(0, StatsEnum.HP);
    selfStat(1, StatsEnum.ATK);
    opponentStat(2, StatsEnum.ATK, -1);
    if (opponentCharacterName === CharacterName.Stark) {
      sendToGameroom(`${opponentName} felt hurt...`);
      flatOpponentStat(0.01, StatsEnum.HP, -1);
    }
  },
});

export const manaConcealment = new Card({
  title: "Mana Concealment",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, spd]) =>
    `ATK+${atk}. DEF+${def}. SPD+${spd}. Next turn, receive Priority+1 and additional 50% Pierce on attacks.`,
  emoji: CardEmoji.FERN_CARD,
  cosmetic: {
    cardGif: mediaLinks.fern_manaConcealment_gif,
  },
  effects: [1, 2, 2],
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
      StatsEnum.ATK,
      game
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.DEF,
      game
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD,
      game
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

      return selectedCard;
    };

    character.additionalMetadata.pierceFactor = 0.5;
    character.timedEffects.push(
      new TimedEffect({
        name: "Mana Concealment",
        description: `Attacking moves receive Priority+1 and 50% Pierce.`,
        turnDuration: 2,
        priority: -1,
        metadata: { manaConcealment: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: (game, characterIndex, messageCache) => {
          const character = game.getCharacter(characterIndex);
          if (
            character.timedEffects.filter(
              (effect) => effect.metadata.manaConcealment
            ).length < 2
          ) {
            // only execute if character has no parallel mana concealment timed effect
            messageCache.push(
              `${character.name} unveiled ${character.cosmetic.pronouns.possessive} presence.`,
              TCGThread.Gameroom
            );
            character.ability.abilitySelectedMoveModifierEffect = undefined;
            character.additionalMetadata.pierceFactor = 0;
          }
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
    cardGif: mediaLinks.fern_spellToCreateManaButterflies_gif,
  },
  emoji: CardEmoji.FERN_CARD,
  effects: [6, 2],
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, selfStat, calcEffect, flatSelfStat }
  ) {
    sendToGameroom(`${name} conjured a field of mana butterflies.`);
    selfStat(0, StatsEnum.HP);

    const endOfTurnHealing = calcEffect(1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Field of Butterflies",
        description: `Heal ${endOfTurnHealing} HP. Gain 1 Barrage count.`,
        turnDuration: 4,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(`The Mana Butterflies soothe ${name}.`);
          flatSelfStat(endOfTurnHealing, StatsEnum.HP);

          self.additionalMetadata.fernBarrage =
            (self.additionalMetadata.fernBarrage ?? 0) + 0.5;
          sendToGameroom(
            `${name} gained 0.5 Barrage count. Current Barrage count: **${self.additionalMetadata.fernBarrage}**.`
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom("The Mana Butterflies fade.");
        },
      })
    );
  },
});

export const commonDefensiveMagic = new Card({
  title: "Common Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [20],
  priority: 2,
  cosmetic: {
    cardGif: mediaLinks.fern_commonDefensiveMagic_gif,
  },
  cardAction: function (
    this: Card,
    { game, name, self, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} put up a common defensive spell.`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Common Defensive Magic",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
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

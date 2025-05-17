import { CharacterData } from "../characterData";
import { UbelHit } from "@tcg/additionalMetadata/characterAdditionalMetadata";
import ubelDeck, { empathyFailureName } from "@decks/UbelDeck";
import Stats, { StatsEnum } from "@tcg/stats";
import Game from "@tcg/game";
import Card, { Nature } from "@tcg/card";
import Rolls from "@tcg/util/rolls";
import Character from "@tcg/character";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import { GameMessageContext } from "@tcg/gameContextProvider";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const PIERCE_FACTOR = 1.0;

const ubelStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 8.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

function checkForEffects(effects: string[]): Record<string, boolean> {
  const effectsListToCheckFor = ["Sorganeil", "Rushdown", "Recompose"];
  const presence = effectsListToCheckFor.map((effect) =>
    effects.includes(effect)
  );
  const result: Record<string, boolean> = {
    Sorganeil: presence[0],
    Rushdown: presence[1],
    Recompose: presence[2],
  };
  return result;
}

function missAttack(
  context: GameMessageContext,
  card: Card,
  failureRate: number
) {
  const { game, selfIndex: characterIndex, messageCache } = context;
  // Non Ubel slashing sureHits get treated normally
  if (failureRate === 0) {
    card.cardAction(context);
  } else {
    const character = game.getCharacter(characterIndex);

    const hpCost = card.hpCost;
    character.adjustStat(-hpCost, StatsEnum.HP);
    messageCache.push("The attack cannot connect!", TCGThread.Gameroom);
    messageCache.push("Yet Übel keeps rushing forward!", TCGThread.Gameroom);

    const atkSpdBuff = card.calculateEffectValue(card.effects[1]);
    character.adjustStat(atkSpdBuff, StatsEnum.ATK);
    character.adjustStat(atkSpdBuff, StatsEnum.SPD);
  }
}

function attackWhileRecomposing(
  character: Character,
  messageCache: MessageCache
) {
  messageCache.push(
    `${character.name} is recomposing herself and can't attack`,
    TCGThread.Gameroom
  );
}

function playOffensiveCard(
  context: GameMessageContext,
  card: Card,
  failureRate: number
): void {
  // check for always hitting empathy attacks
  const { messageCache } = context;
  if (failureRate === 0) {
    card.cardAction?.(context);
    return;
  }

  const luckRoll = Rolls.rollD100();
  messageCache.push(
    `## **Missing chances:** ${failureRate}%`,
    TCGThread.Gameroom
  );
  messageCache.push(`# Luck roll: ${luckRoll}`, TCGThread.Gameroom);
  if (luckRoll < failureRate) {
    missAttack(context, card, failureRate);
  } else {
    messageCache.push("The attack connects!", TCGThread.Gameroom);
    card.cardAction?.(context);
  }
}

function wrapEmpathizedCard(
  character: Character,
  card: Card,
  messageCache: MessageCache
): void {
  messageCache.push(
    `${character.name} tries to empathize with ${character.cosmetic.pronouns.possessive} opponent...`,
    TCGThread.Gameroom
  );

  //empathy before the minimum turn number
  if (card.title == empathyFailureName) {
    return;
  }

  messageCache.push(
    `${character.name} acquired a new magic!`,
    TCGThread.Gameroom
  );
}

const Ubel = new CharacterData({
  name: CharacterName.Ubel,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.UBEL,
    color: 0x3c5502,
    imageUrl: mediaLinks.ubelPortrait,
  },
  stats: ubelStats,
  cards: ubelDeck,
  ability: {
    abilityName: "Reckless",
    abilityEffectString: `Übel's slashing attacks ignore ${PIERCE_FACTOR * 100}% the opponent's defense stats, but are blocked by defensive moves.`,

    // same turn surehit effect changes
    abilityAfterOpponentsMoveEffect: function (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache,
      card: Card
    ) {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);
      const effects = character.timedEffects.map((effect) => effect.name);
      const activeEffects = checkForEffects(effects);

      switch (card.cardMetadata.nature) {
        case "Attack":
          if (!activeEffects.Recompose) {
            character.additionalMetadata.ubelSureHit = UbelHit.SureHit;
            messageCache.push(
              `${opponent.name} is wide-open!`,
              TCGThread.Gameroom
            );
          }
          break;
        case "Defense":
          character.additionalMetadata.ubelSureHit = UbelHit.SureMiss;
          messageCache.push(
            `${character.name} can't cut through this!`,
            TCGThread.Gameroom
          );
          break;
        default:
          if (
            !activeEffects.Recompose &&
            !activeEffects.Rushdown &&
            !activeEffects.Sorganeil
          ) {
            character.additionalMetadata.ubelSureHit = UbelHit.Regular;
          }
      }
    },

    // new turn surehit effect changes
    abilityStartOfTurnEffect: function (game, characterIndex, _messageCache) {
      const character = game.getCharacter(characterIndex);
      const effects = character.timedEffects.map((effect) => effect.name);
      const activeEffects = checkForEffects(effects);

      if (activeEffects.Sorganeil || activeEffects.Rushdown) {
        character.additionalMetadata.ubelSureHit = UbelHit.SureHit;
      } else if (activeEffects.Recompose) {
        character.additionalMetadata.ubelSureHit = UbelHit.SureMiss;
      } else {
        if (game.additionalMetadata.lastUsedCards[1 - characterIndex]) {
          if (
            game.additionalMetadata.lastUsedCards[1 - characterIndex]
              .cardMetadata.nature != "Attack"
          ) {
            character.additionalMetadata.ubelSureHit = UbelHit.Regular;
          } else {
            character.additionalMetadata.ubelSureHit = UbelHit.SureHit;
          }
        }
      }
    },

    // attacks should potentially fail
    abilityOwnCardEffectWrapper: function (
      context: GameMessageContext,
      card: Card
    ) {
      const { self: character, messageCache } = context;
      const effects = character.timedEffects;
      const effectsNames = effects.map((eff) => eff.name);
      const activeEffects = checkForEffects(effectsNames);

      //routine for empathized cards, all cases are treated within the function itself
      if (card.empathized) {
        wrapEmpathizedCard(character, card, messageCache);
      }

      //utils and default cards don't care about hitting status
      if (card.cardMetadata.nature != Nature.Attack) {
        card.cardAction?.(context);
        return;
      }

      //attacks
      const failureRate = card.cardMetadata.ubelFailureRate ?? 0;
      switch (character.additionalMetadata.ubelSureHit) {
        case UbelHit.Regular:
          playOffensiveCard(context, card, failureRate);
          break;
        case UbelHit.SureHit:
          card.cardAction?.(context);
          break;
        case UbelHit.SureMiss:
          // defensive move
          if (!activeEffects.Recompose) {
            missAttack(context, card, failureRate);
            return;
          }
          // Recomposing
          if (activeEffects.Sorganeil) {
            card.cardAction?.(context);
          } else {
            attackWhileRecomposing(character, messageCache);
          }
          break;
      }
    },
  },
  additionalMetadata: {
    ubelSureHit: UbelHit.Regular,
    ubelSlashMovesPierceFactor: PIERCE_FACTOR,
  },
});

export default Ubel;

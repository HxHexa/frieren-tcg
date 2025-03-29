import Stats, { StatsEnum } from "./stats";
import Deck from "./deck";
import Card from "./card";
import TimedEffect from "./timedEffect";
import { Ability } from "./ability";
import { statDetails } from "./formatting/emojis";
import Rolls from "./util/rolls";
import { CharacterAdditionalMetadata } from "./additionalMetadata/characterAdditionalMetadata";
import DefaultCards from "./decks/utilDecks/defaultCard";
import {
  CharacterCosmetic,
  CharacterData,
} from "./characters/characterData/characterData";
import { MessageCache } from "../tcgChatInteractions/messageCache";
import { TCGThread } from "../tcgChatInteractions/sendGameMessage";
import { User } from "discord.js";

export interface CharacterProps {
  characterData: CharacterData;
  messageCache: MessageCache;
  characterUser: User;
  characterThread: TCGThread;
}

export default class Character {
  name: String;
  cosmetic: CharacterCosmetic;

  stats: Stats;
  cards: { card: Card; count: number }[];
  ability: Ability;
  additionalMetadata: CharacterAdditionalMetadata;

  initialStats: Stats;
  deck: Deck;
  hand: Card[];
  timedEffects: TimedEffect[];
  skipTurn: boolean;

  messageCache: MessageCache;
  characterUser: User;
  characterThread: TCGThread;

  constructor(characterProps: CharacterProps) {
    this.name = characterProps.characterData.name;
    this.cosmetic = characterProps.characterData.cosmetic;
    this.stats = characterProps.characterData.stats;
    this.cards = characterProps.characterData.cards;
    this.ability = characterProps.characterData.ability;
    this.additionalMetadata = characterProps.characterData.additionalMetadata;

    this.initialStats = characterProps.characterData.stats.clone();
    this.deck = new Deck(characterProps.characterData.cards);
    this.hand = [];
    this.timedEffects = [];
    this.skipTurn = false;

    this.messageCache = characterProps.messageCache;
    this.characterUser = characterProps.characterUser;
    this.characterThread = characterProps.characterThread;

    this.stats.stats.HP = characterProps.characterData.stats.startingHp;
  }

  drawStartingHand() {
    for (let i = 0; i < 6; i++) {
      this.drawCard();
    }
  }

  drawCard(): Card {
    const drawnCard = this.deck.drawCard();
    this.hand.push(drawnCard);
    return drawnCard;
  }

  discardCard(handIndex: number): Card {
    if (handIndex < this.hand.length) {
      const discardedCard = this.hand.splice(handIndex, 1)[0];
      this.deck.discardCard(discardedCard);
      this.messageCache.push(
        `Discarded ${discardedCard.title} + ${discardedCard.empowerLevel}`,
        this.characterThread,
      );
      return discardedCard;
    } else {
      throw new Error("index given greater than hand's length.");
    }
  }

  // discard a card and empower all other cards in hand
  playCard(handIndex: number): Card {
    const discardedCard = this.discardCard(handIndex);

    const card = this.hand[handIndex];

    // empower remaining cards
    this.empowerHand();

    // draw a new card
    this.drawCard();
    return discardedCard;
  }

  getUsableCardsForRound(channel: TCGThread): Record<string, Card> {
    const indexToUsableCardMap: Record<string, Card> = {};
    // roll 4d6
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(Rolls.rollD6());
    }
    this.messageCache.push(`\n### Draws: ${rolls.sort().join(", ")}`, channel);
    for (const roll of rolls) {
      if (roll < this.hand.length) {
        if (roll in indexToUsableCardMap) {
          // empower corresponding card
          indexToUsableCardMap[roll].empowerLevel += 1;
        } else {
          const card = this.hand[roll];
          indexToUsableCardMap[roll] = card;
        }
      }
    }

    if (this.additionalMetadata.accessToDefaultCardOptions) {
      indexToUsableCardMap["8"] = DefaultCards.discardCard.clone();
      indexToUsableCardMap["9"] = DefaultCards.waitCard.clone();
    }
    indexToUsableCardMap["10"] = DefaultCards.forfeitCard.clone();

    return indexToUsableCardMap;
  }

  printHand(channel: TCGThread) {
    let cardsInHand: string[] = [];
    this.messageCache.push(
      `# ${this.cosmetic.emoji} ${this.name}'s Hand: `,
      channel,
    );
    this.hand.forEach((card, index) => {
      cardsInHand.push(card.printCard(`- ${index}: `));
    });
    this.messageCache.push(cardsInHand.join("\n"), channel);
  }

  // adjust a character's stat
  // returns whether the operation was a success
  // there is no failure condition for now
  adjustStat(adjustValue: number, stat: StatsEnum): boolean {
    const roundedAdjustValue = Number(adjustValue.toFixed(2));
    const roundedStatValue = Number(
      (this.stats.stats[stat] + roundedAdjustValue).toFixed(2),
    );
    if (this.setStatValue(roundedStatValue, stat)) {
      const statDescription =
        stat === StatsEnum.Ability ? "Ability Counter" : stat;
      let statUpdateLines: string[] = [];
      if (adjustValue < 0) {
        statUpdateLines.push(
          `${this.name} *lost* ${statDetails[stat].emoji} *${-1 * roundedAdjustValue}* ${statDescription}!`,
        );
        if (
          !(stat === StatsEnum.HP && this.additionalMetadata.manaSuppressed)
        ) {
          statUpdateLines.push(
            `${this.name}'s new ${statDescription}: **${this.stats.stats[stat]}**`,
          );
        }
      } else {
        statUpdateLines.push(
          `${this.name} **gained** ${statDetails[stat].emoji} **${roundedAdjustValue}** ${statDescription}!`,
        );
        if (
          !(stat === StatsEnum.HP && this.additionalMetadata.manaSuppressed)
        ) {
          statUpdateLines.push(
            `${this.name}'s new ${statDescription}: **${this.stats.stats[stat]}**`,
          );
        }
      }

      this.messageCache.push(statUpdateLines.join(". "), TCGThread.Gameroom);
      return true;
    } else {
      this.messageCache.push(
        `${this.name}'s stat failed to be set! The move failed!`,
        TCGThread.Gameroom,
      );
      return false;
    }
  }

  setStat(statValue: number, stat: StatsEnum): boolean {
    if (this.setStatValue(statValue, stat)) {
      const statDescription =
        stat === StatsEnum.Ability ? "Ability Counter" : stat;
      this.messageCache.push(
        `${this.name}'s ${statDescription} is set to ${statValue}!`,
        TCGThread.Gameroom,
      );
      return true;
    } else {
      this.messageCache.push(
        `${this.name}'s stat failed to be set! The move failed!`,
        TCGThread.Gameroom,
      );
      return false;
    }
  }

  private setStatValue(newValue: number, stat: StatsEnum): boolean {
    if (newValue <= 1 && stat !== StatsEnum.Ability) {
      this.stats.stats[stat] = 1;
    } else if (
      stat === StatsEnum.HP &&
      newValue > this.initialStats.stats.HP &&
      !this.additionalMetadata.overheal
    ) {
      this.stats.stats[stat] = this.initialStats.stats.HP;
    } else {
      this.stats.stats[stat] = newValue;
    }

    return true;
  }

  removeExpiredTimedEffects() {
    this.timedEffects = this.timedEffects.filter(
      (timedEffect) => timedEffect.turnDuration > 0,
    );
  }

  empowerHand() {
    this.hand.forEach((card) => {
      card.empowerLevel += 1;
    });
  }
}

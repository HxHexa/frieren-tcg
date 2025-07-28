import Stats, { StatsEnum } from "@tcg/stats";
import Deck from "@tcg/deck";
import Card from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { Ability } from "@tcg/ability";
import { statDetails } from "@tcg/formatting/emojis";
import Rolls from "@tcg/util/rolls";
import { CharacterAdditionalMetadata } from "@tcg/additionalMetadata/characterAdditionalMetadata";
import DefaultCards from "@decks/utilDecks/defaultCard";
import {
  CharacterCosmetic,
  CharacterData,
  DEFAULT_ROLLS_COUNT,
} from "./characters/characterData/characterData";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { User } from "discord.js";
import Game from "./game";
import { CharacterName } from "./characters/metadata/CharacterName";
import { DENKEN_DEATH_HP } from "./characters/characterData/characters/Denken";
import { FlammeResearch } from "./additionalMetadata/gameAdditionalMetadata";

export interface CharacterProps {
  characterData: CharacterData;
  messageCache: MessageCache;
  characterUser: User;
  characterThread: TCGThread;
}

export default class Character {
  characterName: CharacterName;
  /**
   * The name of the character with display name ex). "Frieren (Hexa)"
   * See also: {@link Character.characterName} for just the character name
   */
  name: string;
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
    this.characterName = characterProps.characterData.characterName;
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

    this.name = `${this.characterName} (${this.characterUser.displayName})`;
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

  // discard a card and empower all other cards in hand
  playCard(handIndex: number): Card {
    const discardedCard = this.discardCard(handIndex, true);

    // empower remaining cards
    this.empowerHand();

    // draw a new card
    this.drawCard();
    return discardedCard;
  }

  discardCard(handIndex: number, playedCard?: boolean): Card {
    if (handIndex < this.hand.length) {
      const discardedCard = this.hand.splice(handIndex, 1)[0];
      if (!playedCard || !discardedCard.cardMetadata.removeOnPlay) {
        this.deck.discardCard(discardedCard);
      }

      const pushDiscardMessage = (message: string) => {
        this.messageCache.push(message, this.characterThread);
        if (this.additionalMetadata.publicDiscards) {
          this.messageCache.push(
            `${this.name}: ${message}`,
            TCGThread.Gameroom
          );
        }
      };

      const discardMessage = `Discarded ${discardedCard.title} + ${discardedCard.empowerLevel}`;
      pushDiscardMessage(discardMessage);

      return discardedCard;
    } else {
      throw new Error("index given greater than hand's length.");
    }
  }

  discardRandomCard(): Card {
    const randomIndex = Math.floor(Math.random() * this.hand.length);
    return this.discardCard(randomIndex);
  }

  // remove the first occurrence of a card
  removeCard(card: Card): boolean {
    const cardHandIndex = this.hand.indexOf(card);
    if (cardHandIndex !== -1) {
      this.hand.splice(cardHandIndex, 1);
      this.drawCard();
      return true;
    } else {
      const discardPileIndex = this.deck.discardPile.indexOf(card);
      if (discardPileIndex !== -1) {
        this.deck.discardPile.splice(discardPileIndex, 1);
        return true;
      } else {
        const activePileIndex = this.deck.activePile.indexOf(card);
        if (activePileIndex !== -1) {
          this.deck.activePile.splice(activePileIndex, 1);
          return true;
        } else {
          return false;
        }
      }
    }
  }

  getAllCards(): Card[] {
    return this.hand.concat(this.deck.activePile).concat(this.deck.discardPile);
  }

  getUsableCardsForRound(
    channel: TCGThread,
    game: Game,
    characterIndex: number
  ): Record<string, Card> {
    const nextCard = this.additionalMetadata.nextCardToPlay;

    const defaultCardOptions: Record<string, Card> = {};
    if (this.additionalMetadata.accessToDefaultCardOptions) {
      if (!game.gameSettings.prescienceMode) {
        // no discard in prescience mode
        defaultCardOptions["10"] = DefaultCards.discardCard.clone(); // starting at 10 to avoid getting out of order with extra dice
      }
      defaultCardOptions["11"] = DefaultCards.waitCard.clone();
    } else if (this.skipTurn && !nextCard) {
      defaultCardOptions["12"] = DefaultCards.doNothing.clone();
    }
    if (nextCard) {
      defaultCardOptions["13"] = nextCard.clone();
      this.additionalMetadata.nextCardToPlay = undefined;
    }

    defaultCardOptions["14"] = DefaultCards.forfeitCard.clone();

    if (this.skipTurn) {
      return defaultCardOptions;
    }

    const indexToUsableCardMap: Record<string, Card> = {};

    // roll 4d6
    let rolls = [];
    let rollCount = this.additionalMetadata.rollsCount;
    if (
      game.additionalMetadata.flammeResearch[characterIndex][
        FlammeResearch.TreeOfLife
      ]
    ) {
      rollCount += 1;
    }

    if (game.additionalMetadata.flammeTheory.Prescience) {
      rolls = [0, 1, 2, 3];
      if (
        game.additionalMetadata.flammeResearch[characterIndex][
          FlammeResearch.TreeOfLife
        ]
      ) {
        rolls.push(5);
      }
    } else if (game.gameSettings.prescienceMode) {
      rolls = [0, 1, 2, 3, 4, 5];

      // more rolls for those characters - methode/flamme
      for (let i = 0; i < rollCount - DEFAULT_ROLLS_COUNT; i++) {
        rolls.push(Rolls.rollD6());
      }
    } else {
      for (let i = 0; i < rollCount; i++) {
        rolls.push(Rolls.rollD6());
      }
    }

    this.messageCache.push(`\n### Draws: ${rolls.sort().join(", ")}`, channel);
    for (const roll of rolls) {
      if (roll < this.hand.length) {
        if (roll in indexToUsableCardMap) {
          // empower corresponding card
          indexToUsableCardMap[roll].empowerLevel += 1;
        } else {
          const card = this.hand[roll];

          // special conditional card handling
          if (card.conditionalTreatAsEffect) {
            const newCard = card.conditionalTreatAsEffect(game, characterIndex);
            if (newCard.conditionalTreatAsEffect) {
              indexToUsableCardMap[roll] = newCard.conditionalTreatAsEffect(
                game,
                characterIndex
              );
            } else {
              indexToUsableCardMap[roll] = newCard;
            }
          } else {
            indexToUsableCardMap[roll] = card;
          }
        }
      }
    }

    return { ...indexToUsableCardMap, ...defaultCardOptions };
  }

  printHand(channel: TCGThread) {
    const cardsInHand: string[] = [];
    this.messageCache.push(
      `# ${this.cosmetic.emoji} ${this.name}'s Hand: `,
      channel
    );
    this.hand.forEach((card, index) => {
      cardsInHand.push(card.printCard(`- ${index}: `));
    });
    this.messageCache.push(cardsInHand.join("\n"), channel);
  }

  // adjust a character's stat
  // returns whether the operation was a success
  // there is no failure condition for now
  private static IRREVERSIBILITY_IGNORED_STATS = new Set([
    StatsEnum.Ability,
    StatsEnum.TrueDEF,
    StatsEnum.HP,
  ]);
  adjustStat(adjustValue: number, stat: StatsEnum, game: Game): boolean {
    const roundedInitialAdjustValue = Number(adjustValue.toFixed(2));

    let roundedAdjustValue = roundedInitialAdjustValue;
    if (game.additionalMetadata.flammeTheory.Irreversibility) {
      if (!Character.IRREVERSIBILITY_IGNORED_STATS.has(stat)) {
        if (
          this.additionalMetadata.opponentMilleniumBarrierActive &&
          roundedAdjustValue > 0
        ) {
          roundedAdjustValue = 0;
        } else {
          roundedAdjustValue /= 2;
        }
      }
    }

    const roundedStatValue = Number(
      (this.stats.stats[stat] + roundedAdjustValue).toFixed(2)
    );
    if (this.setStatValue(roundedStatValue, stat)) {
      const statDescription =
        stat === StatsEnum.Ability ? "Ability Counter" : stat;
      const statUpdateLines: string[] = [];

      if (adjustValue < 0) {
        statUpdateLines.push(
          `${this.name} *lost* ${statDetails[stat].emoji} *${-1 * roundedAdjustValue}* ${statDescription}!`
        );
      } else {
        statUpdateLines.push(
          `${this.name} **gained** ${statDetails[stat].emoji} **${roundedAdjustValue}** ${statDescription}!`
        );
      }

      if (
        !(stat === StatsEnum.HP && this.additionalMetadata.manaSuppressed) &&
        !this.additionalMetadata.deceitful
      ) {
        statUpdateLines.push(
          `${this.name}'s new ${statDescription}: **${this.stats.stats[stat]}**`
        );
      }

      this.messageCache.push(statUpdateLines.join(" "), TCGThread.Gameroom);
      return true;
    } else {
      this.messageCache.push(
        `${this.name}'s stat failed to be set! The move failed!`,
        TCGThread.Gameroom
      );
      return false;
    }
  }

  setStat(
    statValue: number,
    stat: StatsEnum,
    sendMessage: boolean = true
  ): boolean {
    const roundedStatValue = Number(statValue.toFixed(2));
    if (this.setStatValue(roundedStatValue, stat)) {
      const statDescription =
        stat === StatsEnum.Ability ? "Ability Counter" : stat;
      if (sendMessage) {
        this.messageCache.push(
          `${this.name}'s ${statDescription} is set to ${roundedStatValue}.`,
          TCGThread.Gameroom
        );
      }
      return true;
    } else {
      this.messageCache.push(
        `${this.name}'s stat failed to be set! The move failed!`,
        TCGThread.Gameroom
      ); // send regardless
      return false;
    }
  }

  private setStatValue(newValue: number, stat: StatsEnum): boolean {
    if (stat === StatsEnum.HP) {
      if (newValue <= 1) {
        if (this.stats.stats.HP <= 0) {
          // special denken negative HP case
          // if starting HP is already negative and new value is also negative, don't set it to 1
          if (newValue <= DENKEN_DEATH_HP + 1) {
            this.stats.stats.HP = DENKEN_DEATH_HP + 1;
          } else {
            this.stats.stats.HP = newValue;
          }
        } else {
          this.stats.stats.HP = 1;
        }
      } else if (
        newValue > this.initialStats.stats.HP &&
        !this.additionalMetadata.overheal
      ) {
        // prevent overheal if not enabled
        this.stats.stats.HP = this.initialStats.stats.HP;
      } else {
        this.stats.stats.HP = newValue;
      }
    } else {
      // ATK DEF SPD
      if (stat === StatsEnum.Ability || stat === StatsEnum.TrueDEF) {
        this.stats.stats[stat] = newValue;
      } else if (newValue > 1) {
        this.stats.stats[stat] = newValue;
      } else {
        // minimum possible stat for ATK DEF SPD is 1
        this.stats.stats[stat] = 1;
      }
    }

    return true;
  }

  removeExpiredTimedEffects() {
    this.timedEffects = this.timedEffects.filter(
      (timedEffect) => timedEffect.turnDuration > 0
    );
  }

  empowerHand() {
    this.hand.forEach((card) => {
      card.empowerLevel += 1;
    });
  }
}

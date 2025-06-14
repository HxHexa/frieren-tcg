import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import flammeDeck, { researchDecreaseSigil } from "@tcg/decks/FlammeDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CardEmoji, CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Game from "@tcg/game";
import Card, { Nature } from "@tcg/card";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import TimedEffect from "@tcg/timedEffect";

const flammeStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 12.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 0.0,
});

const a_pinnacleOfHumanitysMagic = new Card({
  title: "Pinnacle of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Deal ${stat} DMG.`,
  emoji: CardEmoji.FLAMME_CARD,
  priority: 100,
  effects: [100],
  cardAction: function (
    this: Card,
    { game, sendToGameroom, selfStat, flatSelfStat, basicAttack }
  ) {
    sendToGameroom(`The Pinnacle of Humanity's Magic is on display.`);
    flatSelfStat(1, StatsEnum.Ability, game);
    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);
    basicAttack(0);
  },
});

const Flamme = new CharacterData({
  characterName: CharacterName.Flamme,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.FLAMME,
    color: 0xde8a54,
    imageUrl: mediaLinks.flammePortrait,
  },
  stats: flammeStats,
  cards: flammeDeck,
  ability: {
    abilityName: "Founder of Humanity's Magic",
    abilityEffectString: `The Foundation of Humanity's Magic gets more developed for each Theory card you play.
        After playing 4 Theory cards, add 1 "Pinnacle of Humanity's Magic" to your Discard pile.
        *Pinnacle of Humanity's Magic*: Priority+100. ATK+**100** DEF+**100** SPD+**100**. Deal **100** DMG.`,
    subAbilities: [
      {
        name: "Deceitful",
        description:
          "This character's stat is always displayed as 10/1/1/1. This character can also see past the opponent's Mana Suppression.",
      },
    ],
    abilityAfterOwnCardUse: function (
      game: Game,
      characterIndex: number,
      _messageCache: MessageCache,
      card: Card
    ) {
      const character = game.getCharacter(characterIndex);
      if (card.cardMetadata.theory) {
        character.adjustStat(1, StatsEnum.Ability, game);
      }
    },
    abilityEndOfTurnEffect: function (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache
    ) {
      const character = game.getCharacter(characterIndex);
      if (character.stats.stats.Ability === 4) {
        messageCache.push(
          "Flamme is close to a major discovery...",
          TCGThread.Gameroom
        );
        character.setStat(99, StatsEnum.Ability);
        messageCache.push(
          `*Pinnacle of Humanity's Magic* has been added to ${character.name}'s Discard pile.`,
          TCGThread.Gameroom
        );
        character.deck.discardPile.push(a_pinnacleOfHumanitysMagic.clone());
      }

      // sigil timed effects cleanup
      character.additionalMetadata.flammeSigil ??= 0;
      if (character.additionalMetadata.flammeSigil <= 0) {
        const newTimedEffects: TimedEffect[] = [];
        character.timedEffects.map((timedEffect) => {
          if (!timedEffect.metadata.consumesFlammeSigil) {
            newTimedEffects.push(timedEffect);
          } else {
            if (
              timedEffect.executeEndOfTimedEffectActionOnRemoval &&
              timedEffect.endOfTimedEffectAction
            ) {
              timedEffect.endOfTimedEffectAction(
                game,
                characterIndex,
                messageCache
              );
            }
          }
        });
        character.timedEffects = newTimedEffects;
      }
    },
    // sigil sequence
    abilityDefendEffect: (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache,
      _attackDamage: number
    ) => {
      const character = game.getCharacter(characterIndex);
      const lostFlammeSigil = character.timedEffects.filter(
        (effect) => effect.metadata.consumesFlammeSigil
      ).length;

      if (lostFlammeSigil > 0) {
        researchDecreaseSigil(
          character,
          messageCache,
          lostFlammeSigil,
          "The barriers stir."
        );
      }
    },
  },
  additionalMetadata: {
    deceitful: true,
    ignoreManaSuppressed: true,
    defenderDamageScaling: 1,
    flammeSigil: 3,
  },
});

export default Flamme;

import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Card from "@tcg/card";
import Game from "@tcg/game";
import { GameMessageContext } from "@tcg/gameContextProvider";

export type Ability = {
  abilityName: string;
  abilityEffectString: string;
  subAbilities?: { name: string; description: string }[];
  abilityStartOfTurnEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    additionalParam?: Record<any, any>
  ) => void;
  abilitySelectedMoveModifierEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    card: Card
  ) => Card;
  abilityOwnCardEffectWrapper?: (
    context: GameMessageContext,
    card: Card
  ) => void;
  abilityAfterOwnCardUse?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    card: Card
  ) => void;
  abilityAttackEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  abilityDefendEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    attackDamage: number
  ) => void;
  abilityCounterEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    attackDamage: number
  ) => void;
  abilityAfterDirectAttackEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  abilityAfterTimedAttackEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  abilityAfterOpponentsMoveEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    card: Card
  ) => void;
  abilityStartOfEndPhaseEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    additionalParam?: Record<any, any>
  ) => void;
  abilityEndOfTurnEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    additionalParam?: Record<any, any>
  ) => void;
};

export function formatAbility(ability: Ability) {
  return `${ability.abilityEffectString}${
    ability.subAbilities && ability.subAbilities.length > 0
      ? "\n\n" +
        ability.subAbilities
          .map((sub) => `**Sub-Ability - ${sub.name}** - ${sub.description}`)
          .join("\n")
      : ""
  }`;
}

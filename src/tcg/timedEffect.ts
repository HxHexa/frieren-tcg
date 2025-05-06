import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Game from "@tcg/game";

export interface TimedEffectProps {
  name: string;
  description: string;
  turnDuration: number;
  activateEndOfTurnActionThisTurn?: boolean;
  executeEndOfTimedEffectActionOnRemoval?: boolean;
  priority?: number;
  tags?: Record<string, number>;
  metadata?: TimedEffectMetadata;
  // TODO: change to a GameContext arg
  endOfTurnAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  // TODO: change to a GameContext arg
  endOfTimedEffectAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  // TODO: change to a GameContext arg
  replacedAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
}

type TimedEffectMetadata = {
  removableBySorganeil?: boolean;
  waldgoseDamage?: number;
  barrage?: number;
  partyMember?: "Frieren" | "Eisen" | "Heiter";
  ubelSpeedModifiers?: number;
};

export default class TimedEffect {
  name: string;
  description: string;
  turnDuration: number;
  priority: number;
  activateEndOfTurnActionThisTurn: boolean;
  executeEndOfTimedEffectActionOnRemoval: boolean;
  metadata: TimedEffectMetadata;
  /**
   * @deprecated use {@link TimedEffect.metadata} instead
   */
  tags: Record<string, number>;
  // TODO: change to a GameContext arg
  endOfTurnAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  // TODO: change to a GameContext arg
  endOfTimedEffectAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  // TODO: change to a GameContext arg
  replacedAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;

  constructor(props: TimedEffectProps) {
    this.name = props.name;
    this.description = props.description;
    this.turnDuration = props.turnDuration;
    this.priority = props.priority ? props.priority : 0;
    this.activateEndOfTurnActionThisTurn =
      props.activateEndOfTurnActionThisTurn ?? true;
    this.executeEndOfTimedEffectActionOnRemoval =
      props.executeEndOfTimedEffectActionOnRemoval ?? false;
    this.metadata = props.metadata ?? {};
    this.tags = props.tags ?? {};
    this.endOfTurnAction = props.endOfTurnAction;
    this.endOfTimedEffectAction = props.endOfTimedEffectAction;
    this.replacedAction = props.replacedAction;
  }

  passTurn() {
    this.turnDuration -= 1;
  }

  reduceTimedEffect(
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) {
    this.passTurn();
    if (!this.activateEndOfTurnActionThisTurn) {
      this.activateEndOfTurnActionThisTurn = true;
    } else {
      this.endOfTurnAction?.(game, characterIndex, messageCache);
    }

    if (this.turnDuration <= 0) {
      this.endOfTimedEffectAction?.(game, characterIndex, messageCache);
    }
  }

  printEffect() {
    return `- ${this.name} (${this.turnDuration} turn${this.turnDuration == 1 ? "" : "s"}):\n  - ${this.description}`;
  }
}

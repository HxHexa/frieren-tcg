import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Game from "@tcg/game";
import { TimedEffectContext } from "./gameContextProvider";

export interface TimedEffectProps {
  name: string;
  description: string;
  turnDuration: number;
  activateEndOfTurnActionThisTurn?: boolean;
  executeEndOfTimedEffectActionOnRemoval?: boolean;
  priority?: number;
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
  executeAfterCardRolls?: (context: TimedEffectContext) => void;
}

type TimedEffectMetadata = {
  removableBySorganeil?: boolean;
  barrage?: number;

  frieren?: boolean;
  eisen?: boolean;
  heiter?: boolean;

  denkenIsWaldgose?: boolean;
  wirbelIsTacticalRetreat?: boolean;

  ubelSpeedModifiers?: number;

  consumesFlammeSigil?: boolean;
};

const defaultMetadata: TimedEffectMetadata = {
  denkenIsWaldgose: false,
  wirbelIsTacticalRetreat: false,
  removableBySorganeil: true,
};

export default class TimedEffect {
  name: string;
  description: string;
  turnDuration: number;
  priority: number;
  activateEndOfTurnActionThisTurn: boolean;
  executeEndOfTimedEffectActionOnRemoval: boolean;
  metadata: TimedEffectMetadata;
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
  executeAfterCardRolls?: (context: TimedEffectContext) => void;

  constructor(props: TimedEffectProps) {
    this.name = props.name;
    this.description = props.description;
    this.turnDuration = props.turnDuration;
    this.priority = props.priority ? props.priority : 0;
    this.activateEndOfTurnActionThisTurn =
      props.activateEndOfTurnActionThisTurn ?? true;
    this.executeEndOfTimedEffectActionOnRemoval =
      props.executeEndOfTimedEffectActionOnRemoval ?? false;

    this.metadata = {
      ...defaultMetadata,
      ...props.metadata,
    };
    this.endOfTurnAction = props.endOfTurnAction;
    this.endOfTimedEffectAction = props.endOfTimedEffectAction;
    this.replacedAction = props.replacedAction;
    this.executeAfterCardRolls = props.executeAfterCardRolls;
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

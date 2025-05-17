import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CardEmoji } from "@tcg/formatting/emojis";
import Game from "@tcg/game";
import { GameMessageContext } from "@tcg/gameContextProvider";

export interface CardCosmetic {
  cardImageUrl?: string;
  cardGif?: string;
}

export enum Nature {
  Attack = "Attack",
  Defense = "Defense",
  Default = "Default",
  Util = "Util",
}

type CardMetadata = {
  nature: Nature;
  seriePool?: "Common" | "Rare" | "Ultra-rare";
  signature?: boolean;
  analysis?: number;
  postAnalysis?: number;
  waldgoseDamage?: number;

  heiter?: boolean;
  eisen?: boolean;
  frieren?: boolean;

  teaTime?: number;
  resolve?: number;
  signatureMoveOf?: CharacterName;
  ubelFailureRate?: number;
  hidePriority?: boolean;
  hideHpCost?: boolean;
  hideEmpower?: boolean;
};

export type CardProps = {
  title: string;
  cardMetadata: CardMetadata;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji?: CardEmoji;
  cosmetic?: CardCosmetic;
  cardAction: (context: GameMessageContext) => void;
  // TODO: change to a GameContext arg
  conditionalTreatAsEffect?: (game: Game, characterIndex: number) => Card;
  empowerLevel?: number;
  priority?: number;
  imitated?: boolean;
  printEmpower?: boolean;
  hpCost?: number;
  empathized?: boolean;
};

export default class Card implements CardProps {
  readonly EMPOWER_BOOST = 0.1;

  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji: CardEmoji;
  cosmetic?: CardCosmetic | undefined;
  cardAction: (context: GameMessageContext) => void;
  // TODO: change to a GameContext arg
  conditionalTreatAsEffect?: (game: Game, characterIndex: number) => Card;
  empowerLevel: number;
  priority: number;
  imitated: boolean;
  cardMetadata: CardMetadata;
  hpCost: number;
  empathized: boolean;

  constructor(cardProps: CardProps) {
    this.title = cardProps.title;
    this.description = cardProps.description;
    this.effects = cardProps.effects;
    this.cardAction = cardProps.cardAction;
    this.conditionalTreatAsEffect = cardProps.conditionalTreatAsEffect;
    this.empowerLevel = cardProps.empowerLevel ?? 0;
    this.priority = cardProps.priority ?? 0;
    this.imitated = cardProps.imitated ?? false;
    this.cardMetadata = cardProps.cardMetadata;
    this.emoji = cardProps.emoji ?? CardEmoji.GENERIC;
    this.cosmetic = cardProps.cosmetic;
    this.hpCost = cardProps.hpCost ?? 0;
    this.empathized = cardProps.empathized ?? false;
  }

  getDescription(): string {
    const empoweredEffects: string[] = this.effects.map(
      (effect) => `**${this.calculateEffectValue(effect).toFixed(2)}**`
    );

    let description = this.description(empoweredEffects);

    if (this.hpCost && !this.cardMetadata.hideHpCost) {
      description = `HP-${this.hpCost}. ${description}`;
    }
    if (this.priority && !this.cardMetadata.hidePriority) {
      const prioritySign = this.priority < 0 ? "-" : "+";
      description = `Priority${prioritySign}${Math.abs(this.priority)}. ${description}`;
    }

    return description;
  }

  getTitle(): string {
    return (
      `${this.imitated ? "(Imitated) " : ""}` +
      `${this.empathized ? "(Learned) " : ""}` +
      `${this.title}` +
      `${this.cardMetadata.hideEmpower !== true ? ` + ${this.empowerLevel}` : ""}`
    );
  }

  calculateEffectValue(effect: number) {
    return Number(
      (effect * (1 + this.empowerLevel * this.EMPOWER_BOOST)).toFixed(2)
    );
  }

  printCard(startingString: string = "") {
    return (
      `${startingString}${this.emoji} **${this.getTitle()}**\n` +
      `  - ${this.getDescription()}`
    );
  }

  clone(): Card {
    return new Card({ ...this });
  }
}

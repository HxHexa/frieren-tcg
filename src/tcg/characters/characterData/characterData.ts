import Pronouns from "@tcg/pronoun";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { Ability } from "@tcg/ability";
import Stats from "@tcg/stats";
import Card from "@tcg/card";
import { CharacterAdditionalMetadata } from "@tcg/additionalMetadata/characterAdditionalMetadata";
import { CharacterEmoji } from "@tcg/formatting/emojis";

const defaultMetadata: CharacterAdditionalMetadata = {
  manaSuppressed: false,
  ignoreManaSuppressed: false,
  deceitful: false,
  attackedThisTurn: false,
  timedEffectAttackedThisTurn: false,
  accessToDefaultCardOptions: true,
  defenderDamageScaling: 1,
  pierceFactor: 0,
  forcedDiscards: 0,
  rollsCount: 6,
  methodeFindsCute: false,

  hidden: false,
  publicDiscards: false,
};

export interface CharacterCosmetic {
  pronouns: Pronouns;
  emoji: CharacterEmoji;
  color: number;
  imageUrl: string;
}

export interface CharacterDataProps {
  characterName: CharacterName;
  cosmetic: CharacterCosmetic;
  stats: Stats;
  cards: { card: Card; count: number }[];
  ability: Ability;
  additionalMetadata?: Partial<CharacterAdditionalMetadata>;
}

export class CharacterData {
  characterName: CharacterName;
  cosmetic: CharacterCosmetic;
  stats: Stats;
  cards: { card: Card; count: number }[];
  ability: Ability;

  additionalMetadata: CharacterAdditionalMetadata;

  constructor(characterDataProps: CharacterDataProps) {
    this.characterName = characterDataProps.characterName;
    this.cosmetic = characterDataProps.cosmetic;
    this.stats = characterDataProps.stats;
    this.cards = characterDataProps.cards;
    this.ability = characterDataProps.ability;
    this.additionalMetadata = {
      ...defaultMetadata,
      ...characterDataProps.additionalMetadata,
    };
  }

  clone(): CharacterData {
    return new CharacterData({
      characterName: this.characterName,
      cosmetic: this.cosmetic,
      stats: this.stats.clone(),
      cards: this.cards,
      ability: { ...this.ability },
      additionalMetadata: { ...this.additionalMetadata },
    });
  }
}

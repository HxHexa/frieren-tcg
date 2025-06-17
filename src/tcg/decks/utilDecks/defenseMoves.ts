import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import Card from "@tcg/card";
import { elementaryDefensiveMagic, bareHandedBlock } from "@decks/DenkenDeck";
import { one_step_ahead } from "@decks/EdelDeck";
import { commonDefensiveMagic } from "@decks/FernDeck";
import { ordinaryDefensiveMagic } from "@decks/FrierenDeck";
import { quickBlock } from "@decks/HimmelDeck";
import { parry } from "@decks/LaufenDeck";
import { braceYourself } from "@decks/SeinDeck";
import { hairBarrier } from "@decks/SenseDeck";
import { basicDefensiveMagic } from "@decks/SerieDeck";
import { block } from "@decks/StarkDeck";
import { deflect } from "@decks/StilleDeck";
import { defend } from "@decks/UbelDeck";

export const defenseMoves: Record<CharacterName, Card[]> = {
  [CharacterName.Denken]: [elementaryDefensiveMagic, bareHandedBlock],
  [CharacterName.Edel]: [one_step_ahead],
  [CharacterName.Fern]: [commonDefensiveMagic],
  [CharacterName.Flamme]: [], // default
  [CharacterName.Frieren]: [ordinaryDefensiveMagic],
  [CharacterName.Himmel]: [quickBlock],
  [CharacterName.Laufen]: [parry],
  [CharacterName.Linie]: [parry],
  [CharacterName.Methode]: [], // default
  [CharacterName.Sein]: [braceYourself],
  [CharacterName.Sense]: [hairBarrier],
  [CharacterName.Serie]: [basicDefensiveMagic],
  [CharacterName.Stark]: [block],
  [CharacterName.Stille]: [deflect],
  [CharacterName.Ubel]: [defend],
  [CharacterName.Wirbel]: [], // default
} as const;

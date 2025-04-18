import { CharacterName } from "../../characters/metadata/CharacterName";
import Card from "../../card";

import { ordinaryDefensiveMagic } from "../FrierenDeck";

import { basicDefensiveMagic } from "../SerieDeck";

import { elementaryDefensiveMagic } from "../DenkenDeck";

import { quickBlock } from "../HimmelDeck";

import { parry } from "../LaufenDeck";

import { braceYourself } from "../SeinDeck";

import { hairBarrier } from "../SenseDeck";

import { block } from "../StarkDeck";

import { deflect } from "../StilleDeck";

export const defenseMoves: Record<CharacterName, Card> = {
  Frieren: ordinaryDefensiveMagic,
  Serie: basicDefensiveMagic,
  Denken: elementaryDefensiveMagic,
  Laufen: parry,
  Linie: parry,
  Stark: block,
  Himmel: quickBlock,
  Stille: deflect,
  Sein: braceYourself,
  Sense: hairBarrier,
  Übel: basicDefensiveMagic, //Change this later
} as const;

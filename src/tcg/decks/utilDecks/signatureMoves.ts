import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import Card from "@tcg/card";
import { bareHandedBlock } from "@decks/DenkenDeck";
import { telekinesis } from "@decks/EdelDeck";
import { spellToCreateManaButterflies } from "@decks/FernDeck";
import { a_theHeightOfMagic } from "@decks/FrierenDeck";
import { a_realHeroSwing } from "@decks/HimmelDeck";
import { a_supersonicStrike } from "@decks/LaufenDeck";
import { imitate } from "@decks/LinieDeck";
import { a_threeSpearsOfTheGoddess } from "@decks/SeinDeck";
import { a_piercingDrill } from "@decks/SenseDeck";
import { ancientBarrierMagic } from "./serieSignature";
import { a_geisel } from "@decks/StilleDeck";
import { a_lastStand } from "@decks/StarkDeck";
import { a_malevolentShrine } from "./ubelSignature";
import { perfectSorganeil } from "../WirbelDeck";
import incantationFieldOfFlowers from "./flammeSignature";

export const signatureMoves: Record<CharacterName, Card> = {
  [CharacterName.Denken]: bareHandedBlock,
  [CharacterName.Edel]: telekinesis,
  [CharacterName.Fern]: spellToCreateManaButterflies,
  [CharacterName.Frieren]: a_theHeightOfMagic,
  [CharacterName.Himmel]: a_realHeroSwing,
  [CharacterName.Laufen]: a_supersonicStrike,
  [CharacterName.Linie]: imitate,
  [CharacterName.Methode]: telekinesis, // default
  [CharacterName.Sein]: a_threeSpearsOfTheGoddess,
  [CharacterName.Sense]: a_piercingDrill,
  [CharacterName.Stark]: a_lastStand,
  [CharacterName.Stille]: a_geisel,
  [CharacterName.Serie]: ancientBarrierMagic,
  [CharacterName.Ubel]: a_malevolentShrine,
  [CharacterName.Wirbel]: perfectSorganeil,
  [CharacterName.Flamme]: incantationFieldOfFlowers,
};

export const SIGNATURE_MOVES_LIST = Object.entries(signatureMoves);

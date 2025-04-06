import Card from "../card";

export interface GameAdditionalMetadataProps {
  attackMissed: Record<number, boolean>;
  attackModifier: Record<number, number>;
  currentDraws: Record<number, Record<string, Card>>;
  lastUsedCards: Record<number, Card>;
  forfeited: Record<number, boolean>;
}

export type GameAdditionalMetadata = {
  attackMissed: Record<number, boolean>;
  attackCountered: Record<number, boolean>;
  attackModifier: Record<number, number>;
  currentDraws: Record<number, Record<string, Card>>;
  lastUsedCards: Record<number, Card>;
  forfeited: Record<number, boolean>;
};

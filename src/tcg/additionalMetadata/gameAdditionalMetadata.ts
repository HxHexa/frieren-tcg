import Card from "@tcg/card";

export enum FlammeTheory {
  Irreversibility = "Irreversibility",
  Balance = "Balance",
  Prescience = "Prescience",
  Soul = "Soul",
}

export enum FlammeResearch {
  MilleniumBarrier = "Millenium Barrier",
  ThousandYearSanctuary = "Thousand Year Sanctuary",
  TreeOfLife = "Tree of Life",
}

export type GameAdditionalMetadata = {
  attackMissed: Record<number, boolean>;
  attackCountered: Record<number, boolean>;
  attackModifier: Record<number, number>;
  currentPlayableMoves: Record<number, Record<string, Card>>;
  lastUsedCards: Record<number, Card>;
  forfeited: Record<number, boolean>;
  flammeTheory: Record<FlammeTheory, boolean>;
  flammeResearch: Record<number, Record<FlammeResearch, boolean>>;
  auserleseContextReversal: Record<number, boolean>;
};

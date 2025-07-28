import Card from "@tcg/card";
import { AuraPlatoon } from "../characters/characterData/characterUtil/auraPlatoon";

export enum UbelHit {
  SureHit = "sureHit",
  SureMiss = "sureMiss",
  Regular = "regular",
}

export type CharacterAdditionalMetadata = {
  manaSuppressed: boolean;
  ignoreManaSuppressed: boolean;
  deceitful: boolean;
  attackedThisTurn: boolean;
  timedEffectAttackedThisTurn: boolean;
  accessToDefaultCardOptions: boolean;
  defenderDamageScaling: number;
  pierceFactor: number;
  minimumPossibleHp?: number | undefined; // if undefined, there is no minimum hp cap
  overheal?: boolean;
  selectedCard?: Card;
  nextCardToPlay?: Card;

  senseTeaTimeStacks?: number;
  serieToyingNextTurn?: boolean;
  serieToyingTurn?: boolean;
  himmelEisenReadyToCounter?: boolean;
  ubelSureHit?: UbelHit;
  ubelSlashMovesPierceFactor?: number;
  fernBarrage?: number;
  opponentMilleniumBarrierActive?: boolean;
  forcedDiscards: number;
  rollsCount: number;
  methodeFindsCute: boolean;

  auraArmyDamageAbsorbed?: boolean;
  auraArmyDamageAbsorbtion: number;
  auraRetreat?: boolean;
  auraPlatoonQueue: AuraPlatoon[];
  auraRotDamage: number;
  auraCounterAttacksDamage: ((shieldbearersCount: number) => number)[];
  auraCounterAttackedThisTurn: boolean;

  hidden?: boolean;
  publicDiscards: boolean;
};

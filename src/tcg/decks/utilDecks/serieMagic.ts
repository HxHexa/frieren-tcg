import {
  a_catastravia,
  a_concentratedOffensiveMagicZoltraak,
  a_daosdorg,
  a_waldgose,
} from "../DenkenDeck";
import {
  a_judradjim,
  a_vollzanbel,
  a_zoltraak,
  barrierMagicAnalysis,
  demonMagicAnalysis,
  fieldOfFlower,
} from "../FrierenDeck";
import { a_supersonicStrike, a_whip, hide } from "../LaufenDeck";
import {
  a_erfassenAxe,
  a_erfassenKnife,
  a_erfassenSpear,
  a_erfassenSword,
  adapt,
  manaDetection,
} from "../LinieDeck";
import { a_killingMagic, solitude } from "../monsterDecks/CosmicTonDeck";
import {
  a_threeSpearsOfTheGoddess,
  a_trustInYourAllyFernsBarrage,
  a_trustInYourAllyFrierensZoltraak,
  awakening,
  poisonCure,
} from "../SeinDeck";
import {
  a_hairWhip,
  a_pierce,
  a_piercingDrill,
  harden,
  rest,
} from "../SenseDeck";

export const serie_offensiveMagic = [
  a_zoltraak,
  a_judradjim,
  a_vollzanbel,
  a_whip,
  a_supersonicStrike,
  a_erfassenAxe,
  a_erfassenKnife,
  a_erfassenSpear,
  a_erfassenSword,
  a_trustInYourAllyFernsBarrage,
  a_trustInYourAllyFrierensZoltraak,
  // a_threeSpearsOfTheGoddess,
  a_hairWhip,
  a_pierce,
  a_piercingDrill,
  a_waldgose,
  a_daosdorg,
  a_concentratedOffensiveMagicZoltraak,
  a_catastravia,

  a_killingMagic,
];

export const serie_utilityMagic = [
  solitude,
  harden,
  rest,
  awakening,
  poisonCure,
  adapt,
  manaDetection,
  hide,
  barrierMagicAnalysis,
  demonMagicAnalysis,
  fieldOfFlower,
];

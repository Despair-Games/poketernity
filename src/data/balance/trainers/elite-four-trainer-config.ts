import { TrainerConfig } from "#app/data/trainer-config";
import { Type } from "#app/enums/type";
import { TrainerType } from "#enums/trainer-type";
import { signatureSpecies } from "./signature-species";

let t = TrainerType.LORELEI;
export const eliteFourTrainerConfigs = {
  // Kanto
  [TrainerType.LORELEI]: new TrainerConfig(t)
    .initForEliteFour(signatureSpecies["LORELEI"], false, Type.ICE)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.BRUNO]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["BRUNO"], true, Type.FIGHTING)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.AGATHA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["AGATHA"], false, Type.GHOST)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.LANCE]: new TrainerConfig(++t)
    .setName("Lance")
    .initForEliteFour(signatureSpecies["LANCE"], true, Type.DRAGON)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),

  // Johto
  [TrainerType.WILL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["WILL"], true, Type.PSYCHIC)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.KOGA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["KOGA"], true, Type.POISON)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.KAREN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["KAREN"], false, Type.DARK)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),

  // Hoenn
  [TrainerType.SIDNEY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["SIDNEY"], true, Type.DARK)
    .setMixedBattleBgm("battle_hoenn_elite"),
  [TrainerType.PHOEBE]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["PHOEBE"], false, Type.GHOST)
    .setMixedBattleBgm("battle_hoenn_elite"),
  [TrainerType.GLACIA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["GLACIA"], false, Type.ICE)
    .setMixedBattleBgm("battle_hoenn_elite"),
  [TrainerType.DRAKE]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["DRAKE"], true, Type.DRAGON)
    .setMixedBattleBgm("battle_hoenn_elite"),

  // Sinnoh
  [TrainerType.AARON]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["AARON"], true, Type.BUG)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BERTHA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["BERTHA"], false, Type.GROUND)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FLINT]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["FLINT"], true, Type.FIRE)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.LUCIAN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["LUCIAN"], true, Type.PSYCHIC)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),

  // Unova
  [TrainerType.SHAUNTAL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["SHAUNTAL"], false, Type.GHOST)
    .setMixedBattleBgm("battle_unova_elite"),
  [TrainerType.MARSHAL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["MARSHAL"], true, Type.FIGHTING)
    .setMixedBattleBgm("battle_unova_elite"),
  [TrainerType.GRIMSLEY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["GRIMSLEY"], true, Type.DARK)
    .setMixedBattleBgm("battle_unova_elite"),
  [TrainerType.CAITLIN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["CAITLIN"], false, Type.PSYCHIC)
    .setMixedBattleBgm("battle_unova_elite"),

  // Kalos
  [TrainerType.MALVA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["MALVA"], false, Type.FIRE)
    .setMixedBattleBgm("battle_kalos_elite"),
  [TrainerType.SIEBOLD]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["SIEBOLD"], true, Type.WATER)
    .setMixedBattleBgm("battle_kalos_elite"),
  [TrainerType.WIKSTROM]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["WIKSTROM"], true, Type.STEEL)
    .setMixedBattleBgm("battle_kalos_elite"),
  [TrainerType.DRASNA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["DRASNA"], false, Type.DRAGON)
    .setMixedBattleBgm("battle_kalos_elite"),

  // Alola
  [TrainerType.HALA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["HALA"], true, Type.FIGHTING)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.MOLAYNE]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["MOLAYNE"], true, Type.STEEL)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.OLIVIA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["OLIVIA"], false, Type.ROCK)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.ACEROLA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["ACEROLA"], false, Type.GHOST)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.KAHILI]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["KAHILI"], false, Type.FLYING)
    .setMixedBattleBgm("battle_alola_elite"),

  // Galar
  [TrainerType.MARNIE_ELITE]: new TrainerConfig(++t)
    .setName("Marnie")
    .initForEliteFour(signatureSpecies["MARNIE_ELITE"], false, Type.DARK)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.NESSA_ELITE]: new TrainerConfig(++t)
    .setName("Nessa")
    .initForEliteFour(signatureSpecies["NESSA_ELITE"], false, Type.WATER)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.BEA_ELITE]: new TrainerConfig(++t)
    .setName("Bea")
    .initForEliteFour(signatureSpecies["BEA_ELITE"], false, Type.FIGHTING)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.ALLISTER_ELITE]: new TrainerConfig(++t)
    .setName("Allister")
    .initForEliteFour(signatureSpecies["ALLISTER_ELITE"], true, Type.GHOST)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.RAIHAN_ELITE]: new TrainerConfig(++t)
    .setName("Raihan")
    .initForEliteFour(signatureSpecies["RAIHAN_ELITE"], true, Type.DRAGON)
    .setMixedBattleBgm("battle_galar_elite"),

  // Paldea
  [TrainerType.RIKA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["RIKA"], false, Type.GROUND)
    .setMixedBattleBgm("battle_paldea_elite"),
  [TrainerType.POPPY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["POPPY"], false, Type.STEEL)
    .setMixedBattleBgm("battle_paldea_elite"),
  [TrainerType.LARRY_ELITE]: new TrainerConfig(++t)
    .setName("Larry")
    .initForEliteFour(signatureSpecies["LARRY_ELITE"], true, Type.NORMAL, Type.FLYING)
    .setMixedBattleBgm("battle_paldea_elite"),
  [TrainerType.HASSEL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["HASSEL"], true, Type.DRAGON)
    .setMixedBattleBgm("battle_paldea_elite"),

  // Blueberry Academy
  [TrainerType.CRISPIN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["CRISPIN"], true, Type.FIRE)
    .setMixedBattleBgm("battle_bb_elite"),
  [TrainerType.AMARYS]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["AMARYS"], false, Type.STEEL)
    .setMixedBattleBgm("battle_bb_elite"),
  [TrainerType.LACEY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["LACEY"], false, Type.FAIRY)
    .setMixedBattleBgm("battle_bb_elite"),
  [TrainerType.DRAYTON]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["DRAYTON"], true, Type.DRAGON)
    .setMixedBattleBgm("battle_bb_elite"),
};

import { signatureSpecies } from "#app/data/balance/signatureSpecies";
import { TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerType } from "#enums/trainer-type";
import { ElementType } from "#enums/element-type";

let t = TrainerType.LORELEI;
export const eliteFourTrainerConfigs: TrainerConfigs = {
  [TrainerType.LORELEI]: new TrainerConfig(t)
    .initForEliteFour(signatureSpecies["LORELEI"], false, ElementType.ICE)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.BRUNO]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["BRUNO"], true, ElementType.FIGHTING)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.AGATHA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["AGATHA"], false, ElementType.GHOST)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.LANCE]: new TrainerConfig(++t)
    .setName("Lance")
    .initForEliteFour(signatureSpecies["LANCE"], true, ElementType.DRAGON)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.WILL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["WILL"], true, ElementType.PSYCHIC)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.KOGA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["KOGA"], true, ElementType.POISON)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.KAREN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["KAREN"], false, ElementType.DARK)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.SIDNEY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["SIDNEY"], true, ElementType.DARK)
    .setMixedBattleBgm("battle_hoenn_elite"),
  [TrainerType.PHOEBE]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["PHOEBE"], false, ElementType.GHOST)
    .setMixedBattleBgm("battle_hoenn_elite"),
  [TrainerType.GLACIA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["GLACIA"], false, ElementType.ICE)
    .setMixedBattleBgm("battle_hoenn_elite"),
  [TrainerType.DRAKE]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["DRAKE"], true, ElementType.DRAGON)
    .setMixedBattleBgm("battle_hoenn_elite"),
  [TrainerType.AARON]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["AARON"], true, ElementType.BUG)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BERTHA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["BERTHA"], false, ElementType.GROUND)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FLINT]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["FLINT"], true, ElementType.FIRE)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.LUCIAN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["LUCIAN"], true, ElementType.PSYCHIC)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.SHAUNTAL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["SHAUNTAL"], false, ElementType.GHOST)
    .setMixedBattleBgm("battle_unova_elite"),
  [TrainerType.MARSHAL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["MARSHAL"], true, ElementType.FIGHTING)
    .setMixedBattleBgm("battle_unova_elite"),
  [TrainerType.GRIMSLEY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["GRIMSLEY"], true, ElementType.DARK)
    .setMixedBattleBgm("battle_unova_elite"),
  [TrainerType.CAITLIN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["CAITLIN"], false, ElementType.PSYCHIC)
    .setMixedBattleBgm("battle_unova_elite"),
  [TrainerType.MALVA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["MALVA"], false, ElementType.FIRE)
    .setMixedBattleBgm("battle_kalos_elite"),
  [TrainerType.SIEBOLD]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["SIEBOLD"], true, ElementType.WATER)
    .setMixedBattleBgm("battle_kalos_elite"),
  [TrainerType.WIKSTROM]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["WIKSTROM"], true, ElementType.STEEL)
    .setMixedBattleBgm("battle_kalos_elite"),
  [TrainerType.DRASNA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["DRASNA"], false, ElementType.DRAGON)
    .setMixedBattleBgm("battle_kalos_elite"),
  [TrainerType.HALA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["HALA"], true, ElementType.FIGHTING)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.MOLAYNE]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["MOLAYNE"], true, ElementType.STEEL)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.OLIVIA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["OLIVIA"], false, ElementType.ROCK)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.ACEROLA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["ACEROLA"], false, ElementType.GHOST)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.KAHILI]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["KAHILI"], false, ElementType.FLYING)
    .setMixedBattleBgm("battle_alola_elite"),
  [TrainerType.MARNIE_ELITE]: new TrainerConfig(++t)
    .setName("Marnie")
    .initForEliteFour(signatureSpecies["MARNIE_ELITE"], false, ElementType.DARK)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.NESSA_ELITE]: new TrainerConfig(++t)
    .setName("Nessa")
    .initForEliteFour(signatureSpecies["NESSA_ELITE"], false, ElementType.WATER)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.BEA_ELITE]: new TrainerConfig(++t)
    .setName("Bea")
    .initForEliteFour(signatureSpecies["BEA_ELITE"], false, ElementType.FIGHTING)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.ALLISTER_ELITE]: new TrainerConfig(++t)
    .setName("Allister")
    .initForEliteFour(signatureSpecies["ALLISTER_ELITE"], true, ElementType.GHOST)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.RAIHAN_ELITE]: new TrainerConfig(++t)
    .setName("Raihan")
    .initForEliteFour(signatureSpecies["RAIHAN_ELITE"], true, ElementType.DRAGON)
    .setMixedBattleBgm("battle_galar_elite"),
  [TrainerType.RIKA]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["RIKA"], false, ElementType.GROUND)
    .setMixedBattleBgm("battle_paldea_elite"),
  [TrainerType.POPPY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["POPPY"], false, ElementType.STEEL)
    .setMixedBattleBgm("battle_paldea_elite"),
  [TrainerType.LARRY_ELITE]: new TrainerConfig(++t)
    .setName("Larry")
    .initForEliteFour(signatureSpecies["LARRY_ELITE"], true, ElementType.NORMAL, ElementType.FLYING)
    .setMixedBattleBgm("battle_paldea_elite"),
  [TrainerType.HASSEL]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["HASSEL"], true, ElementType.DRAGON)
    .setMixedBattleBgm("battle_paldea_elite"),
  [TrainerType.CRISPIN]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["CRISPIN"], true, ElementType.FIRE)
    .setMixedBattleBgm("battle_bb_elite"),
  [TrainerType.AMARYS]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["AMARYS"], false, ElementType.STEEL)
    .setMixedBattleBgm("battle_bb_elite"),
  [TrainerType.LACEY]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["LACEY"], false, ElementType.FAIRY)
    .setMixedBattleBgm("battle_bb_elite"),
  [TrainerType.DRAYTON]: new TrainerConfig(++t)
    .initForEliteFour(signatureSpecies["DRAYTON"], true, ElementType.DRAGON)
    .setMixedBattleBgm("battle_bb_elite"),
};

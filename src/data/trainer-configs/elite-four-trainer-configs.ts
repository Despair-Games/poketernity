import { signatureSpecies } from "#data/signature-species";
import { TrainerConfig, type TrainerConfigs } from "#data/trainer-config";
import { ElementalType } from "#enums/elemental-type";
import { TrainerType } from "#enums/trainer-type";

export const eliteFourTrainerConfigs: TrainerConfigs = {
  [TrainerType.LORELEI]: new TrainerConfig(TrainerType.LORELEI)
    .initForEliteFour(signatureSpecies["LORELEI"], false, ElementalType.ICE)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.BRUNO]: new TrainerConfig(TrainerType.BRUNO)
    .initForEliteFour(signatureSpecies["BRUNO"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.AGATHA]: new TrainerConfig(TrainerType.AGATHA)
    .initForEliteFour(signatureSpecies["AGATHA"], false, ElementalType.GHOST)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.LANCE]: new TrainerConfig(TrainerType.LANCE)
    .setName("Lance")
    .initForEliteFour(signatureSpecies["LANCE"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.WILL]: new TrainerConfig(TrainerType.WILL)
    .initForEliteFour(signatureSpecies["WILL"], true, ElementalType.PSYCHIC)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.KOGA]: new TrainerConfig(TrainerType.KOGA)
    .initForEliteFour(signatureSpecies["KOGA"], true, ElementalType.POISON)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.KAREN]: new TrainerConfig(TrainerType.KAREN)
    .initForEliteFour(signatureSpecies["KAREN"], false, ElementalType.DARK)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.SIDNEY]: new TrainerConfig(TrainerType.SIDNEY)
    .initForEliteFour(signatureSpecies["SIDNEY"], true, ElementalType.DARK)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.PHOEBE]: new TrainerConfig(TrainerType.PHOEBE)
    .initForEliteFour(signatureSpecies["PHOEBE"], false, ElementalType.GHOST)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.GLACIA]: new TrainerConfig(TrainerType.GLACIA)
    .initForEliteFour(signatureSpecies["GLACIA"], false, ElementalType.ICE)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.DRAKE]: new TrainerConfig(TrainerType.DRAKE)
    .initForEliteFour(signatureSpecies["DRAKE"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.AARON]: new TrainerConfig(TrainerType.AARON)
    .initForEliteFour(signatureSpecies["AARON"], true, ElementalType.BUG)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BERTHA]: new TrainerConfig(TrainerType.BERTHA)
    .initForEliteFour(signatureSpecies["BERTHA"], false, ElementalType.GROUND)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FLINT]: new TrainerConfig(TrainerType.FLINT)
    .initForEliteFour(signatureSpecies["FLINT"], true, ElementalType.FIRE)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.LUCIAN]: new TrainerConfig(TrainerType.LUCIAN)
    .initForEliteFour(signatureSpecies["LUCIAN"], true, ElementalType.PSYCHIC)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.SHAUNTAL]: new TrainerConfig(TrainerType.SHAUNTAL)
    .initForEliteFour(signatureSpecies["SHAUNTAL"], false, ElementalType.GHOST)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.MARSHAL]: new TrainerConfig(TrainerType.MARSHAL)
    .initForEliteFour(signatureSpecies["MARSHAL"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.GRIMSLEY]: new TrainerConfig(TrainerType.GRIMSLEY)
    .initForEliteFour(signatureSpecies["GRIMSLEY"], true, ElementalType.DARK)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.CAITLIN]: new TrainerConfig(TrainerType.CAITLIN)
    .initForEliteFour(signatureSpecies["CAITLIN"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.MALVA]: new TrainerConfig(TrainerType.MALVA)
    .initForEliteFour(signatureSpecies["MALVA"], false, ElementalType.FIRE)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.SIEBOLD]: new TrainerConfig(TrainerType.SIEBOLD)
    .initForEliteFour(signatureSpecies["SIEBOLD"], true, ElementalType.WATER)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.WIKSTROM]: new TrainerConfig(TrainerType.WIKSTROM)
    .initForEliteFour(signatureSpecies["WIKSTROM"], true, ElementalType.STEEL)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.DRASNA]: new TrainerConfig(TrainerType.DRASNA)
    .initForEliteFour(signatureSpecies["DRASNA"], false, ElementalType.DRAGON)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.HALA]: new TrainerConfig(TrainerType.HALA)
    .initForEliteFour(signatureSpecies["HALA"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.MOLAYNE]: new TrainerConfig(TrainerType.MOLAYNE)
    .initForEliteFour(signatureSpecies["MOLAYNE"], true, ElementalType.STEEL)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.OLIVIA]: new TrainerConfig(TrainerType.OLIVIA)
    .initForEliteFour(signatureSpecies["OLIVIA"], false, ElementalType.ROCK)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.ACEROLA]: new TrainerConfig(TrainerType.ACEROLA)
    .initForEliteFour(signatureSpecies["ACEROLA"], false, ElementalType.GHOST)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.KAHILI]: new TrainerConfig(TrainerType.KAHILI)
    .initForEliteFour(signatureSpecies["KAHILI"], false, ElementalType.FLYING)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.MARNIE_ELITE]: new TrainerConfig(TrainerType.MARNIE_ELITE)
    .setName("Marnie")
    .initForEliteFour(signatureSpecies["MARNIE_ELITE"], false, ElementalType.DARK)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.NESSA_ELITE]: new TrainerConfig(TrainerType.NESSA_ELITE)
    .setName("Nessa")
    .initForEliteFour(signatureSpecies["NESSA_ELITE"], false, ElementalType.WATER)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.BEA_ELITE]: new TrainerConfig(TrainerType.BEA_ELITE)
    .setName("Bea")
    .initForEliteFour(signatureSpecies["BEA_ELITE"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.ALLISTER_ELITE]: new TrainerConfig(TrainerType.ALLISTER_ELITE)
    .setName("Allister")
    .initForEliteFour(signatureSpecies["ALLISTER_ELITE"], true, ElementalType.GHOST)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.RAIHAN_ELITE]: new TrainerConfig(TrainerType.RAIHAN_ELITE)
    .setName("Raihan")
    .initForEliteFour(signatureSpecies["RAIHAN_ELITE"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.RIKA]: new TrainerConfig(TrainerType.RIKA)
    .initForEliteFour(signatureSpecies["RIKA"], false, ElementalType.GROUND)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.POPPY]: new TrainerConfig(TrainerType.POPPY)
    .initForEliteFour(signatureSpecies["POPPY"], false, ElementalType.STEEL)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.LARRY_ELITE]: new TrainerConfig(TrainerType.LARRY_ELITE)
    .setName("Larry")
    .initForEliteFour(signatureSpecies["LARRY_ELITE"], true, ElementalType.NORMAL, ElementalType.FLYING)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.HASSEL]: new TrainerConfig(TrainerType.HASSEL)
    .initForEliteFour(signatureSpecies["HASSEL"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.CRISPIN]: new TrainerConfig(TrainerType.CRISPIN)
    .initForEliteFour(signatureSpecies["CRISPIN"], true, ElementalType.FIRE)
    .setBattleBgm("battle_bb_elite"),
  [TrainerType.AMARYS]: new TrainerConfig(TrainerType.AMARYS)
    .initForEliteFour(signatureSpecies["AMARYS"], false, ElementalType.STEEL)
    .setBattleBgm("battle_bb_elite"),
  [TrainerType.LACEY]: new TrainerConfig(TrainerType.LACEY)
    .initForEliteFour(signatureSpecies["LACEY"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_bb_elite"),
  [TrainerType.DRAYTON]: new TrainerConfig(TrainerType.DRAYTON)
    .initForEliteFour(signatureSpecies["DRAYTON"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_bb_elite"),
};

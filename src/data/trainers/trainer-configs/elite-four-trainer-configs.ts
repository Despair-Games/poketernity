import { eliteFourSignatureSpecies } from "#data/signature-species";
import { ElementalType } from "#enums/elemental-type";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import { TrainerConfig, type TrainerConfigs } from "#trainers/trainer-config";
import { TrainerConfigBuilder } from "#trainers/trainer-config-builder";

export const eliteFourTrainerConfigs: TrainerConfigs = {
  [TrainerType.LORELEI]: new TrainerConfig(TrainerType.LORELEI)
    .initForEliteFour(eliteFourSignatureSpecies["LORELEI"], false, ElementalType.ICE)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.BRUNO]: new TrainerConfig(TrainerType.BRUNO)
    .initForEliteFour(eliteFourSignatureSpecies["BRUNO"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.AGATHA]: new TrainerConfig(TrainerType.AGATHA)
    .initForEliteFour(eliteFourSignatureSpecies["AGATHA"], false, ElementalType.GHOST)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.LANCE]: new TrainerConfig(TrainerType.LANCE)
    .setName("Lance")
    .initForEliteFour(eliteFourSignatureSpecies["LANCE"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.WILL]: new TrainerConfig(TrainerType.WILL)
    .initForEliteFour(eliteFourSignatureSpecies["WILL"], true, ElementalType.PSYCHIC)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.KOGA]: new TrainerConfig(TrainerType.KOGA)
    .initForEliteFour(eliteFourSignatureSpecies["KOGA"], true, ElementalType.POISON)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.KAREN]: new TrainerConfig(TrainerType.KAREN)
    .initForEliteFour(eliteFourSignatureSpecies["KAREN"], false, ElementalType.DARK)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.SIDNEY]: new TrainerConfig(TrainerType.SIDNEY)
    .initForEliteFour(eliteFourSignatureSpecies["SIDNEY"], true, ElementalType.DARK)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.PHOEBE]: new TrainerConfig(TrainerType.PHOEBE)
    .initForEliteFour(eliteFourSignatureSpecies["PHOEBE"], false, ElementalType.GHOST)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.GLACIA]: new TrainerConfig(TrainerType.GLACIA)
    .initForEliteFour(eliteFourSignatureSpecies["GLACIA"], false, ElementalType.ICE)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.DRAKE]: new TrainerConfig(TrainerType.DRAKE)
    .initForEliteFour(eliteFourSignatureSpecies["DRAKE"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_hoenn_elite"),
  [TrainerType.AARON]: new TrainerConfig(TrainerType.AARON)
    .initForEliteFour(eliteFourSignatureSpecies["AARON"], true, ElementalType.BUG)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BERTHA]: new TrainerConfig(TrainerType.BERTHA)
    .initForEliteFour(eliteFourSignatureSpecies["BERTHA"], false, ElementalType.GROUND)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FLINT]: new TrainerConfig(TrainerType.FLINT)
    .initForEliteFour(eliteFourSignatureSpecies["FLINT"], true, ElementalType.FIRE)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.LUCIAN]: new TrainerConfig(TrainerType.LUCIAN)
    .initForEliteFour(eliteFourSignatureSpecies["LUCIAN"], true, ElementalType.PSYCHIC)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.SHAUNTAL]: new TrainerConfig(TrainerType.SHAUNTAL)
    .initForEliteFour(eliteFourSignatureSpecies["SHAUNTAL"], false, ElementalType.GHOST)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.MARSHAL]: new TrainerConfig(TrainerType.MARSHAL)
    .initForEliteFour(eliteFourSignatureSpecies["MARSHAL"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.GRIMSLEY]: new TrainerConfig(TrainerType.GRIMSLEY)
    .initForEliteFour(eliteFourSignatureSpecies["GRIMSLEY"], true, ElementalType.DARK)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.CAITLIN]: new TrainerConfig(TrainerType.CAITLIN)
    .initForEliteFour(eliteFourSignatureSpecies["CAITLIN"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_unova_elite"),
  [TrainerType.MALVA]: new TrainerConfig(TrainerType.MALVA)
    .initForEliteFour(eliteFourSignatureSpecies["MALVA"], false, ElementalType.FIRE)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.SIEBOLD]: new TrainerConfig(TrainerType.SIEBOLD)
    .initForEliteFour(eliteFourSignatureSpecies["SIEBOLD"], true, ElementalType.WATER)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.WIKSTROM]: new TrainerConfig(TrainerType.WIKSTROM)
    .initForEliteFour(eliteFourSignatureSpecies["WIKSTROM"], true, ElementalType.STEEL)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.DRASNA]: new TrainerConfig(TrainerType.DRASNA)
    .initForEliteFour(eliteFourSignatureSpecies["DRASNA"], false, ElementalType.DRAGON)
    .setBattleBgm("battle_kalos_elite"),
  [TrainerType.HALA]: new TrainerConfig(TrainerType.HALA)
    .initForEliteFour(eliteFourSignatureSpecies["HALA"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.MOLAYNE]: new TrainerConfig(TrainerType.MOLAYNE)
    .initForEliteFour(eliteFourSignatureSpecies["MOLAYNE"], true, ElementalType.STEEL)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.OLIVIA]: new TrainerConfig(TrainerType.OLIVIA)
    .initForEliteFour(eliteFourSignatureSpecies["OLIVIA"], false, ElementalType.ROCK)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.ACEROLA]: new TrainerConfig(TrainerType.ACEROLA)
    .initForEliteFour(eliteFourSignatureSpecies["ACEROLA"], false, ElementalType.GHOST)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.KAHILI]: new TrainerConfig(TrainerType.KAHILI)
    .initForEliteFour(eliteFourSignatureSpecies["KAHILI"], false, ElementalType.FLYING)
    .setBattleBgm("battle_alola_elite"),
  [TrainerType.MARNIE_ELITE]: new TrainerConfig(TrainerType.MARNIE_ELITE)
    .setName("Marnie")
    .initForEliteFour(eliteFourSignatureSpecies["MARNIE_ELITE"], false, ElementalType.DARK)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.NESSA_ELITE]: new TrainerConfig(TrainerType.NESSA_ELITE)
    .setName("Nessa")
    .initForEliteFour(eliteFourSignatureSpecies["NESSA_ELITE"], false, ElementalType.WATER)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.BEA_ELITE]: new TrainerConfig(TrainerType.BEA_ELITE)
    .setName("Bea")
    .initForEliteFour(eliteFourSignatureSpecies["BEA_ELITE"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.ALLISTER_ELITE]: new TrainerConfig(TrainerType.ALLISTER_ELITE)
    .setName("Allister")
    .initForEliteFour(eliteFourSignatureSpecies["ALLISTER_ELITE"], true, ElementalType.GHOST)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.RAIHAN_ELITE]: new TrainerConfig(TrainerType.RAIHAN_ELITE)
    .setName("Raihan")
    .initForEliteFour(eliteFourSignatureSpecies["RAIHAN_ELITE"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_galar_elite"),
  [TrainerType.RIKA]: new TrainerConfig(TrainerType.RIKA)
    .initForEliteFour(eliteFourSignatureSpecies["RIKA"], false, ElementalType.GROUND)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.POPPY]: new TrainerConfig(TrainerType.POPPY)
    .initForEliteFour(eliteFourSignatureSpecies["POPPY"], false, ElementalType.STEEL)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.LARRY_ELITE]: new TrainerConfig(TrainerType.LARRY_ELITE)
    .setName("Larry")
    .initForEliteFour(eliteFourSignatureSpecies["LARRY_ELITE"], true, ElementalType.NORMAL, ElementalType.FLYING)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.HASSEL]: new TrainerConfig(TrainerType.HASSEL)
    .initForEliteFour(eliteFourSignatureSpecies["HASSEL"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_paldea_elite"),
  [TrainerType.CRISPIN]: new TrainerConfig(TrainerType.CRISPIN)
    .initForEliteFour(eliteFourSignatureSpecies["CRISPIN"], true, ElementalType.FIRE)
    .setBattleBgm("battle_bb_elite"),
  [TrainerType.AMARYS]: new TrainerConfig(TrainerType.AMARYS)
    .initForEliteFour(eliteFourSignatureSpecies["AMARYS"], false, ElementalType.STEEL)
    .setBattleBgm("battle_bb_elite"),
  [TrainerType.LACEY]: new TrainerConfig(TrainerType.LACEY)
    .initForEliteFour(eliteFourSignatureSpecies["LACEY"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_bb_elite"),
  [TrainerType.DRAYTON]: new TrainerConfig(TrainerType.DRAYTON)
    .initForEliteFour(eliteFourSignatureSpecies["DRAYTON"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_bb_elite"),
};

export const newEliteFourTrainerConfigs: TrainerConfigMap = {
  [TrainerType.LORELEI]: new TrainerConfigBuilder(TrainerType.LORELEI)
    .withEliteFourConfig("LORELEI", TrainerGender.FEMALE, ElementalType.ICE)
    .withBattleBgm("battle_kanto_gym")
    .build(),
  [TrainerType.BRUNO]: new TrainerConfigBuilder(TrainerType.BRUNO)
    .withEliteFourConfig("BRUNO", TrainerGender.MALE, ElementalType.FIGHTING)
    .withBattleBgm("battle_kanto_gym")
    .build(),
  [TrainerType.AGATHA]: new TrainerConfigBuilder(TrainerType.AGATHA)
    .withEliteFourConfig("AGATHA", TrainerGender.FEMALE, ElementalType.GHOST)
    .withBattleBgm("battle_kanto_gym")
    .build(),
  [TrainerType.LANCE]: new TrainerConfigBuilder(TrainerType.LANCE)
    .withEliteFourConfig("LANCE", TrainerGender.MALE, ElementalType.DRAGON)
    .withBattleBgm("battle_kanto_gym")
    .build(),
  [TrainerType.WILL]: new TrainerConfigBuilder(TrainerType.WILL)
    .withEliteFourConfig("WILL", TrainerGender.MALE, ElementalType.PSYCHIC)
    .withBattleBgm("battle_johto_gym")
    .build(),
  [TrainerType.KOGA]: new TrainerConfigBuilder(TrainerType.KOGA)
    .withEliteFourConfig("KOGA", TrainerGender.MALE, ElementalType.POISON)
    .withBattleBgm("battle_johto_gym")
    .build(),
  [TrainerType.KAREN]: new TrainerConfigBuilder(TrainerType.KAREN)
    .withEliteFourConfig("KAREN", TrainerGender.FEMALE, ElementalType.DARK)
    .withBattleBgm("battle_johto_gym")
    .build(),
  [TrainerType.SIDNEY]: new TrainerConfigBuilder(TrainerType.SIDNEY)
    .withEliteFourConfig("SIDNEY", TrainerGender.MALE, ElementalType.DARK)
    .withBattleBgm("battle_hoenn_elite")
    .build(),
  [TrainerType.PHOEBE]: new TrainerConfigBuilder(TrainerType.PHOEBE)
    .withEliteFourConfig("PHOEBE", TrainerGender.FEMALE, ElementalType.GHOST)
    .withBattleBgm("battle_hoenn_elite")
    .build(),
  [TrainerType.GLACIA]: new TrainerConfigBuilder(TrainerType.GLACIA)
    .withEliteFourConfig("GLACIA", TrainerGender.FEMALE, ElementalType.ICE)
    .withBattleBgm("battle_hoenn_elite")
    .build(),
  [TrainerType.DRAKE]: new TrainerConfigBuilder(TrainerType.DRAKE)
    .withEliteFourConfig("DRAKE", TrainerGender.MALE, ElementalType.DRAGON)
    .withBattleBgm("battle_hoenn_elite")
    .build(),
  [TrainerType.AARON]: new TrainerConfigBuilder(TrainerType.AARON)
    .withEliteFourConfig("AARON", TrainerGender.MALE, ElementalType.BUG)
    .withBattleBgm("battle_sinnoh_gym")
    .build(),
  [TrainerType.BERTHA]: new TrainerConfigBuilder(TrainerType.BERTHA)
    .withEliteFourConfig("BERTHA", TrainerGender.FEMALE, ElementalType.GROUND)
    .withBattleBgm("battle_sinnoh_gym")
    .build(),
  [TrainerType.FLINT]: new TrainerConfigBuilder(TrainerType.FLINT)
    .withEliteFourConfig("FLINT", TrainerGender.MALE, ElementalType.FIRE)
    .withBattleBgm("battle_sinnoh_gym")
    .build(),
  [TrainerType.LUCIAN]: new TrainerConfigBuilder(TrainerType.LUCIAN)
    .withEliteFourConfig("LUCIAN", TrainerGender.MALE, ElementalType.PSYCHIC)
    .withBattleBgm("battle_sinnoh_gym")
    .build(),
  [TrainerType.SHAUNTAL]: new TrainerConfigBuilder(TrainerType.SHAUNTAL)
    .withEliteFourConfig("SHAUNTAL", TrainerGender.FEMALE, ElementalType.GHOST)
    .withBattleBgm("battle_unova_elite")
    .build(),
  [TrainerType.MARSHAL]: new TrainerConfigBuilder(TrainerType.MARSHAL)
    .withEliteFourConfig("MARSHAL", TrainerGender.MALE, ElementalType.FIGHTING)
    .withBattleBgm("battle_unova_elite")
    .build(),
  [TrainerType.GRIMSLEY]: new TrainerConfigBuilder(TrainerType.GRIMSLEY)
    .withEliteFourConfig("GRIMSLEY", TrainerGender.MALE, ElementalType.DARK)
    .withBattleBgm("battle_unova_elite")
    .build(),
  [TrainerType.CAITLIN]: new TrainerConfigBuilder(TrainerType.CAITLIN)
    .withEliteFourConfig("CAITLIN", TrainerGender.FEMALE, ElementalType.PSYCHIC)
    .withBattleBgm("battle_unova_elite")
    .build(),
  [TrainerType.MALVA]: new TrainerConfigBuilder(TrainerType.MALVA)
    .withEliteFourConfig("MALVA", TrainerGender.FEMALE, ElementalType.FIRE)
    .withBattleBgm("battle_kalos_elite")
    .build(),
  [TrainerType.SIEBOLD]: new TrainerConfigBuilder(TrainerType.SIEBOLD)
    .withEliteFourConfig("SIEBOLD", TrainerGender.MALE, ElementalType.WATER)
    .withBattleBgm("battle_kalos_elite")
    .build(),
  [TrainerType.WIKSTROM]: new TrainerConfigBuilder(TrainerType.WIKSTROM)
    .withEliteFourConfig("WIKSTROM", TrainerGender.MALE, ElementalType.STEEL)
    .withBattleBgm("battle_kalos_elite")
    .build(),
  [TrainerType.DRASNA]: new TrainerConfigBuilder(TrainerType.DRASNA)
    .withEliteFourConfig("DRASNA", TrainerGender.FEMALE, ElementalType.DRAGON)
    .withBattleBgm("battle_kalos_elite")
    .build(),
  [TrainerType.HALA]: new TrainerConfigBuilder(TrainerType.HALA)
    .withEliteFourConfig("HALA", TrainerGender.MALE, ElementalType.FIGHTING)
    .withBattleBgm("battle_alola_elite")
    .build(),
  [TrainerType.MOLAYNE]: new TrainerConfigBuilder(TrainerType.MOLAYNE)
    .withEliteFourConfig("MOLAYNE", TrainerGender.MALE, ElementalType.STEEL)
    .withBattleBgm("battle_alola_elite")
    .build(),
  [TrainerType.OLIVIA]: new TrainerConfigBuilder(TrainerType.OLIVIA)
    .withEliteFourConfig("OLIVIA", TrainerGender.FEMALE, ElementalType.ROCK)
    .withBattleBgm("battle_alola_elite")
    .build(),
  [TrainerType.ACEROLA]: new TrainerConfigBuilder(TrainerType.ACEROLA)
    .withEliteFourConfig("ACEROLA", TrainerGender.FEMALE, ElementalType.GHOST)
    .withBattleBgm("battle_alola_elite")
    .build(),
  [TrainerType.KAHILI]: new TrainerConfigBuilder(TrainerType.KAHILI)
    .withEliteFourConfig("KAHILI", TrainerGender.FEMALE, ElementalType.FLYING)
    .withBattleBgm("battle_alola_elite")
    .build(),
  [TrainerType.MARNIE_ELITE]: new TrainerConfigBuilder(TrainerType.MARNIE_ELITE)
    .withEliteFourConfig("MARNIE_ELITE", TrainerGender.FEMALE, ElementalType.DARK)
    .withFixedName("marnie", TrainerGender.FEMALE)
    .withBattleBgm("battle_galar_elite")
    .build(),
  [TrainerType.NESSA_ELITE]: new TrainerConfigBuilder(TrainerType.NESSA_ELITE)
    .withEliteFourConfig("NESSA_ELITE", TrainerGender.FEMALE, ElementalType.WATER)
    .withFixedName("nessa", TrainerGender.FEMALE)
    .withBattleBgm("battle_galar_elite")
    .build(),
  [TrainerType.BEA_ELITE]: new TrainerConfigBuilder(TrainerType.BEA_ELITE)
    .withEliteFourConfig("BEA_ELITE", TrainerGender.FEMALE, ElementalType.FIGHTING)
    .withFixedName("bea", TrainerGender.FEMALE)
    .withBattleBgm("battle_galar_elite")
    .build(),
  [TrainerType.ALLISTER_ELITE]: new TrainerConfigBuilder(TrainerType.ALLISTER_ELITE)
    .withEliteFourConfig("ALLISTER_ELITE", TrainerGender.MALE, ElementalType.GHOST)
    .withFixedName("allister", TrainerGender.MALE)
    .withBattleBgm("battle_galar_elite")
    .build(),
  [TrainerType.RAIHAN_ELITE]: new TrainerConfigBuilder(TrainerType.RAIHAN_ELITE)
    .withEliteFourConfig("RAIHAN_ELITE", TrainerGender.MALE, ElementalType.DRAGON)
    .withFixedName("raihan", TrainerGender.MALE)
    .withBattleBgm("battle_galar_elite")
    .build(),
  [TrainerType.RIKA]: new TrainerConfigBuilder(TrainerType.RIKA)
    .withEliteFourConfig("RIKA", TrainerGender.FEMALE, ElementalType.GROUND)
    .withBattleBgm("battle_paldea_elite")
    .build(),
  [TrainerType.POPPY]: new TrainerConfigBuilder(TrainerType.POPPY)
    .withEliteFourConfig("POPPY", TrainerGender.FEMALE, ElementalType.STEEL)
    .withBattleBgm("battle_paldea_elite")
    .build(),
  [TrainerType.LARRY_ELITE]: new TrainerConfigBuilder(TrainerType.LARRY_ELITE)
    .withEliteFourConfig("LARRY_ELITE", TrainerGender.MALE, ElementalType.NORMAL, ElementalType.FLYING)
    .withFixedName("larry", TrainerGender.MALE)
    .withBattleBgm("battle_paldea_elite")
    .build(),
  [TrainerType.HASSEL]: new TrainerConfigBuilder(TrainerType.HASSEL)
    .withEliteFourConfig("HASSEL", TrainerGender.MALE, ElementalType.DRAGON)
    .withBattleBgm("battle_paldea_elite")
    .build(),
  [TrainerType.CRISPIN]: new TrainerConfigBuilder(TrainerType.CRISPIN)
    .withEliteFourConfig("CRISPIN", TrainerGender.MALE, ElementalType.FIRE)
    .withBattleBgm("battle_bb_elite")
    .build(),
  [TrainerType.AMARYS]: new TrainerConfigBuilder(TrainerType.AMARYS)
    .withEliteFourConfig("AMARYS", TrainerGender.FEMALE, ElementalType.STEEL)
    .withBattleBgm("battle_bb_elite")
    .build(),
  [TrainerType.LACEY]: new TrainerConfigBuilder(TrainerType.LACEY)
    .withEliteFourConfig("LACEY", TrainerGender.FEMALE, ElementalType.FAIRY)
    .withBattleBgm("battle_bb_elite")
    .build(),
  [TrainerType.DRAYTON]: new TrainerConfigBuilder(TrainerType.DRAYTON)
    .withEliteFourConfig("DRAYTON", TrainerGender.MALE, ElementalType.DRAGON)
    .withBattleBgm("battle_bb_elite")
    .build(),
};

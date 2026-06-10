import { ElementalType } from "#enums/elemental-type";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/trainer-config";
import { TrainerConfigBuilder } from "#trainers/trainer-config-builder";

export const eliteFourTrainerConfigs: TrainerConfigMap = {
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

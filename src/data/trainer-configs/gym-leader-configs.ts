import type { TrainerConfigMap } from "#data/new-trainer-config";
import { signatureSpecies } from "#data/signature-species";
import type { TrainerConfigs } from "#data/trainer-config";
import { TrainerConfig } from "#data/trainer-config";
import { TrainerConfigBuilder } from "#data/trainer-config-builder";
import { ElementalType } from "#enums/elemental-type";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";

export const gymLeaderTrainerConfigs: TrainerConfigs = {
  [TrainerType.BROCK]: new TrainerConfig(TrainerType.BROCK)
    .initForGymLeader(signatureSpecies["BROCK"], true, ElementalType.ROCK)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.MISTY]: new TrainerConfig(TrainerType.MISTY)
    .initForGymLeader(signatureSpecies["MISTY"], false, ElementalType.WATER)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.LT_SURGE]: new TrainerConfig(TrainerType.LT_SURGE)
    .initForGymLeader(signatureSpecies["LT_SURGE"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.ERIKA]: new TrainerConfig(TrainerType.ERIKA)
    .initForGymLeader(signatureSpecies["ERIKA"], false, ElementalType.GRASS)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.JANINE]: new TrainerConfig(TrainerType.JANINE)
    .initForGymLeader(signatureSpecies["JANINE"], false, ElementalType.POISON)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.SABRINA]: new TrainerConfig(TrainerType.SABRINA)
    .initForGymLeader(signatureSpecies["SABRINA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.BLAINE]: new TrainerConfig(TrainerType.BLAINE)
    .initForGymLeader(signatureSpecies["BLAINE"], true, ElementalType.FIRE)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.GIOVANNI]: new TrainerConfig(TrainerType.GIOVANNI)
    .initForGymLeader(signatureSpecies["GIOVANNI"], true, ElementalType.GROUND)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.FALKNER]: new TrainerConfig(TrainerType.FALKNER)
    .initForGymLeader(signatureSpecies["FALKNER"], true, ElementalType.FLYING)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.BUGSY]: new TrainerConfig(TrainerType.BUGSY)
    .initForGymLeader(signatureSpecies["BUGSY"], true, ElementalType.BUG)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.WHITNEY]: new TrainerConfig(TrainerType.WHITNEY)
    .initForGymLeader(signatureSpecies["WHITNEY"], false, ElementalType.NORMAL)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.MORTY]: new TrainerConfig(TrainerType.MORTY)
    .initForGymLeader(signatureSpecies["MORTY"], true, ElementalType.GHOST)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.CHUCK]: new TrainerConfig(TrainerType.CHUCK)
    .initForGymLeader(signatureSpecies["CHUCK"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.JASMINE]: new TrainerConfig(TrainerType.JASMINE)
    .initForGymLeader(signatureSpecies["JASMINE"], false, ElementalType.STEEL)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.PRYCE]: new TrainerConfig(TrainerType.PRYCE)
    .initForGymLeader(signatureSpecies["PRYCE"], true, ElementalType.ICE)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.CLAIR]: new TrainerConfig(TrainerType.CLAIR)
    .initForGymLeader(signatureSpecies["CLAIR"], false, ElementalType.DRAGON)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.ROXANNE]: new TrainerConfig(TrainerType.ROXANNE)
    .initForGymLeader(signatureSpecies["ROXANNE"], false, ElementalType.ROCK)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.BRAWLY]: new TrainerConfig(TrainerType.BRAWLY)
    .initForGymLeader(signatureSpecies["BRAWLY"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.WATTSON]: new TrainerConfig(TrainerType.WATTSON)
    .initForGymLeader(signatureSpecies["WATTSON"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.FLANNERY]: new TrainerConfig(TrainerType.FLANNERY)
    .initForGymLeader(signatureSpecies["FLANNERY"], false, ElementalType.FIRE)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.NORMAN]: new TrainerConfig(TrainerType.NORMAN)
    .initForGymLeader(signatureSpecies["NORMAN"], true, ElementalType.NORMAL)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.WINONA]: new TrainerConfig(TrainerType.WINONA)
    .initForGymLeader(signatureSpecies["WINONA"], false, ElementalType.FLYING)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.TATE]: new TrainerConfig(TrainerType.TATE)
    .initForGymLeader(signatureSpecies["TATE"], true, ElementalType.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setHasDouble("tate_liza_double")
    .setDoubleTrainerType(TrainerType.LIZA)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.LIZA]: new TrainerConfig(TrainerType.LIZA)
    .initForGymLeader(signatureSpecies["LIZA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setHasDouble("liza_tate_double")
    .setDoubleTrainerType(TrainerType.TATE)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.JUAN]: new TrainerConfig(TrainerType.JUAN)
    .initForGymLeader(signatureSpecies["JUAN"], true, ElementalType.WATER)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.ROARK]: new TrainerConfig(TrainerType.ROARK)
    .initForGymLeader(signatureSpecies["ROARK"], true, ElementalType.ROCK)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.GARDENIA]: new TrainerConfig(TrainerType.GARDENIA)
    .initForGymLeader(signatureSpecies["GARDENIA"], false, ElementalType.GRASS)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.MAYLENE]: new TrainerConfig(TrainerType.MAYLENE)
    .initForGymLeader(signatureSpecies["MAYLENE"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CRASHER_WAKE]: new TrainerConfig(TrainerType.CRASHER_WAKE)
    .initForGymLeader(signatureSpecies["CRASHER_WAKE"], true, ElementalType.WATER)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FANTINA]: new TrainerConfig(TrainerType.FANTINA)
    .initForGymLeader(signatureSpecies["FANTINA"], false, ElementalType.GHOST)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BYRON]: new TrainerConfig(TrainerType.BYRON)
    .initForGymLeader(signatureSpecies["BYRON"], true, ElementalType.STEEL)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CANDICE]: new TrainerConfig(TrainerType.CANDICE)
    .initForGymLeader(signatureSpecies["CANDICE"], false, ElementalType.ICE)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.VOLKNER]: new TrainerConfig(TrainerType.VOLKNER)
    .initForGymLeader(signatureSpecies["VOLKNER"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CILAN]: new TrainerConfig(TrainerType.CILAN)
    .initForGymLeader(signatureSpecies["CILAN"], true, ElementalType.GRASS)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CHILI]: new TrainerConfig(TrainerType.CHILI)
    .initForGymLeader(signatureSpecies["CHILI"], true, ElementalType.FIRE)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CRESS]: new TrainerConfig(TrainerType.CRESS)
    .initForGymLeader(signatureSpecies["CRESS"], true, ElementalType.WATER)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CHEREN]: new TrainerConfig(TrainerType.CHEREN)
    .initForGymLeader(signatureSpecies["CHEREN"], true, ElementalType.NORMAL)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.LENORA]: new TrainerConfig(TrainerType.LENORA)
    .initForGymLeader(signatureSpecies["LENORA"], false, ElementalType.NORMAL)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.ROXIE]: new TrainerConfig(TrainerType.ROXIE)
    .initForGymLeader(signatureSpecies["ROXIE"], false, ElementalType.POISON)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.BURGH]: new TrainerConfig(TrainerType.BURGH)
    .initForGymLeader(signatureSpecies["BURGH"], true, ElementalType.BUG)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.ELESA]: new TrainerConfig(TrainerType.ELESA)
    .initForGymLeader(signatureSpecies["ELESA"], false, ElementalType.ELECTRIC)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CLAY]: new TrainerConfig(TrainerType.CLAY)
    .initForGymLeader(signatureSpecies["CLAY"], true, ElementalType.GROUND)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.SKYLA]: new TrainerConfig(TrainerType.SKYLA)
    .initForGymLeader(signatureSpecies["SKYLA"], false, ElementalType.FLYING)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.BRYCEN]: new TrainerConfig(TrainerType.BRYCEN)
    .initForGymLeader(signatureSpecies["BRYCEN"], true, ElementalType.ICE)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.DRAYDEN]: new TrainerConfig(TrainerType.DRAYDEN)
    .initForGymLeader(signatureSpecies["DRAYDEN"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.MARLON]: new TrainerConfig(TrainerType.MARLON)
    .initForGymLeader(signatureSpecies["MARLON"], true, ElementalType.WATER)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.VIOLA]: new TrainerConfig(TrainerType.VIOLA)
    .initForGymLeader(signatureSpecies["VIOLA"], false, ElementalType.BUG)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.GRANT]: new TrainerConfig(TrainerType.GRANT)
    .initForGymLeader(signatureSpecies["GRANT"], true, ElementalType.ROCK)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.KORRINA]: new TrainerConfig(TrainerType.KORRINA)
    .initForGymLeader(signatureSpecies["KORRINA"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.RAMOS]: new TrainerConfig(TrainerType.RAMOS)
    .initForGymLeader(signatureSpecies["RAMOS"], true, ElementalType.GRASS)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.CLEMONT]: new TrainerConfig(TrainerType.CLEMONT)
    .initForGymLeader(signatureSpecies["CLEMONT"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.VALERIE]: new TrainerConfig(TrainerType.VALERIE)
    .initForGymLeader(signatureSpecies["VALERIE"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.OLYMPIA]: new TrainerConfig(TrainerType.OLYMPIA)
    .initForGymLeader(signatureSpecies["OLYMPIA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.WULFRIC]: new TrainerConfig(TrainerType.WULFRIC)
    .initForGymLeader(signatureSpecies["WULFRIC"], true, ElementalType.ICE)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.MILO]: new TrainerConfig(TrainerType.MILO)
    .initForGymLeader(signatureSpecies["MILO"], true, ElementalType.GRASS)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.NESSA]: new TrainerConfig(TrainerType.NESSA)
    .setName("Nessa")
    .initForGymLeader(signatureSpecies["NESSA"], false, ElementalType.WATER)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.KABU]: new TrainerConfig(TrainerType.KABU)
    .initForGymLeader(signatureSpecies["KABU"], true, ElementalType.FIRE)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.BEA]: new TrainerConfig(TrainerType.BEA)
    .setName("Bea")
    .initForGymLeader(signatureSpecies["BEA"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.ALLISTER]: new TrainerConfig(TrainerType.ALLISTER)
    .setName("Allister")
    .initForGymLeader(signatureSpecies["ALLISTER"], true, ElementalType.GHOST)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.OPAL]: new TrainerConfig(TrainerType.OPAL)
    .initForGymLeader(signatureSpecies["OPAL"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.BEDE]: new TrainerConfig(TrainerType.BEDE)
    .initForGymLeader(signatureSpecies["BEDE"], true, ElementalType.FAIRY)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.GORDIE]: new TrainerConfig(TrainerType.GORDIE)
    .initForGymLeader(signatureSpecies["GORDIE"], true, ElementalType.ROCK)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.MELONY]: new TrainerConfig(TrainerType.MELONY)
    .initForGymLeader(signatureSpecies["MELONY"], false, ElementalType.ICE)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.PIERS]: new TrainerConfig(TrainerType.PIERS)
    .initForGymLeader(signatureSpecies["PIERS"], true, ElementalType.DARK)
    .setHasDouble("piers_marnie_double")
    .setDoubleTrainerType(TrainerType.MARNIE)
    .setDoubleTitle("gym_leader_double")
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.MARNIE]: new TrainerConfig(TrainerType.MARNIE)
    .setName("Marnie")
    .initForGymLeader(signatureSpecies["MARNIE"], false, ElementalType.DARK)
    .setHasDouble("marnie_piers_double")
    .setDoubleTrainerType(TrainerType.PIERS)
    .setDoubleTitle("gym_leader_double")
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.RAIHAN]: new TrainerConfig(TrainerType.RAIHAN)
    .setName("Raihan")
    .initForGymLeader(signatureSpecies["RAIHAN"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.KATY]: new TrainerConfig(TrainerType.KATY).initForPaldeaGymLeader(
    signatureSpecies["KATY"],
    false,
    ElementalType.BUG,
  ),
  [TrainerType.BRASSIUS]: new TrainerConfig(TrainerType.BRASSIUS).initForPaldeaGymLeader(
    signatureSpecies["BRASSIUS"],
    true,
    ElementalType.GRASS,
  ),
  [TrainerType.IONO]: new TrainerConfig(TrainerType.IONO).initForPaldeaGymLeader(
    signatureSpecies["IONO"],
    false,
    ElementalType.ELECTRIC,
  ),
  [TrainerType.KOFU]: new TrainerConfig(TrainerType.KOFU).initForPaldeaGymLeader(
    signatureSpecies["KOFU"],
    true,
    ElementalType.WATER,
  ),
  [TrainerType.LARRY]: new TrainerConfig(TrainerType.LARRY)
    .setName("Larry")
    .initForPaldeaGymLeader(signatureSpecies["LARRY"], true, ElementalType.NORMAL),
  [TrainerType.RYME]: new TrainerConfig(TrainerType.RYME).initForPaldeaGymLeader(
    signatureSpecies["RYME"],
    false,
    ElementalType.GHOST,
  ),
  [TrainerType.TULIP]: new TrainerConfig(TrainerType.TULIP).initForPaldeaGymLeader(
    signatureSpecies["TULIP"],
    false,
    ElementalType.PSYCHIC,
  ),
  [TrainerType.GRUSHA]: new TrainerConfig(TrainerType.GRUSHA).initForPaldeaGymLeader(
    signatureSpecies["GRUSHA"],
    true,
    ElementalType.ICE,
  ),
};

export const newGymLeaderTrainerConfigs: TrainerConfigMap = {
  [TrainerType.BROCK]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BROCK", TrainerGender.MALE, "kanto", ElementalType.ROCK)
    .build(),
  [TrainerType.MISTY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("MISTY", TrainerGender.FEMALE, "kanto", ElementalType.WATER)
    .build(),
  [TrainerType.LT_SURGE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("LT_SURGE", TrainerGender.MALE, "kanto", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.ERIKA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("ERIKA", TrainerGender.FEMALE, "kanto", ElementalType.GRASS)
    .build(),
  [TrainerType.JANINE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("JANINE", TrainerGender.FEMALE, "kanto", ElementalType.POISON)
    .build(),
  [TrainerType.SABRINA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("SABRINA", TrainerGender.FEMALE, "kanto", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.BLAINE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BLAINE", TrainerGender.MALE, "kanto", ElementalType.FIRE)
    .build(),
  [TrainerType.GIOVANNI]: new TrainerConfigBuilder()
    .withGymLeaderConfig("GIOVANNI", TrainerGender.MALE, "kanto", ElementalType.GROUND)
    .build(),
  [TrainerType.FALKNER]: new TrainerConfigBuilder()
    .withGymLeaderConfig("FALKNER", TrainerGender.MALE, "johto", ElementalType.FLYING)
    .build(),
  [TrainerType.BUGSY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BUGSY", TrainerGender.MALE, "johto", ElementalType.BUG)
    .build(),
  [TrainerType.WHITNEY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("WHITNEY", TrainerGender.FEMALE, "johto", ElementalType.NORMAL)
    .build(),
  [TrainerType.MORTY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("MORTY", TrainerGender.MALE, "johto", ElementalType.GHOST)
    .build(),
  [TrainerType.CHUCK]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CHUCK", TrainerGender.MALE, "johto", ElementalType.FIGHTING)
    .build(),
  [TrainerType.JASMINE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("JASMINE", TrainerGender.FEMALE, "johto", ElementalType.STEEL)
    .build(),
  [TrainerType.PRYCE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("PRYCE", TrainerGender.MALE, "johto", ElementalType.ICE)
    .build(),
  [TrainerType.CLAIR]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CLAIR", TrainerGender.FEMALE, "johto", ElementalType.DRAGON)
    .build(),
  [TrainerType.ROXANNE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("ROXANNE", TrainerGender.FEMALE, "hoenn", ElementalType.ROCK)
    .build(),
  [TrainerType.BRAWLY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BRAWLY", TrainerGender.MALE, "hoenn", ElementalType.FIGHTING)
    .build(),
  [TrainerType.WATTSON]: new TrainerConfigBuilder()
    .withGymLeaderConfig("WATTSON", TrainerGender.MALE, "hoenn", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.FLANNERY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("FLANNERY", TrainerGender.FEMALE, "hoenn", ElementalType.FIRE)
    .build(),
  [TrainerType.NORMAN]: new TrainerConfigBuilder()
    .withGymLeaderConfig("NORMAN", TrainerGender.MALE, "hoenn", ElementalType.NORMAL)
    .build(),
  [TrainerType.WINONA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("WINONA", TrainerGender.FEMALE, "hoenn", ElementalType.FLYING)
    .build(),
  // TODO: Create double "TATE_LIZA" config
  [TrainerType.TATE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("TATE", TrainerGender.MALE, "hoenn", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.LIZA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("LIZA", TrainerGender.FEMALE, "hoenn", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.JUAN]: new TrainerConfigBuilder()
    .withGymLeaderConfig("JUAN", TrainerGender.MALE, "hoenn", ElementalType.WATER)
    .build(),
  [TrainerType.ROARK]: new TrainerConfigBuilder()
    .withGymLeaderConfig("ROARK", TrainerGender.MALE, "sinnoh", ElementalType.ROCK)
    .build(),
  [TrainerType.GARDENIA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("GARDENIA", TrainerGender.FEMALE, "sinnoh", ElementalType.GRASS)
    .build(),
  [TrainerType.MAYLENE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("MAYLENE", TrainerGender.FEMALE, "sinnoh", ElementalType.FIGHTING)
    .build(),
  [TrainerType.CRASHER_WAKE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CRASHER_WAKE", TrainerGender.MALE, "sinnoh", ElementalType.WATER)
    .build(),
  [TrainerType.FANTINA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("FANTINA", TrainerGender.FEMALE, "sinnoh", ElementalType.GHOST)
    .build(),
  [TrainerType.BYRON]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BYRON", TrainerGender.MALE, "sinnoh", ElementalType.STEEL)
    .build(),
  [TrainerType.CANDICE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CANDICE", TrainerGender.FEMALE, "sinnoh", ElementalType.ICE)
    .build(),
  [TrainerType.VOLKNER]: new TrainerConfigBuilder()
    .withGymLeaderConfig("VOLKNER", TrainerGender.MALE, "sinnoh", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.CILAN]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CILAN", TrainerGender.MALE, "unova", ElementalType.GRASS)
    .build(),
  [TrainerType.CHILI]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CHILI", TrainerGender.MALE, "unova", ElementalType.FIRE)
    .build(),
  [TrainerType.CRESS]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CRESS", TrainerGender.MALE, "unova", ElementalType.WATER)
    .build(),
  [TrainerType.CHEREN]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CHEREN", TrainerGender.MALE, "unova", ElementalType.NORMAL)
    .build(),
  [TrainerType.LENORA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("LENORA", TrainerGender.FEMALE, "unova", ElementalType.NORMAL)
    .build(),
  [TrainerType.ROXIE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("ROXIE", TrainerGender.FEMALE, "unova", ElementalType.POISON)
    .build(),
  [TrainerType.BURGH]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BURGH", TrainerGender.MALE, "unova", ElementalType.BUG)
    .build(),
  [TrainerType.ELESA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("ELESA", TrainerGender.FEMALE, "unova", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.CLAY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CLAY", TrainerGender.MALE, "unova", ElementalType.GROUND)
    .build(),
  [TrainerType.SKYLA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("SKYLA", TrainerGender.FEMALE, "unova", ElementalType.FLYING)
    .build(),
  [TrainerType.BRYCEN]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BRYCEN", TrainerGender.MALE, "unova", ElementalType.ICE)
    .build(),
  [TrainerType.DRAYDEN]: new TrainerConfigBuilder()
    .withGymLeaderConfig("DRAYDEN", TrainerGender.MALE, "unova", ElementalType.DRAGON)
    .build(),
  [TrainerType.MARLON]: new TrainerConfigBuilder()
    .withGymLeaderConfig("MARLON", TrainerGender.MALE, "unova", ElementalType.WATER)
    .build(),
  [TrainerType.VIOLA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("VIOLA", TrainerGender.FEMALE, "kalos", ElementalType.BUG)
    .build(),
  [TrainerType.GRANT]: new TrainerConfigBuilder()
    .withGymLeaderConfig("GRANT", TrainerGender.MALE, "kalos", ElementalType.ROCK)
    .build(),
  [TrainerType.KORRINA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("KORRINA", TrainerGender.FEMALE, "kalos", ElementalType.FIGHTING)
    .build(),
  [TrainerType.RAMOS]: new TrainerConfigBuilder()
    .withGymLeaderConfig("RAMOS", TrainerGender.MALE, "kalos", ElementalType.GRASS)
    .build(),
  [TrainerType.CLEMONT]: new TrainerConfigBuilder()
    .withGymLeaderConfig("CLEMONT", TrainerGender.MALE, "kalos", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.VALERIE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("VALERIE", TrainerGender.FEMALE, "kalos", ElementalType.FAIRY)
    .build(),
  [TrainerType.OLYMPIA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("OLYMPIA", TrainerGender.FEMALE, "kalos", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.WULFRIC]: new TrainerConfigBuilder()
    .withGymLeaderConfig("WULFRIC", TrainerGender.MALE, "kalos", ElementalType.ICE)
    .build(),
  [TrainerType.MILO]: new TrainerConfigBuilder()
    .withGymLeaderConfig("MILO", TrainerGender.MALE, "galar", ElementalType.GRASS)
    .build(),
  [TrainerType.NESSA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("NESSA", TrainerGender.FEMALE, "galar", ElementalType.WATER)
    .build(),
  [TrainerType.KABU]: new TrainerConfigBuilder()
    .withGymLeaderConfig("KABU", TrainerGender.MALE, "galar", ElementalType.FIRE)
    .build(),
  [TrainerType.BEA]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BEA", TrainerGender.FEMALE, "galar", ElementalType.FIGHTING)
    .build(),
  [TrainerType.ALLISTER]: new TrainerConfigBuilder()
    .withGymLeaderConfig("ALLISTER", TrainerGender.MALE, "galar", ElementalType.GHOST)
    .build(),
  [TrainerType.OPAL]: new TrainerConfigBuilder()
    .withGymLeaderConfig("OPAL", TrainerGender.FEMALE, "galar", ElementalType.FAIRY)
    .build(),
  [TrainerType.BEDE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("BEDE", TrainerGender.MALE, "galar", ElementalType.FAIRY)
    .build(),
  [TrainerType.GORDIE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("GORDIE", TrainerGender.MALE, "galar", ElementalType.ROCK)
    .build(),
  [TrainerType.MELONY]: new TrainerConfigBuilder()
    .withGymLeaderConfig("MELONY", TrainerGender.FEMALE, "galar", ElementalType.ICE)
    .build(),
  // TODO: Add double "PIERS_MARNIE" config
  [TrainerType.PIERS]: new TrainerConfigBuilder()
    .withGymLeaderConfig("PIERS", TrainerGender.MALE, "galar", ElementalType.DARK)
    .build(),
  [TrainerType.MARNIE]: new TrainerConfigBuilder()
    .withGymLeaderConfig("MARNIE", TrainerGender.FEMALE, "galar", ElementalType.DARK)
    .build(),
  [TrainerType.RAIHAN]: new TrainerConfigBuilder()
    .withGymLeaderConfig("RAIHAN", TrainerGender.MALE, "galar", ElementalType.DRAGON)
    .build(),
  [TrainerType.KATY]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("KATY", TrainerGender.FEMALE, ElementalType.BUG)
    .build(),
  [TrainerType.BRASSIUS]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("BRASSIUS", TrainerGender.MALE, ElementalType.GRASS)
    .build(),
  [TrainerType.IONO]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("IONO", TrainerGender.FEMALE, ElementalType.ELECTRIC)
    .build(),
  [TrainerType.KOFU]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("KOFU", TrainerGender.MALE, ElementalType.WATER)
    .build(),
  [TrainerType.LARRY]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("LARRY", TrainerGender.MALE, ElementalType.NORMAL)
    .build(),
  [TrainerType.RYME]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("RYME", TrainerGender.FEMALE, ElementalType.GHOST)
    .build(),
  [TrainerType.TULIP]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("TULIP", TrainerGender.FEMALE, ElementalType.PSYCHIC)
    .build(),
  [TrainerType.GRUSHA]: new TrainerConfigBuilder()
    .withPaldeaGymLeaderConfig("GRUSHA", TrainerGender.MALE, ElementalType.ICE)
    .build(),
};

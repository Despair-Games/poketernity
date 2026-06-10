import { gymLeaderSignatureSpecies } from "#data/signature-species";
import { ElementalType } from "#enums/elemental-type";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import type { TrainerConfigs } from "#trainers/trainer-config";
import { TrainerConfig } from "#trainers/trainer-config";
import { TrainerConfigBuilder } from "#trainers/trainer-config-builder";

export const gymLeaderTrainerConfigs: TrainerConfigs = {
  [TrainerType.BROCK]: new TrainerConfig(TrainerType.BROCK)
    .initForGymLeader(gymLeaderSignatureSpecies["BROCK"], true, ElementalType.ROCK)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.MISTY]: new TrainerConfig(TrainerType.MISTY)
    .initForGymLeader(gymLeaderSignatureSpecies["MISTY"], false, ElementalType.WATER)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.LT_SURGE]: new TrainerConfig(TrainerType.LT_SURGE)
    .initForGymLeader(gymLeaderSignatureSpecies["LT_SURGE"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.ERIKA]: new TrainerConfig(TrainerType.ERIKA)
    .initForGymLeader(gymLeaderSignatureSpecies["ERIKA"], false, ElementalType.GRASS)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.JANINE]: new TrainerConfig(TrainerType.JANINE)
    .initForGymLeader(gymLeaderSignatureSpecies["JANINE"], false, ElementalType.POISON)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.SABRINA]: new TrainerConfig(TrainerType.SABRINA)
    .initForGymLeader(gymLeaderSignatureSpecies["SABRINA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.BLAINE]: new TrainerConfig(TrainerType.BLAINE)
    .initForGymLeader(gymLeaderSignatureSpecies["BLAINE"], true, ElementalType.FIRE)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.GIOVANNI]: new TrainerConfig(TrainerType.GIOVANNI)
    .initForGymLeader(gymLeaderSignatureSpecies["GIOVANNI"], true, ElementalType.GROUND)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.FALKNER]: new TrainerConfig(TrainerType.FALKNER)
    .initForGymLeader(gymLeaderSignatureSpecies["FALKNER"], true, ElementalType.FLYING)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.BUGSY]: new TrainerConfig(TrainerType.BUGSY)
    .initForGymLeader(gymLeaderSignatureSpecies["BUGSY"], true, ElementalType.BUG)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.WHITNEY]: new TrainerConfig(TrainerType.WHITNEY)
    .initForGymLeader(gymLeaderSignatureSpecies["WHITNEY"], false, ElementalType.NORMAL)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.MORTY]: new TrainerConfig(TrainerType.MORTY)
    .initForGymLeader(gymLeaderSignatureSpecies["MORTY"], true, ElementalType.GHOST)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.CHUCK]: new TrainerConfig(TrainerType.CHUCK)
    .initForGymLeader(gymLeaderSignatureSpecies["CHUCK"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.JASMINE]: new TrainerConfig(TrainerType.JASMINE)
    .initForGymLeader(gymLeaderSignatureSpecies["JASMINE"], false, ElementalType.STEEL)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.PRYCE]: new TrainerConfig(TrainerType.PRYCE)
    .initForGymLeader(gymLeaderSignatureSpecies["PRYCE"], true, ElementalType.ICE)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.CLAIR]: new TrainerConfig(TrainerType.CLAIR)
    .initForGymLeader(gymLeaderSignatureSpecies["CLAIR"], false, ElementalType.DRAGON)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.ROXANNE]: new TrainerConfig(TrainerType.ROXANNE)
    .initForGymLeader(gymLeaderSignatureSpecies["ROXANNE"], false, ElementalType.ROCK)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.BRAWLY]: new TrainerConfig(TrainerType.BRAWLY)
    .initForGymLeader(gymLeaderSignatureSpecies["BRAWLY"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.WATTSON]: new TrainerConfig(TrainerType.WATTSON)
    .initForGymLeader(gymLeaderSignatureSpecies["WATTSON"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.FLANNERY]: new TrainerConfig(TrainerType.FLANNERY)
    .initForGymLeader(gymLeaderSignatureSpecies["FLANNERY"], false, ElementalType.FIRE)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.NORMAN]: new TrainerConfig(TrainerType.NORMAN)
    .initForGymLeader(gymLeaderSignatureSpecies["NORMAN"], true, ElementalType.NORMAL)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.WINONA]: new TrainerConfig(TrainerType.WINONA)
    .initForGymLeader(gymLeaderSignatureSpecies["WINONA"], false, ElementalType.FLYING)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.TATE]: new TrainerConfig(TrainerType.TATE)
    .initForGymLeader(gymLeaderSignatureSpecies["TATE"], true, ElementalType.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setHasDouble("tate_liza_double")
    .setDoubleTrainerType(TrainerType.LIZA)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.LIZA]: new TrainerConfig(TrainerType.LIZA)
    .initForGymLeader(gymLeaderSignatureSpecies["LIZA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setHasDouble("liza_tate_double")
    .setDoubleTrainerType(TrainerType.TATE)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.JUAN]: new TrainerConfig(TrainerType.JUAN)
    .initForGymLeader(gymLeaderSignatureSpecies["JUAN"], true, ElementalType.WATER)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.ROARK]: new TrainerConfig(TrainerType.ROARK)
    .initForGymLeader(gymLeaderSignatureSpecies["ROARK"], true, ElementalType.ROCK)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.GARDENIA]: new TrainerConfig(TrainerType.GARDENIA)
    .initForGymLeader(gymLeaderSignatureSpecies["GARDENIA"], false, ElementalType.GRASS)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.MAYLENE]: new TrainerConfig(TrainerType.MAYLENE)
    .initForGymLeader(gymLeaderSignatureSpecies["MAYLENE"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CRASHER_WAKE]: new TrainerConfig(TrainerType.CRASHER_WAKE)
    .initForGymLeader(gymLeaderSignatureSpecies["CRASHER_WAKE"], true, ElementalType.WATER)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FANTINA]: new TrainerConfig(TrainerType.FANTINA)
    .initForGymLeader(gymLeaderSignatureSpecies["FANTINA"], false, ElementalType.GHOST)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BYRON]: new TrainerConfig(TrainerType.BYRON)
    .initForGymLeader(gymLeaderSignatureSpecies["BYRON"], true, ElementalType.STEEL)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CANDICE]: new TrainerConfig(TrainerType.CANDICE)
    .initForGymLeader(gymLeaderSignatureSpecies["CANDICE"], false, ElementalType.ICE)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.VOLKNER]: new TrainerConfig(TrainerType.VOLKNER)
    .initForGymLeader(gymLeaderSignatureSpecies["VOLKNER"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CILAN]: new TrainerConfig(TrainerType.CILAN)
    .initForGymLeader(gymLeaderSignatureSpecies["CILAN"], true, ElementalType.GRASS)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CHILI]: new TrainerConfig(TrainerType.CHILI)
    .initForGymLeader(gymLeaderSignatureSpecies["CHILI"], true, ElementalType.FIRE)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CRESS]: new TrainerConfig(TrainerType.CRESS)
    .initForGymLeader(gymLeaderSignatureSpecies["CRESS"], true, ElementalType.WATER)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CHEREN]: new TrainerConfig(TrainerType.CHEREN)
    .initForGymLeader(gymLeaderSignatureSpecies["CHEREN"], true, ElementalType.NORMAL)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.LENORA]: new TrainerConfig(TrainerType.LENORA)
    .initForGymLeader(gymLeaderSignatureSpecies["LENORA"], false, ElementalType.NORMAL)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.ROXIE]: new TrainerConfig(TrainerType.ROXIE)
    .initForGymLeader(gymLeaderSignatureSpecies["ROXIE"], false, ElementalType.POISON)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.BURGH]: new TrainerConfig(TrainerType.BURGH)
    .initForGymLeader(gymLeaderSignatureSpecies["BURGH"], true, ElementalType.BUG)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.ELESA]: new TrainerConfig(TrainerType.ELESA)
    .initForGymLeader(gymLeaderSignatureSpecies["ELESA"], false, ElementalType.ELECTRIC)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CLAY]: new TrainerConfig(TrainerType.CLAY)
    .initForGymLeader(gymLeaderSignatureSpecies["CLAY"], true, ElementalType.GROUND)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.SKYLA]: new TrainerConfig(TrainerType.SKYLA)
    .initForGymLeader(gymLeaderSignatureSpecies["SKYLA"], false, ElementalType.FLYING)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.BRYCEN]: new TrainerConfig(TrainerType.BRYCEN)
    .initForGymLeader(gymLeaderSignatureSpecies["BRYCEN"], true, ElementalType.ICE)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.DRAYDEN]: new TrainerConfig(TrainerType.DRAYDEN)
    .initForGymLeader(gymLeaderSignatureSpecies["DRAYDEN"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.MARLON]: new TrainerConfig(TrainerType.MARLON)
    .initForGymLeader(gymLeaderSignatureSpecies["MARLON"], true, ElementalType.WATER)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.VIOLA]: new TrainerConfig(TrainerType.VIOLA)
    .initForGymLeader(gymLeaderSignatureSpecies["VIOLA"], false, ElementalType.BUG)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.GRANT]: new TrainerConfig(TrainerType.GRANT)
    .initForGymLeader(gymLeaderSignatureSpecies["GRANT"], true, ElementalType.ROCK)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.KORRINA]: new TrainerConfig(TrainerType.KORRINA)
    .initForGymLeader(gymLeaderSignatureSpecies["KORRINA"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.RAMOS]: new TrainerConfig(TrainerType.RAMOS)
    .initForGymLeader(gymLeaderSignatureSpecies["RAMOS"], true, ElementalType.GRASS)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.CLEMONT]: new TrainerConfig(TrainerType.CLEMONT)
    .initForGymLeader(gymLeaderSignatureSpecies["CLEMONT"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.VALERIE]: new TrainerConfig(TrainerType.VALERIE)
    .initForGymLeader(gymLeaderSignatureSpecies["VALERIE"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.OLYMPIA]: new TrainerConfig(TrainerType.OLYMPIA)
    .initForGymLeader(gymLeaderSignatureSpecies["OLYMPIA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.WULFRIC]: new TrainerConfig(TrainerType.WULFRIC)
    .initForGymLeader(gymLeaderSignatureSpecies["WULFRIC"], true, ElementalType.ICE)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.MILO]: new TrainerConfig(TrainerType.MILO)
    .initForGymLeader(gymLeaderSignatureSpecies["MILO"], true, ElementalType.GRASS)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.NESSA]: new TrainerConfig(TrainerType.NESSA)
    .setName("Nessa")
    .initForGymLeader(gymLeaderSignatureSpecies["NESSA"], false, ElementalType.WATER)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.KABU]: new TrainerConfig(TrainerType.KABU)
    .initForGymLeader(gymLeaderSignatureSpecies["KABU"], true, ElementalType.FIRE)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.BEA]: new TrainerConfig(TrainerType.BEA)
    .setName("Bea")
    .initForGymLeader(gymLeaderSignatureSpecies["BEA"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.ALLISTER]: new TrainerConfig(TrainerType.ALLISTER)
    .setName("Allister")
    .initForGymLeader(gymLeaderSignatureSpecies["ALLISTER"], true, ElementalType.GHOST)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.OPAL]: new TrainerConfig(TrainerType.OPAL)
    .initForGymLeader(gymLeaderSignatureSpecies["OPAL"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.BEDE]: new TrainerConfig(TrainerType.BEDE)
    .initForGymLeader(gymLeaderSignatureSpecies["BEDE"], true, ElementalType.FAIRY)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.GORDIE]: new TrainerConfig(TrainerType.GORDIE)
    .initForGymLeader(gymLeaderSignatureSpecies["GORDIE"], true, ElementalType.ROCK)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.MELONY]: new TrainerConfig(TrainerType.MELONY)
    .initForGymLeader(gymLeaderSignatureSpecies["MELONY"], false, ElementalType.ICE)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.PIERS]: new TrainerConfig(TrainerType.PIERS)
    .initForGymLeader(gymLeaderSignatureSpecies["PIERS"], true, ElementalType.DARK)
    .setHasDouble("piers_marnie_double")
    .setDoubleTrainerType(TrainerType.MARNIE)
    .setDoubleTitle("gym_leader_double")
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.MARNIE]: new TrainerConfig(TrainerType.MARNIE)
    .setName("Marnie")
    .initForGymLeader(gymLeaderSignatureSpecies["MARNIE"], false, ElementalType.DARK)
    .setHasDouble("marnie_piers_double")
    .setDoubleTrainerType(TrainerType.PIERS)
    .setDoubleTitle("gym_leader_double")
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.RAIHAN]: new TrainerConfig(TrainerType.RAIHAN)
    .setName("Raihan")
    .initForGymLeader(gymLeaderSignatureSpecies["RAIHAN"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.KATY]: new TrainerConfig(TrainerType.KATY).initForPaldeaGymLeader(
    gymLeaderSignatureSpecies["KATY"],
    false,
    ElementalType.BUG,
  ),
  [TrainerType.BRASSIUS]: new TrainerConfig(TrainerType.BRASSIUS).initForPaldeaGymLeader(
    gymLeaderSignatureSpecies["BRASSIUS"],
    true,
    ElementalType.GRASS,
  ),
  [TrainerType.IONO]: new TrainerConfig(TrainerType.IONO).initForPaldeaGymLeader(
    gymLeaderSignatureSpecies["IONO"],
    false,
    ElementalType.ELECTRIC,
  ),
  [TrainerType.KOFU]: new TrainerConfig(TrainerType.KOFU).initForPaldeaGymLeader(
    gymLeaderSignatureSpecies["KOFU"],
    true,
    ElementalType.WATER,
  ),
  [TrainerType.LARRY]: new TrainerConfig(TrainerType.LARRY)
    .setName("Larry")
    .initForPaldeaGymLeader(gymLeaderSignatureSpecies["LARRY"], true, ElementalType.NORMAL),
  [TrainerType.RYME]: new TrainerConfig(TrainerType.RYME).initForPaldeaGymLeader(
    gymLeaderSignatureSpecies["RYME"],
    false,
    ElementalType.GHOST,
  ),
  [TrainerType.TULIP]: new TrainerConfig(TrainerType.TULIP).initForPaldeaGymLeader(
    gymLeaderSignatureSpecies["TULIP"],
    false,
    ElementalType.PSYCHIC,
  ),
  [TrainerType.GRUSHA]: new TrainerConfig(TrainerType.GRUSHA).initForPaldeaGymLeader(
    gymLeaderSignatureSpecies["GRUSHA"],
    true,
    ElementalType.ICE,
  ),
};

export const newGymLeaderTrainerConfigs: TrainerConfigMap = {
  [TrainerType.BROCK]: new TrainerConfigBuilder(TrainerType.BROCK)
    .withGymLeaderConfig("BROCK", TrainerGender.MALE, "kanto", ElementalType.ROCK)
    .build(),
  [TrainerType.MISTY]: new TrainerConfigBuilder(TrainerType.MISTY)
    .withGymLeaderConfig("MISTY", TrainerGender.FEMALE, "kanto", ElementalType.WATER)
    .build(),
  [TrainerType.LT_SURGE]: new TrainerConfigBuilder(TrainerType.LT_SURGE)
    .withGymLeaderConfig("LT_SURGE", TrainerGender.MALE, "kanto", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.ERIKA]: new TrainerConfigBuilder(TrainerType.ERIKA)
    .withGymLeaderConfig("ERIKA", TrainerGender.FEMALE, "kanto", ElementalType.GRASS)
    .build(),
  [TrainerType.JANINE]: new TrainerConfigBuilder(TrainerType.JANINE)
    .withGymLeaderConfig("JANINE", TrainerGender.FEMALE, "kanto", ElementalType.POISON)
    .build(),
  [TrainerType.SABRINA]: new TrainerConfigBuilder(TrainerType.SABRINA)
    .withGymLeaderConfig("SABRINA", TrainerGender.FEMALE, "kanto", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.BLAINE]: new TrainerConfigBuilder(TrainerType.BLAINE)
    .withGymLeaderConfig("BLAINE", TrainerGender.MALE, "kanto", ElementalType.FIRE)
    .build(),
  [TrainerType.GIOVANNI]: new TrainerConfigBuilder(TrainerType.GIOVANNI)
    .withGymLeaderConfig("GIOVANNI", TrainerGender.MALE, "kanto", ElementalType.GROUND)
    .build(),
  [TrainerType.FALKNER]: new TrainerConfigBuilder(TrainerType.FALKNER)
    .withGymLeaderConfig("FALKNER", TrainerGender.MALE, "johto", ElementalType.FLYING)
    .build(),
  [TrainerType.BUGSY]: new TrainerConfigBuilder(TrainerType.BUGSY)
    .withGymLeaderConfig("BUGSY", TrainerGender.MALE, "johto", ElementalType.BUG)
    .build(),
  [TrainerType.WHITNEY]: new TrainerConfigBuilder(TrainerType.WHITNEY)
    .withGymLeaderConfig("WHITNEY", TrainerGender.FEMALE, "johto", ElementalType.NORMAL)
    .build(),
  [TrainerType.MORTY]: new TrainerConfigBuilder(TrainerType.MORTY)
    .withGymLeaderConfig("MORTY", TrainerGender.MALE, "johto", ElementalType.GHOST)
    .build(),
  [TrainerType.CHUCK]: new TrainerConfigBuilder(TrainerType.CHUCK)
    .withGymLeaderConfig("CHUCK", TrainerGender.MALE, "johto", ElementalType.FIGHTING)
    .build(),
  [TrainerType.JASMINE]: new TrainerConfigBuilder(TrainerType.JASMINE)
    .withGymLeaderConfig("JASMINE", TrainerGender.FEMALE, "johto", ElementalType.STEEL)
    .build(),
  [TrainerType.PRYCE]: new TrainerConfigBuilder(TrainerType.PRYCE)
    .withGymLeaderConfig("PRYCE", TrainerGender.MALE, "johto", ElementalType.ICE)
    .build(),
  [TrainerType.CLAIR]: new TrainerConfigBuilder(TrainerType.CLAIR)
    .withGymLeaderConfig("CLAIR", TrainerGender.FEMALE, "johto", ElementalType.DRAGON)
    .build(),
  [TrainerType.ROXANNE]: new TrainerConfigBuilder(TrainerType.ROXANNE)
    .withGymLeaderConfig("ROXANNE", TrainerGender.FEMALE, "hoenn", ElementalType.ROCK)
    .build(),
  [TrainerType.BRAWLY]: new TrainerConfigBuilder(TrainerType.BRAWLY)
    .withGymLeaderConfig("BRAWLY", TrainerGender.MALE, "hoenn", ElementalType.FIGHTING)
    .build(),
  [TrainerType.WATTSON]: new TrainerConfigBuilder(TrainerType.WATTSON)
    .withGymLeaderConfig("WATTSON", TrainerGender.MALE, "hoenn", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.FLANNERY]: new TrainerConfigBuilder(TrainerType.FLANNERY)
    .withGymLeaderConfig("FLANNERY", TrainerGender.FEMALE, "hoenn", ElementalType.FIRE)
    .build(),
  [TrainerType.NORMAN]: new TrainerConfigBuilder(TrainerType.NORMAN)
    .withGymLeaderConfig("NORMAN", TrainerGender.MALE, "hoenn", ElementalType.NORMAL)
    .build(),
  [TrainerType.WINONA]: new TrainerConfigBuilder(TrainerType.WINONA)
    .withGymLeaderConfig("WINONA", TrainerGender.FEMALE, "hoenn", ElementalType.FLYING)
    .build(),
  // TODO: Create double "TATE_LIZA" config
  [TrainerType.TATE]: new TrainerConfigBuilder(TrainerType.TATE)
    .withGymLeaderConfig("TATE", TrainerGender.MALE, "hoenn", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.LIZA]: new TrainerConfigBuilder(TrainerType.LIZA)
    .withGymLeaderConfig("LIZA", TrainerGender.FEMALE, "hoenn", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.JUAN]: new TrainerConfigBuilder(TrainerType.JUAN)
    .withGymLeaderConfig("JUAN", TrainerGender.MALE, "hoenn", ElementalType.WATER)
    .build(),
  [TrainerType.ROARK]: new TrainerConfigBuilder(TrainerType.ROARK)
    .withGymLeaderConfig("ROARK", TrainerGender.MALE, "sinnoh", ElementalType.ROCK)
    .build(),
  [TrainerType.GARDENIA]: new TrainerConfigBuilder(TrainerType.GARDENIA)
    .withGymLeaderConfig("GARDENIA", TrainerGender.FEMALE, "sinnoh", ElementalType.GRASS)
    .build(),
  [TrainerType.MAYLENE]: new TrainerConfigBuilder(TrainerType.MAYLENE)
    .withGymLeaderConfig("MAYLENE", TrainerGender.FEMALE, "sinnoh", ElementalType.FIGHTING)
    .build(),
  [TrainerType.CRASHER_WAKE]: new TrainerConfigBuilder(TrainerType.CRASHER_WAKE)
    .withGymLeaderConfig("CRASHER_WAKE", TrainerGender.MALE, "sinnoh", ElementalType.WATER)
    .build(),
  [TrainerType.FANTINA]: new TrainerConfigBuilder(TrainerType.FANTINA)
    .withGymLeaderConfig("FANTINA", TrainerGender.FEMALE, "sinnoh", ElementalType.GHOST)
    .build(),
  [TrainerType.BYRON]: new TrainerConfigBuilder(TrainerType.BYRON)
    .withGymLeaderConfig("BYRON", TrainerGender.MALE, "sinnoh", ElementalType.STEEL)
    .build(),
  [TrainerType.CANDICE]: new TrainerConfigBuilder(TrainerType.CANDICE)
    .withGymLeaderConfig("CANDICE", TrainerGender.FEMALE, "sinnoh", ElementalType.ICE)
    .build(),
  [TrainerType.VOLKNER]: new TrainerConfigBuilder(TrainerType.VOLKNER)
    .withGymLeaderConfig("VOLKNER", TrainerGender.MALE, "sinnoh", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.CILAN]: new TrainerConfigBuilder(TrainerType.CILAN)
    .withGymLeaderConfig("CILAN", TrainerGender.MALE, "unova", ElementalType.GRASS)
    .build(),
  [TrainerType.CHILI]: new TrainerConfigBuilder(TrainerType.CHILI)
    .withGymLeaderConfig("CHILI", TrainerGender.MALE, "unova", ElementalType.FIRE)
    .build(),
  [TrainerType.CRESS]: new TrainerConfigBuilder(TrainerType.CRESS)
    .withGymLeaderConfig("CRESS", TrainerGender.MALE, "unova", ElementalType.WATER)
    .build(),
  [TrainerType.CHEREN]: new TrainerConfigBuilder(TrainerType.CHEREN)
    .withGymLeaderConfig("CHEREN", TrainerGender.MALE, "unova", ElementalType.NORMAL)
    .build(),
  [TrainerType.LENORA]: new TrainerConfigBuilder(TrainerType.LENORA)
    .withGymLeaderConfig("LENORA", TrainerGender.FEMALE, "unova", ElementalType.NORMAL)
    .build(),
  [TrainerType.ROXIE]: new TrainerConfigBuilder(TrainerType.ROXIE)
    .withGymLeaderConfig("ROXIE", TrainerGender.FEMALE, "unova", ElementalType.POISON)
    .build(),
  [TrainerType.BURGH]: new TrainerConfigBuilder(TrainerType.BURGH)
    .withGymLeaderConfig("BURGH", TrainerGender.MALE, "unova", ElementalType.BUG)
    .build(),
  [TrainerType.ELESA]: new TrainerConfigBuilder(TrainerType.ELESA)
    .withGymLeaderConfig("ELESA", TrainerGender.FEMALE, "unova", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.CLAY]: new TrainerConfigBuilder(TrainerType.CLAY)
    .withGymLeaderConfig("CLAY", TrainerGender.MALE, "unova", ElementalType.GROUND)
    .build(),
  [TrainerType.SKYLA]: new TrainerConfigBuilder(TrainerType.SKYLA)
    .withGymLeaderConfig("SKYLA", TrainerGender.FEMALE, "unova", ElementalType.FLYING)
    .build(),
  [TrainerType.BRYCEN]: new TrainerConfigBuilder(TrainerType.BRYCEN)
    .withGymLeaderConfig("BRYCEN", TrainerGender.MALE, "unova", ElementalType.ICE)
    .build(),
  [TrainerType.DRAYDEN]: new TrainerConfigBuilder(TrainerType.DRAYDEN)
    .withGymLeaderConfig("DRAYDEN", TrainerGender.MALE, "unova", ElementalType.DRAGON)
    .build(),
  [TrainerType.MARLON]: new TrainerConfigBuilder(TrainerType.MARLON)
    .withGymLeaderConfig("MARLON", TrainerGender.MALE, "unova", ElementalType.WATER)
    .build(),
  [TrainerType.VIOLA]: new TrainerConfigBuilder(TrainerType.VIOLA)
    .withGymLeaderConfig("VIOLA", TrainerGender.FEMALE, "kalos", ElementalType.BUG)
    .build(),
  [TrainerType.GRANT]: new TrainerConfigBuilder(TrainerType.GRANT)
    .withGymLeaderConfig("GRANT", TrainerGender.MALE, "kalos", ElementalType.ROCK)
    .build(),
  [TrainerType.KORRINA]: new TrainerConfigBuilder(TrainerType.KORRINA)
    .withGymLeaderConfig("KORRINA", TrainerGender.FEMALE, "kalos", ElementalType.FIGHTING)
    .build(),
  [TrainerType.RAMOS]: new TrainerConfigBuilder(TrainerType.RAMOS)
    .withGymLeaderConfig("RAMOS", TrainerGender.MALE, "kalos", ElementalType.GRASS)
    .build(),
  [TrainerType.CLEMONT]: new TrainerConfigBuilder(TrainerType.CLEMONT)
    .withGymLeaderConfig("CLEMONT", TrainerGender.MALE, "kalos", ElementalType.ELECTRIC)
    .build(),
  [TrainerType.VALERIE]: new TrainerConfigBuilder(TrainerType.VALERIE)
    .withGymLeaderConfig("VALERIE", TrainerGender.FEMALE, "kalos", ElementalType.FAIRY)
    .build(),
  [TrainerType.OLYMPIA]: new TrainerConfigBuilder(TrainerType.OLYMPIA)
    .withGymLeaderConfig("OLYMPIA", TrainerGender.FEMALE, "kalos", ElementalType.PSYCHIC)
    .build(),
  [TrainerType.WULFRIC]: new TrainerConfigBuilder(TrainerType.WULFRIC)
    .withGymLeaderConfig("WULFRIC", TrainerGender.MALE, "kalos", ElementalType.ICE)
    .build(),
  [TrainerType.MILO]: new TrainerConfigBuilder(TrainerType.MILO)
    .withGymLeaderConfig("MILO", TrainerGender.MALE, "galar", ElementalType.GRASS)
    .build(),
  [TrainerType.NESSA]: new TrainerConfigBuilder(TrainerType.NESSA)
    .withGymLeaderConfig("NESSA", TrainerGender.FEMALE, "galar", ElementalType.WATER)
    .build(),
  [TrainerType.KABU]: new TrainerConfigBuilder(TrainerType.KABU)
    .withGymLeaderConfig("KABU", TrainerGender.MALE, "galar", ElementalType.FIRE)
    .build(),
  [TrainerType.BEA]: new TrainerConfigBuilder(TrainerType.BEA)
    .withGymLeaderConfig("BEA", TrainerGender.FEMALE, "galar", ElementalType.FIGHTING)
    .build(),
  [TrainerType.ALLISTER]: new TrainerConfigBuilder(TrainerType.ALLISTER)
    .withGymLeaderConfig("ALLISTER", TrainerGender.MALE, "galar", ElementalType.GHOST)
    .build(),
  [TrainerType.OPAL]: new TrainerConfigBuilder(TrainerType.OPAL)
    .withGymLeaderConfig("OPAL", TrainerGender.FEMALE, "galar", ElementalType.FAIRY)
    .build(),
  [TrainerType.BEDE]: new TrainerConfigBuilder(TrainerType.BEDE)
    .withGymLeaderConfig("BEDE", TrainerGender.MALE, "galar", ElementalType.FAIRY)
    .build(),
  [TrainerType.GORDIE]: new TrainerConfigBuilder(TrainerType.GORDIE)
    .withGymLeaderConfig("GORDIE", TrainerGender.MALE, "galar", ElementalType.ROCK)
    .build(),
  [TrainerType.MELONY]: new TrainerConfigBuilder(TrainerType.MELONY)
    .withGymLeaderConfig("MELONY", TrainerGender.FEMALE, "galar", ElementalType.ICE)
    .build(),
  // TODO: Add double "PIERS_MARNIE" config
  [TrainerType.PIERS]: new TrainerConfigBuilder(TrainerType.PIERS)
    .withGymLeaderConfig("PIERS", TrainerGender.MALE, "galar", ElementalType.DARK)
    .build(),
  [TrainerType.MARNIE]: new TrainerConfigBuilder(TrainerType.MARNIE)
    .withGymLeaderConfig("MARNIE", TrainerGender.FEMALE, "galar", ElementalType.DARK)
    .build(),
  [TrainerType.RAIHAN]: new TrainerConfigBuilder(TrainerType.RAIHAN)
    .withGymLeaderConfig("RAIHAN", TrainerGender.MALE, "galar", ElementalType.DRAGON)
    .build(),
  [TrainerType.KATY]: new TrainerConfigBuilder(TrainerType.KATY)
    .withPaldeaGymLeaderConfig("KATY", TrainerGender.FEMALE, ElementalType.BUG)
    .build(),
  [TrainerType.BRASSIUS]: new TrainerConfigBuilder(TrainerType.BRASSIUS)
    .withPaldeaGymLeaderConfig("BRASSIUS", TrainerGender.MALE, ElementalType.GRASS)
    .build(),
  [TrainerType.IONO]: new TrainerConfigBuilder(TrainerType.IONO)
    .withPaldeaGymLeaderConfig("IONO", TrainerGender.FEMALE, ElementalType.ELECTRIC)
    .build(),
  [TrainerType.KOFU]: new TrainerConfigBuilder(TrainerType.KOFU)
    .withPaldeaGymLeaderConfig("KOFU", TrainerGender.MALE, ElementalType.WATER)
    .build(),
  [TrainerType.LARRY]: new TrainerConfigBuilder(TrainerType.LARRY)
    .withPaldeaGymLeaderConfig("LARRY", TrainerGender.MALE, ElementalType.NORMAL)
    .build(),
  [TrainerType.RYME]: new TrainerConfigBuilder(TrainerType.RYME)
    .withPaldeaGymLeaderConfig("RYME", TrainerGender.FEMALE, ElementalType.GHOST)
    .build(),
  [TrainerType.TULIP]: new TrainerConfigBuilder(TrainerType.TULIP)
    .withPaldeaGymLeaderConfig("TULIP", TrainerGender.FEMALE, ElementalType.PSYCHIC)
    .build(),
  [TrainerType.GRUSHA]: new TrainerConfigBuilder(TrainerType.GRUSHA)
    .withPaldeaGymLeaderConfig("GRUSHA", TrainerGender.MALE, ElementalType.ICE)
    .build(),
};

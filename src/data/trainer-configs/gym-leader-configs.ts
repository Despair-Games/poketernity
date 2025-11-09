import { signatureSpecies } from "#data/signature-species";
import type { TrainerConfigs } from "#data/trainer-config";
import { TrainerConfig } from "#data/trainer-config";
import { ElementalType } from "#enums/elemental-type";
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

import { TrainerConfig, TrainerConfigs } from "#app/data/trainer-config";
import { Type } from "#app/enums/type";
import { TrainerType } from "#enums/trainer-type";
import { signatureSpecies } from "./signature-species";

let t = TrainerType.BROCK;
export const gymLeaderTrainerConfigs: TrainerConfigs = {
  // Kanto
  [TrainerType.BROCK]: new TrainerConfig(t)
    .initForGymLeader(signatureSpecies["BROCK"], true, Type.ROCK)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.MISTY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MISTY"], false, Type.WATER)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.LT_SURGE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["LT_SURGE"], true, Type.ELECTRIC)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.ERIKA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ERIKA"], false, Type.GRASS)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.JANINE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["JANINE"], false, Type.POISON)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.SABRINA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["SABRINA"], false, Type.PSYCHIC)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.BLAINE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BLAINE"], true, Type.FIRE)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.GIOVANNI]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GIOVANNI"], true, Type.DARK)
    .setBattleBgm("battle_kanto_gym")
    .setMixedBattleBgm("battle_kanto_gym"),

  // Johto
  [TrainerType.FALKNER]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["FALKNER"], true, Type.FLYING)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.BUGSY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BUGSY"], true, Type.BUG)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.WHITNEY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WHITNEY"], false, Type.NORMAL)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.MORTY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MORTY"], true, Type.GHOST)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.CHUCK]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CHUCK"], true, Type.FIGHTING)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.JASMINE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["JASMINE"], false, Type.STEEL)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.PRYCE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["PRYCE"], true, Type.ICE)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),
  [TrainerType.CLAIR]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CLAIR"], false, Type.DRAGON)
    .setBattleBgm("battle_johto_gym")
    .setMixedBattleBgm("battle_johto_gym"),

  //Hoenn
  [TrainerType.ROXANNE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ROXANNE"], false, Type.ROCK)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym"),
  [TrainerType.BRAWLY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BRAWLY"], true, Type.FIGHTING)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym"),
  [TrainerType.WATTSON]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WATTSON"], true, Type.ELECTRIC)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym"),
  [TrainerType.FLANNERY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["FLANNERY"], false, Type.FIRE)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym"),
  [TrainerType.NORMAN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["NORMAN"], true, Type.NORMAL)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym"),
  [TrainerType.WINONA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WINONA"], false, Type.FLYING)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym"),
  [TrainerType.TATE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["TATE"], true, Type.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym")
    .setHasDouble("tate_liza_double")
    .setDoubleTrainerType(TrainerType.LIZA)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.LIZA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["LIZA"], false, Type.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym")
    .setHasDouble("liza_tate_double")
    .setDoubleTrainerType(TrainerType.TATE)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.JUAN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["JUAN"], true, Type.WATER)
    .setBattleBgm("battle_hoenn_gym")
    .setMixedBattleBgm("battle_hoenn_gym"),

  // Sinnoh
  [TrainerType.ROARK]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ROARK"], true, Type.ROCK)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.GARDENIA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GARDENIA"], false, Type.GRASS)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.MAYLENE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MAYLENE"], false, Type.FIGHTING)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CRASHER_WAKE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CRASHER_WAKE"], true, Type.WATER)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FANTINA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["FANTINA"], false, Type.GHOST)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BYRON]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BYRON"], true, Type.STEEL)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CANDICE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CANDICE"], false, Type.ICE)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),
  [TrainerType.VOLKNER]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["VOLKNER"], true, Type.ELECTRIC)
    .setBattleBgm("battle_sinnoh_gym")
    .setMixedBattleBgm("battle_sinnoh_gym"),

  // Unova
  [TrainerType.CILAN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CILAN"], true, Type.GRASS)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.CHILI]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CHILI"], true, Type.FIRE)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.CRESS]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CRESS"], true, Type.WATER)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.CHEREN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CHEREN"], true, Type.NORMAL)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.LENORA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["LENORA"], false, Type.NORMAL)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.ROXIE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ROXIE"], false, Type.POISON)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.BURGH]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BURGH"], true, Type.BUG)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.ELESA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ELESA"], false, Type.ELECTRIC)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.CLAY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CLAY"], true, Type.GROUND)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.SKYLA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["SKYLA"], false, Type.FLYING)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.BRYCEN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BRYCEN"], true, Type.ICE)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.DRAYDEN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["DRAYDEN"], true, Type.DRAGON)
    .setMixedBattleBgm("battle_unova_gym"),
  [TrainerType.MARLON]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MARLON"], true, Type.WATER)
    .setMixedBattleBgm("battle_unova_gym"),

  // Kalos
  [TrainerType.VIOLA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["VIOLA"], false, Type.BUG)
    .setMixedBattleBgm("battle_kalos_gym"),
  [TrainerType.GRANT]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GRANT"], true, Type.ROCK)
    .setMixedBattleBgm("battle_kalos_gym"),
  [TrainerType.KORRINA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["KORRINA"], false, Type.FIGHTING)
    .setMixedBattleBgm("battle_kalos_gym"),
  [TrainerType.RAMOS]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["RAMOS"], true, Type.GRASS)
    .setMixedBattleBgm("battle_kalos_gym"),
  [TrainerType.CLEMONT]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CLEMONT"], true, Type.ELECTRIC)
    .setMixedBattleBgm("battle_kalos_gym"),
  [TrainerType.VALERIE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["VALERIE"], false, Type.FAIRY)
    .setMixedBattleBgm("battle_kalos_gym"),
  [TrainerType.OLYMPIA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["OLYMPIA"], false, Type.PSYCHIC)
    .setMixedBattleBgm("battle_kalos_gym"),
  [TrainerType.WULFRIC]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WULFRIC"], true, Type.ICE)
    .setMixedBattleBgm("battle_kalos_gym"),

  // Galar
  [TrainerType.MILO]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MILO"], true, Type.GRASS)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.NESSA]: new TrainerConfig(++t)
    .setName("Nessa")
    .initForGymLeader(signatureSpecies["NESSA"], false, Type.WATER)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.KABU]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["KABU"], true, Type.FIRE)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.BEA]: new TrainerConfig(++t)
    .setName("Bea")
    .initForGymLeader(signatureSpecies["BEA"], false, Type.FIGHTING)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.ALLISTER]: new TrainerConfig(++t)
    .setName("Allister")
    .initForGymLeader(signatureSpecies["ALLISTER"], true, Type.GHOST)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.OPAL]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["OPAL"], false, Type.FAIRY)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.BEDE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BEDE"], true, Type.FAIRY)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.GORDIE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GORDIE"], true, Type.ROCK)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.MELONY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MELONY"], false, Type.ICE)
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.PIERS]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["PIERS"], true, Type.DARK)
    .setHasDouble("piers_marnie_double")
    .setDoubleTrainerType(TrainerType.MARNIE)
    .setDoubleTitle("gym_leader_double")
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.MARNIE]: new TrainerConfig(++t)
    .setName("Marnie")
    .initForGymLeader(signatureSpecies["MARNIE"], false, Type.DARK)
    .setHasDouble("marnie_piers_double")
    .setDoubleTrainerType(TrainerType.PIERS)
    .setDoubleTitle("gym_leader_double")
    .setMixedBattleBgm("battle_galar_gym"),
  [TrainerType.RAIHAN]: new TrainerConfig(++t)
    .setName("Raihan")
    .initForGymLeader(signatureSpecies["RAIHAN"], true, Type.DRAGON)
    .setMixedBattleBgm("battle_galar_gym"),

  // Paldea
  [TrainerType.KATY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["KATY"], false, Type.BUG)
    .setMixedBattleBgm("battle_paldea_gym"),
  [TrainerType.BRASSIUS]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BRASSIUS"], true, Type.GRASS)
    .setMixedBattleBgm("battle_paldea_gym"),
  [TrainerType.IONO]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["IONO"], false, Type.ELECTRIC)
    .setMixedBattleBgm("battle_paldea_gym"),
  [TrainerType.KOFU]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["KOFU"], true, Type.WATER)
    .setMixedBattleBgm("battle_paldea_gym"),
  [TrainerType.LARRY]: new TrainerConfig(++t)
    .setName("Larry")
    .initForGymLeader(signatureSpecies["LARRY"], true, Type.NORMAL)
    .setMixedBattleBgm("battle_paldea_gym"),
  [TrainerType.RYME]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["RYME"], false, Type.GHOST)
    .setMixedBattleBgm("battle_paldea_gym"),
  [TrainerType.TULIP]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["TULIP"], false, Type.PSYCHIC)
    .setMixedBattleBgm("battle_paldea_gym"),
  [TrainerType.GRUSHA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GRUSHA"], true, Type.ICE)
    .setMixedBattleBgm("battle_paldea_gym"),
};

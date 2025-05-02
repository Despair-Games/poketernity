import { signatureSpecies } from "#app/data/signatureSpecies";
import type { TrainerConfigs } from "#app/data/trainer-config";
import { TrainerConfig } from "#app/data/trainer-config";
import { TrainerType } from "#enums/trainer-type";
import { ElementalType } from "#enums/elemental-type";

let t = TrainerType.BROCK;
export const gymLeaderTrainerConfigs: TrainerConfigs = {
  [TrainerType.BROCK]: new TrainerConfig(t)
    .initForGymLeader(signatureSpecies["BROCK"], true, ElementalType.ROCK)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.MISTY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MISTY"], false, ElementalType.WATER)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.LT_SURGE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["LT_SURGE"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.ERIKA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ERIKA"], false, ElementalType.GRASS)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.JANINE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["JANINE"], false, ElementalType.POISON)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.SABRINA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["SABRINA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.BLAINE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BLAINE"], true, ElementalType.FIRE)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.GIOVANNI]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GIOVANNI"], true, ElementalType.GROUND)
    .setBattleBgm("battle_kanto_gym"),
  [TrainerType.FALKNER]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["FALKNER"], true, ElementalType.FLYING)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.BUGSY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BUGSY"], true, ElementalType.BUG)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.WHITNEY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WHITNEY"], false, ElementalType.NORMAL)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.MORTY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MORTY"], true, ElementalType.GHOST)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.CHUCK]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CHUCK"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.JASMINE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["JASMINE"], false, ElementalType.STEEL)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.PRYCE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["PRYCE"], true, ElementalType.ICE)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.CLAIR]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CLAIR"], false, ElementalType.DRAGON)
    .setBattleBgm("battle_johto_gym"),
  [TrainerType.ROXANNE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ROXANNE"], false, ElementalType.ROCK)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.BRAWLY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BRAWLY"], true, ElementalType.FIGHTING)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.WATTSON]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WATTSON"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.FLANNERY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["FLANNERY"], false, ElementalType.FIRE)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.NORMAN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["NORMAN"], true, ElementalType.NORMAL)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.WINONA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WINONA"], false, ElementalType.FLYING)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.TATE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["TATE"], true, ElementalType.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setHasDouble("tate_liza_double")
    .setDoubleTrainerType(TrainerType.LIZA)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.LIZA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["LIZA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_hoenn_gym")
    .setHasDouble("liza_tate_double")
    .setDoubleTrainerType(TrainerType.TATE)
    .setDoubleTitle("gym_leader_double"),
  [TrainerType.JUAN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["JUAN"], true, ElementalType.WATER)
    .setBattleBgm("battle_hoenn_gym"),
  [TrainerType.ROARK]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ROARK"], true, ElementalType.ROCK)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.GARDENIA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GARDENIA"], false, ElementalType.GRASS)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.MAYLENE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MAYLENE"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CRASHER_WAKE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CRASHER_WAKE"], true, ElementalType.WATER)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.FANTINA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["FANTINA"], false, ElementalType.GHOST)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.BYRON]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BYRON"], true, ElementalType.STEEL)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CANDICE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CANDICE"], false, ElementalType.ICE)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.VOLKNER]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["VOLKNER"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_sinnoh_gym"),
  [TrainerType.CILAN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CILAN"], true, ElementalType.GRASS)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CHILI]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CHILI"], true, ElementalType.FIRE)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CRESS]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CRESS"], true, ElementalType.WATER)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CHEREN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CHEREN"], true, ElementalType.NORMAL)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.LENORA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["LENORA"], false, ElementalType.NORMAL)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.ROXIE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ROXIE"], false, ElementalType.POISON)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.BURGH]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BURGH"], true, ElementalType.BUG)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.ELESA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["ELESA"], false, ElementalType.ELECTRIC)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.CLAY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CLAY"], true, ElementalType.GROUND)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.SKYLA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["SKYLA"], false, ElementalType.FLYING)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.BRYCEN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BRYCEN"], true, ElementalType.ICE)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.DRAYDEN]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["DRAYDEN"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.MARLON]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MARLON"], true, ElementalType.WATER)
    .setBattleBgm("battle_unova_gym"),
  [TrainerType.VIOLA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["VIOLA"], false, ElementalType.BUG)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.GRANT]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GRANT"], true, ElementalType.ROCK)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.KORRINA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["KORRINA"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.RAMOS]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["RAMOS"], true, ElementalType.GRASS)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.CLEMONT]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["CLEMONT"], true, ElementalType.ELECTRIC)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.VALERIE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["VALERIE"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.OLYMPIA]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["OLYMPIA"], false, ElementalType.PSYCHIC)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.WULFRIC]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["WULFRIC"], true, ElementalType.ICE)
    .setBattleBgm("battle_kalos_gym"),
  [TrainerType.MILO]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MILO"], true, ElementalType.GRASS)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.NESSA]: new TrainerConfig(++t)
    .setName("Nessa")
    .initForGymLeader(signatureSpecies["NESSA"], false, ElementalType.WATER)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.KABU]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["KABU"], true, ElementalType.FIRE)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.BEA]: new TrainerConfig(++t)
    .setName("Bea")
    .initForGymLeader(signatureSpecies["BEA"], false, ElementalType.FIGHTING)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.ALLISTER]: new TrainerConfig(++t)
    .setName("Allister")
    .initForGymLeader(signatureSpecies["ALLISTER"], true, ElementalType.GHOST)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.OPAL]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["OPAL"], false, ElementalType.FAIRY)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.BEDE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["BEDE"], true, ElementalType.FAIRY)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.GORDIE]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["GORDIE"], true, ElementalType.ROCK)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.MELONY]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["MELONY"], false, ElementalType.ICE)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.PIERS]: new TrainerConfig(++t)
    .initForGymLeader(signatureSpecies["PIERS"], true, ElementalType.DARK)
    .setHasDouble("piers_marnie_double")
    .setDoubleTrainerType(TrainerType.MARNIE)
    .setDoubleTitle("gym_leader_double")
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.MARNIE]: new TrainerConfig(++t)
    .setName("Marnie")
    .initForGymLeader(signatureSpecies["MARNIE"], false, ElementalType.DARK)
    .setHasDouble("marnie_piers_double")
    .setDoubleTrainerType(TrainerType.PIERS)
    .setDoubleTitle("gym_leader_double")
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.RAIHAN]: new TrainerConfig(++t)
    .setName("Raihan")
    .initForGymLeader(signatureSpecies["RAIHAN"], true, ElementalType.DRAGON)
    .setBattleBgm("battle_galar_gym"),
  [TrainerType.KATY]: new TrainerConfig(++t).initForPaldeaGymLeader(signatureSpecies["KATY"], false, ElementalType.BUG),
  [TrainerType.BRASSIUS]: new TrainerConfig(++t).initForPaldeaGymLeader(
    signatureSpecies["BRASSIUS"],
    true,
    ElementalType.GRASS,
  ),
  [TrainerType.IONO]: new TrainerConfig(++t).initForPaldeaGymLeader(
    signatureSpecies["IONO"],
    false,
    ElementalType.ELECTRIC,
  ),
  [TrainerType.KOFU]: new TrainerConfig(++t).initForPaldeaGymLeader(
    signatureSpecies["KOFU"],
    true,
    ElementalType.WATER,
  ),
  [TrainerType.LARRY]: new TrainerConfig(++t)
    .setName("Larry")
    .initForPaldeaGymLeader(signatureSpecies["LARRY"], true, ElementalType.NORMAL),
  [TrainerType.RYME]: new TrainerConfig(++t).initForPaldeaGymLeader(
    signatureSpecies["RYME"],
    false,
    ElementalType.GHOST,
  ),
  [TrainerType.TULIP]: new TrainerConfig(++t).initForPaldeaGymLeader(
    signatureSpecies["TULIP"],
    false,
    ElementalType.PSYCHIC,
  ),
  [TrainerType.GRUSHA]: new TrainerConfig(++t).initForPaldeaGymLeader(
    signatureSpecies["GRUSHA"],
    true,
    ElementalType.ICE,
  ),
};

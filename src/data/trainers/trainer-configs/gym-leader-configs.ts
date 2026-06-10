import { ElementalType } from "#enums/elemental-type";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/trainer-config";
import { TrainerConfigBuilder } from "#trainers/trainer-config-builder";

export const gymLeaderTrainerConfigs: TrainerConfigMap = {
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

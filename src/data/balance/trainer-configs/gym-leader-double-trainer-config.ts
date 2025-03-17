import { TrainerType } from "#enums/trainer-type";
import { TrainerConfig } from "#app/data/trainer-config";
import { signatureSpecies } from "#app/data/balance/signatureSpecies";
import { ElementalType } from "#enums/elemental-type";

let t = TrainerType.MISTY_BROCK;

export const gymLeaderDoubleTrainerConfig = {
  [TrainerType.MISTY_BROCK]: new TrainerConfig(t)
    .setSpriteNames("misty", "brock")
    .setHasDouble("misty_brock_double")
    .setTitle("travel_companions")
    .initForDoubleGymLeader(
      signatureSpecies["MISTY"],
      signatureSpecies["BROCK"],
      [ElementalType.WATER],
      [ElementalType.ROCK],
      ["battle_kanto_gym"],
    ),
  [TrainerType.KOGA_JANINE_GYM]: new TrainerConfig(t++)
    .setSpriteNames("koga", "janine")
    .setHasDouble("koga_janine_double")
    .setTitle("ninja_family")
    .initForDoubleGymLeader(
      signatureSpecies["KOGA"],
      signatureSpecies["JANINE"],
      [ElementalType.POISON],
      [ElementalType.POISON],
      ["battle_kanto_gym"],
    ),
  [TrainerType.SABRINA_BRYCEN]: new TrainerConfig(t++)
    .setSpriteNames("sabrina", "brycen")
    .setHasDouble("sabrina_brycen_double")
    .setTitle("pokestars")
    .initForDoubleGymLeader(
      signatureSpecies["SABRINA"],
      signatureSpecies["BRYCEN"],
      [ElementalType.PSYCHIC],
      [ElementalType.ICE],
      ["battle_kanto_gym", "battle_unova_gym"],
    ),
  [TrainerType.GIOVANNI_SILVER]: new TrainerConfig(t++)
    .setSpriteNames("giovanni", "silver")
    .setHasDouble("giovanni_silver_double")
    .setTitle("crime_family")
    .initForDoubleGymLeader(
      signatureSpecies["GIOVANNI"],
      signatureSpecies["SILVER"],
      [ElementalType.GROUND],
      [ElementalType.POISON],
      ["battle_kanto_gym"],
    ),
  [TrainerType.CHUCK_BRAWLY]: new TrainerConfig(t++)
    .setSpriteNames("chuck", "brawly")
    .setHasDouble("chuck_brawly_double")
    .setTitle("dojo_lineage")
    .initForDoubleGymLeader(
      signatureSpecies["CHUCK"],
      signatureSpecies["BRAWLY"],
      [ElementalType.FIGHTING],
      [ElementalType.FIGHTING],
      ["battle_johto_gym", "battle_hoenn_gym"],
    ),
  [TrainerType.NORMAN_BRENDAN]: new TrainerConfig(t++)
    .setSpriteNames("norman", "brendan")
    .setHasDouble("norman_brendan_double")
    .setTitle("family_bond")
    .initForDoubleGymLeader(
      signatureSpecies["NORMAN"],
      signatureSpecies["BRENDAN"],
      [ElementalType.NORMAL],
      [ElementalType.NORMAL],
      ["battle_hoenn_gym"],
    ),
  [TrainerType.NORMAN_MAY]: new TrainerConfig(t++)
    .setSpriteNames("norman", "may")
    .setHasDouble("norman_may_double")
    .setTitle("family_bond")
    .initForDoubleGymLeader(
      signatureSpecies["NORMAN"],
      signatureSpecies["MAY"],
      [ElementalType.NORMAL],
      [ElementalType.NORMAL],
      ["battle_hoenn_gym"],
    ),
  [TrainerType.LIZA_TATE]: new TrainerConfig(t++)
    .setSpriteNames("liza", "tate") // Not Tate and Liza because of sprites
    .setHasDouble("liza_tate_double")
    .setTitle("psychic_siblings")
    .initForDoubleGymLeader(
      signatureSpecies["LIZA"],
      signatureSpecies["TATE"],
      [ElementalType.PSYCHIC],
      [ElementalType.PSYCHIC],
      ["battle_hoenn_gym"],
    ),
  [TrainerType.WALLACE_JUAN]: new TrainerConfig(t++)
    .setSpriteNames("wallace", "juan")
    .setHasDouble("wallace_juan_double")
    .setTitle("water_masters")
    .initForDoubleGymLeader(
      signatureSpecies["WALLACE"],
      signatureSpecies["JUAN"],
      [ElementalType.WATER],
      [ElementalType.WATER],
      ["battle_hoenn_gym"],
    ),
  [TrainerType.BYRON_ROARK]: new TrainerConfig(t++)
    .setSpriteNames("byron", "roark")
    .setHasDouble("byron_roark_double")
    .setTitle("rock_hard")
    .initForDoubleGymLeader(
      signatureSpecies["BYRON"],
      signatureSpecies["ROARK"],
      [ElementalType.STEEL],
      [ElementalType.ROCK],
      ["battle_sinnoh_gym"],
    ),
  [TrainerType.VOLKNER_FLINT]: new TrainerConfig(t++)
    .setSpriteNames("volkner", "flint")
    .setHasDouble("volkner_flint_double")
    .setTitle("sunnyshore_bros")
    .initForDoubleGymLeader(
      signatureSpecies["VOLKNER"],
      signatureSpecies["FLINT"],
      [ElementalType.ELECTRIC],
      [ElementalType.FIRE],
      ["battle_sinnoh_gym"],
    ),
  [TrainerType.CHILI_CILAN]: new TrainerConfig(t++)
    .setSpriteNames("chili", "cilan")
    .setHasDouble("chili_cilan_double")
    .setTitle("triplet_double")
    .initForDoubleGymLeader(
      signatureSpecies["CHILI"],
      signatureSpecies["CILAN"],
      [ElementalType.GRASS],
      [ElementalType.FIRE],
      ["battle_unova_gym"],
    ),
  [TrainerType.CILAN_CRESS]: new TrainerConfig(t++)
    .setSpriteNames("cilan", "cress")
    .setHasDouble("cilan_cress_double")
    .setTitle("triplet_double")
    .initForDoubleGymLeader(
      signatureSpecies["CILAN"],
      signatureSpecies["CRESS"],
      [ElementalType.GRASS],
      [ElementalType.WATER],
      ["battle_unova_gym"],
    ),
  [TrainerType.CRESS_CHILI]: new TrainerConfig(t++)
    .setSpriteNames("cress", "chili")
    .setHasDouble("cress_chili_double")
    .setTitle("triplet_double")
    .initForDoubleGymLeader(
      signatureSpecies["CRESS"],
      signatureSpecies["CHILI"],
      [ElementalType.FIRE],
      [ElementalType.WATER],
      ["battle_unova_gym"],
    ),
  [TrainerType.ELESA_SKYLA]: new TrainerConfig(t++)
    .setSpriteNames("elesa", "skyla")
    .setHasDouble("elesa_skyla_double")
    .setTitle("electric_wind")
    .initForDoubleGymLeader(
      signatureSpecies["ELESA"],
      signatureSpecies["SKYLA"],
      [ElementalType.FLYING],
      [ElementalType.FLYING],
      ["battle_unova_gym"],
    ),
  [TrainerType.CLAY_LACEY]: new TrainerConfig(t++)
    .setSpriteNames("clay", "lacey")
    .setHasDouble("clay_lacey_double")
    .setTitle("fairy_quakes")
    .initForDoubleGymLeader(
      signatureSpecies["CLAY"],
      signatureSpecies["LACEY"],
      [ElementalType.GROUND],
      [ElementalType.GROUND],
      ["battle_unova_gym"],
    ),
  [TrainerType.IRIS_DRAYDEN]: new TrainerConfig(t++)
    .setSpriteNames("iris", "drayden")
    .setHasDouble("iris_drayden_double")
    .setTitle("legendary_dragons")
    .initForDoubleGymLeader(
      signatureSpecies["IRIS"],
      signatureSpecies["DRAYDEN"],
      [ElementalType.DRAGON],
      [ElementalType.DRAGON],
      ["battle_unova_gym"],
    ),
  [TrainerType.CHEREN_BIANCA]: new TrainerConfig(t++)
    .setSpriteNames("cheren", "bianca")
    .setHasDouble("cheren_bianca_double")
    .setTitle("childhood_friends")
    .initForDoubleGymLeader(
      signatureSpecies["CHEREN"],
      signatureSpecies["BIANCA"],
      [ElementalType.NORMAL],
      [ElementalType.NORMAL],
      ["battle_unova_gym"],
    ),
  [TrainerType.CLEMONT_SERENA]: new TrainerConfig(t++)
    .setSpriteNames("clemont", "serena")
    .setHasDouble("clemont_serena_double")
    .setTitle("kalos_travelers")
    .initForDoubleGymLeader(
      signatureSpecies["CLEMONT"],
      signatureSpecies["SERENA"],
      [ElementalType.ELECTRIC],
      [ElementalType.NORMAL],
      ["battle_kalos_gym"],
    ),
  // Gen 7 would go here
  [TrainerType.MILO_NESSA]: new TrainerConfig(t++)
    .setSpriteNames("milo", "nessa")
    .setHasDouble("milo_nessa_double")
    .setTitle("galar_gym_rivals")
    .initForDoubleGymLeader(
      signatureSpecies["MILO"],
      signatureSpecies["NESSA"],
      [ElementalType.GRASS],
      [ElementalType.WATER],
      ["battle_galar_gym"],
    ),
  [TrainerType.BEA_ALLISTER]: new TrainerConfig(t++)
    .setSpriteNames("bea", "allister")
    .setHasDouble("bea_allister_double")
    .setTitle("galar_gym_leaders")
    .initForDoubleGymLeader(
      signatureSpecies["BEA"],
      signatureSpecies["ALLISTER"],
      [ElementalType.FIGHTING],
      [ElementalType.GHOST],
      ["battle_galar_gym"],
    ),
  [TrainerType.OPAL_BEDE]: new TrainerConfig(t++)
    .setSpriteNames("opal", "bede")
    .setHasDouble("opal_bede_double")
    .setTitle("pink_power")
    .initForDoubleGymLeader(
      signatureSpecies["OPAL"],
      signatureSpecies["BEDE"],
      [ElementalType.FAIRY],
      [ElementalType.FAIRY],
      ["battle_galar_gym"],
    ),
  [TrainerType.GORDIE_MELONY]: new TrainerConfig(t++)
    .setSpriteNames("gordie", "melony")
    .setHasDouble("gordie_melony_double")
    .setTitle("circhester_clan")
    .initForDoubleGymLeader(
      signatureSpecies["GORDIE"],
      signatureSpecies["MELONY"],
      [ElementalType.ROCK],
      [ElementalType.ICE],
      ["battle_galar_gym"],
    ),
  [TrainerType.PIERS_MARNIE]: new TrainerConfig(t++)
    .setSpriteNames("piers", "marnie")
    .setHasDouble("piers_marnie_double")
    .setTitle("spikemuth_siblings")
    .initForDoubleGymLeader(
      signatureSpecies["PIERS"],
      signatureSpecies["MARNIE"],
      [ElementalType.DARK],
      [ElementalType.DARK],
      ["battle_galar_gym"],
    ),
  [TrainerType.LEON_RAIHAN]: new TrainerConfig(t++)
    .setSpriteNames("leon", "raihan")
    .setHasDouble("leon_raihan_double")
    .setTitle("fierce_rivals")
    .initForDoubleGymLeader(
      signatureSpecies["LEON"],
      signatureSpecies["RAIHAN"],
      [ElementalType.DRAGON],
      [ElementalType.DRAGON],
      ["battle_galar_gym"],
    ),
  [TrainerType.KATY_KOFU]: new TrainerConfig(t++)
    .setSpriteNames("katy", "kofu")
    .setHasDouble("katy_kofu_double")
    .setTitle("cooking_partners")
    .initForDoubleGymLeader(
      signatureSpecies["KATY"],
      signatureSpecies["KOFU"],
      [ElementalType.BUG],
      [ElementalType.WATER],
      ["battle_paldea_gym"],
    ),
  [TrainerType.BRASSIUS_HASSEL]: new TrainerConfig(t++)
    .setSpriteNames("brassius", "hassel")
    .setHasDouble("brassius_hassel_double")
    .setTitle("old_friends")
    .initForDoubleGymLeader(
      signatureSpecies["BRASSIUS"],
      signatureSpecies["HASSEL"],
      [ElementalType.GRASS],
      [ElementalType.DRAGON],
      ["battle_paldea_gym"],
    ),
};

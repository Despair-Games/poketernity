import {
  BACKPACKER_SPECIES_POOL,
  BLACK_BELT_SPECIES_POOL,
  CLERK_SPECIES_POOL,
  CYCLIST_SPECIES_POOL,
  DANCER_SPECIES_POOL,
  FISHERMAN_SPECIES_POOL,
  HIKER_SPECIES_POOL,
  OFFICER_SPECIES_POOL,
  PRESCHOOLER_SPECIES_POOL,
  PSYCHIC_SPECIES_POOL,
  RANGER_SPECIES_POOL,
  SCHOOL_KID_SPECIES_POOL,
  SCIENTIST_SPECIES_POOL,
  WAITER_SPECIES_POOL,
  YOUNGSTER_SPECIES_POOL,
} from "#constants/trainer-constants";
import { tmSpecies } from "#data/tms";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/trainer-config";
import { levelByStrength, minWaveCondition, TrainerConfigBuilder } from "#trainers/trainer-config-builder";
import { trainerNamePools } from "#trainers/trainer-names";

export const genericTrainerConfigs: TrainerConfigMap = {
  [TrainerType.ACE_TRAINER]: new TrainerConfigBuilder(TrainerType.ACE_TRAINER)
    .withNameFromPool(trainerNamePools[TrainerType.ACE_TRAINER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.ACE_TRAINER][1], TrainerGender.FEMALE)
    .withTitle("ace_trainer")
    .withEncounterBgm(TrainerType.ACE_TRAINER)
    .withRandomPokemon({
      count: 3,
    })
    .withRandomPokemon({
      condition: minWaveCondition(50),
    })
    .withRandomPokemon({
      condition: minWaveCondition(80),
    })
    .withRandomPokemon({
      condition: minWaveCondition(110),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.ARTIST]: new TrainerConfigBuilder(TrainerType.ARTIST)
    .withNameFromPool(trainerNamePools[TrainerType.ARTIST][0], TrainerGender.MALE)
    .withTitle("artist")
    .withSpriteKey("artist")
    .withEncounterBgm(TrainerType.RICH)
    .withPokemon(
      // Can be 1 strong Smeargle, 2 average Smeargle, or 3 average Smeargle
      SpeciesId.SMEARGLE,
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
      { count: 2 },
      { count: 3 },
    )
    .build(),
  [TrainerType.BACKERS]: new TrainerConfigBuilder(TrainerType.BACKERS)
    .withNameFromPool(trainerNamePools[TrainerType.BACKERS][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.BACKERS][1], TrainerGender.FEMALE)
    .withTitle("backers")
    .withSpriteKey("backers_m", TrainerGender.MALE)
    .withSpriteKey("backers_f", TrainerGender.FEMALE)
    .withForcedDoubleBattle()
    .withRandomPokemon({ count: 2 })
    .withRandomPokemon({
      // TODO: adjust Pokemon pool
      condition: minWaveCondition(80),
      count: 2,
    })
    .build(),
  [TrainerType.BACKPACKER]: new TrainerConfigBuilder(TrainerType.BACKPACKER)
    .withNameFromPool(trainerNamePools[TrainerType.BACKPACKER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.BACKPACKER][1], TrainerGender.FEMALE)
    .withTitle("backpacker")
    .withSpriteKey("backpacker_m", TrainerGender.MALE)
    .withSpriteKey("backpacker_f", TrainerGender.FEMALE)
    .withPokemonFromTieredPool(
      BACKPACKER_SPECIES_POOL,
      {
        count: 1,
        levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      },
      {
        count: 2,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.STRONG]),
      },
      {
        count: 2,
        levelFunc: levelByStrength([PartyMemberStrength.AVERAGE, PartyMemberStrength.STRONG]),
      },
    )
    .build(),
  [TrainerType.BAKER]: new TrainerConfigBuilder(TrainerType.BAKER)
    .withNameFromPool(trainerNamePools[TrainerType.BAKER], TrainerGender.FEMALE)
    .withTitle("baker")
    .withSpriteKey("baker")
    .withEncounterBgm(TrainerType.CLERK)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.GRASS) || s.isOfType(ElementalType.FIRE))
    .withMoneyMultiplier(1.35)
    .build(),
  [TrainerType.BEAUTY]: new TrainerConfigBuilder(TrainerType.BEAUTY)
    .withNameFromPool(trainerNamePools[TrainerType.BEAUTY], TrainerGender.FEMALE)
    .withTitle("beauty")
    .withSpriteKey("beauty")
    .withEncounterBgm(TrainerType.PARASOL_LADY)
    .withRandomPokemon() // TODO: adjust trainer pool
    .build(),
  [TrainerType.BIKER]: new TrainerConfigBuilder(TrainerType.BIKER)
    .withNameFromPool(trainerNamePools[TrainerType.BIKER], TrainerGender.MALE)
    .withTitle("biker")
    .withSpriteKey("biker")
    .withEncounterBgm(TrainerType.ROUGHNECK)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.POISON))
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.BLACK_BELT]: new TrainerConfigBuilder(TrainerType.BLACK_BELT)
    .withNameFromPool(trainerNamePools[TrainerType.BLACK_BELT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.BLACK_BELT][1], TrainerGender.FEMALE)
    .withTitle("black_belt", TrainerGender.MALE)
    .withTitle("battle_girl", TrainerGender.FEMALE)
    .withSpriteKey("black_belt_m", TrainerGender.MALE)
    .withSpriteKey("black_belt_f", TrainerGender.FEMALE)
    .withPokemonFromTieredPool(
      BLACK_BELT_SPECIES_POOL,
      {
        count: 3,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.WEAK, PartyMemberStrength.AVERAGE]),
      },
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      },
      {
        count: 3,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.WEAK, PartyMemberStrength.STRONG]),
      },
      {
        count: 3,
        levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      },
      {
        count: 3,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
        ]),
      },
    )
    .build(),
  [TrainerType.BREEDER]: new TrainerConfigBuilder(TrainerType.BREEDER)
    .withNameFromPool(trainerNamePools[TrainerType.BREEDER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.BREEDER][1], TrainerGender.FEMALE)
    .withTitle("breeder", TrainerGender.MALE)
    .withTitle("breeder_female", TrainerGender.FEMALE)
    .withSpriteKey("breeder_m", TrainerGender.MALE)
    .withSpriteKey("breeder_f", TrainerGender.FEMALE)
    .withPokemonFromFilter(
      (s) => s.baseTotal < 450,
      {
        count: 4,
        levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
      },
      {
        count: 5,
        levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
      },
      {
        count: 6,
        levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
      },
    )
    .withMoneyMultiplier(1.325)
    .build(),
  [TrainerType.CLERK]: new TrainerConfigBuilder(TrainerType.CLERK)
    .withNameFromPool(trainerNamePools[TrainerType.CLERK][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.CLERK][1], TrainerGender.FEMALE)
    .withTitle("clerk", TrainerGender.MALE)
    .withTitle("clerk_female", TrainerGender.FEMALE)
    .withSpriteKey("clerk_m", TrainerGender.MALE)
    .withSpriteKey("clerk_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.CLERK)
    .withPokemonFromTieredPool(
      CLERK_SPECIES_POOL,
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      {
        count: 3,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      { levelFunc: levelByStrength(PartyMemberStrength.AVERAGE) },
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      },
      {
        count: 3,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.WEAK, PartyMemberStrength.AVERAGE]),
      },
    )
    .build(),
  [TrainerType.CYCLIST]: new TrainerConfigBuilder(TrainerType.CYCLIST)
    .withNameFromPool(trainerNamePools[TrainerType.CYCLIST][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.CYCLIST][1], TrainerGender.FEMALE)
    .withTitle("cyclist", TrainerGender.MALE)
    .withTitle("cyclist_female", TrainerGender.FEMALE)
    .withSpriteKey("cyclist_m", TrainerGender.MALE)
    .withSpriteKey("cyclist_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.CYCLIST)
    .withPokemonFromTieredPool(
      CYCLIST_SPECIES_POOL,
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      {}, // 1 Average
    )
    .build(),
  [TrainerType.DANCER]: new TrainerConfigBuilder(TrainerType.DANCER)
    .withNameFromPool(trainerNamePools[TrainerType.DANCER], TrainerGender.FEMALE)
    .withTitle("dancer")
    .withSpriteKey("dancer")
    .withEncounterBgm(TrainerType.CYCLIST)
    .withPokemonFromTieredPool(
      DANCER_SPECIES_POOL,
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      {}, // 1 Average
      { count: 2 }, // 2 Average
    )
    .withMoneyMultiplier(1.55)
    .build(),
  [TrainerType.DEPOT_AGENT]: new TrainerConfigBuilder(TrainerType.DEPOT_AGENT)
    .withNameFromPool(trainerNamePools[TrainerType.DEPOT_AGENT], TrainerGender.MALE)
    .withTitle("depot_agent")
    .withSpriteKey("depot_agent")
    .withEncounterBgm(TrainerType.CLERK)
    .withRandomPokemon() // TODO: Update party configs
    .withMoneyMultiplier(1.45)
    .build(),
  [TrainerType.DOCTOR]: new TrainerConfigBuilder(TrainerType.DOCTOR)
    .withNameFromPool(trainerNamePools[TrainerType.DOCTOR][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.DOCTOR][1], TrainerGender.FEMALE)
    .withTitle("doctor", TrainerGender.MALE)
    .withTitle("nurse", TrainerGender.FEMALE)
    .withSpriteKey("doctor_m", TrainerGender.MALE)
    .withSpriteKey("doctor_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.CLERK) // TODO: Nurse bgm should be TrainerType.LASS
    .withPokemonFromFilter((s) => s.getLevelMoves().some(([, moveId]) => moveId === MoveId.HEAL_PULSE)) // TODO: Add options for party count/strength
    .build(),
  [TrainerType.FIREBREATHER]: new TrainerConfigBuilder(TrainerType.FIREBREATHER)
    .withNameFromPool(trainerNamePools[TrainerType.FIREBREATHER], TrainerGender.MALE)
    .withTitle("firebreather")
    .withSpriteKey("firebreather")
    .withEncounterBgm(TrainerType.ROUGHNECK)
    .withPokemonFromFilter(
      (s) => s.isOfType(ElementalType.FIRE) || s.getLevelMoves().some(([, moveId]) => moveId === MoveId.SMOG),
    )
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.FISHERMAN]: new TrainerConfigBuilder(TrainerType.FISHERMAN)
    .withNameFromPool(trainerNamePools[TrainerType.FISHERMAN], TrainerGender.MALE)
    .withTitle("fisherman")
    .withSpriteKey("fisherman")
    .withEncounterBgm(TrainerType.BACKPACKER)
    .withPokemonFromTieredPool(
      FISHERMAN_SPECIES_POOL,
      {}, // 1 Average
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
      {
        count: 3,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      {
        count: 3,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.WEAK, PartyMemberStrength.AVERAGE]),
      },
      {
        count: 6,
        levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
      },
    )
    .withMoneyMultiplier(1.25)
    .build(),
  [TrainerType.GUITARIST]: new TrainerConfigBuilder(TrainerType.GUITARIST)
    .withNameFromPool(trainerNamePools[TrainerType.GUITARIST], TrainerGender.MALE)
    .withTitle("guitarist")
    .withSpriteKey("guitarist")
    .withEncounterBgm(TrainerType.ROUGHNECK)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.ELECTRIC))
    .withMoneyMultiplier(1.2)
    .build(),
  [TrainerType.HARLEQUIN]: new TrainerConfigBuilder(TrainerType.HARLEQUIN)
    .withNameFromPool(trainerNamePools[TrainerType.HARLEQUIN], TrainerGender.MALE)
    .withTitle("harlequin")
    .withSpriteKey("harlequin")
    .withEncounterBgm(TrainerType.PSYCHIC)
    .withPokemonFromFilter((s) => tmSpecies[MoveId.TRICK_ROOM].includes(s.speciesId))
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.HIKER]: new TrainerConfigBuilder(TrainerType.HIKER)
    .withNameFromPool(trainerNamePools[TrainerType.HIKER], TrainerGender.MALE)
    .withTitle("hiker")
    .withSpriteKey("hiker")
    .withEncounterBgm(TrainerType.BACKPACKER)
    .withPokemonFromTieredPool(
      HIKER_SPECIES_POOL,
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
      { count: 2 },
      { count: 3 },
      {
        count: 3,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
        ]),
      },
      {
        count: 4,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
    )
    .build(),
  [TrainerType.HOOLIGANS]: new TrainerConfigBuilder(TrainerType.HOOLIGANS)
    .withNameFromPool(trainerNamePools[TrainerType.HOOLIGANS], TrainerGender.MALE)
    .withTitle("hooligans")
    .withSpriteKey("hooligans")
    .withEncounterBgm(TrainerType.ROUGHNECK)
    .withForcedDoubleBattle()
    .withPokemonFromFilter(
      (s) => s.isOfType(ElementalType.POISON) || s.isOfType(ElementalType.DARK),
      { count: 2 },
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      },
    )
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.HOOPSTER]: new TrainerConfigBuilder(TrainerType.HOOPSTER)
    .withNameFromPool(trainerNamePools[TrainerType.HOOPSTER], TrainerGender.MALE)
    .withTitle("hoopster")
    .withSpriteKey("hoopster")
    .withEncounterBgm(TrainerType.CYCLIST)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.2)
    .build(),
  [TrainerType.INFIELDER]: new TrainerConfigBuilder(TrainerType.INFIELDER)
    .withNameFromPool(trainerNamePools[TrainerType.INFIELDER], TrainerGender.MALE)
    .withTitle("infielder")
    .withSpriteKey("infielder")
    .withEncounterBgm(TrainerType.CYCLIST)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.2)
    .build(),
  [TrainerType.JANITOR]: new TrainerConfigBuilder(TrainerType.JANITOR)
    .withNameFromPool(trainerNamePools[TrainerType.JANITOR], TrainerGender.MALE)
    .withTitle("janitor")
    .withSpriteKey("janitor")
    .withEncounterBgm(TrainerType.CLERK)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.1)
    .build(),
  [TrainerType.LINEBACKER]: new TrainerConfigBuilder(TrainerType.LINEBACKER)
    .withNameFromPool(trainerNamePools[TrainerType.LINEBACKER], TrainerGender.MALE)
    .withTitle("linebacker")
    .withSpriteKey("linebacker")
    .withEncounterBgm(TrainerType.CYCLIST)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.2)
    .build(),
  [TrainerType.MAID]: new TrainerConfigBuilder(TrainerType.MAID)
    .withNameFromPool(trainerNamePools[TrainerType.MAID], TrainerGender.FEMALE)
    .withTitle("maid")
    .withSpriteKey("maid")
    .withEncounterBgm(TrainerType.RICH)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.6)
    .build(),
  [TrainerType.MUSICIAN]: new TrainerConfigBuilder(TrainerType.MUSICIAN)
    .withNameFromPool(trainerNamePools[TrainerType.MUSICIAN], TrainerGender.MALE)
    .withTitle("musician")
    .withSpriteKey("musician")
    .withEncounterBgm(TrainerType.ROUGHNECK)
    .withPokemonFromFilter((s) => s.getLevelMoves().some(([, moveId]) => moveId === MoveId.SING))
    .withMoneyMultiplier(1.1)
    .build(),
  [TrainerType.HEX_MANIAC]: new TrainerConfigBuilder(TrainerType.HEX_MANIAC)
    .withNameFromPool(trainerNamePools[TrainerType.HEX_MANIAC], TrainerGender.MALE)
    .withTitle("hex_maniac")
    .withSpriteKey("hex_maniac")
    .withEncounterBgm(TrainerType.PSYCHIC)
    .withPokemonFromFilter(
      (s) => s.isOfType(ElementalType.GHOST),
      { count: 2 },
      {
        count: 2,
        levelFunc: levelByStrength([PartyMemberStrength.AVERAGE, PartyMemberStrength.STRONG]),
      },
      { count: 3 },
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      },
    )
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.NURSERY_AIDE]: new TrainerConfigBuilder(TrainerType.NURSERY_AIDE)
    .withNameFromPool(trainerNamePools[TrainerType.NURSERY_AIDE], TrainerGender.FEMALE)
    .withTitle("nursery_aide")
    .withSpriteKey("nursery_aide")
    .withEncounterBgm("encounter_lass")
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.3)
    .build(),
  [TrainerType.OFFICER]: new TrainerConfigBuilder(TrainerType.OFFICER)
    .withNameFromPool(trainerNamePools[TrainerType.OFFICER], TrainerGender.MALE)
    .withTitle("officer")
    .withSpriteKey("officer")
    .withEncounterBgm(TrainerType.CLERK)
    .withPokemonFromTieredPool(
      OFFICER_SPECIES_POOL,
      {},
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
      { count: 2 },
      {
        count: 3,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.WEAK, PartyMemberStrength.AVERAGE]),
      },
    )
    .withMoneyMultiplier(1.55)
    .build(),
  [TrainerType.PARASOL_LADY]: new TrainerConfigBuilder(TrainerType.PARASOL_LADY)
    .withNameFromPool(trainerNamePools[TrainerType.PARASOL_LADY], TrainerGender.FEMALE)
    .withTitle("parasol_lady")
    .withSpriteKey("parasol_lady")
    .withEncounterBgm(TrainerType.PARASOL_LADY)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.WATER)) // TODO: update options (?)
    .withMoneyMultiplier(1.55)
    .build(),
  [TrainerType.PILOT]: new TrainerConfigBuilder(TrainerType.PILOT)
    .withNameFromPool(trainerNamePools[TrainerType.PILOT], TrainerGender.MALE)
    .withTitle("pilot")
    .withSpriteKey("pilot")
    .withEncounterBgm(TrainerType.CLERK)
    .withPokemonFromFilter((s) => tmSpecies[MoveId.FLY].includes(s.speciesId)) // TODO: update options (?)
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.POKEFAN]: new TrainerConfigBuilder(TrainerType.POKEFAN)
    .withNameFromPool(trainerNamePools[TrainerType.POKEFAN][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.POKEFAN][1], TrainerGender.FEMALE)
    .withTitle("pokefan", TrainerGender.MALE)
    .withTitle("pokefan_female", TrainerGender.FEMALE)
    .withSpriteKey("pokefan_m", TrainerGender.MALE)
    .withSpriteKey("pokefan_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.POKEFAN)
    .withRandomPokemon(
      {
        count: 6,
        levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
      },
      {
        count: 4,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      { count: 2 },
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
      {
        count: 5,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
    )
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.PRESCHOOLER]: new TrainerConfigBuilder(TrainerType.PRESCHOOLER)
    .withNameFromPool(trainerNamePools[TrainerType.PRESCHOOLER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.PRESCHOOLER][1], TrainerGender.FEMALE)
    .withTitle("preschooler", TrainerGender.MALE)
    .withTitle("preschooler_female", TrainerGender.FEMALE)
    .withSpriteKey("preschooler_m", TrainerGender.MALE)
    .withSpriteKey("preschooler_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.YOUNGSTER)
    .withPokemonFromTieredPool(
      PRESCHOOLER_SPECIES_POOL,
      {
        count: 3,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      {
        count: 4,
        levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
      },
      {
        count: 3,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.WEAK, PartyMemberStrength.AVERAGE]),
      },
      {
        count: 5,
        levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
      },
    )
    .withMoneyMultiplier(0.2)
    .build(),
  [TrainerType.PSYCHIC]: new TrainerConfigBuilder(TrainerType.PSYCHIC)
    .withNameFromPool(trainerNamePools[TrainerType.PSYCHIC][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.PSYCHIC][1], TrainerGender.FEMALE)
    .withTitle("psychic", TrainerGender.MALE)
    .withTitle("psychic_female", TrainerGender.FEMALE)
    .withSpriteKey("psychic_m", TrainerGender.MALE)
    .withSpriteKey("psychic_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PSYCHIC)
    .withPokemonFromTieredPool(
      PSYCHIC_SPECIES_POOL,
      { count: 2 },
      {
        count: 2,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      {
        count: 3,
        levelFunc: levelByStrength([PartyMemberStrength.WEAK, PartyMemberStrength.WEAK, PartyMemberStrength.AVERAGE]),
      },
      {
        count: 4,
        levelFunc: levelByStrength(PartyMemberStrength.WEAK),
      },
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
    )
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.RANGER]: new TrainerConfigBuilder(TrainerType.RANGER)
    .withNameFromPool(trainerNamePools[TrainerType.RANGER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.RANGER][1], TrainerGender.FEMALE)
    .withTitle("pokemon_ranger", TrainerGender.MALE)
    .withTitle("pokemon_ranger_female", TrainerGender.FEMALE)
    .withSpriteKey("ranger_m", TrainerGender.MALE)
    .withSpriteKey("ranger_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.BACKPACKER)
    .withPokemonFromTieredPool(
      RANGER_SPECIES_POOL,
      { count: 2 },
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
    )
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.RICH]: new TrainerConfigBuilder(TrainerType.RICH)
    .withNameFromPool(trainerNamePools[TrainerType.RICH][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.RICH][1], TrainerGender.FEMALE)
    .withTitle("gentleman", TrainerGender.MALE)
    .withTitle("madame", TrainerGender.FEMALE)
    .withSpriteKey("rich_m", TrainerGender.MALE)
    .withSpriteKey("rich_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.RICH)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(5)
    .build(),
  [TrainerType.RICH_KID]: new TrainerConfigBuilder(TrainerType.RICH_KID)
    .withNameFromPool(trainerNamePools[TrainerType.RICH_KID][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.RICH_KID][1], TrainerGender.FEMALE)
    .withTitle("rich_boy", TrainerGender.MALE)
    .withTitle("rich_lady", TrainerGender.FEMALE)
    .withSpriteKey("rich_kid_m", TrainerGender.MALE)
    .withSpriteKey("rich_kid_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.RICH)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(3.75)
    .build(),
  [TrainerType.ROUGHNECK]: new TrainerConfigBuilder(TrainerType.ROUGHNECK)
    .withNameFromPool(trainerNamePools[TrainerType.ROUGHNECK], TrainerGender.MALE)
    .withTitle("roughneck")
    .withSpriteKey("roughneck")
    .withEncounterBgm(TrainerType.ROUGHNECK)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.DARK)) // TODO: add options
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.SAILOR]: new TrainerConfigBuilder(TrainerType.SAILOR)
    .withNameFromPool(trainerNamePools[TrainerType.SAILOR], TrainerGender.MALE)
    .withTitle("sailor")
    .withSpriteKey("sailor")
    .withEncounterBgm(TrainerType.BACKPACKER)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.WATER) || s.isOfType(ElementalType.FIGHTING)) // TODO: add options
    .withMoneyMultiplier(1.4)
    .build(),
  [TrainerType.SCIENTIST]: new TrainerConfigBuilder(TrainerType.SCIENTIST)
    .withNameFromPool(trainerNamePools[TrainerType.SCIENTIST][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.SCIENTIST][1], TrainerGender.FEMALE)
    .withTitle("scientist", TrainerGender.MALE)
    .withTitle("scientist_female", TrainerGender.FEMALE)
    .withSpriteKey("scientist_m", TrainerGender.MALE)
    .withSpriteKey("scientist_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.SCIENTIST)
    .withPokemonFromTieredPool(SCIENTIST_SPECIES_POOL) // TODO: add options
    .withMoneyMultiplier(1.7)
    .build(),
  [TrainerType.SMASHER]: new TrainerConfigBuilder(TrainerType.SMASHER)
    .withNameFromPool(trainerNamePools[TrainerType.SMASHER], TrainerGender.MALE)
    .withTitle("smasher")
    .withSpriteKey("smasher")
    .withEncounterBgm(TrainerType.CYCLIST)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.2)
    .build(),
  [TrainerType.SNOW_WORKER]: new TrainerConfigBuilder(TrainerType.SNOW_WORKER)
    .withNameFromPool(trainerNamePools[TrainerType.SNOW_WORKER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.SNOW_WORKER][1], TrainerGender.FEMALE)
    .withTitle("snow_worker", TrainerGender.MALE)
    .withTitle("snow_worker_female", TrainerGender.FEMALE)
    .withSpriteKey("snow_worker_m", TrainerGender.MALE)
    .withSpriteKey("snow_worker_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.CLERK)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.ICE) || s.isOfType(ElementalType.STEEL)) // TODO: add options
    .withMoneyMultiplier(1.7)
    .build(),
  [TrainerType.STRIKER]: new TrainerConfigBuilder(TrainerType.STRIKER)
    .withNameFromPool(trainerNamePools[TrainerType.STRIKER], TrainerGender.MALE)
    .withTitle("striker")
    .withSpriteKey("striker")
    .withEncounterBgm(TrainerType.CYCLIST)
    .withRandomPokemon() // TODO: update party configs
    .withMoneyMultiplier(1.2)
    .build(),
  [TrainerType.SCHOOL_KID]: new TrainerConfigBuilder(TrainerType.SCHOOL_KID)
    .withNameFromPool(trainerNamePools[TrainerType.SCHOOL_KID][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.SCHOOL_KID][1], TrainerGender.FEMALE)
    .withTitle("school_kid", TrainerGender.MALE)
    .withTitle("school_kid_female", TrainerGender.FEMALE)
    .withSpriteKey("school_kid_m", TrainerGender.MALE)
    .withSpriteKey("school_kid_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.YOUNGSTER)
    .withPokemonFromTieredPool(SCHOOL_KID_SPECIES_POOL) // TODO: add options
    .withMoneyMultiplier(0.75)
    .build(),
  [TrainerType.SWIMMER]: new TrainerConfigBuilder(TrainerType.SWIMMER)
    .withNameFromPool(trainerNamePools[TrainerType.SWIMMER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.SWIMMER][1], TrainerGender.FEMALE)
    .withTitle("swimmer", TrainerGender.MALE)
    .withTitle("swimmer_female", TrainerGender.FEMALE)
    .withSpriteKey("swimmer_m", TrainerGender.MALE)
    .withSpriteKey("swimmer_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PARASOL_LADY)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.WATER)) // TODO: add options
    .withMoneyMultiplier(1.3)
    .build(),
  [TrainerType.TWINS]: new TrainerConfigBuilder(TrainerType.TWINS)
    .withNameFromPool(trainerNamePools[TrainerType.TWINS], TrainerGender.FEMALE)
    .withTitle("twins")
    .withSpriteKey("twins")
    .withEncounterBgm(TrainerType.TWINS)
    .withForcedDoubleBattle()
    .withPartyCorrelation() // TODO: this forces correlation between the Pokemon's species, but not their strength/levels
    .withPokemonFromPool(
      [
        SpeciesId.PLUSLE,
        SpeciesId.VOLBEAT,
        SpeciesId.PACHIRISU,
        SpeciesId.SILCOON,
        SpeciesId.METAPOD,
        SpeciesId.IGGLYBUFF,
        SpeciesId.PETILIL,
        SpeciesId.EEVEE,
      ],
      { levelFunc: levelByStrength(PartyMemberStrength.WEAK) },
      { levelFunc: levelByStrength(PartyMemberStrength.AVERAGE) },
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
    )
    .withPokemonFromPool(
      [
        SpeciesId.MINUN,
        SpeciesId.ILLUMISE,
        SpeciesId.EMOLGA,
        SpeciesId.CASCOON,
        SpeciesId.KAKUNA,
        SpeciesId.CLEFFA,
        SpeciesId.COTTONEE,
        SpeciesId.EEVEE,
      ],
      { levelFunc: levelByStrength(PartyMemberStrength.WEAK) },
      { levelFunc: levelByStrength(PartyMemberStrength.AVERAGE) },
      { levelFunc: levelByStrength(PartyMemberStrength.STRONG) },
    )
    .withMoneyMultiplier(0.65)
    .build(),
  [TrainerType.VETERAN]: new TrainerConfigBuilder(TrainerType.VETERAN)
    .withNameFromPool(trainerNamePools[TrainerType.VETERAN][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.VETERAN][1], TrainerGender.FEMALE)
    .withTitle("veteran", TrainerGender.MALE)
    .withTitle("veteran_female", TrainerGender.FEMALE)
    .withSpriteKey("veteran_m", TrainerGender.MALE)
    .withSpriteKey("veteran_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.ACE_TRAINER)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.DRAGON)) // TODO: add options
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.WAITER]: new TrainerConfigBuilder(TrainerType.WAITER)
    .withNameFromPool(trainerNamePools[TrainerType.WAITER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.WAITER][1], TrainerGender.FEMALE)
    .withTitle("waiter", TrainerGender.MALE)
    .withTitle("waitress", TrainerGender.FEMALE)
    .withSpriteKey("waiter_m", TrainerGender.MALE)
    .withSpriteKey("waiter_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.CLERK)
    .withPokemonFromTieredPool(WAITER_SPECIES_POOL) // TODO: add options
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.WORKER]: new TrainerConfigBuilder(TrainerType.WORKER)
    .withNameFromPool(trainerNamePools[TrainerType.WORKER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.WORKER][1], TrainerGender.FEMALE)
    .withTitle("worker", TrainerGender.MALE)
    .withTitle("worker_female", TrainerGender.FEMALE)
    .withSpriteKey("worker_m", TrainerGender.MALE)
    .withSpriteKey("worker_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.CLERK)
    .withPokemonFromFilter((s) => s.isOfType(ElementalType.ROCK) || s.isOfType(ElementalType.STEEL))
    .withMoneyMultiplier(1.7)
    .build(),
  [TrainerType.YOUNGSTER]: new TrainerConfigBuilder(TrainerType.YOUNGSTER)
    .withNameFromPool(trainerNamePools[TrainerType.YOUNGSTER][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.YOUNGSTER][1], TrainerGender.FEMALE)
    .withTitle("youngster", TrainerGender.MALE)
    .withTitle("lass", TrainerGender.FEMALE)
    .withSpriteKey("youngster_m", TrainerGender.MALE)
    .withSpriteKey("youngster_f", TrainerGender.FEMALE)
    .withPokemonFromPool(YOUNGSTER_SPECIES_POOL, {
      count: 2,
      levelFunc: levelByStrength(PartyMemberStrength.WEAKER),
    })
    .withMoneyMultiplier(0.5)
    .build(),
} as const;

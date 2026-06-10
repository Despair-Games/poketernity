import { RIVAL_SLOT_0_POKEMON, RIVAL_SLOT_1_POKEMON } from "#constants/trainer-constants";
import type { PokemonSpecies } from "#data/pokemon-species";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/trainer-config";
import { levelByStrength, TrainerConfigBuilder } from "#trainers/trainer-config-builder";

export const rivalTrainerConfigs: TrainerConfigMap = {
  [TrainerType.RIVAL]: new TrainerConfigBuilder(TrainerType.RIVAL)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.WEAKEST),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON, { levelFunc: levelByStrength(PartyMemberStrength.WEAKEST) })
    .build(),
  [TrainerType.RIVAL_2]: new TrainerConfigBuilder(TrainerType.RIVAL_2)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species: PokemonSpecies) => species.isSingleStage() && species.baseTotal >= 450, {
      levelFunc: levelByStrength(PartyMemberStrength.WEAK),
    })
    .build(),
  [TrainerType.RIVAL_3]: new TrainerConfigBuilder(TrainerType.RIVAL_3)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, {
      levelFunc: levelByStrength([PartyMemberStrength.AVERAGE, PartyMemberStrength.WEAK]),
    })
    .build(),
  [TrainerType.RIVAL_4]: new TrainerConfigBuilder(TrainerType.RIVAL_4)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL_2)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, {
      count: 2,
      levelFunc: levelByStrength(PartyMemberStrength.WEAK),
    })
    .build(),
  [TrainerType.RIVAL_5]: new TrainerConfigBuilder(TrainerType.RIVAL_5)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL_3)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, { count: 2 })
    .withPokemon(SpeciesId.RAYQUAZA, {
      pokeball: PokeballType.MASTER_BALL,
      ignoreEvolution: true,
      shiny: true,
      variant: 1,
      boss: true,
      bossSegments: 3,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .build(),
  [TrainerType.RIVAL_6]: new TrainerConfigBuilder(TrainerType.RIVAL_6)
    .withRivalAssets()
    .withEncounterBgm("final")
    .withBattleBgm(TrainerType.RIVAL_3)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      boss: true,
      bossSegments: 3,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON, {
      boss: true,
      bossSegments: 2,
    })
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, { count: 2 })
    .withPokemon(SpeciesId.RAYQUAZA, {
      pokeball: PokeballType.MASTER_BALL,
      ignoreEvolution: true,
      formIndex: 1, // Mega Rayquaza
      shiny: true,
      variant: 1,
      boss: true,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
} as const;

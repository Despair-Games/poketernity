import { globalScene } from "#app/global-scene";
import { LEVEL_CAP_SCALE_FACTOR } from "#constants/game-constants";
import { TRAINER_POOL_COMBINED_WEIGHT, TRAINER_POOL_TIER_WEIGHTS } from "#constants/trainer-constants";
import { getLevelForWaveFunc } from "#data/exp";
import type { TrainerPartyPokemonConfig } from "#data/new-trainer-config";
import type { PokemonSpecies } from "#data/pokemon-species";
import { PartyMemberStrength } from "#enums/party-member-strength";
import type { SpeciesId } from "#enums/species-id";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import type { NonNullTrainerSlot } from "#enums/trainer-slot";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedInt, randSeedItem } from "#utils/random-utils";

/**
 * Determines the global seed offset used when generating a Pokemon (namely its species)
 * from a {@linkcode TrainerPartyPokemonConfig}.
 * @param trainerSlot - The {@linkcode TrainerSlot} of the Trainer whose Pokemon is being generated
 * @param slotIndex - The party slot index of the Pokemon being generated
 * @param baseOffset - (Optional) A base offset to override the {@linkcode globalScene.currentBattle.waveIndex | waveIndex} component
 * @param useSameSeedForAllTrainers - (Default `false`) If `true`, the same seed offset
 * will be used for all Trainers in the current battle for each slot index.
 * @returns The final seed offset to generate the Pokemon in the given party slot
 */
export function getPartyMemberSeedOffset(
  trainerSlot: NonNullTrainerSlot,
  slotIndex: number,
  baseOffset?: number,
  useSameSeedForAllTrainers: boolean = false,
): number {
  return (
    ((baseOffset ?? globalScene.currentBattle.waveIndex + (useSameSeedForAllTrainers ? 0 : trainerSlot))
      + (slotIndex + 1))
    << 8
  );
}

/**
 * Determines the species of a Trainer's generated {@linkcode EnemyPokemon} based on the Pokemon's config.
 * @param level - The generated Pokemon's predetermined level (see {@linkcode getPartyPokemonLevel})
 * @param currentParty - The Pokemon that have already been generated for the Trainer's party
 * @param config - The {@linkcode TrainerPartyPokemonConfig} used to generate the Pokemon
 * @returns The {@linkcode SpeciesId} of the generated Pokemon
 */
export function getPartyPokemonSpecies(
  level: number,
  currentParty: EnemyPokemon[],
  config: TrainerPartyPokemonConfig,
): SpeciesId {
  const {
    tieredSpeciesPool,
    speciesPool: untieredSpeciesPool,
    speciesFilter: originalSpeciesFilter,
    allowDuplicates,
    allowLegendaries,
  } = config;

  /**
   * The final species filter is compiled from three config properties:
   * - The custom {@linkcode TrainerPartyPokemonConfig.speciesFilter | speciesFilter}
   * - If {@linkcode TrainerPartyPokemonConfig.allowDuplicates | allowDuplicates} is `false`,
   * species that are related to any Pokemon in {@linkcode currentParty} are excluded.
   * - If {@linkcode TrainerPartyPokemonConfig.allowLegendaries | allowLegendaries} is `false`,
   * all {@link PokemonSpecies.isLegendLike | legend-like} species are excluded.
   */
  const speciesFilter = (species: PokemonSpecies): boolean => {
    const relatedSpecies = species.getRelatedSpecies();
    const isDuplicate = currentParty.some((p) => relatedSpecies.has(p.species.speciesId));
    const isLegendLike = species.isLegendLike();

    return (
      (allowDuplicates || !isDuplicate) && (allowLegendaries || !isLegendLike) && !!originalSpeciesFilter?.(species)
    );
  };

  // If no species pool is defined, generate a random species from
  // the entire pool of encounterable Pokemon (filtered via `speciesFilter`)
  if (tieredSpeciesPool == null && untieredSpeciesPool == null) {
    return globalScene
      .randomSpecies(globalScene.currentBattle.waveIndex, level, undefined, speciesFilter)
      .getEnemySpeciesForLevel(level, true);
  }

  let finalSpeciesPool: SpeciesId[] = [];
  if (tieredSpeciesPool != null) {
    // Select a tier randomly from the tiered pool, then apply the species filter to the selected tier.
    // If no Pokemon satisfy the filter in the selected tier, fall back to the next tier below it and
    // repeat this process.
    let tier = getBasePartyPokemonTier();
    while (finalSpeciesPool.length === 0 && tier >= TrainerPoolTier.COMMON) {
      finalSpeciesPool =
        tieredSpeciesPool[tier]?.filter((speciesId) => speciesFilter(getPokemonSpecies(speciesId))) ?? [];
      tier--;
    }
    // If no Pokemon satisfy the filter, use the lowest-tier pool without filtering
    if (finalSpeciesPool.length === 0) {
      finalSpeciesPool = Object.values(tieredSpeciesPool)[0];
    }
  } else {
    // Apply the species filter to the untiered pool (which should exist based on config validation
    // and the ifs before this). If no Pokemon satisfy the filter, fall back to the unfiltered pool.
    const filteredPool = untieredSpeciesPool!.filter((speciesId) => speciesFilter(getPokemonSpecies(speciesId)));
    finalSpeciesPool = filteredPool.length > 0 ? filteredPool : untieredSpeciesPool!;
  }

  // return a random, level-adjusted species from the filtered species pool
  return getPokemonSpecies(randSeedItem(finalSpeciesPool)).getEnemySpeciesForLevel(level, true);
}

/**
 * @returns A random {@linkcode TrainerPoolTier} based on weighted selection.
 * @see {@linkcode TRAINER_POOL_TIER_WEIGHTS}
 */
function getBasePartyPokemonTier(): TrainerPoolTier {
  let tierValue = randSeedInt(TRAINER_POOL_COMBINED_WEIGHT);
  for (const [tier, w] of Object.entries(TRAINER_POOL_TIER_WEIGHTS)) {
    if (tierValue < w) {
      return Number(tier) as TrainerPoolTier;
    }
    tierValue -= w;
  }
  return TrainerPoolTier.COMMON;
}

/**
 * @param strength - The {@linkcode PartyMemberStrength} of a generated Pokemon
 * @returns The level of the generated Pokemon
 */
export function getPartyPokemonLevel(strength: PartyMemberStrength): number {
  let multiplier = getStrengthLevelMultiplier(strength);
  let levelOffset = 0;

  const scaledWaveIndex = globalScene.gameMode.getWaveForDifficulty(globalScene.currentBattle.waveIndex);
  const baseLevel = getLevelForWaveFunc(scaledWaveIndex);

  /**
   * If the strength is WEAKER, WEAK, or AVERAGE,
   * The multiplier is increased by .025 for every 25 scaled waves, with a max cap of 1.2
   * This means that at a scaled wave index of 200 or higher multiplier will always be 1.2
   *
   * A negative level offset is then applied with a base of -1 for every 50 scaled waves,
   * further scaled by 4 - the scaled multiplier
   */
  if (strength < PartyMemberStrength.STRONG) {
    multiplier = Math.min(multiplier + 0.025 * Math.floor(scaledWaveIndex / 25), 1.2);
    levelOffset = -Math.floor((scaledWaveIndex / 50) * (4 - strength));
  }

  return Math.ceil(baseLevel * multiplier) + levelOffset;
}

/**
 * @param strength - The {@linkcode PartyMemberStrength} of a generated Pokemon
 * @returns the corresponding multiplier used in the Pokemon's level calculation
 * @see {@linkcode getPartyPokemonLevel}
 * @remarks
 * These values are based on {@linkcode LEVEL_CAP_SCALE_FACTOR} which represents the
 * level cap for the current floor. For reference, ordinary wild Pokemon have a 1.0x
 * multiplier which corresponds to WEAK while most trainers have AVERAGE which is 1.1
 * Stronger trainers will have Pokemon at STRONG which is the level cap and STRONGER
 * actually goes over the level cap
 */
function getStrengthLevelMultiplier(strength: PartyMemberStrength): number {
  switch (strength) {
    // Currently this is only being used by Rival 1 to make their initial team level 5
    case PartyMemberStrength.WEAKEST:
      return 0.625;
    case PartyMemberStrength.WEAKER:
      return LEVEL_CAP_SCALE_FACTOR - 0.25;
    case PartyMemberStrength.WEAK:
      return LEVEL_CAP_SCALE_FACTOR - 0.2;
    case PartyMemberStrength.AVERAGE:
      return LEVEL_CAP_SCALE_FACTOR - 0.1;
    case PartyMemberStrength.STRONG:
      return LEVEL_CAP_SCALE_FACTOR;
    case PartyMemberStrength.STRONGER:
      return LEVEL_CAP_SCALE_FACTOR + 0.05;
  }
}

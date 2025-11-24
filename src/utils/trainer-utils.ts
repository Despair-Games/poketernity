import { globalScene } from "#app/global-scene";
import { LEVEL_CAP_SCALE_FACTOR } from "#constants/game-constants";
import { getLevelForWaveFunc } from "#data/exp";
import type { TrainerPartyPokemonConfig } from "#data/new-trainer-config";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { SpeciesId } from "#enums/species-id";

export function getPartyPokemonSpecies(_config: TrainerPartyPokemonConfig): SpeciesId {
  // TODO: Fill this in
  return SpeciesId.MAGIKARP;
}

/**
 * @param strength - The {@linkcode PartyMemberStrength} of a generated Pokemon
 * @param waveIndex - The current wave the player is on (not adjusted for the current game mode)
 * @returns The level of the generated Pokemon
 */
export function getPartyPokemonLevel(strength: PartyMemberStrength, waveIndex: number): number {
  let multiplier = getStrengthLevelMultiplier(strength);
  let levelOffset = 0;

  const scaledWaveIndex = globalScene.gameMode.getWaveForDifficulty(waveIndex);
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

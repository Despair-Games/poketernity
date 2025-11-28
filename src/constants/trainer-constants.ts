import { SpeciesId } from "#enums/species-id";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import type { NonEmptyArray } from "#types/utility-types";

export const RIVAL_SLOT_0_POKEMON = Object.freeze<NonEmptyArray<SpeciesId>>([
  SpeciesId.BULBASAUR,
  SpeciesId.CHARMANDER,
  SpeciesId.SQUIRTLE,
  SpeciesId.CHIKORITA,
  SpeciesId.CYNDAQUIL,
  SpeciesId.TOTODILE,
  SpeciesId.TREECKO,
  SpeciesId.TORCHIC,
  SpeciesId.MUDKIP,
  SpeciesId.TURTWIG,
  SpeciesId.CHIMCHAR,
  SpeciesId.PIPLUP,
  SpeciesId.SNIVY,
  SpeciesId.TEPIG,
  SpeciesId.OSHAWOTT,
  SpeciesId.CHESPIN,
  SpeciesId.FENNEKIN,
  SpeciesId.FROAKIE,
  SpeciesId.ROWLET,
  SpeciesId.LITTEN,
  SpeciesId.POPPLIO,
  SpeciesId.GROOKEY,
  SpeciesId.SCORBUNNY,
  SpeciesId.SOBBLE,
  SpeciesId.SPRIGATITO,
  SpeciesId.FUECOCO,
  SpeciesId.QUAXLY,
]);

export const RIVAL_SLOT_1_POKEMON = Object.freeze<NonEmptyArray<SpeciesId>>([
  SpeciesId.PIDGEY,
  SpeciesId.HOOTHOOT,
  SpeciesId.TAILLOW,
  SpeciesId.STARLY,
  SpeciesId.PIDOVE,
  SpeciesId.FLETCHLING,
  SpeciesId.PIKIPEK,
  SpeciesId.ROOKIDEE,
  SpeciesId.WATTREL,
]);

export const TRAINER_POOL_TIER_WEIGHTS: Readonly<Record<TrainerPoolTier, number>> = {
  [TrainerPoolTier.COMMON]: 356,
  [TrainerPoolTier.UNCOMMON]: 124,
  [TrainerPoolTier.RARE]: 26,
  [TrainerPoolTier.SUPER_RARE]: 5,
  [TrainerPoolTier.ULTRA_RARE]: 1,
} as const;

export const TRAINER_POOL_COMBINED_WEIGHT = Object.values(TRAINER_POOL_TIER_WEIGHTS).reduce((total, w) => total + w);

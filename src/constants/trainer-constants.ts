import { PartyMemberStrength } from "#enums/party-member-strength";
import { SpeciesId } from "#enums/species-id";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import type { NonEmptyArray } from "#types/utility-types";

export const TRAINER_POOL_TIER_WEIGHTS: Readonly<Record<TrainerPoolTier, number>> = {
  [TrainerPoolTier.COMMON]: 356,
  [TrainerPoolTier.UNCOMMON]: 124,
  [TrainerPoolTier.RARE]: 26,
  [TrainerPoolTier.SUPER_RARE]: 5,
  [TrainerPoolTier.ULTRA_RARE]: 1,
} as const;

export const TRAINER_POOL_COMBINED_WEIGHT = Object.values(TRAINER_POOL_TIER_WEIGHTS).reduce((total, w) => total + w);

// #region Rival constants

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

// #region Gym Leader constants

/**
 * A list of {@linkcode PartyMemberStrength} templates for Gym Leader battles.
 * The *i*-th element in this list corresponds with the *(i+1)*-th Gym Leader battle.
 * The length of each template defines the Gym Leader's party size, and each value
 * determines the Pokemon's level in the corresponding party slot.
 */
export const GYM_LEADER_STRENGTH_TEMPLATES = Object.freeze<PartyMemberStrength[][]>([
  [PartyMemberStrength.AVERAGE, PartyMemberStrength.STRONG],
  [PartyMemberStrength.AVERAGE, PartyMemberStrength.STRONG, PartyMemberStrength.STRONGER],
  [...new Array(2).fill(PartyMemberStrength.AVERAGE), PartyMemberStrength.STRONG, PartyMemberStrength.STRONGER],
  [...new Array(3).fill(PartyMemberStrength.AVERAGE), PartyMemberStrength.STRONG, PartyMemberStrength.STRONGER],
  [
    ...new Array(3).fill(PartyMemberStrength.AVERAGE),
    ...new Array(2).fill(PartyMemberStrength.STRONG),
    PartyMemberStrength.STRONGER,
  ],
  [
    ...new Array(2).fill(PartyMemberStrength.AVERAGE),
    ...new Array(3).fill(PartyMemberStrength.STRONG),
    PartyMemberStrength.STRONGER,
  ],
  [PartyMemberStrength.AVERAGE, ...new Array(4).fill(PartyMemberStrength.STRONG), PartyMemberStrength.STRONGER],
]);

import { PartyMemberStrength } from "#enums/party-member-strength";
import { SpeciesId } from "#enums/species-id";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import { TrainerType } from "#enums/trainer-type";
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

/**
 * A list of all standard starters (e.g. Bulbasaur, Charmander, Squirtle).
 * @privateRemarks
 * Needs to be updated for every mainline generation released.
 */
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

// #endregion
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
  [...new Array(5).fill(PartyMemberStrength.STRONG), PartyMemberStrength.STRONGER],
]);

// #endregion
// #region Evil Team constants

export const EVIL_TEAM_GRUNT_TRAINER_POOL = [
  TrainerType.ROCKET_GRUNT,
  TrainerType.MAGMA_GRUNT,
  TrainerType.AQUA_GRUNT,
  TrainerType.GALACTIC_GRUNT,
  TrainerType.PLASMA_GRUNT,
  TrainerType.FLARE_GRUNT,
  TrainerType.AETHER_GRUNT,
  TrainerType.SKULL_GRUNT,
  TrainerType.MACRO_GRUNT,
  TrainerType.STAR_GRUNT,
] as const;

export const EVIL_TEAM_ADMIN_TRAINER_POOL = [
  [TrainerType.ARCHER, TrainerType.ARIANA, TrainerType.PROTON, TrainerType.PETREL],
  [TrainerType.TABITHA, TrainerType.COURTNEY],
  [TrainerType.MATT, TrainerType.SHELLY],
  [TrainerType.JUPITER, TrainerType.MARS, TrainerType.SATURN],
  [TrainerType.ZINZOLIN, TrainerType.ROOD],
  [TrainerType.XEROSIC, TrainerType.BRYONY],
  TrainerType.FABA,
  TrainerType.PLUMERIA,
  TrainerType.OLEANA,
  [TrainerType.GIACOMO, TrainerType.MELA, TrainerType.ATTICUS, TrainerType.ORTEGA, TrainerType.ERI],
] as const;

export const EVIL_TEAM_BOSS_1_TRAINER_POOL = [
  TrainerType.ROCKET_BOSS_GIOVANNI_1,
  TrainerType.MAXIE,
  TrainerType.ARCHIE,
  TrainerType.CYRUS,
  TrainerType.GHETSIS,
  TrainerType.LYSANDRE,
  TrainerType.LUSAMINE,
  TrainerType.GUZMA,
  TrainerType.ROSE,
  TrainerType.PENNY,
] as const;

export const EVIL_TEAM_BOSS_2_TRAINER_POOL = [
  TrainerType.ROCKET_BOSS_GIOVANNI_2,
  TrainerType.MAXIE_2,
  TrainerType.ARCHIE_2,
  TrainerType.CYRUS_2,
  TrainerType.GHETSIS_2,
  TrainerType.LYSANDRE_2,
  TrainerType.LUSAMINE_2,
  TrainerType.GUZMA_2,
  TrainerType.ROSE_2,
  TrainerType.PENNY_2,
] as const;

// #endregion
// #region Elite Four / Champion constants

export const ELITE_FOUR_1_TRAINER_POOL = [
  TrainerType.LORELEI,
  TrainerType.WILL,
  TrainerType.SIDNEY,
  TrainerType.AARON,
  TrainerType.SHAUNTAL,
  TrainerType.MALVA,
  [TrainerType.HALA, TrainerType.MOLAYNE],
  TrainerType.MARNIE_ELITE,
  TrainerType.RIKA,
  TrainerType.CRISPIN,
] as const;

export const ELITE_FOUR_2_TRAINER_POOL = [
  TrainerType.BRUNO,
  TrainerType.KOGA,
  TrainerType.PHOEBE,
  TrainerType.BERTHA,
  TrainerType.MARSHAL,
  TrainerType.SIEBOLD,
  TrainerType.OLIVIA,
  TrainerType.NESSA_ELITE,
  TrainerType.POPPY,
  TrainerType.AMARYS,
] as const;

export const ELITE_FOUR_3_TRAINER_POOL = [
  TrainerType.AGATHA,
  TrainerType.BRUNO,
  TrainerType.GLACIA,
  TrainerType.FLINT,
  TrainerType.GRIMSLEY,
  TrainerType.WIKSTROM,
  TrainerType.ACEROLA,
  [TrainerType.BEA_ELITE, TrainerType.ALLISTER_ELITE],
  TrainerType.LARRY_ELITE,
  TrainerType.LACEY,
] as const;

export const ELITE_FOUR_4_TRAINER_POOL = [
  TrainerType.LANCE,
  TrainerType.KAREN,
  TrainerType.DRAKE,
  TrainerType.LUCIAN,
  TrainerType.CAITLIN,
  TrainerType.DRASNA,
  TrainerType.KAHILI,
  TrainerType.RAIHAN_ELITE,
  TrainerType.HASSEL,
  TrainerType.DRAYTON,
] as const;

export const CHAMPION_TRAINER_POOL = [
  TrainerType.BLUE,
  [TrainerType.RED, TrainerType.LANCE_CHAMPION],
  [TrainerType.STEVEN, TrainerType.WALLACE],
  TrainerType.CYNTHIA,
  [TrainerType.ALDER, TrainerType.IRIS],
  TrainerType.DIANTHA,
  TrainerType.HAU,
  TrainerType.LEON,
  [TrainerType.GEETA, TrainerType.NEMONA],
  TrainerType.KIERAN,
] as const;

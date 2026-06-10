import { PartyMemberStrength } from "#enums/party-member-strength";
import { SpeciesId } from "#enums/species-id";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import { TrainerType } from "#enums/trainer-type";
import type { TieredSpeciesPool } from "#trainers/trainer-config";
import type { NonEmptyArray } from "#types/utility-types";

export const TRAINER_POOL_TIER_WEIGHTS: Readonly<Record<TrainerPoolTier, number>> = {
  [TrainerPoolTier.COMMON]: 356,
  [TrainerPoolTier.UNCOMMON]: 124,
  [TrainerPoolTier.RARE]: 26,
  [TrainerPoolTier.SUPER_RARE]: 5,
  [TrainerPoolTier.ULTRA_RARE]: 1,
} as const;

export const TRAINER_POOL_COMBINED_WEIGHT = Object.values(TRAINER_POOL_TIER_WEIGHTS).reduce((total, w) => total + w);

// #region Generic Trainer constants

export const BACKPACKER_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.RHYHORN,
    SpeciesId.AIPOM,
    SpeciesId.MAKUHITA,
    SpeciesId.MAWILE,
    SpeciesId.NUMEL,
    SpeciesId.LILLIPUP,
    SpeciesId.SANDILE,
    SpeciesId.WOOLOO,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.GIRAFARIG,
    SpeciesId.ZANGOOSE,
    SpeciesId.SEVIPER,
    SpeciesId.CUBCHOO,
    SpeciesId.PANCHAM,
    SpeciesId.SKIDDO,
    SpeciesId.MUDBRAY,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.TAUROS,
    SpeciesId.STANTLER,
    SpeciesId.DARUMAKA,
    SpeciesId.BOUFFALANT,
    SpeciesId.DEERLING,
    SpeciesId.IMPIDIMP,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.GALAR_DARUMAKA, SpeciesId.TEDDIURSA],
});

export const BLACK_BELT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.NIDORAN_F,
    SpeciesId.NIDORAN_M,
    SpeciesId.MACHOP,
    SpeciesId.MAKUHITA,
    SpeciesId.MEDITITE,
    SpeciesId.CROAGUNK,
    SpeciesId.TIMBURR,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.MANKEY,
    SpeciesId.POLIWRATH,
    SpeciesId.TYROGUE,
    SpeciesId.BRELOOM,
    SpeciesId.SCRAGGY,
    SpeciesId.MIENFOO,
    SpeciesId.PANCHAM,
    SpeciesId.STUFFUL,
    SpeciesId.CRABRAWLER,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.HERACROSS,
    SpeciesId.RIOLU,
    SpeciesId.THROH,
    SpeciesId.SAWK,
    SpeciesId.PASSIMIAN,
    SpeciesId.CLOBBOPUS,
  ],
  [TrainerPoolTier.SUPER_RARE]: [
    SpeciesId.HITMONTOP,
    SpeciesId.INFERNAPE,
    SpeciesId.GALLADE,
    SpeciesId.HAWLUCHA,
    SpeciesId.HAKAMO_O,
  ],
  [TrainerPoolTier.ULTRA_RARE]: [SpeciesId.KUBFU],
});

export const CLERK_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.MEOWTH,
    SpeciesId.PSYDUCK,
    SpeciesId.BUDEW,
    SpeciesId.PIDOVE,
    SpeciesId.CINCCINO,
    SpeciesId.LITLEO,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.JIGGLYPUFF,
    SpeciesId.MAGNEMITE,
    SpeciesId.MARILL,
    SpeciesId.COTTONEE,
    SpeciesId.SKIDDO,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.BUIZEL, SpeciesId.SNEASEL, SpeciesId.KLEFKI, SpeciesId.INDEEDEE],
});

export const CYCLIST_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [SpeciesId.PICHU, SpeciesId.STARLY, SpeciesId.TAILLOW, SpeciesId.BOLTUND],
  [TrainerPoolTier.UNCOMMON]: [SpeciesId.DODUO, SpeciesId.ELECTRIKE, SpeciesId.BLITZLE, SpeciesId.WATTREL],
  [TrainerPoolTier.RARE]: [SpeciesId.YANMA, SpeciesId.NINJASK, SpeciesId.WHIRLIPEDE, SpeciesId.EMOLGA],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.ACCELGOR, SpeciesId.DREEPY],
});

export const DANCER_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [SpeciesId.RALTS, SpeciesId.SPOINK, SpeciesId.LOTAD, SpeciesId.BUDEW],
  [TrainerPoolTier.UNCOMMON]: [SpeciesId.SPINDA, SpeciesId.SWABLU, SpeciesId.MARACTUS],
  [TrainerPoolTier.RARE]: [SpeciesId.BELLOSSOM, SpeciesId.HITMONTOP, SpeciesId.MIME_JR, SpeciesId.ORICORIO],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.POPPLIO],
});

export const FISHERMAN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.TENTACOOL,
    SpeciesId.MAGIKARP,
    SpeciesId.GOLDEEN,
    SpeciesId.STARYU,
    SpeciesId.REMORAID,
    SpeciesId.SKRELP,
    SpeciesId.CLAUNCHER,
    SpeciesId.ARROKUDA,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.POLIWAG,
    SpeciesId.SHELLDER,
    SpeciesId.KRABBY,
    SpeciesId.HORSEA,
    SpeciesId.CARVANHA,
    SpeciesId.BARBOACH,
    SpeciesId.CORPHISH,
    SpeciesId.FINNEON,
    SpeciesId.TYMPOLE,
    SpeciesId.BASCULIN,
    SpeciesId.FRILLISH,
    SpeciesId.INKAY,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.CHINCHOU,
    SpeciesId.CORSOLA,
    SpeciesId.WAILMER,
    SpeciesId.BARBOACH,
    SpeciesId.CLAMPERL,
    SpeciesId.LUVDISC,
    SpeciesId.MANTYKE,
    SpeciesId.ALOMOMOLA,
    SpeciesId.TATSUGIRI,
    SpeciesId.VELUZA,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.LAPRAS, SpeciesId.FEEBAS, SpeciesId.RELICANTH, SpeciesId.DONDOZO],
});

export const HIKER_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.SANDSHREW,
    SpeciesId.DIGLETT,
    SpeciesId.GEODUDE,
    SpeciesId.MACHOP,
    SpeciesId.ARON,
    SpeciesId.ROGGENROLA,
    SpeciesId.DRILBUR,
    SpeciesId.NACLI,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.ZUBAT,
    SpeciesId.RHYHORN,
    SpeciesId.ONIX,
    SpeciesId.CUBONE,
    SpeciesId.WOOBAT,
    SpeciesId.SWINUB,
    SpeciesId.NOSEPASS,
    SpeciesId.HIPPOPOTAS,
    SpeciesId.DWEBBLE,
    SpeciesId.KLAWF,
    SpeciesId.TOEDSCOOL,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.TORKOAL,
    SpeciesId.TRAPINCH,
    SpeciesId.BARBOACH,
    SpeciesId.GOLETT,
    SpeciesId.ALOLA_DIGLETT,
    SpeciesId.ALOLA_GEODUDE,
    SpeciesId.GALAR_STUNFISK,
    SpeciesId.PALDEA_WOOPER,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.MAGBY, SpeciesId.LARVITAR],
});

export const OFFICER_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.VULPIX,
    SpeciesId.GROWLITHE,
    SpeciesId.SNUBBULL,
    SpeciesId.POOCHYENA,
    SpeciesId.ELECTRIKE,
    SpeciesId.LILLIPUP,
    SpeciesId.YAMPER,
    SpeciesId.FIDOUGH,
  ],
  [TrainerPoolTier.UNCOMMON]: [SpeciesId.HOUNDOUR, SpeciesId.ROCKRUFF, SpeciesId.MASCHIFF],
  [TrainerPoolTier.RARE]: [SpeciesId.JOLTEON, SpeciesId.RIOLU],
  [TrainerPoolTier.SUPER_RARE]: [],
  [TrainerPoolTier.ULTRA_RARE]: [SpeciesId.ENTEI, SpeciesId.SUICUNE, SpeciesId.RAIKOU],
});

export const PRESCHOOLER_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.CATERPIE,
    SpeciesId.PICHU,
    SpeciesId.SANDSHREW,
    SpeciesId.LEDYBA,
    SpeciesId.BUDEW,
    SpeciesId.BURMY,
    SpeciesId.WOOLOO,
    SpeciesId.PAWMI,
    SpeciesId.SMOLIV,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.EEVEE,
    SpeciesId.CLEFFA,
    SpeciesId.IGGLYBUFF,
    SpeciesId.SWINUB,
    SpeciesId.WOOPER,
    SpeciesId.DRIFLOON,
    SpeciesId.DEDENNE,
    SpeciesId.STUFFUL,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.RALTS, SpeciesId.RIOLU, SpeciesId.JOLTIK, SpeciesId.TANDEMAUS],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.DARUMAKA, SpeciesId.TINKATINK],
});

export const PSYCHIC_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.ABRA,
    SpeciesId.DROWZEE,
    SpeciesId.RALTS,
    SpeciesId.SPOINK,
    SpeciesId.GOTHITA,
    SpeciesId.SOLOSIS,
    SpeciesId.BLIPBUG,
    SpeciesId.ESPURR,
    SpeciesId.HATENNA,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.MIME_JR,
    SpeciesId.EXEGGCUTE,
    SpeciesId.MEDITITE,
    SpeciesId.NATU,
    SpeciesId.EXEGGCUTE,
    SpeciesId.WOOBAT,
    SpeciesId.INKAY,
    SpeciesId.ORANGURU,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.ELGYEM,
    SpeciesId.SIGILYPH,
    SpeciesId.BALTOY,
    SpeciesId.GIRAFARIG,
    SpeciesId.MEOWSTIC,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.BELDUM, SpeciesId.ESPEON, SpeciesId.STANTLER],
});

export const RANGER_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.PICHU,
    SpeciesId.GROWLITHE,
    SpeciesId.PONYTA,
    SpeciesId.ZIGZAGOON,
    SpeciesId.SEEDOT,
    SpeciesId.BIDOOF,
    SpeciesId.RIOLU,
    SpeciesId.SEWADDLE,
    SpeciesId.SKIDDO,
    SpeciesId.SALANDIT,
    SpeciesId.YAMPER,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.AZURILL,
    SpeciesId.TAUROS,
    SpeciesId.MAREEP,
    SpeciesId.FARFETCHD,
    SpeciesId.TEDDIURSA,
    SpeciesId.SHROOMISH,
    SpeciesId.ELECTRIKE,
    SpeciesId.BUDEW,
    SpeciesId.BUIZEL,
    SpeciesId.MUDBRAY,
    SpeciesId.STUFFUL,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.EEVEE,
    SpeciesId.SCYTHER,
    SpeciesId.KANGASKHAN,
    SpeciesId.RALTS,
    SpeciesId.MUNCHLAX,
    SpeciesId.ZORUA,
    SpeciesId.PALDEA_TAUROS,
    SpeciesId.TINKATINK,
    SpeciesId.CYCLIZAR,
    SpeciesId.FLAMIGO,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.LARVESTA],
});

export const SCIENTIST_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.MAGNEMITE,
    SpeciesId.GRIMER,
    SpeciesId.DROWZEE,
    SpeciesId.VOLTORB,
    SpeciesId.KOFFING,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.BALTOY,
    SpeciesId.BRONZOR,
    SpeciesId.FERROSEED,
    SpeciesId.KLINK,
    SpeciesId.CHARJABUG,
    SpeciesId.BLIPBUG,
    SpeciesId.HELIOPTILE,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.ABRA,
    SpeciesId.DITTO,
    SpeciesId.PORYGON,
    SpeciesId.ELEKID,
    SpeciesId.SOLOSIS,
    SpeciesId.GALAR_WEEZING,
  ],
  [TrainerPoolTier.SUPER_RARE]: [
    SpeciesId.OMANYTE,
    SpeciesId.KABUTO,
    SpeciesId.AERODACTYL,
    SpeciesId.LILEEP,
    SpeciesId.ANORITH,
    SpeciesId.CRANIDOS,
    SpeciesId.SHIELDON,
    SpeciesId.TIRTOUGA,
    SpeciesId.ARCHEN,
    SpeciesId.ARCTOVISH,
    SpeciesId.ARCTOZOLT,
    SpeciesId.DRACOVISH,
    SpeciesId.DRACOZOLT,
  ],
  [TrainerPoolTier.ULTRA_RARE]: [SpeciesId.ROTOM, SpeciesId.MELTAN],
});

export const SCHOOL_KID_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.ODDISH,
    SpeciesId.EXEGGCUTE,
    SpeciesId.TEDDIURSA,
    SpeciesId.WURMPLE,
    SpeciesId.RALTS,
    SpeciesId.SHROOMISH,
    SpeciesId.FLETCHLING,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.VOLTORB,
    SpeciesId.WHISMUR,
    SpeciesId.MEDITITE,
    SpeciesId.MIME_JR,
    SpeciesId.NYMBLE,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.TANGELA, SpeciesId.EEVEE, SpeciesId.YANMA],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.TADBULB],
});

export const WAITER_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.CLEFFA,
    SpeciesId.CHATOT,
    SpeciesId.PANSAGE,
    SpeciesId.PANSEAR,
    SpeciesId.PANPOUR,
    SpeciesId.MINCCINO,
  ],
  [TrainerPoolTier.UNCOMMON]: [SpeciesId.TROPIUS, SpeciesId.PETILIL, SpeciesId.BOUNSWEET, SpeciesId.INDEEDEE],
  [TrainerPoolTier.RARE]: [SpeciesId.APPLIN, SpeciesId.SINISTEA, SpeciesId.POLTCHAGEIST],
});

export const YOUNGSTER_SPECIES_POOL = Object.freeze<NonEmptyArray<SpeciesId>>([
  SpeciesId.CATERPIE,
  SpeciesId.WEEDLE,
  SpeciesId.RATTATA,
  SpeciesId.SENTRET,
  SpeciesId.POOCHYENA,
  SpeciesId.ZIGZAGOON,
  SpeciesId.WURMPLE,
  SpeciesId.BIDOOF,
  SpeciesId.PATRAT,
  SpeciesId.LILLIPUP,
]);

// #endregion
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

export const ROCKET_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.WEEDLE,
    SpeciesId.RATTATA,
    SpeciesId.EKANS,
    SpeciesId.SANDSHREW,
    SpeciesId.ZUBAT,
    SpeciesId.GEODUDE,
    SpeciesId.KOFFING,
    SpeciesId.GRIMER,
    SpeciesId.ODDISH,
    SpeciesId.SLOWPOKE,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.GYARADOS,
    SpeciesId.LICKITUNG,
    SpeciesId.TAUROS,
    SpeciesId.MANKEY,
    SpeciesId.SCYTHER,
    SpeciesId.ELEKID,
    SpeciesId.MAGBY,
    SpeciesId.CUBONE,
    SpeciesId.GROWLITHE,
    SpeciesId.MURKROW,
    SpeciesId.GASTLY,
    SpeciesId.EXEGGCUTE,
    SpeciesId.VOLTORB,
    SpeciesId.MAGNEMITE,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.PORYGON,
    SpeciesId.ALOLA_RATTATA,
    SpeciesId.ALOLA_SANDSHREW,
    SpeciesId.ALOLA_MEOWTH,
    SpeciesId.ALOLA_GRIMER,
    SpeciesId.ALOLA_GEODUDE,
    SpeciesId.PALDEA_TAUROS,
    SpeciesId.OMANYTE,
    SpeciesId.KABUTO,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.DRATINI, SpeciesId.LARVITAR],
});

export const ROCKET_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.RATTATA,
    SpeciesId.KOFFING,
    SpeciesId.EKANS,
    SpeciesId.ZUBAT,
    SpeciesId.MAGIKARP,
    SpeciesId.HOUNDOUR,
    SpeciesId.ONIX,
    SpeciesId.CUBONE,
    SpeciesId.GROWLITHE,
    SpeciesId.MURKROW,
    SpeciesId.GASTLY,
    SpeciesId.EXEGGCUTE,
    SpeciesId.VOLTORB,
    SpeciesId.DROWZEE,
    SpeciesId.VILEPLUME,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.PORYGON,
    SpeciesId.MANKEY,
    SpeciesId.MAGNEMITE,
    SpeciesId.ALOLA_SANDSHREW,
    SpeciesId.ALOLA_MEOWTH,
    SpeciesId.ALOLA_GRIMER,
    SpeciesId.ALOLA_GEODUDE,
    SpeciesId.PALDEA_TAUROS,
    SpeciesId.OMANYTE,
    SpeciesId.KABUTO,
    SpeciesId.MAGBY,
    SpeciesId.ELEKID,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.DRATINI, SpeciesId.LARVITAR],
});

export const MAGMA_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.SLUGMA,
    SpeciesId.POOCHYENA,
    SpeciesId.NUMEL,
    SpeciesId.ZIGZAGOON,
    SpeciesId.DIGLETT,
    SpeciesId.MAGBY,
    SpeciesId.TORKOAL,
    SpeciesId.GROWLITHE,
    SpeciesId.BALTOY,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.SOLROCK,
    SpeciesId.HIPPOPOTAS,
    SpeciesId.SANDACONDA,
    SpeciesId.PHANPY,
    SpeciesId.ROLYCOLY,
    SpeciesId.GLIGAR,
    SpeciesId.RHYHORN,
    SpeciesId.HEATMOR,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.TRAPINCH,
    SpeciesId.LILEEP,
    SpeciesId.ANORITH,
    SpeciesId.HISUI_GROWLITHE,
    SpeciesId.TURTONATOR,
    SpeciesId.ARON,
    SpeciesId.TOEDSCOOL,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.CAPSAKID, SpeciesId.CHARCADET],
});

export const MAGMA_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.GROWLITHE,
    SpeciesId.SLUGMA,
    SpeciesId.SOLROCK,
    SpeciesId.HIPPOPOTAS,
    SpeciesId.BALTOY,
    SpeciesId.ROLYCOLY,
    SpeciesId.GLIGAR,
    SpeciesId.TORKOAL,
    SpeciesId.HOUNDOUR,
    SpeciesId.MAGBY,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.TRAPINCH,
    SpeciesId.SILICOBRA,
    SpeciesId.RHYHORN,
    SpeciesId.ANORITH,
    SpeciesId.LILEEP,
    SpeciesId.HISUI_GROWLITHE,
    SpeciesId.TURTONATOR,
    SpeciesId.ARON,
    SpeciesId.TOEDSCOOL,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.CAPSAKID, SpeciesId.CHARCADET],
});

export const AQUA_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.CARVANHA,
    SpeciesId.WAILMER,
    SpeciesId.ZIGZAGOON,
    SpeciesId.LOTAD,
    SpeciesId.CORPHISH,
    SpeciesId.SPHEAL,
    SpeciesId.REMORAID,
    SpeciesId.QWILFISH,
    SpeciesId.BARBOACH,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.CLAMPERL,
    SpeciesId.CHINCHOU,
    SpeciesId.WOOPER,
    SpeciesId.WINGULL,
    SpeciesId.TENTACOOL,
    SpeciesId.AZURILL,
    SpeciesId.CLOBBOPUS,
    SpeciesId.HORSEA,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.MANTYKE,
    SpeciesId.DHELMISE,
    SpeciesId.HISUI_QWILFISH,
    SpeciesId.ARROKUDA,
    SpeciesId.PALDEA_WOOPER,
    SpeciesId.SKRELP,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.DONDOZO, SpeciesId.BASCULEGION],
});

export const AQUA_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.CORPHISH,
    SpeciesId.SPHEAL,
    SpeciesId.CLAMPERL,
    SpeciesId.CHINCHOU,
    SpeciesId.WOOPER,
    SpeciesId.WINGULL,
    SpeciesId.TENTACOOL,
    SpeciesId.AZURILL,
    SpeciesId.LOTAD,
    SpeciesId.WAILMER,
    SpeciesId.REMORAID,
    SpeciesId.BARBOACH,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.MANTYKE,
    SpeciesId.HISUI_QWILFISH,
    SpeciesId.ARROKUDA,
    SpeciesId.DHELMISE,
    SpeciesId.CLOBBOPUS,
    SpeciesId.FEEBAS,
    SpeciesId.PALDEA_WOOPER,
    SpeciesId.HORSEA,
    SpeciesId.SKRELP,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.DONDOZO, SpeciesId.BASCULEGION],
});

export const GALACTIC_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.GLAMEOW,
    SpeciesId.STUNKY,
    SpeciesId.CROAGUNK,
    SpeciesId.SHINX,
    SpeciesId.WURMPLE,
    SpeciesId.BRONZOR,
    SpeciesId.DRIFLOON,
    SpeciesId.BURMY,
    SpeciesId.CARNIVINE,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.LICKITUNG,
    SpeciesId.RHYHORN,
    SpeciesId.TANGELA,
    SpeciesId.ZUBAT,
    SpeciesId.YANMA,
    SpeciesId.SKORUPI,
    SpeciesId.GLIGAR,
    SpeciesId.SWINUB,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.HISUI_GROWLITHE,
    SpeciesId.HISUI_QWILFISH,
    SpeciesId.SNEASEL,
    SpeciesId.ELEKID,
    SpeciesId.MAGBY,
    SpeciesId.DUSKULL,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.ROTOM, SpeciesId.SPIRITOMB, SpeciesId.HISUI_SNEASEL],
});

export const GALACTIC_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.BRONZOR,
    SpeciesId.SWINUB,
    SpeciesId.YANMA,
    SpeciesId.LICKITUNG,
    SpeciesId.TANGELA,
    SpeciesId.MAGBY,
    SpeciesId.ELEKID,
    SpeciesId.SKORUPI,
    SpeciesId.ZUBAT,
    SpeciesId.MURKROW,
    SpeciesId.MAGIKARP,
    SpeciesId.VOLTORB,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.HISUI_GROWLITHE,
    SpeciesId.HISUI_QWILFISH,
    SpeciesId.SNEASEL,
    SpeciesId.DUSKULL,
    SpeciesId.ROTOM,
    SpeciesId.HISUI_VOLTORB,
    SpeciesId.GLIGAR,
    SpeciesId.ABRA,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.URSALUNA, SpeciesId.HISUI_LILLIGANT, SpeciesId.SPIRITOMB, SpeciesId.HISUI_SNEASEL],
});

export const PLASMA_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.PATRAT,
    SpeciesId.LILLIPUP,
    SpeciesId.PURRLOIN,
    SpeciesId.SCRAFTY,
    SpeciesId.WOOBAT,
    SpeciesId.VANILLITE,
    SpeciesId.SANDILE,
    SpeciesId.TRUBBISH,
    SpeciesId.TYMPOLE,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.FRILLISH,
    SpeciesId.VENIPEDE,
    SpeciesId.GOLETT,
    SpeciesId.TIMBURR,
    SpeciesId.DARUMAKA,
    SpeciesId.FOONGUS,
    SpeciesId.JOLTIK,
    SpeciesId.CUBCHOO,
    SpeciesId.KLINK,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.PAWNIARD,
    SpeciesId.RUFFLET,
    SpeciesId.VULLABY,
    SpeciesId.ZORUA,
    SpeciesId.DRILBUR,
    SpeciesId.MIENFOO,
    SpeciesId.DURANT,
    SpeciesId.BOUFFALANT,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.DRUDDIGON, SpeciesId.HISUI_ZORUA, SpeciesId.AXEW, SpeciesId.DEINO],
});

export const PLASMA_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.YAMASK,
    SpeciesId.ROGGENROLA,
    SpeciesId.JOLTIK,
    SpeciesId.TYMPOLE,
    SpeciesId.FRILLISH,
    SpeciesId.FERROSEED,
    SpeciesId.SANDILE,
    SpeciesId.TIMBURR,
    SpeciesId.DARUMAKA,
    SpeciesId.FOONGUS,
    SpeciesId.CUBCHOO,
    SpeciesId.VANILLITE,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.PAWNIARD,
    SpeciesId.VULLABY,
    SpeciesId.ZORUA,
    SpeciesId.DRILBUR,
    SpeciesId.KLINK,
    SpeciesId.TYNAMO,
    SpeciesId.GALAR_DARUMAKA,
    SpeciesId.GOLETT,
    SpeciesId.MIENFOO,
    SpeciesId.DURANT,
    SpeciesId.SIGILYPH,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.HISUI_ZORUA, SpeciesId.AXEW, SpeciesId.DEINO, SpeciesId.HISUI_BRAVIARY],
});

export const FLARE_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.FLETCHLING,
    SpeciesId.LITLEO,
    SpeciesId.PONYTA,
    SpeciesId.INKAY,
    SpeciesId.HOUNDOUR,
    SpeciesId.SKORUPI,
    SpeciesId.SCRAFTY,
    SpeciesId.CROAGUNK,
    SpeciesId.SCATTERBUG,
    SpeciesId.ESPURR,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.HELIOPTILE,
    SpeciesId.ELECTRIKE,
    SpeciesId.SKRELP,
    SpeciesId.PANCHAM,
    SpeciesId.PURRLOIN,
    SpeciesId.POOCHYENA,
    SpeciesId.BINACLE,
    SpeciesId.CLAUNCHER,
    SpeciesId.PUMPKABOO,
    SpeciesId.PHANTUMP,
    SpeciesId.FOONGUS,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.LITWICK, SpeciesId.SNEASEL, SpeciesId.PAWNIARD, SpeciesId.SLIGGOO],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.NOIBAT, SpeciesId.HISUI_SLIGGOO, SpeciesId.HISUI_AVALUGG],
});

export const FLARE_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.FLETCHLING,
    SpeciesId.LITLEO,
    SpeciesId.INKAY,
    SpeciesId.FOONGUS,
    SpeciesId.HELIOPTILE,
    SpeciesId.ELECTRIKE,
    SpeciesId.SKORUPI,
    SpeciesId.PURRLOIN,
    SpeciesId.CLAWITZER,
    SpeciesId.PANCHAM,
    SpeciesId.ESPURR,
    SpeciesId.BUNNELBY,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.LITWICK,
    SpeciesId.SNEASEL,
    SpeciesId.PUMPKABOO,
    SpeciesId.PHANTUMP,
    SpeciesId.HONEDGE,
    SpeciesId.BINACLE,
    SpeciesId.HOUNDOUR,
    SpeciesId.SKRELP,
    SpeciesId.SLIGGOO,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.NOIBAT, SpeciesId.HISUI_AVALUGG, SpeciesId.HISUI_SLIGGOO],
});

export const AETHER_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.PIKIPEK,
    SpeciesId.ROCKRUFF,
    SpeciesId.ALOLA_DIGLETT,
    SpeciesId.ALOLA_EXEGGUTOR,
    SpeciesId.YUNGOOS,
    SpeciesId.CORSOLA,
    SpeciesId.ALOLA_GEODUDE,
    SpeciesId.ALOLA_RAICHU,
    SpeciesId.BOUNSWEET,
    SpeciesId.LILLIPUP,
    SpeciesId.KOMALA,
    SpeciesId.MORELULL,
    SpeciesId.COMFEY,
    SpeciesId.TOGEDEMARU,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.POLIWAG,
    SpeciesId.STUFFUL,
    SpeciesId.ORANGURU,
    SpeciesId.PASSIMIAN,
    SpeciesId.BRUXISH,
    SpeciesId.MINIOR,
    SpeciesId.WISHIWASHI,
    SpeciesId.ALOLA_SANDSHREW,
    SpeciesId.ALOLA_VULPIX,
    SpeciesId.CRABRAWLER,
    SpeciesId.CUTIEFLY,
    SpeciesId.ORICORIO,
    SpeciesId.MUDBRAY,
    SpeciesId.PYUKUMUKU,
    SpeciesId.ALOLA_MAROWAK,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.GALAR_CORSOLA,
    SpeciesId.TURTONATOR,
    SpeciesId.MIMIKYU,
    SpeciesId.MAGNEMITE,
    SpeciesId.DRAMPA,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.JANGMO_O, SpeciesId.PORYGON],
});

export const AETHER_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.BRUXISH,
    SpeciesId.SLOWPOKE,
    SpeciesId.BALTOY,
    SpeciesId.EXEGGCUTE,
    SpeciesId.ABRA,
    SpeciesId.ALOLA_RAICHU,
    SpeciesId.ELGYEM,
    SpeciesId.NATU,
    SpeciesId.BLIPBUG,
    SpeciesId.GIRAFARIG,
    SpeciesId.ORANGURU,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.GALAR_SLOWPOKE,
    SpeciesId.MEDITITE,
    SpeciesId.BELDUM,
    SpeciesId.HATENNA,
    SpeciesId.INKAY,
    SpeciesId.RALTS,
    SpeciesId.GALAR_MR_MIME,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.ARMAROUGE, SpeciesId.HISUI_BRAVIARY, SpeciesId.PORYGON],
});

export const SKULL_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.SALANDIT,
    SpeciesId.ALOLA_RATTATA,
    SpeciesId.EKANS,
    SpeciesId.ALOLA_MEOWTH,
    SpeciesId.SCRAGGY,
    SpeciesId.KOFFING,
    SpeciesId.ALOLA_GRIMER,
    SpeciesId.MAREANIE,
    SpeciesId.SPINARAK,
    SpeciesId.TRUBBISH,
    SpeciesId.DROWZEE,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.FOMANTIS,
    SpeciesId.SABLEYE,
    SpeciesId.SANDILE,
    SpeciesId.HOUNDOUR,
    SpeciesId.ALOLA_MAROWAK,
    SpeciesId.GASTLY,
    SpeciesId.PANCHAM,
    SpeciesId.ZUBAT,
    SpeciesId.VENIPEDE,
    SpeciesId.VULLABY,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.SANDYGAST,
    SpeciesId.PAWNIARD,
    SpeciesId.MIMIKYU,
    SpeciesId.DHELMISE,
    SpeciesId.WISHIWASHI,
    SpeciesId.NYMBLE,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.GRUBBIN, SpeciesId.DEWPIDER],
});

export const SKULL_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.MAREANIE,
    SpeciesId.ALOLA_GRIMER,
    SpeciesId.GASTLY,
    SpeciesId.ZUBAT,
    SpeciesId.FOMANTIS,
    SpeciesId.VENIPEDE,
    SpeciesId.BUDEW,
    SpeciesId.KOFFING,
    SpeciesId.STUNKY,
    SpeciesId.CROAGUNK,
    SpeciesId.NIDORAN_F,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.GALAR_SLOWPOKE,
    SpeciesId.SKORUPI,
    SpeciesId.PALDEA_WOOPER,
    SpeciesId.VULLABY,
    SpeciesId.HISUI_QWILFISH,
    SpeciesId.GLIMMET,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.SKRELP, SpeciesId.HISUI_SNEASEL],
});

export const MACRO_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.CUFANT,
    SpeciesId.GALAR_MEOWTH,
    SpeciesId.KLINK,
    SpeciesId.ROOKIDEE,
    SpeciesId.CRAMORANT,
    SpeciesId.GALAR_ZIGZAGOON,
    SpeciesId.SKWOVET,
    SpeciesId.STEELIX,
    SpeciesId.MAWILE,
    SpeciesId.FERROSEED,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.DRILBUR,
    SpeciesId.MAGNEMITE,
    SpeciesId.HATENNA,
    SpeciesId.ARROKUDA,
    SpeciesId.APPLIN,
    SpeciesId.GALAR_PONYTA,
    SpeciesId.GALAR_YAMASK,
    SpeciesId.SINISTEA,
    SpeciesId.RIOLU,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.FALINKS,
    SpeciesId.BELDUM,
    SpeciesId.GALAR_FARFETCHD,
    SpeciesId.GALAR_MR_MIME,
    SpeciesId.HONEDGE,
    SpeciesId.SCIZOR,
    SpeciesId.GALAR_DARUMAKA,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.DURALUDON, SpeciesId.DREEPY],
});

export const MACRO_ADMIN_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.HATENNA,
    SpeciesId.FEEBAS,
    SpeciesId.BOUNSWEET,
    SpeciesId.SALANDIT,
    SpeciesId.GALAR_PONYTA,
    SpeciesId.GOTHITA,
    SpeciesId.FROSLASS,
    SpeciesId.VULPIX,
    SpeciesId.FRILLISH,
    SpeciesId.ODDISH,
    SpeciesId.SINISTEA,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.VULLABY,
    SpeciesId.MAREANIE,
    SpeciesId.ALOLA_VULPIX,
    SpeciesId.TOGEPI,
    SpeciesId.GALAR_CORSOLA,
    SpeciesId.APPLIN,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.TINKATINK, SpeciesId.HISUI_LILLIGANT],
});

export const STAR_GRUNT_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.DUNSPARCE,
    SpeciesId.HOUNDOUR,
    SpeciesId.AZURILL,
    SpeciesId.GULPIN,
    SpeciesId.FOONGUS,
    SpeciesId.FLETCHLING,
    SpeciesId.LITLEO,
    SpeciesId.FLABEBE,
    SpeciesId.CRABRAWLER,
    SpeciesId.NYMBLE,
    SpeciesId.PAWMI,
    SpeciesId.FIDOUGH,
    SpeciesId.SQUAWKABILLY,
    SpeciesId.MASCHIFF,
    SpeciesId.SHROODLE,
    SpeciesId.KLAWF,
    SpeciesId.WIGLETT,
    SpeciesId.PALDEA_WOOPER,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.KOFFING,
    SpeciesId.EEVEE,
    SpeciesId.GIRAFARIG,
    SpeciesId.RALTS,
    SpeciesId.TORKOAL,
    SpeciesId.SEVIPER,
    SpeciesId.SCRAGGY,
    SpeciesId.ZORUA,
    SpeciesId.MIMIKYU,
    SpeciesId.IMPIDIMP,
    SpeciesId.FALINKS,
    SpeciesId.CAPSAKID,
    SpeciesId.TINKATINK,
    SpeciesId.BOMBIRDIER,
    SpeciesId.CYCLIZAR,
    SpeciesId.FLAMIGO,
    SpeciesId.PALDEA_TAUROS,
  ],
  [TrainerPoolTier.RARE]: [
    SpeciesId.MANKEY,
    SpeciesId.PAWNIARD,
    SpeciesId.CHARCADET,
    SpeciesId.FLITTLE,
    SpeciesId.VAROOM,
    SpeciesId.ORTHWORM,
  ],
  [TrainerPoolTier.SUPER_RARE]: [SpeciesId.DONDOZO, SpeciesId.GIMMIGHOUL],
});

export const GIACOMO_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.MURKROW,
    SpeciesId.SEEDOT,
    SpeciesId.CACNEA,
    SpeciesId.STUNKY,
    SpeciesId.SANDILE,
    SpeciesId.NYMBLE,
    SpeciesId.MASCHIFF,
    SpeciesId.GALAR_ZIGZAGOON,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.UMBREON,
    SpeciesId.SNEASEL,
    SpeciesId.CORPHISH,
    SpeciesId.ZORUA,
    SpeciesId.INKAY,
    SpeciesId.BOMBIRDIER,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.DEINO, SpeciesId.SPRIGATITO],
});

export const MELA_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.GROWLITHE,
    SpeciesId.HOUNDOUR,
    SpeciesId.NUMEL,
    SpeciesId.LITWICK,
    SpeciesId.FLETCHLING,
    SpeciesId.LITLEO,
    SpeciesId.ROLYCOLY,
    SpeciesId.CAPSAKID,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.PONYTA,
    SpeciesId.FLAREON,
    SpeciesId.MAGBY,
    SpeciesId.TORKOAL,
    SpeciesId.SALANDIT,
    SpeciesId.TURTONATOR,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.LARVESTA, SpeciesId.FUECOCO],
});

export const ATTICUS_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.ZUBAT,
    SpeciesId.GRIMER,
    SpeciesId.STUNKY,
    SpeciesId.FOONGUS,
    SpeciesId.MAREANIE,
    SpeciesId.TOXEL,
    SpeciesId.SHROODLE,
    SpeciesId.PALDEA_WOOPER,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.GASTLY,
    SpeciesId.SEVIPER,
    SpeciesId.SKRELP,
    SpeciesId.ALOLA_GRIMER,
    SpeciesId.GALAR_SLOWPOKE,
    SpeciesId.HISUI_QWILFISH,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.GLIMMET, SpeciesId.BULBASAUR],
});

export const ORTEGA_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.CLEFFA,
    SpeciesId.IGGLYBUFF,
    SpeciesId.AZURILL,
    SpeciesId.COTTONEE,
    SpeciesId.FLABEBE,
    SpeciesId.HATENNA,
    SpeciesId.IMPIDIMP,
    SpeciesId.TINKATINK,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.TOGEPI,
    SpeciesId.GARDEVOIR,
    SpeciesId.SYLVEON,
    SpeciesId.KLEFKI,
    SpeciesId.MIMIKYU,
    SpeciesId.ALOLA_VULPIX,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.GALAR_PONYTA, SpeciesId.POPPLIO],
});

export const ERI_SPECIES_POOL: TieredSpeciesPool = Object.freeze({
  [TrainerPoolTier.COMMON]: [
    SpeciesId.SHROOMISH,
    SpeciesId.MAKUHITA,
    SpeciesId.MEDITITE,
    SpeciesId.CROAGUNK,
    SpeciesId.SCRAGGY,
    SpeciesId.MIENFOO,
    SpeciesId.PAWMI,
    SpeciesId.PALDEA_TAUROS,
  ],
  [TrainerPoolTier.UNCOMMON]: [
    SpeciesId.RIOLU,
    SpeciesId.TIMBURR,
    SpeciesId.HAWLUCHA,
    SpeciesId.PASSIMIAN,
    SpeciesId.FALINKS,
    SpeciesId.FLAMIGO,
  ],
  [TrainerPoolTier.RARE]: [SpeciesId.JANGMO_O, SpeciesId.QUAXLY],
});

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

export const ELITE_FOUR_MINIMUM_BST = 460;

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

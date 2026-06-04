import { PartyMemberStrength } from "#enums/party-member-strength";
import { SpeciesId } from "#enums/species-id";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import { TrainerType } from "#enums/trainer-type";
import type { TieredSpeciesPool } from "#trainers/new-trainer-config";
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

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
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import {
  getRandomPartyMemberFunc,
  getWavePartyTemplate,
  TrainerConfig,
  type TrainerConfigs,
  trainerPartyTemplates,
} from "#trainers/trainer-config";
import { levelByStrength, minWaveCondition, TrainerConfigBuilder } from "#trainers/trainer-config-builder";
import { trainerNamePools } from "#trainers/trainer-names";

/**
 * If a trainer does not have any species filter then they use the default
 * filters of excluding sublegendary, legendary, mythic, eternal floette, and bloodmoon ursaluna
 */
export const genericTrainerConfigs: TrainerConfigs = {
  [TrainerType.UNKNOWN]: new TrainerConfig(TrainerType.UNKNOWN).setHasGenders(),
  [TrainerType.ACE_TRAINER]: new TrainerConfig(TrainerType.ACE_TRAINER)
    .setHasGenders("Ace Trainer Female")
    .setHasDouble("Ace Duo")
    .setMoneyMultiplier(2.25)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setPartyTemplateFunc(() =>
      getWavePartyTemplate(
        trainerPartyTemplates.THREE_WEAK_BALANCED,
        trainerPartyTemplates.FOUR_WEAK_BALANCED,
        trainerPartyTemplates.FIVE_WEAK_BALANCED,
        trainerPartyTemplates.SIX_WEAK_BALANCED,
      ),
    ),
  [TrainerType.ARTIST]: new TrainerConfig(TrainerType.ARTIST)
    .setEncounterBgm(TrainerType.RICH)
    .setPartyTemplates(trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.THREE_AVG)
    .setSpeciesPools([SpeciesId.SMEARGLE]),
  [TrainerType.BACKERS]: new TrainerConfig(TrainerType.BACKERS)
    .setHasGenders("Backers")
    .setDoubleOnly()
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.BACKPACKER]: new TrainerConfig(TrainerType.BACKPACKER)
    .setHasGenders("Backpacker Female")
    .setHasDouble("Backpackers")
    .setSpeciesFilter((s) => s.isOfType(ElementalType.FLYING) || s.isOfType(ElementalType.ROCK))
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setPartyTemplates(
      trainerPartyTemplates.ONE_STRONG,
      trainerPartyTemplates.ONE_WEAK_ONE_STRONG,
      trainerPartyTemplates.ONE_AVG_ONE_STRONG,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.BAKER]: new TrainerConfig(TrainerType.BAKER)
    .setEncounterBgm(TrainerType.CLERK)
    .setMoneyMultiplier(1.35)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.GRASS) || s.isOfType(ElementalType.FIRE)),
  [TrainerType.BEAUTY]: new TrainerConfig(TrainerType.BEAUTY)
    .setMoneyMultiplier(1.55)
    .setEncounterBgm(TrainerType.PARASOL_LADY),
  [TrainerType.BIKER]: new TrainerConfig(TrainerType.BIKER)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.POISON)),
  [TrainerType.BLACK_BELT]: new TrainerConfig(TrainerType.BLACK_BELT)
    .setHasGenders("Battle Girl", TrainerType.PSYCHIC)
    .setHasDouble("Crush Kin")
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpecialtyTypes(ElementalType.FIGHTING)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_WEAK_ONE_AVG,
      trainerPartyTemplates.TWO_WEAK_ONE_AVG,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.TWO_WEAK_ONE_STRONG,
      trainerPartyTemplates.THREE_AVG,
      trainerPartyTemplates.TWO_AVG_ONE_STRONG,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.BREEDER]: new TrainerConfig(TrainerType.BREEDER)
    .setMoneyMultiplier(1.325)
    .setEncounterBgm(TrainerType.POKEFAN)
    .setHasGenders("Breeder Female")
    .setHasDouble("Breeders")
    .setPartyTemplateFunc(() =>
      getWavePartyTemplate(
        trainerPartyTemplates.FOUR_WEAKER,
        trainerPartyTemplates.FIVE_WEAKER,
        trainerPartyTemplates.SIX_WEAKER,
      ),
    )
    .setSpeciesFilter((s) => s.baseTotal < 450),
  [TrainerType.CLERK]: new TrainerConfig(TrainerType.CLERK)
    .setHasGenders("Clerk Female")
    .setHasDouble("Colleagues")
    .setEncounterBgm(TrainerType.CLERK)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_WEAK,
      trainerPartyTemplates.THREE_WEAK,
      trainerPartyTemplates.ONE_AVG,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.TWO_WEAK_ONE_AVG,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.CYCLIST]: new TrainerConfig(TrainerType.CYCLIST)
    .setMoneyMultiplier(1.3)
    .setHasGenders("Cyclist Female")
    .setHasDouble("Cyclists")
    .setEncounterBgm(TrainerType.CYCLIST)
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAK, trainerPartyTemplates.ONE_AVG)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [SpeciesId.PICHU, SpeciesId.STARLY, SpeciesId.TAILLOW, SpeciesId.BOLTUND],
      [TrainerPoolTier.UNCOMMON]: [SpeciesId.DODUO, SpeciesId.ELECTRIKE, SpeciesId.BLITZLE, SpeciesId.WATTREL],
      [TrainerPoolTier.RARE]: [SpeciesId.YANMA, SpeciesId.NINJASK, SpeciesId.WHIRLIPEDE, SpeciesId.EMOLGA],
      [TrainerPoolTier.SUPER_RARE]: [SpeciesId.ACCELGOR, SpeciesId.DREEPY],
    }),
  [TrainerType.DANCER]: new TrainerConfig(TrainerType.DANCER)
    .setMoneyMultiplier(1.55)
    .setEncounterBgm(TrainerType.CYCLIST)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_WEAK,
      trainerPartyTemplates.ONE_AVG,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.TWO_WEAK_SAME_TWO_WEAK_SAME,
    )
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [SpeciesId.RALTS, SpeciesId.SPOINK, SpeciesId.LOTAD, SpeciesId.BUDEW],
      [TrainerPoolTier.UNCOMMON]: [SpeciesId.SPINDA, SpeciesId.SWABLU, SpeciesId.MARACTUS],
      [TrainerPoolTier.RARE]: [SpeciesId.BELLOSSOM, SpeciesId.HITMONTOP, SpeciesId.MIME_JR, SpeciesId.ORICORIO],
      [TrainerPoolTier.SUPER_RARE]: [SpeciesId.POPPLIO],
    }),
  [TrainerType.DEPOT_AGENT]: new TrainerConfig(TrainerType.DEPOT_AGENT)
    .setMoneyMultiplier(1.45)
    .setEncounterBgm(TrainerType.CLERK),
  [TrainerType.DOCTOR]: new TrainerConfig(TrainerType.DOCTOR)
    .setHasGenders("Nurse", "lass")
    .setHasDouble("Medical Team")
    .setMoneyMultiplier(3)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => s.getLevelMoves().some((plm) => plm[1] === MoveId.HEAL_PULSE)),
  [TrainerType.FIREBREATHER]: new TrainerConfig(TrainerType.FIREBREATHER)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.getLevelMoves().some((plm) => plm[1] === MoveId.SMOG) || s.isOfType(ElementalType.FIRE)),
  [TrainerType.FISHERMAN]: new TrainerConfig(TrainerType.FISHERMAN)
    .setMoneyMultiplier(1.25)
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setSpecialtyTypes(ElementalType.WATER)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG,
      trainerPartyTemplates.ONE_AVG,
      trainerPartyTemplates.THREE_WEAK_SAME,
      trainerPartyTemplates.ONE_STRONG,
      trainerPartyTemplates.SIX_WEAKER,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.GUITARIST]: new TrainerConfig(TrainerType.GUITARIST)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpecialtyTypes(ElementalType.ELECTRIC)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.ELECTRIC)),
  [TrainerType.HARLEQUIN]: new TrainerConfig(TrainerType.HARLEQUIN)
    .setEncounterBgm(TrainerType.PSYCHIC)
    .setSpeciesFilter((s) => tmSpecies[MoveId.TRICK_ROOM].indexOf(s.speciesId) > -1),
  [TrainerType.HIKER]: new TrainerConfig(TrainerType.HIKER)
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_AVG_SAME_ONE_AVG,
      trainerPartyTemplates.TWO_AVG_SAME_ONE_STRONG,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.FOUR_WEAK,
      trainerPartyTemplates.ONE_STRONG,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.HOOLIGANS]: new TrainerConfig(TrainerType.HOOLIGANS)
    .setDoubleOnly()
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.POISON) || s.isOfType(ElementalType.DARK)),
  [TrainerType.HOOPSTER]: new TrainerConfig(TrainerType.HOOPSTER)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.INFIELDER]: new TrainerConfig(TrainerType.INFIELDER)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.JANITOR]: new TrainerConfig(TrainerType.JANITOR)
    .setMoneyMultiplier(1.1)
    .setEncounterBgm(TrainerType.CLERK),
  [TrainerType.LINEBACKER]: new TrainerConfig(TrainerType.LINEBACKER)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.MAID]: new TrainerConfig(TrainerType.MAID).setMoneyMultiplier(1.6).setEncounterBgm(TrainerType.RICH),
  [TrainerType.MUSICIAN]: new TrainerConfig(TrainerType.MUSICIAN)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.getLevelMoves().some((plm) => plm[1] === MoveId.SING)),
  [TrainerType.HEX_MANIAC]: new TrainerConfig(TrainerType.HEX_MANIAC)
    .setMoneyMultiplier(1.5)
    .setEncounterBgm(TrainerType.PSYCHIC)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.ONE_AVG_ONE_STRONG,
      trainerPartyTemplates.TWO_AVG_SAME_ONE_AVG,
      trainerPartyTemplates.THREE_AVG,
      trainerPartyTemplates.TWO_STRONG,
    )
    .setSpeciesFilter((s) => s.isOfType(ElementalType.GHOST)),
  [TrainerType.NURSERY_AIDE]: new TrainerConfig(TrainerType.NURSERY_AIDE)
    .setMoneyMultiplier(1.3)
    .setEncounterBgm("lass"),
  [TrainerType.OFFICER]: new TrainerConfig(TrainerType.OFFICER)
    .setMoneyMultiplier(1.55)
    .setEncounterBgm(TrainerType.CLERK)
    .setPartyTemplates(
      trainerPartyTemplates.ONE_AVG,
      trainerPartyTemplates.ONE_STRONG,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.PARASOL_LADY]: new TrainerConfig(TrainerType.PARASOL_LADY)
    .setMoneyMultiplier(1.55)
    .setEncounterBgm(TrainerType.PARASOL_LADY)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.WATER)),
  [TrainerType.PILOT]: new TrainerConfig(TrainerType.PILOT)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => tmSpecies[MoveId.FLY].indexOf(s.speciesId) > -1),
  [TrainerType.POKEFAN]: new TrainerConfig(TrainerType.POKEFAN)
    .setMoneyMultiplier(1.4)
    .setName("PokéFan")
    .setHasGenders("PokéFan Female")
    .setHasDouble("PokéFan Family")
    .setEncounterBgm(TrainerType.POKEFAN)
    .setPartyTemplates(
      trainerPartyTemplates.SIX_WEAKER,
      trainerPartyTemplates.FOUR_WEAK,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.ONE_STRONG,
      trainerPartyTemplates.FOUR_WEAK_SAME,
      trainerPartyTemplates.FIVE_WEAK,
      trainerPartyTemplates.SIX_WEAKER_SAME,
    ),
  [TrainerType.PRESCHOOLER]: new TrainerConfig(TrainerType.PRESCHOOLER)
    .setMoneyMultiplier(0.2)
    .setEncounterBgm(TrainerType.YOUNGSTER)
    .setHasGenders("Preschooler Female", "lass")
    .setHasDouble("Preschoolers")
    .setPartyTemplates(
      trainerPartyTemplates.THREE_WEAK,
      trainerPartyTemplates.FOUR_WEAKER,
      trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG,
      trainerPartyTemplates.FIVE_WEAKER,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.PSYCHIC]: new TrainerConfig(TrainerType.PSYCHIC)
    .setHasGenders("Psychic Female")
    .setHasDouble("Psychics")
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.PSYCHIC)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_WEAK,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG,
      trainerPartyTemplates.TWO_WEAK_SAME_TWO_WEAK_SAME,
      trainerPartyTemplates.ONE_STRONGER,
    )
    .setSpeciesPools({
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
    }),
  [TrainerType.RANGER]: new TrainerConfig(TrainerType.RANGER)
    .setMoneyMultiplier(1.4)
    .setName("Pokémon Ranger")
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setHasGenders("Pokémon Ranger Female")
    .setHasDouble("Pokémon Rangers")
    .setSpeciesPools({
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
    }),
  [TrainerType.RICH]: new TrainerConfig(TrainerType.RICH)
    .setMoneyMultiplier(5)
    .setName("Gentleman")
    .setHasGenders("Madame")
    .setHasDouble("Rich Couple"),
  [TrainerType.RICH_KID]: new TrainerConfig(TrainerType.RICH_KID)
    .setMoneyMultiplier(3.75)
    .setName("Rich Boy")
    .setHasGenders("Lady")
    .setHasDouble("Rich Kids")
    .setEncounterBgm(TrainerType.RICH),
  [TrainerType.ROUGHNECK]: new TrainerConfig(TrainerType.ROUGHNECK)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.DARK)),
  [TrainerType.SAILOR]: new TrainerConfig(TrainerType.SAILOR)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.WATER) || s.isOfType(ElementalType.FIGHTING)),
  [TrainerType.SCIENTIST]: new TrainerConfig(TrainerType.SCIENTIST)
    .setHasGenders("Scientist Female")
    .setHasDouble("Scientists")
    .setMoneyMultiplier(1.7)
    .setEncounterBgm(TrainerType.SCIENTIST)
    .setSpeciesPools({
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
    }),
  [TrainerType.SMASHER]: new TrainerConfig(TrainerType.SMASHER)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.SNOW_WORKER]: new TrainerConfig(TrainerType.SNOW_WORKER)
    .setName("Worker")
    .setHasDouble("Workers")
    .setMoneyMultiplier(1.7)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.ICE) || s.isOfType(ElementalType.STEEL)),
  [TrainerType.STRIKER]: new TrainerConfig(TrainerType.STRIKER)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.SCHOOL_KID]: new TrainerConfig(TrainerType.SCHOOL_KID)
    .setMoneyMultiplier(0.75)
    .setEncounterBgm(TrainerType.YOUNGSTER)
    .setHasGenders("School Kid Female", "lass")
    .setHasDouble("School Kids")
    .setSpeciesPools({
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
    }),
  [TrainerType.SWIMMER]: new TrainerConfig(TrainerType.SWIMMER)
    .setMoneyMultiplier(1.3)
    .setEncounterBgm(TrainerType.PARASOL_LADY)
    .setHasGenders("Swimmer Female")
    .setHasDouble("Swimmers")
    .setSpecialtyTypes(ElementalType.WATER)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.WATER)),
  [TrainerType.TWINS]: new TrainerConfig(TrainerType.TWINS)
    .setDoubleOnly()
    .setMoneyMultiplier(0.65)
    .setUseSameSeedForAllMembers()
    .setPartyTemplateFunc(() =>
      getWavePartyTemplate(
        trainerPartyTemplates.TWO_WEAK,
        trainerPartyTemplates.TWO_AVG,
        trainerPartyTemplates.TWO_STRONG,
      ),
    )
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([
        SpeciesId.PLUSLE,
        SpeciesId.VOLBEAT,
        SpeciesId.PACHIRISU,
        SpeciesId.SILCOON,
        SpeciesId.METAPOD,
        SpeciesId.IGGLYBUFF,
        SpeciesId.PETILIL,
        SpeciesId.EEVEE,
      ]),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
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
        TrainerSlot.TRAINER_PARTNER,
      ),
    )
    .setEncounterBgm(TrainerType.TWINS),
  [TrainerType.VETERAN]: new TrainerConfig(TrainerType.VETERAN)
    .setHasGenders("Veteran Female")
    .setHasDouble("Veteran Duo")
    .setMoneyMultiplier(2.5)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.DRAGON)),
  [TrainerType.WAITER]: new TrainerConfig(TrainerType.WAITER)
    .setHasGenders("Waitress")
    .setHasDouble("Restaurant Staff")
    .setMoneyMultiplier(1.5)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesPools({
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
    }),
  [TrainerType.WORKER]: new TrainerConfig(TrainerType.WORKER)
    .setHasGenders("Worker Female")
    .setHasDouble("Workers")
    .setEncounterBgm(TrainerType.CLERK)
    .setMoneyMultiplier(1.7)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.ROCK) || s.isOfType(ElementalType.STEEL)),
  [TrainerType.YOUNGSTER]: new TrainerConfig(TrainerType.YOUNGSTER)
    .setMoneyMultiplier(0.5)
    .setEncounterBgm(TrainerType.YOUNGSTER)
    .setHasGenders("Lass", "lass")
    .setHasDouble("Beginners")
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAKER)
    .setSpeciesPools([
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
    ]),
};

export const newGenericTrainerConfigs: TrainerConfigMap = {
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

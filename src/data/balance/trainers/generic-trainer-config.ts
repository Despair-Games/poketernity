import { Moves } from "#app/enums/moves";
import { Species } from "#app/enums/species";
import { Type } from "#app/enums/type";
import { TrainerType } from "#enums/trainer-type";
import {
  TrainerConfig,
  trainerPartyTemplates,
  TrainerPoolTier,
  getRandomPartyMemberFunc,
  TrainerSlot,
  getWavePartyTemplate,
  TrainerConfigs,
} from "../../trainer-config";
import { tmSpecies } from "../tms";

let t = TrainerType.UNKNOWN;
export const genericTrainerConfigs: TrainerConfigs = {
  [TrainerType.UNKNOWN]: new TrainerConfig(t).setHasGenders(),
  [TrainerType.ACE_TRAINER]: new TrainerConfig(++t)
    .setHasGenders("Ace Trainer Female")
    .setHasDouble("Ace Duo")
    .setMoneyMultiplier(2.25)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setPartyTemplateFunc((scene) =>
      getWavePartyTemplate(
        scene,
        trainerPartyTemplates.THREE_WEAK_BALANCED,
        trainerPartyTemplates.FOUR_WEAK_BALANCED,
        trainerPartyTemplates.FIVE_WEAK_BALANCED,
        trainerPartyTemplates.SIX_WEAK_BALANCED,
      ),
    ),
  [TrainerType.ARTIST]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.RICH)
    .setPartyTemplates(trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.THREE_AVG)
    .setSpeciesPools([Species.SMEARGLE]),
  [TrainerType.BACKERS]: new TrainerConfig(++t)
    .setHasGenders("Backers")
    .setDoubleOnly()
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.BACKPACKER]: new TrainerConfig(++t)
    .setHasGenders("Backpacker Female")
    .setHasDouble("Backpackers")
    .setSpeciesFilter((s) => s.isOfType(Type.FLYING) || s.isOfType(Type.ROCK))
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setPartyTemplates(
      trainerPartyTemplates.ONE_STRONG,
      trainerPartyTemplates.ONE_WEAK_ONE_STRONG,
      trainerPartyTemplates.ONE_AVG_ONE_STRONG,
    )
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.RHYHORN,
        Species.AIPOM,
        Species.MAKUHITA,
        Species.MAWILE,
        Species.NUMEL,
        Species.LILLIPUP,
        Species.SANDILE,
        Species.WOOLOO,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.GIRAFARIG,
        Species.ZANGOOSE,
        Species.SEVIPER,
        Species.CUBCHOO,
        Species.PANCHAM,
        Species.SKIDDO,
        Species.MUDBRAY,
      ],
      [TrainerPoolTier.RARE]: [
        Species.TAUROS,
        Species.STANTLER,
        Species.DARUMAKA,
        Species.BOUFFALANT,
        Species.DEERLING,
        Species.IMPIDIMP,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.GALAR_DARUMAKA, Species.TEDDIURSA],
    }),
  [TrainerType.BAKER]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.CLERK)
    .setMoneyMultiplier(1.35)
    .setSpeciesFilter((s) => s.isOfType(Type.GRASS) || s.isOfType(Type.FIRE)),
  [TrainerType.BEAUTY]: new TrainerConfig(++t).setMoneyMultiplier(1.55).setEncounterBgm(TrainerType.PARASOL_LADY),
  [TrainerType.BIKER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(Type.POISON)),
  [TrainerType.BLACK_BELT]: new TrainerConfig(++t)
    .setHasGenders("Battle Girl", TrainerType.PSYCHIC)
    .setHasDouble("Crush Kin")
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpecialtyTypes(Type.FIGHTING)
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
        Species.NIDORAN_F,
        Species.NIDORAN_M,
        Species.MACHOP,
        Species.MAKUHITA,
        Species.MEDITITE,
        Species.CROAGUNK,
        Species.TIMBURR,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.MANKEY,
        Species.POLIWRATH,
        Species.TYROGUE,
        Species.BRELOOM,
        Species.SCRAGGY,
        Species.MIENFOO,
        Species.PANCHAM,
        Species.STUFFUL,
        Species.CRABRAWLER,
      ],
      [TrainerPoolTier.RARE]: [
        Species.HERACROSS,
        Species.RIOLU,
        Species.THROH,
        Species.SAWK,
        Species.PASSIMIAN,
        Species.CLOBBOPUS,
      ],
      [TrainerPoolTier.SUPER_RARE]: [
        Species.HITMONTOP,
        Species.INFERNAPE,
        Species.GALLADE,
        Species.HAWLUCHA,
        Species.HAKAMO_O,
      ],
      [TrainerPoolTier.ULTRA_RARE]: [Species.KUBFU],
    }),
  [TrainerType.BREEDER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.325)
    .setEncounterBgm(TrainerType.POKEFAN)
    .setHasGenders("Breeder Female")
    .setHasDouble("Breeders")
    .setPartyTemplateFunc((scene) =>
      getWavePartyTemplate(
        scene,
        trainerPartyTemplates.FOUR_WEAKER,
        trainerPartyTemplates.FIVE_WEAKER,
        trainerPartyTemplates.SIX_WEAKER,
      ),
    )
    .setSpeciesFilter((s) => s.baseTotal < 450),
  [TrainerType.CLERK]: new TrainerConfig(++t)
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
        Species.MEOWTH,
        Species.PSYDUCK,
        Species.BUDEW,
        Species.PIDOVE,
        Species.CINCCINO,
        Species.LITLEO,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.JIGGLYPUFF,
        Species.MAGNEMITE,
        Species.MARILL,
        Species.COTTONEE,
        Species.SKIDDO,
      ],
      [TrainerPoolTier.RARE]: [Species.BUIZEL, Species.SNEASEL, Species.KLEFKI, Species.INDEEDEE],
    }),
  [TrainerType.CYCLIST]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.3)
    .setHasGenders("Cyclist Female")
    .setHasDouble("Cyclists")
    .setEncounterBgm(TrainerType.CYCLIST)
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAK, trainerPartyTemplates.ONE_AVG)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.PICHU, Species.STARLY, Species.TAILLOW, Species.BOLTUND],
      [TrainerPoolTier.UNCOMMON]: [Species.DODUO, Species.ELECTRIKE, Species.BLITZLE, Species.WATTREL],
      [TrainerPoolTier.RARE]: [Species.YANMA, Species.NINJASK, Species.WHIRLIPEDE, Species.EMOLGA],
      [TrainerPoolTier.SUPER_RARE]: [Species.ACCELGOR, Species.DREEPY],
    }),
  [TrainerType.DANCER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.55)
    .setEncounterBgm(TrainerType.CYCLIST)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_WEAK,
      trainerPartyTemplates.ONE_AVG,
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.TWO_WEAK_SAME_TWO_WEAK_SAME,
    )
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.RALTS, Species.SPOINK, Species.LOTAD, Species.BUDEW],
      [TrainerPoolTier.UNCOMMON]: [Species.SPINDA, Species.SWABLU, Species.MARACTUS],
      [TrainerPoolTier.RARE]: [Species.BELLOSSOM, Species.HITMONTOP, Species.MIME_JR, Species.ORICORIO],
      [TrainerPoolTier.SUPER_RARE]: [Species.POPPLIO],
    }),
  [TrainerType.DEPOT_AGENT]: new TrainerConfig(++t).setMoneyMultiplier(1.45).setEncounterBgm(TrainerType.CLERK),
  [TrainerType.DOCTOR]: new TrainerConfig(++t)
    .setHasGenders("Nurse", "lass")
    .setHasDouble("Medical Team")
    .setMoneyMultiplier(3)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => !!s.getLevelMoves().find((plm) => plm[1] === Moves.HEAL_PULSE)),
  [TrainerType.FIREBREATHER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => !!s.getLevelMoves().find((plm) => plm[1] === Moves.SMOG) || s.isOfType(Type.FIRE)),
  [TrainerType.FISHERMAN]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.25)
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setSpecialtyTypes(Type.WATER)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG,
      trainerPartyTemplates.ONE_AVG,
      trainerPartyTemplates.THREE_WEAK_SAME,
      trainerPartyTemplates.ONE_STRONG,
      trainerPartyTemplates.SIX_WEAKER,
    )
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.TENTACOOL,
        Species.MAGIKARP,
        Species.GOLDEEN,
        Species.STARYU,
        Species.REMORAID,
        Species.SKRELP,
        Species.CLAUNCHER,
        Species.ARROKUDA,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.POLIWAG,
        Species.SHELLDER,
        Species.KRABBY,
        Species.HORSEA,
        Species.CARVANHA,
        Species.BARBOACH,
        Species.CORPHISH,
        Species.FINNEON,
        Species.TYMPOLE,
        Species.BASCULIN,
        Species.FRILLISH,
        Species.INKAY,
      ],
      [TrainerPoolTier.RARE]: [
        Species.CHINCHOU,
        Species.CORSOLA,
        Species.WAILMER,
        Species.BARBOACH,
        Species.CLAMPERL,
        Species.LUVDISC,
        Species.MANTYKE,
        Species.ALOMOMOLA,
        Species.TATSUGIRI,
        Species.VELUZA,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.LAPRAS, Species.FEEBAS, Species.RELICANTH, Species.DONDOZO],
    }),
  [TrainerType.GUITARIST]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpecialtyTypes(Type.ELECTRIC)
    .setSpeciesFilter((s) => s.isOfType(Type.ELECTRIC)),
  [TrainerType.HARLEQUIN]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.PSYCHIC)
    .setSpeciesFilter((s) => tmSpecies[Moves.TRICK_ROOM].indexOf(s.speciesId) > -1),
  [TrainerType.HIKER]: new TrainerConfig(++t)
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
        Species.SANDSHREW,
        Species.DIGLETT,
        Species.GEODUDE,
        Species.MACHOP,
        Species.ARON,
        Species.ROGGENROLA,
        Species.DRILBUR,
        Species.NACLI,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.ZUBAT,
        Species.RHYHORN,
        Species.ONIX,
        Species.CUBONE,
        Species.WOOBAT,
        Species.SWINUB,
        Species.NOSEPASS,
        Species.HIPPOPOTAS,
        Species.DWEBBLE,
        Species.KLAWF,
        Species.TOEDSCOOL,
      ],
      [TrainerPoolTier.RARE]: [
        Species.TORKOAL,
        Species.TRAPINCH,
        Species.BARBOACH,
        Species.GOLETT,
        Species.ALOLA_DIGLETT,
        Species.ALOLA_GEODUDE,
        Species.GALAR_STUNFISK,
        Species.PALDEA_WOOPER,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.MAGBY, Species.LARVITAR],
    }),
  [TrainerType.HOOLIGANS]: new TrainerConfig(++t)
    .setDoubleOnly()
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(Type.POISON) || s.isOfType(Type.DARK)),
  [TrainerType.HOOPSTER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.INFIELDER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.JANITOR]: new TrainerConfig(++t).setMoneyMultiplier(1.1).setEncounterBgm(TrainerType.CLERK),
  [TrainerType.LINEBACKER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.MAID]: new TrainerConfig(++t).setMoneyMultiplier(1.6).setEncounterBgm(TrainerType.RICH),
  [TrainerType.MUSICIAN]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => !!s.getLevelMoves().find((plm) => plm[1] === Moves.SING)),
  [TrainerType.HEX_MANIAC]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .setEncounterBgm(TrainerType.PSYCHIC)
    .setPartyTemplates(
      trainerPartyTemplates.TWO_AVG,
      trainerPartyTemplates.ONE_AVG_ONE_STRONG,
      trainerPartyTemplates.TWO_AVG_SAME_ONE_AVG,
      trainerPartyTemplates.THREE_AVG,
      trainerPartyTemplates.TWO_STRONG,
    )
    .setSpeciesFilter((s) => s.isOfType(Type.GHOST)),
  [TrainerType.NURSERY_AIDE]: new TrainerConfig(++t).setMoneyMultiplier(1.3).setEncounterBgm("lass"),
  [TrainerType.OFFICER]: new TrainerConfig(++t)
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
        Species.VULPIX,
        Species.GROWLITHE,
        Species.SNUBBULL,
        Species.POOCHYENA,
        Species.ELECTRIKE,
        Species.LILLIPUP,
        Species.YAMPER,
        Species.FIDOUGH,
      ],
      [TrainerPoolTier.UNCOMMON]: [Species.HOUNDOUR, Species.ROCKRUFF, Species.MASCHIFF],
      [TrainerPoolTier.RARE]: [Species.JOLTEON, Species.RIOLU],
      [TrainerPoolTier.SUPER_RARE]: [],
      [TrainerPoolTier.ULTRA_RARE]: [Species.ENTEI, Species.SUICUNE, Species.RAIKOU],
    }),
  [TrainerType.PARASOL_LADY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.55)
    .setEncounterBgm(TrainerType.PARASOL_LADY)
    .setSpeciesFilter((s) => s.isOfType(Type.WATER)),
  [TrainerType.PILOT]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => tmSpecies[Moves.FLY].indexOf(s.speciesId) > -1),
  [TrainerType.POKEFAN]: new TrainerConfig(++t)
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
  [TrainerType.PRESCHOOLER]: new TrainerConfig(++t)
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
        Species.CATERPIE,
        Species.PICHU,
        Species.SANDSHREW,
        Species.LEDYBA,
        Species.BUDEW,
        Species.BURMY,
        Species.WOOLOO,
        Species.PAWMI,
        Species.SMOLIV,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.EEVEE,
        Species.CLEFFA,
        Species.IGGLYBUFF,
        Species.SWINUB,
        Species.WOOPER,
        Species.DRIFLOON,
        Species.DEDENNE,
        Species.STUFFUL,
      ],
      [TrainerPoolTier.RARE]: [Species.RALTS, Species.RIOLU, Species.JOLTIK, Species.TANDEMAUS],
      [TrainerPoolTier.SUPER_RARE]: [Species.DARUMAKA, Species.TINKATINK],
    }),
  [TrainerType.PSYCHIC]: new TrainerConfig(++t)
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
        Species.ABRA,
        Species.DROWZEE,
        Species.RALTS,
        Species.SPOINK,
        Species.GOTHITA,
        Species.SOLOSIS,
        Species.BLIPBUG,
        Species.ESPURR,
        Species.HATENNA,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.MIME_JR,
        Species.EXEGGCUTE,
        Species.MEDITITE,
        Species.NATU,
        Species.EXEGGCUTE,
        Species.WOOBAT,
        Species.INKAY,
        Species.ORANGURU,
      ],
      [TrainerPoolTier.RARE]: [Species.ELGYEM, Species.SIGILYPH, Species.BALTOY, Species.GIRAFARIG, Species.MEOWSTIC],
      [TrainerPoolTier.SUPER_RARE]: [Species.BELDUM, Species.ESPEON, Species.STANTLER],
    }),
  [TrainerType.RANGER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setName("Pokémon Ranger")
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setHasGenders("Pokémon Ranger Female")
    .setHasDouble("Pokémon Rangers")
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.PICHU,
        Species.GROWLITHE,
        Species.PONYTA,
        Species.ZIGZAGOON,
        Species.SEEDOT,
        Species.BIDOOF,
        Species.RIOLU,
        Species.SEWADDLE,
        Species.SKIDDO,
        Species.SALANDIT,
        Species.YAMPER,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.AZURILL,
        Species.TAUROS,
        Species.MAREEP,
        Species.FARFETCHD,
        Species.TEDDIURSA,
        Species.SHROOMISH,
        Species.ELECTRIKE,
        Species.BUDEW,
        Species.BUIZEL,
        Species.MUDBRAY,
        Species.STUFFUL,
      ],
      [TrainerPoolTier.RARE]: [
        Species.EEVEE,
        Species.SCYTHER,
        Species.KANGASKHAN,
        Species.RALTS,
        Species.MUNCHLAX,
        Species.ZORUA,
        Species.PALDEA_TAUROS,
        Species.TINKATINK,
        Species.CYCLIZAR,
        Species.FLAMIGO,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.LARVESTA],
    }),
  [TrainerType.RICH]: new TrainerConfig(++t)
    .setMoneyMultiplier(5)
    .setName("Gentleman")
    .setHasGenders("Madame")
    .setHasDouble("Rich Couple"),
  [TrainerType.RICH_KID]: new TrainerConfig(++t)
    .setMoneyMultiplier(3.75)
    .setName("Rich Boy")
    .setHasGenders("Lady")
    .setHasDouble("Rich Kids")
    .setEncounterBgm(TrainerType.RICH),
  [TrainerType.ROUGHNECK]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(Type.DARK)),
  [TrainerType.SAILOR]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setSpeciesFilter((s) => s.isOfType(Type.WATER) || s.isOfType(Type.FIGHTING)),
  [TrainerType.SCIENTIST]: new TrainerConfig(++t)
    .setHasGenders("Scientist Female")
    .setHasDouble("Scientists")
    .setMoneyMultiplier(1.7)
    .setEncounterBgm(TrainerType.SCIENTIST)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.MAGNEMITE, Species.GRIMER, Species.DROWZEE, Species.VOLTORB, Species.KOFFING],
      [TrainerPoolTier.UNCOMMON]: [
        Species.BALTOY,
        Species.BRONZOR,
        Species.FERROSEED,
        Species.KLINK,
        Species.CHARJABUG,
        Species.BLIPBUG,
        Species.HELIOPTILE,
      ],
      [TrainerPoolTier.RARE]: [
        Species.ABRA,
        Species.DITTO,
        Species.PORYGON,
        Species.ELEKID,
        Species.SOLOSIS,
        Species.GALAR_WEEZING,
      ],
      [TrainerPoolTier.SUPER_RARE]: [
        Species.OMANYTE,
        Species.KABUTO,
        Species.AERODACTYL,
        Species.LILEEP,
        Species.ANORITH,
        Species.CRANIDOS,
        Species.SHIELDON,
        Species.TIRTOUGA,
        Species.ARCHEN,
        Species.ARCTOVISH,
        Species.ARCTOZOLT,
        Species.DRACOVISH,
        Species.DRACOZOLT,
      ],
      [TrainerPoolTier.ULTRA_RARE]: [Species.ROTOM, Species.MELTAN],
    }),
  [TrainerType.SMASHER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.SNOW_WORKER]: new TrainerConfig(++t)
    .setName("Worker")
    .setHasDouble("Workers")
    .setMoneyMultiplier(1.7)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => s.isOfType(Type.ICE) || s.isOfType(Type.STEEL)),
  [TrainerType.STRIKER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.SCHOOL_KID]: new TrainerConfig(++t)
    .setMoneyMultiplier(0.75)
    .setEncounterBgm(TrainerType.YOUNGSTER)
    .setHasGenders("School Kid Female", "lass")
    .setHasDouble("School Kids")
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.ODDISH,
        Species.EXEGGCUTE,
        Species.TEDDIURSA,
        Species.WURMPLE,
        Species.RALTS,
        Species.SHROOMISH,
        Species.FLETCHLING,
      ],
      [TrainerPoolTier.UNCOMMON]: [Species.VOLTORB, Species.WHISMUR, Species.MEDITITE, Species.MIME_JR, Species.NYMBLE],
      [TrainerPoolTier.RARE]: [Species.TANGELA, Species.EEVEE, Species.YANMA],
      [TrainerPoolTier.SUPER_RARE]: [Species.TADBULB],
    }),
  [TrainerType.SWIMMER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.3)
    .setEncounterBgm(TrainerType.PARASOL_LADY)
    .setHasGenders("Swimmer Female")
    .setHasDouble("Swimmers")
    .setSpecialtyTypes(Type.WATER)
    .setSpeciesFilter((s) => s.isOfType(Type.WATER)),
  [TrainerType.TWINS]: new TrainerConfig(++t)
    .setDoubleOnly()
    .setMoneyMultiplier(0.65)
    .setUseSameSeedForAllMembers()
    .setPartyTemplateFunc((scene) =>
      getWavePartyTemplate(
        scene,
        trainerPartyTemplates.TWO_WEAK,
        trainerPartyTemplates.TWO_AVG,
        trainerPartyTemplates.TWO_STRONG,
      ),
    )
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([
        Species.PLUSLE,
        Species.VOLBEAT,
        Species.PACHIRISU,
        Species.SILCOON,
        Species.METAPOD,
        Species.IGGLYBUFF,
        Species.PETILIL,
        Species.EEVEE,
      ]),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [
          Species.MINUN,
          Species.ILLUMISE,
          Species.EMOLGA,
          Species.CASCOON,
          Species.KAKUNA,
          Species.CLEFFA,
          Species.COTTONEE,
          Species.EEVEE,
        ],
        TrainerSlot.TRAINER_PARTNER,
      ),
    )
    .setEncounterBgm(TrainerType.TWINS),
  [TrainerType.VETERAN]: new TrainerConfig(++t)
    .setHasGenders("Veteran Female")
    .setHasDouble("Veteran Duo")
    .setMoneyMultiplier(2.5)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setSpeciesFilter((s) => s.isOfType(Type.DRAGON)),
  [TrainerType.WAITER]: new TrainerConfig(++t)
    .setHasGenders("Waitress")
    .setHasDouble("Restaurant Staff")
    .setMoneyMultiplier(1.5)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.CLEFFA,
        Species.CHATOT,
        Species.PANSAGE,
        Species.PANSEAR,
        Species.PANPOUR,
        Species.MINCCINO,
      ],
      [TrainerPoolTier.UNCOMMON]: [Species.TROPIUS, Species.PETILIL, Species.BOUNSWEET, Species.INDEEDEE],
      [TrainerPoolTier.RARE]: [Species.APPLIN, Species.SINISTEA, Species.POLTCHAGEIST],
    }),
  [TrainerType.WORKER]: new TrainerConfig(++t)
    .setHasGenders("Worker Female")
    .setHasDouble("Workers")
    .setEncounterBgm(TrainerType.CLERK)
    .setMoneyMultiplier(1.7)
    .setSpeciesFilter((s) => s.isOfType(Type.ROCK) || s.isOfType(Type.STEEL)),
  [TrainerType.YOUNGSTER]: new TrainerConfig(++t)
    .setMoneyMultiplier(0.5)
    .setEncounterBgm(TrainerType.YOUNGSTER)
    .setHasGenders("Lass", "lass")
    .setHasDouble("Beginners")
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAKER)
    .setSpeciesPools([
      Species.CATERPIE,
      Species.WEEDLE,
      Species.RATTATA,
      Species.SENTRET,
      Species.POOCHYENA,
      Species.ZIGZAGOON,
      Species.WURMPLE,
      Species.BIDOOF,
      Species.PATRAT,
      Species.LILLIPUP,
    ]),
};

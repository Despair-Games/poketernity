import { tmSpecies } from "#app/data/tms";
import {
  getRandomPartyMemberFunc,
  getWavePartyTemplate,
  TrainerConfig,
  trainerPartyTemplates,
  type TrainerConfigs,
} from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";
import { ElementalType } from "#enums/elemental-type";
/**
 * If a trainer does not have any species filter then they use the default
 * filters of excluding sublegendary, legendary, mythic, eternal floette, and bloodmoon ursaluna
 */
let t = 0;
export const genericTrainerConfigs: TrainerConfigs = {
  [TrainerType.UNKNOWN]: new TrainerConfig(t).setHasGenders(),
  [TrainerType.ACE_TRAINER]: new TrainerConfig(++t)
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
  [TrainerType.ARTIST]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.RICH)
    .setPartyTemplates(trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.THREE_AVG)
    .setSpeciesPools([SpeciesId.SMEARGLE]),
  [TrainerType.BACKERS]: new TrainerConfig(++t)
    .setHasGenders("Backers")
    .setDoubleOnly()
    .setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.BACKPACKER]: new TrainerConfig(++t)
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
  [TrainerType.BAKER]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.CLERK)
    .setMoneyMultiplier(1.35)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.GRASS) || s.isOfType(ElementalType.FIRE)),
  [TrainerType.BEAUTY]: new TrainerConfig(++t).setMoneyMultiplier(1.55).setEncounterBgm(TrainerType.PARASOL_LADY),
  [TrainerType.BIKER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.POISON)),
  [TrainerType.BLACK_BELT]: new TrainerConfig(++t)
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
  [TrainerType.BREEDER]: new TrainerConfig(++t)
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
  [TrainerType.CYCLIST]: new TrainerConfig(++t)
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
      [TrainerPoolTier.COMMON]: [SpeciesId.RALTS, SpeciesId.SPOINK, SpeciesId.LOTAD, SpeciesId.BUDEW],
      [TrainerPoolTier.UNCOMMON]: [SpeciesId.SPINDA, SpeciesId.SWABLU, SpeciesId.MARACTUS],
      [TrainerPoolTier.RARE]: [SpeciesId.BELLOSSOM, SpeciesId.HITMONTOP, SpeciesId.MIME_JR, SpeciesId.ORICORIO],
      [TrainerPoolTier.SUPER_RARE]: [SpeciesId.POPPLIO],
    }),
  [TrainerType.DEPOT_AGENT]: new TrainerConfig(++t).setMoneyMultiplier(1.45).setEncounterBgm(TrainerType.CLERK),
  [TrainerType.DOCTOR]: new TrainerConfig(++t)
    .setHasGenders("Nurse", "lass")
    .setHasDouble("Medical Team")
    .setMoneyMultiplier(3)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => !!s.getLevelMoves().find((plm) => plm[1] === MoveId.HEAL_PULSE)),
  [TrainerType.FIREBREATHER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter(
      (s) => !!s.getLevelMoves().find((plm) => plm[1] === MoveId.SMOG) || s.isOfType(ElementalType.FIRE),
    ),
  [TrainerType.FISHERMAN]: new TrainerConfig(++t)
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
  [TrainerType.GUITARIST]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.2)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpecialtyTypes(ElementalType.ELECTRIC)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.ELECTRIC)),
  [TrainerType.HARLEQUIN]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.PSYCHIC)
    .setSpeciesFilter((s) => tmSpecies[MoveId.TRICK_ROOM].indexOf(s.speciesId) > -1),
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
  [TrainerType.HOOLIGANS]: new TrainerConfig(++t)
    .setDoubleOnly()
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.POISON) || s.isOfType(ElementalType.DARK)),
  [TrainerType.HOOPSTER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.INFIELDER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.JANITOR]: new TrainerConfig(++t).setMoneyMultiplier(1.1).setEncounterBgm(TrainerType.CLERK),
  [TrainerType.LINEBACKER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.MAID]: new TrainerConfig(++t).setMoneyMultiplier(1.6).setEncounterBgm(TrainerType.RICH),
  [TrainerType.MUSICIAN]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter((s) => !!s.getLevelMoves().find((plm) => plm[1] === MoveId.SING)),
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
    .setSpeciesFilter((s) => s.isOfType(ElementalType.GHOST)),
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
  [TrainerType.PARASOL_LADY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.55)
    .setEncounterBgm(TrainerType.PARASOL_LADY)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.WATER)),
  [TrainerType.PILOT]: new TrainerConfig(++t)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => tmSpecies[MoveId.FLY].indexOf(s.speciesId) > -1),
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
  [TrainerType.RANGER]: new TrainerConfig(++t)
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
    .setSpeciesFilter((s) => s.isOfType(ElementalType.DARK)),
  [TrainerType.SAILOR]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.4)
    .setEncounterBgm(TrainerType.BACKPACKER)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.WATER) || s.isOfType(ElementalType.FIGHTING)),
  [TrainerType.SCIENTIST]: new TrainerConfig(++t)
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
  [TrainerType.SMASHER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.SNOW_WORKER]: new TrainerConfig(++t)
    .setName("Worker")
    .setHasDouble("Workers")
    .setMoneyMultiplier(1.7)
    .setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.ICE) || s.isOfType(ElementalType.STEEL)),
  [TrainerType.STRIKER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.CYCLIST),
  [TrainerType.SCHOOL_KID]: new TrainerConfig(++t)
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
  [TrainerType.SWIMMER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.3)
    .setEncounterBgm(TrainerType.PARASOL_LADY)
    .setHasGenders("Swimmer Female")
    .setHasDouble("Swimmers")
    .setSpecialtyTypes(ElementalType.WATER)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.WATER)),
  [TrainerType.TWINS]: new TrainerConfig(++t)
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
  [TrainerType.VETERAN]: new TrainerConfig(++t)
    .setHasGenders("Veteran Female")
    .setHasDouble("Veteran Duo")
    .setMoneyMultiplier(2.5)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.DRAGON)),
  [TrainerType.WAITER]: new TrainerConfig(++t)
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
  [TrainerType.WORKER]: new TrainerConfig(++t)
    .setHasGenders("Worker Female")
    .setHasDouble("Workers")
    .setEncounterBgm(TrainerType.CLERK)
    .setMoneyMultiplier(1.7)
    .setSpeciesFilter((s) => s.isOfType(ElementalType.ROCK) || s.isOfType(ElementalType.STEEL)),
  [TrainerType.YOUNGSTER]: new TrainerConfig(++t)
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

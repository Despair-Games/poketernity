import {
  getEvilGruntPartyTemplate,
  getRandomPartyMemberFunc,
  TrainerConfig,
  type TrainerConfigs,
} from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import { PokemonMove } from "#app/field/pokemon-move";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";

let t = TrainerType.ROCKET_GRUNT;
export const evilTeamTrainerConfigsConfigs: TrainerConfigs = {
  [TrainerType.ROCKET_GRUNT]: new TrainerConfig(t)
    .setHasGenders("Rocket Grunt Female")
    .setHasDouble("Rocket Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.ARCHER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [SpeciesId.HOUNDOOM])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.ARIANA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin_female", "rocket", [SpeciesId.ARBOK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.PROTON]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [SpeciesId.CROBAT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.PETREL]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [SpeciesId.WEEZING])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.MAGMA_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Magma Grunt Female")
    .setHasDouble("Magma Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.TABITHA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("magma_admin", "magma", [SpeciesId.CAMERUPT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.COURTNEY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("magma_admin_female", "magma", [SpeciesId.CAMERUPT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.AQUA_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Aqua Grunt Female")
    .setHasDouble("Aqua Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.MATT]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aqua_admin", "aqua", [SpeciesId.SHARPEDO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.SHELLY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aqua_admin_female", "aqua", [SpeciesId.SHARPEDO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.GALACTIC_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Galactic Grunt Female")
    .setHasDouble("Galactic Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_galactic_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.JUPITER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander_female", "galactic", [SpeciesId.SKUNTANK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.MARS]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander_female", "galactic", [SpeciesId.PURUGLY])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.SATURN]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander", "galactic", [SpeciesId.TOXICROAK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.PLASMA_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Plasma Grunt Female")
    .setHasDouble("Plasma Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.ZINZOLIN]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("plasma_sage", "plasma", [SpeciesId.CRYOGONAL])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.ROOD]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("plasma_sage", "plasma", [SpeciesId.SWOOBAT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.FLARE_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Flare Grunt Female")
    .setHasDouble("Flare Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.BRYONY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("flare_admin_female", "flare", [SpeciesId.LIEPARD])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.XEROSIC]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("flare_admin", "flare", [SpeciesId.MALAMAR])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.AETHER_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Aether Grunt Female")
    .setHasDouble("Aether Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aether_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.FABA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aether_admin", "aether", [SpeciesId.HYPNO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aether_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.SKULL_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Skull Grunt Female")
    .setHasDouble("Skull Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_skull_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.PLUMERIA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("skull_admin", "skull", [SpeciesId.SALAZZLE])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_skull_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.MACRO_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Macro Grunt Female")
    .setHasDouble("Macro Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_macro_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.OLEANA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("macro_admin", "macro", [SpeciesId.GARBODOR])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_oleana")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.STAR_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Star Grunt Female")
    .setHasDouble("Star Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_star_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setSpeciesPools({
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
    }),
  [TrainerType.GIACOMO]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_1", [SpeciesId.KINGAMBIT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Segin Starmobile
        p.moveset = [
          new PokemonMove(MoveId.WICKED_TORQUE),
          new PokemonMove(MoveId.SPIN_OUT),
          new PokemonMove(MoveId.SHIFT_GEAR),
          new PokemonMove(MoveId.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.MELA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_2", [SpeciesId.ARMAROUGE])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 2; // Schedar Starmobile
        p.moveset = [
          new PokemonMove(MoveId.BLAZING_TORQUE),
          new PokemonMove(MoveId.SPIN_OUT),
          new PokemonMove(MoveId.SHIFT_GEAR),
          new PokemonMove(MoveId.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.ATTICUS]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_3", [SpeciesId.REVAVROOM])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 3; // Navi Starmobile
        p.moveset = [
          new PokemonMove(MoveId.NOXIOUS_TORQUE),
          new PokemonMove(MoveId.SPIN_OUT),
          new PokemonMove(MoveId.SHIFT_GEAR),
          new PokemonMove(MoveId.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.ORTEGA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_4", [SpeciesId.DACHSBUN])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 4; // Ruchbah Starmobile
        p.moveset = [
          new PokemonMove(MoveId.MAGICAL_TORQUE),
          new PokemonMove(MoveId.SPIN_OUT),
          new PokemonMove(MoveId.SHIFT_GEAR),
          new PokemonMove(MoveId.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.ERI]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_5", [SpeciesId.ANNIHILAPE])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate())
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 5; // Caph Starmobile
        p.moveset = [
          new PokemonMove(MoveId.COMBAT_TORQUE),
          new PokemonMove(MoveId.SPIN_OUT),
          new PokemonMove(MoveId.SHIFT_GEAR),
          new PokemonMove(MoveId.HIGH_HORSEPOWER),
        ];
      }),
    ),
};

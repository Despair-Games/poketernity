import {
  AETHER_ADMIN_SPECIES_POOL,
  AETHER_GRUNT_SPECIES_POOL,
  AQUA_ADMIN_SPECIES_POOL,
  AQUA_GRUNT_SPECIES_POOL,
  ATTICUS_SPECIES_POOL,
  ERI_SPECIES_POOL,
  FLARE_ADMIN_SPECIES_POOL,
  FLARE_GRUNT_SPECIES_POOL,
  GALACTIC_ADMIN_SPECIES_POOL,
  GALACTIC_GRUNT_SPECIES_POOL,
  GIACOMO_SPECIES_POOL,
  MACRO_ADMIN_SPECIES_POOL,
  MACRO_GRUNT_SPECIES_POOL,
  MAGMA_ADMIN_SPECIES_POOL,
  MAGMA_GRUNT_SPECIES_POOL,
  MELA_SPECIES_POOL,
  ORTEGA_SPECIES_POOL,
  PLASMA_ADMIN_SPECIES_POOL,
  PLASMA_GRUNT_SPECIES_POOL,
  ROCKET_ADMIN_SPECIES_POOL,
  ROCKET_GRUNT_SPECIES_POOL,
  SKULL_ADMIN_SPECIES_POOL,
  SKULL_GRUNT_SPECIES_POOL,
  STAR_GRUNT_SPECIES_POOL,
} from "#constants/trainer-constants";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerPoolTier } from "#enums/trainer-pool-tier";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import {
  getEvilGruntPartyTemplate,
  getRandomPartyMemberFunc,
  TrainerConfig,
  type TrainerConfigs,
} from "#trainers/trainer-config";
import { TrainerConfigBuilder } from "#trainers/trainer-config-builder";
import { trainerNamePools } from "#trainers/trainer-names";

const teamStarCommonMoveset = [MoveId.SPIN_OUT, MoveId.SHIFT_GEAR, MoveId.HIGH_HORSEPOWER] as const;

export const evilTeamTrainerConfigs: TrainerConfigs = {
  [TrainerType.ROCKET_GRUNT]: new TrainerConfig(TrainerType.ROCKET_GRUNT)
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
  [TrainerType.ARCHER]: new TrainerConfig(TrainerType.ARCHER)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [SpeciesId.HOUNDOOM])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.ARIANA]: new TrainerConfig(TrainerType.ARIANA)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin_female", "rocket", [SpeciesId.ARBOK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.PROTON]: new TrainerConfig(TrainerType.PROTON)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [SpeciesId.CROBAT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.PETREL]: new TrainerConfig(TrainerType.PETREL)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [SpeciesId.WEEZING])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.MAGMA_GRUNT]: new TrainerConfig(TrainerType.MAGMA_GRUNT)
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
  [TrainerType.TABITHA]: new TrainerConfig(TrainerType.TABITHA)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("magma_admin", "magma", [SpeciesId.CAMERUPT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.COURTNEY]: new TrainerConfig(TrainerType.COURTNEY)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("magma_admin_female", "magma", [SpeciesId.CAMERUPT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.AQUA_GRUNT]: new TrainerConfig(TrainerType.AQUA_GRUNT)
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
  [TrainerType.MATT]: new TrainerConfig(TrainerType.MATT)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aqua_admin", "aqua", [SpeciesId.SHARPEDO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.SHELLY]: new TrainerConfig(TrainerType.SHELLY)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aqua_admin_female", "aqua", [SpeciesId.SHARPEDO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.GALACTIC_GRUNT]: new TrainerConfig(TrainerType.GALACTIC_GRUNT)
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
  [TrainerType.JUPITER]: new TrainerConfig(TrainerType.JUPITER)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander_female", "galactic", [SpeciesId.SKUNTANK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.MARS]: new TrainerConfig(TrainerType.MARS)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander_female", "galactic", [SpeciesId.PURUGLY])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.SATURN]: new TrainerConfig(TrainerType.SATURN)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander", "galactic", [SpeciesId.TOXICROAK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.PLASMA_GRUNT]: new TrainerConfig(TrainerType.PLASMA_GRUNT)
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
  [TrainerType.ZINZOLIN]: new TrainerConfig(TrainerType.ZINZOLIN)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("plasma_sage", "plasma", [SpeciesId.CRYOGONAL])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.ROOD]: new TrainerConfig(TrainerType.ROOD)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("plasma_sage", "plasma", [SpeciesId.SWOOBAT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.FLARE_GRUNT]: new TrainerConfig(TrainerType.FLARE_GRUNT)
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
  [TrainerType.BRYONY]: new TrainerConfig(TrainerType.BRYONY)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("flare_admin_female", "flare", [SpeciesId.LIEPARD])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.XEROSIC]: new TrainerConfig(TrainerType.XEROSIC)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("flare_admin", "flare", [SpeciesId.MALAMAR])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.AETHER_GRUNT]: new TrainerConfig(TrainerType.AETHER_GRUNT)
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
  [TrainerType.FABA]: new TrainerConfig(TrainerType.FABA)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aether_admin", "aether", [SpeciesId.HYPNO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_aether_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.SKULL_GRUNT]: new TrainerConfig(TrainerType.SKULL_GRUNT)
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
  [TrainerType.PLUMERIA]: new TrainerConfig(TrainerType.PLUMERIA)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("skull_admin", "skull", [SpeciesId.SALAZZLE])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_skull_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.MACRO_GRUNT]: new TrainerConfig(TrainerType.MACRO_GRUNT)
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
  [TrainerType.OLEANA]: new TrainerConfig(TrainerType.OLEANA)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("macro_admin", "macro", [SpeciesId.GARBODOR])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_oleana")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc(() => getEvilGruntPartyTemplate()),
  [TrainerType.STAR_GRUNT]: new TrainerConfig(TrainerType.STAR_GRUNT)
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
  [TrainerType.GIACOMO]: new TrainerConfig(TrainerType.GIACOMO)
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
        p.setMoveset(MoveId.WICKED_TORQUE, ...teamStarCommonMoveset);
      }),
    ),
  [TrainerType.MELA]: new TrainerConfig(TrainerType.MELA)
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
        p.setMoveset(MoveId.BLAZING_TORQUE, ...teamStarCommonMoveset);
      }),
    ),
  [TrainerType.ATTICUS]: new TrainerConfig(TrainerType.ATTICUS)
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
        p.setMoveset(MoveId.NOXIOUS_TORQUE, ...teamStarCommonMoveset);
      }),
    ),
  [TrainerType.ORTEGA]: new TrainerConfig(TrainerType.ORTEGA)
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
        p.setMoveset(MoveId.MAGICAL_TORQUE, ...teamStarCommonMoveset);
      }),
    ),
  [TrainerType.ERI]: new TrainerConfig(TrainerType.ERI)
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
        p.setMoveset(MoveId.COMBAT_TORQUE, ...teamStarCommonMoveset);
      }),
    ),
};

export const newEvilTeamTrainerConfigs: TrainerConfigMap = {
  [TrainerType.ROCKET_GRUNT]: new TrainerConfigBuilder(TrainerType.ROCKET_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.ROCKET_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.ROCKET_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("rocket_grunt", TrainerGender.MALE)
    .withTitle("rocket_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("rocket_grunt_m", TrainerGender.MALE)
    .withSpriteKey("rocket_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_rocket_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(ROCKET_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.ARCHER]: new TrainerConfigBuilder(TrainerType.ARCHER)
    .withFixedName("archer", TrainerGender.MALE)
    .withTitle("trainerTitles:rocket_admin")
    .withSpriteKey("archer")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_rocket_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(ROCKET_ADMIN_SPECIES_POOL, SpeciesId.HOUNDOOM)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.ARIANA]: new TrainerConfigBuilder(TrainerType.ARIANA)
    .withFixedName("ariana", TrainerGender.FEMALE)
    .withTitle("trainerTitles:rocket_admin_female")
    .withSpriteKey("ariana")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_rocket_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(ROCKET_ADMIN_SPECIES_POOL, SpeciesId.ARBOK)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.PROTON]: new TrainerConfigBuilder(TrainerType.PROTON)
    .withFixedName("proton", TrainerGender.MALE)
    .withTitle("trainerTitles:rocket_admin")
    .withSpriteKey("proton")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_rocket_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(ROCKET_ADMIN_SPECIES_POOL, SpeciesId.CROBAT)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.PETREL]: new TrainerConfigBuilder(TrainerType.PETREL)
    .withFixedName("petrel", TrainerGender.MALE)
    .withTitle("trainerTitles:rocket_admin")
    .withSpriteKey("petrel")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_rocket_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(ROCKET_ADMIN_SPECIES_POOL, SpeciesId.WEEZING)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.MAGMA_GRUNT]: new TrainerConfigBuilder(TrainerType.MAGMA_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.MAGMA_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.MAGMA_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("magma_grunt", TrainerGender.MALE)
    .withTitle("magma_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("magma_grunt_m", TrainerGender.MALE)
    .withSpriteKey("magma_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aqua_magma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(MAGMA_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.TABITHA]: new TrainerConfigBuilder(TrainerType.TABITHA)
    .withFixedName("tabitha", TrainerGender.FEMALE)
    .withTitle("trainerTitles:magma_admin_female")
    .withSpriteKey("tabitha")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aqua_magma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(MAGMA_ADMIN_SPECIES_POOL, SpeciesId.CAMERUPT)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.COURTNEY]: new TrainerConfigBuilder(TrainerType.COURTNEY)
    .withFixedName("courtney", TrainerGender.FEMALE)
    .withTitle("trainerTitles:magma_admin_female")
    .withSpriteKey("courtney")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aqua_magma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(MAGMA_ADMIN_SPECIES_POOL, SpeciesId.CAMERUPT)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.AQUA_GRUNT]: new TrainerConfigBuilder(TrainerType.AQUA_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.AQUA_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.AQUA_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("aqua_grunt", TrainerGender.MALE)
    .withTitle("aqua_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("aqua_grunt_m", TrainerGender.MALE)
    .withSpriteKey("aqua_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aqua_magma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(AQUA_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.MATT]: new TrainerConfigBuilder(TrainerType.MATT)
    .withFixedName("matt", TrainerGender.MALE)
    .withTitle("trainerTitles:aqua_admin")
    .withSpriteKey("matt")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aqua_magma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(AQUA_ADMIN_SPECIES_POOL, SpeciesId.SHARPEDO)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.SHELLY]: new TrainerConfigBuilder(TrainerType.SHELLY)
    .withFixedName("shelly", TrainerGender.FEMALE)
    .withTitle("trainerTitles:aqua_admin_female")
    .withSpriteKey("shelly")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aqua_magma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(AQUA_ADMIN_SPECIES_POOL, SpeciesId.SHARPEDO)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.GALACTIC_GRUNT]: new TrainerConfigBuilder(TrainerType.GALACTIC_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.GALACTIC_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.GALACTIC_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("galactic_grunt", TrainerGender.MALE)
    .withTitle("galactic_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("galactic_grunt_m", TrainerGender.MALE)
    .withSpriteKey("galactic_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_galactic_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(GALACTIC_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.JUPITER]: new TrainerConfigBuilder(TrainerType.JUPITER)
    .withFixedName("jupiter", TrainerGender.FEMALE)
    .withTitle("trainerTitles:galactic_admin_female")
    .withSpriteKey("jupiter")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_galactic_admin")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(GALACTIC_ADMIN_SPECIES_POOL, SpeciesId.SKUNTANK)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.MARS]: new TrainerConfigBuilder(TrainerType.MARS)
    .withFixedName("mars", TrainerGender.FEMALE)
    .withTitle("trainerTitles:galactic_admin_female")
    .withSpriteKey("mars")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_galactic_admin")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(GALACTIC_ADMIN_SPECIES_POOL, SpeciesId.PURUGLY)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.SATURN]: new TrainerConfigBuilder(TrainerType.SATURN)
    .withFixedName("saturn", TrainerGender.MALE)
    .withTitle("trainerTitles:galactic_commander")
    .withSpriteKey("saturn")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_galactic_admin")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(GALACTIC_ADMIN_SPECIES_POOL, SpeciesId.TOXICROAK)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.PLASMA_GRUNT]: new TrainerConfigBuilder(TrainerType.PLASMA_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.PLASMA_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.PLASMA_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("plasma_grunt", TrainerGender.MALE)
    .withTitle("plasma_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("plasma_grunt_m", TrainerGender.MALE)
    .withSpriteKey("plasma_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_plasma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(PLASMA_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.ZINZOLIN]: new TrainerConfigBuilder(TrainerType.ZINZOLIN)
    .withFixedName("zinzolin", TrainerGender.MALE)
    .withTitle("trainerTitles:plasma_sage")
    .withSpriteKey("zinzolin")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_plasma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(PLASMA_ADMIN_SPECIES_POOL, SpeciesId.CRYOGONAL)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.ROOD]: new TrainerConfigBuilder(TrainerType.ROOD)
    .withFixedName("rood", TrainerGender.MALE)
    .withTitle("trainerTitles:plasma_sage")
    .withSpriteKey("rood")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_plasma_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(PLASMA_ADMIN_SPECIES_POOL, SpeciesId.SWOOBAT)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.FLARE_GRUNT]: new TrainerConfigBuilder(TrainerType.FLARE_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.FLARE_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.FLARE_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("flare_grunt", TrainerGender.MALE)
    .withTitle("flare_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("flare_grunt_m", TrainerGender.MALE)
    .withSpriteKey("flare_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_flare_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(FLARE_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.BRYONY]: new TrainerConfigBuilder(TrainerType.BRYONY)
    .withFixedName("bryony", TrainerGender.FEMALE)
    .withTitle("trainerTitles:flare_admin_female")
    .withSpriteKey("bryony")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_flare_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(FLARE_ADMIN_SPECIES_POOL, SpeciesId.LIEPARD)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.XEROSIC]: new TrainerConfigBuilder(TrainerType.XEROSIC)
    .withFixedName("xerosic", TrainerGender.MALE)
    .withTitle("trainerTitles:flare_admin")
    .withSpriteKey("xerosic")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_flare_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(FLARE_ADMIN_SPECIES_POOL, SpeciesId.MALAMAR)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.AETHER_GRUNT]: new TrainerConfigBuilder(TrainerType.AETHER_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.AETHER_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.AETHER_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("aether_grunt", TrainerGender.MALE)
    .withTitle("aether_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("aether_grunt_m", TrainerGender.MALE)
    .withSpriteKey("aether_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aether_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(AETHER_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.FABA]: new TrainerConfigBuilder(TrainerType.FABA)
    .withFixedName("faba", TrainerGender.MALE)
    .withTitle("trainerTitles:aether_admin")
    .withSpriteKey("faba")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_aether_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(AETHER_ADMIN_SPECIES_POOL, SpeciesId.HYPNO)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.SKULL_GRUNT]: new TrainerConfigBuilder(TrainerType.SKULL_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.SKULL_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.SKULL_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("skull_grunt", TrainerGender.MALE)
    .withTitle("skull_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("skull_grunt_m", TrainerGender.MALE)
    .withSpriteKey("skull_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_skull_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(SKULL_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.PLUMERIA]: new TrainerConfigBuilder(TrainerType.PLUMERIA)
    .withFixedName("plumeria", TrainerGender.FEMALE)
    .withTitle("trainerTitles:skull_admin")
    .withSpriteKey("plumeria")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_skull_admin")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(SKULL_ADMIN_SPECIES_POOL, SpeciesId.SALAZZLE)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.MACRO_GRUNT]: new TrainerConfigBuilder(TrainerType.MACRO_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.MACRO_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.MACRO_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("macro_grunt", TrainerGender.MALE)
    .withTitle("macro_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("macro_grunt_m", TrainerGender.MALE)
    .withSpriteKey("macro_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_macro_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(MACRO_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.OLEANA]: new TrainerConfigBuilder(TrainerType.OLEANA)
    .withFixedName("oleana", TrainerGender.FEMALE)
    .withTitle("trainerTitles:macro_admin")
    .withSpriteKey("oleana")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_oleana")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamAdminParty(MACRO_ADMIN_SPECIES_POOL, SpeciesId.GARBODOR)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.STAR_GRUNT]: new TrainerConfigBuilder(TrainerType.STAR_GRUNT)
    .withNameFromPool(trainerNamePools[TrainerType.STAR_GRUNT][0], TrainerGender.MALE)
    .withNameFromPool(trainerNamePools[TrainerType.STAR_GRUNT][1], TrainerGender.FEMALE)
    .withTitle("star_grunt", TrainerGender.MALE)
    .withTitle("star_grunt_female", TrainerGender.FEMALE)
    .withSpriteKey("star_grunt_m", TrainerGender.MALE)
    .withSpriteKey("star_grunt_f", TrainerGender.FEMALE)
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_star_grunt")
    .withVictoryBgm("victory_team_plasma")
    .withEvilTeamGruntParty(STAR_GRUNT_SPECIES_POOL)
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.GIACOMO]: new TrainerConfigBuilder(TrainerType.GIACOMO)
    .withFixedName("giacomo", TrainerGender.MALE)
    .withTitle("trainerTitles:star_admin")
    .withSpriteKey("giacomo")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_star_admin")
    .withVictoryBgm("victory_team_plasma")
    .withTeamStarAdminParty(GIACOMO_SPECIES_POOL, SpeciesId.KINGAMBIT, 1)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.MELA]: new TrainerConfigBuilder(TrainerType.MELA)
    .withFixedName("mela", TrainerGender.FEMALE)
    .withTitle("trainerTitles:star_admin")
    .withSpriteKey("mela")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_star_admin")
    .withVictoryBgm("victory_team_plasma")
    .withTeamStarAdminParty(MELA_SPECIES_POOL, SpeciesId.ARMAROUGE, 2)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.ATTICUS]: new TrainerConfigBuilder(TrainerType.ATTICUS)
    .withFixedName("atticus", TrainerGender.MALE)
    .withTitle("trainerTitles:star_admin")
    .withSpriteKey("atticus")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_star_admin")
    .withVictoryBgm("victory_team_plasma")
    .withTeamStarAdminParty(ATTICUS_SPECIES_POOL, SpeciesId.REVAVROOM, 3)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.ORTEGA]: new TrainerConfigBuilder(TrainerType.ORTEGA)
    .withFixedName("ortega", TrainerGender.MALE)
    .withTitle("trainerTitles:star_admin")
    .withSpriteKey("ortega")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_star_admin")
    .withVictoryBgm("victory_team_plasma")
    .withTeamStarAdminParty(ORTEGA_SPECIES_POOL, SpeciesId.DACHSBUN, 4)
    .withMoneyMultiplier(1.5)
    .build(),
  [TrainerType.ERI]: new TrainerConfigBuilder(TrainerType.ERI)
    .withFixedName("eri", TrainerGender.FEMALE)
    .withTitle("trainerTitles:star_admin")
    .withSpriteKey("eri")
    .withEncounterBgm(TrainerType.PLASMA_GRUNT)
    .withBattleBgm("battle_star_admin")
    .withVictoryBgm("victory_team_plasma")
    .withTeamStarAdminParty(ERI_SPECIES_POOL, SpeciesId.ANNIHILAPE, 5)
    .withMoneyMultiplier(1.5)
    .build(),
};

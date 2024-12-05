import { Species } from "#app/enums/species";
import { TrainerType } from "#enums/trainer-type";
import {
  TrainerConfig,
  getRandomPartyMemberFunc,
  TrainerSlot,
  TrainerPoolTier,
  TrainerPartyTemplate,
  trainerPartyTemplates,
} from "../../trainer-config";
import { Moves } from "#app/enums/moves";
import { PokemonMove } from "#app/field/pokemon";
import BattleScene from "#app/battle-scene";

/**
 * The function to get variable strength grunts
 * @param scene the singleton scene being passed in
 * @returns the correct TrainerPartyTemplate
 */
function getEvilGruntPartyTemplate(scene: BattleScene): TrainerPartyTemplate {
  const waveIndex = scene.currentBattle?.waveIndex;
  if (waveIndex < 40) {
    return trainerPartyTemplates.TWO_AVG;
  } else if (waveIndex < 63) {
    return trainerPartyTemplates.THREE_AVG;
  } else if (waveIndex < 65) {
    return trainerPartyTemplates.TWO_AVG_ONE_STRONG;
  } else if (waveIndex < 112) {
    return trainerPartyTemplates.GYM_LEADER_4; // 3avg 1 strong 1 stronger
  } else {
    return trainerPartyTemplates.GYM_LEADER_5; // 3 avg 2 strong 1 stronger
  }
}

let t = TrainerType.ROCKET_GRUNT;
export const evilTeamTrainerConfigs = {
  [TrainerType.ROCKET_GRUNT]: new TrainerConfig(t)
    .setHasGenders("Rocket Grunt Female")
    .setHasDouble("Rocket Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.WEEDLE,
        Species.RATTATA,
        Species.EKANS,
        Species.SANDSHREW,
        Species.ZUBAT,
        Species.GEODUDE,
        Species.KOFFING,
        Species.GRIMER,
        Species.ODDISH,
        Species.SLOWPOKE,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.GYARADOS,
        Species.LICKITUNG,
        Species.TAUROS,
        Species.MANKEY,
        Species.SCYTHER,
        Species.ELEKID,
        Species.MAGBY,
        Species.CUBONE,
        Species.GROWLITHE,
        Species.MURKROW,
        Species.GASTLY,
        Species.EXEGGCUTE,
        Species.VOLTORB,
        Species.MAGNEMITE,
      ],
      [TrainerPoolTier.RARE]: [
        Species.PORYGON,
        Species.ALOLA_RATTATA,
        Species.ALOLA_SANDSHREW,
        Species.ALOLA_MEOWTH,
        Species.ALOLA_GRIMER,
        Species.ALOLA_GEODUDE,
        Species.PALDEA_TAUROS,
        Species.OMANYTE,
        Species.KABUTO,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.DRATINI, Species.LARVITAR],
    }),
  [TrainerType.ARCHER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [Species.HOUNDOOM])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.ARIANA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin_female", "rocket", [Species.ARBOK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.PROTON]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [Species.CROBAT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.PETREL]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("rocket_admin", "rocket", [Species.WEEZING])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_rocket_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.MAGMA_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Magma Grunt Female")
    .setHasDouble("Magma Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.SLUGMA,
        Species.POOCHYENA,
        Species.NUMEL,
        Species.ZIGZAGOON,
        Species.DIGLETT,
        Species.MAGBY,
        Species.TORKOAL,
        Species.GROWLITHE,
        Species.BALTOY,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.SOLROCK,
        Species.HIPPOPOTAS,
        Species.SANDACONDA,
        Species.PHANPY,
        Species.ROLYCOLY,
        Species.GLIGAR,
        Species.RHYHORN,
        Species.HEATMOR,
      ],
      [TrainerPoolTier.RARE]: [
        Species.TRAPINCH,
        Species.LILEEP,
        Species.ANORITH,
        Species.HISUI_GROWLITHE,
        Species.TURTONATOR,
        Species.ARON,
        Species.TOEDSCOOL,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.CAPSAKID, Species.CHARCADET],
    }),
  [TrainerType.TABITHA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("magma_admin", "magma", [Species.CAMERUPT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.COURTNEY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("magma_admin_female", "magma", [Species.CAMERUPT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.AQUA_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Aqua Grunt Female")
    .setHasDouble("Aqua Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.CARVANHA,
        Species.WAILMER,
        Species.ZIGZAGOON,
        Species.LOTAD,
        Species.CORPHISH,
        Species.SPHEAL,
        Species.REMORAID,
        Species.QWILFISH,
        Species.BARBOACH,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.CLAMPERL,
        Species.CHINCHOU,
        Species.WOOPER,
        Species.WINGULL,
        Species.TENTACOOL,
        Species.AZURILL,
        Species.CLOBBOPUS,
        Species.HORSEA,
      ],
      [TrainerPoolTier.RARE]: [
        Species.MANTYKE,
        Species.DHELMISE,
        Species.HISUI_QWILFISH,
        Species.ARROKUDA,
        Species.PALDEA_WOOPER,
        Species.SKRELP,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.DONDOZO, Species.BASCULEGION],
    }),
  [TrainerType.MATT]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aqua_admin", "aqua", [Species.SHARPEDO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.SHELLY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aqua_admin_female", "aqua", [Species.SHARPEDO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aqua_magma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.GALACTIC_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Galactic Grunt Female")
    .setHasDouble("Galactic Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_galactic_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.GLAMEOW,
        Species.STUNKY,
        Species.CROAGUNK,
        Species.SHINX,
        Species.WURMPLE,
        Species.BRONZOR,
        Species.DRIFLOON,
        Species.BURMY,
        Species.CARNIVINE,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.LICKITUNG,
        Species.RHYHORN,
        Species.TANGELA,
        Species.ZUBAT,
        Species.YANMA,
        Species.SKORUPI,
        Species.GLIGAR,
        Species.SWINUB,
      ],
      [TrainerPoolTier.RARE]: [
        Species.HISUI_GROWLITHE,
        Species.HISUI_QWILFISH,
        Species.SNEASEL,
        Species.ELEKID,
        Species.MAGBY,
        Species.DUSKULL,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.ROTOM, Species.SPIRITOMB, Species.HISUI_SNEASEL],
    }),
  [TrainerType.JUPITER]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander_female", "galactic", [Species.SKUNTANK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.MARS]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander_female", "galactic", [Species.PURUGLY])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.SATURN]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("galactic_commander", "galactic", [Species.TOXICROAK])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_galactic_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.PLASMA_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Plasma Grunt Female")
    .setHasDouble("Plasma Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.PATRAT,
        Species.LILLIPUP,
        Species.PURRLOIN,
        Species.SCRAFTY,
        Species.WOOBAT,
        Species.VANILLITE,
        Species.SANDILE,
        Species.TRUBBISH,
        Species.TYMPOLE,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.FRILLISH,
        Species.VENIPEDE,
        Species.GOLETT,
        Species.TIMBURR,
        Species.DARUMAKA,
        Species.FOONGUS,
        Species.JOLTIK,
        Species.CUBCHOO,
        Species.KLINK,
      ],
      [TrainerPoolTier.RARE]: [
        Species.PAWNIARD,
        Species.RUFFLET,
        Species.VULLABY,
        Species.ZORUA,
        Species.DRILBUR,
        Species.MIENFOO,
        Species.DURANT,
        Species.BOUFFALANT,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.DRUDDIGON, Species.HISUI_ZORUA, Species.AXEW, Species.DEINO],
    }),
  [TrainerType.ZINZOLIN]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("plasma_sage", "plasma", [Species.CRYOGONAL])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.ROOD]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("plasma_sage", "plasma", [Species.SWOOBAT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_plasma_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.FLARE_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Flare Grunt Female")
    .setHasDouble("Flare Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.FLETCHLING,
        Species.LITLEO,
        Species.PONYTA,
        Species.INKAY,
        Species.HOUNDOUR,
        Species.SKORUPI,
        Species.SCRAFTY,
        Species.CROAGUNK,
        Species.SCATTERBUG,
        Species.ESPURR,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.HELIOPTILE,
        Species.ELECTRIKE,
        Species.SKRELP,
        Species.PANCHAM,
        Species.PURRLOIN,
        Species.POOCHYENA,
        Species.BINACLE,
        Species.CLAUNCHER,
        Species.PUMPKABOO,
        Species.PHANTUMP,
        Species.FOONGUS,
      ],
      [TrainerPoolTier.RARE]: [Species.LITWICK, Species.SNEASEL, Species.PAWNIARD, Species.SLIGGOO],
      [TrainerPoolTier.SUPER_RARE]: [Species.NOIBAT, Species.HISUI_SLIGGOO, Species.HISUI_AVALUGG],
    }),
  [TrainerType.BRYONY]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("flare_admin_female", "flare", [Species.LIEPARD])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.XEROSIC]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("flare_admin", "flare", [Species.MALAMAR])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_flare_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.AETHER_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Aether Grunt Female")
    .setHasDouble("Aether Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aether_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.PIKIPEK,
        Species.ROCKRUFF,
        Species.ALOLA_DIGLETT,
        Species.ALOLA_EXEGGUTOR,
        Species.YUNGOOS,
        Species.CORSOLA,
        Species.ALOLA_GEODUDE,
        Species.ALOLA_RAICHU,
        Species.BOUNSWEET,
        Species.LILLIPUP,
        Species.KOMALA,
        Species.MORELULL,
        Species.COMFEY,
        Species.TOGEDEMARU,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.POLIWAG,
        Species.STUFFUL,
        Species.ORANGURU,
        Species.PASSIMIAN,
        Species.BRUXISH,
        Species.MINIOR,
        Species.WISHIWASHI,
        Species.ALOLA_SANDSHREW,
        Species.ALOLA_VULPIX,
        Species.CRABRAWLER,
        Species.CUTIEFLY,
        Species.ORICORIO,
        Species.MUDBRAY,
        Species.PYUKUMUKU,
        Species.ALOLA_MAROWAK,
      ],
      [TrainerPoolTier.RARE]: [
        Species.GALAR_CORSOLA,
        Species.TURTONATOR,
        Species.MIMIKYU,
        Species.MAGNEMITE,
        Species.DRAMPA,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.JANGMO_O, Species.PORYGON],
    }),
  [TrainerType.FABA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("aether_admin", "aether", [Species.HYPNO])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_aether_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.SKULL_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Skull Grunt Female")
    .setHasDouble("Skull Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_skull_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.SALANDIT,
        Species.ALOLA_RATTATA,
        Species.EKANS,
        Species.ALOLA_MEOWTH,
        Species.SCRAGGY,
        Species.KOFFING,
        Species.ALOLA_GRIMER,
        Species.MAREANIE,
        Species.SPINARAK,
        Species.TRUBBISH,
        Species.DROWZEE,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.FOMANTIS,
        Species.SABLEYE,
        Species.SANDILE,
        Species.HOUNDOUR,
        Species.ALOLA_MAROWAK,
        Species.GASTLY,
        Species.PANCHAM,
        Species.ZUBAT,
        Species.VENIPEDE,
        Species.VULLABY,
      ],
      [TrainerPoolTier.RARE]: [
        Species.SANDYGAST,
        Species.PAWNIARD,
        Species.MIMIKYU,
        Species.DHELMISE,
        Species.WISHIWASHI,
        Species.NYMBLE,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.GRUBBIN, Species.DEWPIDER],
    }),
  [TrainerType.PLUMERIA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("skull_admin", "skull", [Species.SALAZZLE])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_skull_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.MACRO_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Macro Grunt Female")
    .setHasDouble("Macro Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_macro_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.CUFANT,
        Species.GALAR_MEOWTH,
        Species.KLINK,
        Species.ROOKIDEE,
        Species.CRAMORANT,
        Species.GALAR_ZIGZAGOON,
        Species.SKWOVET,
        Species.STEELIX,
        Species.MAWILE,
        Species.FERROSEED,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.DRILBUR,
        Species.MAGNEMITE,
        Species.HATENNA,
        Species.ARROKUDA,
        Species.APPLIN,
        Species.GALAR_PONYTA,
        Species.GALAR_YAMASK,
        Species.SINISTEA,
        Species.RIOLU,
      ],
      [TrainerPoolTier.RARE]: [
        Species.FALINKS,
        Species.BELDUM,
        Species.GALAR_FARFETCHD,
        Species.GALAR_MR_MIME,
        Species.HONEDGE,
        Species.SCIZOR,
        Species.GALAR_DARUMAKA,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.DURALUDON, Species.DREEPY],
    }),
  [TrainerType.OLEANA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("macro_admin", "macro", [Species.GARBODOR])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_oleana")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene)),
  [TrainerType.STAR_GRUNT]: new TrainerConfig(++t)
    .setHasGenders("Star Grunt Female")
    .setHasDouble("Star Grunts")
    .setMoneyMultiplier(1.0)
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_star_grunt")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [
        Species.DUNSPARCE,
        Species.HOUNDOUR,
        Species.AZURILL,
        Species.GULPIN,
        Species.FOONGUS,
        Species.FLETCHLING,
        Species.LITLEO,
        Species.FLABEBE,
        Species.CRABRAWLER,
        Species.NYMBLE,
        Species.PAWMI,
        Species.FIDOUGH,
        Species.SQUAWKABILLY,
        Species.MASCHIFF,
        Species.SHROODLE,
        Species.KLAWF,
        Species.WIGLETT,
        Species.PALDEA_WOOPER,
      ],
      [TrainerPoolTier.UNCOMMON]: [
        Species.KOFFING,
        Species.EEVEE,
        Species.GIRAFARIG,
        Species.RALTS,
        Species.TORKOAL,
        Species.SEVIPER,
        Species.SCRAGGY,
        Species.ZORUA,
        Species.MIMIKYU,
        Species.IMPIDIMP,
        Species.FALINKS,
        Species.CAPSAKID,
        Species.TINKATINK,
        Species.BOMBIRDIER,
        Species.CYCLIZAR,
        Species.FLAMIGO,
        Species.PALDEA_TAUROS,
      ],
      [TrainerPoolTier.RARE]: [
        Species.MANKEY,
        Species.PAWNIARD,
        Species.CHARCADET,
        Species.FLITTLE,
        Species.VAROOM,
        Species.ORTHWORM,
      ],
      [TrainerPoolTier.SUPER_RARE]: [Species.DONDOZO, Species.GIMMIGHOUL],
    }),
  [TrainerType.GIACOMO]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_1", [Species.KINGAMBIT])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Segin Starmobile
        p.moveset = [
          new PokemonMove(Moves.WICKED_TORQUE),
          new PokemonMove(Moves.SPIN_OUT),
          new PokemonMove(Moves.SHIFT_GEAR),
          new PokemonMove(Moves.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.MELA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_2", [Species.ARMAROUGE])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 2; // Schedar Starmobile
        p.moveset = [
          new PokemonMove(Moves.BLAZING_TORQUE),
          new PokemonMove(Moves.SPIN_OUT),
          new PokemonMove(Moves.SHIFT_GEAR),
          new PokemonMove(Moves.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.ATTICUS]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_3", [Species.REVAVROOM])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 3; // Navi Starmobile
        p.moveset = [
          new PokemonMove(Moves.NOXIOUS_TORQUE),
          new PokemonMove(Moves.SPIN_OUT),
          new PokemonMove(Moves.SHIFT_GEAR),
          new PokemonMove(Moves.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.ORTEGA]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_4", [Species.DACHSBUN])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 4; // Ruchbah Starmobile
        p.moveset = [
          new PokemonMove(Moves.MAGICAL_TORQUE),
          new PokemonMove(Moves.SPIN_OUT),
          new PokemonMove(Moves.SHIFT_GEAR),
          new PokemonMove(Moves.HIGH_HORSEPOWER),
        ];
      }),
    ),
  [TrainerType.ERI]: new TrainerConfig(++t)
    .setMoneyMultiplier(1.5)
    .initForEvilTeamAdmin("star_admin", "star_5", [Species.ANNIHILAPE])
    .setEncounterBgm(TrainerType.PLASMA_GRUNT)
    .setBattleBgm("battle_plasma_grunt")
    .setMixedBattleBgm("battle_star_admin")
    .setVictoryBgm("victory_team_plasma")
    .setPartyTemplateFunc((scene) => getEvilGruntPartyTemplate(scene))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 5; // Caph Starmobile
        p.moveset = [
          new PokemonMove(Moves.COMBAT_TORQUE),
          new PokemonMove(Moves.SPIN_OUT),
          new PokemonMove(Moves.SHIFT_GEAR),
          new PokemonMove(Moves.HIGH_HORSEPOWER),
        ];
      }),
    ),
};

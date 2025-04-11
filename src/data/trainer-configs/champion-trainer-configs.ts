import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";
import { PokeballType } from "#enums/pokeball-type";
import { modifierTypes } from "#app/modifier/modifier-types";
import type { PersistentModifier } from "#app/modifier/modifier";
import { ElementalType } from "#enums/elemental-type";
import { TrainerVariant } from "#enums/trainer-variant";
import {
  KANTO_CHAMPION_THEME,
  JOHTO_CHAMPION_THEME,
  HOENN5_CHAMPION_THEME,
  HOENN6_CHAMPION_THEME,
  SINNOH_CHAMPION_THEME,
  DEFAULT_CHAMPION_THEME,
  IRIS_CHAMPION_THEME,
  KALOS_CHAMPION_THEME,
  ALOLA_CHAMPION_THEME,
  GALAR_CHAMPION_THEME,
  GEETA_CHAMPION_THEME,
  NEMONA_CHAMPION_THEME,
  KIERAN_CHAMPION_THEME,
} from "#app/data/music-constants";

let t = TrainerType.BLUE;
export const championTrainerConfigs: TrainerConfigs = {
  [TrainerType.BLUE]: new TrainerConfig(t)
    .initForChampion(TrainerVariant.DEFAULT, [KANTO_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [SpeciesId.EXEGGUTOR, SpeciesId.ARCANINE, SpeciesId.GYARADOS],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.UMBREON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ALAKAZAM]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.RHYPERIOR, SpeciesId.MAGNEZONE]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.MACHAMP], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // G-Max Machamp
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.PIDGEOT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Pigeot
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.RED]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [JOHTO_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.PIKACHU], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 8; // G-Max Pikachu
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.ESPEON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.LAPRAS]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.AERODACTYL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.SNORLAX], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc(
        [SpeciesId.VENUSAUR, SpeciesId.CHARIZARD, SpeciesId.BLASTOISE],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          if (p.species.speciesId === SpeciesId.CHARIZARD) {
            p.formIndex = 2; // Mega Charizard Y
          } else {
            p.formIndex = 1; // Mega Venusaur or Mega Blastoise
          }
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
          p.generateName();
        },
      ),
    ),
  [TrainerType.LANCE_CHAMPION]: new TrainerConfig(++t)
    .setName("Lance")
    .initForChampion(TrainerVariant.DEFAULT, [JOHTO_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GYARADOS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.SALAMENCE, SpeciesId.GARCHOMP]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.KINGDRA]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Charizard X
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.DRAGONITE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.HO_OH, SpeciesId.LUGIA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.STEVEN]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [HOENN5_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.SKARMORY]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.AGGRON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ARMALDO, SpeciesId.CRADILY]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.CLAYDOL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.METAGROSS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Metagross
        p.generateAndPopulateMoveset();
        p.generateName();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.DIALGA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.WALLACE]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [HOENN6_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.PELIPPER], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 1; // Drizzle
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.SWAMPERT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Swampert
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.LUDICOLO]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.WAILORD, SpeciesId.WALREIN]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.MILOTIC], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.PALKIA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.CYNTHIA]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [SINNOH_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.SPIRITOMB]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.TOGEKISS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ROSERADE, SpeciesId.GASTRODON]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.LUCARIO]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.GARCHOMP], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Garchomp
        p.generateAndPopulateMoveset();
        p.generateName();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.GIRATINA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.ALDER]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [DEFAULT_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.BOUFFALANT, SpeciesId.BRAVIARY]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.VANILLUXE]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.CONKELDURR, SpeciesId.REUNICLUS, SpeciesId.KROOKODILE, SpeciesId.CHANDELURE]),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.ACCELGOR, SpeciesId.ESCAVALIER]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.VOLCARONA], TrainerSlot.TRAINER, true, (p) => {
        // Tera Fire
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.ZEKROM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[4];
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [ElementalType.FIRE])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(teraPokemon) as PersistentModifier,
      ]; //TODO: is the bang correct?
    }),
  [TrainerType.IRIS]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [IRIS_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.HYDREIGON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.ARCHEOPS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.DRUDDIGON]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.LAPRAS, SpeciesId.AGGRON], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Lapras or Mega Aggron
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.HAXORUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.RESHIRAM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.DIANTHA]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [KALOS_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GOURGEIST]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.TYRANTRUM, SpeciesId.AURORUS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.GOODRA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.HAWLUCHA]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.GARDEVOIR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Gardevoir
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.XERNEAS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.HAU]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [ALOLA_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.ALOLA_RAICHU]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.NOIVERN]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.CRABOMINABLE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.TAPU_BULU, SpeciesId.TAPU_FINI, SpeciesId.TAPU_KOKO, SpeciesId.TAPU_LELE]),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc(
        [SpeciesId.DECIDUEYE, SpeciesId.INCINEROAR, SpeciesId.PRIMARINA],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.BLACEPHALON, SpeciesId.STAKATAKA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[4];
      let teraType: ElementalType;
      switch (teraPokemon.species.speciesId) {
        case SpeciesId.DECIDUEYE:
          teraType = ElementalType.GHOST;
          break;
        case SpeciesId.INCINEROAR:
          teraType = ElementalType.DARK;
          break;
        default:
          teraType = ElementalType.WATER;
      }
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [teraType])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(teraPokemon) as PersistentModifier,
      ]; //TODO: is the bang correct?
    }),
  [TrainerType.LEON]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [GALAR_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.RILLABOOM, SpeciesId.CINDERACE, SpeciesId.INTELEON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.MR_RIME]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.DRAGAPULT]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.AEGISLASH]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 3; // G-Max Charizard
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.ZACIAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.GEETA]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [GEETA_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GLIMMORA]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.ESPATHRA, SpeciesId.VELUZA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.AVALUGG, SpeciesId.HISUI_AVALUGG]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.GOGOAT, SpeciesId.CHESNAUGHT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.KINGAMBIT], TrainerSlot.TRAINER, true, (p) => {
        // Tera flying
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.MIRAIDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[4];
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [ElementalType.FLYING])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(teraPokemon) as PersistentModifier,
      ]; //TODO: is the bang correct?
    }),
  [TrainerType.NEMONA]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [NEMONA_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.LYCANROC], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 0; // Midday form
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.PAWMOT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ORTHWORM]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.DUDUNSPARCE]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc(
        [SpeciesId.MEOWSCARADA, SpeciesId.SKELEDIRGE, SpeciesId.QUAQUAVAL],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          // Tera Grass/Fire/Water based on the starter
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.KORAIDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[4];
      let teraType: ElementalType;
      switch (teraPokemon.species.speciesId) {
        case SpeciesId.MEOWSCARADA:
          teraType = ElementalType.GRASS;
          break;
        case SpeciesId.SKELEDIRGE:
          teraType = ElementalType.FIRE;
          break;
        default:
          teraType = ElementalType.WATER;
      }
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [teraType])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(teraPokemon) as PersistentModifier,
      ]; //TODO: is the bang correct?
    }),
  [TrainerType.KIERAN]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [KIERAN_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.POLIWRATH, SpeciesId.POLITOED]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.PORYGON_Z, SpeciesId.YANMEGA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.DRAGONITE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.GRIMMSNARL], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Grimmsnarl
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.HYDRAPPLE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.TERAPAGOS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
};

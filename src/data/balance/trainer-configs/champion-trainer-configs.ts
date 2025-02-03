import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import { Species } from "#enums/species";
import { TrainerType } from "#enums/trainer-type";
import { PokeballType } from "#enums/pokeball";
import { modifierTypes } from "#app/modifier/modifier-type";
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
        [Species.EXEGGUTOR, Species.ARCANINE, Species.GYARADOS],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.UMBREON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.ALAKAZAM]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.RHYPERIOR, Species.MAGNEZONE]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.MACHAMP], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // G-Max Machamp
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([Species.PIKACHU], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 8; // G-Max Pikachu
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.ESPEON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.LAPRAS]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.AERODACTYL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.SNORLAX], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc(
        [Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          if (p.species.speciesId === Species.CHARIZARD) {
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
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.GYARADOS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.SALAMENCE, Species.GARCHOMP]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.KINGDRA]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Charizard X
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.DRAGONITE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.HO_OH, Species.LUGIA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.STEVEN]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [HOENN5_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.SKARMORY]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.AGGRON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.ARMALDO, Species.CRADILY]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.CLAYDOL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.METAGROSS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Metagross
        p.generateAndPopulateMoveset();
        p.generateName();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.DIALGA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.WALLACE]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [HOENN6_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.PELIPPER], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 1; // Drizzle
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.SWAMPERT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Swampert
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.LUDICOLO]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.WAILORD, Species.WALREIN]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.MILOTIC], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.PALKIA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.CYNTHIA]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [SINNOH_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.SPIRITOMB]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.TOGEKISS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.ROSERADE, Species.GASTRODON]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.LUCARIO]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.GARCHOMP], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Garchomp
        p.generateAndPopulateMoveset();
        p.generateName();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.GIRATINA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.ALDER]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [DEFAULT_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.BOUFFALANT, Species.BRAVIARY]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.VANILLUXE]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.CONKELDURR, Species.REUNICLUS, Species.KROOKODILE, Species.CHANDELURE]),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.ACCELGOR, Species.ESCAVALIER]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.VOLCARONA], TrainerSlot.TRAINER, true, (p) => {
        // Tera Fire
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.ZEKROM], TrainerSlot.TRAINER, true, (p) => {
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
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.HYDREIGON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.ARCHEOPS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.DRUDDIGON]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.LAPRAS, Species.AGGRON], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Lapras or Mega Aggron
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.HAXORUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.RESHIRAM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.DIANTHA]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [KALOS_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.GOURGEIST]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.TYRANTRUM, Species.AURORUS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.GOODRA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.HAWLUCHA]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.GARDEVOIR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Gardevoir
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.XERNEAS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.HAU]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.DEFAULT, [ALOLA_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ALOLA_RAICHU]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.NOIVERN]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.CRABOMINABLE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.TAPU_BULU, Species.TAPU_FINI, Species.TAPU_KOKO, Species.TAPU_LELE]),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc(
        [Species.DECIDUEYE, Species.INCINEROAR, Species.PRIMARINA],
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
      getRandomPartyMemberFunc([Species.BLACEPHALON, Species.STAKATAKA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[4];
      let teraType: ElementalType;
      switch (teraPokemon.species.speciesId) {
        case Species.DECIDUEYE:
          teraType = ElementalType.GHOST;
          break;
        case Species.INCINEROAR:
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
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.RILLABOOM, Species.CINDERACE, Species.INTELEON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.MR_RIME]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.DRAGAPULT]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.AEGISLASH]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 3; // G-Max Charizard
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.ZACIAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.GEETA]: new TrainerConfig(++t)
    .initForChampion(TrainerVariant.FEMALE, [GEETA_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.GLIMMORA]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.ESPATHRA, Species.VELUZA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.AVALUGG, Species.HISUI_AVALUGG]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.GOGOAT, Species.CHESNAUGHT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.KINGAMBIT], TrainerSlot.TRAINER, true, (p) => {
        // Tera flying
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.MIRAIDON], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([Species.LYCANROC], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 0; // Midday form
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PAWMOT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.ORTHWORM]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.DUDUNSPARCE]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc(
        [Species.MEOWSCARADA, Species.SKELEDIRGE, Species.QUAQUAVAL],
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
      getRandomPartyMemberFunc([Species.KORAIDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[4];
      let teraType: ElementalType;
      switch (teraPokemon.species.speciesId) {
        case Species.MEOWSCARADA:
          teraType = ElementalType.GRASS;
          break;
        case Species.SKELEDIRGE:
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
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.POLIWRATH, Species.POLITOED]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PORYGON_Z, Species.YANMEGA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.DRAGONITE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.GRIMMSNARL], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Grimmsnarl
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.HYDRAPPLE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.TERAPAGOS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
};

import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import { Species } from "#enums/species";
import { TrainerType } from "#enums/trainer-type";

const DEFAULT_CHAMPION_THEME = "battle_champion_alder";
const KANTO_CHAMPION_THEME = "battle_kanto_champion";
const JOHTO_CHAMPION_THEME = "battle_johto_champion";
const HOENN5_CHAMPION_THEME = "battle_hoenn_champion_g5";
const HOENN6_CHAMPION_THEME = "battle_hoenn_champion_g6";
const SINNOH_CHAMPION_THEME = "battle_sinnoh_champion";
const IRIS_CHAMPION_THEME = "battle_champion_iris";
const KALOS_CHAMPION_THEME = "battle_kalos_champion";
const ALOLA_CHAMPION_THEME = "battle_alola_champion";
const GALAR_CHAMPION_THEME = "battle_galar_champion";
const GEETA_CHAMPION_THEME = "battle_champion_geeta";
const NEMONA_CHAMPION_THEME = "battle_champion_nemona";
const KIERAN_CHAMPION_THEME = "battle_champion_kieran";

let t = TrainerType.BLUE;
export const championTrainerConfigs: TrainerConfigs = {
  [TrainerType.BLUE]: new TrainerConfig(t)
    .initForChampion(true, KANTO_CHAMPION_THEME, KANTO_CHAMPION_THEME)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ALAKAZAM]))
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Pidgeot
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.GYARADOS, Species.ARCANINE, Species.EXEGGUTOR]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.HO_OH]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.RHYPERIOR, Species.MAGNEZONE]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.RED]: new TrainerConfig(++t)
    .initForChampion(true, JOHTO_CHAMPION_THEME, JOHTO_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.PIKACHU], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 8; // G-Max Pikachu
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.formIndex = 1; // Mega Venusaur, Mega Charizard X, or Mega Blastoise
          p.generateAndPopulateMoveset();
          p.generateName();
        },
      ),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.LUGIA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.SNORLAX]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.ESPEON, Species.UMBREON, Species.SYLVEON]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.LANCE_CHAMPION]: new TrainerConfig(++t)
    .setName("Lance")
    .initForChampion(true, JOHTO_CHAMPION_THEME, JOHTO_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.AERODACTYL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.LATIAS, Species.LATIOS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Latias or Mega Latios
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.DRAGONITE]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.KINGDRA]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.ALOLA_EXEGGUTOR]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.STEVEN]: new TrainerConfig(++t)
    .initForChampion(true, HOENN5_CHAMPION_THEME, HOENN6_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SKARMORY], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.METAGROSS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Metagross
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.AGGRON]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.ARMALDO, Species.CRADILY]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.DIALGA]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.WALLACE]: new TrainerConfig(++t)
    .initForChampion(true, HOENN5_CHAMPION_THEME, HOENN6_CHAMPION_THEME)
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
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.PALKIA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.MILOTIC]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.LUDICOLO]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.CYNTHIA]: new TrainerConfig(++t)
    .initForChampion(false, SINNOH_CHAMPION_THEME, SINNOH_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SPIRITOMB], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.GARCHOMP], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Garchomp
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.GIRATINA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.LUCARIO]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.TOGEKISS]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.ALDER]: new TrainerConfig(++t)
    .initForChampion(true, DEFAULT_CHAMPION_THEME, DEFAULT_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.BOUFFALANT, Species.BRAVIARY], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.VOLCARONA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.ZEKROM]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.ACCELGOR, Species.ESCAVALIER]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.KELDEO]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.IRIS]: new TrainerConfig(++t)
    .initForChampion(false, IRIS_CHAMPION_THEME, IRIS_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.DRUDDIGON], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.LAPRAS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Lapras
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.HAXORUS]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.RESHIRAM]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.ARCHEOPS]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.DIANTHA]: new TrainerConfig(++t)
    .initForChampion(false, DEFAULT_CHAMPION_THEME, KALOS_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.GOURGEIST], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.GARDEVOIR], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Gardevoir
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.HAWLUCHA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.XERNEAS]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.GOODRA]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.HAU]: new TrainerConfig(++t)
    .initForChampion(true, DEFAULT_CHAMPION_THEME, ALOLA_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.ALOLA_RAICHU], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.SOLGALEO, Species.LUNALA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.NOIVERN]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.DECIDUEYE, Species.INCINEROAR, Species.PRIMARINA]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.TAPU_BULU, Species.TAPU_FINI, Species.TAPU_KOKO, Species.TAPU_LELE]),
    )
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.LEON]: new TrainerConfig(++t)
    .initForChampion(true, DEFAULT_CHAMPION_THEME, GALAR_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [Species.RILLABOOM, Species.CINDERACE, Species.INTELEON],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 3; // G-Max Charizard
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.DRAGAPULT]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.ZACIAN]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.AEGISLASH]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.GEETA]: new TrainerConfig(++t)
    .initForChampion(false, DEFAULT_CHAMPION_THEME, GEETA_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.GLIMMORA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.MIRAIDON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.ESPATHRA, Species.VELUZA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.AVALUGG, Species.HISUI_AVALUGG]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.KINGAMBIT]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.NEMONA]: new TrainerConfig(++t)
    .initForChampion(false, DEFAULT_CHAMPION_THEME, NEMONA_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.LYCANROC], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 0; // Midday form
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.KORAIDON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.PAWMOT]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.DUDUNSPARCE, Species.ORTHWORM]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.MEOWSCARADA, Species.SKELEDIRGE, Species.QUAQUAVAL]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
  [TrainerType.KIERAN]: new TrainerConfig(++t)
    .initForChampion(true, DEFAULT_CHAMPION_THEME, KIERAN_CHAMPION_THEME)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.POLIWRATH, Species.POLITOED], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PORYGON_Z, Species.INCINEROAR, Species.GRIMMSNARL]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.OGERPON]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.TERAPAGOS]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.HYDRAPPLE]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.DITTO])),
};

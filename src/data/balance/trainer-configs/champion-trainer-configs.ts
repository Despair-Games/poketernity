import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import { Species } from "#enums/species";
import { TrainerType } from "#enums/trainer-type";
import { Gender } from "#enums/gender";

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
  [TrainerType.RED_BLUE]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ESPEON], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.UMBREON], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.PIKACHU], TrainerSlot.TRAINER)) // G-MAX
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.MACHAMP], TrainerSlot.TRAINER_PARTNER)) // G-MAX
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE], TrainerSlot.TRAINER), // MEGA
    )
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.ALAKAZAM], TrainerSlot.TRAINER_PARTNER)) // MEGA
    .setSpriteNames("red", "blue")
    .setHasDouble("red_blue_double")
    .initForChampion(Gender.DOUBLE, KANTO_CHAMPION_THEME, KANTO_CHAMPION_THEME), // Technically Red should have Johto Champion theme but since blue doesnt get his own entry, we'll just use Kanto Champion theme
  [TrainerType.LANCE_CLAIR]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.DRAGONITE], TrainerSlot.TRAINER)) // (They both use Dragonite - even if their only ever mainline battle together is in the Johto games. So i like the idea of them fighting together with Dragonite)
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.DRAGONITE], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.CHARIZARD], TrainerSlot.TRAINER)) // MEGA-X
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.ALTARIA], TrainerSlot.TRAINER_PARTNER)) // MEGA
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.HO_OH], TrainerSlot.TRAINER)) // Dragonite would be the signature, but we gave ho-oh to him in his single battle so i like for him to have it here too
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.KINGDRA], TrainerSlot.TRAINER_PARTNER)) // Signature
    .setSpriteNames("lance", "clair")
    .setHasDouble("lance_clair_double")
    .initForChampion(Gender.DOUBLE, JOHTO_CHAMPION_THEME, JOHTO_CHAMPION_THEME),
  [TrainerType.STEVEN_WALLACE]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.SKARMORY], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.WHISCASH], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.METAGROSS], TrainerSlot.TRAINER)) // MEGA
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.MILOTIC], TrainerSlot.TRAINER_PARTNER)) // Does he need a mega/gmax? If so Milotic would go to slot 1. I would then probably give him Urshifu GMAX in slot 3
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.LATIAS], TrainerSlot.TRAINER)) // They are not mega on purpose. So they arent THAT strong
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.LATIOS], TrainerSlot.TRAINER_PARTNER))
    .setSpriteNames("steven", "wallace")
    .setHasDouble("steven_wallace_double")
    .initForChampion(Gender.DOUBLE, HOENN5_CHAMPION_THEME, HOENN6_CHAMPION_THEME),
  [TrainerType.CYNTHIA_CAITLIN]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ROSERADE], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.REUNICLUS], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.GARCHOMP], TrainerSlot.TRAINER)) // MEGA
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.SABLEYE], TrainerSlot.TRAINER_PARTNER)) // MEGA
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.GIRATINA], TrainerSlot.TRAINER))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.CRESSELIA], TrainerSlot.TRAINER_PARTNER))
    .setSpriteNames("cynthia", "caitlin")
    .setHasDouble("cynthia_caitlin_double")
    .initForChampion(Gender.DOUBLE, SINNOH_CHAMPION_THEME, SINNOH_CHAMPION_THEME),
  [TrainerType.IRIS_ALDER]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.HAXORUS], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.VOLCARONA], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.LAPRAS, Species.AGGRON], TrainerSlot.TRAINER)) // GMAX/Mega (same fromindex)
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.ACCELGOR, Species.ESCAVALIER], TrainerSlot.TRAINER_PARTNER),
    ) // This slot needs something better. Just can not find anything
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.RESHIRAM], TrainerSlot.TRAINER))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.ZEKROM], TrainerSlot.TRAINER_PARTNER))
    .setSpriteNames("iris", "alder")
    .setHasDouble("iris_alder_double")
    .initForChampion(Gender.DOUBLE, IRIS_CHAMPION_THEME, IRIS_CHAMPION_THEME),
  [TrainerType.DIANTHA_LYSANDRE]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.GOODRA], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PYROAR], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.GARDEVOIR], TrainerSlot.TRAINER)) // MEGA
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.GYARADOS], TrainerSlot.TRAINER_PARTNER)) // MEGA
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.XERNEAS], TrainerSlot.TRAINER))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.YVELTAL], TrainerSlot.TRAINER_PARTNER))
    .setSpriteNames("diantha", "lysandre")
    .setHasDouble("diantha_lysandre_double")
    .initForChampion(Gender.DOUBLE, KALOS_CHAMPION_THEME, KALOS_CHAMPION_THEME),
  [TrainerType.HAU_KUKUI]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ALOLA_RAICHU], TrainerSlot.TRAINER)) // Signature
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.LYCANROC], TrainerSlot.TRAINER_PARTNER)) // Signature
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc(
        [Species.TAPU_BULU, Species.TAPU_FINI, Species.TAPU_KOKO, Species.TAPU_LELE],
        TrainerSlot.TRAINER,
      ),
    ) // One of the Tapus
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.DECIDUEYE, Species.PRIMARINA, Species.INCINEROAR], TrainerSlot.TRAINER_PARTNER),
    ) // Uses one in his Alola-League fight
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.SOLGALEO], TrainerSlot.TRAINER)) // Those two are up for debate. They are pretty strong but iconic. But maybe if too strong we do UB?
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.LUNALA], TrainerSlot.TRAINER_PARTNER))
    .setSpriteNames("hau", "kukui")
    .setHasDouble("hau_kukui_double")
    .initForChampion(Gender.DOUBLE, ALOLA_CHAMPION_THEME, ALOLA_CHAMPION_THEME),
  [TrainerType.LEON_HOP]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.DRAGAPULT], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.DUBWOOL], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.CHARIZARD], TrainerSlot.TRAINER)) // GMAX
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.RILLABOOM, Species.CINDERACE, Species.INTELEON], TrainerSlot.TRAINER_PARTNER),
    ) // GMAX
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.ZAMAZENTA], TrainerSlot.TRAINER)) // Zamazenta to fit with hop. If thats too strong lets to one of the GALAR Regis?
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.ZACIAN], TrainerSlot.TRAINER_PARTNER)) // Hop NEEDS to have Zacian because of the story and he gets a TCG card with it
    .setSpriteNames("leon", "hop")
    .setHasDouble("leon_hop_double")
    .initForChampion(Gender.DOUBLE, GALAR_CHAMPION_THEME, GALAR_CHAMPION_THEME),
  [TrainerType.GEETA_NEMONA]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.GLIMMORA], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PAWMOT], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.KINGAMBIT], TrainerSlot.TRAINER))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc(
        [Species.MEOWSCARADA, Species.SKELEDIRGE, Species.QUAQUAVAL],
        TrainerSlot.TRAINER_PARTNER,
      ),
    )
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.KORAIDON], TrainerSlot.TRAINER))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.MIRAIDON], TrainerSlot.TRAINER_PARTNER))
    .setSpriteNames("geeta", "nemona")
    .setHasDouble("geeta_nemona_double")
    .initForChampion(Gender.DOUBLE, GEETA_CHAMPION_THEME, NEMONA_CHAMPION_THEME),
  [TrainerType.KIERAN_CARMINE]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.POLIWRATH, Species.POLITOED], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.SINISTCHA], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.HYDRAPPLE, Species.PORYGON_Z], TrainerSlot.TRAINER))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.MIGHTYENA], TrainerSlot.TRAINER_PARTNER)) // Maybe something different? She doesnt use much good pokemon
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.TERAPAGOS], TrainerSlot.TRAINER))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.OGERPON], TrainerSlot.TRAINER_PARTNER)) // Yes she doesnt use it but i wanted to include it because of the story (and otherwise she would be way worse then her brother)
    .setSpriteNames("kieran", "carmine")
    .setHasDouble("kieran_carmine_double")
    .initForChampion(Gender.DOUBLE, KIERAN_CHAMPION_THEME, KIERAN_CHAMPION_THEME),
};

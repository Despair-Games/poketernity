import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";
import { randInt } from "#app/utils";
import { TrainerVariant } from "#enums/trainer-variant";
import {
  KANTO_CHAMPION_THEME,
  JOHTO_CHAMPION_THEME,
  HOENN5_CHAMPION_THEME,
  HOENN6_CHAMPION_THEME,
  SINNOH_CHAMPION_THEME,
  KALOS_CHAMPION_THEME,
  DEFAULT_CHAMPION_THEME,
  IRIS_CHAMPION_THEME,
  ALOLA_CHAMPION_THEME,
  GALAR_CHAMPION_THEME,
  GEETA_CHAMPION_THEME,
  NEMONA_CHAMPION_THEME,
  KIERAN_CHAMPION_THEME,
} from "#app/data/music-constants";

let t = TrainerType.BLUE_RED;
export const championDoubleTrainerConfigs: TrainerConfigs = {
  [TrainerType.BLUE_RED]: new TrainerConfig(t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.UMBREON], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.ESPEON], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.MACHAMP], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // G-Max Machamp
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.SNORLAX], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // G-Max Snorlax
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.ALAKAZAM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Alakazam
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc(
        [SpeciesId.VENUSAUR, SpeciesId.CHARIZARD, SpeciesId.BLASTOISE],
        TrainerSlot.TRAINER_PARTNER,
        true,
        (p) => {
          if (p.species.speciesId === SpeciesId.CHARIZARD) {
            p.formIndex = 2; // Mega Charizard Y (Since lance has X)
          } else {
            p.formIndex = 1; // Mega Venusaur or Mega Blastoise
          }
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
          p.generateName();
        },
      ),
    )
    .setSpriteNames("blue", "red")
    .setHasDouble("blue_red_double")
    .setTitle("old_rivals")
    .initForChampion(TrainerVariant.DOUBLE, [KANTO_CHAMPION_THEME, JOHTO_CHAMPION_THEME]),
  [TrainerType.LANCE_CLAIR]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.DRAGONITE], TrainerSlot.TRAINER)) // (They both use Dragonite - even if their only ever mainline battle together is in the Johto games. So i like the idea of them fighting together with Dragonite)
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.DRAGONITE], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Charizard X
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.ALTARIA], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Altaria
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.HO_OH, SpeciesId.LUGIA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // Dragonite would be the signature, but we gave ho-oh/lugia to him in his single battle so i like for him to have it here too
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.KINGDRA], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // Signature
    .setSpriteNames("lance", "clair")
    .setHasDouble("lance_clair_double")
    .setTitle("dragon_tamers")
    .initForChampion(TrainerVariant.DOUBLE, [JOHTO_CHAMPION_THEME]),
  [TrainerType.STEVEN_WALLACE]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.SKARMORY], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.WHISCASH], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.METAGROSS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Metagross
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // MEGA
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.MILOTIC], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // Signature
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.LATIAS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // They are not mega on purpose. So they arent THAT strong
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.LATIOS], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setSpriteNames("steven", "wallace")
    .setHasDouble("steven_wallace_double")
    .setTitle("hoenn_champions")
    .initForChampion(TrainerVariant.DOUBLE, [HOENN5_CHAMPION_THEME, HOENN6_CHAMPION_THEME]),
  [TrainerType.CYNTHIA_DIANTHA]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.TOGEKISS], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.GOODRA], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.GARCHOMP], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // MEGA
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // MEGA
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.GARDEVOIR], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // MEGA
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // MEGA
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.GIRATINA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.DIANCIE], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // MEGA
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setSpriteNames("cynthia", "diantha")
    .setHasDouble("cynthia_diantha_double")
    .setTitle("champion_friends")
    .initForChampion(TrainerVariant.DOUBLE, [SINNOH_CHAMPION_THEME, KALOS_CHAMPION_THEME]),
  [TrainerType.IRIS_ALDER]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.HAXORUS], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.VOLCARONA], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.LAPRAS, SpeciesId.AGGRON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Aggron or GMAX Lapras
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // GMAX/Mega (same fromindex)
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.ACCELGOR, SpeciesId.ESCAVALIER], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.RESHIRAM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.ZEKROM], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setSpriteNames("iris", "alder")
    .setHasDouble("iris_alder_double")
    .setTitle("unovas_best")
    .initForChampion(TrainerVariant.DOUBLE, [DEFAULT_CHAMPION_THEME, IRIS_CHAMPION_THEME]),
  [TrainerType.HAU_KUKUI]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.ALOLA_RAICHU], TrainerSlot.TRAINER)) // Signature
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.LYCANROC], TrainerSlot.TRAINER_PARTNER)) // Signature
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc(
        [SpeciesId.TAPU_BULU, SpeciesId.TAPU_FINI, SpeciesId.TAPU_KOKO, SpeciesId.TAPU_LELE],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateName();
          p.generateAndPopulateMoveset();
        },
      ),
    ) // One of the Tapus
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc(
        [SpeciesId.DECIDUEYE, SpeciesId.PRIMARINA, SpeciesId.INCINEROAR],
        TrainerSlot.TRAINER_PARTNER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateName();
          p.generateAndPopulateMoveset();
        },
      ),
    ) // Uses one in his Alola-League fight
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.BLACEPHALON, SpeciesId.STAKATAKA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // Those two are up for debate. They are pretty strong but iconic. But maybe if too strong we do UB?
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.ROTOM], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = randInt(p.getFormAmount(), 0); // Random Rotom form since he is the one introducing the rotom phone
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setSpriteNames("hau", "kukui")
    .setHasDouble("hau_kukui_double")
    .setTitle("masters_of_alola")
    .initForChampion(TrainerVariant.DOUBLE, [ALOLA_CHAMPION_THEME]),
  [TrainerType.LEON_HOP]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.DRAGAPULT], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.DUBWOOL], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 3; // GMAX
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc(
        [SpeciesId.RILLABOOM, SpeciesId.CINDERACE, SpeciesId.INTELEON],
        TrainerSlot.TRAINER_PARTNER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.formIndex = 1; // GMAX
          p.generateName();
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.ZAMAZENTA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Crowned (maybe too strong?)
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // Zamazenta to fit with hop. If thats too strong lets to one of the GALAR Regis?
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.ZACIAN], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Crowned (maybe too strong?)
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // Hop NEEDS to have Zacian because of the story and he gets a TCG card with it
    .setSpriteNames("leon", "hop")
    .setHasDouble("leon_hop_double")
    .setTitle("galar_stars")
    .initForChampion(TrainerVariant.DOUBLE, [GALAR_CHAMPION_THEME]),
  [TrainerType.GEETA_NEMONA]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GLIMMORA], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.PAWMOT], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.KINGAMBIT], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc(
        [SpeciesId.MEOWSCARADA, SpeciesId.SKELEDIRGE, SpeciesId.QUAQUAVAL],
        TrainerSlot.TRAINER_PARTNER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateName();
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.KORAIDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.MIRAIDON], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setSpriteNames("geeta", "nemona")
    .setHasDouble("geeta_nemona_double")
    .setTitle("top_champs")
    .initForChampion(TrainerVariant.DOUBLE, [GEETA_CHAMPION_THEME, NEMONA_CHAMPION_THEME]),
  [TrainerType.KIERAN_CARMINE]: new TrainerConfig(++t)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.POLIWRATH, SpeciesId.POLITOED], TrainerSlot.TRAINER))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.SINISTCHA], TrainerSlot.TRAINER_PARTNER))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.HYDRAPPLE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.MIGHTYENA], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // Maybe something different? She doesnt use much good pokemon
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.TERAPAGOS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.PECHARUNT], TrainerSlot.TRAINER_PARTNER, true, (p) => {
        p.setBoss(true, 2);
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    ) // DLC Connection
    .setSpriteNames("kieran", "carmine")
    .setHasDouble("kieran_carmine_double")
    .setTitle("blueberry_siblings")
    .initForChampion(TrainerVariant.DOUBLE, [KIERAN_CHAMPION_THEME]),
};

import { type NonDefaultTrainerGender, TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import { randSeedInt } from "#utils/random-utils";
import i18next from "i18next";

interface TrainerTypeMessages {
  /**
   * The i18n key used to access the Trainer's dialogue.
   * If not given, the key is assumed to be `"trainer_type"` or `"trainer_type_female"`,
   * depending on the Trainer's gender.
   */
  key?: string;
  /** The number of available encounter messages */
  encounter?: number;
  /** The number of available victory messages */
  victory?: number;
  /** The number of available defeat messages */
  defeat?: number;
}
export type TrainerMessageType = keyof Omit<TrainerTypeMessages, "key">;

type GenderedTrainerTypeMessages = Partial<Record<TrainerGender, TrainerTypeMessages>>;
type TrainerTypeDialogue = Partial<Record<TrainerType, GenderedTrainerTypeMessages>>;

const trainerTypeDialogue: TrainerTypeDialogue = {
  [TrainerType.YOUNGSTER]: {
    [TrainerGender.MALE]: {
      encounter: 13,
      victory: 13,
    },
    [TrainerGender.FEMALE]: {
      key: "lass",
      encounter: 9,
      victory: 9,
    },
  },
  [TrainerType.BREEDER]: {
    [TrainerGender.MALE]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
    [TrainerGender.FEMALE]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.FISHERMAN]: {
    [TrainerGender.MALE]: {
      encounter: 3,
      victory: 3,
    },
    [TrainerGender.FEMALE]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.SWIMMER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.BACKPACKER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 4,
      victory: 4,
    },
  },
  [TrainerType.ACE_TRAINER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 4,
      victory: 4,
      defeat: 4,
    },
  },
  [TrainerType.PARASOL_LADY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.TWINS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.CYCLIST]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.BLACK_BELT]: {
    [TrainerGender.MALE]: {
      encounter: 2,
      victory: 2,
    },
    [TrainerGender.FEMALE]: {
      key: "battle_girl",
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.HIKER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.RANGER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.SCIENTIST]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.SCHOOL_KID]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.ARTIST]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.GUITARIST]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.WORKER]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
    [TrainerGender.FEMALE]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  // Defeat dialogue in the language .JSONS exist as translated or placeholders; (en, fr, it, es, de, ja, ko, zh_cn, zh_tw, pt_br)
  [TrainerType.SNOW_WORKER]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.HEX_MANIAC]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.PSYCHIC]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.OFFICER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.BEAUTY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.BAKER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.BIKER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.FIREBREATHER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.SAILOR]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.ROCKET_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.ARCHER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.ARIANA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.PROTON]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.PETREL]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.MAGMA_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.TABITHA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.COURTNEY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.AQUA_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.MATT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.SHELLY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.GALACTIC_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.JUPITER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.MARS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.SATURN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.PLASMA_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.ZINZOLIN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.ROOD]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.FLARE_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.BRYONY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.XEROSIC]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.AETHER_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.FABA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.SKULL_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.PLUMERIA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.MACRO_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.OLEANA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
    },
  },
  [TrainerType.STAR_GRUNT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 5,
      victory: 5,
    },
  },
  [TrainerType.GIACOMO]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.MELA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.ATTICUS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.ORTEGA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.ERI]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
    },
  },
  [TrainerType.ROCKET_BOSS_GIOVANNI_1]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ROCKET_BOSS_GIOVANNI_2]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.MAXIE]: {
    [TrainerGender.DEFAULT]: {
      key: "magma_boss_maxie_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.MAXIE_2]: {
    [TrainerGender.DEFAULT]: {
      key: "magma_boss_maxie_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ARCHIE]: {
    [TrainerGender.DEFAULT]: {
      key: "aqua_boss_archie_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ARCHIE_2]: {
    [TrainerGender.DEFAULT]: {
      key: "aqua_boss_archie_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CYRUS]: {
    [TrainerGender.DEFAULT]: {
      key: "galactic_boss_cyrus_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CYRUS_2]: {
    [TrainerGender.DEFAULT]: {
      key: "galactic_boss_cyrus_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GHETSIS]: {
    [TrainerGender.DEFAULT]: {
      key: "plasma_boss_ghetsis_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GHETSIS_2]: {
    [TrainerGender.DEFAULT]: {
      key: "plasma_boss_ghetsis_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LYSANDRE]: {
    [TrainerGender.DEFAULT]: {
      key: "flare_boss_lysandre_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LYSANDRE_2]: {
    [TrainerGender.DEFAULT]: {
      key: "flare_boss_lysandre_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LUSAMINE]: {
    [TrainerGender.DEFAULT]: {
      key: "aether_boss_lusamine_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LUSAMINE_2]: {
    [TrainerGender.DEFAULT]: {
      key: "aether_boss_lusamine_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GUZMA]: {
    [TrainerGender.DEFAULT]: {
      key: "skull_boss_guzma_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GUZMA_2]: {
    [TrainerGender.DEFAULT]: {
      key: "skull_boss_guzma_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ROSE]: {
    [TrainerGender.DEFAULT]: {
      key: "macro_boss_rose_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ROSE_2]: {
    [TrainerGender.DEFAULT]: {
      key: "macro_boss_rose_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.PENNY]: {
    [TrainerGender.DEFAULT]: {
      key: "star_boss_penny_1",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.PENNY_2]: {
    [TrainerGender.DEFAULT]: {
      key: "star_boss_penny_2",
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BUCK]: {
    [TrainerGender.DEFAULT]: {
      key: "stat_trainer_buck",
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.CHERYL]: {
    [TrainerGender.DEFAULT]: {
      key: "stat_trainer_cheryl",
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.MARLEY]: {
    [TrainerGender.DEFAULT]: {
      key: "stat_trainer_marley",
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.MIRA]: {
    [TrainerGender.DEFAULT]: {
      key: "stat_trainer_mira",
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.RILEY]: {
    [TrainerGender.DEFAULT]: {
      key: "stat_trainer_riley",
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.VICTOR]: {
    [TrainerGender.DEFAULT]: {
      key: "winstrates_victor",
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.VICTORIA]: {
    [TrainerGender.DEFAULT]: {
      key: "winstrates_victoria",
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.VIVI]: {
    [TrainerGender.DEFAULT]: {
      key: "winstrates_vivi",
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.VICKY]: {
    [TrainerGender.DEFAULT]: {
      key: "winstrates_vicky",
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.VITO]: {
    [TrainerGender.DEFAULT]: {
      key: "winstrates_vito",
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.BROCK]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.MISTY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.LT_SURGE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.ERIKA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 4,
      victory: 4,
      defeat: 4,
    },
  },
  [TrainerType.JANINE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.SABRINA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.BLAINE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.GIOVANNI]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.ROXANNE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.BRAWLY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.WATTSON]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.FLANNERY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.NORMAN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.WINONA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.TATE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.LIZA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.JUAN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 4,
      victory: 4,
      defeat: 4,
    },
  },
  [TrainerType.CRASHER_WAKE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.FALKNER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.NESSA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.MELONY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.MARLON]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.SHAUNTAL]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.MARSHAL]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.CHEREN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.CHILI]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.CILAN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.ROARK]: {
    [TrainerGender.DEFAULT]: {
      encounter: 4,
      victory: 4,
      defeat: 3,
    },
  },
  [TrainerType.MORTY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 6,
      victory: 6,
      defeat: 6,
    },
  },
  [TrainerType.CRISPIN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.AMARYS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LACEY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.DRAYTON]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RAMOS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.VIOLA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.CANDICE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.GARDENIA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.AARON]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CRESS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ALLISTER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CLAY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KOFU]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.TULIP]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.SIDNEY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.PHOEBE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GLACIA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.DRAKE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.WALLACE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LORELEI]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.WILL]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.MALVA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.HALA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.MOLAYNE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RIKA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BRUNO]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BUGSY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KOGA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BERTHA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LENORA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.SIEBOLD]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ROXIE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.OLIVIA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.POPPY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.AGATHA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.FLINT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GRIMSLEY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CAITLIN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.DIANTHA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.WIKSTROM]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.ACEROLA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LARRY_ELITE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LANCE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.KAREN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 3,
      victory: 3,
      defeat: 3,
    },
  },
  [TrainerType.MILO]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LUCIAN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.DRASNA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KAHILI]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.HASSEL]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BLUE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.PIERS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RED]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.JASMINE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LANCE_CHAMPION]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.STEVEN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CYNTHIA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.IRIS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.HAU]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GEETA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.NEMONA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LEON]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.WHITNEY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CHUCK]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KATY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.PRYCE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CLAIR]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.MAYLENE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.FANTINA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BYRON]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.OLYMPIA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.VOLKNER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BURGH]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.ELESA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.SKYLA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BRYCEN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.DRAYDEN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GRANT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KORRINA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CLEMONT]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.VALERIE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.WULFRIC]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KABU]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BEA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.OPAL]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BEDE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GORDIE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.MARNIE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RAIHAN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BRASSIUS]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.IONO]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LARRY]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RYME]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GRUSHA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.MARNIE_ELITE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.NESSA_ELITE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.BEA_ELITE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.ALLISTER_ELITE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.RAIHAN_ELITE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 2,
      victory: 2,
      defeat: 2,
    },
  },
  [TrainerType.ALDER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KIERAN]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.BLUE_RED]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LANCE_CLAIR]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.STEVEN_WALLACE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.CYNTHIA_DIANTHA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.IRIS_ALDER]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.HAU_KUKUI]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.LEON_HOP]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.GEETA_NEMONA]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.KIERAN_CARMINE]: {
    [TrainerGender.DEFAULT]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RIVAL]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
    [TrainerGender.FEMALE]: {
      encounter: 1,
      victory: 1,
    },
  },
  [TrainerType.RIVAL_2]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
    [TrainerGender.FEMALE]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RIVAL_3]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
    [TrainerGender.FEMALE]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RIVAL_4]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
    [TrainerGender.FEMALE]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RIVAL_5]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
    [TrainerGender.FEMALE]: {
      encounter: 1,
      victory: 1,
      defeat: 1,
    },
  },
  [TrainerType.RIVAL_6]: {
    [TrainerGender.MALE]: {
      encounter: 1,
      victory: 1,
    },
    [TrainerGender.FEMALE]: {
      encounter: 1,
      victory: 1,
    },
  },
};

/**
 * Obtains localized dialogue for a Trainer instance.
 * @param messageType - The type of dialogue to obtain. Three types are supported:
 * - `"encounter"`: for when the Trainer is shown before battle
 * - `"victory"`: for after the Player defeats the Trainer in battle
 * - `"defeat"`: for after the Trainer defeats the Player in battle
 * @param trainerType - The Trainer instance's {@linkcode TrainerType}
 * @param gender - The Trainer instance's {@linkcode TrainerGender}
 * @returns The localized dialogue for the given input, or `undefined` if no matching
 * dialogue is available.
 */
export function getTrainerDialogue(
  messageType: TrainerMessageType,
  trainerType: TrainerType,
  gender: NonDefaultTrainerGender,
): string | undefined {
  const trainerDialogueEntry = trainerTypeDialogue[trainerType];
  if (trainerDialogueEntry == null) {
    return;
  }

  const usedGender = trainerDialogueEntry[gender] ? gender : TrainerGender.DEFAULT;
  const dialogueData = trainerDialogueEntry[usedGender];
  if (dialogueData == null) {
    return;
  }

  const numMessages = dialogueData[messageType];
  if (!numMessages) {
    return;
  }

  const trainerTypeKey = Object.keys(TrainerType).find((k) => TrainerType[k] === trainerType);
  const key =
    dialogueData.key ?? `${trainerTypeKey?.toLowerCase()}${usedGender === TrainerGender.FEMALE ? "_female" : ""}`;

  return i18next.t(`dialogue:${key}.${messageType}.${randSeedInt(numMessages) + 1}`);
}

export const classicFinalBossDialogue = {
  encounter: "battleSpecDialogue:encounter",
  firstStageWin: "battleSpecDialogue:firstStageWin",
  secondStageWin: "battleSpecDialogue:secondStageWin",
} as const;

export function getCharVariantFromDialogue(message: string): string {
  const variantMatch = /@c\{(.*?)\}/.exec(message);
  if (variantMatch) {
    return variantMatch[1];
  }
  return "neutral";
}

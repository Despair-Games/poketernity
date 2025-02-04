import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import type { PersistentModifier } from "#app/modifier/modifier";
import { modifierTypes } from "#app/modifier/modifier-types";
import { randSeedInt } from "#app/utils";
import { Gender } from "#enums/gender";
import { PokeballType } from "#enums/pokeball";
import { Species } from "#enums/species";
import { TrainerType } from "#enums/trainer-type";

const ROCKET_BOSS_TITLE = "Rocket Boss";
const ROCKET_MUSIC = "battle_rocket_boss";
const GIOVANNI = "Giovanni";

const MAGMA_BOSS_TITLE = "Magma Boss";
const MAXIE = "Maxie";
const AQUA_BOSS_TITLE = "Aqua Boss";
const ARCHIE = "Archie";
const AQUA_MAGMA_MUSIC = "battle_aqua_magma_boss";

const GALACTIC_BOSS_TITLE = "Galactic Boss";
const CYRUS = "Cyrus";
const GALACTIC_MUSIC = "battle_galactic_boss";

const PLASMA_BOSS_TITLE = "Plasma Boss";
const GHETSIS = "Ghetsis";
const PLASMA_MUSIC = "battle_plasma_boss";

const FLARE_BOSS_TITLE = "Flare Boss";
const LYSANDRE = "Lysandre";
const FLARE_MUSIC = "battle_flare_boss";

const AETHER_BOSS_TITLE = "Aether Boss";
const LUSAMINE = "Lusamine";
const AETHER_MUSIC = "battle_aether_boss";
const SKULL_BOSS_TITLE = "Skull Boss";
const GUZMA = "Guzma";
const SKULL_MUSIC = "battle_skull_boss";

const MACRO_BOSS_TITLE = "Macro Boss";
const ROSE = "Rose";
const MACRO_MUSIC = "battle_macro_boss";

const STAR_BOSS_TITLE = "Star Boss";
const PENNY = "Cassiopeia";
const STAR_MUSIC = "battle_star_boss";

let t = TrainerType.ROCKET_BOSS_GIOVANNI_1;
export const evilBossTrainerConfigs: TrainerConfigs = {
  [TrainerType.ROCKET_BOSS_GIOVANNI_1]: new TrainerConfig(t)
    .initForEvilTeamLeader(ROCKET_BOSS_TITLE, GIOVANNI, false, ROCKET_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.PERSIAN], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.DUGTRIO, Species.ALOLA_DUGTRIO]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.HONCHKROW]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.NIDOKING, Species.NIDOQUEEN]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.RHYPERIOR]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.KANGASKHAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Kangaskhan
        p.generateName();
      }),
    ),
  [TrainerType.ROCKET_BOSS_GIOVANNI_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(ROCKET_BOSS_TITLE, GIOVANNI, true, ROCKET_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.TYRANITAR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.HIPPOWDON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.EXCADRILL, Species.GARCHOMP]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.KANGASKHAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Kangaskhan
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.GASTRODON, Species.SEISMITOAD], TrainerSlot.TRAINER, true, (p) => {
        //Storm Drain Gastrodon, Water Absorb Seismitoad
        if (p.species.speciesId === Species.GASTRODON) {
          p.abilityIndex = 0;
        } else if (p.species.speciesId === Species.SEISMITOAD) {
          p.abilityIndex = 2;
        }
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.MEWTWO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.MAXIE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(MAGMA_BOSS_TITLE, MAXIE, false, AQUA_MAGMA_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.MIGHTYENA]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.CROBAT, Species.GLISCOR]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.WEEZING, Species.GALAR_WEEZING]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.DONPHAN]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.FLYGON]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.CAMERUPT], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Camerupt
        p.generateName();
        p.gender = Gender.MALE;
      }),
    ),
  [TrainerType.MAXIE_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(MAGMA_BOSS_TITLE, MAXIE, true, AQUA_MAGMA_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SOLROCK, Species.TYPHLOSION], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.TORKOAL, Species.NINETALES], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 2; // Drought
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.SHIFTRY, Species.SCOVILLAIN], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 0; // Chlorophyll
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.GREAT_TUSK]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.CAMERUPT], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Camerupt
        p.generateName();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.GROUDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.ARCHIE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(AQUA_BOSS_TITLE, ARCHIE, false, AQUA_MAGMA_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.LINOONE]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.CROBAT, Species.PELIPPER]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.MUK, Species.ALOLA_MUK]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.TENTACRUEL]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.RELICANTH, Species.WAILORD]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.SHARPEDO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Sharpedo
        p.generateName();
        p.gender = Gender.MALE;
      }),
    ),
  [TrainerType.ARCHIE_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(AQUA_BOSS_TITLE, ARCHIE, true, AQUA_MAGMA_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.EMPOLEON, Species.LUDICOLO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.POLITOED, Species.PELIPPER], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 2; // Drizzle
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.BEARTIC, Species.ARMALDO], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 2; // Swift Swim
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.OVERQWIL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 1; // Swift Swim
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.SHARPEDO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Sharpedo
        p.generateName();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.KYOGRE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.CYRUS]: new TrainerConfig(++t)
    .initForEvilTeamLeader(GALACTIC_BOSS_TITLE, CYRUS, false, GALACTIC_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.GYARADOS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.HONCHKROW, Species.HISUI_BRAVIARY]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.CROBAT, Species.GLISCOR]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.AZELF, Species.UXIE, Species.MESPRIT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.HOUNDOOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Houndoom
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.WEAVILE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.MALE;
      }),
    ),
  [TrainerType.CYRUS_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(GALACTIC_BOSS_TITLE, CYRUS, true, GALACTIC_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.AZELF, Species.UXIE, Species.MESPRIT], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.DRIFBLIM, Species.MISMAGIUS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.OVERQWIL]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.MANECTRIC], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Manectric
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.WEAVILE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.DARKRAI], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.GHETSIS]: new TrainerConfig(++t)
    .initForEvilTeamLeader(PLASMA_BOSS_TITLE, GHETSIS, false, PLASMA_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.COFAGRIGUS, Species.RUNERIGUS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.BOUFFALANT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.SEISMITOAD, Species.CARRACOSTA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.EELEKTROSS]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.KINGAMBIT]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.HYDREIGON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.MALE;
      }),
    ),
  [TrainerType.GHETSIS_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(PLASMA_BOSS_TITLE, GHETSIS, true, PLASMA_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.GARBODOR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // G-Max Garbodor
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.BASCULEGION, Species.JELLICENT], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
        p.formIndex = 0;
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.DRAPION, Species.TOXICROAK]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.HISUI_ZOROARK]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.HYDREIGON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.KYUREM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.LYSANDRE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(FLARE_BOSS_TITLE, LYSANDRE, false, FLARE_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.MIENSHAO]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.HONCHKROW, Species.TALONFLAME]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.PYROAR], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.DRAGALGE]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.VOLCARONA]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.GYARADOS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Gyarados
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
        p.gender = Gender.MALE;
      }),
    ),
  [TrainerType.LYSANDRE_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(FLARE_BOSS_TITLE, LYSANDRE, true, FLARE_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SLITHER_WING, Species.IRON_MOTH], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.PYROAR], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.AEGISLASH, Species.GHOLDENGO]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.HISUI_GOODRA]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.GYARADOS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Gyardos
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.YVELTAL], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.LUSAMINE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(AETHER_BOSS_TITLE, LUSAMINE, false, AETHER_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.CLEFABLE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.LILLIGANT, Species.HISUI_LILLIGANT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.MILOTIC, Species.PRIMARINA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.MISMAGIUS]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.BEWEAR]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.LOPUNNY], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Lopunny
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    ),
  [TrainerType.LUSAMINE_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(AETHER_BOSS_TITLE, LUSAMINE, true, AETHER_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.NIHILEGO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.GALAR_SLOWBRO, Species.GALAR_SLOWKING]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.FLUTTER_MANE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.NAGANADEL, Species.CELESTEELA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.LOPUNNY], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Lopunny
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.PHEROMOSA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    ),
  [TrainerType.GUZMA]: new TrainerConfig(++t)
    .initForEvilTeamLeader(SKULL_BOSS_TITLE, GUZMA, false, SKULL_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.LOKIX, Species.YANMEGA], TrainerSlot.TRAINER, true, (p) => {
        //Tinted Lens Lokix, Tinted Lens Yanmega
        if (p.species.speciesId === Species.LOKIX) {
          p.abilityIndex = 2;
        } else if (p.species.speciesId === Species.YANMEGA) {
          p.abilityIndex = 1;
        }
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.HERACROSS]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.SCIZOR, Species.KLEAVOR], TrainerSlot.TRAINER, true, (p) => {
        //Technician Scizor, Sharpness Kleavor
        if (p.species.speciesId === Species.SCIZOR) {
          p.abilityIndex = 1;
        } else if (p.species.speciesId === Species.KLEAVOR) {
          p.abilityIndex = 2;
        }
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.GALVANTULA, Species.VIKAVOLT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.PINSIR], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega Pinsir
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.GOLISOPOD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    ),
  [TrainerType.GUZMA_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(SKULL_BOSS_TITLE, GUZMA, true, SKULL_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.GOLISOPOD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.abilityIndex = 2; //Anticipation
        p.gender = Gender.MALE;
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.SCIZOR, Species.KLEAVOR], TrainerSlot.TRAINER, true, (p) => {
        //Technician Scizor, Sharpness Kleavor
        if (p.species.speciesId === Species.SCIZOR) {
          p.abilityIndex = 1;
        } else if (p.species.speciesId === Species.KLEAVOR) {
          p.abilityIndex = 2;
        }
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.TOXAPEX]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.PINSIR], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Pinsir
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.XURKITREE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.BUZZWOLE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    ),
  [TrainerType.ROSE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(MACRO_BOSS_TITLE, ROSE, false, MACRO_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ARCHALUDON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.FERROTHORN, Species.ESCAVALIER]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.SIRFETCHD, Species.MR_RIME]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.CORVIKNIGHT]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.PERRSERKER, Species.KLINKLANG]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.COPPERAJAH], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Copperajah
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.FEMALE;
      }),
    ),
  [TrainerType.ROSE_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(MACRO_BOSS_TITLE, ROSE, true, MACRO_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.ARCHALUDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.AEGISLASH, Species.GHOLDENGO]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.DRACOVISH, Species.DRACOZOLT], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 1; //Strong Jaw Dracovish, Hustle Dracozolt
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.MELMETAL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.COPPERAJAH], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Copperajah
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.ETERNATUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.PENNY]: new TrainerConfig(++t)
    .initForEvilTeamLeader(STAR_BOSS_TITLE, PENNY, false, STAR_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.VAPOREON, Species.JOLTEON, Species.FLAREON]))
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.ESPEON, Species.UMBREON], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 2; // Magic Bounce Espeon, Inner Focus Umbreon
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.LEAFEON, Species.GLACEON]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.ROTOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = randSeedInt(5, 1); // Heat, Wash, Frost, Fan, or Mow
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.SYLVEON], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 2; // Pixilate
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.EEVEE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 2; // G-Max Eevee
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[4];
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [teraPokemon.species.type1])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(teraPokemon) as PersistentModifier,
      ]; //TODO: is the bang correct?
    }),
  [TrainerType.PENNY_2]: new TrainerConfig(++t)
    .initForEvilTeamLeader(STAR_BOSS_TITLE, PENNY, true, STAR_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SYLVEON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.abilityIndex = 2; // Pixilate
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.ENTEI, Species.RAIKOU, Species.SUICUNE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.IRON_LEAVES, Species.IRON_BOULDER, Species.IRON_CROWN]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = randSeedInt(5, 1); //Random Starmobile form
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.EEVEE], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 2;
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc(
        [Species.WO_CHIEN, Species.CHIEN_PAO, Species.TING_LU, Species.CHI_YU],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
          p.pokeball = PokeballType.ULTRA_BALL;
        },
      ),
    )
    .setGenModifiersFunc((party) => {
      const teraPokemon = party[0];
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [teraPokemon.species.type1])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(teraPokemon) as PersistentModifier,
      ]; //TODO: is the bang correct?
    }),
};

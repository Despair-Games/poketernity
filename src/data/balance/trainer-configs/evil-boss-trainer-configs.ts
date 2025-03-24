import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import type { PersistentModifier } from "#app/modifier/modifier";
import { modifierTypes } from "#app/modifier/modifier-types";
import { randSeedInt } from "#app/utils";
import { Gender } from "#enums/gender";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
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
      getRandomPartyMemberFunc([SpeciesId.PERSIAN], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.DUGTRIO, SpeciesId.ALOLA_DUGTRIO]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.HONCHKROW]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.NIDOKING, SpeciesId.NIDOQUEEN]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.RHYPERIOR]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.KANGASKHAN], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.TYRANITAR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.HIPPOWDON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.EXCADRILL, SpeciesId.GARCHOMP]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.KANGASKHAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Kangaskhan
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.GASTRODON, SpeciesId.SEISMITOAD], TrainerSlot.TRAINER, true, (p) => {
        //Storm Drain Gastrodon, Water Absorb Seismitoad
        if (p.species.speciesId === SpeciesId.GASTRODON) {
          p.abilityIndex = 0;
        } else if (p.species.speciesId === SpeciesId.SEISMITOAD) {
          p.abilityIndex = 2;
        }
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.MEWTWO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.MAXIE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(MAGMA_BOSS_TITLE, MAXIE, false, AQUA_MAGMA_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.MIGHTYENA]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.CROBAT, SpeciesId.GLISCOR]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.WEEZING, SpeciesId.GALAR_WEEZING]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.DONPHAN]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.FLYGON]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.CAMERUPT], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.SOLROCK, SpeciesId.TYPHLOSION], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.TORKOAL, SpeciesId.NINETALES], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 2; // Drought
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.SHIFTRY, SpeciesId.SCOVILLAIN], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 0; // Chlorophyll
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.GREAT_TUSK]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.CAMERUPT], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.GROUDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.ARCHIE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(AQUA_BOSS_TITLE, ARCHIE, false, AQUA_MAGMA_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.LINOONE]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.CROBAT, SpeciesId.PELIPPER]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.MUK, SpeciesId.ALOLA_MUK]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.TENTACRUEL]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.RELICANTH, SpeciesId.WAILORD]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.SHARPEDO], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.EMPOLEON, SpeciesId.LUDICOLO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.POLITOED, SpeciesId.PELIPPER], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 2; // Drizzle
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.BEARTIC, SpeciesId.ARMALDO], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 2; // Swift Swim
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.OVERQWIL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 1; // Swift Swim
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.SHARPEDO], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.KYOGRE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.CYRUS]: new TrainerConfig(++t)
    .initForEvilTeamLeader(GALACTIC_BOSS_TITLE, CYRUS, false, GALACTIC_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GYARADOS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.HONCHKROW, SpeciesId.HISUI_BRAVIARY]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.CROBAT, SpeciesId.GLISCOR]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.AZELF, SpeciesId.UXIE, SpeciesId.MESPRIT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.HOUNDOOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Houndoom
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.WEAVILE], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.AZELF, SpeciesId.UXIE, SpeciesId.MESPRIT], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.DRIFBLIM, SpeciesId.MISMAGIUS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.OVERQWIL]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.MANECTRIC], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Manectric
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.WEAVILE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.DARKRAI], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.GHETSIS]: new TrainerConfig(++t)
    .initForEvilTeamLeader(PLASMA_BOSS_TITLE, GHETSIS, false, PLASMA_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.COFAGRIGUS, SpeciesId.RUNERIGUS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.BOUFFALANT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.SEISMITOAD, SpeciesId.CARRACOSTA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.EELEKTROSS]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.KINGAMBIT]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.HYDREIGON], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.GARBODOR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // G-Max Garbodor
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.BASCULEGION, SpeciesId.JELLICENT], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
        p.formIndex = 0;
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.DRAPION, SpeciesId.TOXICROAK]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.HISUI_ZOROARK]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.HYDREIGON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.KYUREM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.LYSANDRE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(FLARE_BOSS_TITLE, LYSANDRE, false, FLARE_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.MIENSHAO]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.HONCHKROW, SpeciesId.TALONFLAME]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.PYROAR], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.DRAGALGE]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.VOLCARONA]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.GYARADOS], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.SLITHER_WING, SpeciesId.IRON_MOTH], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.PYROAR], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.AEGISLASH, SpeciesId.GHOLDENGO]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.HISUI_GOODRA]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.GYARADOS], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.YVELTAL], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.LUSAMINE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(AETHER_BOSS_TITLE, LUSAMINE, false, AETHER_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.CLEFABLE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.LILLIGANT, SpeciesId.HISUI_LILLIGANT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.MILOTIC, SpeciesId.PRIMARINA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.MISMAGIUS]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.BEWEAR]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.LOPUNNY], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.NIHILEGO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.GALAR_SLOWBRO, SpeciesId.GALAR_SLOWKING]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.FLUTTER_MANE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.NAGANADEL, SpeciesId.CELESTEELA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.LOPUNNY], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Lopunny
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.PHEROMOSA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    ),
  [TrainerType.GUZMA]: new TrainerConfig(++t)
    .initForEvilTeamLeader(SKULL_BOSS_TITLE, GUZMA, false, SKULL_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.LOKIX, SpeciesId.YANMEGA], TrainerSlot.TRAINER, true, (p) => {
        //Tinted Lens Lokix, Tinted Lens Yanmega
        if (p.species.speciesId === SpeciesId.LOKIX) {
          p.abilityIndex = 2;
        } else if (p.species.speciesId === SpeciesId.YANMEGA) {
          p.abilityIndex = 1;
        }
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.HERACROSS]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.SCIZOR, SpeciesId.KLEAVOR], TrainerSlot.TRAINER, true, (p) => {
        //Technician Scizor, Sharpness Kleavor
        if (p.species.speciesId === SpeciesId.SCIZOR) {
          p.abilityIndex = 1;
        } else if (p.species.speciesId === SpeciesId.KLEAVOR) {
          p.abilityIndex = 2;
        }
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.GALVANTULA, SpeciesId.VIKAVOLT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.PINSIR], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega Pinsir
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.GOLISOPOD], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.GOLISOPOD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.SCIZOR, SpeciesId.KLEAVOR], TrainerSlot.TRAINER, true, (p) => {
        //Technician Scizor, Sharpness Kleavor
        if (p.species.speciesId === SpeciesId.SCIZOR) {
          p.abilityIndex = 1;
        } else if (p.species.speciesId === SpeciesId.KLEAVOR) {
          p.abilityIndex = 2;
        }
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.TOXAPEX]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.PINSIR], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Pinsir
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.XURKITREE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.BUZZWOLE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    ),
  [TrainerType.ROSE]: new TrainerConfig(++t)
    .initForEvilTeamLeader(MACRO_BOSS_TITLE, ROSE, false, MACRO_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.ARCHALUDON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.FERROTHORN, SpeciesId.ESCAVALIER]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.SIRFETCHD, SpeciesId.MR_RIME]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.CORVIKNIGHT]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.PERRSERKER, SpeciesId.KLINKLANG]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.COPPERAJAH], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.ARCHALUDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.AEGISLASH, SpeciesId.GHOLDENGO]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.DRACOVISH, SpeciesId.DRACOZOLT], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 1; //Strong Jaw Dracovish, Hustle Dracozolt
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.MELMETAL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.COPPERAJAH], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.ETERNATUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.PENNY]: new TrainerConfig(++t)
    .initForEvilTeamLeader(STAR_BOSS_TITLE, PENNY, false, STAR_MUSIC)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.VAPOREON, SpeciesId.JOLTEON, SpeciesId.FLAREON]))
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.ESPEON, SpeciesId.UMBREON], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 2; // Magic Bounce Espeon, Inner Focus Umbreon
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.LEAFEON, SpeciesId.GLACEON]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.ROTOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = randSeedInt(5, 1); // Heat, Wash, Frost, Fan, or Mow
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.SYLVEON], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 2; // Pixilate
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.EEVEE], TrainerSlot.TRAINER, true, (p) => {
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
      getRandomPartyMemberFunc([SpeciesId.SYLVEON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.abilityIndex = 2; // Pixilate
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [SpeciesId.ENTEI, SpeciesId.RAIKOU, SpeciesId.SUICUNE],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.generateAndPopulateMoveset();
          p.pokeball = PokeballType.ULTRA_BALL;
        },
      ),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.IRON_LEAVES, SpeciesId.IRON_BOULDER, SpeciesId.IRON_CROWN]),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = randSeedInt(5, 1); //Random Starmobile form
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.EEVEE], TrainerSlot.TRAINER, true, (p) => {
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
        [SpeciesId.WO_CHIEN, SpeciesId.CHIEN_PAO, SpeciesId.TING_LU, SpeciesId.CHI_YU],
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

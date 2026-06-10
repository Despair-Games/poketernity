import { ElementalType } from "#enums/elemental-type";
import { Gender } from "#enums/gender";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#trainers/trainer-config";
import { levelByStrength, TrainerConfigBuilder } from "#trainers/trainer-config-builder";
import { randSeedInt } from "#utils/random-utils";

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

export const evilBossTrainerConfigs: TrainerConfigs = {
  [TrainerType.ROCKET_BOSS_GIOVANNI_1]: new TrainerConfig(TrainerType.ROCKET_BOSS_GIOVANNI_1)
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
  [TrainerType.ROCKET_BOSS_GIOVANNI_2]: new TrainerConfig(TrainerType.ROCKET_BOSS_GIOVANNI_2)
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
  [TrainerType.MAXIE]: new TrainerConfig(TrainerType.MAXIE)
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
  [TrainerType.MAXIE_2]: new TrainerConfig(TrainerType.MAXIE_2)
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
  [TrainerType.ARCHIE]: new TrainerConfig(TrainerType.ARCHIE)
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
  [TrainerType.ARCHIE_2]: new TrainerConfig(TrainerType.ARCHIE_2)
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
  [TrainerType.CYRUS]: new TrainerConfig(TrainerType.CYRUS)
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
  [TrainerType.CYRUS_2]: new TrainerConfig(TrainerType.CYRUS_2)
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
  [TrainerType.GHETSIS]: new TrainerConfig(TrainerType.GHETSIS)
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
  [TrainerType.GHETSIS_2]: new TrainerConfig(TrainerType.GHETSIS_2)
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
  [TrainerType.LYSANDRE]: new TrainerConfig(TrainerType.LYSANDRE)
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
  [TrainerType.LYSANDRE_2]: new TrainerConfig(TrainerType.LYSANDRE_2)
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
  [TrainerType.LUSAMINE]: new TrainerConfig(TrainerType.LUSAMINE)
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
  [TrainerType.LUSAMINE_2]: new TrainerConfig(TrainerType.LUSAMINE_2)
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
  [TrainerType.GUZMA]: new TrainerConfig(TrainerType.GUZMA)
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
  [TrainerType.GUZMA_2]: new TrainerConfig(TrainerType.GUZMA_2)
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
  [TrainerType.ROSE]: new TrainerConfig(TrainerType.ROSE)
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
  [TrainerType.ROSE_2]: new TrainerConfig(TrainerType.ROSE_2)
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
  [TrainerType.PENNY]: new TrainerConfig(TrainerType.PENNY)
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
        // Tera fairy
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
    .setInstantTera(4),
  [TrainerType.PENNY_2]: new TrainerConfig(TrainerType.PENNY_2)
    .initForEvilTeamLeader(STAR_BOSS_TITLE, PENNY, true, STAR_MUSIC)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.SYLVEON], TrainerSlot.TRAINER, true, (p) => {
        // Tera fairy
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
    .setInstantTera(0),
};

export const newEvilBossTrainerConfigs: TrainerConfigMap = {
  [TrainerType.ROCKET_BOSS_GIOVANNI_1]: new TrainerConfigBuilder(TrainerType.ROCKET_BOSS_GIOVANNI_1)
    .withFixedName("giovanni", TrainerGender.MALE)
    .withTitle("trainerTitles:rocket_boss")
    .withSpriteKey("giovanni")
    .withBattleBgm("battle_rocket_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.PERSIAN, { gender: Gender.MALE })
    .withPokemonFromPool([SpeciesId.DUGTRIO, SpeciesId.ALOLA_DUGTRIO])
    .withPokemon(SpeciesId.HONCHKROW, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.NIDOKING, SpeciesId.NIDOQUEEN], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.RHYPERIOR, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.KANGASKHAN, {
      formIndex: 1, // Mega Kangaskhan
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.ROCKET_BOSS_GIOVANNI_2]: new TrainerConfigBuilder(TrainerType.ROCKET_BOSS_GIOVANNI_2)
    .withFixedName("giovanni", TrainerGender.MALE)
    .withTitle("trainerTitles:rocket_boss")
    .withSpriteKey("giovanni")
    .withBattleBgm("battle_rocket_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.TYRANITAR, {
      abilityIndex: 0, // Sand Stream
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HIPPOWDON)
    .withPokemonFromPool([SpeciesId.EXCADRILL, SpeciesId.GARCHOMP])
    .withPokemon(SpeciesId.KANGASKHAN, {
      formIndex: 1, // Mega Kangaskhan
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.GASTRODON, SpeciesId.SEISMITOAD], {
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.GASTRODON) {
          p.abilityIndex = 0; // Storm Drain
        } else {
          p.abilityIndex = 2; // Water Absorb (Seismitoad)
        }
      },
    })
    .withPokemon(SpeciesId.MEWTWO, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.MAXIE]: new TrainerConfigBuilder(TrainerType.MAXIE)
    .withFixedName("maxie", TrainerGender.MALE)
    .withTitle("trainerTitles:magma_boss")
    .withSpriteKey("maxie")
    .withBattleBgm("battle_aqua_magma_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.MIGHTYENA)
    .withPokemonFromPool([SpeciesId.CROBAT, SpeciesId.GLISCOR])
    .withPokemonFromPool([SpeciesId.WEEZING, SpeciesId.GALAR_WEEZING])
    .withPokemon(SpeciesId.DONPHAN, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.FLYGON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.CAMERUPT, {
      formIndex: 1, // Mega Camerupt
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.MAXIE_2]: new TrainerConfigBuilder(TrainerType.MAXIE_2)
    .withFixedName("maxie", TrainerGender.MALE)
    .withTitle("trainerTitles:magma_boss")
    .withSpriteKey("maxie")
    .withBattleBgm("battle_aqua_magma_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemonFromPool([SpeciesId.SOLROCK, SpeciesId.TYPHLOSION], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.TORKOAL, SpeciesId.NINETALES], {
      postProcess: (p) => {
        // Set ability to Drought for either species
        if (p.species.speciesId === SpeciesId.TORKOAL) {
          p.abilityIndex = 1;
        } else {
          p.abilityIndex = 2;
        }
      },
    })
    .withPokemonFromPool([SpeciesId.SHIFTRY, SpeciesId.SCOVILLAIN], {
      abilityIndex: 0, // Chlorophyll for both species
    })
    .withPokemon(SpeciesId.GREAT_TUSK)
    .withPokemon(SpeciesId.CAMERUPT, {
      formIndex: 1, // Mega Camerupt
      boss: true,
      bossSegments: 2,
      gender: Gender.MALE,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemon(SpeciesId.GROUDON, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.ARCHIE]: new TrainerConfigBuilder(TrainerType.ARCHIE)
    .withFixedName("archie", TrainerGender.MALE)
    .withTitle("trainerTitles:aqua_boss")
    .withSpriteKey("archie")
    .withBattleBgm("battle_aqua_magma_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.LINOONE)
    .withPokemonFromPool([SpeciesId.CROBAT, SpeciesId.PELIPPER])
    .withPokemonFromPool([SpeciesId.MUK, SpeciesId.ALOLA_MUK])
    .withPokemon(SpeciesId.TENTACRUEL, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.RELICANTH, SpeciesId.WAILORD], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.SHARPEDO, {
      formIndex: 1, // Mega Sharpedo
      boss: true,
      bossSegments: 2,
      gender: Gender.MALE,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.ARCHIE_2]: new TrainerConfigBuilder(TrainerType.ARCHIE_2)
    .withFixedName("archie", TrainerGender.MALE)
    .withTitle("trainerTitles:aqua_boss")
    .withSpriteKey("archie")
    .withBattleBgm("battle_aqua_magma_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemonFromPool([SpeciesId.EMPOLEON, SpeciesId.LUDICOLO], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.POLITOED, SpeciesId.PELIPPER], {
      postProcess: (p) => {
        // Set ability to Drizzle
        if (p.species.speciesId === SpeciesId.POLITOED) {
          p.abilityIndex = 2;
        } else {
          p.abilityIndex = 1;
        }
      },
    })
    .withPokemonFromPool([SpeciesId.BEARTIC, SpeciesId.ARMALDO], {
      abilityIndex: 2, // Swift Swim (for both species)
    })
    .withPokemon(SpeciesId.OVERQWIL, {
      abilityIndex: 1, // Swift Swim
    })
    .withPokemon(SpeciesId.SHARPEDO, {
      formIndex: 1, // Mega Sharpedo
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
    })
    .withPokemon(SpeciesId.KYOGRE, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.CYRUS]: new TrainerConfigBuilder(TrainerType.CYRUS)
    .withFixedName("cyrus", TrainerGender.MALE)
    .withTitle("trainerTitles:galactic_boss")
    .withSpriteKey("cyrus")
    .withBattleBgm("battle_galactic_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.GYARADOS)
    .withPokemonFromPool([SpeciesId.HONCHKROW, SpeciesId.HISUI_BRAVIARY])
    .withPokemonFromPool([SpeciesId.CROBAT, SpeciesId.GLISCOR])
    .withPokemonFromPool([SpeciesId.AZELF, SpeciesId.UXIE, SpeciesId.MESPRIT], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HOUNDOOM, {
      formIndex: 1, // Mega Houndoom
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.WEAVILE, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.CYRUS_2]: new TrainerConfigBuilder(TrainerType.CYRUS_2)
    .withFixedName("cyrus", TrainerGender.MALE)
    .withTitle("trainerTitles:galactic_boss")
    .withSpriteKey("cyrus")
    .withBattleBgm("battle_galactic_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemonFromPool([SpeciesId.AZELF, SpeciesId.UXIE, SpeciesId.MESPRIT], {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.DRIFBLIM, SpeciesId.MISMAGIUS])
    .withPokemon(SpeciesId.OVERQWIL)
    .withPokemon(SpeciesId.MANECTRIC, {
      formIndex: 1, // Mega Manectric
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemon(SpeciesId.WEAVILE, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
    })
    .withPokemon(SpeciesId.DARKRAI, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.GHETSIS]: new TrainerConfigBuilder(TrainerType.GHETSIS)
    .withFixedName("ghetsis", TrainerGender.MALE)
    .withTitle("trainerTitles:plasma_boss")
    .withSpriteKey("ghetsis")
    .withBattleBgm("battle_plasma_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemonFromPool([SpeciesId.COFAGRIGUS, SpeciesId.RUNERIGUS])
    .withPokemon(SpeciesId.BOUFFALANT)
    .withPokemonFromPool([SpeciesId.SEISMITOAD, SpeciesId.CARRACOSTA])
    .withPokemon(SpeciesId.EELEKTROSS, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.KINGAMBIT, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HYDREIGON, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.GHETSIS_2]: new TrainerConfigBuilder(TrainerType.GHETSIS_2)
    .withFixedName("ghetsis", TrainerGender.MALE)
    .withTitle("trainerTitles:plasma_boss")
    .withSpriteKey("ghetsis")
    .withBattleBgm("battle_plasma_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.GARBODOR, {
      formIndex: 1, // G-Max Garbodor
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.BASCULEGION, SpeciesId.JELLICENT], {
      formIndex: 0,
      gender: Gender.MALE,
    })
    .withPokemonFromPool([SpeciesId.DRAPION, SpeciesId.TOXICROAK])
    .withPokemon(SpeciesId.HISUI_ZOROARK)
    .withPokemon(SpeciesId.HYDREIGON, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
    })
    .withPokemon(SpeciesId.KYUREM, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.LYSANDRE]: new TrainerConfigBuilder(TrainerType.LYSANDRE)
    .withFixedName("lysandre", TrainerGender.MALE)
    .withTitle("trainerTitles:flare_boss")
    .withSpriteKey("lysandre")
    .withBattleBgm("battle_flare_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.MIENSHAO)
    .withPokemonFromPool([SpeciesId.HONCHKROW, SpeciesId.TALONFLAME])
    .withPokemon(SpeciesId.PYROAR, {
      gender: Gender.MALE,
    })
    .withPokemon(SpeciesId.DRAGALGE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.VOLCARONA, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GYARADOS, {
      formIndex: 1, // Mega Gyarados
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.LYSANDRE_2]: new TrainerConfigBuilder(TrainerType.LYSANDRE_2)
    .withFixedName("lysandre", TrainerGender.MALE)
    .withTitle("trainerTitles:flare_boss")
    .withSpriteKey("lysandre")
    .withBattleBgm("battle_flare_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemonFromPool([SpeciesId.SLITHER_WING, SpeciesId.IRON_MOTH], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.PYROAR, { gender: Gender.MALE })
    .withPokemonFromPool([SpeciesId.AEGISLASH, SpeciesId.GHOLDENGO])
    .withPokemon(SpeciesId.HISUI_GOODRA)
    .withPokemon(SpeciesId.GYARADOS, {
      formIndex: 1, // Mega Gyarados
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.MALE,
    })
    .withPokemon(SpeciesId.YVELTAL, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.LUSAMINE]: new TrainerConfigBuilder(TrainerType.LUSAMINE)
    .withFixedName("lusamine", TrainerGender.FEMALE)
    .withTitle("trainerTitles:aether_boss")
    .withSpriteKey("lusamine")
    .withBattleBgm("battle_aether_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.CLEFABLE, { gender: Gender.FEMALE })
    .withPokemonFromPool([SpeciesId.LILLIGANT, SpeciesId.HISUI_LILLIGANT])
    .withPokemonFromPool([SpeciesId.MILOTIC, SpeciesId.PRIMARINA])
    .withPokemon(SpeciesId.MISMAGIUS, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.BEWEAR, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.LOPUNNY, {
      formIndex: 1, // Mega Lopunny
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.LUSAMINE_2]: new TrainerConfigBuilder(TrainerType.LUSAMINE_2)
    .withFixedName("lusamine", TrainerGender.FEMALE)
    .withTitle("trainerTitles:aether_boss")
    .withSpriteKey("lusamine")
    .withBattleBgm("battle_aether_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.NIHILEGO, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.GALAR_SLOWBRO, SpeciesId.GALAR_SLOWKING])
    .withPokemon(SpeciesId.FLUTTER_MANE)
    .withPokemonFromPool([SpeciesId.NAGANADEL, SpeciesId.CELESTEELA], {
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemon(SpeciesId.LOPUNNY, {
      formIndex: 1, // Mega Lopunny
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemon(SpeciesId.PHEROMOSA, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.GUZMA]: new TrainerConfigBuilder(TrainerType.GUZMA)
    .withFixedName("guzma", TrainerGender.MALE)
    .withTitle("trainerTitles:skull_boss")
    .withSpriteKey("guzma")
    .withBattleBgm("battle_skull_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemonFromPool([SpeciesId.LOKIX, SpeciesId.YANMEGA], {
      postProcess: (p) => {
        // Set ability to Tinted Lens for both species
        if (p.species.speciesId === SpeciesId.LOKIX) {
          p.abilityIndex = 2;
        } else {
          p.abilityIndex = 1;
        }
      },
    })
    .withPokemon(SpeciesId.HERACROSS)
    .withPokemonFromPool([SpeciesId.SCIZOR, SpeciesId.KLEAVOR], {
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.SCIZOR) {
          p.abilityIndex = 1; // Technician
        } else {
          p.abilityIndex = 2; // Sharpness
        }
      },
    })
    .withPokemonFromPool([SpeciesId.GALVANTULA, SpeciesId.VIKAVOLT], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.PINSIR, {
      formIndex: 1, // Mega Pinsir
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GOLISOPOD, {
      boss: true,
      bossSegments: 2,
      gender: Gender.MALE,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.GUZMA_2]: new TrainerConfigBuilder(TrainerType.GUZMA_2)
    .withFixedName("guzma", TrainerGender.MALE)
    .withTitle("trainerTitles:skull_boss")
    .withSpriteKey("guzma")
    .withBattleBgm("battle_skull_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.GOLISOPOD, {
      boss: true,
      bossSegments: 2,
      gender: Gender.MALE,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.SCIZOR, SpeciesId.KLEAVOR], {
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.SCIZOR) {
          p.abilityIndex = 1; // Technician
        } else {
          p.abilityIndex = 2; // Sharpness
        }
      },
    })
    .withPokemon(SpeciesId.TOXAPEX)
    .withPokemon(SpeciesId.PINSIR, {
      formIndex: 1, // Mega Pinsir
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemon(SpeciesId.XURKITREE, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemon(SpeciesId.BUZZWOLE, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.ROSE]: new TrainerConfigBuilder(TrainerType.ROSE)
    .withFixedName("rose", TrainerGender.MALE)
    .withTitle("trainerTitles:macro_boss")
    .withSpriteKey("rose")
    .withBattleBgm("battle_macro_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.ARCHALUDON)
    .withPokemonFromPool([SpeciesId.FERROTHORN, SpeciesId.ESCAVALIER])
    .withPokemonFromPool([SpeciesId.SIRFETCHD, SpeciesId.MR_RIME])
    .withPokemon(SpeciesId.CORVIKNIGHT, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.PERRSERKER, SpeciesId.KLINKLANG], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.COPPERAJAH, {
      formIndex: 1, // G-Max Copperajah
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.FEMALE,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.ROSE_2]: new TrainerConfigBuilder(TrainerType.ROSE_2)
    .withFixedName("rose", TrainerGender.MALE)
    .withTitle("trainerTitles:macro_boss")
    .withSpriteKey("rose")
    .withBattleBgm("battle_macro_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.ARCHALUDON, {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.AEGISLASH, SpeciesId.GHOLDENGO])
    .withPokemonFromPool([SpeciesId.DRACOVISH, SpeciesId.DRACOZOLT], {
      abilityIndex: 1, // Strong Jaw Dracovish, Hustle Dracozolt
    })
    .withPokemon(SpeciesId.MELMETAL)
    .withPokemon(SpeciesId.COPPERAJAH, {
      formIndex: 1, // G-Max Copperajah
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      gender: Gender.FEMALE,
    })
    .withPokemon(SpeciesId.ETERNATUS, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.PENNY]: new TrainerConfigBuilder(TrainerType.PENNY)
    .withFixedName("cassiopeia", TrainerGender.FEMALE)
    .withTitle("trainerTitles:star_boss")
    .withSpriteKey("penny")
    .withBattleBgm("battle_star_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemonFromPool([SpeciesId.VAPOREON, SpeciesId.JOLTEON, SpeciesId.FLAREON])
    .withPokemonFromPool([SpeciesId.ESPEON, SpeciesId.UMBREON], {
      abilityIndex: 2, // Magic Bounce Espeon, Inner Focus Umbreon
    })
    .withPokemonFromPool([SpeciesId.LEAFEON, SpeciesId.GLACEON])
    .withPokemon(SpeciesId.ROTOM, {
      postProcess: (p) => {
        p.formIndex = randSeedInt(5, 1); // any non-Base form
        // regenerate moveset with the set form's unique move
        p.generateAndPopulateMoveset();
      },
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.SYLVEON, {
      abilityIndex: 2, // Pixilate
      gender: Gender.FEMALE,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      instantTera: true,
      teraType: ElementalType.FAIRY,
    })
    .withPokemon(SpeciesId.EEVEE, {
      formIndex: 2, // G-Max Eevee
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2.5)
    .build(),
  [TrainerType.PENNY_2]: new TrainerConfigBuilder(TrainerType.PENNY_2)
    .withFixedName("cassiopeia", TrainerGender.FEMALE)
    .withTitle("trainerTitles:star_boss")
    .withSpriteKey("penny")
    .withBattleBgm("battle_star_boss")
    .withVictoryBgm("victory_team_plasma")
    .asBoss()
    .withPokemon(SpeciesId.SYLVEON, {
      abilityIndex: 2, // Pixilate
      boss: true,
      bossSegments: 2,
      instantTera: true,
      teraType: ElementalType.FAIRY,
      gender: Gender.FEMALE,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.ENTEI, SpeciesId.RAIKOU, SpeciesId.SUICUNE], {
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.IRON_LEAVES, SpeciesId.IRON_BOULDER, SpeciesId.IRON_CROWN])
    .withPokemon(SpeciesId.REVAVROOM, {
      pokeball: PokeballType.ULTRA_BALL,
      postProcess: (p) => {
        p.formIndex = randSeedInt(5, 1); // Random Starmobile form
        // regenerate moveset with the set form's unique "Torque" move
        p.generateAndPopulateMoveset();
      },
    })
    .withPokemon(SpeciesId.EEVEE, {
      formIndex: 2, // G-Max Eevee
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.WO_CHIEN, SpeciesId.CHIEN_PAO, SpeciesId.TING_LU, SpeciesId.CHI_YU], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withMoneyMultiplier(2.5)
    .build(),
};

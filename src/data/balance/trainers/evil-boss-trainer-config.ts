import { Gender } from "#app/data/gender";
import { PokeballType } from "#app/enums/pokeball";
import { Species } from "#app/enums/species";
import { modifierTypes } from "#app/modifier/modifier-type";
import { PersistentModifier } from "#app/modifier/modifier";
import { TrainerType } from "#enums/trainer-type";
import { Utils } from "phaser";
import { TrainerConfig, getRandomPartyMemberFunc, TrainerSlot, TrainerConfigs } from "../../trainer-config";

let t = TrainerType.ROCKET_BOSS_GIOVANNI_1;
export const evilBossTrainerConfigs: TrainerConfigs = {
  [TrainerType.ROCKET_BOSS_GIOVANNI_1]: new TrainerConfig(t)
    .setName("Giovanni")
    .initForEvilTeamLeader("Rocket Boss", [])
    .setMixedBattleBgm("battle_rocket_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.PERSIAN, Species.ALOLA_PERSIAN], TrainerSlot.TRAINER, true, (p) => {
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
    .setName("Giovanni")
    .initForEvilTeamLeader("Rocket Boss", [], true)
    .setMixedBattleBgm("battle_rocket_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.TYRANITAR, Species.IRON_THORNS], TrainerSlot.TRAINER, true, (p) => {
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
    .setName("Maxie")
    .initForEvilTeamLeader("Magma Boss", [])
    .setMixedBattleBgm("battle_aqua_magma_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.MIGHTYENA]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.CROBAT, Species.GLISCOR]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.WEEZING, Species.GALAR_WEEZING]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.MAGMORTAR, Species.TORKOAL]))
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
    .setName("Maxie")
    .initForEvilTeamLeader("Magma Boss", [], true)
    .setMixedBattleBgm("battle_aqua_magma_boss")
    .setVictoryBgm("victory_team_plasma")
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
    .setName("Archie")
    .initForEvilTeamLeader("Aqua Boss", [])
    .setMixedBattleBgm("battle_aqua_magma_boss")
    .setVictoryBgm("victory_team_plasma")
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
    .setName("Archie")
    .initForEvilTeamLeader("Aqua Boss", [], true)
    .setMixedBattleBgm("battle_aqua_magma_boss")
    .setVictoryBgm("victory_team_plasma")
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
    .setName("Cyrus")
    .initForEvilTeamLeader("Galactic Boss", [])
    .setMixedBattleBgm("battle_galactic_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.GYARADOS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.HONCHKROW, Species.HISUI_BRAVIARY]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.CROBAT, Species.GLISCOR]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.AZELF, Species.UXIE, Species.MESPRIT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.HOUNDOOM], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Houndoom
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
    .setName("Cyrus")
    .initForEvilTeamLeader("Galactic Boss", [], true)
    .setMixedBattleBgm("battle_galactic_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.AZELF, Species.UXIE, Species.MESPRIT], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.ELECTRODE, Species.HISUI_ELECTRODE]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.SALAMENCE, Species.ROARING_MOON]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.HOUNDOOM], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Houndoom
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.WEAVILE, Species.SNEASLER], TrainerSlot.TRAINER, true, (p) => {
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
    .setName("Ghetsis")
    .initForEvilTeamLeader("Plasma Boss", [])
    .setMixedBattleBgm("battle_plasma_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.COFAGRIGUS, Species.RUNERIGUS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.BOUFFALANT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.SEISMITOAD, Species.CARRACOSTA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.EELEKTROSS, Species.GALVANTULA]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.VOLCARONA]))
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
    .setName("Ghetsis")
    .initForEvilTeamLeader("Plasma Boss", [], true)
    .setMixedBattleBgm("battle_plasma_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.GENESECT], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = Utils.randSeedInt(4, 1); // Shock, Burn, Chill, or Douse Drive
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
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.KINGAMBIT]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.VOLCARONA, Species.SLITHER_WING]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.HYDREIGON, Species.IRON_JUGULIS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        if (p.species.speciesId === Species.HYDREIGON) {
          p.gender = Gender.MALE;
        } else if (p.species.speciesId === Species.IRON_JUGULIS) {
          p.gender = Gender.GENDERLESS;
        }
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
    .setName("Lysandre")
    .initForEvilTeamLeader("Flare Boss", [])
    .setMixedBattleBgm("battle_flare_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.MIENSHAO]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.HONCHKROW, Species.TALONFLAME]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.PYROAR], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.MALE;
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.CLAWITZER, Species.DRAGALGE]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.HELIOLISK, Species.MALAMAR]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.GYARADOS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Gyarados
        p.generateName();
        p.gender = Gender.MALE;
      }),
    ),
  [TrainerType.LYSANDRE_2]: new TrainerConfig(++t)
    .setName("Lysandre")
    .initForEvilTeamLeader("Flare Boss", [], true)
    .setMixedBattleBgm("battle_flare_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SCREAM_TAIL, Species.FLUTTER_MANE], TrainerSlot.TRAINER, true, (p) => {
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
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.IRON_MOTH]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.GOODRA, Species.HISUI_GOODRA]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.GYARADOS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.formIndex = 1; // Mega Gyardos
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
    .setName("Lusamine")
    .initForEvilTeamLeader("Aether Boss", [])
    .setMixedBattleBgm("battle_aether_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.CLEFABLE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.LILLIGANT, Species.HISUI_LILLIGANT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.MILOTIC, Species.PRIMARINA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.GALAR_SLOWBRO, Species.GALAR_SLOWKING]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.BEWEAR]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.NIHILEGO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ROGUE_BALL;
      }),
    ),
  [TrainerType.LUSAMINE_2]: new TrainerConfig(++t)
    .setName("Lusamine")
    .initForEvilTeamLeader("Aether Boss", [], true)
    .setMixedBattleBgm("battle_aether_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.NIHILEGO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ROGUE_BALL;
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.MILOTIC, Species.PRIMARINA]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.CLEFABLE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.gender = Gender.FEMALE;
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc(
        [Species.STAKATAKA, Species.CELESTEELA, Species.GUZZLORD],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.generateAndPopulateMoveset();
          p.pokeball = PokeballType.ROGUE_BALL;
        },
      ),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.PHEROMOSA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ROGUE_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.NECROZMA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.GUZMA]: new TrainerConfig(++t)
    .setName("Guzma")
    .initForEvilTeamLeader("Skull Boss", [])
    .setMixedBattleBgm("battle_skull_boss")
    .setVictoryBgm("victory_team_plasma")
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
    .setName("Guzma")
    .initForEvilTeamLeader("Skull Boss", [], true)
    .setMixedBattleBgm("battle_skull_boss")
    .setVictoryBgm("victory_team_plasma")
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
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.HISUI_SAMUROTT, Species.CRAWDAUNT], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 2; //Sharpness Hisui Samurott, Adaptability Crawdaunt
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.BUZZWOLE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ROGUE_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.XURKITREE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ROGUE_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.PINSIR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1;
        p.generateAndPopulateMoveset();
        p.generateName();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    ),
  [TrainerType.ROSE]: new TrainerConfig(++t)
    .setName("Rose")
    .initForEvilTeamLeader("Macro Boss", [])
    .setMixedBattleBgm("battle_macro_boss")
    .setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ARCHALUDON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.FERROTHORN, Species.ESCAVALIER]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.SIRFETCHD, Species.MR_RIME]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.CORVIKNIGHT]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.PERRSERKER, Species.KLINKLANG]))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.COPPERAJAH], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // G-Max Copperajah
        p.generateName();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.FEMALE;
      }),
    ),
  [TrainerType.ROSE_2]: new TrainerConfig(++t)
    .setName("Rose")
    .initForEvilTeamLeader("Macro Boss", [], true)
    .setMixedBattleBgm("battle_macro_boss")
    .setVictoryBgm("victory_team_plasma")
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
      getRandomPartyMemberFunc(
        [Species.GALAR_ARTICUNO, Species.GALAR_ZAPDOS, Species.GALAR_MOLTRES],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
          p.pokeball = PokeballType.ULTRA_BALL;
        },
      ),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.COPPERAJAH], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // G-Max Copperajah
        p.generateName();
        p.pokeball = PokeballType.ULTRA_BALL;
        p.gender = Gender.FEMALE;
      }),
    ),
  [TrainerType.PENNY]: new TrainerConfig(++t)
    .setName("Cassiopeia")
    .initForEvilTeamLeader("Star Boss", [])
    .setMixedBattleBgm("battle_star_boss")
    .setVictoryBgm("victory_team_plasma")
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
        p.generateAndPopulateMoveset();
        p.formIndex = Utils.randSeedInt(5, 1); // Heat, Wash, Frost, Fan, or Mow
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
    .setName("Cassiopeia")
    .initForEvilTeamLeader("Star Boss", [], true)
    .setMixedBattleBgm("battle_star_boss")
    .setVictoryBgm("victory_team_plasma")
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
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.WALKING_WAKE, Species.GOUGING_FIRE, Species.RAGING_BOLT]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.REVAVROOM], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = Utils.randSeedInt(5, 1); //Random Starmobile form
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ROGUE_BALL;
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([Species.EEVEE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 2;
        p.generateName();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.ZAMAZENTA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
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

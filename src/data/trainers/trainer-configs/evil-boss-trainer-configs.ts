import { ElementalType } from "#enums/elemental-type";
import { Gender } from "#enums/gender";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/trainer-config";
import { levelByStrength, TrainerConfigBuilder } from "#trainers/trainer-config-builder";
import { randSeedInt } from "#utils/random-utils";

export const evilBossTrainerConfigs: TrainerConfigMap = {
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

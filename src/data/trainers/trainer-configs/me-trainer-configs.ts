import { globalScene } from "#app/global-scene";
import {
  BLACEPHALON_RANDOM_ABILITY_POOL,
  EXPERT_POKEMON_BREEDER_POOL_1_POKEMON,
  EXPERT_POKEMON_BREEDER_POOL_2_POKEMON,
} from "#constants/mystery-encounter-constants";
import type { AbilityId } from "#enums/ability-id";
import { BiomeId } from "#enums/biome-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { Nature } from "#enums/nature";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/trainer-config";
import { levelByStrength, TrainerConfigBuilder } from "#trainers/trainer-config-builder";
import { getRandomElementalType } from "#utils/pokemon-utils";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

export const meTrainerConfigs: TrainerConfigMap = {
  // TODO: Add configs for "A Trainer's Test"
  [TrainerType.BUCK]: new TrainerConfigBuilder(TrainerType.BUCK)
    .withFixedName("buck", TrainerGender.MALE)
    .withSpriteKey("buck")
    .withEncounterBgm(TrainerType.ACE_TRAINER)
    .withVictoryBgm("victory_trainer")
    .withPokemon(SpeciesId.CLAYDOL, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.VENUSAUR, SpeciesId.COALOSSAL], {
      pokeball: PokeballType.GREAT_BALL,
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.VENUSAUR) {
          p.formIndex = 2; // G-Max Venusaur
        } else {
          p.formIndex = 1; // G-Max Coalossal
        }
      },
    })
    .withPokemon(SpeciesId.AGGRON, {
      formIndex: 1, // Mega Aggron
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.TORKOAL, {
      abilityIndex: 1, // Drought
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GREAT_TUSK, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HEATRAN, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2)
    .build(),
  [TrainerType.CHERYL]: new TrainerConfigBuilder(TrainerType.CHERYL)
    .withFixedName("cheryl", TrainerGender.FEMALE)
    .withSpriteKey("cheryl")
    .withEncounterBgm(TrainerType.ACE_TRAINER)
    .withVictoryBgm("victory_trainer")
    .withPokemon(SpeciesId.BLISSEY, {
      boss: true,
      bossSegments: 3,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.SNORLAX, SpeciesId.LAPRAS], {
      formIndex: 1, // G-Max Snorlax/Lapras
      pokeball: PokeballType.GREAT_BALL,
    })
    .withPokemon(SpeciesId.AUDINO, {
      formIndex: 1, // Mega Audino
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GOODRA, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.IRON_HANDS, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.CRESSELIA, SpeciesId.ENAMORUS], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.ENAMORUS) {
          p.formIndex = 1; // Therian
        }
      },
    })
    .withMoneyMultiplier(2)
    .build(),
  [TrainerType.MARLEY]: new TrainerConfigBuilder(TrainerType.MARLEY)
    .withFixedName("marley", TrainerGender.FEMALE)
    .withSpriteKey("marley")
    .withEncounterBgm(TrainerType.ACE_TRAINER)
    .withVictoryBgm("victory_trainer")
    .withPokemon(SpeciesId.ARCANINE, {
      boss: true,
      bossSegments: 3,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.CINDERACE, SpeciesId.INTELEON], {
      formIndex: 1, // G-Max Cinderace/Inteleon
      pokeball: PokeballType.GREAT_BALL,
    })
    .withPokemon(SpeciesId.AERODACTYL, {
      formIndex: 1, // Mega Aerodactyl
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.DRAGAPULT, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.IRON_BUNDLE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.REGIELEKI, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2)
    .build(),
  [TrainerType.MIRA]: new TrainerConfigBuilder(TrainerType.MIRA)
    .withFixedName("mira", TrainerGender.FEMALE)
    .withSpriteKey("mira")
    .withEncounterBgm(TrainerType.ACE_TRAINER)
    .withVictoryBgm("victory_trainer")
    .withPokemon(SpeciesId.ALAKAZAM, {
      formIndex: 1, // Mega Alakazam
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.GENGAR, SpeciesId.HATTERENE], {
      pokeball: PokeballType.GREAT_BALL,
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.GENGAR) {
          p.formIndex = 2; // G-Max Gengar
        } else {
          p.formIndex = 1; // G-Max Hatterene
        }
      },
    })
    .withPokemon(SpeciesId.FLUTTER_MANE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HYDREIGON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.MAGNEZONE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.LATIAS, SpeciesId.LATIOS], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withMoneyMultiplier(2)
    .build(),
  [TrainerType.RILEY]: new TrainerConfigBuilder(TrainerType.RILEY)
    .withFixedName("riley", TrainerGender.MALE)
    .withSpriteKey("riley")
    .withEncounterBgm(TrainerType.ACE_TRAINER)
    .withVictoryBgm("victory_trainer")
    .withPokemon(SpeciesId.LUCARIO, {
      formIndex: 1, // Mega Lucario
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.ULTRA_BALL,
    })
    .withPokemonFromPool([SpeciesId.RILLABOOM, SpeciesId.CENTISKORCH], {
      formIndex: 1, // G-Max Rillaboom/Centiskorch
      pokeball: PokeballType.GREAT_BALL,
    })
    .withPokemon(SpeciesId.TYRANITAR, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.ROARING_MOON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.URSALUNA, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.REGIGIGAS, SpeciesId.LANDORUS], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.LANDORUS) {
          p.formIndex = 1; // Therian
        }
      },
    })
    .withMoneyMultiplier(2)
    .build(),
  [TrainerType.CLOWN]: new TrainerConfigBuilder(TrainerType.HARLEQUIN)
    .withFixedName("harlequin", TrainerGender.MALE)
    .withTitle("harlequin")
    .withSpriteKey("harlequin")
    .withBattleBgm(TrainerType.PSYCHIC)
    .withForcedDoubleBattle()
    .withPokemon(SpeciesId.MR_MIME, {
      boss: true,
      moveset: [MoveId.TEETER_DANCE, MoveId.ALLY_SWITCH, MoveId.DAZZLING_GLEAM, MoveId.PSYCHIC],
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.BLACEPHALON, {
      boss: true,
      moveset: [MoveId.TRICK, MoveId.HYPNOSIS, MoveId.SHADOW_BALL, MoveId.MIND_BLOWN],
      postProcess: (pokemon) => {
        let ability: AbilityId;
        globalScene.executeWithSeedOffset(() => {
          ability = randSeedItem([...BLACEPHALON_RANDOM_ABILITY_POOL]);
        }, globalScene.currentBattle.waveIndex << 8);
        ability = ability!; // assert ability is defined

        (pokemon.customPokemonData.ability = ability),
          (pokemon.customPokemonData.types = new Array(2).fill(getRandomElementalType()));
      },
    })
    .build(),
  [TrainerType.EXPERT_POKEMON_BREEDER]: new TrainerConfigBuilder(TrainerType.EXPERT_POKEMON_BREEDER)
    .withFixedName("expert_pokemon_breeder", TrainerGender.FEMALE)
    .withSpriteKey("expert_pokemon_breeder")
    .withPokemon(SpeciesId.CLEFABLE, {
      abilityIndex: 1, // Magic Guard
      shiny: false,
      nature: Nature.ADAMANT,
      moveset: [MoveId.METEOR_MASH, MoveId.FIRE_PUNCH, MoveId.ICE_PUNCH, MoveId.THUNDER_PUNCH],
      ivs: [31, 31, 31, 31, 31, 31],
      teraType: ElementalType.STEEL,
      postProcess: (pokemon) => {
        pokemon.nickname = i18next.t("mysteryEncounters/theExpertPokemonBreeder:cleffa_1_nickname", {
          speciesName: pokemon.species.getName(),
        });
      },
    })
    .withPokemon(SpeciesId.CLEFABLE, {
      condition: () => globalScene.arena.biomeId === BiomeId.SPACE,
      abilityIndex: 1, // Magic Guard
      shiny: true,
      nature: Nature.MODEST,
      moveset: [MoveId.MOONBLAST, MoveId.MYSTICAL_FIRE, MoveId.ICE_BEAM, MoveId.THUNDERBOLT],
      ivs: [31, 31, 31, 31, 31, 31],
      postProcess: (pokemon) => {
        pokemon.nickname = i18next.t("mysteryEncounters/theExpertPokemonBreeder:cleffa_2_nickname", {
          speciesName: pokemon.species.getName(),
        });
      },
    })
    .withPokemon(SpeciesId.CLEFABLE, {
      condition: () => globalScene.arena.biomeId === BiomeId.SPACE,
      abilityIndex: 2, // Friend Guard / Unaware
      shiny: true,
      variant: 2,
      nature: Nature.BOLD,
      moveset: [MoveId.TRI_ATTACK, MoveId.STORED_POWER, MoveId.TAKE_HEART, MoveId.MOONLIGHT],
      ivs: [31, 31, 31, 31, 31, 31],
      postProcess: (pokemon) => {
        pokemon.nickname = i18next.t("mysteryEncounters/theExpertPokemonBreeder:cleffa_3_nickname", {
          speciesName: pokemon.species.getName(),
        });
      },
    })
    .withPokemonFromPool(EXPERT_POKEMON_BREEDER_POOL_1_POKEMON, {
      condition: () => globalScene.arena.biomeId !== BiomeId.SPACE,
      ivs: [31, 31, 31, 31, 31, 31],
    })
    .withPokemonFromPool(EXPERT_POKEMON_BREEDER_POOL_2_POKEMON, {
      condition: () => globalScene.arena.biomeId !== BiomeId.SPACE,
      ivs: [31, 31, 31, 31, 31, 31],
    })
    .build(),
  [TrainerType.VICTOR]: new TrainerConfigBuilder(TrainerType.VICTOR)
    .withTitle("the_winstrates")
    .withFixedName("victor", TrainerGender.MALE)
    .withSpriteKey("victor")
    .withPokemon(SpeciesId.SWELLOW, {
      abilityIndex: 0, // Guts
      nature: Nature.ADAMANT,
      moveset: [MoveId.FACADE, MoveId.BRAVE_BIRD, MoveId.PROTECT, MoveId.QUICK_ATTACK],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (Flame Orb + Focus Band)
    })
    .withPokemon(SpeciesId.OBSTAGOON, {
      abilityIndex: 1, // Guts
      nature: Nature.ADAMANT,
      moveset: [MoveId.FACADE, MoveId.OBSTRUCT, MoveId.NIGHT_SLASH, MoveId.FIRE_PUNCH],
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      // TODO: Add item configs (Flame Orb + Leftovers)
    })
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.VICTORIA]: new TrainerConfigBuilder(TrainerType.VICTORIA)
    .withTitle("the_winstrates")
    .withFixedName("victoria", TrainerGender.FEMALE)
    .withSpriteKey("victoria")
    .withPokemon(SpeciesId.ROSERADE, {
      abilityIndex: 0, // Natural Cure
      nature: Nature.CALM,
      moveset: [MoveId.SYNTHESIS, MoveId.SLUDGE_BOMB, MoveId.GIGA_DRAIN, MoveId.SLEEP_POWDER],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (Soul Dew + Quick Claw)
    })
    .withPokemon(SpeciesId.GARDEVOIR, {
      formIndex: 1, // Mega Gardevoir
      nature: Nature.TIMID,
      moveset: [MoveId.PSYSHOCK, MoveId.MOONBLAST, MoveId.SHADOW_BALL, MoveId.WILL_O_WISP],
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      // TODO: Add item configs (type boosters for Psychic + Fairy)
    })
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.VIVI]: new TrainerConfigBuilder(TrainerType.VIVI)
    .withTitle("the_winstrates")
    .withFixedName("vivi", TrainerGender.FEMALE)
    .withSpriteKey("vivi")
    .withPokemon(SpeciesId.SEAKING, {
      abilityIndex: 2, // Lightning Rod
      nature: Nature.ADAMANT,
      moveset: [MoveId.WATERFALL, MoveId.MEGAHORN, MoveId.KNOCK_OFF, MoveId.REST],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (2x Lum Berry + 4x HP Up)
    })
    .withPokemon(SpeciesId.BRELOOM, {
      abilityIndex: 1, // Poison Heal
      nature: Nature.JOLLY,
      moveset: [MoveId.SPORE, MoveId.SWORDS_DANCE, MoveId.SEED_BOMB, MoveId.DRAIN_PUNCH],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (Toxic Orb + 4x HP Up)
    })
    .withPokemon(SpeciesId.CAMERUPT, {
      formIndex: 1, // Mega Camerupt
      nature: Nature.CALM,
      moveset: [MoveId.EARTH_POWER, MoveId.FIRE_BLAST, MoveId.YAWN, MoveId.PROTECT],
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      // TODO: Add item configs (Quick Claw)
    })
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.VICKY]: new TrainerConfigBuilder(TrainerType.VICKY)
    .withTitle("the_winstrates")
    .withFixedName("vicky", TrainerGender.FEMALE)
    .withSpriteKey("vicky")
    .withPokemon(SpeciesId.MEDICHAM, {
      formIndex: 1, // Mega Medicham
      nature: Nature.IMPISH,
      moveset: [MoveId.AXE_KICK, MoveId.ICE_PUNCH, MoveId.ZEN_HEADBUTT, MoveId.BULLET_PUNCH],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (Shell Bell)
    })
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.VITO]: new TrainerConfigBuilder(TrainerType.VITO)
    .withTitle("the_winstrates")
    .withFixedName("vito", TrainerGender.MALE)
    .withSpriteKey("vito")
    .withPokemon(SpeciesId.HISUI_ELECTRODE, {
      abilityIndex: 0, // Soundproof
      nature: Nature.MODEST,
      moveset: [MoveId.THUNDERBOLT, MoveId.GIGA_DRAIN, MoveId.FOUL_PLAY, MoveId.THUNDER_WAVE],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (2x Carbos)
    })
    .withPokemon(SpeciesId.SWALOT, {
      abilityIndex: 2, // Gluttony
      nature: Nature.QUIET,
      moveset: [MoveId.SLUDGE_BOMB, MoveId.GIGA_DRAIN, MoveId.ICE_BEAM, MoveId.EARTHQUAKE],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (2x of every berry)
    })
    .withPokemon(SpeciesId.DODRIO, {
      abilityIndex: 2, // Tangled Feet
      nature: Nature.JOLLY,
      moveset: [MoveId.DRILL_PECK, MoveId.QUICK_ATTACK, MoveId.THRASH, MoveId.KNOCK_OFF],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (2x King's Rock)
    })
    .withPokemon(SpeciesId.ALAKAZAM, {
      formIndex: 1, // Mega Alakazam,
      nature: Nature.BOLD,
      moveset: [MoveId.PSYCHIC, MoveId.SHADOW_BALL, MoveId.FOCUS_BLAST, MoveId.THUNDERBOLT],
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      // TODO: Add item configs (2x Wide Lens)
    })
    .withPokemon(SpeciesId.DARMANITAN, {
      abilityIndex: 0, // Sheer Force
      nature: Nature.IMPISH,
      moveset: [MoveId.EARTHQUAKE, MoveId.U_TURN, MoveId.FLARE_BLITZ, MoveId.ROCK_SLIDE],
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
      // TODO: Add item configs (2x Quick Claw)
    })
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.FUTURE_SELF]: new TrainerConfigBuilder(TrainerType.FUTURE_SELF)
    .withFixedName("future_self_m", TrainerGender.MALE)
    .withSpriteKey("future_self_m", TrainerGender.MALE)
    .withFixedName("future_self_f", TrainerGender.FEMALE)
    .withSpriteKey("future_self_f", TrainerGender.FEMALE)
    .withEncounterBgm("mystery_encounter_weird_dream")
    .withBattleBgm("mystery_encounter_weird_dream")
    .withVictoryBgm("mystery_encounter_weird_dream")
    .build(),
};

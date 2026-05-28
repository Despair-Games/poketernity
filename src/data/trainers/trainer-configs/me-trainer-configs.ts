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
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import {
  getRandomPartyMemberFunc,
  TrainerConfig,
  type TrainerConfigs,
  TrainerPartyCompoundTemplate,
  TrainerPartyTemplate,
  trainerPartyTemplates,
} from "#trainers/trainer-config";
import { levelByStrength, TrainerConfigBuilder } from "#trainers/trainer-config-builder";
import { getRandomElementalType } from "#utils/pokemon-utils";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

export const meTrainerConfigs: TrainerConfigs = {
  [TrainerType.BUCK]: new TrainerConfig(TrainerType.BUCK)
    .setName("Buck")
    .initForStatTrainer([], true)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.CLAYDOL], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 3);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.VENUSAUR, SpeciesId.COALOSSAL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        if (p.species.speciesId === SpeciesId.VENUSAUR) {
          p.formIndex = 2; // Gmax
          p.abilityIndex = 2; // Venusaur gets Chlorophyll
        } else {
          p.formIndex = 1; // Gmax
        }
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.AGGRON], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.TORKOAL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 1; // Drought
      }),
    )
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.GREAT_TUSK], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.HEATRAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.CHERYL]: new TrainerConfig(TrainerType.CHERYL)
    .setName("Cheryl")
    .initForStatTrainer([], false)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.BLISSEY], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 3);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.SNORLAX, SpeciesId.LAPRAS], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.AUDINO], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega
        p.generateName();
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.GOODRA], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.IRON_HANDS], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.CRESSELIA, SpeciesId.ENAMORUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        if (p.species.speciesId === SpeciesId.ENAMORUS) {
          p.formIndex = 1; // Therian
          p.generateName();
        }
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.MARLEY]: new TrainerConfig(TrainerType.MARLEY)
    .setName("Marley")
    .initForStatTrainer([], false)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.ARCANINE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 3);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.CINDERACE, SpeciesId.INTELEON], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.AERODACTYL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega
        p.generateName();
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.DRAGAPULT], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.IRON_BUNDLE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.REGIELEKI], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.MIRA]: new TrainerConfig(TrainerType.MIRA)
    .setName("Mira")
    .initForStatTrainer([], false)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.ALAKAZAM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 1;
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.GENGAR, SpeciesId.HATTERENE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = p.species.speciesId === SpeciesId.GENGAR ? 2 : 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.FLUTTER_MANE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.HYDREIGON], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.MAGNEZONE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.LATIOS, SpeciesId.LATIAS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.RILEY]: new TrainerConfig(TrainerType.RILEY)
    .setName("Riley")
    .initForStatTrainer([], true)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.LUCARIO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 1;
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.RILLABOOM, SpeciesId.CENTISKORCH], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.TYRANITAR], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.ROARING_MOON], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([SpeciesId.URSALUNA], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.REGIGIGAS, SpeciesId.LANDORUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        if (p.species.speciesId === SpeciesId.LANDORUS) {
          p.formIndex = 1; // Therian
          p.generateName();
        }
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.VICTOR]: new TrainerConfig(TrainerType.VICTOR)
    .setTitle("The Winstrates")
    .setLocalizedName("Victor")
    .setMoneyMultiplier(1) // The Winstrate trainers have total money multiplier of 6
    .setPartyTemplates(trainerPartyTemplates.ONE_AVG_ONE_STRONG),
  [TrainerType.VICTORIA]: new TrainerConfig(TrainerType.VICTORIA)
    .setTitle("The Winstrates")
    .setLocalizedName("Victoria")
    .setMoneyMultiplier(1)
    .setPartyTemplates(trainerPartyTemplates.ONE_AVG_ONE_STRONG),
  [TrainerType.VIVI]: new TrainerConfig(TrainerType.VIVI)
    .setTitle("The Winstrates")
    .setLocalizedName("Vivi")
    .setMoneyMultiplier(1)
    .setPartyTemplates(trainerPartyTemplates.TWO_AVG_ONE_STRONG),
  [TrainerType.VICKY]: new TrainerConfig(TrainerType.VICKY)
    .setTitle("The Winstrates")
    .setLocalizedName("Vicky")
    .setMoneyMultiplier(1)
    .setPartyTemplates(trainerPartyTemplates.ONE_AVG),
  [TrainerType.VITO]: new TrainerConfig(TrainerType.VITO)
    .setTitle("The Winstrates")
    .setLocalizedName("Vito")
    .setMoneyMultiplier(2)
    .setPartyTemplates(
      new TrainerPartyCompoundTemplate(
        new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE),
        new TrainerPartyTemplate(2, PartyMemberStrength.STRONG),
      ),
    ),
  [TrainerType.BUG_TYPE_SUPERFAN]: new TrainerConfig(TrainerType.BUG_TYPE_SUPERFAN)
    .setMoneyMultiplier(2.25)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setPartyTemplates(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE)),
  [TrainerType.EXPERT_POKEMON_BREEDER]: new TrainerConfig(TrainerType.EXPERT_POKEMON_BREEDER)
    .setMoneyMultiplier(3)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setLocalizedName("Expert Pokemon Breeder")
    .setPartyTemplates(new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE)),
};

export const newMeTrainerConfigs: TrainerConfigMap = {
  // TODO: This should be a double battle
  [TrainerType.CLOWN]: new TrainerConfigBuilder()
    .withTitle("harlequin")
    .withBattleBgm(TrainerType.PSYCHIC)
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
  [TrainerType.EXPERT_POKEMON_BREEDER]: new TrainerConfigBuilder()
    .withFixedName("expert_pokemon_breeder", TrainerGender.FEMALE)
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
  [TrainerType.VICTOR]: new TrainerConfigBuilder()
    .withTitle("the_winstrates")
    .withFixedName("victor", TrainerGender.MALE)
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
  [TrainerType.VICTORIA]: new TrainerConfigBuilder()
    .withTitle("the_winstrates")
    .withFixedName("victoria", TrainerGender.FEMALE)
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
  [TrainerType.VIVI]: new TrainerConfigBuilder()
    .withTitle("the_winstrates")
    .withFixedName("vivi", TrainerGender.FEMALE)
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
  [TrainerType.VICKY]: new TrainerConfigBuilder()
    .withTitle("the_winstrates")
    .withFixedName("vicky", TrainerGender.FEMALE)
    .withPokemon(SpeciesId.MEDICHAM, {
      formIndex: 1, // Mega Medicham
      nature: Nature.IMPISH,
      moveset: [MoveId.AXE_KICK, MoveId.ICE_PUNCH, MoveId.ZEN_HEADBUTT, MoveId.BULLET_PUNCH],
      levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
      // TODO: Add item configs (Shell Bell)
    })
    .withMoneyMultiplier(1)
    .build(),
  [TrainerType.VITO]: new TrainerConfigBuilder()
    .withTitle("the_winstrates")
    .withFixedName("vito", TrainerGender.MALE)
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
  [TrainerType.FUTURE_SELF]: new TrainerConfigBuilder()
    .withFixedName("future_self_m", TrainerGender.MALE)
    .withFixedName("future_self_f", TrainerGender.FEMALE)
    .withEncounterBgm("mystery_encounter_weird_dream")
    .withBattleBgm("mystery_encounter_weird_dream")
    .withVictoryBgm("mystery_encounter_weird_dream")
    .build(),
};

import { RIVAL_SLOT_0_POKEMON, RIVAL_SLOT_1_POKEMON } from "#constants/trainer-constants";
import { pokemonPreEvolutions } from "#data/pokemon-pre-evolutions";
import type { PokemonSpecies } from "#data/pokemon-species";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import { pokemonEvolutions } from "#init/init-pokemon-evolutions";
import { modifierTypes } from "#modifier/modifier-types";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import {
  getRandomPartyMemberFunc,
  getSpeciesFilterRandomPartyMemberFunc,
  TrainerConfig,
  type TrainerConfigs,
  trainerPartyTemplates,
} from "#trainers/trainer-config";
import { levelByStrength, TrainerConfigBuilder } from "#trainers/trainer-config-builder";

export const rivalTrainerConfigs: TrainerConfigs = {
  [TrainerType.RIVAL]: new TrainerConfig(TrainerType.RIVAL)
    .setName("Finn")
    .setHasGenders("Ivy")
    .setHasCharSprite()
    .setTitle("Rival")
    .setStaticParty()
    .setEncounterBgm(TrainerType.RIVAL)
    .setBattleBgm("battle_rival")
    .setPartyTemplates(trainerPartyTemplates.RIVAL)
    .setModifierRewardFuncs(
      () => modifierTypes.SUPER_EXP_CHARM,
      () => modifierTypes.EXP_SHARE,
    )
    .setEventModifierRewardFuncs(
      () => modifierTypes.SHINY_CHARM,
      () => modifierTypes.ABILITY_CHARM,
    )
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          SpeciesId.BULBASAUR,
          SpeciesId.CHARMANDER,
          SpeciesId.SQUIRTLE,
          SpeciesId.CHIKORITA,
          SpeciesId.CYNDAQUIL,
          SpeciesId.TOTODILE,
          SpeciesId.TREECKO,
          SpeciesId.TORCHIC,
          SpeciesId.MUDKIP,
          SpeciesId.TURTWIG,
          SpeciesId.CHIMCHAR,
          SpeciesId.PIPLUP,
          SpeciesId.SNIVY,
          SpeciesId.TEPIG,
          SpeciesId.OSHAWOTT,
          SpeciesId.CHESPIN,
          SpeciesId.FENNEKIN,
          SpeciesId.FROAKIE,
          SpeciesId.ROWLET,
          SpeciesId.LITTEN,
          SpeciesId.POPPLIO,
          SpeciesId.GROOKEY,
          SpeciesId.SCORBUNNY,
          SpeciesId.SOBBLE,
          SpeciesId.SPRIGATITO,
          SpeciesId.FUECOCO,
          SpeciesId.QUAXLY,
        ],
        TrainerSlot.TRAINER,
        true,
        (p) => (p.abilityIndex = 0),
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [
          SpeciesId.PIDGEY,
          SpeciesId.HOOTHOOT,
          SpeciesId.TAILLOW,
          SpeciesId.STARLY,
          SpeciesId.PIDOVE,
          SpeciesId.FLETCHLING,
          SpeciesId.PIKIPEK,
          SpeciesId.ROOKIDEE,
          SpeciesId.WATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    ),
  [TrainerType.RIVAL_2]: new TrainerConfig(TrainerType.RIVAL_2)
    .setName("Finn")
    .setHasGenders("Ivy")
    .setHasCharSprite()
    .setTitle("Rival")
    .setStaticParty()
    .setMoneyMultiplier(1.25)
    .setEncounterBgm(TrainerType.RIVAL)
    .setBattleBgm("battle_rival")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_2)
    .setModifierRewardFuncs(() => modifierTypes.EXP_SHARE)
    .setEventModifierRewardFuncs(() => modifierTypes.SHINY_CHARM)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          SpeciesId.IVYSAUR,
          SpeciesId.CHARMELEON,
          SpeciesId.WARTORTLE,
          SpeciesId.BAYLEEF,
          SpeciesId.QUILAVA,
          SpeciesId.CROCONAW,
          SpeciesId.GROVYLE,
          SpeciesId.COMBUSKEN,
          SpeciesId.MARSHTOMP,
          SpeciesId.GROTLE,
          SpeciesId.MONFERNO,
          SpeciesId.PRINPLUP,
          SpeciesId.SERVINE,
          SpeciesId.PIGNITE,
          SpeciesId.DEWOTT,
          SpeciesId.QUILLADIN,
          SpeciesId.BRAIXEN,
          SpeciesId.FROGADIER,
          SpeciesId.DARTRIX,
          SpeciesId.TORRACAT,
          SpeciesId.BRIONNE,
          SpeciesId.THWACKEY,
          SpeciesId.RABOOT,
          SpeciesId.DRIZZILE,
          SpeciesId.FLORAGATO,
          SpeciesId.CROCALOR,
          SpeciesId.QUAXWELL,
        ],
        TrainerSlot.TRAINER,
        true,
        (p) => (p.abilityIndex = 0),
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [
          SpeciesId.PIDGEOTTO,
          SpeciesId.HOOTHOOT,
          SpeciesId.TAILLOW,
          SpeciesId.STARAVIA,
          SpeciesId.TRANQUILL,
          SpeciesId.FLETCHINDER,
          SpeciesId.TRUMBEAK,
          SpeciesId.CORVISQUIRE,
          SpeciesId.WATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !Object.hasOwn(pokemonEvolutions, species.speciesId)
          && pokemonPreEvolutions[species.speciesId] == null
          && species.baseTotal >= 450,
      ),
    ),
  [TrainerType.RIVAL_3]: new TrainerConfig(TrainerType.RIVAL_3)
    .setName("Finn")
    .setHasGenders("Ivy")
    .setHasCharSprite()
    .setTitle("Rival")
    .setStaticParty()
    .setMoneyMultiplier(1.5)
    .setEncounterBgm(TrainerType.RIVAL)
    .setBattleBgm("battle_rival")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_3)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          SpeciesId.VENUSAUR,
          SpeciesId.CHARIZARD,
          SpeciesId.BLASTOISE,
          SpeciesId.MEGANIUM,
          SpeciesId.TYPHLOSION,
          SpeciesId.FERALIGATR,
          SpeciesId.SCEPTILE,
          SpeciesId.BLAZIKEN,
          SpeciesId.SWAMPERT,
          SpeciesId.TORTERRA,
          SpeciesId.INFERNAPE,
          SpeciesId.EMPOLEON,
          SpeciesId.SERPERIOR,
          SpeciesId.EMBOAR,
          SpeciesId.SAMUROTT,
          SpeciesId.CHESNAUGHT,
          SpeciesId.DELPHOX,
          SpeciesId.GRENINJA,
          SpeciesId.DECIDUEYE,
          SpeciesId.INCINEROAR,
          SpeciesId.PRIMARINA,
          SpeciesId.RILLABOOM,
          SpeciesId.CINDERACE,
          SpeciesId.INTELEON,
          SpeciesId.MEOWSCARADA,
          SpeciesId.SKELEDIRGE,
          SpeciesId.QUAQUAVAL,
        ],
        TrainerSlot.TRAINER,
        true,
        (p) => (p.abilityIndex = 0),
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [
          SpeciesId.PIDGEOT,
          SpeciesId.NOCTOWL,
          SpeciesId.SWELLOW,
          SpeciesId.STARAPTOR,
          SpeciesId.UNFEZANT,
          SpeciesId.TALONFLAME,
          SpeciesId.TOUCANNON,
          SpeciesId.CORVIKNIGHT,
          SpeciesId.KILOWATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !Object.hasOwn(pokemonEvolutions, species.speciesId)
          && pokemonPreEvolutions[species.speciesId] == null
          && species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540),
  [TrainerType.RIVAL_4]: new TrainerConfig(TrainerType.RIVAL_4)
    .setName("Finn")
    .setHasGenders("Ivy")
    .setHasCharSprite()
    .setTitle("Rival")
    .setBoss()
    .setStaticParty()
    .setMoneyMultiplier(1.75)
    .setEncounterBgm(TrainerType.RIVAL)
    .setBattleBgm("battle_rival_2")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_4)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          SpeciesId.VENUSAUR,
          SpeciesId.CHARIZARD,
          SpeciesId.BLASTOISE,
          SpeciesId.MEGANIUM,
          SpeciesId.TYPHLOSION,
          SpeciesId.FERALIGATR,
          SpeciesId.SCEPTILE,
          SpeciesId.BLAZIKEN,
          SpeciesId.SWAMPERT,
          SpeciesId.TORTERRA,
          SpeciesId.INFERNAPE,
          SpeciesId.EMPOLEON,
          SpeciesId.SERPERIOR,
          SpeciesId.EMBOAR,
          SpeciesId.SAMUROTT,
          SpeciesId.CHESNAUGHT,
          SpeciesId.DELPHOX,
          SpeciesId.GRENINJA,
          SpeciesId.DECIDUEYE,
          SpeciesId.INCINEROAR,
          SpeciesId.PRIMARINA,
          SpeciesId.RILLABOOM,
          SpeciesId.CINDERACE,
          SpeciesId.INTELEON,
          SpeciesId.MEOWSCARADA,
          SpeciesId.SKELEDIRGE,
          SpeciesId.QUAQUAVAL,
        ],
        TrainerSlot.TRAINER,
        true,
        (p) => (p.abilityIndex = 0),
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [
          SpeciesId.PIDGEOT,
          SpeciesId.NOCTOWL,
          SpeciesId.SWELLOW,
          SpeciesId.STARAPTOR,
          SpeciesId.UNFEZANT,
          SpeciesId.TALONFLAME,
          SpeciesId.TOUCANNON,
          SpeciesId.CORVIKNIGHT,
          SpeciesId.KILOWATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !Object.hasOwn(pokemonEvolutions, species.speciesId)
          && pokemonPreEvolutions[species.speciesId] == null
          && species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540),
  // TODO: remove this when trainer teras are reworked
  // .setGenModifiersFunc((party) => {
  //   const starter = party[0];
  //   return [
  //     modifierTypes
  //       .TERA_SHARD()
  //       .generateType([], [starter.species.type1])!
  //       .withIdFromFunc(modifierTypes.TERA_SHARD)
  //       .newModifier(starter) as PersistentModifier,
  //   ]; // TODO: is the bang correct?
  // }),
  [TrainerType.RIVAL_5]: new TrainerConfig(TrainerType.RIVAL_5)
    .setName("Finn")
    .setHasGenders("Ivy")
    .setHasCharSprite()
    .setTitle("Rival")
    .setBoss()
    .setStaticParty()
    .setMoneyMultiplier(2.25)
    .setEncounterBgm(TrainerType.RIVAL)
    .setBattleBgm("battle_rival_3")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_5)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          SpeciesId.VENUSAUR,
          SpeciesId.CHARIZARD,
          SpeciesId.BLASTOISE,
          SpeciesId.MEGANIUM,
          SpeciesId.TYPHLOSION,
          SpeciesId.FERALIGATR,
          SpeciesId.SCEPTILE,
          SpeciesId.BLAZIKEN,
          SpeciesId.SWAMPERT,
          SpeciesId.TORTERRA,
          SpeciesId.INFERNAPE,
          SpeciesId.EMPOLEON,
          SpeciesId.SERPERIOR,
          SpeciesId.EMBOAR,
          SpeciesId.SAMUROTT,
          SpeciesId.CHESNAUGHT,
          SpeciesId.DELPHOX,
          SpeciesId.GRENINJA,
          SpeciesId.DECIDUEYE,
          SpeciesId.INCINEROAR,
          SpeciesId.PRIMARINA,
          SpeciesId.RILLABOOM,
          SpeciesId.CINDERACE,
          SpeciesId.INTELEON,
          SpeciesId.MEOWSCARADA,
          SpeciesId.SKELEDIRGE,
          SpeciesId.QUAQUAVAL,
        ],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.abilityIndex = 0;
        },
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [
          SpeciesId.PIDGEOT,
          SpeciesId.NOCTOWL,
          SpeciesId.SWELLOW,
          SpeciesId.STARAPTOR,
          SpeciesId.UNFEZANT,
          SpeciesId.TALONFLAME,
          SpeciesId.TOUCANNON,
          SpeciesId.CORVIKNIGHT,
          SpeciesId.KILOWATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !Object.hasOwn(pokemonEvolutions, species.speciesId)
          && pokemonPreEvolutions[species.speciesId] == null
          && species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540)
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.RAYQUAZA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 3);
        p.pokeball = PokeballType.MASTER_BALL;
        p.shiny = true;
        p.variant = 1;
      }),
    ),
  // TODO: remove this when trainer teras are reworked
  // .setGenModifiersFunc((party) => {
  //   const starter = party[0];
  //   return [
  //     modifierTypes
  //       .TERA_SHARD()
  //       .generateType([], [starter.species.type1])!
  //       .withIdFromFunc(modifierTypes.TERA_SHARD)
  //       .newModifier(starter) as PersistentModifier,
  //   ]; //TODO: is the bang correct?
  // }),
  [TrainerType.RIVAL_6]: new TrainerConfig(TrainerType.RIVAL_6)
    .setName("Finn")
    .setHasGenders("Ivy")
    .setHasCharSprite()
    .setTitle("Rival")
    .setBoss()
    .setStaticParty()
    .setMoneyMultiplier(3)
    .setEncounterBgm("final")
    .setBattleBgm("battle_rival_3")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_6)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          SpeciesId.VENUSAUR,
          SpeciesId.CHARIZARD,
          SpeciesId.BLASTOISE,
          SpeciesId.MEGANIUM,
          SpeciesId.TYPHLOSION,
          SpeciesId.FERALIGATR,
          SpeciesId.SCEPTILE,
          SpeciesId.BLAZIKEN,
          SpeciesId.SWAMPERT,
          SpeciesId.TORTERRA,
          SpeciesId.INFERNAPE,
          SpeciesId.EMPOLEON,
          SpeciesId.SERPERIOR,
          SpeciesId.EMBOAR,
          SpeciesId.SAMUROTT,
          SpeciesId.CHESNAUGHT,
          SpeciesId.DELPHOX,
          SpeciesId.GRENINJA,
          SpeciesId.DECIDUEYE,
          SpeciesId.INCINEROAR,
          SpeciesId.PRIMARINA,
          SpeciesId.RILLABOOM,
          SpeciesId.CINDERACE,
          SpeciesId.INTELEON,
          SpeciesId.MEOWSCARADA,
          SpeciesId.SKELEDIRGE,
          SpeciesId.QUAQUAVAL,
        ],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 3);
          p.abilityIndex = 0;
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [
          SpeciesId.PIDGEOT,
          SpeciesId.NOCTOWL,
          SpeciesId.SWELLOW,
          SpeciesId.STARAPTOR,
          SpeciesId.UNFEZANT,
          SpeciesId.TALONFLAME,
          SpeciesId.TOUCANNON,
          SpeciesId.CORVIKNIGHT,
          SpeciesId.KILOWATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !Object.hasOwn(pokemonEvolutions, species.speciesId)
          && pokemonPreEvolutions[species.speciesId] == null
          && species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540)
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.RAYQUAZA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss();
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
        p.shiny = true;
        p.variant = 1;
        p.formIndex = 1; // Mega Rayquaza
        p.generateName();
      }),
    ),
};

export const newRivalTrainerConfigs: TrainerConfigMap = {
  [TrainerType.RIVAL]: new TrainerConfigBuilder(TrainerType.RIVAL)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.WEAKEST),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON, { levelFunc: levelByStrength(PartyMemberStrength.WEAKEST) })
    .build(),
  [TrainerType.RIVAL_2]: new TrainerConfigBuilder(TrainerType.RIVAL_2)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species: PokemonSpecies) => species.isSingleStage() && species.baseTotal >= 450, {
      levelFunc: levelByStrength(PartyMemberStrength.WEAK),
    })
    .build(),
  [TrainerType.RIVAL_3]: new TrainerConfigBuilder(TrainerType.RIVAL_3)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, {
      levelFunc: levelByStrength([PartyMemberStrength.AVERAGE, PartyMemberStrength.WEAK]),
    })
    .build(),
  [TrainerType.RIVAL_4]: new TrainerConfigBuilder(TrainerType.RIVAL_4)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL_2)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, {
      count: 2,
      levelFunc: levelByStrength(PartyMemberStrength.WEAK),
    })
    .build(),
  [TrainerType.RIVAL_5]: new TrainerConfigBuilder(TrainerType.RIVAL_5)
    .withRivalAssets()
    .withEncounterBgm(TrainerType.RIVAL)
    .withBattleBgm(TrainerType.RIVAL_3)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON)
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, { count: 2 })
    .withPokemon(SpeciesId.RAYQUAZA, {
      pokeball: PokeballType.MASTER_BALL,
      ignoreEvolution: true,
      shiny: true,
      variant: 1,
      boss: true,
      bossSegments: 3,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .build(),
  [TrainerType.RIVAL_6]: new TrainerConfigBuilder(TrainerType.RIVAL_6)
    .withRivalAssets()
    .withEncounterBgm("final")
    .withBattleBgm(TrainerType.RIVAL_3)
    .withPartySeedOffset(TrainerType.RIVAL)
    .withPokemonFromPool(RIVAL_SLOT_0_POKEMON, {
      abilityIndex: 0,
      boss: true,
      bossSegments: 3,
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool(RIVAL_SLOT_1_POKEMON, {
      boss: true,
      bossSegments: 2,
    })
    .withPokemonFromFilter((species) => species.isSingleStage() && species.baseTotal >= 450)
    .withPokemonFromFilter((species) => species.baseTotal >= 540, { count: 2 })
    .withPokemon(SpeciesId.RAYQUAZA, {
      pokeball: PokeballType.MASTER_BALL,
      ignoreEvolution: true,
      formIndex: 1, // Mega Rayquaza
      shiny: true,
      variant: 1,
      boss: true,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
} as const;

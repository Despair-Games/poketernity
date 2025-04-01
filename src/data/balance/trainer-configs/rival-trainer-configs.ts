import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions/init-pokemon-evolutions";
import { pokemonPreEvolutions } from "#app/data/pokemon-pre-evolutions";
import type PokemonSpecies from "#app/data/pokemon-species";
import {
  getRandomPartyMemberFunc,
  getSpeciesFilterRandomPartyMemberFunc,
  TrainerConfig,
  trainerPartyTemplates,
  type TrainerConfigs,
} from "#app/data/trainer-config";
import { TrainerSlot } from "#enums/trainer-slot";
import type { PersistentModifier } from "#app/modifier/modifier";
import { modifierTypes } from "#app/modifier/modifier-types";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";

let t = TrainerType.RIVAL;
export const rivalTrainerConfigs: TrainerConfigs = {
  [TrainerType.RIVAL]: new TrainerConfig(t)
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
  [TrainerType.RIVAL_2]: new TrainerConfig(++t)
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
          !pokemonEvolutions.hasOwnProperty(species.speciesId)
          && !pokemonPreEvolutions.hasOwnProperty(species.speciesId)
          && species.baseTotal >= 450,
      ),
    ),
  [TrainerType.RIVAL_3]: new TrainerConfig(++t)
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
          !pokemonEvolutions.hasOwnProperty(species.speciesId)
          && !pokemonPreEvolutions.hasOwnProperty(species.speciesId)
          && species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540),
  [TrainerType.RIVAL_4]: new TrainerConfig(++t)
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
          !pokemonEvolutions.hasOwnProperty(species.speciesId)
          && !pokemonPreEvolutions.hasOwnProperty(species.speciesId)
          && species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540)
    .setGenModifiersFunc((party) => {
      const starter = party[0];
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [starter.species.type1])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(starter) as PersistentModifier,
      ]; // TODO: is the bang correct?
    }),
  [TrainerType.RIVAL_5]: new TrainerConfig(++t)
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
          !pokemonEvolutions.hasOwnProperty(species.speciesId)
          && !pokemonPreEvolutions.hasOwnProperty(species.speciesId)
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
    )
    .setGenModifiersFunc((party) => {
      const starter = party[0];
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [starter.species.type1])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(starter) as PersistentModifier,
      ]; //TODO: is the bang correct?
    }),
  [TrainerType.RIVAL_6]: new TrainerConfig(++t)
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
          !pokemonEvolutions.hasOwnProperty(species.speciesId)
          && !pokemonPreEvolutions.hasOwnProperty(species.speciesId)
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
    )
    .setGenModifiersFunc((party) => {
      const starter = party[0];
      return [
        modifierTypes
          .TERA_SHARD()
          .generateType([], [starter.species.type1])!
          .withIdFromFunc(modifierTypes.TERA_SHARD)
          .newModifier(starter) as PersistentModifier,
      ]; // TODO: is the bang correct?
    }),
};

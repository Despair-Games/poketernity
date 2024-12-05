import PokemonSpecies from "#app/data/pokemon-species";
import { PokeballType } from "#app/enums/pokeball";
import { Species } from "#app/enums/species";
import { modifierTypes } from "#app/modifier/modifier-type";
import { PersistentModifier } from "#app/modifier/modifier";
import { TrainerType } from "#enums/trainer-type";
import {
  TrainerConfig,
  getRandomPartyMemberFunc,
  TrainerSlot,
  trainerPartyTemplates,
  getSpeciesFilterRandomPartyMemberFunc,
} from "../../trainer-config";
import { pokemonEvolutions, pokemonPrevolutions } from "../pokemon-evolutions";

let t = TrainerType.RIVAL;
export const rivalTrainerConfigs = {
  [TrainerType.RIVAL]: new TrainerConfig(t)
    .setName("Finn")
    .setHasGenders("Ivy")
    .setHasCharSprite()
    .setTitle("Rival")
    .setStaticParty()
    .setEncounterBgm(TrainerType.RIVAL)
    .setBattleBgm("battle_rival")
    .setMixedBattleBgm("battle_rival")
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
          Species.BULBASAUR,
          Species.CHARMANDER,
          Species.SQUIRTLE,
          Species.CHIKORITA,
          Species.CYNDAQUIL,
          Species.TOTODILE,
          Species.TREECKO,
          Species.TORCHIC,
          Species.MUDKIP,
          Species.TURTWIG,
          Species.CHIMCHAR,
          Species.PIPLUP,
          Species.SNIVY,
          Species.TEPIG,
          Species.OSHAWOTT,
          Species.CHESPIN,
          Species.FENNEKIN,
          Species.FROAKIE,
          Species.ROWLET,
          Species.LITTEN,
          Species.POPPLIO,
          Species.GROOKEY,
          Species.SCORBUNNY,
          Species.SOBBLE,
          Species.SPRIGATITO,
          Species.FUECOCO,
          Species.QUAXLY,
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
          Species.PIDGEY,
          Species.HOOTHOOT,
          Species.TAILLOW,
          Species.STARLY,
          Species.PIDOVE,
          Species.FLETCHLING,
          Species.PIKIPEK,
          Species.ROOKIDEE,
          Species.WATTREL,
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
    .setMixedBattleBgm("battle_rival")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_2)
    .setModifierRewardFuncs(() => modifierTypes.EXP_SHARE)
    .setEventModifierRewardFuncs(() => modifierTypes.SHINY_CHARM)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          Species.IVYSAUR,
          Species.CHARMELEON,
          Species.WARTORTLE,
          Species.BAYLEEF,
          Species.QUILAVA,
          Species.CROCONAW,
          Species.GROVYLE,
          Species.COMBUSKEN,
          Species.MARSHTOMP,
          Species.GROTLE,
          Species.MONFERNO,
          Species.PRINPLUP,
          Species.SERVINE,
          Species.PIGNITE,
          Species.DEWOTT,
          Species.QUILLADIN,
          Species.BRAIXEN,
          Species.FROGADIER,
          Species.DARTRIX,
          Species.TORRACAT,
          Species.BRIONNE,
          Species.THWACKEY,
          Species.RABOOT,
          Species.DRIZZILE,
          Species.FLORAGATO,
          Species.CROCALOR,
          Species.QUAXWELL,
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
          Species.PIDGEOTTO,
          Species.HOOTHOOT,
          Species.TAILLOW,
          Species.STARAVIA,
          Species.TRANQUILL,
          Species.FLETCHINDER,
          Species.TRUMBEAK,
          Species.CORVISQUIRE,
          Species.WATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !pokemonEvolutions.hasOwnProperty(species.speciesId) &&
          !pokemonPrevolutions.hasOwnProperty(species.speciesId) &&
          species.baseTotal >= 450,
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
    .setMixedBattleBgm("battle_rival")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_3)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          Species.VENUSAUR,
          Species.CHARIZARD,
          Species.BLASTOISE,
          Species.MEGANIUM,
          Species.TYPHLOSION,
          Species.FERALIGATR,
          Species.SCEPTILE,
          Species.BLAZIKEN,
          Species.SWAMPERT,
          Species.TORTERRA,
          Species.INFERNAPE,
          Species.EMPOLEON,
          Species.SERPERIOR,
          Species.EMBOAR,
          Species.SAMUROTT,
          Species.CHESNAUGHT,
          Species.DELPHOX,
          Species.GRENINJA,
          Species.DECIDUEYE,
          Species.INCINEROAR,
          Species.PRIMARINA,
          Species.RILLABOOM,
          Species.CINDERACE,
          Species.INTELEON,
          Species.MEOWSCARADA,
          Species.SKELEDIRGE,
          Species.QUAQUAVAL,
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
          Species.PIDGEOT,
          Species.NOCTOWL,
          Species.SWELLOW,
          Species.STARAPTOR,
          Species.UNFEZANT,
          Species.TALONFLAME,
          Species.TOUCANNON,
          Species.CORVIKNIGHT,
          Species.KILOWATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !pokemonEvolutions.hasOwnProperty(species.speciesId) &&
          !pokemonPrevolutions.hasOwnProperty(species.speciesId) &&
          species.baseTotal >= 450,
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
    .setMixedBattleBgm("battle_rival_2")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_4)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          Species.VENUSAUR,
          Species.CHARIZARD,
          Species.BLASTOISE,
          Species.MEGANIUM,
          Species.TYPHLOSION,
          Species.FERALIGATR,
          Species.SCEPTILE,
          Species.BLAZIKEN,
          Species.SWAMPERT,
          Species.TORTERRA,
          Species.INFERNAPE,
          Species.EMPOLEON,
          Species.SERPERIOR,
          Species.EMBOAR,
          Species.SAMUROTT,
          Species.CHESNAUGHT,
          Species.DELPHOX,
          Species.GRENINJA,
          Species.DECIDUEYE,
          Species.INCINEROAR,
          Species.PRIMARINA,
          Species.RILLABOOM,
          Species.CINDERACE,
          Species.INTELEON,
          Species.MEOWSCARADA,
          Species.SKELEDIRGE,
          Species.QUAQUAVAL,
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
          Species.PIDGEOT,
          Species.NOCTOWL,
          Species.SWELLOW,
          Species.STARAPTOR,
          Species.UNFEZANT,
          Species.TALONFLAME,
          Species.TOUCANNON,
          Species.CORVIKNIGHT,
          Species.KILOWATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !pokemonEvolutions.hasOwnProperty(species.speciesId) &&
          !pokemonPrevolutions.hasOwnProperty(species.speciesId) &&
          species.baseTotal >= 450,
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
    .setMixedBattleBgm("battle_rival_3")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_5)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          Species.VENUSAUR,
          Species.CHARIZARD,
          Species.BLASTOISE,
          Species.MEGANIUM,
          Species.TYPHLOSION,
          Species.FERALIGATR,
          Species.SCEPTILE,
          Species.BLAZIKEN,
          Species.SWAMPERT,
          Species.TORTERRA,
          Species.INFERNAPE,
          Species.EMPOLEON,
          Species.SERPERIOR,
          Species.EMBOAR,
          Species.SAMUROTT,
          Species.CHESNAUGHT,
          Species.DELPHOX,
          Species.GRENINJA,
          Species.DECIDUEYE,
          Species.INCINEROAR,
          Species.PRIMARINA,
          Species.RILLABOOM,
          Species.CINDERACE,
          Species.INTELEON,
          Species.MEOWSCARADA,
          Species.SKELEDIRGE,
          Species.QUAQUAVAL,
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
          Species.PIDGEOT,
          Species.NOCTOWL,
          Species.SWELLOW,
          Species.STARAPTOR,
          Species.UNFEZANT,
          Species.TALONFLAME,
          Species.TOUCANNON,
          Species.CORVIKNIGHT,
          Species.KILOWATTREL,
        ],
        TrainerSlot.TRAINER,
        true,
      ),
    )
    .setPartyMemberFunc(
      2,
      getSpeciesFilterRandomPartyMemberFunc(
        (species: PokemonSpecies) =>
          !pokemonEvolutions.hasOwnProperty(species.speciesId) &&
          !pokemonPrevolutions.hasOwnProperty(species.speciesId) &&
          species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540)
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.RAYQUAZA], TrainerSlot.TRAINER, true, (p) => {
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
    .setMixedBattleBgm("battle_rival_3")
    .setPartyTemplates(trainerPartyTemplates.RIVAL_6)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [
          Species.VENUSAUR,
          Species.CHARIZARD,
          Species.BLASTOISE,
          Species.MEGANIUM,
          Species.TYPHLOSION,
          Species.FERALIGATR,
          Species.SCEPTILE,
          Species.BLAZIKEN,
          Species.SWAMPERT,
          Species.TORTERRA,
          Species.INFERNAPE,
          Species.EMPOLEON,
          Species.SERPERIOR,
          Species.EMBOAR,
          Species.SAMUROTT,
          Species.CHESNAUGHT,
          Species.DELPHOX,
          Species.GRENINJA,
          Species.DECIDUEYE,
          Species.INCINEROAR,
          Species.PRIMARINA,
          Species.RILLABOOM,
          Species.CINDERACE,
          Species.INTELEON,
          Species.MEOWSCARADA,
          Species.SKELEDIRGE,
          Species.QUAQUAVAL,
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
          Species.PIDGEOT,
          Species.NOCTOWL,
          Species.SWELLOW,
          Species.STARAPTOR,
          Species.UNFEZANT,
          Species.TALONFLAME,
          Species.TOUCANNON,
          Species.CORVIKNIGHT,
          Species.KILOWATTREL,
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
          !pokemonEvolutions.hasOwnProperty(species.speciesId) &&
          !pokemonPrevolutions.hasOwnProperty(species.speciesId) &&
          species.baseTotal >= 450,
      ),
    )
    .setSpeciesFilter((species) => species.baseTotal >= 540)
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.RAYQUAZA], TrainerSlot.TRAINER, true, (p) => {
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

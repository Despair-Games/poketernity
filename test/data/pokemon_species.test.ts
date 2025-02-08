import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it } from "vitest";
import { Pokedex } from "./smogon_data";
import { allSpecies } from "#app/data/all-species";
import { isNullOrUndefined } from "#app/utils";
import { readFileSync, writeFileSync } from "fs";
import { PokemonShapes } from "#enums/pokemon-shapes";
import { SpeciesGroups } from "#enums/pokemon-species-groups";
import { starterPassiveAbilities } from "#app/data/balance/passives";
import { FormCategory } from "#enums/forms";


describe("Data - Pokemon Species", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .moveset([MoveId.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  

  interface GenderRatio {
    M: number,
    F: number
  }

  interface SpeciesAbilities {
    A1: string,
    A2?: string,
    H?: string,
    P?: string
  }

  interface BaseStats {
    hp: number,
    atk: number,
    def: number,
    spa: number,
    spdef: number,
    speed: number
  }

  const enum FormType {
    COSMETIC,
    MEGA,
    GIGANTAMAX,
    REGIONAL,
    ALTERNATE,
    BATTLE
  }

  // From PokeAPI, growth rate, shape, capture rate, base friendship

  it("should do X", async () => {


const enum GrowthRate_PokeAPI {
  SLOW = 1,
  MEDIUM,
  FAST,
  MEDIUM_SLOW,
  SLOW_THEN_VERY_FAST,
  FAST_THEN_VERY_SLOW,
}
    const speciesEntries: any[] = [];
    const pokeapiEntries = JSON.parse(readFileSync("./test/data/pokeapi_species.json", 'utf-8'));
    const showdownEntries = Object.entries(Pokedex);
    const speciesSample = allSpecies.filter(sp => sp.generation === 1);
    speciesSample.forEach(sp => {
      console.log(Species[sp.speciesId]);
      const speciesEntry = {};
      const smogonKey = showdownEntries.filter(x => x[1]['num'] === sp.speciesId && isNullOrUndefined(x[1]['baseSpecies']))[0][1].name.toLowerCase();
      const smogonEntry = Pokedex[smogonKey];
      if (smogonEntry){
      const pokeapiEntry = pokeapiEntries.filter(x => x['id'] === sp.speciesId)[0];
      speciesEntry['id'] = Species[sp.speciesId];
      speciesEntry['types'] = smogonEntry['types'].map(function(x) {return x.toUpperCase()});
      const statsObject: BaseStats = {
        hp: smogonEntry.baseStats.hp,
        atk: smogonEntry.baseStats.atk,
        def: smogonEntry.baseStats.def,
        spa: smogonEntry.baseStats.spa,
        spdef: smogonEntry.baseStats.spd,
        speed: smogonEntry.baseStats.spe
      };
      speciesEntry['baseStats'] = statsObject;
      const abilityObj: SpeciesAbilities = {A1: ''};
      processAbilities(abilityObj, smogonEntry.abilities, sp.speciesId);
      speciesEntry['abilities'] = abilityObj;
      if (!(smogonEntry.gender && smogonEntry['gender'] !== 'N')) {
        if (smogonEntry.genderRatio) {
          speciesEntry['genderRatio'] = smogonEntry.genderRatio;
        }
        else {
          speciesEntry['genderRatio'] = {M: 0.5, F: 0.5};
        }
      }
      speciesEntry['weight'] = smogonEntry.weightkg;
      speciesEntry['height'] = smogonEntry.heightm;
      if (smogonEntry['prevo']) {
        const preevoId = Pokedex[(smogonEntry.prevo as string).toLowerCase()].num;
        speciesEntry['prevo'] = Species[preevoId];
      }
      if (smogonEntry['evos']) {
        const evoList: string[] = [];
        (smogonEntry['evos'] as string[]).forEach((x: string)=> {
          if (Pokedex[x.toLowerCase()]) {
            const evoId = Pokedex[x.toLowerCase()].num;
          evoList.push(Species[evoId]);
          }
        });
        speciesEntry['evos'] = evoList;
      }
      speciesEntry['color'] = (smogonEntry.color as String).toUpperCase();
      speciesEntry['shape'] = PokemonShapes[pokeapiEntry['shape_id']];
      speciesEntry['captureRate'] = pokeapiEntry['capture_rate'];
      speciesEntry['baseFriendship'] = pokeapiEntry['base_happiness'];
      speciesEntry['growthRate'] = GrowthRate_PokeAPI[pokeapiEntry['growth_rate_id']];
      speciesEntry['speciesGroup'] = SpeciesGroups[sp.group];
      speciesEntry['hasGenderDiff'] = sp.genderDiffs;
      if (sp.canChangeForm) {
        speciesEntries['forms'] = [];
      }}
      speciesEntries.push(speciesEntry);
    });
    writeFileSync('./test/data/pokemon_species_01.json', JSON.stringify(speciesEntries));
    retrieveMegaPokemon(showdownEntries.filter(x => x[1]['forme'] && x[1]['forme'] === "Mega"));
  });

  function processAbilities(abilityObj: SpeciesAbilities, smogonData, speciesId) {
    abilityObj.A1 = (smogonData['0'].toUpperCase()).replace(" ", "_");
    if ('1' in smogonData) {
      abilityObj.A2 = (smogonData['1'].toUpperCase()).replace(" ", "_");
    }
    if ('H' in smogonData) {
      abilityObj.H = (smogonData['H'].toUpperCase()).replace(" ", "_");
    }
    if (starterPassiveAbilities[speciesId]) {
      abilityObj.P = Abilities[starterPassiveAbilities[speciesId]];
    }
  };

  function retrieveMegaPokemon(megaList) {
    const printList: any[] = [];
    megaList.forEach(x => {
      const megaEntry = x[1];
      const printOut = {};
      printOut['formCategory'] = FormCategory[FormCategory['MEGA']];
      printOut['types'] = megaEntry['types'];
      printOut['baseStats'] = megaEntry['baseStats'];
      const ability = { A1: (megaEntry['abilities']['0'].toUpperCase()).replace(" ", "_")};
      printOut['abilities'] = ability;
      printOut['height'] = megaEntry['heightm'];
      printOut['weight'] = megaEntry['weightkg'];
      printList.push(printOut);
    });
    writeFileSync('./test/data/megaPokemon.json', JSON.stringify(printList));
  }
});

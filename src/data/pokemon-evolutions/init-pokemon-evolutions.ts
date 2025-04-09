import { type PokemonEvolutions } from "#app/data/pokemon-evolutions";
import { gen1pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen1-pokemon-family-evolutions";
import { gen2pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen2-pokemon-family-evolutions";
import { gen3pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen3-pokemon-family-evolutions";
import { gen4pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen4-pokemon-family-evolutions";
import { gen5pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen5-pokemon-family-evolutions";
import { gen6pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen6-pokemon-family-evolutions";
import { gen7pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen7-pokemon-family-evolutions";
import { gen8pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen8-pokemon-family-evolutions";
import { gen9pokemonFamilyEvolutions } from "#app/data/pokemon-evolutions/gen9-pokemon-family-evolutions";

export const pokemonEvolutions: PokemonEvolutions = {
  ...gen1pokemonFamilyEvolutions,
  ...gen2pokemonFamilyEvolutions,
  ...gen3pokemonFamilyEvolutions,
  ...gen4pokemonFamilyEvolutions,
  ...gen5pokemonFamilyEvolutions,
  ...gen6pokemonFamilyEvolutions,
  ...gen7pokemonFamilyEvolutions,
  ...gen8pokemonFamilyEvolutions,
  ...gen9pokemonFamilyEvolutions,
};

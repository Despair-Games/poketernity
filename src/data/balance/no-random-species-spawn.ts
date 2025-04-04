import { SpeciesId } from "#enums/species-id";

/**
 * A list of Pokemon that cannot be selected as random Pokmeon when being called in
 * {@linkcode randomSpecies}
 */
export const noRandomSpeciesSpawn: Readonly<SpeciesId[]> = Object.freeze([
  SpeciesId.MEW,
  SpeciesId.CELEBI,
  SpeciesId.JIRACHI,
  SpeciesId.DEOXYS,
  SpeciesId.PHIONE,
  SpeciesId.MANAPHY,
  SpeciesId.ARCEUS,
  SpeciesId.VICTINI,
  SpeciesId.MELTAN,
  SpeciesId.MELMETAL,
  SpeciesId.ETERNATUS,
  SpeciesId.GREAT_TUSK,
  SpeciesId.SCREAM_TAIL,
  SpeciesId.BRUTE_BONNET,
  SpeciesId.FLUTTER_MANE,
  SpeciesId.SLITHER_WING,
  SpeciesId.SANDY_SHOCKS,
  SpeciesId.IRON_TREADS,
  SpeciesId.IRON_BUNDLE,
  SpeciesId.IRON_HANDS,
  SpeciesId.IRON_JUGULIS,
  SpeciesId.IRON_MOTH,
  SpeciesId.IRON_THORNS,
  SpeciesId.ROARING_MOON,
  SpeciesId.IRON_VALIANT,
  SpeciesId.WALKING_WAKE,
  SpeciesId.IRON_LEAVES,
  SpeciesId.GOUGING_FIRE,
  SpeciesId.RAGING_BOLT,
  SpeciesId.IRON_BOULDER,
  SpeciesId.IRON_CROWN,
  SpeciesId.PECHARUNT,
]);

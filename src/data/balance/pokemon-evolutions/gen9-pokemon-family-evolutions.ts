import {
  BRAMBLEGHAST_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
  GHOLDENGO_EVO_LEVEL,
  PAWMOT_EVO_LEVEL,
  RABSCA_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import {
  FemaleEvolutionCondition,
  GholdengoEvoCondition,
  MaleEvolutionCondition,
  NightEvolutionCondition,
  RngFormEvoCondition,
  SpeciesEvolution,
  SpeciesFormEvolution,
  type PokemonEvolutions,
} from "#app/data/pokemon-evolutions";
import { EvolutionItem } from "#enums/evolution-item";
import { SpeciesId } from "#enums/species-id";

export const gen9pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.SPRIGATITO]: [new SpeciesEvolution(SpeciesId.FLORAGATO, 16, null, null)],
  [SpeciesId.FLORAGATO]: [new SpeciesEvolution(SpeciesId.MEOWSCARADA, 36, null, null)],
  [SpeciesId.FUECOCO]: [new SpeciesEvolution(SpeciesId.CROCALOR, 16, null, null)],
  [SpeciesId.CROCALOR]: [new SpeciesEvolution(SpeciesId.SKELEDIRGE, 36, null, null)],
  [SpeciesId.QUAXLY]: [new SpeciesEvolution(SpeciesId.QUAXWELL, 16, null, null)],
  [SpeciesId.QUAXWELL]: [new SpeciesEvolution(SpeciesId.QUAQUAVAL, 36, null, null)],
  [SpeciesId.LECHONK]: [
    new SpeciesFormEvolution(SpeciesId.OINKOLOGNE, "", "", 18, null, [new MaleEvolutionCondition()]),
    new SpeciesFormEvolution(SpeciesId.OINKOLOGNE, "", "female", 18, null, [new FemaleEvolutionCondition()]),
  ],
  [SpeciesId.TAROUNTULA]: [new SpeciesEvolution(SpeciesId.SPIDOPS, 15, null, null)],
  [SpeciesId.NYMBLE]: [new SpeciesEvolution(SpeciesId.LOKIX, 24, null, null)],
  [SpeciesId.PAWMI]: [new SpeciesEvolution(SpeciesId.PAWMO, 18, null, null)],
  [SpeciesId.PAWMO]: [new SpeciesEvolution(SpeciesId.PAWMOT, PAWMOT_EVO_LEVEL, null, null)],
  [SpeciesId.TANDEMAUS]: [
    new SpeciesFormEvolution(SpeciesId.MAUSHOLD, "", "three", 25, null, [new RngFormEvoCondition()]),
    new SpeciesEvolution(SpeciesId.MAUSHOLD, 25, null, null),
  ],
  [SpeciesId.FIDOUGH]: [new SpeciesEvolution(SpeciesId.DACHSBUN, 26, null, null)],
  [SpeciesId.SMOLIV]: [new SpeciesEvolution(SpeciesId.DOLLIV, 25, null, null)],
  [SpeciesId.DOLLIV]: [new SpeciesEvolution(SpeciesId.ARBOLIVA, 35, null, null)],
  [SpeciesId.NACLI]: [new SpeciesEvolution(SpeciesId.NACLSTACK, 24, null, null)],
  [SpeciesId.NACLSTACK]: [new SpeciesEvolution(SpeciesId.GARGANACL, 38, null, null)],
  [SpeciesId.CHARCADET]: [
    new SpeciesEvolution(SpeciesId.ARMAROUGE, 1, EvolutionItem.AUSPICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.CERULEDGE, 1, EvolutionItem.MALICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.TADBULB]: [
    new SpeciesEvolution(SpeciesId.BELLIBOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.WATTREL]: [new SpeciesEvolution(SpeciesId.KILOWATTREL, 25, null, null)],
  [SpeciesId.MASCHIFF]: [new SpeciesEvolution(SpeciesId.MABOSSTIFF, 30, null, null)],
  [SpeciesId.SHROODLE]: [new SpeciesEvolution(SpeciesId.GRAFAIAI, 28, null, null)],
  [SpeciesId.BRAMBLIN]: [new SpeciesEvolution(SpeciesId.BRAMBLEGHAST, BRAMBLEGHAST_EVO_LEVEL, null, null)],
  [SpeciesId.TOEDSCOOL]: [new SpeciesEvolution(SpeciesId.TOEDSCRUEL, 30, null, null)],
  [SpeciesId.CAPSAKID]: [
    new SpeciesEvolution(SpeciesId.SCOVILLAIN, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.RELLOR]: [new SpeciesEvolution(SpeciesId.RABSCA, RABSCA_EVO_LEVEL, null, null)],
  [SpeciesId.FLITTLE]: [new SpeciesEvolution(SpeciesId.ESPATHRA, 35, null, null)],
  [SpeciesId.TINKATINK]: [new SpeciesEvolution(SpeciesId.TINKATUFF, 24, null, null)],
  [SpeciesId.TINKATUFF]: [new SpeciesEvolution(SpeciesId.TINKATON, 38, null, null)],
  [SpeciesId.WIGLETT]: [new SpeciesEvolution(SpeciesId.WUGTRIO, 26, null, null)],
  /** Does not need union circle */
  [SpeciesId.FINIZEN]: [new SpeciesEvolution(SpeciesId.PALAFIN, 38, null, null)],
  [SpeciesId.VAROOM]: [new SpeciesEvolution(SpeciesId.REVAVROOM, 40, null, null)],
  [SpeciesId.GLIMMET]: [new SpeciesEvolution(SpeciesId.GLIMMORA, 35, null, null)],
  [SpeciesId.GREAVARD]: [new SpeciesEvolution(SpeciesId.HOUNDSTONE, 30, null, [new NightEvolutionCondition()])],
  [SpeciesId.CETODDLE]: [
    new SpeciesEvolution(SpeciesId.CETITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Since this is the only Paldea Pokemon that evolves, I am leaving it in dex order */
  [SpeciesId.PALDEA_WOOPER]: [new SpeciesEvolution(SpeciesId.CLODSIRE, 20, null, null)],
  [SpeciesId.FRIGIBAX]: [new SpeciesEvolution(SpeciesId.ARCTIBAX, 35, null, null)],
  [SpeciesId.ARCTIBAX]: [new SpeciesEvolution(SpeciesId.BAXCALIBUR, 54, null, null)],
  /** Custom evolution method */
  [SpeciesId.GIMMIGHOUL]: [
    new SpeciesFormEvolution(
      SpeciesId.GHOLDENGO,
      "chest",
      "",
      1,
      null,
      [new GholdengoEvoCondition()],
      GHOLDENGO_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.GHOLDENGO,
      "roaming",
      "",
      1,
      null,
      [new GholdengoEvoCondition()],
      GHOLDENGO_EVO_LEVEL,
    ),
  ],
  [SpeciesId.POLTCHAGEIST]: [
    new SpeciesFormEvolution(
      SpeciesId.SINISTCHA,
      "counterfeit",
      "unremarkable",
      1,
      EvolutionItem.UNREMARKABLE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.SINISTCHA,
      "artisan",
      "masterpiece",
      1,
      EvolutionItem.MASTERPIECE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
};

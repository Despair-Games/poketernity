import {
  BRAMBLEGHAST_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
  GHOLDENGO_EVO_LEVEL,
  PAWMOT_EVO_LEVEL,
  RABSCA_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import {
  SpeciesEvolution,
  SpeciesEvolutionCondition,
  SpeciesFormEvolution,
  type PokemonEvolutions,
} from "#app/data/pokemon-evolutions";
import { globalScene } from "#app/global-scene";
import { randSeedInt } from "#app/utils";
import { EvolutionItem } from "#enums/evolution-item";
import { Gender } from "#enums/gender";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";

export const gen9pokemonFamilyEvolutions: PokemonEvolutions = {
  [Species.SPRIGATITO]: [new SpeciesEvolution(Species.FLORAGATO, 16, null, null)],
  [Species.FLORAGATO]: [new SpeciesEvolution(Species.MEOWSCARADA, 36, null, null)],
  [Species.FUECOCO]: [new SpeciesEvolution(Species.CROCALOR, 16, null, null)],
  [Species.CROCALOR]: [new SpeciesEvolution(Species.SKELEDIRGE, 36, null, null)],
  [Species.QUAXLY]: [new SpeciesEvolution(Species.QUAXWELL, 16, null, null)],
  [Species.QUAXWELL]: [new SpeciesEvolution(Species.QUAQUAVAL, 36, null, null)],
  [Species.LECHONK]: [
    new SpeciesFormEvolution(
      Species.OINKOLOGNE,
      "",
      "female",
      18,
      null,
      new SpeciesEvolutionCondition((p) => p.gender === Gender.FEMALE),
    ),
    new SpeciesFormEvolution(
      Species.OINKOLOGNE,
      "",
      "",
      18,
      null,
      new SpeciesEvolutionCondition((p) => p.gender === Gender.MALE),
    ),
  ],
  [Species.TAROUNTULA]: [new SpeciesEvolution(Species.SPIDOPS, 15, null, null)],
  [Species.NYMBLE]: [new SpeciesEvolution(Species.LOKIX, 24, null, null)],
  [Species.PAWMI]: [new SpeciesEvolution(Species.PAWMO, 18, null, null)],
  [Species.PAWMO]: [new SpeciesEvolution(Species.PAWMOT, PAWMOT_EVO_LEVEL, null, null)],
  [Species.TANDEMAUS]: [
    new SpeciesFormEvolution(
      Species.MAUSHOLD,
      "",
      "three",
      25,
      null,
      new SpeciesEvolutionCondition((p) => {
        let ret = false;
        globalScene.executeWithSeedOffset(() => (ret = !randSeedInt(4)), p.id);
        return ret;
      }),
    ),
    new SpeciesEvolution(Species.MAUSHOLD, 25, null, null),
  ],
  [Species.FIDOUGH]: [new SpeciesEvolution(Species.DACHSBUN, 26, null, null)],
  [Species.SMOLIV]: [new SpeciesEvolution(Species.DOLLIV, 25, null, null)],
  [Species.DOLLIV]: [new SpeciesEvolution(Species.ARBOLIVA, 35, null, null)],
  [Species.NACLI]: [new SpeciesEvolution(Species.NACLSTACK, 24, null, null)],
  [Species.NACLSTACK]: [new SpeciesEvolution(Species.GARGANACL, 38, null, null)],
  [Species.CHARCADET]: [
    new SpeciesEvolution(Species.ARMAROUGE, 1, EvolutionItem.AUSPICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.CERULEDGE, 1, EvolutionItem.MALICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TADBULB]: [
    new SpeciesEvolution(Species.BELLIBOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.WATTREL]: [new SpeciesEvolution(Species.KILOWATTREL, 25, null, null)],
  [Species.MASCHIFF]: [new SpeciesEvolution(Species.MABOSSTIFF, 30, null, null)],
  [Species.SHROODLE]: [new SpeciesEvolution(Species.GRAFAIAI, 28, null, null)],
  [Species.BRAMBLIN]: [new SpeciesEvolution(Species.BRAMBLEGHAST, BRAMBLEGHAST_EVO_LEVEL, null, null)],
  [Species.TOEDSCOOL]: [new SpeciesEvolution(Species.TOEDSCRUEL, 30, null, null)],
  [Species.CAPSAKID]: [
    new SpeciesEvolution(Species.SCOVILLAIN, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.RELLOR]: [new SpeciesEvolution(Species.RABSCA, RABSCA_EVO_LEVEL, null, null)],
  [Species.FLITTLE]: [new SpeciesEvolution(Species.ESPATHRA, 35, null, null)],
  [Species.TINKATINK]: [new SpeciesEvolution(Species.TINKATUFF, 24, null, null)],
  [Species.TINKATUFF]: [new SpeciesEvolution(Species.TINKATON, 38, null, null)],
  [Species.WIGLETT]: [new SpeciesEvolution(Species.WUGTRIO, 26, null, null)],
  /** Does not need union circle */
  [Species.FINIZEN]: [new SpeciesEvolution(Species.PALAFIN, 38, null, null)],
  [Species.VAROOM]: [new SpeciesEvolution(Species.REVAVROOM, 40, null, null)],
  [Species.GLIMMET]: [new SpeciesEvolution(Species.GLIMMORA, 35, null, null)],
  [Species.GREAVARD]: [
    new SpeciesEvolution(
      Species.HOUNDSTONE,
      30,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
  ],
  [Species.CETODDLE]: [new SpeciesEvolution(Species.CETITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  /** Since this is the only Paldea Pokemon that evolves, I am leaving it in dex order */
  [Species.PALDEA_WOOPER]: [new SpeciesEvolution(Species.CLODSIRE, 20, null, null)],
  [Species.FRIGIBAX]: [new SpeciesEvolution(Species.ARCTIBAX, 35, null, null)],
  [Species.ARCTIBAX]: [new SpeciesEvolution(Species.BAXCALIBUR, 54, null, null)],
  /** Custom evolution method */
  [Species.GIMMIGHOUL]: [
    new SpeciesFormEvolution(
      Species.GHOLDENGO,
      "chest",
      "",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.evoCounter
            + p.getHeldItems().filter((m) => m.isDamageMoneyRewardModifier()).length
            + globalScene.findModifiers(
              (m) => m.isMoneyMultiplierModifier() || m.isExtraModifierModifier() || m.isTempExtraModifierModifier(),
            ).length
          > 9,
      ),
      GHOLDENGO_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.GHOLDENGO,
      "roaming",
      "",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.evoCounter
            + p.getHeldItems().filter((m) => m.isDamageMoneyRewardModifier()).length
            + globalScene.findModifiers(
              (m) => m.isMoneyMultiplierModifier() || m.isExtraModifierModifier() || m.isTempExtraModifierModifier(),
            ).length
          > 9,
      ),
      GHOLDENGO_EVO_LEVEL,
    ),
  ],
  [Species.POLTCHAGEIST]: [
    new SpeciesFormEvolution(
      Species.SINISTCHA,
      "counterfeit",
      "unremarkable",
      1,
      EvolutionItem.UNREMARKABLE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.SINISTCHA,
      "artisan",
      "masterpiece",
      1,
      EvolutionItem.MASTERPIECE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
};

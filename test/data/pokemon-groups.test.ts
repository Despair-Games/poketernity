import { allSpecies } from "#app/data/pokemon-species";
import { SpeciesGroups } from "#enums/pokemon-species-groups";
import { Species } from "#enums/species";
import { describe, expect, it } from "vitest";

/**
 * Note: We are currently applying the lists of Sub-Legendary, Legendary, and Mythical Pokemon compiled by
 * {@link https://www.serebii.net/pokemon/legendary.shtml Serebii},
 * with the following exceptions:
 * 1. Ultra Beasts are in their own group instead of being Sub-Legendary.
 * 2. Eternal Floette and Bloodmoon Ursaluna are Sub-Legendary instead of Common (custom implementation).
 * 3. The Galarian variants of Articuno, Zapdos, and Moltres are Sub-Legendary (Serebii forgot to add them).
 */
describe("Pokemon Groups", () => {
  it("should have the correct Pokemon in the Sub-Legendary group", () => {
    const EXPECTED_SUB_LEGENDS = [
      Species.ARTICUNO,
      Species.ZAPDOS,
      Species.MOLTRES,
      Species.RAIKOU,
      Species.ENTEI,
      Species.SUICUNE,
      Species.REGIROCK,
      Species.REGICE,
      Species.REGISTEEL,
      Species.LATIAS,
      Species.LATIOS,
      Species.UXIE,
      Species.MESPRIT,
      Species.AZELF,
      Species.HEATRAN,
      Species.REGIGIGAS,
      Species.CRESSELIA,
      Species.COBALION,
      Species.TERRAKION,
      Species.VIRIZION,
      Species.TORNADUS,
      Species.THUNDURUS,
      Species.LANDORUS,
      Species.TYPE_NULL,
      Species.SILVALLY,
      Species.TAPU_KOKO,
      Species.TAPU_LELE,
      Species.TAPU_BULU,
      Species.TAPU_FINI,
      Species.GALAR_ARTICUNO,
      Species.GALAR_ZAPDOS,
      Species.GALAR_MOLTRES,
      Species.KUBFU,
      Species.URSHIFU,
      Species.REGIELEKI,
      Species.REGIDRAGO,
      Species.GLASTRIER,
      Species.SPECTRIER,
      Species.ENAMORUS,
      Species.WO_CHIEN,
      Species.CHIEN_PAO,
      Species.TING_LU,
      Species.CHI_YU,
      Species.OKIDOGI,
      Species.MUNKIDORI,
      Species.FEZANDIPITI,
      Species.OGERPON,
      Species.ETERNAL_FLOETTE,
      Species.BLOODMOON_URSALUNA,
    ];
    for (const species of allSpecies) {
      const expectedSubLegend = EXPECTED_SUB_LEGENDS.includes(species.speciesId);
      const actualSubLegend = species.group === SpeciesGroups.SUBLEGENDARY;
      expect(actualSubLegend).toBe(expectedSubLegend);
    }
  });

  it("should have the correct Pokemon in the Legendary group", () => {
    const EXPECTED_LEGENDS = [
      Species.MEWTWO,
      Species.LUGIA,
      Species.HO_OH,
      Species.KYOGRE,
      Species.GROUDON,
      Species.RAYQUAZA,
      Species.DIALGA,
      Species.PALKIA,
      Species.GIRATINA,
      Species.RESHIRAM,
      Species.ZEKROM,
      Species.KYUREM,
      Species.XERNEAS,
      Species.YVELTAL,
      Species.ZYGARDE,
      Species.COSMOG,
      Species.COSMOEM,
      Species.SOLGALEO,
      Species.LUNALA,
      Species.NECROZMA,
      Species.ZACIAN,
      Species.ZAMAZENTA,
      Species.ETERNATUS,
      Species.CALYREX,
      Species.KORAIDON,
      Species.MIRAIDON,
      Species.TERAPAGOS,
    ];
    for (const species of allSpecies) {
      const expectedLegend = EXPECTED_LEGENDS.includes(species.speciesId);
      const actualLegend = species.group === SpeciesGroups.LEGENDARY;
      expect(actualLegend).toBe(expectedLegend);
    }
  });

  it("should have the correct Pokemon in the Mythical group", () => {
    const EXPECTED_MYTHICALS = [
      Species.MEW,
      Species.CELEBI,
      Species.JIRACHI,
      Species.DEOXYS,
      Species.PHIONE,
      Species.MANAPHY,
      Species.DARKRAI,
      Species.SHAYMIN,
      Species.ARCEUS,
      Species.VICTINI,
      Species.KELDEO,
      Species.MELOETTA,
      Species.GENESECT,
      Species.DIANCIE,
      Species.HOOPA,
      Species.VOLCANION,
      Species.MAGEARNA,
      Species.MARSHADOW,
      Species.ZERAORA,
      Species.MELTAN,
      Species.MELMETAL,
      Species.ZARUDE,
      Species.PECHARUNT,
    ];
    for (const species of allSpecies) {
      const expectedMythical = EXPECTED_MYTHICALS.includes(species.speciesId);
      const actualMythical = species.group === SpeciesGroups.MYTHICAL;
      expect(actualMythical).toBe(expectedMythical);
    }
  });

  it("should have the correct Pokemon in the Ultra Beast group", () => {
    const EXPECTED_ULTRA_BEASTS = [
      Species.NIHILEGO,
      Species.BUZZWOLE,
      Species.PHEROMOSA,
      Species.XURKITREE,
      Species.CELESTEELA,
      Species.KARTANA,
      Species.GUZZLORD,
      Species.POIPOLE,
      Species.NAGANADEL,
      Species.STAKATAKA,
      Species.BLACEPHALON,
    ];
    for (const species of allSpecies) {
      const expectedUltraBeast = EXPECTED_ULTRA_BEASTS.includes(species.speciesId);
      const actualUltraBeast = species.group === SpeciesGroups.ULTRA_BEAST;
      expect(actualUltraBeast).toBe(expectedUltraBeast);
    }
  });

  it("should have the correct Pokemon in the Paradox group", () => {
    const EXPECTED_PARADOX = [
      Species.GREAT_TUSK,
      Species.SCREAM_TAIL,
      Species.BRUTE_BONNET,
      Species.FLUTTER_MANE,
      Species.SLITHER_WING,
      Species.SANDY_SHOCKS,
      Species.ROARING_MOON,
      Species.WALKING_WAKE,
      Species.GOUGING_FIRE,
      Species.RAGING_BOLT,
      Species.IRON_TREADS,
      Species.IRON_BUNDLE,
      Species.IRON_HANDS,
      Species.IRON_JUGULIS,
      Species.IRON_MOTH,
      Species.IRON_THORNS,
      Species.IRON_VALIANT,
      Species.IRON_LEAVES,
      Species.IRON_BOULDER,
      Species.IRON_CROWN,
    ];
    for (const species of allSpecies) {
      const expectedParadox = EXPECTED_PARADOX.includes(species.speciesId);
      const actualParadox = species.group === SpeciesGroups.PARADOX;
      expect(actualParadox).toBe(expectedParadox);
    }
  });
});

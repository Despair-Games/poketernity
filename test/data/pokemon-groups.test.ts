import { allSpecies } from "#app/data/data-lists";
import { SpeciesGroups } from "#enums/pokemon-species-groups";
import { SpeciesId } from "#enums/species-id";
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
      SpeciesId.ARTICUNO,
      SpeciesId.ZAPDOS,
      SpeciesId.MOLTRES,
      SpeciesId.RAIKOU,
      SpeciesId.ENTEI,
      SpeciesId.SUICUNE,
      SpeciesId.REGIROCK,
      SpeciesId.REGICE,
      SpeciesId.REGISTEEL,
      SpeciesId.LATIAS,
      SpeciesId.LATIOS,
      SpeciesId.UXIE,
      SpeciesId.MESPRIT,
      SpeciesId.AZELF,
      SpeciesId.HEATRAN,
      SpeciesId.REGIGIGAS,
      SpeciesId.CRESSELIA,
      SpeciesId.COBALION,
      SpeciesId.TERRAKION,
      SpeciesId.VIRIZION,
      SpeciesId.TORNADUS,
      SpeciesId.THUNDURUS,
      SpeciesId.LANDORUS,
      SpeciesId.TYPE_NULL,
      SpeciesId.SILVALLY,
      SpeciesId.TAPU_KOKO,
      SpeciesId.TAPU_LELE,
      SpeciesId.TAPU_BULU,
      SpeciesId.TAPU_FINI,
      SpeciesId.GALAR_ARTICUNO,
      SpeciesId.GALAR_ZAPDOS,
      SpeciesId.GALAR_MOLTRES,
      SpeciesId.KUBFU,
      SpeciesId.URSHIFU,
      SpeciesId.REGIELEKI,
      SpeciesId.REGIDRAGO,
      SpeciesId.GLASTRIER,
      SpeciesId.SPECTRIER,
      SpeciesId.ENAMORUS,
      SpeciesId.WO_CHIEN,
      SpeciesId.CHIEN_PAO,
      SpeciesId.TING_LU,
      SpeciesId.CHI_YU,
      SpeciesId.OKIDOGI,
      SpeciesId.MUNKIDORI,
      SpeciesId.FEZANDIPITI,
      SpeciesId.OGERPON,
      SpeciesId.ETERNAL_FLOETTE,
      SpeciesId.BLOODMOON_URSALUNA,
    ];
    for (const species of allSpecies) {
      const expectedSubLegend = EXPECTED_SUB_LEGENDS.includes(species.speciesId);
      const actualSubLegend = species.group === SpeciesGroups.SUBLEGENDARY;
      expect(actualSubLegend).toBe(expectedSubLegend);
    }
  });

  it("should have the correct Pokemon in the Legendary group", () => {
    const EXPECTED_LEGENDS = [
      SpeciesId.MEWTWO,
      SpeciesId.LUGIA,
      SpeciesId.HO_OH,
      SpeciesId.KYOGRE,
      SpeciesId.GROUDON,
      SpeciesId.RAYQUAZA,
      SpeciesId.DIALGA,
      SpeciesId.PALKIA,
      SpeciesId.GIRATINA,
      SpeciesId.RESHIRAM,
      SpeciesId.ZEKROM,
      SpeciesId.KYUREM,
      SpeciesId.XERNEAS,
      SpeciesId.YVELTAL,
      SpeciesId.ZYGARDE,
      SpeciesId.COSMOG,
      SpeciesId.COSMOEM,
      SpeciesId.SOLGALEO,
      SpeciesId.LUNALA,
      SpeciesId.NECROZMA,
      SpeciesId.ZACIAN,
      SpeciesId.ZAMAZENTA,
      SpeciesId.ETERNATUS,
      SpeciesId.CALYREX,
      SpeciesId.KORAIDON,
      SpeciesId.MIRAIDON,
      SpeciesId.TERAPAGOS,
    ];
    for (const species of allSpecies) {
      const expectedLegend = EXPECTED_LEGENDS.includes(species.speciesId);
      const actualLegend = species.group === SpeciesGroups.LEGENDARY;
      expect(actualLegend).toBe(expectedLegend);
    }
  });

  it("should have the correct Pokemon in the Mythical group", () => {
    const EXPECTED_MYTHICALS = [
      SpeciesId.MEW,
      SpeciesId.CELEBI,
      SpeciesId.JIRACHI,
      SpeciesId.DEOXYS,
      SpeciesId.PHIONE,
      SpeciesId.MANAPHY,
      SpeciesId.DARKRAI,
      SpeciesId.SHAYMIN,
      SpeciesId.ARCEUS,
      SpeciesId.VICTINI,
      SpeciesId.KELDEO,
      SpeciesId.MELOETTA,
      SpeciesId.GENESECT,
      SpeciesId.DIANCIE,
      SpeciesId.HOOPA,
      SpeciesId.VOLCANION,
      SpeciesId.MAGEARNA,
      SpeciesId.MARSHADOW,
      SpeciesId.ZERAORA,
      SpeciesId.MELTAN,
      SpeciesId.MELMETAL,
      SpeciesId.ZARUDE,
      SpeciesId.PECHARUNT,
    ];
    for (const species of allSpecies) {
      const expectedMythical = EXPECTED_MYTHICALS.includes(species.speciesId);
      const actualMythical = species.group === SpeciesGroups.MYTHICAL;
      expect(actualMythical).toBe(expectedMythical);
    }
  });

  it("should have the correct Pokemon in the Ultra Beast group", () => {
    const EXPECTED_ULTRA_BEASTS = [
      SpeciesId.NIHILEGO,
      SpeciesId.BUZZWOLE,
      SpeciesId.PHEROMOSA,
      SpeciesId.XURKITREE,
      SpeciesId.CELESTEELA,
      SpeciesId.KARTANA,
      SpeciesId.GUZZLORD,
      SpeciesId.POIPOLE,
      SpeciesId.NAGANADEL,
      SpeciesId.STAKATAKA,
      SpeciesId.BLACEPHALON,
    ];
    for (const species of allSpecies) {
      const expectedUltraBeast = EXPECTED_ULTRA_BEASTS.includes(species.speciesId);
      const actualUltraBeast = species.group === SpeciesGroups.ULTRA_BEAST;
      expect(actualUltraBeast).toBe(expectedUltraBeast);
    }
  });

  it("should have the correct Pokemon in the Paradox group", () => {
    const EXPECTED_PARADOX = [
      SpeciesId.GREAT_TUSK,
      SpeciesId.SCREAM_TAIL,
      SpeciesId.BRUTE_BONNET,
      SpeciesId.FLUTTER_MANE,
      SpeciesId.SLITHER_WING,
      SpeciesId.SANDY_SHOCKS,
      SpeciesId.ROARING_MOON,
      SpeciesId.WALKING_WAKE,
      SpeciesId.GOUGING_FIRE,
      SpeciesId.RAGING_BOLT,
      SpeciesId.IRON_TREADS,
      SpeciesId.IRON_BUNDLE,
      SpeciesId.IRON_HANDS,
      SpeciesId.IRON_JUGULIS,
      SpeciesId.IRON_MOTH,
      SpeciesId.IRON_THORNS,
      SpeciesId.IRON_VALIANT,
      SpeciesId.IRON_LEAVES,
      SpeciesId.IRON_BOULDER,
      SpeciesId.IRON_CROWN,
    ];
    for (const species of allSpecies) {
      const expectedParadox = EXPECTED_PARADOX.includes(species.speciesId);
      const actualParadox = species.group === SpeciesGroups.PARADOX;
      expect(actualParadox).toBe(expectedParadox);
    }
  });
});

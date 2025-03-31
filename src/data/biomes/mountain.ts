import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.TAILLOW, SpeciesId.SWABLU, SpeciesId.STARLY, SpeciesId.PIDOVE, SpeciesId.FLETCHLING],
    [TimeOfDay.DAY]: [SpeciesId.TAILLOW, SpeciesId.SWABLU, SpeciesId.STARLY, SpeciesId.PIDOVE, SpeciesId.FLETCHLING],
    [TimeOfDay.DUSK]: [SpeciesId.RHYHORN, SpeciesId.ARON, SpeciesId.ROGGENROLA],
    [TimeOfDay.NIGHT]: [SpeciesId.RHYHORN, SpeciesId.ARON, SpeciesId.ROGGENROLA],
    [TimeOfDay.ALL]: [SpeciesId.PIDGEY, SpeciesId.SPEAROW, SpeciesId.SKIDDO],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [
      SpeciesId.RHYHORN,
      SpeciesId.ARON,
      SpeciesId.ROGGENROLA,
      SpeciesId.RUFFLET,
      SpeciesId.ROOKIDEE,
      SpeciesId.FLITTLE,
      SpeciesId.BOMBIRDIER,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.RHYHORN,
      SpeciesId.ARON,
      SpeciesId.ROGGENROLA,
      SpeciesId.RUFFLET,
      SpeciesId.ROOKIDEE,
      SpeciesId.FLITTLE,
      SpeciesId.BOMBIRDIER,
    ],
    [TimeOfDay.DUSK]: [SpeciesId.VULLABY],
    [TimeOfDay.NIGHT]: [SpeciesId.VULLABY],
    [TimeOfDay.ALL]: [SpeciesId.MACHOP, SpeciesId.GEODUDE, SpeciesId.NATU, SpeciesId.SLUGMA, SpeciesId.NACLI],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.MURKROW],
    [TimeOfDay.ALL]: [SpeciesId.SKARMORY, SpeciesId.TORCHIC, SpeciesId.SPOINK, SpeciesId.HAWLUCHA, SpeciesId.KLAWF],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.LARVITAR,
      SpeciesId.CRANIDOS,
      SpeciesId.SHIELDON,
      SpeciesId.GIBLE,
      SpeciesId.ROTOM,
      SpeciesId.ARCHEOPS,
      SpeciesId.AXEW,
    ],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TORNADUS, SpeciesId.TING_LU, SpeciesId.OGERPON],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [
      SpeciesId.SWELLOW,
      SpeciesId.ALTARIA,
      SpeciesId.STARAPTOR,
      SpeciesId.UNFEZANT,
      SpeciesId.BRAVIARY,
      SpeciesId.TALONFLAME,
      SpeciesId.CORVIKNIGHT,
      SpeciesId.ESPATHRA,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.SWELLOW,
      SpeciesId.ALTARIA,
      SpeciesId.STARAPTOR,
      SpeciesId.UNFEZANT,
      SpeciesId.BRAVIARY,
      SpeciesId.TALONFLAME,
      SpeciesId.CORVIKNIGHT,
      SpeciesId.ESPATHRA,
    ],
    [TimeOfDay.DUSK]: [SpeciesId.MANDIBUZZ],
    [TimeOfDay.NIGHT]: [SpeciesId.MANDIBUZZ],
    [TimeOfDay.ALL]: [
      SpeciesId.PIDGEOT,
      SpeciesId.FEAROW,
      SpeciesId.SKARMORY,
      SpeciesId.AGGRON,
      SpeciesId.GOGOAT,
      SpeciesId.GARGANACL,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.HISUI_BRAVIARY],
    [TimeOfDay.DAY]: [SpeciesId.HISUI_BRAVIARY],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BLAZIKEN, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.HAWLUCHA],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ROTOM, SpeciesId.TORNADUS, SpeciesId.TING_LU, SpeciesId.OGERPON],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.HO_OH],
  },
};

export const mountainBiome = new Biome(
  BiomeId.MOUNTAIN,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);

import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.COMBEE, SpeciesId.CHERUBI, SpeciesId.SEWADDLE],
    [TimeOfDay.DAY]: [SpeciesId.COMBEE, SpeciesId.CHERUBI, SpeciesId.SEWADDLE],
    [TimeOfDay.DUSK]: [SpeciesId.SHROOMISH, SpeciesId.PURRLOIN, SpeciesId.FOONGUS],
    [TimeOfDay.NIGHT]: [SpeciesId.SPINARAK, SpeciesId.SHROOMISH, SpeciesId.PURRLOIN, SpeciesId.FOONGUS],
    [TimeOfDay.ALL]: [SpeciesId.AIPOM, SpeciesId.BLITZLE, SpeciesId.PIKIPEK],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.EXEGGCUTE, SpeciesId.TROPIUS, SpeciesId.COMBEE, SpeciesId.KOMALA],
    [TimeOfDay.DAY]: [SpeciesId.EXEGGCUTE, SpeciesId.TROPIUS, SpeciesId.COMBEE, SpeciesId.KOMALA],
    [TimeOfDay.DUSK]: [SpeciesId.TANGELA, SpeciesId.SPINARAK, SpeciesId.PANCHAM],
    [TimeOfDay.NIGHT]: [SpeciesId.TANGELA, SpeciesId.PANCHAM],
    [TimeOfDay.ALL]: [
      SpeciesId.PANSAGE,
      SpeciesId.PANSEAR,
      SpeciesId.PANPOUR,
      SpeciesId.JOLTIK,
      SpeciesId.LITLEO,
      SpeciesId.FOMANTIS,
      SpeciesId.FALINKS,
    ],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.FOONGUS, SpeciesId.PASSIMIAN, SpeciesId.GALAR_PONYTA],
    [TimeOfDay.DAY]: [SpeciesId.FOONGUS, SpeciesId.PASSIMIAN],
    [TimeOfDay.DUSK]: [SpeciesId.ORANGURU],
    [TimeOfDay.NIGHT]: [SpeciesId.ORANGURU],
    [TimeOfDay.ALL]: [
      SpeciesId.SCYTHER,
      SpeciesId.YANMA,
      SpeciesId.SLAKOTH,
      SpeciesId.SEVIPER,
      SpeciesId.CARNIVINE,
      SpeciesId.SNIVY,
      SpeciesId.GROOKEY,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.KANGASKHAN, SpeciesId.CHATOT, SpeciesId.KLEAVOR],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TAPU_LELE, SpeciesId.BUZZWOLE, SpeciesId.ZARUDE, SpeciesId.MUNKIDORI],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.EXEGGUTOR, SpeciesId.TROPIUS, SpeciesId.CHERRIM, SpeciesId.LEAVANNY, SpeciesId.KOMALA],
    [TimeOfDay.DAY]: [SpeciesId.EXEGGUTOR, SpeciesId.TROPIUS, SpeciesId.CHERRIM, SpeciesId.LEAVANNY, SpeciesId.KOMALA],
    [TimeOfDay.DUSK]: [SpeciesId.BRELOOM, SpeciesId.TANGROWTH, SpeciesId.AMOONGUSS, SpeciesId.PANGORO],
    [TimeOfDay.NIGHT]: [SpeciesId.BRELOOM, SpeciesId.TANGROWTH, SpeciesId.AMOONGUSS, SpeciesId.PANGORO],
    [TimeOfDay.ALL]: [
      SpeciesId.SEVIPER,
      SpeciesId.AMBIPOM,
      SpeciesId.CARNIVINE,
      SpeciesId.YANMEGA,
      SpeciesId.GALVANTULA,
      SpeciesId.PYROAR,
      SpeciesId.TOUCANNON,
      SpeciesId.LURANTIS,
      SpeciesId.FALINKS,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.AMOONGUSS, SpeciesId.GALAR_RAPIDASH],
    [TimeOfDay.DAY]: [SpeciesId.AMOONGUSS],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.KANGASKHAN,
      SpeciesId.SCIZOR,
      SpeciesId.SLAKING,
      SpeciesId.LEAFEON,
      SpeciesId.SERPERIOR,
      SpeciesId.RILLABOOM,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TAPU_LELE, SpeciesId.BUZZWOLE, SpeciesId.ZARUDE, SpeciesId.MUNKIDORI],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.KLEAVOR],
  },
};

export const jungleBiome = new Biome(
  BiomeId.JUNGLE,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);

import type { PokeballCounts } from "#app/battle-scene";
import { Variant } from "#data/variant";
import { AbilityId } from "#enums/ability-id";
import { BerryType } from "#enums/berry-type";
import { BiomeId } from "#enums/biome-id";
import { EggTier } from "#enums/egg-tier";
import { ElementalType } from "#enums/elemental-type";
import { EvolutionItem } from "#enums/evolution-item";
import { FormChangeItem } from "#enums/form-change-item";
import { Gender } from "#enums/gender";
import { MoveId } from "#enums/move-id";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { Nature } from "#enums/nature";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { Unlockables } from "#enums/unlockables";
import { VariantTier } from "#enums/variant-tier";
import { WeatherType } from "#enums/weather-type";
import type { Arena } from "#field/arena";
import type { ModifierOverride } from "#modifier/modifier-type";

/**
 * This comment block exists to prevent IDEs from automatically removing unused imports
 * {@linkcode BerryType}, {@linkcode EvolutionItem} {@linkcode FormChangeItem}, {@linkcode Stat}
 */
/**
 * Overrides that are used to test different in game situations
 *
 * Any override added here will be used instead of the value in {@linkcode DefaultOverrides}
 *
 * If an override name starts with "STARTING", it will apply when a new run begins
 *
 * @example
 * ```
 * const overrides = {
 *   ABILITY_OVERRIDE: AbilityId.PROTEAN,
 *   PASSIVE_ABILITY_OVERRIDE: AbilityId.PIXILATE,
 * }
 * ```
 */
const overrides = {} satisfies Partial<InstanceType<typeof DefaultOverrides>>;

/**
 * If you need to add Overrides values for local testing do that inside {@linkcode overrides}
 * ---
 * Defaults for Overrides that are used when testing different in game situations
 *
 * If an override name starts with "STARTING", it will apply when a new run begins
 */
class DefaultOverrides {
  // -----------------
  // OVERALL OVERRIDES
  // -----------------

  /** a specific seed (default: a random string of 24 characters) */
  readonly SEED_OVERRIDE: string = "";
  /**
   * Overrides the weather
   */
  readonly WEATHER_OVERRIDE: WeatherType = WeatherType.NONE;
  /**
   * Override the new weather duration.
   * **Will ALSO affect primal weathers!**
   * **Can NOT be combined with {@linkcode WEATHER_OVERRIDE}!**
   * - `-1` to disable the override
   * - `0` for "infinite" duration
   * - `>= 1` to set the number of turns the weather should last
   * @see {@linkcode Arena.trySetWeather}
   */
  readonly NEW_WEATHER_DURATION_OVERRIDE: number = -1;
  /**
   * Overrides the terrain
   */
  readonly TERRAIN_OVERRIDE: TerrainType = TerrainType.NONE;
  /**
   * Override the new terrain duration.
   * **Can NOT be combined with {@linkcode TERRAIN_OVERRIDE}!**
   * - `-1` to disable the override
   * - `0` for "infinite" duration
   * - `>= 1` to set the number of turns the terrain should last
   * @see {@linkcode Arena.trySetTerrain}
   */
  readonly NEW_TERRAIN_DURATION_OVERRIDE: number = -1;
  /**
   * Determines the override for battle types.
   *
   * Possible values:
   * - `null`: Ignore this override.
   * - `"single"`: Set every non-trainer battle to be a single battle.
   * - `"double"`: Set every battle (including trainer battles) to be a double battle.
   * - `"even-doubles"`:
   *      - On even wave numbers, apply the `"double"` rule.
   *      - On odd wave numbers, apply the `"single"` rule.
   * - `"odd-doubles"`:
   *      - On odd wave numbers, apply the `"double"` rule.
   *      - On even wave numbers, apply the `"single"` rule.
   */
  readonly BATTLE_TYPE_OVERRIDE: BattleStyle | null = null;
  readonly STARTING_WAVE_OVERRIDE: number = 0;
  readonly STARTING_BIOME_OVERRIDE: BiomeId = BiomeId.TOWN;
  readonly ARENA_TINT_OVERRIDE: TimeOfDay | null = null;
  /** Multiplies XP gained by this value including 0. Set to null to ignore the override */
  readonly XP_MULTIPLIER_OVERRIDE: number | null = null;
  /** Overrides the level cap to the number specified if greater than `0`. Negative numbers will disable the cap entirely. */
  readonly LEVEL_CAP_OVERRIDE: number = 0;
  readonly NEVER_CRIT_OVERRIDE: boolean = false;
  /** @defaultValue `1000` */
  readonly STARTING_MONEY_OVERRIDE: number = 0;
  /** Sets all shop item prices and reroll cost to 0 */
  readonly WAIVE_SHOP_FEES_OVERRIDE: boolean = false;
  /** Sets all candy upgrades cost to 0 in starter selection */
  readonly FREE_CANDY_UPGRADE_OVERRIDE: boolean = false;
  readonly POKEBALL_OVERRIDE: { active: boolean; pokeballs: PokeballCounts } = {
    active: false,
    pokeballs: {
      [PokeballType.POKEBALL]: 5,
      [PokeballType.GREAT_BALL]: 0,
      [PokeballType.ULTRA_BALL]: 0,
      [PokeballType.MASTER_BALL]: 0,
    },
  };
  /** Forces an item to be UNLOCKED */
  readonly ITEM_UNLOCK_OVERRIDE: Unlockables[] = [];
  /** Set to `true` to show all tutorials */
  readonly BYPASS_TUTORIAL_SKIP_OVERRIDE: boolean = false;
  /** Set to `true` to be able to re-earn already unlocked achievements */
  readonly ACHIEVEMENTS_REUNLOCK_OVERRIDE: boolean = false;
  /** Forces the activation/non-activation of various statuses
   * - Paralysis: set to `true` to always activate, `false` to do the opposite
   * - Sleep: set to `true` to force the Pokemon to stay asleep, `false` to immediately wake up
   * - Freeze: set to `true` to keep the Pokemon frozen, `false` to defrost
   * - Confusion: set to `true` to keep the Pokemon confused and force self-damage, set to `false` to keep the Pokemon confused but prevent self-damage
   * - Infatuated: set to `true` to force its activation, set to `false` to do the opposite
   */
  readonly STATUS_ACTIVATION_OVERRIDE: boolean | null = null;

  // ----------------
  // PLAYER OVERRIDES
  // ----------------

  /**
   * Set the form index of any starter in the party whose {@linkcode SpeciesId} is inside this override
   * @see `src/data/pokemon-species.ts` for form indexes
   * @example
   * ```
   * const STARTER_FORM_OVERRIDES = {
   *   [SpeciesId.DARMANITAN]: 1
   * }
   * ```
   */
  readonly STARTER_FORM_OVERRIDES: Partial<Record<SpeciesId, number>> = {};

  /** @defaultValue `20` for Daily and `5` for all other modes */
  readonly STARTING_LEVEL_OVERRIDE: number = 0;
  /** Will override the species of your pokemon when starting a new run */
  readonly STARTER_SPECIES_OVERRIDE: SpeciesId | 0 = 0;
  readonly ABILITY_OVERRIDE: AbilityId = AbilityId.NONE;
  readonly PASSIVE_ABILITY_OVERRIDE: AbilityId = AbilityId.NONE;
  readonly STATUS_OVERRIDE: StatusEffect = StatusEffect.NONE;
  readonly GENDER_OVERRIDE: Gender | null = null;
  readonly MOVESET_OVERRIDE: MoveId | MoveId[] = [];
  readonly SHINY_OVERRIDE: boolean | null = null;
  readonly VARIANT_OVERRIDE: Variant | null = null;
  /**
   * Overrides the IVs of player pokemon. Values must never be outside the range `0` to `31`!
   * - If set to a number between `0` and `31`, set all IVs of all player pokemon to that number.
   * - If set to an array, set the IVs of all player pokemon to that array. Array length must be exactly `6`!
   * - If set to `null`, disable the override.
   */
  readonly IVS_OVERRIDE: number | number[] | null = null;
  /** Override the nature of all player pokemon to the specified nature. Disabled if `null`. */
  readonly NATURE_OVERRIDE: Nature | null = null;
  /**
   * If equal to `ElementalType.UNKNOWN`, then ignore this override.
   * Otherwise, override every player Pokemon's Tera type to be this type.
   */
  readonly TERA_TYPE_OVERRIDE: ElementalType = ElementalType.UNKNOWN;

  // --------------------------
  // ENEMY OVERRIDES
  // --------------------------

  readonly ENEMY_SPECIES_OVERRIDE: SpeciesId | number = 0;
  readonly ENEMY_LEVEL_OVERRIDE: number = 0;
  readonly ENEMY_ABILITY_OVERRIDE: AbilityId = AbilityId.NONE;
  readonly ENEMY_PASSIVE_ABILITY_OVERRIDE: AbilityId = AbilityId.NONE;
  readonly ENEMY_STATUS_OVERRIDE: StatusEffect = StatusEffect.NONE;
  readonly ENEMY_GENDER_OVERRIDE: Gender | null = null;
  readonly ENEMY_MOVESET_OVERRIDE: MoveId | MoveId[] = [];
  readonly ENEMY_SHINY_OVERRIDE: boolean | null = null;
  readonly ENEMY_VARIANT_OVERRIDE: Variant | null = null;
  /**
   * Overrides the IVs of enemy pokemon. Values must never be outside the range `0` to `31`!
   * - If set to a number between `0` and `31`, set all IVs of all enemy pokemon to that number.
   * - If set to an array, set the IVs of all enemy pokemon to that array. Array length must be exactly `6`!
   * - If set to `null`, disable the override.
   */
  readonly ENEMY_IVS_OVERRIDE: number | number[] | null = null;
  /** Override the nature of all enemy pokemon to the specified nature. Disabled if `null`. */
  readonly ENEMY_NATURE_OVERRIDE: Nature | null = null;
  readonly ENEMY_FORM_OVERRIDES: Partial<Record<SpeciesId, number>> = {};
  /**
   * Override to give the enemy Pokemon a given amount of health segments
   *
   * - `0` (default): the health segments will be handled normally based on wave, level and species
   * - `1`: the Pokemon will have a single health segment and therefore will not be a boss
   * - `2+`: the Pokemon will be a boss with the given number of health segments
   */
  readonly ENEMY_HEALTH_SEGMENTS_OVERRIDE: number = 0;
  /**
   * If `true`, every enemy Pokemon Terastallizes on the first turn that it decides to use a move.
   * If `false`, this override is ignored.
   */
  readonly FORCE_ENEMY_TERA_OVERRIDE: boolean = false;
  /**
   * If equal to `ElementalType.UNKNOWN`, then ignore this override.
   * Otherwise, override every enemy Pokemon's Tera type to be this type.
   */
  readonly ENEMY_TERA_TYPE_OVERRIDE: ElementalType = ElementalType.UNKNOWN;

  // -------------
  // EGG OVERRIDES
  // -------------

  readonly EGG_IMMEDIATE_HATCH_OVERRIDE: boolean = false;
  readonly EGG_TIER_OVERRIDE: EggTier | null = null;
  readonly EGG_SHINY_OVERRIDE: boolean = false;
  readonly EGG_VARIANT_OVERRIDE: VariantTier | null = null;
  readonly EGG_FREE_GACHA_PULLS_OVERRIDE: boolean = false;
  readonly EGG_GACHA_PULL_COUNT_OVERRIDE: number = 0;
  readonly UNLIMITED_EGG_COUNT_OVERRIDE: boolean = false;

  // -------------------------
  // MYSTERY ENCOUNTER OVERRIDES
  // -------------------------

  /**
   * `1` (almost never) to `256` (always), set to `null` to disable the override
   *
   * Note: Make sure `STARTING_WAVE_OVERRIDE > 10`, otherwise MEs won't trigger
   */
  readonly MYSTERY_ENCOUNTER_RATE_OVERRIDE: number | null = null;
  readonly MYSTERY_ENCOUNTER_TIER_OVERRIDE: MysteryEncounterTier | null = null;
  readonly MYSTERY_ENCOUNTER_OVERRIDE: MysteryEncounterType | null = null;

  // -------------------------
  // MODIFIER / ITEM OVERRIDES
  // -------------------------
  /**
   * Overrides labeled `MODIFIER` deal with any modifier so long as it doesn't require a party
   * member to hold it (typically this is, extends, or generates a {@linkcode ModifierType}),
   * like `EXP_SHARE`, `CANDY_JAR`, etc.
   *
   * Overrides labeled `HELD_ITEM` specifically pertain to any entry in {@linkcode modifierTypes} that
   * extends, or generates a {@linkcode PokemonHeldItemModifierType}, like `SOUL_DEW`, `TOXIC_ORB`, etc.
   *
   * Note that, if count is not provided, it will default to 1.
   *
   * Additionally, note that some held items and modifiers are grouped together via
   * a {@linkcode ModifierTypeGenerator} and require pre-generation arguments to get
   * a specific item from that group. If a type is not set, the generator will either
   * use the party to weight item choice or randomly pick an item.
   *
   * @example
   * ```
   * // Will have a quantity of 2 in-game
   * STARTING_MODIFIER_OVERRIDE = [{name: "EXP_SHARE", count: 2}]
   * // Will have a quantity of 1 in-game
   * STARTING_HELD_ITEM_OVERRIDE = [{name: "LUCKY_EGG"}]
   * // Type must be given to get a specific berry
   * STARTING_HELD_ITEM_OVERRIDE = [{name: "BERRY", type: BerryType.SITRUS}]
   * // A random berry will be generated at runtime
   * STARTING_HELD_ITEM_OVERRIDE = [{name: "BERRY"}]
   * ```
   */
  readonly STARTING_MODIFIER_OVERRIDE: ModifierOverride[] = [];
  /**
   * Override array of {@linkcode ModifierOverride}s used to provide modifiers to enemies.
   *
   * Note that any previous modifiers are cleared.
   */
  readonly ENEMY_MODIFIER_OVERRIDE: ModifierOverride[] = [];

  /** Override array of {@linkcode ModifierOverride}s used to provide held items to first party member when starting a new game. */
  readonly STARTING_HELD_ITEMS_OVERRIDE: ModifierOverride[] = [];
  /** Override array of {@linkcode ModifierOverride}s used to provide held items to enemies on spawn. */
  readonly ENEMY_HELD_ITEMS_OVERRIDE: ModifierOverride[] = [];

  /**
   * Override array of {@linkcode ModifierOverride}s used to replace the generated item rolls after a wave.
   *
   * If less entries are listed than rolled, only those entries will be used to replace the corresponding items while the rest randomly generated.
   * If more entries are listed than rolled, only the first X entries will be used, where X is the number of items rolled.
   *
   * Note that, for all items in the array, `count` is not used.
   *
   * @example
   * ```
   * // Attempts to make the first item reward a rarer candy, the second one a dynamax band, and the third a rare evolution item
   * ITEM_REWARD_OVERRIDE: [{ name: "RARER_CANDY" }, { name: "DYNAMAX_BAND" }, { name: "RARE_EVOLUTION_ITEM" }]
   *
   * // Example of a vitamin that boosts def (Iron)
   * ITEM_REWARD_OVERRIDE: [{ name: "BASE_STAT_BOOSTER", type: Stat.DEF }]
   *
   * // Example of a type boosting item (Charcoal)
   * { name: "ATTACK_TYPE_BOOSTER", type: ElementalType.FIRE }
   * ```
   */
  readonly ITEM_REWARD_OVERRIDE: ModifierOverride[] = [];

  /**
   * Possible values:
   * - `null`: Ignore this override; each biome uses its normal trainer rate.
   * - `0`: Disable all non-scripted enemy trainer encounters.
   * - Positive number `n`: Sets the chance of a non-scripted enemy trainer encounter to be 1/n.
   *
   * CAUTION: This function does not disable any rules that may prevent trainer spawns
   * (e.g., The rule requiring trainers to be 3 waves apart, and the rule preventing trainer spawns on wave X1).
   */
  readonly RANDOM_TRAINER_CHANCE_OVERRIDE: number | null = null;

  /** If not `null`, force all non-scripted enemy trainer encounters to be of this trainer type. */
  readonly TRAINER_TYPE_OVERRIDE: TrainerType | null = null;
}

export const defaultOverrides = new DefaultOverrides();

export const activeOverrides = { ...defaultOverrides, ...overrides } satisfies InstanceType<typeof DefaultOverrides>;

export type BattleStyle = "double" | "single" | "even-doubles" | "odd-doubles";

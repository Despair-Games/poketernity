/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Battle } from "#app/battle";
import type { BattleScene } from "#app/battle-scene";
import type { FaintPhase } from "#phases/faint-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { AbAttr } from "#abilities/ab-attr";
import type { Ability } from "#abilities/ability";
import type { AddSecondStrikeAbAttr } from "#abilities/add-second-strike-ab-attr";
import type { AlliedFieldDamageReductionAbAttr } from "#abilities/allied-field-damage-reduction-ab-attr";
import { applyAbAttrs, getAbApplyFunc } from "#abilities/apply-ab-attrs";
import type { ArenaTrapAbAttr } from "#abilities/arena-trap-ab-attr";
import type { BattlerTagImmunityAbAttr } from "#abilities/battler-tag-immunity-ab-attr";
import type { BlockCritAbAttr } from "#abilities/block-crit-ab-attr";
import type { BonusCritAbAttr } from "#abilities/bonus-crit-ab-attr";
import type { BypassBurnDamageReductionAbAttr } from "#abilities/bypass-burn-damage-reduction-ab-attr";
import type { BypassParaSpeedReductionAbAttr } from "#abilities/bypass-para-speed-reduction-ab-attr";
import type { ConditionalCritAbAttr } from "#abilities/conditional-crit-ab-attr";
import type { DamageBoostAbAttr } from "#abilities/damage-boost-ab-attr";
import type { FieldMultiplyStatAbAttr } from "#abilities/field-multiply-stat-ab-attr";
import type { FieldPriorityMoveImmunityAbAttr } from "#abilities/field-priority-move-immunity-ab-attr";
import type { FullHpResistTypeAbAttr } from "#abilities/full-hp-resist-type-ab-attr";
import type { IgnoreOpponentStatStagesAbAttr } from "#abilities/ignore-opponent-stat-stages-ab-attr";
import type { IgnoreTypeImmunityAbAttr } from "#abilities/ignore-type-immunity-ab-attr";
import type { IgnoreTypeStatusEffectImmunityAbAttr } from "#abilities/ignore-type-status-effect-immunity-ab-attr";
import type { InfiltratorAbAttr } from "#abilities/infiltrator-ab-attr";
import type { MockStatusEffectAbAttr } from "#abilities/mock-status-effect-ab-attr";
import type { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import type { MoveTypeChangeAbAttr } from "#abilities/move-type-change-ab-attr";
import type { MultCritAbAttr } from "#abilities/mult-crit-ab-attr";
import type { PostDamageAbAttr } from "#abilities/post-damage-ab-attr";
import type { PostItemLostAbAttr } from "#abilities/post-item-lost-ab-attr";
import type { ReceivedMoveDamageMultiplierAbAttr } from "#abilities/received-move-damage-multiplier-ab-attr";
import type { StabBoostAbAttr } from "#abilities/stab-boost-ab-attr";
import type { StatMultiplierAbAttr } from "#abilities/stat-multiplier-ab-attr";
import type { StatusEffectImmunityAbAttr } from "#abilities/status-effect-immunity-ab-attr";
import type { SturdyAbAttr } from "#abilities/sturdy-ab-attr";
import type { SynchronizeStatusAbAttr } from "#abilities/synchronize-status-ab-attr";
import type { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import type { UserFieldBattlerTagImmunityAbAttr } from "#abilities/user-field-battler-tag-immunity-ab-attr";
import type { UserFieldStatusEffectImmunityAbAttr } from "#abilities/user-field-status-effect-immunity-ab-attr";
import type { WeightMultiplierAbAttr } from "#abilities/weight-multiplier-ab-attr";
import type { AnySound } from "#app/audio-manager";
import { globalScene } from "#app/global-scene";
import { activeOverrides } from "#app/overrides";
import { timedEventManager } from "#app/timed-event-manager";
import type { IonDelugeTag } from "#arena-tags/ion-deluge-tag";
import type { WeakenMoveScreenTag } from "#arena-tags/weaken-move-screen-tag";
import { applyBattlerTags } from "#battler-tags/apply-battler-tags";
import type { AutotomizedTag } from "#battler-tags/autotomized-tag";
import { BattlerTag } from "#battler-tags/battler-tag";
import type { CritBoostStackableTag } from "#battler-tags/crit-boost-stackable-tag";
import type { DragonCheerTag } from "#battler-tags/dragon-cheer-tag";
import type { ExposedTag } from "#battler-tags/exposed-tag";
import { getBattlerTag } from "#battler-tags/get-battler-tag";
import type { HighestStatBoostTag } from "#battler-tags/highest-stat-boost-tag";
import type { ImprisoningTag } from "#battler-tags/imprisoning-tag";
import type { MoveRestrictionBattlerTag } from "#battler-tags/move-restriction-battler-tag";
import { PowerTrickTag } from "#battler-tags/power-trick-tag";
import type { RestrictingBattlerTag } from "#battler-tags/restricting-battler-tag";
import type { SubstituteTag } from "#battler-tags/substitute-tag";
import type { TypeImmuneTag } from "#battler-tags/type-immune-tag";
import type { UproarTag } from "#battler-tags/uproar-tag";
import { WEAKEN_MOVE_SCREEN_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import {
  CRIT_BOOST_BATTLER_TAG_TYPES,
  EXPOSED_TAG_TYPES,
  HIGHEST_STAT_BOOST_TAG_TYPES,
  RESTRICTING_TAG_TYPES,
  SEMI_INVULNERABLE_BATTLER_TAG_TYPES,
  TRAPPED_BATTLER_TAG_TYPES,
  TYPE_IMMUNE_TAG_TYPES,
} from "#constants/battler-tag-constants";
import {
  DEFAULT_MAX_SLEEP_DURATION,
  DEFAULT_MIN_SLEEP_DURATION,
  DYNAMAX_DAMAGE_TAKEN_FACTOR,
  IV_MAX,
  IV_MIN,
  MAX_STAT_STAGE,
  MIN_STAT_STAGE,
  NON_VOLATILE_STATUS_EFFECTS,
} from "#constants/game-constants";
import { allAbilities, allMoves } from "#data/data-lists";
import { speciesEggMoves } from "#data/egg-moves";
import { getLevelTotalExp } from "#data/exp";
import { getNatureStatMultiplier } from "#data/nature";
import { starterPassiveAbilities } from "#data/passives";
import type { SpeciesEvolutionCondition, SpeciesFormEvolution } from "#data/pokemon-evolutions";
import { type SpeciesFormChange, SpeciesFormChangeLapseTeraTrigger } from "#data/pokemon-forms";
import { EVOLVE_MOVE, type LevelMoves, RELEARN_MOVE } from "#data/pokemon-level-moves";
import { pokemonPreEvolutions } from "#data/pokemon-pre-evolutions";
import type { PokemonSpecies } from "#data/pokemon-species";
import type { PokemonSpeciesForm } from "#data/pokemon-species-form";
import { BASE_HIDDEN_ABILITY_CHANCE, BASE_SHINY_CHANCE, SHINY_EPIC_CHANCE, SHINY_VARIANT_CHANCE } from "#data/rates";
import { tmPoolTiers, tmSpecies } from "#data/tms";
import { getTypeDamageMultiplier, getTypeRgb, type TypeDamageMultiplier } from "#data/type";
import { type Variant, variantData } from "#data/variant";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { AbilityAttr } from "#enums/ability-attr";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex, type FieldBattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { BiomeId } from "#enums/biome-id";
import { ChallengeType } from "#enums/challenge-type";
import { DexAttr } from "#enums/dex-attr";
import { ElementalType } from "#enums/elemental-type";
import { EventModifierType } from "#enums/event-modifier-type";
import { FieldPosition } from "#enums/field-position";
import { Gender } from "#enums/gender";
import { HitResult } from "#enums/hit-result";
import { ModifierTier } from "#enums/modifier-tier";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import { Nature } from "#enums/nature";
import { PokeballType } from "#enums/pokeball-type";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { SpeciesId } from "#enums/species-id";
import {
  BATTLE_STATS,
  type BattleStat,
  type EffectiveStat,
  PERMANENT_STATS,
  type PermanentStat,
  Stat,
} from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import { PokemonMove } from "#field/pokemon-move";
import { SpeciesFormChangeActiveTrigger } from "#form-change-triggers/species-form-change-active-trigger";
import { SpeciesFormChangeMoveLearnedTrigger } from "#form-change-triggers/species-form-change-move-learned-trigger";
import { SpeciesFormChangePostMoveTrigger } from "#form-change-triggers/species-form-change-post-move-trigger";
import { SpeciesFormChangeStatusEffectTrigger } from "#form-change-triggers/species-form-change-status-effect-trigger";
import { initMoveAnim } from "#init/init-move-anim";
import { pokemonEvolutions } from "#init/init-pokemon-evolutions";
import {
  BaseStatModifier,
  HiddenAbilityRateBoosterModifier,
  PokemonBaseStatFlatModifier,
  PokemonBaseStatTotalModifier,
  type PokemonHeldItemModifier,
  PokemonIncrementingStatModifier,
  PokemonNatureWeightModifier,
  ShinyRateBoosterModifier,
  StatBoosterModifier,
  SurviveDamageModifier,
  TempCritBoosterModifier,
  TempStatStageBoosterModifier,
} from "#modifier/modifier";
import { BypassBurnDamageReductionAttr } from "#moves/bypass-burn-damage-reduction-attr";
import { CombinedPledgeStabBoostAttr } from "#moves/combined-pledge-stab-boost-attr";
import { CritOnlyAttr } from "#moves/crit-only-attr";
import { DoubleDamageToMaxAttr } from "#moves/double-damage-to-max-attr";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import { HighCritAttr } from "#moves/high-crit-attr";
import { HitsTagAttr } from "#moves/hits-tag-attr";
import { IgnoreOpponentStatStagesAttr } from "#moves/ignore-opponent-stat-stages-attr";
import { IgnoreWeatherTypeDebuffAttr } from "#moves/ignore-weather-type-debuff-attr";
import { ModifiedDamageAttr } from "#moves/modified-damage-attr";
import { getMoveTargets, type Move } from "#moves/move";
import { OneHitKOAccuracyAttr } from "#moves/one-hit-ko-accuracy-attr";
import { OneHitKOAttr } from "#moves/one-hit-ko-attr";
import { RechargeAttr } from "#moves/recharge-attr";
import { RespectAttackTypeImmunityAttr } from "#moves/respect-attack-type-immunity-attr";
import { SacrificialAttr } from "#moves/sacrificial-attr";
import { StatStageChangeAttr } from "#moves/stat-stage-change-attr";
import { TypelessAttr } from "#moves/typeless-attr";
import { VariableAtkAttr } from "#moves/variable-atk-attr";
import { VariableDefAttr } from "#moves/variable-def-attr";
import { VariableMoveCategoryAttr } from "#moves/variable-move-category-attr";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import { VariableMoveTypeChartAttr } from "#moves/variable-move-type-chart-attr";
import { VariableMoveTypeMultiplierAttr } from "#moves/variable-move-type-multiplier-attr";
import type { PokemonData } from "#system/pokemon-data";
import { settings } from "#system/settings-manager";
import type { AbilityFilterOptions } from "#types/ability-types";
import type { DamageCalculationResult, DamageResult, TurnMove } from "#types/move-types";
import type {
  CustomPokemonData,
  PokemonSummonData,
  PokemonTurnData,
  PokemonWaveData,
  Status,
} from "#types/pokemon-types";
import type { BattleInfo } from "#ui/battle-info";
import { playTween } from "#utils/anim-utils";
import { applyChallenges } from "#utils/challenge-utils";
import {
  BooleanHolder,
  calcAccuracyMultiplier,
  clamp,
  coerceArray,
  fixedNumber,
  getTSEnumValues,
  NumberHolder,
  toDmgValue,
  ValueHolder,
} from "#utils/common-utils";
import { loadMoveAnimAssets } from "#utils/move-anim-utils";
import { applyMoveAttrs } from "#utils/move-utils";
import { getPokemonSpecies, getPokemonSpeciesForm, summonDataToJSON } from "#utils/pokemon-utils";
import { randSeedInt } from "#utils/random-utils";
import i18next from "i18next";

interface AbilityData {
  ability: Ability;
  passive: boolean;
}

interface DamageFunctionOptions {
  result?: DamageResult;
  isCritical?: boolean;
  ignoreSegments?: boolean;
  preventEndure?: boolean;
  ignoreFaintPhase?: boolean;
  source?: Pokemon;
}

interface EffectiveStatOptions {
  /** The opposing {@linkcode Pokemon}, usually involved in an incoming or outgoing attack */
  opponent?: Pokemon;
  /** The {@linkcode Move} being used */
  move?: Move;
  /**
   * The {@linkcode AbilityApplyMode} determining how abilities are applied
   * @defaultValue {@linkcode AbilityApplyMode.DEFAULT}
   */
  abilityApplyMode?: AbilityApplyMode;
  /**
   * Whether a critical hit has occurred or not
   * @defaultValue `false`
   */
  isCritical?: boolean;
  /**
   * If `true`, nullifies any effects that produce any changes to game state from triggering
   * @defaultValue `true`
   */
  simulated?: boolean;
}

export abstract class Pokemon extends Phaser.GameObjects.Container {
  public readonly id: number;
  /**
   * A random number between `0` and `2^32 - 1`. Currently only used to determine shininess of the pokemon.
   * @see {@link https://bulbapedia.bulbagarden.net/wiki/Personality_value}
   */
  public personalityValue: number;
  public nickname: string;
  public species: PokemonSpecies;
  public formIndex: number;
  public abilityIndex: number;
  public passive: boolean;
  public shiny: boolean;
  public variant: Variant;
  public pokeball: PokeballType;
  protected battleInfo: BattleInfo;
  public level: number;
  public exp: number;
  public levelExp: number;
  public gender: Gender;
  public hp: number;
  public stats: number[];
  public ivs: number[];
  public nature: Nature;
  protected moveset: PokemonMove[];
  protected status: Status | null = null;
  public friendship: number;
  public metLevel: number;
  public metBiome: BiomeId | -1;
  public metSpecies: SpeciesId;
  public metWave: number;
  public pauseEvolutions: boolean;
  public pokerus: boolean;
  public switchOutStatus: boolean;
  public evoCounter: number;
  protected _teraType: ElementalType;
  public isTerastallized: boolean = false; // TODO: put this in battle (wave) data if arena reset behavior is changed
  public stellarTypesBoosted: ElementalType[] = []; // TODO: put this in battle (wave) data if arena reset behavior is changed

  /** @todo Remove this */
  private summonDataPrimer: PokemonSummonData | null;

  public summonData: PokemonSummonData;
  // Default data defined in `resetWaveData()`
  public waveData: PokemonWaveData;
  // Default data defined in `resetTurnData()`
  public turnData: PokemonTurnData;
  public customPokemonData: CustomPokemonData;

  /** Used by Mystery Encounters to execute pokemon-specific logic (such as stat boosts) at start of battle */
  public mysteryEncounterBattleEffects?: (pokemon: Pokemon) => void;

  public fieldPosition: FieldPosition;

  public maskEnabled: boolean;
  public maskSprite: Phaser.GameObjects.Sprite | null;

  public usedTMs: MoveId[];

  private shinySparkle: Phaser.GameObjects.Sprite;

  constructor(
    x: number,
    y: number,
    species: PokemonSpecies,
    level: number,
    abilityIndex?: number,
    formIndex?: number,
    gender?: Gender,
    shiny?: boolean,
    variant?: Variant,
    ivs?: number[],
    nature?: Nature,
    dataSource?: Pokemon | PokemonData,
  ) {
    super(globalScene, x, y);
    this.type = "Pokemon";

    this.species = species;
    // The `EnemyPokemon` constructor randomly picks from both types if applicable
    this.teraType = species.type1;
    this.pokeball = dataSource?.pokeball || PokeballType.POKEBALL;
    this.level = level;
    this.switchOutStatus = false;

    // Determine the ability index
    if (abilityIndex !== undefined) {
      this.abilityIndex = abilityIndex; // Use the provided ability index if it is defined
    } else {
      // If abilityIndex is not provided, determine it based on species and hidden ability
      this.generateRandomAbility();
    }
    if (formIndex !== undefined) {
      this.formIndex = formIndex;
    }
    if (gender !== undefined) {
      this.gender = gender;
    }
    if (shiny !== undefined) {
      this.shiny = shiny;
    }
    if (variant !== undefined) {
      this.variant = variant;
    }
    this.exp = dataSource?.exp || getLevelTotalExp(this.level, species.growthRate);
    this.levelExp = dataSource?.levelExp || 0;
    if (dataSource) {
      this.id = dataSource.id;
      globalScene.updateNextPokemonID(this.id);
      this.personalityValue = dataSource.personalityValue;
      this.hp = dataSource.hp;
      this.stats = dataSource.stats;
      this.ivs = dataSource.ivs;
      this.passive = dataSource.passive;
      if (this.variant === undefined) {
        this.variant = 0;
      }
      this.nature = dataSource.nature || (0 as Nature);
      this.nickname = dataSource.nickname;
      this.moveset = dataSource["moveset"];
      this.status = dataSource["status"];
      this.friendship = dataSource.friendship ?? this.species.baseFriendship;
      this.metLevel = dataSource.metLevel || 5;
      this.metBiome = dataSource.metBiome;
      this.metSpecies =
        dataSource.metSpecies ?? (this.metBiome !== -1 ? this.species.speciesId : this.species.getRootSpeciesId(true));
      this.metWave = dataSource.metWave ?? (this.metBiome === -1 ? -1 : 0);
      this.pauseEvolutions = dataSource.pauseEvolutions;
      this.pokerus = dataSource.pokerus;
      this.evoCounter = dataSource.evoCounter ?? 0;
      this.usedTMs = dataSource.usedTMs ?? [];
      this.resetCustomPokemonData(dataSource.customPokemonData);
      this.teraType = dataSource.teraType;
      this.isTerastallized = dataSource.isTerastallized;
      this.stellarTypesBoosted = dataSource.stellarTypesBoosted ?? [];
    } else {
      this.id = globalScene.getNextPokemonID();
      this.personalityValue = this.randSeedInt(Math.pow(2, 32) - 1);
      this.ivs = ivs || this.generateIvs();

      if (this.gender === undefined) {
        this.generateGender();
      }

      if (this.formIndex === undefined) {
        this.formIndex = globalScene.getSpeciesFormIndex(species, this.gender, this.nature, this.isPlayer());
      }

      if (this.shiny === undefined) {
        this.trySetShiny();
      }

      if (this.variant === undefined) {
        this.variant = this.shiny ? this.generateShinyVariant() : 0;
      }

      this.resetCustomPokemonData();

      if (nature !== undefined) {
        this.setNature(nature);
      } else {
        this.generateNature();
      }

      this.friendship = species.baseFriendship;
      this.metLevel = level;
      this.metBiome = globalScene.currentBattle ? globalScene.arena.biomeId : -1;
      this.metSpecies = species.speciesId;
      this.metWave = globalScene.currentBattle ? globalScene.currentBattle.waveIndex : -1;
      this.pokerus = false;
    }

    this.generateName();

    if (!dataSource) {
      this.calculateStats();
    }

    this.resetWaveData();
    this.resetTurnData();
    this.resetSummonData();
  }

  /**
   * The pokemon's Tera type. Some pokemon are locked to limited tera types:
   * - Terapagos is always Stellar
   * - Ogerpon is based on its form (Grass, Water, Fire, Rock)
   * - Shedinja is always Bug
   */
  public get teraType(): ElementalType {
    if (this.isPlayer() && activeOverrides.TERA_TYPE_OVERRIDE !== ElementalType.UNKNOWN) {
      return activeOverrides.TERA_TYPE_OVERRIDE;
    }
    if (this.isEnemy() && activeOverrides.ENEMY_TERA_TYPE_OVERRIDE !== ElementalType.UNKNOWN) {
      return activeOverrides.ENEMY_TERA_TYPE_OVERRIDE;
    }

    switch (this.species.speciesId) {
      case SpeciesId.TERAPAGOS:
        return ElementalType.STELLAR;

      case SpeciesId.OGERPON:
        switch (this.formIndex) {
          case 0:
          case 4:
            return ElementalType.GRASS;
          case 1:
          case 5:
            return ElementalType.WATER;
          case 2:
          case 6:
            return ElementalType.FIRE;
          case 3:
          case 7:
            return ElementalType.ROCK;
        }
        break;

      // Custom
      case SpeciesId.SHEDINJA:
        return ElementalType.BUG;
    }

    return this._teraType;
  }

  public set teraType(value: ElementalType) {
    this._teraType = value;
  }

  /**
   * Toxic damage is `1/16 max HP * toxicTurnCount`; increases by 1 per turn.
   * Ignored if the effect is not {@linkcode StatusEffect.TOXIC}
   * @defaultValue 0
   */
  public get toxicTurnCount(): number {
    return this.status?.toxicTurnCount ?? 0;
  }

  /**
   * The pokemon wakes up when this is `0` and the {@linkcode effect} is {@linkcode StatusEffect.SLEEP}.
   * Ignored if the effect is not sleep.
   * @defaultValue 0
   */
  public get sleepTurnsRemaining(): number {
    return this.status?.sleepTurnsRemaining ?? 0;
  }

  /**
   * De-Terastallizes the pokemon and updates the shaders.
   * Also changes Ogerpon back into its non-Tera form.
   */
  public resetTera(): void {
    const wasTerastallized = this.isTerastallized;
    this.isTerastallized = false;
    this.stellarTypesBoosted = [];
    if (wasTerastallized) {
      this.updateSpritePipelineData();
      globalScene.triggerPokemonFormChange(this, SpeciesFormChangeLapseTeraTrigger);
    }
  }

  /** @returns An array of 6 random numbers, each between `0-31` inclusive */
  public generateIvs(): number[] {
    const ivs: number[] = [];
    for (let i = 0; i < 6; i++) {
      ivs.push(this.randSeedIntRange(IV_MIN, IV_MAX));
    }
    return ivs;
  }

  /**
   * Sets this Pokemon to have a random ability, including a small chance of generating its Hidden Ability.
   */
  generateRandomAbility(): void {
    const hiddenAbilityChance = new NumberHolder(BASE_HIDDEN_ABILITY_CHANCE);
    if (!this.hasTrainer()) {
      globalScene.applyModifiers(HiddenAbilityRateBoosterModifier, true, hiddenAbilityChance);
    }

    const hasHiddenAbility = !randSeedInt(hiddenAbilityChance.value);
    const randAbilityIndex = randSeedInt(2);
    if (this.species.abilityHidden && hasHiddenAbility) {
      // If the species has a hidden ability and the hidden ability is present
      this.abilityIndex = 2;
    } else {
      // If there is no hidden ability or species does not have a hidden ability
      this.abilityIndex = this.species.ability2 !== this.species.ability1 ? randAbilityIndex : 0; // Use random ability index if species has a second ability, otherwise use 0
    }
  }

  getNameToRender() {
    try {
      if (this.nickname) {
        return decodeURIComponent(escape(atob(this.nickname)));
      }
      return this.name;
    } catch (err) {
      console.error(`Failed to decode nickname for ${this.name}`, err);
      return this.name;
    }
  }

  init(): void {
    this.fieldPosition = FieldPosition.CENTER;

    this.initBattleInfo();

    globalScene.fieldUI.addAt(this.battleInfo, 0);

    const getSprite = (hasShadow: boolean = false) => {
      const ret = globalScene.addPokemonSprite(
        this,
        0,
        0,
        `pkmn__${this.isPlayer() ? "back__" : ""}sub`,
        undefined,
        true,
      );
      ret.setOrigin(0.5, 1);
      ret.setPipeline(globalScene.spritePipeline, {
        tone: [0.0, 0.0, 0.0, 0.0],
        hasShadow,
        teraColor: getTypeRgb(this.teraType),
        isTerastallized: this.isTerastallized,
      });
      return ret;
    };

    this.setScale(this.getSpriteScale());

    const sprite = getSprite(true);
    const tintSprite = getSprite();

    tintSprite.setVisible(false);

    this.addAt(sprite, 0);
    this.addAt(tintSprite, 1);

    if (this.isShiny() && !this.shinySparkle) {
      this.initShinySparkle();
    }
  }

  abstract initBattleInfo(): void;

  isOnField(): boolean {
    if (!globalScene) {
      return false;
    }
    if (this.switchOutStatus) {
      return false;
    }
    return globalScene.field.getIndex(this) > -1;
  }

  /**
   * Checks if a pokemon is fainted (ie: its `hp <= 0`).
   * It's usually better to call {@linkcode isAllowedInBattle()}
   * @returns `true` if the pokemon is fainted
   */
  public isFainted(): boolean {
    return this.hp <= 0;
  }

  /**
   * Faints the pokemon.
   * @todo Handle all fainting-related side-effects here
   */
  public faint(): void {
    this.hp = 0;
    this.resetStatus(true);
    this.resetTera();
  }

  /**
   * Check if this pokemon is both not fainted and allowed to be in battle based on currently active challenges.
   * @returns `true` if pokemon is allowed in battle
   */
  public isAllowedInBattle(): boolean {
    return !this.isFainted() && this.isAllowedInChallenge();
  }

  /**
   * Check if this pokemon is allowed based on any active challenges.
   * It's usually better to call {@linkcode isAllowedInBattle()}
   * @returns `true` if pokemon is allowed in battle
   */
  public isAllowedInChallenge(): boolean {
    const challengeAllowed = new BooleanHolder(true);
    applyChallenges(globalScene.gameMode, ChallengeType.POKEMON_IN_BATTLE, this, challengeAllowed);
    return challengeAllowed.value;
  }

  /**
   * Checks if the pokemon is allowed in battle (ie: not fainted, and allowed under any active challenges).
   * @param onField `true` to also check if the pokemon is currently on the field, defaults to `false`
   * @returns `true` if the pokemon is "active". Returns `false` if there is no active {@linkcode BattleScene}
   */
  public isActive(onField: boolean = false): boolean {
    if (!globalScene) {
      return false;
    }
    return this.isAllowedInBattle() && (!onField || this.isOnField());
  }

  /**
   * @returns {@linkcode DexAttr}s with flags corresponding to the Pokemon's gender, shiny variant and form.
   */
  public getDexAttr(): bigint {
    let ret = 0n;
    if (this.gender === Gender.FEMALE) {
      ret |= DexAttr.FEMALE;
    } else if (this.gender === Gender.MALE) {
      ret |= DexAttr.MALE;
    }
    if (!this.shiny) {
      ret |= DexAttr.NON_SHINY;
    } else if (this.variant >= 2) {
      ret |= DexAttr.SHINY_EPIC_VARIANT;
    } else if (this.variant === 1) {
      ret |= DexAttr.SHINY_RARE_VARIANT;
    } else {
      ret |= DexAttr.SHINY_BASE_VARIANT;
    }
    ret |= globalScene.gameData.getFormAttr(this.getSelectableFormIndex());
    return ret;
  }

  /**
   * Get the form index of this Pokemon that is selectable as a starter, if different from the current one.
   *
   * Forms that are not selectable as starters (like Megas, battle specific transformation, or item only transformations)
   * get ignored in the Pokemon's dex attribute. They are to be considered as seen/caught as soon as a corresponding,
   * starter selectable, "base" form is seen/caught. This function returns said starter selectable form index,
   * rather than the current form index and should only be used when manipulating dex data.
   *
   * If the current form is starter selectable, returns `this.formIndex`. If not, looks for a Pokemon with the current form's
   * `baseFormKey` attribute. Defaults to form index 0 if it can't find one.
   *
   * @example for transformed ash Greninja this will return the form index of the non transformed battle bond Greninja.
   *
   * @returns the form index of the starter selectable form corresponding to the current one. Defaults to 0
   */
  public getSelectableFormIndex() {
    const speciesForm = this.getSpeciesForm();
    if (!speciesForm.isStarterSelectable && speciesForm.isPokemonForm()) {
      if (speciesForm.baseFormKey) {
        const baseFormIndex = this.species.forms.findIndex((form) => form.formKey === speciesForm.baseFormKey);
        return baseFormIndex !== -1 ? baseFormIndex : 0;
      }
      return 0;
    }
    return this.formIndex;
  }

  /**
   * Sets the Pokemon's name. Only called when loading a Pokemon so this function needs to be called when
   * initializing hardcoded Pokemon or else it will not display the form index name properly.
   */
  generateName(): void {
    this.name = this.species.getName(this.formIndex);
  }

  abstract isPlayer(): this is PlayerPokemon;

  abstract isEnemy(): this is EnemyPokemon;

  abstract hasTrainer(): boolean;

  abstract getFieldIndex(): number;

  abstract getBattlerIndex(): FieldBattlerIndex;

  loadAssets(bypassSummonData: boolean = true): Promise<void> {
    return new Promise((resolve) => {
      const moveIds = this.getMoveset().map((m) => m.getMove().id);
      Promise.allSettled(moveIds.map((m) => initMoveAnim(m))).then(() => {
        loadMoveAnimAssets(moveIds);
        this.getSpeciesForm().loadAssets(this.getGender() === Gender.FEMALE, this.formIndex, this.shiny, this.variant);
        if (this.isPlayer()) {
          globalScene.loadPokemonAtlas(
            this.getBattleSpriteKey(true, bypassSummonData),
            this.getBattleSpriteAtlasPath(true, bypassSummonData),
          );
        }
        globalScene.load.once(Phaser.Loader.Events.COMPLETE, () => {
          if (this.isPlayer()) {
            const originalWarn = console.warn;
            // Ignore warnings for missing frames, because there will be a lot
            console.warn = () => {};
            const battleFrameNames = globalScene.anims.generateFrameNames(this.getBattleSpriteKey(), {
              zeroPad: 4,
              suffix: ".png",
              start: 1,
              end: 400,
            });
            console.warn = originalWarn;
            if (!globalScene.anims.exists(this.getBattleSpriteKey())) {
              globalScene.anims.create({
                key: this.getBattleSpriteKey(),
                frames: battleFrameNames,
                frameRate: 10,
                repeat: -1,
              });
            }
          }
          this.playAnim();
          resolve();
        });
        if (!globalScene.load.isLoading()) {
          globalScene.load.start();
        }
      });
    });
  }

  getFormAmount(): number {
    return this.species.forms.length;
  }

  getFormKey(): string {
    if (!this.species.forms.length || this.species.forms.length <= this.formIndex) {
      return "";
    }
    return this.species.forms[this.formIndex].formKey;
  }

  getSpriteAtlasPath(bypassSummonData?: boolean): string {
    const spriteId = this.getSpriteId(bypassSummonData).replace(/_{2}/g, "/");
    return `${/_[1-3]$/.test(spriteId) ? "variant/" : ""}${spriteId}`;
  }

  getBattleSpriteAtlasPath(back?: boolean, bypassSummonData?: boolean): string {
    const spriteId = this.getBattleSpriteId(back, bypassSummonData).replace(/_{2}/g, "/");
    return `${/_[1-3]$/.test(spriteId) ? "variant/" : ""}${spriteId}`;
  }

  getSpriteId(bypassSummonData?: boolean): string {
    return this.getSpeciesForm(bypassSummonData).getSpriteId(
      this.getGender(bypassSummonData) === Gender.FEMALE,
      this.formIndex,
      this.shiny,
      this.variant,
    );
  }

  getBattleSpriteId(back?: boolean, bypassSummonData?: boolean): string {
    if (back === undefined) {
      back = this.isPlayer();
    }
    return this.getSpeciesForm(bypassSummonData).getSpriteId(
      this.getGender(bypassSummonData) === Gender.FEMALE,
      this.formIndex,
      this.shiny,
      this.variant,
      back,
    );
  }

  getSpriteKey(bypassSummonData?: boolean): string {
    return this.getSpeciesForm(bypassSummonData).getSpriteKey(
      this.getGender(bypassSummonData) === Gender.FEMALE,
      this.formIndex,
      this.shiny,
      this.variant,
    );
  }

  getBattleSpriteKey(back?: boolean, bypassSummonData?: boolean): string {
    return `pkmn__${this.getBattleSpriteId(back, bypassSummonData)}`;
  }

  getIconAtlasKey(bypassSummonData?: boolean): string {
    return this.getSpeciesForm(bypassSummonData).getIconAtlasKey(this.formIndex, this.shiny, this.variant);
  }

  getIconId(bypassSummonData?: boolean): string {
    return this.getSpeciesForm(bypassSummonData).getIconId(
      this.getGender(bypassSummonData) === Gender.FEMALE,
      this.formIndex,
      this.shiny,
      this.variant,
    );
  }

  getSpeciesForm(bypassSummonData: boolean = false): PokemonSpeciesForm {
    if (!bypassSummonData && this.summonData.speciesForm) {
      return this.summonData.speciesForm;
    }
    if (this.species.forms && this.species.forms.length > 0) {
      return this.species.forms[this.formIndex];
    }

    return this.species;
  }

  getSprite(): Phaser.GameObjects.Sprite {
    return this.getAt(0) as Phaser.GameObjects.Sprite;
  }

  getTintSprite(): Phaser.GameObjects.Sprite | null {
    return this.maskEnabled ? this.maskSprite : (this.getAt(1) as Phaser.GameObjects.Sprite);
  }

  getSpriteScale(): number {
    const formKey = this.getFormKey();
    if (
      this.isMax() === true
      || formKey === "segin-starmobile"
      || formKey === "schedar-starmobile"
      || formKey === "navi-starmobile"
      || formKey === "ruchbah-starmobile"
      || formKey === "caph-starmobile"
    ) {
      return 1.5;
    }
    if (this.customPokemonData.spriteScale > 0) {
      return this.customPokemonData.spriteScale;
    }
    return 1;
  }

  /** Resets the pokemon's field sprite properties, including position, alpha, and scale */
  resetSprite(): void {
    // Resetting properties should not be shown on the field
    this.setVisible(false);

    // Remove the offset from having a Substitute active
    if (this.isOffsetBySubstitute()) {
      this.x -= this.getSubstituteOffset()[0];
      this.y -= this.getSubstituteOffset()[1];
    }

    // Reset sprite display properties
    this.setAlpha(1);
    this.setScale(this.getSpriteScale());
  }

  getHeldItems(): PokemonHeldItemModifier[] {
    if (!globalScene) {
      return [];
    }
    return globalScene.findModifiers(
      (m) => m.isPokemonHeldItemModifier() && m.pokemonId === this.id,
      this.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }

  updateScale(): void {
    this.setScale(this.getSpriteScale());
  }

  updateSpritePipelineData(): void {
    [this.getSprite(), this.getTintSprite()]
      .filter((s) => !!s)
      .map((s) => {
        s.pipelineData["teraColor"] = getTypeRgb(this.teraType);
        s.pipelineData["isTerastallized"] = this.isTerastallized;
      });
    this.updateInfo(true);
  }

  initShinySparkle(): void {
    const shinySparkle = globalScene.addFieldSprite(0, 0, "shiny");
    shinySparkle.setVisible(false);
    shinySparkle.setOrigin(0.5, 1);
    this.add(shinySparkle);

    this.shinySparkle = shinySparkle;
  }

  /**
   * Attempts to animate a given {@linkcode Phaser.GameObjects.Sprite}
   * @see {@linkcode Phaser.GameObjects.Sprite.play}
   * @param sprite - {@linkcode Phaser.GameObjects.Sprite} to animate
   * @param tintSprite - {@linkcode Phaser.GameObjects.Sprite} placed on top of the sprite to add a color tint
   * @param key - animation key to pass to {@linkcode Phaser.GameObjects.Sprite.play}
   */
  playSprite(sprite: Phaser.GameObjects.Sprite, tintSprite: Phaser.GameObjects.Sprite | null, key: string): void {
    sprite.play(key);
    tintSprite?.play(key);
  }

  playAnim(): void {
    this.playSprite(this.getSprite(), this.getTintSprite(), this.getBattleSpriteKey());
  }

  getFieldPositionOffset(): [number, number] {
    switch (this.fieldPosition) {
      case FieldPosition.CENTER:
        return [0, 0];
      case FieldPosition.LEFT:
        return [-32, -8];
      case FieldPosition.RIGHT:
        return [32, 0];
    }
  }

  /**
   * Returns the Pokemon's offset from its current field position in the event that
   * it has a Substitute doll in effect. The offset is returned in `[ x, y ]` format.
   * @see {@linkcode SubstituteTag}
   * @see {@linkcode getFieldPositionOffset}
   */
  getSubstituteOffset(): [number, number] {
    return this.isPlayer() ? [-30, 10] : [30, -10];
  }

  /**
   * Returns whether or not the Pokemon's position on the field is offset because
   * the Pokemon has a Substitute active.
   * @see {@linkcode SubstituteTag}
   */
  isOffsetBySubstitute(): boolean {
    const substitute = this.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);
    if (substitute) {
      if (substitute.sprite === undefined) {
        return false;
      }

      // During the Pokemon's MoveEffect phase, the offset is removed to put the Pokemon "in focus"
      const currentPhase = globalScene.phaseManager.getCurrentPhase();
      if (currentPhase?.is("MoveEffectPhase") && currentPhase.getPokemon() === this) {
        return false;
      }
      return true;
    }
    return false;
  }

  /** If this Pokemon has a Substitute on the field, removes its sprite from the field. */
  destroySubstitute(): void {
    const substitute = this.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);
    if (substitute?.sprite) {
      substitute.sprite.destroy();
    }
  }

  public async setFieldPosition(fieldPosition: FieldPosition, duration: number = 0): Promise<void> {
    if (fieldPosition === this.fieldPosition) {
      return;
    }

    const initialOffset = this.getFieldPositionOffset();

    this.fieldPosition = fieldPosition;

    this.battleInfo.setMini(fieldPosition !== FieldPosition.CENTER);
    this.battleInfo.setOffset(fieldPosition === FieldPosition.RIGHT);

    const newOffset = this.getFieldPositionOffset();

    const relX = newOffset[0] - initialOffset[0];
    const relY = newOffset[1] - initialOffset[1];

    const subTag = this.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);

    if (duration > 0) {
      // TODO: can this use stricter typing?
      const targets: any[] = [this];
      if (subTag?.sprite) {
        targets.push(subTag.sprite);
      }
      await playTween({
        targets,
        x: (_target, _key, value: number) => value + relX,
        y: (_target, _key, value: number) => value + relY,
        duration,
        ease: "Sine.easeOut",
      });
    } else {
      this.x += relX;
      this.y += relY;
      if (subTag?.sprite) {
        subTag.sprite.x += relX;
        subTag.sprite.y += relY;
      }
    }
  }

  /**
   * Retrieves the corresponding {@linkcode PermanentStat} of the {@linkcode Pokemon}.
   * @param stat the desired {@linkcode PermanentStat}
   * @param bypassSummonData prefer actual stats (`true` by default) or in-battle overridden stats (`false`)
   * @returns the numeric value of the desired {@linkcode Stat}
   */
  getStat(stat: PermanentStat, bypassSummonData: boolean = true): number {
    if (!bypassSummonData && this.summonData.stats[stat] !== 0) {
      return this.summonData.stats[stat];
    }
    return this.stats[stat];
  }

  /**
   * Writes the value to the corrseponding {@linkcode PermanentStat} of the {@linkcode Pokemon}.
   *
   * Note that this does nothing if {@linkcode value} is less than 0.
   * @param stat the desired {@linkcode PermanentStat} to be overwritten
   * @param value the desired numeric value
   * @param bypassSummonData write to actual stats (`true` by default) or in-battle overridden stats (`false`)
   */
  setStat(stat: PermanentStat, value: number, bypassSummonData: boolean = true): void {
    if (value >= 0) {
      if (bypassSummonData) {
        this.stats[stat] = value;
      } else {
        this.summonData.stats[stat] = value;
      }
    }
  }

  /**
   * Retrieves the entire set of in-battle stat stages of the {@linkcode Pokemon}.
   * @returns the numeric values of the {@linkcode Pokemon}'s in-battle stat stages if available, a fresh stat stage array otherwise
   */
  getStatStages(): number[] {
    return this.summonData.statStages;
  }

  /**
   * Retrieves the in-battle stage of the specified {@linkcode BattleStat}.
   * @param stat the {@linkcode BattleStat} whose stage is desired
   * @returns the stage of the desired {@linkcode BattleStat} if available, 0 otherwise
   */
  getStatStage(stat: BattleStat): number {
    return this.summonData.statStages[stat - 1];
  }

  /**
   * Writes the value to the in-battle stage of the corresponding {@linkcode BattleStat} of the {@linkcode Pokemon}.
   *
   * Note that, if the value is not within a range of [-6, 6], it will be forced to the closest range bound.
   * @param stat the {@linkcode BattleStat} whose stage is to be overwritten
   * @param value the desired numeric value
   */
  setStatStage(stat: BattleStat, value: number): void {
    this.summonData.statStages[stat - 1] = clamp(value, MIN_STAT_STAGE, MAX_STAT_STAGE);
  }

  /**
   * Retrieves the critical-hit stage considering the move used and the Pokemon
   * who used it.
   * @param source the {@linkcode Pokemon} who using the move
   * @param move the {@linkcode Move} being used
   * @param simulated if `true`, obtains the critical-hit stage quietly
   * @returns the final critical-hit stage value
   */
  getCritStage(source: Pokemon, move: Move, simulated: boolean = true): number {
    const critStage = new NumberHolder(0);
    applyMoveAttrs(HighCritAttr, source, this, move, critStage);
    // TODO: Scope Lens and Leek were applied here
    globalScene.applyModifiers(TempCritBoosterModifier, source.isPlayer(), critStage);

    // Applies the effects of the ability 'Super Luck' here
    applyAbAttrs<BonusCritAbAttr>(AbAttrFlag.BONUS_CRIT, source, simulated, critStage);

    const critBoostTag = source.getTag(...CRIT_BOOST_BATTLER_TAG_TYPES);
    if (critBoostTag) {
      if (critBoostTag.isType<DragonCheerTag>(BattlerTagType.DRAGON_CHEER)) {
        critStage.value += critBoostTag.typesOnAdd.includes(ElementalType.DRAGON) ? 2 : 1;
      } else {
        critStage.value += 2;
      }
    }

    const critBoostStackableTag = source.getTag<CritBoostStackableTag>(BattlerTagType.CRIT_BOOST_STACKABLE);
    if (critBoostStackableTag) {
      critStage.value += critBoostStackableTag.stackCount;
    }

    console.log(`crit stage: +${critStage.value}`);
    return critStage.value;
  }

  getStageMultipliedStat(
    stat: EffectiveStat,
    opponent?: Pokemon,
    move?: Move,
    abilityApplyMode: AbilityApplyMode = AbilityApplyMode.DEFAULT,
    isCritical: boolean = false,
    simulated: boolean = true,
  ): number {
    return (
      this.getStat(stat, false)
      * this.getStatStageMultiplier(stat, opponent, move, abilityApplyMode, isCritical, simulated)
    );
  }

  /**
   * Calculates and retrieves the final value of a stat considering any held items,
   * move effects, opponent abilities, and whether there was a critical hit.
   * @param stat - The desired {@linkcode EffectiveStat}
   * @see {@linkcode EffectiveStatOptions} for optional params
   * @returns The final in-battle value of a stat
   */
  getEffectiveStat(
    stat: EffectiveStat,
    {
      opponent,
      move,
      abilityApplyMode = AbilityApplyMode.DEFAULT,
      isCritical = false,
      simulated = true,
    }: EffectiveStatOptions = {},
  ): number {
    const applyAbFunc = getAbApplyFunc(abilityApplyMode);

    const statValue = new NumberHolder(-1);

    /*
     * Variable Attack attributes are applied only to the raw stat
     * value and associated stat stage multiplier. Other stat modifiers,
     * e.g. items and abilities, apply based on the original stat.
     * See https://bulbapedia.bulbagarden.net/wiki/Body_Press_(move)#Effect for more info
     */
    if (move && opponent && [Stat.ATK, Stat.SPATK].includes(stat)) {
      applyMoveAttrs(VariableAtkAttr, this, opponent, move, statValue, isCritical);
    }

    if (statValue.value === -1) {
      statValue.value = this.getStageMultipliedStat(stat, opponent, move, abilityApplyMode, isCritical, simulated);
    }

    globalScene.applyModifiers(StatBoosterModifier, this.isPlayer(), this, stat, statValue);

    const fieldApplied = new BooleanHolder(false);
    for (const pokemon of globalScene.getField(true)) {
      applyAbFunc<FieldMultiplyStatAbAttr>(
        AbAttrFlag.FIELD_MULTIPLY_STAT,
        pokemon,
        simulated,
        stat,
        statValue,
        this,
        fieldApplied,
      );
      if (fieldApplied.value) {
        break;
      }
    }

    applyAbFunc<StatMultiplierAbAttr>(AbAttrFlag.STAT_MULTIPLIER, this, simulated, stat, statValue, move, opponent);

    let ret = statValue.value;

    const { arena } = globalScene;
    switch (stat) {
      case Stat.ATK:
        if (this.hasTag(BattlerTagType.SLOW_START)) {
          ret >>= 1;
        }
        break;
      case Stat.DEF:
        if (this.isOfType(ElementalType.ICE) && arena.hasWeather(WeatherType.SNOW)) {
          ret *= 1.5;
        }
        break;
      case Stat.SPATK:
        break;
      case Stat.SPDEF:
        if (this.isOfType(ElementalType.ROCK) && arena.hasWeather(WeatherType.SANDSTORM)) {
          ret *= 1.5;
        }
        break;
      case Stat.SPD: {
        const side = this.getArenaTagSide();
        if (arena.hasTag(ArenaTagType.TAILWIND, side)) {
          ret *= 2;
        }
        if (arena.hasTag(ArenaTagType.GRASS_WATER_PLEDGE, side)) {
          ret >>= 2;
        }

        if (this.hasTag(BattlerTagType.SLOW_START)) {
          ret >>= 1;
        }
        if (this.hasStatusEffect(StatusEffect.PARALYSIS)) {
          const paraSpeedReductionCancelled = new BooleanHolder(false);
          applyAbFunc<BypassParaSpeedReductionAbAttr>(
            AbAttrFlag.BYPASS_PARA_SPEED_REDUCTION,
            this,
            simulated,
            paraSpeedReductionCancelled,
          );
          if (!paraSpeedReductionCancelled.value) {
            ret >>= 1;
          }
        }
        if (this.hasTag(BattlerTagType.UNBURDEN) && this.hasAbility(AbilityId.UNBURDEN)) {
          ret *= 2;
        }
        break;
      }
    }

    const highestStatBoost = this.findTag<HighestStatBoostTag>(
      (t) => t.isType<HighestStatBoostTag>(...HIGHEST_STAT_BOOST_TAG_TYPES) && t.stat === stat,
    );
    if (highestStatBoost) {
      ret *= highestStatBoost.multiplier;
    }

    return Math.floor(ret);
  }

  calculateStats(): void {
    if (!this.stats) {
      this.stats = [0, 0, 0, 0, 0, 0];
    }

    // Get and manipulate base stats
    const baseStats = this.calculateBaseStats();
    // Using base stats, calculate and store stats one by one
    for (const s of PERMANENT_STATS) {
      const statHolder = new NumberHolder(Math.floor((2 * baseStats[s] + this.ivs[s]) * this.level * 0.01));
      if (s === Stat.HP) {
        statHolder.value = statHolder.value + this.level + 10;
        globalScene.applyModifier(PokemonIncrementingStatModifier, this.isPlayer(), this, s, statHolder);
        if (this.hasAbility(AbilityId.WONDER_GUARD, false, true)) {
          statHolder.value = 1;
        }
        if (this.hp > statHolder.value || this.hp === undefined) {
          this.hp = statHolder.value;
        } else if (this.hp) {
          const lastMaxHp = this.getMaxHp();
          if (lastMaxHp && statHolder.value > lastMaxHp) {
            this.hp += statHolder.value - lastMaxHp;
          }
        }
      } else {
        statHolder.value += 5;
        const natureStatMultiplier = new NumberHolder(getNatureStatMultiplier(this.getNature(), s));
        globalScene.applyModifier(PokemonNatureWeightModifier, this.isPlayer(), this, natureStatMultiplier);
        if (natureStatMultiplier.value !== 1) {
          statHolder.value = Math.max(
            Math[natureStatMultiplier.value > 1 ? "ceil" : "floor"](statHolder.value * natureStatMultiplier.value),
            1,
          );
        }
        globalScene.applyModifier(PokemonIncrementingStatModifier, this.isPlayer(), this, s, statHolder);
      }

      statHolder.value = clamp(statHolder.value, 1, Number.MAX_SAFE_INTEGER);

      this.setStat(s, statHolder.value);
    }
  }

  calculateBaseStats(): number[] {
    const baseStats = this.getSpeciesForm(true).baseStats.slice(0);
    // Shuckle Juice
    globalScene.applyModifiers(PokemonBaseStatTotalModifier, this.isPlayer(), this, baseStats);
    // Old Gateau
    globalScene.applyModifiers(PokemonBaseStatFlatModifier, this.isPlayer(), this, baseStats);
    // Vitamins
    globalScene.applyModifiers(BaseStatModifier, this.isPlayer(), this, baseStats);

    return baseStats;
  }

  getNature(): Nature {
    return this.customPokemonData.nature !== -1 ? this.customPokemonData.nature : this.nature;
  }

  setNature(nature: Nature): void {
    this.nature = nature;
    this.calculateStats();
  }

  setCustomNature(nature: Nature): void {
    this.customPokemonData.nature = nature;
    this.calculateStats();
  }

  generateNature(naturePool?: Nature[]): void {
    if (naturePool === undefined) {
      naturePool = getTSEnumValues(Nature);
    }
    const nature = naturePool[randSeedInt(naturePool.length)];
    this.setNature(nature);
  }

  isFullHp(): boolean {
    return this.hp >= this.getMaxHp();
  }

  getMaxHp(): number {
    return this.getStat(Stat.HP);
  }

  getInverseHp(): number {
    return this.getMaxHp() - this.hp;
  }

  /**
   * Helper function that returns a Pokemon's unrounded HP ratio
   * @returns the Pokemon's current HP divided by its max HP
   */
  getHpRatio(): number {
    return this.hp / this.getMaxHp();
  }

  generateGender(): void {
    if (this.species.malePercent === null) {
      this.gender = Gender.GENDERLESS;
    } else {
      const genderChance = (this.id % 256) * 0.390625;
      if (genderChance < this.species.malePercent) {
        this.gender = Gender.MALE;
      } else {
        this.gender = Gender.FEMALE;
      }
    }
  }

  getGender(bypassSummonData: boolean = false): Gender {
    if (!bypassSummonData && this.summonData.gender != null) {
      return this.summonData.gender;
    }
    return this.gender;
  }

  // TODO: replace with getters
  isShiny(): boolean {
    return this.shiny;
  }

  getVariant(): Variant {
    return this.variant;
  }

  abstract isBoss(): boolean;

  abstract getBossSegments(): number;

  abstract getBossSegmentIndex(): number;

  /**
   * @param bypassSummonData - (Default `true`) Whether to get the Pokemon's actual/unmodified moveset (`true`)
   *   or the Pokemon's temporary/modified moveset (such as due to Transform) (`false`).
   * @returns The Pokemon's active moveset
   */
  public getMoveset(bypassSummonData: boolean = false): readonly PokemonMove[] {
    const ret = !bypassSummonData && this.summonData.moveset.length > 0 ? this.summonData.moveset : this.moveset;

    // Overrides moveset based on arrays specified in overrides.ts
    let overrideArray: MoveId | MoveId[] = this.isPlayer()
      ? activeOverrides.MOVESET_OVERRIDE
      : activeOverrides.ENEMY_MOVESET_OVERRIDE;

    overrideArray = coerceArray(overrideArray);
    if (overrideArray.length === 0) {
      return ret;
    }
    if (this.isEnemy()) {
      this.moveset = [];
    }
    overrideArray.forEach((moveId: MoveId, index: number) => {
      const ppUsed = this.moveset[index]?.ppUsed ?? 0;
      this.moveset[index] = new PokemonMove(moveId, {
        pokemonId: this.id,
        ppUsed: Math.min(ppUsed, allMoves.get(moveId).pp),
      });
    });
    return this.moveset;
  }

  /**
   * Sets the move in the specified move slot to the specified move. Does nothing if `moveId` is `MoveId.NONE`.
   * @param moveIndex - Which move slot to set
   * @param moveId - The move to set the slot to
   * @todo Should it remove the move from the moveset if `moveId` is `MoveId.NONE` instead of doing nothing?
   */
  public setMove(moveIndex: number, moveId: MoveId): void {
    if (moveId === MoveId.NONE) {
      return;
    }
    const move = new PokemonMove(moveId, { pokemonId: this.id });
    this.moveset[moveIndex] = move;
  }

  /** Overwrites the pokemon's moveset to the specified set of moves, deleting the old moveset. */
  public setMoveset(...moves: MoveId[]): void {
    this.moveset = [];
    if (moves.length === 0) {
      return;
    }
    for (const move of moves) {
      this.moveset.push(new PokemonMove(move, { pokemonId: this.id }));
    }
  }

  /** Swaps 2 moves in the pokemon's moveset. Does nothing if one of the slots is empty. */
  public swapMoves(firstIndex: number, secondIndex: number): void {
    if (!this.moveset[firstIndex] || !this.moveset[secondIndex]) {
      return;
    }
    [this.moveset[firstIndex], this.moveset[secondIndex]] = [this.moveset[secondIndex], this.moveset[firstIndex]];
  }

  /** Resets the used PP of all moves in the pokemon's moveset to 0 */
  public restoreMovePP(): void {
    for (const move of this.moveset) {
      move.ppUsed = 0;
    }
  }

  /**
   * Obtains the {@linkcode PokemonMove} matching the given {@linkcode MoveId} in this Pokemon's moveset.
   * @param moveId - The {@linkcode MoveId} to search for
   * @param bypassSummonData - If `true`, ignores any temporary moveset overrides.
   * @returns The matching {@linkcode PokemonMove}, or `undefined` if no matching move is found.
   */
  public getPokemonMove(moveId: MoveId, bypassSummonData: boolean = false): PokemonMove | undefined {
    return this.getMoveset(bypassSummonData).find((mv) => mv.moveId === moveId);
  }

  /**
   * Checks which egg moves have been unlocked for the {@linkcode Pokemon} based
   * on the species it was met at or by the first {@linkcode Pokemon} in its evolution
   * line that can act as a starter and provides those egg moves.
   * @returns an array of {@linkcode MoveId}, the length of which is determined by how many
   * egg moves are unlocked for that species.
   */
  getUnlockedEggMoves(): MoveId[] {
    const moves: MoveId[] = [];
    const species =
      this.metSpecies in speciesEggMoves ? this.metSpecies : this.getSpeciesForm(true).getRootSpeciesId(true);
    if (species in speciesEggMoves) {
      for (let i = 0; i < 4; i++) {
        if (globalScene.gameData.starterData[species].eggMoves & (1 << i)) {
          moves.push(speciesEggMoves[species][i]);
        }
      }
    }
    return moves;
  }

  /**
   * Gets all possible learnable level moves for the {@linkcode Pokemon},
   * excluding any moves already known.
   *
   * Available egg moves are only included if the {@linkcode Pokemon} was
   * in the starting party of the run and if Fresh Start is not active.
   * @returns an array of {@linkcode MoveId}, the length of which is determined
   * by how many learnable moves there are for the {@linkcode Pokemon}.
   */
  public getLearnableLevelMoves(): MoveId[] {
    let levelMoves = this.getLevelMoves(1, true, false, true).map((lm) => lm[1]);
    if (this.metBiome === -1 && !globalScene.gameMode.isFreshStartChallenge() && !globalScene.gameMode.isDaily) {
      levelMoves = this.getUnlockedEggMoves().concat(levelMoves);
    }
    if (Array.isArray(this.usedTMs) && this.usedTMs.length > 0) {
      levelMoves = this.usedTMs.filter((m) => !levelMoves.includes(m)).concat(levelMoves);
    }
    levelMoves = levelMoves.filter((lm) => !this.moveset.some((m) => m.moveId === lm));
    return levelMoves;
  }

  /**
   * Gets the types of a pokemon
   * @param includeTeraType - `true` to include tera-formed type; Default: `false`
   * @param forDefend - `true` if the pokemon is defending from an attack; Default: `false`
   * @param bypassSummonData - If `true`, ignore ability changing effects; Default: `false`
   * @returns array of {@linkcode ElementalType}
   */
  public getTypes(
    includeTeraType = false,
    forDefend: boolean = false,
    bypassSummonData: boolean = false,
  ): ElementalType[] {
    const types: ElementalType[] = [];

    if (includeTeraType && this.isTerastallized) {
      const teraType = this.teraType;
      if (!(forDefend && teraType === ElementalType.STELLAR)) {
        types.push(teraType);
        if (forDefend) {
          return types;
        }
      }
    }

    if (!types.length || !includeTeraType) {
      if (!bypassSummonData && this.summonData.types.length > 0) {
        this.summonData.types.forEach((t) => types.push(t));
      } else if (this.customPokemonData.types.length > 0) {
        // "Permanent" override for a Pokemon's normal types, currently only used by Mystery Encounters
        types.push(this.customPokemonData.types[0]);

        if (types.length === 1 && this.customPokemonData.types.length >= 2) {
          types.push(this.customPokemonData.types[1]);
        }
      } else {
        const speciesForm = this.getSpeciesForm(bypassSummonData);

        types.push(speciesForm.type1);

        if (types.length === 1 && speciesForm.type2 !== null) {
          types.push(speciesForm.type2);
        }
      }
    }

    // become UNKNOWN if no types are present
    if (!types.length) {
      types.push(ElementalType.UNKNOWN);
    }

    // remove UNKNOWN if other types are present
    if (types.length > 1 && types.includes(ElementalType.UNKNOWN)) {
      const index = types.indexOf(ElementalType.UNKNOWN);
      if (index !== -1) {
        types.splice(index, 1);
      }
    }

    // the type added to Pokemon from moves like Forest's Curse or Trick Or Treat
    if (!bypassSummonData && this.summonData.addedType != null && !types.includes(this.summonData.addedType)) {
      types.push(this.summonData.addedType);
    }

    // If both types are the same (can happen in weird custom typing scenarios), reduce to single type
    if (types.length > 1 && types[0] === types[1]) {
      types.splice(0, 1);
    }

    return types;
  }

  /**
   * Checks if the pokemon's typing includes the specified type
   * @param type - {@linkcode ElementalType} to check
   * @param includeTeraType - `true` to include tera-formed type; Default: `true`
   * @param forDefend - `true` if the pokemon is defending from an attack; Default: `false`
   * @param bypassSummonData - If `true`, ignore ability changing effects; Default: `false`
   * @returns `true` if the Pokemon's type matches
   */
  public isOfType(
    type: ElementalType,
    includeTeraType: boolean = true,
    forDefend: boolean = false,
    bypassSummonData: boolean = false,
  ): boolean {
    return this.getTypes(includeTeraType, forDefend, bypassSummonData).some((t) => t === type);
  }

  /**
   * Sets the temporary types of a pokemon
   * (such as due to {@linkcode AbilityId.PROTEAN | Protean} or {@linkcode MoveId.CONVERSION | Conversion})
   * @param types - The type or types to set
   */
  public setTemporaryTypes(types: ElementalType | ElementalType[]): void {
    if (this.isTerastallized) {
      return;
    }
    types = coerceArray(types);
    this.summonData.types = types;
  }

  /**
   * Gets the non-passive ability of the pokemon. This accounts for ability changing effects.
   * This should rarely be called, most of the time {@linkcode hasAbility} or {@linkcode hasAbilityWithAttr} are better used as
   * those check both the passive and non-passive abilities and account for ability suppression.
   * @see {@linkcode hasAbility} {@linkcode hasAbilityWithAttr} Intended ways to check abilities in most cases
   * @param bypassSummonData - If `true`, ignore ability changing effects; Default: `false`
   * @returns The non-passive {@linkcode Ability} of the pokemon
   */
  public getAbility(bypassSummonData: boolean = false): Ability {
    if (!bypassSummonData && this.summonData.ability) {
      return allAbilities[this.summonData.ability];
    }
    if (activeOverrides.ABILITY_OVERRIDE && this.isPlayer()) {
      return allAbilities[activeOverrides.ABILITY_OVERRIDE];
    }
    if (activeOverrides.ENEMY_ABILITY_OVERRIDE && !this.isPlayer()) {
      return allAbilities[activeOverrides.ENEMY_ABILITY_OVERRIDE];
    }
    if (this.customPokemonData.ability !== -1) {
      return allAbilities[this.customPokemonData.ability];
    }
    let abilityId = this.getSpeciesForm(bypassSummonData).getAbility(this.abilityIndex);
    if (abilityId === AbilityId.NONE) {
      abilityId = this.species.ability1;
    }
    return allAbilities[abilityId];
  }

  /**
   * Gets the passive ability of the pokemon. This should rarely be called, most of the time
   * {@linkcode hasAbility} or {@linkcode hasAbilityWithAttr} are better used as those check both the passive and
   * non-passive abilities and account for ability suppression.
   * @see {@linkcode hasAbility} {@linkcode hasAbilityWithAttr} Intended ways to check abilities in most cases
   * @returns The passive {@linkcode Ability} of the pokemon
   */
  public getPassiveAbility(): Ability {
    if (activeOverrides.PASSIVE_ABILITY_OVERRIDE && this.isPlayer()) {
      return allAbilities[activeOverrides.PASSIVE_ABILITY_OVERRIDE];
    }
    if (activeOverrides.ENEMY_PASSIVE_ABILITY_OVERRIDE && !this.isPlayer()) {
      return allAbilities[activeOverrides.ENEMY_PASSIVE_ABILITY_OVERRIDE];
    }
    if (this.customPokemonData.passive !== -1) {
      return allAbilities[this.customPokemonData.passive];
    }

    let starterSpeciesId = this.species.speciesId;
    while (Object.hasOwn(pokemonPreEvolutions, starterSpeciesId)) {
      starterSpeciesId = pokemonPreEvolutions[starterSpeciesId];
    }
    return allAbilities[starterPassiveAbilities[starterSpeciesId]];
  }

  public hasRevealedAbility(abilityId: AbilityId) {
    return this.waveData.abilitiesRevealed.includes(abilityId);
  }

  /**
   * Obtains the Pokemon's abilities.
   * @param options Optional flags to filter the output:
   * - `bypassSummonData`: If `true`, obtains the Pokemon's base ability instead
   * of overriding abilities (e.g. obtains Trace instead of whatever Trace copies)
   * - `canApplyOnly`: If `true`, filters out abilities that are suppressed or ignored
   * - `revealedOnly`: If `true`, filters out abilities that haven't been revealed yet
   * @returns all of this Pokemon's abilities that meet filter conditions in the form
   * of {@linkcode AbilityData} entries.
   */
  public getAbilities(options: AbilityFilterOptions = {}): AbilityData[] {
    const bypassSummonData = options.bypassSummonData ?? false;
    let abilities: AbilityData[] = [
      { ability: this.getAbility(bypassSummonData), passive: false },
      { ability: this.getPassiveAbility(), passive: true },
    ];

    if (options.canApplyOnly) {
      abilities = abilities.filter((abData) => this.canApplyAbility(abData.passive));
    }

    if (options.revealedOnly) {
      abilities = abilities.filter((abData) => this.hasRevealedAbility(abData.ability.id));
    }

    return abilities;
  }

  /**
   * Gets a list of all instances of a given ability attribute among abilities this pokemon has.
   * Accounts for all the various effects which can affect whether an ability will be present or
   * in effect, and both passive and non-passive.
   * @param abAttrFlag – The {@linkcode AbAttrFlag} to verify within the abilities.
   * @param canApply - If `false`, it doesn't check whether the ability is currently active; Default `true`
   * @param bypassSummonData - If `true`, it ignores ability changing effects; Default `false`
   * @returns An array of all the ability attributes on this ability.
   */
  public getAbilityAttrs<T extends AbAttr = AbAttr>(
    abAttrFlag: AbAttrFlag,
    canApply: boolean = true,
    bypassSummonData: boolean = false,
  ): T[] {
    const abilityAttrs: T[] = [];

    if (!canApply || this.canApplyAbility()) {
      abilityAttrs.push(...this.getAbility(bypassSummonData).getAttrs<T>(abAttrFlag));
    }

    if (!canApply || this.canApplyAbility(true)) {
      abilityAttrs.push(...this.getPassiveAbility().getAttrs<T>(abAttrFlag));
    }

    return abilityAttrs;
  }

  /**
   * Checks if a pokemon has a passive either from:
   *  - bought with starter candy
   *  - set by override
   *  - is a boss pokemon
   * @returns `true` if the Pokemon has a passive
   */
  public hasPassive(): boolean {
    // returns override if valid for current case
    if (
      (activeOverrides.PASSIVE_ABILITY_OVERRIDE !== AbilityId.NONE && this.isPlayer())
      || (activeOverrides.ENEMY_PASSIVE_ABILITY_OVERRIDE !== AbilityId.NONE && !this.isPlayer())
    ) {
      return true;
    }

    // Classic Final boss does not have passive
    const { currentBattle } = globalScene;
    if (this.isEnemy() && currentBattle?.isClassicFinalBoss) {
      return false;
    }

    return this.passive || this.isBoss();
  }

  /**
   * Checks whether an ability of a pokemon can be currently applied. This should rarely be
   * directly called, as {@linkcode hasAbility} and {@linkcode hasAbilityWithAttr} already call this.
   * @see {@linkcode hasAbility} {@linkcode hasAbilityWithAttr} Intended ways to check abilities in most cases
   * @param passive If true, check if passive can be applied instead of non-passive
   * @returns `true` if the ability can be applied
   */
  public canApplyAbility(passive: boolean = false): boolean {
    if (passive && !this.hasPassive()) {
      return false;
    }
    const ability = passive ? this.getPassiveAbility() : this.getAbility();
    const arena = globalScene?.arena;
    if (arena.ignoreAbilities && arena.ignoringEffectSource !== this.getBattlerIndex() && ability.isIgnorable) {
      return false;
    }
    if (this.summonData.abilitySuppressed && ability.isSuppressable) {
      return false;
    }
    if (this.isOnField() && !ability.hasAttrFlag(AbAttrFlag.SUPPRESS_FIELD_ABILITIES)) {
      const suppressed = new BooleanHolder(false);
      globalScene
        .getField(true)
        .filter((p) => p !== this)
        .map((p) => {
          if (p.getAbility().hasAttrFlag(AbAttrFlag.SUPPRESS_FIELD_ABILITIES) && p.canApplyAbility()) {
            p.getAbility()
              .getAttrs(AbAttrFlag.SUPPRESS_FIELD_ABILITIES)
              .map((a) => a.apply(this, false, suppressed, ability));
          }
          if (p.getPassiveAbility().hasAttrFlag(AbAttrFlag.SUPPRESS_FIELD_ABILITIES) && p.canApplyAbility(true)) {
            p.getPassiveAbility()
              .getAttrs(AbAttrFlag.SUPPRESS_FIELD_ABILITIES)
              .map((a) => a.apply(this, false, suppressed, ability));
          }
        });
      if (suppressed.value) {
        return false;
      }
    }
    return (this.hp > 0 || ability.isBypassFaint) && !ability.conditions.find((condition) => !condition(this));
  }

  /**
   * Checks whether a pokemon has the specified ability and it's in effect. Accounts for all the various
   * effects which can affect whether an ability will be present or in effect, and both passive and
   * non-passive. This is the primary way to check whether a pokemon has a particular ability.
   * @param ability - The {@linkcode AbilityId | ability} to check for
   * @param canApply - (Default `true`) If `false`, it doesn't check whether the ability is currently active
   * @param bypassSummonData - (Optional) If `true`, it ignores ability changing effects
   * @returns Whether the ability is present and active
   */
  public hasAbility(ability: AbilityId, canApply: boolean = true, bypassSummonData?: boolean): boolean {
    if (this.getAbility(bypassSummonData).id === ability && (!canApply || this.canApplyAbility())) {
      return true;
    }
    if (this.getPassiveAbility().id === ability && this.hasPassive() && (!canApply || this.canApplyAbility(true))) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether a pokemon has an ability with the specified attribute and it's in effect.
   * Accounts for all the various effects which can affect whether an ability will be present or
   * in effect, and both passive and non-passive. This is one of the two primary ways to check
   * whether a pokemon has a particular ability.
   * @param abAttrFlag The {@linkcode AbAttrFlag} to check for
   * @param canApply If false, it doesn't check whether the ability is currently active
   * @param bypassSummonData If true, it ignores ability changing effects
   * @returns Whether an ability with that attribute is present and active
   */
  public hasAbilityWithAttr(abAttrFlag: AbAttrFlag, canApply: boolean = true, bypassSummonData?: boolean): boolean {
    if ((!canApply || this.canApplyAbility()) && this.getAbility(bypassSummonData).hasAttrFlag(abAttrFlag)) {
      return true;
    }
    if (
      this.hasPassive()
      && (!canApply || this.canApplyAbility(true))
      && this.getPassiveAbility().hasAttrFlag(abAttrFlag)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Gets the weight of the Pokemon with subtractive modifiers (Autotomize) happening first
   * and then multiplicative modifiers happening after (Heavy Metal and Light Metal)
   * @returns the kg of the Pokemon (minimum of 0.1)
   */
  public getWeight(): number {
    const autotomizedTag = this.getTag<AutotomizedTag>(BattlerTagType.AUTOTOMIZED);
    let weightRemoved = 0;
    if (autotomizedTag != null) {
      weightRemoved = 100 * autotomizedTag.autotomizeCount;
    }
    const minWeight = 0.1;
    const weight = new NumberHolder(this.getSpeciesForm().weight - weightRemoved);

    // This will trigger the ability overlay so only call this function when necessary
    applyAbAttrs<WeightMultiplierAbAttr>(AbAttrFlag.WEIGHT_MULTIPLIER, this, false, weight);
    return Math.max(minWeight, weight.value);
  }

  public isGrounded(): boolean {
    // Note: This code is also copied in `GroundedTag.onAdd()`, to check whether or not the Pokemon
    // was grounded before receiving the `GroundedTag`.
    return (
      this.hasTag(BattlerTagType.IGNORE_FLYING)
      || (!this.isOfType(ElementalType.FLYING, true, true)
        && !this.hasAbility(AbilityId.LEVITATE)
        && !this.hasTag(...SEMI_INVULNERABLE_BATTLER_TAG_TYPES, BattlerTagType.FLOATING, BattlerTagType.SKY_DROP))
    );
  }

  public isSemiInvulnerable(): boolean {
    return this.hasTag(...SEMI_INVULNERABLE_BATTLER_TAG_TYPES) || this.hasTag(BattlerTagType.SKY_DROP);
  }

  /**
   * Determines whether this Pokemon is prevented from running or switching due
   * to effects from moves and/or abilities.
   * @param trappedAbMessages - If defined, ability trigger messages
   * (e.g. from Shadow Tag) are forwarded through this array.
   * @param simulated - If `true`, applies abilities via simulated calls.
   * @returns `true` if the pokemon is trapped
   */
  public isTrapped(trappedAbMessages: string[] = [], simulated: boolean = true): boolean {
    const commandedTag = this.getTag(BattlerTagType.COMMANDED);
    if (commandedTag?.getSourcePokemon()?.isActive(true)) {
      return true;
    }

    if (this.hasTag(BattlerTagType.SKY_DROP)) {
      return true;
    }

    if (this.isOfType(ElementalType.GHOST)) {
      return false;
    }

    const trappedByAbility = new BooleanHolder(false);
    /**
     * Contains opposing Pokemon (Enemy/Player Pokemon) depending on perspective
     * Afterwards, it filters out Pokemon that have been switched out of the field so trapped abilities/moves do not trigger
     */
    const opposingFieldUnfiltered = this.getOpposingField();
    const opposingField = opposingFieldUnfiltered.filter((enemyPkm) => enemyPkm.switchOutStatus === false);

    opposingField.forEach((opponent) =>
      trappedAbMessages.push(
        ...applyAbAttrs<ArenaTrapAbAttr>(AbAttrFlag.ARENA_TRAP, opponent, simulated, trappedByAbility, this)
          .map((result) => result.message)
          .filter((message) => typeof message === "string"),
      ),
    );

    const side = this.getArenaTagSide();
    return (
      trappedByAbility.value
      || this.hasTag(...TRAPPED_BATTLER_TAG_TYPES)
      || globalScene.arena.hasTag(ArenaTagType.FAIRY_LOCK, side)
    );
  }

  /**
   * Calculates the type of a move when used by this Pokemon after
   * type-changing move and ability attributes have applied.
   * @param move - The {@linkcode Move} being used.
   * @param simulated - If `true`, prevents showing abilities applied in this calculation.
   * @returns The {@linkcode ElementalType} of the move after attributes are applied
   */
  public getMoveType(move: Move, simulated: boolean = true): ElementalType {
    const moveTypeHolder = new NumberHolder(move.type);

    applyMoveAttrs(VariableMoveTypeAttr, this, null, move, moveTypeHolder);
    applyAbAttrs<MoveTypeChangeAbAttr>(AbAttrFlag.MOVE_TYPE_CHANGE, this, simulated, move, undefined, moveTypeHolder);

    globalScene.arena.applyTags<IonDelugeTag>(ArenaTagType.ION_DELUGE, ArenaTagSide.BOTH, simulated, moveTypeHolder);
    if (this.hasTag(BattlerTagType.ELECTRIFIED)) {
      moveTypeHolder.value = ElementalType.ELECTRIC;
    }

    return moveTypeHolder.value as ElementalType;
  }

  /**
   * Calculates the category of a move when used by this Pokemon after
   * category-changing move effects are applied.
   * @param target The {@linkcode Pokemon} targeted by the move
   * @param move The {@linkcode Move} being used
   * @returns The given move's final category when used against the target
   */
  public getMoveCategory(target: Pokemon, move: Move): MoveCategory {
    const moveCategory = new ValueHolder(move.category);
    applyMoveAttrs(VariableMoveCategoryAttr, this, target, move, moveCategory);
    return moveCategory.value;
  }

  /**
   * Calculates the effectiveness of a move against the Pokémon.
   * This includes modifiers from move and ability attributes.
   * @param source {@linkcode Pokemon} The attacking Pokémon.
   * @param move {@linkcode Move} The move being used by the attacking Pokémon.
   * @param abilityApplyMode The {@linkcode AbilityApplyMode} determining how abilities are applied.
   * @param simulated Whether to apply abilities via simulated calls (defaults to `true`)
   * @param cancelled {@linkcode BooleanHolder} Stores whether the move was cancelled by a non-type-based immunity.
   * Currently only used by {@linkcode Pokemon.apply} to determine whether a "No effect" message should be shown.
   * @returns The type damage multiplier, indicating the effectiveness of the move
   */
  getMoveEffectiveness(
    source: Pokemon,
    move: Move,
    abilityApplyMode: AbilityApplyMode = AbilityApplyMode.DEFAULT,
    simulated: boolean = true,
    cancelled?: BooleanHolder,
  ): TypeDamageMultiplier {
    if (this.turnData.moveEffectiveness != null) {
      return this.turnData.moveEffectiveness;
    }

    const applyAbFunc = getAbApplyFunc(abilityApplyMode);

    if (move.hasAttr(TypelessAttr)) {
      return 1;
    }
    const moveType = source.getMoveType(move);

    const typeMultiplier = new NumberHolder(
      move.category !== MoveCategory.STATUS || move.hasAttr(RespectAttackTypeImmunityAttr)
        ? this.getAttackTypeEffectiveness(moveType, source, false, simulated, move)
        : 1,
    );

    applyMoveAttrs(VariableMoveTypeMultiplierAttr, source, this, move, typeMultiplier);
    if (this.getTypes(true, true).find((t) => move.isTypeImmune(source, this, t))) {
      typeMultiplier.value = 0;
    }

    if (this.hasTag(BattlerTagType.TAR_SHOT) && this.getMoveType(move) === ElementalType.FIRE) {
      typeMultiplier.value *= 2;
    }

    const cancelledHolder = cancelled ?? new BooleanHolder(false);

    applyAbFunc<TypeImmunityAbAttr>(
      AbAttrFlag.TYPE_IMMUNITY,
      this,
      simulated,
      source,
      move,
      cancelledHolder,
      typeMultiplier,
    );

    if (!cancelledHolder.value) {
      applyAbFunc<MoveImmunityAbAttr>(AbAttrFlag.MOVE_IMMUNITY, this, simulated, source, move, cancelledHolder);
    }

    if (!cancelledHolder.value) {
      const defendingSidePlayField = this.getField();
      defendingSidePlayField.forEach((p) =>
        applyAbFunc<FieldPriorityMoveImmunityAbAttr>(
          AbAttrFlag.FIELD_PRIORITY_MOVE_IMMUNITY,
          p,
          simulated,
          source,
          move,
          cancelledHolder,
        ),
      );
    }

    const immuneTags = this.findTags<TypeImmuneTag>(
      (tag) => tag.isType<TypeImmuneTag>(...TYPE_IMMUNE_TAG_TYPES) && tag.immuneType === moveType,
    );
    for (const tag of immuneTags) {
      if (move && !move.getAttrs(HitsTagAttr).some((attr) => attr.tagType === tag.tagType)) {
        typeMultiplier.value = 0;
        break;
      }
    }

    // Apply Tera Shell's effect to attacks after all immunities are accounted for
    if (move.category !== MoveCategory.STATUS) {
      applyAbFunc<FullHpResistTypeAbAttr>(
        AbAttrFlag.FULL_HP_RESIST_TYPE,
        this,
        simulated,
        source,
        move,
        typeMultiplier,
      );
    }

    if (move.category === MoveCategory.STATUS && move.hitsSubstitute(source, this)) {
      typeMultiplier.value = 0;
    }

    return (cancelledHolder.value ? 0 : typeMultiplier.value) as TypeDamageMultiplier;
  }

  /**
   * Calculates the move's type effectiveness multiplier based on the target's type/s.
   * @param moveType {@linkcode ElementalType} the type of the move being used
   * @param source {@linkcode Pokemon} the Pokemon using the move
   * @param ignoreFieldConditions whether or not this ignores strong winds/gravity (anticipation, forewarn, stealth rocks)
   * @param simulated tag to only apply the strong winds effect message when the move is used
   * @param move (optional) the move whose type effectiveness is to be checked. Used for applying {@linkcode VariableMoveTypeChartAttr}
   * @returns a multiplier for the type effectiveness
   */
  getAttackTypeEffectiveness(
    moveType: ElementalType,
    source?: Pokemon,
    ignoreFieldConditions: boolean = false,
    simulated: boolean = true,
    move?: Move,
  ): TypeDamageMultiplier {
    if (moveType === ElementalType.STELLAR) {
      return this.isTerastallized ? 2 : 1;
    }
    const types = this.getTypes(true, true);
    const arena = globalScene.arena;

    // Handle flying v ground type immunity without removing flying type so effective types are still effective
    if (
      moveType === ElementalType.GROUND
      && (this.isGrounded() || arena.hasTag(ArenaTagType.GRAVITY))
      && !ignoreFieldConditions
    ) {
      const flyingIndex = types.indexOf(ElementalType.FLYING);
      if (flyingIndex > -1) {
        types.splice(flyingIndex, 1);
      }
    }

    let multiplier = types
      .map((defType) => {
        const multiplier = new NumberHolder(getTypeDamageMultiplier(moveType, defType));
        applyChallenges(globalScene.gameMode, ChallengeType.TYPE_EFFECTIVENESS, multiplier);
        if (move) {
          applyMoveAttrs(VariableMoveTypeChartAttr, null, this, move, multiplier, defType);
        }
        if (source) {
          const ignoreImmunity = new BooleanHolder(false);
          if (source.isActive(true) && source.hasAbilityWithAttr(AbAttrFlag.IGNORE_TYPE_IMMUNITY)) {
            applyAbAttrs<IgnoreTypeImmunityAbAttr>(
              AbAttrFlag.IGNORE_TYPE_IMMUNITY,
              source,
              simulated,
              ignoreImmunity,
              moveType,
              defType,
            );
          }
          if (ignoreImmunity.value && multiplier.value === 0) {
            return 1;
          }

          const exposedTags = this.findTags<ExposedTag>((tag) => tag.isType<ExposedTag>(...EXPOSED_TAG_TYPES));
          if (exposedTags.some((t) => t.ignoreImmunity(defType, moveType)) && multiplier.value === 0) {
            return 1;
          }
        }
        return multiplier.value;
      })
      .reduce((acc, cur) => acc * cur, 1) as TypeDamageMultiplier;

    const typeMultiplierAgainstFlying = new NumberHolder(getTypeDamageMultiplier(moveType, ElementalType.FLYING));
    applyChallenges(globalScene.gameMode, ChallengeType.TYPE_EFFECTIVENESS, typeMultiplierAgainstFlying);
    // Handle strong winds lowering effectiveness of types super effective against pure flying
    if (
      !ignoreFieldConditions
      && arena.weatherType === WeatherType.STRONG_WINDS
      && !arena.weather?.isEffectSuppressed()
      && this.isOfType(ElementalType.FLYING)
      && typeMultiplierAgainstFlying.value === 2
    ) {
      multiplier /= 2;
      if (!simulated) {
        globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("weather:strongWindsEffectMessage"));
      }
    }
    return multiplier as TypeDamageMultiplier;
  }

  /**
   * Computes the given Pokemon's matchup score against this Pokemon.
   * In most cases, this score ranges from near-zero to 16, but the maximum possible matchup score is 64.
   * @param opponent {@linkcode Pokemon} The Pokemon to compare this Pokemon against
   * @returns A score value based on how favorable this Pokemon is when fighting the given Pokemon
   */
  getMatchupScore(opponent: Pokemon): number {
    const types = this.getTypes(true);
    const enemyTypes = opponent.getTypes(true, true);
    /** Is this Pokemon faster than the opponent? */
    const outspeed =
      (this.isActive(true) ? this.getEffectiveStat(Stat.SPD, { opponent }) : this.getStat(Stat.SPD, false))
      >= opponent.getEffectiveStat(Stat.SPD, { opponent: this });
    /**
     * Based on how effective this Pokemon's types are offensively against the opponent's types.
     * This score is increased by 25 percent if this Pokemon is faster than the opponent.
     */
    let atkScore = opponent.getAttackTypeEffectiveness(types[0], this) * (outspeed ? 1.25 : 1);
    /**
     * Based on how effectively this Pokemon defends against the opponent's types.
     * This score cannot be higher than 4.
     */
    let defScore = 1 / Math.max(this.getAttackTypeEffectiveness(enemyTypes[0], opponent), 0.25);
    if (types.length > 1) {
      atkScore *= opponent.getAttackTypeEffectiveness(types[1], this);
    }
    if (enemyTypes.length > 1) {
      defScore *= 1 / Math.max(this.getAttackTypeEffectiveness(enemyTypes[1], opponent), 0.25);
    }
    /**
     * Based on this Pokemon's HP ratio compared to that of the opponent.
     * This ratio is multiplied by 1.5 if this Pokemon outspeeds the opponent;
     * however, the final ratio cannot be higher than 1.
     */
    let hpDiffRatio = this.getHpRatio() + (1 - opponent.getHpRatio());
    if (outspeed) {
      hpDiffRatio = Math.min(hpDiffRatio * 1.5, 1);
    }
    return (atkScore + defScore) * hpDiffRatio;
  }

  getEvolution(): SpeciesFormEvolution | null {
    if (Object.hasOwn(pokemonEvolutions, this.species.speciesId)) {
      const evolutions = pokemonEvolutions[this.species.speciesId];
      for (const e of evolutions) {
        if (
          !e.item
          && this.level >= e.level
          && (e.preFormKey == null || this.getFormKey() === e.preFormKey)
          && (e.conditions === null
            || (e.conditions as SpeciesEvolutionCondition[]).every((condition) => condition.predicate(this)))
        ) {
          return e;
        }
      }
    }

    return null;
  }

  /**
   * Gets all level up moves in a given range for a particular pokemon.
   * @param startingLevel Don't include moves below this level
   * @param includeEvolutionMoves Whether to include evolution moves
   * @param simulateEvolutionChain Whether to include moves from prior evolutions
   * @param includeRelearnerMoves Whether to include moves that would require a relearner. Note the move relearner inherently allows evolution moves
   * @returns A {@linkcode LevelMoves | list of moves and the levels} they can be learned at
   */
  getLevelMoves(
    startingLevel?: number,
    includeEvolutionMoves: boolean = false,
    simulateEvolutionChain: boolean = false,
    includeRelearnerMoves: boolean = false,
  ): LevelMoves {
    const ret: LevelMoves = [];
    let levelMoves: LevelMoves = [];
    if (!startingLevel) {
      startingLevel = this.level;
    }
    if (simulateEvolutionChain) {
      const evolutionChain = this.species.getSimulatedEvolutionChain(
        this.level,
        this.hasTrainer(),
        this.isBoss(),
        this.isPlayer(),
      );
      for (let e = 0; e < evolutionChain.length; e++) {
        // TODO: Might need to pass specific form index in simulated evolution chain
        const speciesLevelMoves = getPokemonSpeciesForm(evolutionChain[e][0], this.formIndex).getLevelMoves();
        if (includeRelearnerMoves) {
          levelMoves.push(...speciesLevelMoves);
        } else {
          levelMoves.push(
            ...speciesLevelMoves.filter(
              (lm) =>
                (includeEvolutionMoves && lm[0] === EVOLVE_MOVE)
                || ((!e || lm[0] > 1) && (e === evolutionChain.length - 1 || lm[0] <= evolutionChain[e + 1][1])),
            ),
          );
        }
      }
    } else {
      levelMoves = this.getSpeciesForm(true)
        .getLevelMoves()
        .filter(
          (lm) =>
            (includeEvolutionMoves && lm[0] === EVOLVE_MOVE)
            || (includeRelearnerMoves && lm[0] === RELEARN_MOVE)
            || lm[0] > 0,
        );
    }
    levelMoves.sort((lma, lmb) => {
      if (lma[0] > lmb[0]) {
        return 1;
      }
      if (lma[0] < lmb[0]) {
        return -1;
      }
      return 0;
    });

    /**
     * Filter out moves not within the correct level range(s)
     * Includes moves below startingLevel, or of specifically level 0 if
     * includeRelearnerMoves or includeEvolutionMoves are true respectively
     */
    levelMoves = levelMoves.filter((lm) => {
      const level = lm[0];
      const isRelearner = level < startingLevel;
      const allowedEvolutionMove = level === 0 && includeEvolutionMoves;

      return !(level > this.level) && (includeRelearnerMoves || !isRelearner || allowedEvolutionMove);
    });

    /**
     * This must be done AFTER filtering by level, else if the same move shows up
     * in levelMoves multiple times all but the lowest level one will be skipped.
     * This causes problems when there are intentional duplicates (i.e. Smeargle with Sketch)
     */
    if (levelMoves) {
      this.getUniqueMoves(levelMoves, ret);
    }

    return ret;
  }

  /**
   * Helper function for getLevelMoves.
   * Finds all non-duplicate items from the input, and pushes them into the output.
   * Two items count as duplicate if they have the same Move, regardless of level.
   *
   * @param levelMoves the input array to search for non-duplicates from
   * @param ret the output array to be pushed into.
   */
  private getUniqueMoves(levelMoves: LevelMoves, ret: LevelMoves): void {
    const uniqueMoves: MoveId[] = [];
    for (const lm of levelMoves) {
      if (!uniqueMoves.find((m) => m === lm[1])) {
        uniqueMoves.push(lm[1]);
        ret.push(lm);
      }
    }
  }

  /** @returns A list of the pokemon's egg moves */
  public getEggMoves(): MoveId[] | undefined {
    return speciesEggMoves[this.getSpeciesForm().getRootSpeciesId()];
  }

  /**
   * Function that tries to set a Pokemon shiny based on the trainer's trainer ID and secret ID.
   *
   * The exact mechanic is that it calculates E as the XOR of the player's trainer ID and secret ID. \
   * F is calculated as the XOR of the first 16 bits of the Pokemon's {@linkcode personalityValue | Personality Value} with the last 16 bits. \
   * The XOR of E and F are then compared to the {@linkcode shinyThreshold} (or {@linkcode thresholdOverride} if set) to see whether or not to generate a shiny. \
   * The base shiny odds are {@linkcode BASE_SHINY_CHANCE} `/` `65536`
   * @param thresholdOverride number that is divided by `2^16` (`65536`) to get the shiny chance,
   *   overrides {@linkcode shinyThreshold} if set (bypassing shiny rate modifiers such as Shiny Charm)
   * @returns Whether the Pokemon is shiny
   */
  trySetShiny(thresholdOverride?: number): boolean {
    const { gameData } = globalScene;

    const rand1 = (this.personalityValue & 0xffff0000) >>> 16;
    const rand2 = this.personalityValue & 0x0000ffff;

    const E = gameData.trainerId ^ gameData.secretId;
    const F = rand1 ^ rand2;

    const shinyThreshold = new NumberHolder(BASE_SHINY_CHANCE);
    if (thresholdOverride === undefined) {
      if (timedEventManager.isEventActive(EventModifierType.WILD_SHINY_CHANCE)) {
        shinyThreshold.value *= timedEventManager.getWildShinyChanceMultiplier();
      }
      if (!this.hasTrainer()) {
        globalScene.applyModifiers(ShinyRateBoosterModifier, true, shinyThreshold);
      }
    } else {
      shinyThreshold.value = thresholdOverride;
    }

    this.shiny = (E ^ F) < shinyThreshold.value;

    if (this.shiny) {
      this.initShinySparkle();
    }

    return this.shiny;
  }

  /**
   * Function that tries to set a Pokemon shiny based on seed.
   * For manual use only, usually to roll a Pokemon's shiny chance a second time.
   * If it rolls shiny, also sets a random variant and give the Pokemon the associated luck.
   *
   * The base shiny odds are {@linkcode BASE_SHINY_CHANCE} / `65536`
   * @param thresholdOverride number that is divided by `2^16` (`65536`) to get the shiny chance, overrides {@linkcode shinyThreshold} if set (bypassing shiny rate modifiers such as Shiny Charm)
   * @param applyModifiersToOverride If {@linkcode thresholdOverride} is set and this is true, will apply Shiny Charm and event modifiers to {@linkcode thresholdOverride}
   * @returns `true` if the Pokemon has been set as a shiny, `false` otherwise
   */
  public trySetShinySeed(thresholdOverride?: number, applyModifiersToOverride?: boolean): boolean {
    const shinyThreshold = new NumberHolder(BASE_SHINY_CHANCE);
    if (thresholdOverride === undefined || applyModifiersToOverride) {
      if (thresholdOverride !== undefined && applyModifiersToOverride) {
        shinyThreshold.value = thresholdOverride;
      }
      if (timedEventManager.isEventActive(EventModifierType.WILD_SHINY_CHANCE)) {
        shinyThreshold.value *= timedEventManager.getWildShinyChanceMultiplier();
      }
      if (!this.hasTrainer()) {
        globalScene.applyModifiers(ShinyRateBoosterModifier, true, shinyThreshold);
      }
    } else {
      shinyThreshold.value = thresholdOverride;
    }

    this.shiny = randSeedInt(65536) < shinyThreshold.value;

    if (this.shiny) {
      this.variant = this.generateShinyVariant();
      this.initShinySparkle();
    }

    return this.shiny;
  }

  /**
   * Generates a shiny variant
   * @returns `0-2`, with the following probabilities:
   * - Has a 10% chance of returning `2` (epic variant)
   * - Has a 30% chance of returning `1` (rare variant)
   * - Has a 60% chance of returning `0` (basic shiny)
   */
  protected generateShinyVariant(): Variant {
    const formIndex: number = this.formIndex;
    let variantDataIndex: string | number = this.species.speciesId;
    if (this.species.forms.length > 0) {
      const formKey = this.species.forms[formIndex]?.formKey;
      if (formKey) {
        variantDataIndex = `${variantDataIndex}-${formKey}`;
      }
    }
    // Checks if there is no variant data for both the index or index with form
    if (
      !this.shiny
      || (!Object.hasOwn(variantData, variantDataIndex) && !Object.hasOwn(variantData, this.species.speciesId))
    ) {
      return 0;
    }
    const rand = new NumberHolder(0);
    globalScene.executeWithSeedOffset(
      () => {
        rand.value = randSeedInt(10);
      },
      this.id,
      globalScene.waveSeed,
    );
    if (rand.value >= SHINY_VARIANT_CHANCE) {
      return 0; // 6/10
    }
    if (rand.value >= SHINY_EPIC_CHANCE) {
      return 1; // 3/10
    }
    return 2; // 1/10
  }

  /** Generates a semi-random moveset for a Pokemon */
  public generateAndPopulateMoveset(): void {
    this.moveset = [];
    let movePool: [MoveId, number][] = [];
    const allLevelMoves = this.getLevelMoves(1, true, true);
    if (!allLevelMoves) {
      console.warn("Error encountered trying to generate moveset for:", this.species.name);
      return;
    }

    for (const levelMove of allLevelMoves) {
      if (this.level < levelMove[0]) {
        break;
      }
      let weight = levelMove[0];
      // Evolution Moves
      if (weight === 0) {
        weight = 50;
      }
      // Assume level 1 moves with 80+ BP are "move reminder" moves and bump their weight
      if (weight === 1 && allMoves.get(levelMove[1]).power >= 80) {
        weight = 40;
      }
      if (!movePool.some((m) => m[0] === levelMove[1]) && !allMoves.get(levelMove[1]).name.endsWith(" (N)")) {
        movePool.push([levelMove[1], weight]);
      }
    }

    if (this.hasTrainer()) {
      const tms = Object.keys(tmSpecies);
      for (const tm of tms) {
        const moveId = Number.parseInt(tm) as MoveId;
        let compatible = false;
        for (const p of tmSpecies[tm]) {
          if (Array.isArray(p)) {
            if (p[0] === this.species.speciesId) {
              compatible = true;
              break;
            }
          } else if (p === this.species.speciesId) {
            compatible = true;
            break;
          }
        }
        if (compatible && !movePool.some((m) => m[0] === moveId) && !allMoves.get(moveId).name.endsWith(" (N)")) {
          if (tmPoolTiers[moveId] === ModifierTier.COMMON && this.level >= 15) {
            movePool.push([moveId, 4]);
          } else if (tmPoolTiers[moveId] === ModifierTier.GREAT && this.level >= 30) {
            movePool.push([moveId, 8]);
          } else if (tmPoolTiers[moveId] === ModifierTier.ULTRA && this.level >= 50) {
            movePool.push([moveId, 14]);
          }
        }
      }

      // No egg moves below level 60
      if (this.level >= 60) {
        for (let i = 0; i < 3; i++) {
          const moveId = speciesEggMoves[this.species.getRootSpeciesId()][i];
          if (!movePool.some((m) => m[0] === moveId) && !allMoves.get(moveId).name.endsWith(" (N)")) {
            movePool.push([moveId, 40]);
          }
        }
        const moveId = speciesEggMoves[this.species.getRootSpeciesId()][3];
        // No rare egg moves before e4
        if (
          this.level >= 170
          && !movePool.some((m) => m[0] === moveId)
          && !allMoves.get(moveId).name.endsWith(" (N)")
          && !this.isBoss()
        ) {
          movePool.push([moveId, 30]);
        }
      }
    }

    // Bosses never get self ko moves
    if (this.isBoss()) {
      movePool = movePool.filter((m) => !allMoves.get(m[0]).hasAttr(SacrificialAttr));
    }
    if (this.hasTrainer()) {
      // Trainers never get OHKO moves
      movePool = movePool.filter((m) => !allMoves.get(m[0]).hasAttr(OneHitKOAttr));
      // Half the weight of self KO moves
      movePool = movePool.map((m) => [m[0], m[1] * (allMoves.get(m[0]).hasAttr(SacrificialAttr) ? 0.5 : 1)]);
      // Trainers get a weight bump to stat buffing moves
      movePool = movePool.map((m) => [
        m[0],
        m[1]
          * (allMoves
            .get(m[0])
            .getAttrs(StatStageChangeAttr)
            .some((a) => a.stages > 1 && a.selfTarget)
            ? 1.25
            : 1),
      ]);
      // Trainers get a weight decrease to multiturn moves
      movePool = movePool.map((m) => [
        m[0],
        m[1] * (allMoves.get(m[0]).isChargingMove() || allMoves.get(m[0]).hasAttr(RechargeAttr) ? 0.7 : 1),
      ]);
    }

    // Weight towards higher power moves, by reducing the power of moves below the highest power.
    // Caps max power at 90 to avoid something like hyper beam ruining the stats.
    // This is a pretty soft weighting factor, although it is scaled with the weight multiplier.
    const maxPower = Math.min(
      movePool.reduce((v, m) => Math.max(allMoves.get(m[0]).power, v), 40),
      90,
    );
    movePool = movePool.map((m) => [
      m[0],
      m[1]
        * (allMoves.get(m[0]).category === MoveCategory.STATUS
          ? 1
          : Math.max(Math.min(allMoves.get(m[0]).power / maxPower, 1), 0.5)),
    ]);

    // Weight damaging moves against the lower stat
    const atk = this.getStat(Stat.ATK);
    const spAtk = this.getStat(Stat.SPATK);
    const worseCategory: MoveCategory = atk > spAtk ? MoveCategory.SPECIAL : MoveCategory.PHYSICAL;
    const statRatio = worseCategory === MoveCategory.PHYSICAL ? atk / spAtk : spAtk / atk;
    movePool = movePool.map((m) => [m[0], m[1] * (allMoves.get(m[0]).category === worseCategory ? statRatio : 1)]);

    /** The higher this is the more the game weights towards higher level moves. At `0` all moves are equal weight. */
    let weightMultiplier = 0.9;
    if (this.hasTrainer()) {
      weightMultiplier += 0.7;
    }
    if (this.isBoss()) {
      weightMultiplier += 0.4;
    }
    const baseWeights: [MoveId, number][] = movePool.map((m) => [
      m[0],
      Math.ceil(Math.pow(m[1], weightMultiplier) * 100),
    ]);

    // Trainers and bosses always force a stab move
    if (this.hasTrainer() || this.isBoss()) {
      const stabMovePool = baseWeights.filter(
        (m) => allMoves.get(m[0]).category !== MoveCategory.STATUS && this.isOfType(allMoves.get(m[0]).type),
      );

      if (stabMovePool.length) {
        const totalWeight = stabMovePool.reduce((v, m) => v + m[1], 0);
        let rand = randSeedInt(totalWeight);
        let index = 0;
        while (rand > stabMovePool[index][1]) {
          rand -= stabMovePool[index++][1];
        }
        this.moveset.push(new PokemonMove(stabMovePool[index][0], { pokemonId: this.id }));
      }
    } else {
      // Normal wild pokemon just force a random damaging move
      const attackMovePool = baseWeights.filter((m) => allMoves.get(m[0]).category !== MoveCategory.STATUS);
      if (attackMovePool.length) {
        const totalWeight = attackMovePool.reduce((v, m) => v + m[1], 0);
        let rand = randSeedInt(totalWeight);
        let index = 0;
        while (rand > attackMovePool[index][1]) {
          rand -= attackMovePool[index++][1];
        }
        this.moveset.push(new PokemonMove(attackMovePool[index][0], { pokemonId: this.id }));
      }
    }

    while (baseWeights.length > this.moveset.length && this.moveset.length < 4) {
      if (this.hasTrainer()) {
        // Sqrt the weight of any damaging moves with overlapping types. This is about a 0.05 - 0.1 multiplier.
        // Other damaging moves 2x weight if 0-1 damaging moves, 0.5x if 2, 0.125x if 3. These weights double if STAB.
        // Status moves remain unchanged on weight, this encourages 1-2
        movePool = baseWeights
          .filter((m) => !this.moveset.some((mo) => m[0] === mo.moveId))
          .map((m) => {
            let ret: number;
            if (
              this.moveset.some(
                (mo) => mo.getMove().category !== MoveCategory.STATUS && mo.getMove().type === allMoves.get(m[0]).type,
              )
            ) {
              ret = Math.ceil(Math.sqrt(m[1]));
            } else if (allMoves.get(m[0]).category !== MoveCategory.STATUS) {
              ret = Math.ceil(
                (m[1]
                  / Math.max(Math.pow(4, this.moveset.filter((mo) => (mo.getMove().power ?? 0) > 1).length) / 8, 0.5))
                  * (this.isOfType(allMoves.get(m[0]).type) ? 2 : 1),
              );
            } else {
              ret = m[1];
            }
            return [m[0], ret];
          });
      } else {
        // Non-trainer pokemon just use normal weights
        movePool = baseWeights.filter((m) => !this.moveset.some((mo) => m[0] === mo.moveId));
      }
      const totalWeight = movePool.reduce((v, m) => v + m[1], 0);
      let rand = randSeedInt(totalWeight);
      let index = 0;
      while (rand > movePool[index][1]) {
        rand -= movePool[index++][1];
      }
      this.moveset.push(new PokemonMove(movePool[index][0], { pokemonId: this.id }));
    }

    // Trigger FormChange, except for enemy Pokemon during Mystery Encounters, to avoid crashes
    if (
      this.isPlayer()
      || !globalScene.currentBattle?.isBattleMysteryEncounter()
      || !globalScene.currentBattle?.mysteryEncounter
    ) {
      globalScene.triggerPokemonFormChange(this, SpeciesFormChangeMoveLearnedTrigger);
    }
  }

  public trySelectMove(moveIndex: number, ignorePp?: boolean): boolean {
    const move = this.getMoveset().length > moveIndex ? this.getMoveset()[moveIndex] : null;
    return move?.isUsable(this, ignorePp) ?? false;
  }

  showInfo(): void {
    if (!this.battleInfo.visible) {
      const otherBattleInfo = globalScene.fieldUI
        .getAll()
        .slice(0, 4)
        .filter((ui) => ui.type === "PlayerBattleInfo" && this.isPlayer())
        .find(() => true);
      if (!otherBattleInfo || !this.getFieldIndex()) {
        globalScene.fieldUI.sendToBack(this.battleInfo);
        globalScene.sendTextToBack(); // Push the top right text objects behind everything else
      } else {
        globalScene.fieldUI.moveAbove(this.battleInfo, otherBattleInfo);
      }
      let xOffset = -150;
      if (this.isPlayer()) {
        xOffset = 150;
      } else if (this.isBoss()) {
        xOffset = -198;
      }
      this.battleInfo.setX(this.battleInfo.x + xOffset);
      this.battleInfo.setVisible(true);
      if (this.isPlayer()) {
        this.battleInfo.expMaskRect.x += 150;
      }
      globalScene.tweens.add({
        targets: [this.battleInfo, this.battleInfo.expMaskRect],
        x: this.isPlayer() ? "-=150" : `+=${this.isBoss() ? 246 : 150}`,
        duration: 1000,
        ease: "Cubic.easeOut",
      });
    }
  }

  hideInfo(): Promise<void> {
    return new Promise((resolve) => {
      if (this.battleInfo?.visible) {
        globalScene.tweens.add({
          targets: [this.battleInfo, this.battleInfo.expMaskRect],
          x: this.isPlayer() ? "+=150" : `-=${this.isBoss() ? 246 : 150}`,
          duration: 500,
          ease: "Cubic.easeIn",
          onComplete: () => {
            if (this.isPlayer()) {
              this.battleInfo.expMaskRect.x -= 150;
            }
            this.battleInfo.setVisible(false);
            let xOffset = -150;
            if (this.isPlayer()) {
              xOffset = 150;
            } else if (this.isBoss()) {
              xOffset = -198;
            }
            this.battleInfo.setX(this.battleInfo.x - xOffset);
            resolve();
          },
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * sets if the pokemon is switching out (if it's a enemy wild implies it's going to flee)
   * @param status - boolean
   */
  setSwitchOutStatus(status: boolean): void {
    this.switchOutStatus = status;
  }

  /**
   * Updates the Pokemon's battle info UI. This is purely a visual update.
   * @param instant Whether or not the update should be instant.
   */
  updateInfo(instant?: boolean): Promise<void> {
    return this.battleInfo.updateInfo(this, instant);
  }

  /**
   * Show or hide the type effectiveness multiplier window
   * Passing undefined will hide the window
   */
  updateEffectiveness(effectiveness?: string) {
    this.battleInfo.updateEffectiveness(effectiveness);
  }

  toggleStats(visible: boolean): void {
    this.battleInfo.toggleStats(visible);
  }

  toggleFlyout(visible: boolean): void {
    this.battleInfo.toggleFlyout(visible);
  }

  addExp(exp: number) {
    const maxExpLevel = globalScene.getMaxExpLevel();
    const initialExp = this.exp;
    this.exp += exp;
    while (this.level < maxExpLevel && this.exp >= getLevelTotalExp(this.level + 1, this.species.growthRate)) {
      this.level++;
    }
    if (this.level >= maxExpLevel) {
      console.log(initialExp, this.exp, getLevelTotalExp(this.level, this.species.growthRate));
      this.exp = Math.max(getLevelTotalExp(this.level, this.species.growthRate), initialExp);
    }
    this.levelExp = this.exp - getLevelTotalExp(this.level, this.species.growthRate);
  }

  /**
   * Compares if `this` and {@linkcode target} are on the same team.
   * @param target the {@linkcode Pokemon} to compare against.
   * @returns `true` if the two pokemon are allies, `false` otherwise
   */
  public isOpponent(target: Pokemon): boolean {
    return this.isPlayer() !== target.isPlayer();
  }

  /**
   * @returns An array containing the active, on field pokemon on the team opposing this pokemon.
   * @todo Add `| undefined` to return type hint
   */
  getOpponents(): Pokemon[] {
    return this.getOpposingField().filter((p) => p.isActive(true));
  }

  getOpponentDescriptor(): string {
    const opponents = this.getOpponents();
    if (opponents.length === 1) {
      return opponents[0].name;
    }
    return this.isPlayer() ? i18next.t("arenaTag:opposingTeam") : i18next.t("arenaTag:yourTeam");
  }

  /**
   * @returns The allied {@linkcode Pokemon} or `undefined` if there is no allied pokemon
   * or the ally is {@linkcode Pokemon.isAllowedInBattle | not allowed} on the field
   * @see {@linkcode PlayerPokemon.getAlly}
   */
  getAlly(): Pokemon | undefined {
    return this.getField()[this.getFieldIndex() ? 0 : 1];
  }

  /**
   * @returns the Pokemon on the allied field
   */
  getField(): Pokemon[] {
    return this.isPlayer() ? globalScene.getPlayerField() : globalScene.getEnemyField();
  }

  /**
   * @returns the party of the Pokemon
   */
  getParty(): Pokemon[] {
    return this.isPlayer() ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
  }

  /**
   * @returns the {@linkcode ArenaTagSide} of the Pokemon
   */
  getArenaTagSide(): typeof ArenaTagSide.PLAYER | typeof ArenaTagSide.ENEMY {
    return this.isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY;
  }

  /**
   * @returns the {@linkcode BattlerIndex} corresponding to this Pokemon's side of the field
   */
  getArenaSideIndex(): BattlerIndex.PLAYER_SIDE | BattlerIndex.ENEMY_SIDE {
    return this.isPlayer() ? BattlerIndex.PLAYER_SIDE : BattlerIndex.ENEMY_SIDE;
  }

  /**
   * @returns the Pokemon on the opposing field
   */
  getOpposingField(): Pokemon[] {
    return this.isPlayer() ? globalScene.getEnemyField() : globalScene.getPlayerField();
  }

  /**
   * @returns the opposing party of the Pokemon
   */
  getOpposingParty(): Pokemon[] {
    return this.isPlayer() ? globalScene.getEnemyParty() : globalScene.getPlayerParty();
  }

  /**
   * @returns the opposing {@linkcode ArenaTagSide} of the Pokemon
   */
  getOpposingArenaTagSide(): typeof ArenaTagSide.ENEMY | typeof ArenaTagSide.PLAYER {
    return this.isPlayer() ? ArenaTagSide.ENEMY : ArenaTagSide.PLAYER;
  }

  /**
   * Calculates the stat stage multiplier of the user against an opponent.
   *
   * Note that this does not apply to evasion or accuracy
   * @see {@linkcode getAccuracyMultiplier}
   * @param stat the desired {@linkcode EffectiveStat}
   * @param opponent the target {@linkcode Pokemon}
   * @param move the {@linkcode Move} being used
   * @param abilityApplyMode the {@linkcode AbilityApplyMode} determining how abilities are applied
   * @param isCritical determines whether a critical hit has occurred or not (`false` by default)
   * @param simulated determines whether effects are applied without altering game state (`true` by default)
   * @returns the stat stage multiplier to be used for effective stat calculation
   */
  getStatStageMultiplier(
    stat: EffectiveStat,
    opponent?: Pokemon,
    move?: Move,
    abilityApplyMode: AbilityApplyMode = AbilityApplyMode.DEFAULT,
    isCritical: boolean = false,
    simulated: boolean = true,
  ): number {
    const applyAbFunc = getAbApplyFunc(abilityApplyMode);
    const statStage = new NumberHolder(this.getStatStage(stat));
    const ignoreStatStage = new BooleanHolder(false);

    if (opponent) {
      if (isCritical) {
        switch (stat) {
          case Stat.ATK:
          case Stat.SPATK:
            statStage.value = Math.max(statStage.value, 0);
            break;
          case Stat.DEF:
          case Stat.SPDEF:
            statStage.value = Math.min(statStage.value, 0);
            break;
        }
      }
      applyAbFunc<IgnoreOpponentStatStagesAbAttr>(
        AbAttrFlag.IGNORE_OPPONENT_STAT_STAGES,
        opponent,
        simulated,
        stat,
        ignoreStatStage,
      );

      if (move) {
        applyMoveAttrs(IgnoreOpponentStatStagesAttr, this, opponent, move, ignoreStatStage);
      }
    }

    if (!ignoreStatStage.value) {
      const statStageMultiplier = new NumberHolder(Math.max(2, 2 + statStage.value) / Math.max(2, 2 - statStage.value));
      globalScene.applyModifiers(TempStatStageBoosterModifier, this.isPlayer(), stat, statStageMultiplier);
      return Math.min(statStageMultiplier.value, 4);
    }
    return 1;
  }

  /**
   * Calculates the accuracy multiplier of the user against a target.
   *
   * This method considers various factors such as the user's accuracy level, the target's evasion level,
   * abilities, and modifiers to compute the final accuracy multiplier.
   *
   * @param target {@linkcode Pokemon} - The target Pokémon against which the move is used.
   * @param sourceMove {@linkcode Move}  - The move being used by the user.
   * @returns The calculated accuracy multiplier.
   *
   * | For ACC and EVA  | -6  | -5  | -4  | -3  | -2  | -1  |  0  | +1  | +2  | +3  | +4  | +5  | +6  |
   * |------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
   * | Stage (EVA)      | +6  | +5  | +4  | +3  | +2  | +1  |  0  | -1  | -2  | -3  | -4  | -5  | -6  |
   * | Gen V+           | 3/9 | 3/8 | 3/7 | 3/6 | 3/5 | 3/4 | 3/3 | 4/3 | 5/3 | 6/3 | 7/3 | 8/3 | 9/3 |
   * @see {@link https://bulbapedia.bulbagarden.net/wiki/Stat_modifier#Stage_multipliers Stage multipliers - Bulbapedia}
   */
  getAccuracyMultiplier(target: Pokemon, sourceMove: Move): number {
    const isOhko = sourceMove.hasAttr(OneHitKOAccuracyAttr);
    if (isOhko) {
      return 1;
    }

    const userAccStage = new NumberHolder(this.getStatStage(Stat.ACC));
    const targetEvaStage = new NumberHolder(target.getStatStage(Stat.EVA));

    const ignoreAccStatStage = new BooleanHolder(false);
    const ignoreEvaStatStage = new BooleanHolder(false);

    applyAbAttrs<IgnoreOpponentStatStagesAbAttr>(
      AbAttrFlag.IGNORE_OPPONENT_STAT_STAGES,
      target,
      false,
      Stat.ACC,
      ignoreAccStatStage,
    );
    applyAbAttrs<IgnoreOpponentStatStagesAbAttr>(
      AbAttrFlag.IGNORE_OPPONENT_STAT_STAGES,
      this,
      false,
      Stat.EVA,
      ignoreEvaStatStage,
    );
    applyMoveAttrs(IgnoreOpponentStatStagesAttr, this, target, sourceMove, ignoreEvaStatStage);

    globalScene.applyModifiers(TempStatStageBoosterModifier, this.isPlayer(), Stat.ACC, userAccStage);

    userAccStage.value = ignoreAccStatStage.value ? 0 : userAccStage.value;
    targetEvaStage.value = ignoreEvaStatStage.value ? 0 : targetEvaStage.value;

    if (target.hasTag(...EXPOSED_TAG_TYPES)) {
      targetEvaStage.value = Math.min(0, targetEvaStage.value);
    }

    const accuracyMultiplier = new NumberHolder(calcAccuracyMultiplier(userAccStage.value, targetEvaStage.value));

    applyAbAttrs<StatMultiplierAbAttr>(
      AbAttrFlag.STAT_MULTIPLIER,
      this,
      false,
      Stat.ACC,
      accuracyMultiplier,
      sourceMove,
    );

    const evasionMultiplier = new NumberHolder(1);
    applyAbAttrs<StatMultiplierAbAttr>(
      AbAttrFlag.STAT_MULTIPLIER,
      target,
      false,
      Stat.EVA,
      evasionMultiplier,
      sourceMove,
    );

    return accuracyMultiplier.value / evasionMultiplier.value;
  }

  /**
   * Calculates the base damage of the given move against this Pokemon when attacked by the given source.
   * Used during damage calculation and for Shell Side Arm's forecasting effect.
   * @param source the attacking {@linkcode Pokemon}.
   * @param move the {@linkcode Move} used in the attack.
   * @param moveCategory the move's {@linkcode MoveCategory} after variable-category effects are applied.
   * @param abilityApplyMode the {@linkcode AbilityApplyMode} determining how abilities are applied.
   * @param isCritical if `true`, calculates effective stats as if the hit were critical (defaults to `false`).
   * @param simulated if `true`, suppresses changes to game state during calculation (defaults to `true`).
   * @returns The move's base damage against this Pokemon when used by the source Pokemon.
   */
  getBaseDamage(
    source: Pokemon,
    move: Move,
    moveCategory: MoveCategory,
    abilityApplyMode: AbilityApplyMode = AbilityApplyMode.DEFAULT,
    isCritical: boolean = false,
    simulated: boolean = true,
  ): number {
    const isPhysical = moveCategory === MoveCategory.PHYSICAL;

    /** A base damage multiplier based on the source's level */
    const levelMultiplier = (2 * source.level) / 5 + 2;

    /** The power of the move after power boosts from abilities, etc. have applied */
    const power = move.calculateBattlePower(source, this, simulated);

    /**
     * The attacker's offensive stat for the given move's category.
     * Critical hits cause negative stat stages to be ignored.
     */
    const sourceAtk = source.getEffectiveStat(isPhysical ? Stat.ATK : Stat.SPATK, {
      opponent: this,
      move,
      abilityApplyMode,
      isCritical,
      simulated,
    });

    /**
     * The {@linkcode EffectiveStat} used to defend against the given move.
     * Can be altered by move attributes, e.g. from Psyshock.
     */
    const defendingStat = new NumberHolder(isPhysical ? Stat.DEF : Stat.SPDEF);
    applyMoveAttrs(VariableDefAttr, source, this, move, defendingStat);

    /**
     * This Pokemon's defensive stat for the given move's category.
     * Critical hits cause positive stat stages to be ignored.
     */
    const targetDef = this.getEffectiveStat(defendingStat.value, {
      opponent: source,
      move,
      abilityApplyMode,
      isCritical,
      simulated,
    });

    /** This prevents a move with negative power from possibly dealing positive damage.
     * The issue can occur because the base damage is the result of the below equation plus 2.
     */
    const damageCalculation = (levelMultiplier * power * sourceAtk) / targetDef / 50;
    if (damageCalculation < 0) {
      return damageCalculation;
    }
    /**
     * The attack's base damage, as determined by the source's level, move power
     * and Attack stat as well as this Pokemon's Defense stat
     */
    const baseDamage = damageCalculation + 2;
    /** Debug message for non-simulated calls (i.e. when damage is actually dealt) */
    if (!simulated) {
      console.log("base damage", baseDamage, move.name, power, sourceAtk, targetDef);
    }

    return baseDamage;
  }

  /**
   * Calculates the STAB multiplier for a move hitting this {@linkcode Pokemon}
   * @param source - The attacking {@linkcode Pokemon}
   * @param move - The {@linkcode Move} used in the attack
   * @param abilityApplyMode - The {@linkcode AbilityApplyMode} determining how abilities are applied.
   * @param simulated - If `true`, suppresses changes to game state during the calculation.
   * @returns The STAB multiplier (between `1` and `2.25` inclusive)
   */
  public calcStabMultiplierForTakingDamage(
    source: Pokemon,
    move: Move,
    abilityApplyMode: AbilityApplyMode,
    simulated: boolean,
  ): number {
    if (move.hasAttr(TypelessAttr)) {
      return 1;
    }

    const stabMultiplier = new NumberHolder(1);
    const applyAbFunc = getAbApplyFunc(abilityApplyMode);
    const sourceTypes = source.getTypes();
    const sourceTeraType = source.teraType;
    const sourceMoveType = source.getMoveType(move);
    if (sourceMoveType === ElementalType.UNKNOWN) {
      return 1;
    }
    const matchesSourceType = sourceTypes.includes(sourceMoveType);
    /** Combined Pledge moves gain STAB regardless of the user's type */
    const pledgeAppliesStab = new BooleanHolder(false);
    applyMoveAttrs(CombinedPledgeStabBoostAttr, source, this, move, pledgeAppliesStab);

    if ((matchesSourceType && sourceMoveType !== ElementalType.STELLAR) || pledgeAppliesStab.value) {
      stabMultiplier.value += 0.5;
    }

    if (source.isTerastallized && !pledgeAppliesStab.value) {
      if (sourceTeraType === sourceMoveType && sourceMoveType !== ElementalType.STELLAR) {
        stabMultiplier.value += 0.5;
      }

      if (
        sourceTeraType === ElementalType.STELLAR
        && (!source.stellarTypesBoosted.includes(sourceMoveType) || source.species.speciesId === SpeciesId.TERAPAGOS)
      ) {
        stabMultiplier.value += matchesSourceType ? 0.5 : 0.2;
      }
    }

    // Apply STAB boost from Adaptability Ability
    applyAbFunc<StabBoostAbAttr>(AbAttrFlag.STAB_BOOST, source, simulated, move, stabMultiplier);

    return stabMultiplier.value;
  }

  /**
   * Calculates the damage of an attack made by another Pokemon against this Pokemon
   * @param source the attacking {@linkcode Pokemon}
   * @param move the {@linkcode Move} used in the attack
   * @param abilityApplyMode the {@linkcode AbilityApplyMode} determining how abilities are applied.
   * @param isCritical If `true`, calculates damage for a critical hit.
   * @param simulated If `true`, suppresses changes to game state during the calculation.
   * @param effectiveness If defined, this is used in place of calculated effectiveness values.
   * @returns a {@linkcode DamageCalculationResult} object with three fields:
   * - `cancelled`: `true` if the move was cancelled by another effect.
   * - `result`: {@linkcode HitResult} indicates the attack's type effectiveness.
   * - `damage`: `number` the attack's final damage output.
   */
  getAttackDamage(
    source: Pokemon,
    move: Move,
    abilityApplyMode: AbilityApplyMode = AbilityApplyMode.DEFAULT,
    isCritical: boolean = false,
    simulated: boolean = true,
    effectiveness?: TypeDamageMultiplier,
  ): DamageCalculationResult {
    const applyAbFunc = getAbApplyFunc(abilityApplyMode);
    const damage = new NumberHolder(0);
    const defendingSide = this.getArenaTagSide();

    const moveCategory = source.getMoveCategory(this, move);

    /** The move's type after type-changing effects are applied */
    const moveType = source.getMoveType(move);

    /** If `value` is `true`, cancels the move and suppresses "No Effect" messages */
    const cancelled = new BooleanHolder(false);

    /**
     * The effectiveness of the move being used. Along with type matchups, this
     * accounts for changes in effectiveness from the move's attributes and the
     * abilities of both the source and this Pokemon.
     *
     * Note that the source's abilities are not ignored here
     */
    const typeMultiplier =
      effectiveness ?? this.getMoveEffectiveness(source, move, abilityApplyMode, simulated, cancelled);

    const isPhysical = moveCategory === MoveCategory.PHYSICAL;

    /** Combined damage multiplier from field effects such as weather, terrain, etc. */
    const arenaAttackTypeMultiplier = new NumberHolder(
      globalScene.arena.getAttackTypeMultiplier(moveType, source.isGrounded()),
    );
    applyMoveAttrs(IgnoreWeatherTypeDebuffAttr, source, this, move, arenaAttackTypeMultiplier);

    const isTypeImmune = typeMultiplier * arenaAttackTypeMultiplier.value === 0;

    if (cancelled.value || isTypeImmune) {
      return {
        cancelled: cancelled.value,
        result: move.id === MoveId.SHEER_COLD ? HitResult.IMMUNE : HitResult.NO_EFFECT,
        damage: 0,
      };
    }

    // If the attack deals fixed damage, return a result with that much damage
    const fixedDamage = new NumberHolder(0);
    applyMoveAttrs(FixedDamageAttr, source, this, move, fixedDamage);
    if (fixedDamage.value) {
      // TODO: re-add multi-lens calculation
      fixedDamage.value = toDmgValue(fixedDamage.value);

      return {
        cancelled: false,
        result: HitResult.EFFECTIVE,
        damage: fixedDamage.value,
      };
    }

    /**
     * If the attack is a one-hit KO move, return a result equal to the Pokemon's HP bar
     * Or to the next unbroken health segment if the target is a boss
     */
    const isOneHitKo = new BooleanHolder(false);
    applyMoveAttrs(OneHitKOAttr, source, this, move, isOneHitKo);

    let ohkoDamage = 0;
    if (this.isBoss()) {
      // TODO: Potentially can cause a softlock against the pkr Eternatus boss on floor 200
      const segmentIndex = this.getBossSegmentIndex();
      const enemyHpAfter = Math.floor((this.getMaxHp() * segmentIndex) / this.getBossSegments());
      ohkoDamage = toDmgValue(this.hp - enemyHpAfter);
    } else {
      ohkoDamage = this.hp;
    }
    const ohkoResult = ohkoDamage >= this.hp ? HitResult.ONE_HIT_KO : HitResult.EFFECTIVE;
    if (isOneHitKo.value) {
      return {
        cancelled: false,
        result: ohkoResult,
        damage: ohkoDamage,
      };
    }

    /** Behemoth Bash, Behemoth Blade, and Dynamax Cannon do double damage to G-Max Pokemon (except Eternamax) */
    const gmaxBonusDamageMultiplier = new NumberHolder(1);
    applyMoveAttrs(DoubleDamageToMaxAttr, source, this, move, gmaxBonusDamageMultiplier);

    /**
     * The attack's base damage, as determined by the source's level, move power
     * and Attack stat as well as this Pokemon's Defense stat
     */
    const baseDamage = this.getBaseDamage(source, move, moveCategory, abilityApplyMode, isCritical, simulated);

    /** 25% damage debuff on moves hitting more than one non-fainted target (regardless of immunities) */
    const { targets, multiple } = getMoveTargets(source, move.id);
    const numTargets = multiple ? targets.length : 1;
    const targetMultiplier = numTargets > 1 ? 0.75 : 1;

    /** Multiplier for moves enhanced by Multi-Lens and/or Parental Bond */
    const multiStrikeEnhancementMultiplier = new NumberHolder(1);
    // TODO: re-add multi-lens calculation
    applyAbFunc<AddSecondStrikeAbAttr>(
      AbAttrFlag.ADD_SECOND_STRIKE,
      source,
      simulated,
      move,
      this,
      undefined,
      multiStrikeEnhancementMultiplier,
    );

    /** Doubles damage if this Pokemon's last move was Glaive Rush */
    const glaiveRushMultiplier = new NumberHolder(1);
    if (this.hasTag(BattlerTagType.RECEIVE_DOUBLE_DAMAGE)) {
      glaiveRushMultiplier.value = 2;
    }

    /** The damage multiplier when the given move critically hits */
    const criticalMultiplier = new NumberHolder(isCritical ? 1.5 : 1);
    applyAbAttrs<MultCritAbAttr>(AbAttrFlag.MULT_CRIT, source, simulated, criticalMultiplier);

    /**
     * A multiplier for random damage spread in the range [0.85, 1]
     * This is always 1 for simulated calls.
     */
    const randomMultiplier = simulated ? 1 : this.randSeedIntRange(85, 100) / 100;

    /** A damage multiplier for when the attack is of the same type as the attacker type/teraType. */
    const stabMultiplier = this.calcStabMultiplierForTakingDamage(source, move, abilityApplyMode, simulated);

    /** Halves damage if the attacker is using a physical attack while burned */
    const burnMultiplier = new NumberHolder(1);
    if (isPhysical && source.hasStatusEffect(StatusEffect.BURN) && !move.hasAttr(BypassBurnDamageReductionAttr)) {
      const burnDamageReductionCancelled = new BooleanHolder(false);
      applyAbFunc<BypassBurnDamageReductionAbAttr>(
        AbAttrFlag.BYPASS_BURN_DAMAGE_REDUCTION,
        source,
        simulated,
        burnDamageReductionCancelled,
      );
      if (!burnDamageReductionCancelled.value) {
        burnMultiplier.value = 0.5;
      }
    }

    /** Reduces damage if this Pokemon has a relevant screen (e.g. Light Screen for special attacks) */
    const screenMultiplier = new NumberHolder(1);

    /** Critical hits ignore the damage reduction from screens */
    if (!isCritical) {
      globalScene.arena.applyTags<WeakenMoveScreenTag>(
        [...WEAKEN_MOVE_SCREEN_ARENA_TAG_TYPES],
        defendingSide,
        simulated,
        source,
        moveCategory,
        screenMultiplier,
      );
    }

    /**
     * For each {@linkcode HitsTagAttr} the move has, doubles the damage of the move if:
     * The target has a {@linkcode BattlerTagType} that this move interacts with
     * AND
     * The move doubles damage when used against that tag
     */
    const hitsTagMultiplier = new NumberHolder(1);
    move
      .getAttrs(HitsTagAttr)
      .filter((hta) => hta.doubleDamage)
      .forEach((hta) => {
        if (this.hasTag(hta.tagType)) {
          hitsTagMultiplier.value *= 2;
        }
      });

    /** Halves damage if this Pokemon is grounded in Misty Terrain against a Dragon-type attack */
    const mistyTerrainMultiplier =
      globalScene.arena.hasTerrain(TerrainType.MISTY) && this.isGrounded() && moveType === ElementalType.DRAGON
        ? 0.5
        : 1;

    /** Doubles damage if the attacker has Tinted Lens and is using a resisted move */
    const tintedLensMultiplier = new NumberHolder(1);
    applyAbFunc<DamageBoostAbAttr>(AbAttrFlag.DAMAGE_BOOST, source, simulated, move, this, tintedLensMultiplier);

    /** Apply this Pokemon's post-calc defensive modifiers (e.g. Fur Coat) */
    const receivedDamageMultiplier = new NumberHolder(1);
    const alliedFieldDamageMultiplier = new NumberHolder(1);

    applyAbFunc<ReceivedMoveDamageMultiplierAbAttr>(
      AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER,
      this,
      simulated,
      source,
      move,
      receivedDamageMultiplier,
    );

    /** Additionally apply friend guard damage reduction if ally has it. */
    const allyPokemon = this.getAlly();
    if (globalScene.currentBattle.double && allyPokemon?.isActive(true)) {
      applyAbFunc<AlliedFieldDamageReductionAbAttr>(
        AbAttrFlag.ALLIED_FIELD_DAMAGE_REDUCTION,
        allyPokemon,
        simulated,
        source,
        move,
        alliedFieldDamageMultiplier,
      );
    }

    damage.value =
      baseDamage
      * targetMultiplier
      * gmaxBonusDamageMultiplier.value
      * multiStrikeEnhancementMultiplier.value
      * arenaAttackTypeMultiplier.value
      * glaiveRushMultiplier.value
      * criticalMultiplier.value
      * randomMultiplier
      * stabMultiplier
      * typeMultiplier
      * burnMultiplier.value
      * screenMultiplier.value
      * hitsTagMultiplier.value
      * mistyTerrainMultiplier
      * tintedLensMultiplier.value
      * receivedDamageMultiplier.value
      * alliedFieldDamageMultiplier.value;
    /** If damage is nullified by a form-ability (Eiscue's Ice Face, Mimikyu's Disguise) or the attack has a non-damaging outcome (Present), then damage is set to 0 instead */
    if (damage.value <= 0) {
      damage.value = 0;
    } else {
      damage.value = toDmgValue(damage.value);
    }

    // This attribute may modify damage arbitrarily, so be careful about changing its order of application.
    applyMoveAttrs(ModifiedDamageAttr, source, this, move, damage);

    if (this.isFullHp()) {
      applyAbFunc<SturdyAbAttr>(AbAttrFlag.STURDY, this, simulated, source, move, damage);
    }

    // debug message for when damage is applied (i.e. not simulated)
    if (!simulated) {
      console.log("damage", damage.value, move.name);
    }

    let hitResult: HitResult;
    if (typeMultiplier < 1) {
      hitResult = HitResult.NOT_VERY_EFFECTIVE;
    } else if (typeMultiplier > 1) {
      hitResult = HitResult.SUPER_EFFECTIVE;
    } else {
      hitResult = HitResult.EFFECTIVE;
    }

    return {
      cancelled: cancelled.value,
      result: hitResult,
      damage: damage.value,
    };
  }

  /**
   * Calculates whether the given move critically hits against this Pokemon
   * @param source the {@linkcode Pokemon} using the move
   * @param move the {@linkcode Move} being used
   * @param simulated if `true`, the calculation is resolved without changing game state
   * @returns `true` if the move critically hits; `false` otherwise
   */
  getCriticalHitResult(source: Pokemon, move: Move, simulated: boolean = true): boolean {
    const defendingSide = this.getArenaTagSide();
    const noCritTag = globalScene.arena.hasTag(ArenaTagType.NO_CRIT, defendingSide);
    if (noCritTag || activeOverrides.NEVER_CRIT_OVERRIDE || move.hasAttr(FixedDamageAttr)) {
      return false;
    }

    const isCritical = new BooleanHolder(false);
    if (source.hasTag(BattlerTagType.ALWAYS_CRIT)) {
      isCritical.value = true;
    }
    applyMoveAttrs(CritOnlyAttr, source, this, move, isCritical);
    applyAbAttrs<ConditionalCritAbAttr>(AbAttrFlag.CONDITIONAL_CRIT, source, simulated, isCritical, this, move);
    if (!isCritical.value) {
      const critChance = [24, 8, 2, 1][Math.max(0, Math.min(this.getCritStage(source, move, false), 3))];
      isCritical.value = critChance === 1 || !globalScene.randBattleSeedInt(critChance);
    }

    applyAbAttrs<BlockCritAbAttr>(AbAttrFlag.BLOCK_CRIT, this, simulated, isCritical);

    return isCritical.value;
  }

  /**
   * Deals damage to the pokemon. Called by {@linkcode damageAndUpdate}
   * @param amount - Amount of damage that should be dealt
   * @param ignoreSegments - If `true`, ignores the damage gating of boss bars.
   *   Only used by {@linkcode EnemyPokemon.damage}. Default `false`
   * @param preventEndure - If `true`, bypasses the effects of Endure and Sturdy.
   *   Usually set to `true` for indirect damage (weather, statuses, etc). Default `false`
   * @param ignoreFaintPhase - If `true`, won't push a {@linkcode FaintPhase}. Default `false`
   * @param ignoreDynamaxReduction - If `true`, dynamax damage reduction will be ignored. Default `false`
   * @returns The amount of damage actually dealt.
   */
  protected damage(
    amount: number,
    {
      preventEndure = false,
      ignoreFaintPhase = false,
      ignoreDynamaxReduction = false,
    }: {
      ignoreSegments?: boolean;
      preventEndure?: boolean;
      ignoreFaintPhase?: boolean;
      ignoreDynamaxReduction?: boolean;
    } = {},
  ): number {
    if (this.isFainted()) {
      return 0;
    }

    // Eternatus does not need the damage reduction as its emax form has increased hp/defenses
    if (this.isMax(false) && !ignoreDynamaxReduction) {
      amount = toDmgValue(amount * DYNAMAX_DAMAGE_TAKEN_FACTOR);
    }

    const surviveDamage = new BooleanHolder(false);

    if (!preventEndure && amount >= this.hp) {
      if (this.hp >= 1 && this.hasTag(BattlerTagType.ENDURING)) {
        surviveDamage.value = this.lapseTag(BattlerTagType.ENDURING);
      } else if (this.hp > 1 && this.hasTag(BattlerTagType.STURDY)) {
        surviveDamage.value = this.lapseTag(BattlerTagType.STURDY);
      }

      if (!surviveDamage.value) {
        globalScene.applyModifiers(SurviveDamageModifier, this.isPlayer(), this, surviveDamage);
      }

      if (surviveDamage.value) {
        amount = this.hp - 1;
      }
    }

    amount = Math.min(amount, this.hp);
    this.hp -= amount;
    this.turnData.damageTaken += amount;
    if (this.isFainted() && !ignoreFaintPhase) {
      globalScene.phaseManager.queueBattlerFaintPhase(this.getBattlerIndex(), { preventEndure });
    }
    return amount;
  }

  /**
   * Unshifts a {@linkcode DamageAnimPhase}, deals damage to the pokemon, and updates the battle UI.
   * @param amount - The amount of damage to be dealt.
   * @param result - The {@linkcode DamageResult | type of hit} (super effective, etc).
   *   Passed to the `DamageAnimPhase`. Default {@linkcode HitResult.EFFECTIVE}
   * @param isCritical - `true` if the move is a critical hit. Default `false`
   * @param ignoreSegments - If `true`, boss bars are ignored. Only applies to {@linkcode EnemyPokemon}. Default `false`
   * @param preventEndure - If `true`, bypasses the effects of Endure, Sturdy, etc. Default `false`
   * @param ignoreFaintPhase - If `true`, doesn't push a {@linkcode FaintPhase}. Default `false`
   * @param source - The source of the damage if it was a {@linkcode Pokemon}. Optional.
   * @returns The amount of damage actually dealt.
   */
  public damageAndUpdate(
    amount: number,
    {
      result = HitResult.EFFECTIVE,
      isCritical = false,
      ignoreSegments = false,
      preventEndure = false,
      ignoreFaintPhase = false,
      source,
    }: DamageFunctionOptions = {},
  ): number {
    const damagePhase = globalScene.phaseManager.createPhase(
      "DamageAnimPhase",
      this.getBattlerIndex(),
      amount,
      result,
      isCritical,
    );
    globalScene.phaseManager.unshiftPhase(damagePhase);
    if (this.switchOutStatus && source) {
      amount = 0;
    }

    const ignoreDynamaxReduction = ([HitResult.ONE_HIT_KO, HitResult.SELF_KO] as HitResult[]).includes(result);

    const damage = this.damage(amount, { ignoreSegments, preventEndure, ignoreFaintPhase, ignoreDynamaxReduction });

    // Damage amount may have changed, but needed to be queued before calling damage function
    damagePhase.updateAmount(damage);

    /**
     * Run PostDamageAbAttr from any source of damage that is not from a multi-hit
     * Multi-hits are handled in move-effect-phase.ts for PostDamageAbAttr
     */
    if (!source || source.turnData.hitCount <= 1) {
      applyAbAttrs<PostDamageAbAttr>(AbAttrFlag.POST_DAMAGE, this, false, damage, source);
    }

    return damage;
  }

  /**
   * Heals a pokemon by the amount specified.
   * @param amount - The amount of HP to heal.
   * @param quiet - If `true`, won't display a number above the pokemon. Default `false`
   * @returns The actual amount of HP healed.
   */
  public heal(amount: number, quiet: boolean = false): number {
    const healAmount = Math.min(amount, this.getMaxHp() - this.hp);
    this.hp += healAmount;
    if (!quiet && this.isOnField()) {
      globalScene.damageNumberHandler.add(this, healAmount, HitResult.HEAL);
    }
    return healAmount;
  }

  isBossImmune(): boolean {
    return this.isBoss();
  }

  /**
   * @param includeEternamax - (Default `true`) Whether or not to include Eternamax
   * @returns Whether the Pokemon is in a max form
   */
  public isMax(includeEternamax: boolean = true): boolean {
    const maxForms: string[] = [
      SpeciesFormKey.GIGANTAMAX,
      SpeciesFormKey.GIGANTAMAX_RAPID,
      SpeciesFormKey.GIGANTAMAX_SINGLE,
      ...(includeEternamax ? [SpeciesFormKey.ETERNAMAX] : []),
    ];
    return maxForms.includes(this.getFormKey());
  }

  /** @returns Whether this Pokemon is of a Mega or Primal form */
  public isMega(): boolean {
    const megaForms: string[] = [
      SpeciesFormKey.MEGA,
      SpeciesFormKey.MEGA_X,
      SpeciesFormKey.MEGA_Y,
      SpeciesFormKey.PRIMAL,
    ];
    return megaForms.includes(this.getFormKey());
  }

  // #region Battler Tag methods

  /**
   * @param tagType - The {@linkcode BattlerTagType | type of tag} to check
   * @returns Whether the specified tag can be added to the pokemon
   */
  public canAddTag(tagType: BattlerTagType): boolean {
    if (this.hasTag(tagType)) {
      return false;
    }

    const stubTag = new BattlerTag(tagType, BattlerTagLapseType.CUSTOM, 0);

    const cancelled = new BooleanHolder(false);
    applyAbAttrs<BattlerTagImmunityAbAttr>(AbAttrFlag.BATTLER_TAG_IMMUNITY, this, true, stubTag, cancelled);

    const userField = this.getField();
    userField.forEach((pokemon) =>
      applyAbAttrs<UserFieldBattlerTagImmunityAbAttr>(
        AbAttrFlag.USER_FIELD_BATTLER_TAG_IMMUNITY,
        pokemon,
        true,
        stubTag,
        cancelled,
      ),
    );

    return !cancelled.value;
  }

  /**
   * Adds a {@linkcode BattlerTag} to the pokemon
   * @param tagType - The {@linkcode BattlerTagType} to add
   * @param turnCount - (Default `0`) How many turns the tag should last for
   * @param sourceMove - (Optional) The move causing the tag to be added
   * @param sourceId - (Optional) The ID of the pokemon adding the tag
   * @returns Whether the tag was successfully added
   */
  public addTag(tagType: BattlerTagType, turnCount: number = 0, sourceMove?: MoveId, sourceId?: number): boolean {
    const existingTag = this.getTag(tagType);
    if (existingTag) {
      existingTag.onOverlap(this);
      return false;
    }

    const newTag = getBattlerTag(tagType, turnCount, sourceMove!, sourceId!); // TODO: are the bangs correct?

    const cancelled = new BooleanHolder(false);
    applyAbAttrs<BattlerTagImmunityAbAttr>(AbAttrFlag.BATTLER_TAG_IMMUNITY, this, false, newTag, cancelled);

    const userField = this.getField();
    userField.forEach((pokemon) =>
      applyAbAttrs<UserFieldBattlerTagImmunityAbAttr>(
        AbAttrFlag.USER_FIELD_BATTLER_TAG_IMMUNITY,
        pokemon,
        false,
        newTag,
        cancelled,
      ),
    );

    if (!cancelled.value && newTag.canAdd(this)) {
      this.summonData.tags.push(newTag);
      newTag.onAdd(this);

      return true;
    }

    return false;
  }

  /**
   * @param tagTypes - The {@linkcode BattlerTagType}s to retrieve
   * @returns The first {@linkcode BattlerTag} found of the specified type(s), or `undefined` if none is found
   */
  public getTag<T extends BattlerTag = BattlerTag>(...tagTypes: BattlerTagType[]): T | undefined {
    return this.summonData.tags.find((t) => tagTypes.includes(t.tagType)) as T | undefined;
  }

  /**
   * Helper function to check if a Pokemon has any of the input tag types.
   * @param tagTypes - The battler tag types to search for
   * @returns Whether the Pokemon has at least one of the input battler tags
   * @throws An error if no tag types were passed in to the params
   */
  public hasTag(...tagTypes: BattlerTagType[]): boolean | never {
    if (tagTypes.length === 0) {
      throw new Error("`Pokemon#hasTag` called with no parameters!");
    }
    return this.summonData.tags.some((t) => tagTypes.includes(t.tagType));
  }

  /**
   * Filters the {@linkcode BattlerTag}s attached to the pokemon and returns the first result
   * @param tagFilter - The filter to apply to the tag list
   * @returns The first {@linkcode BattlerTag} found, or `undefined` if none is found
   */
  public findTag<T extends BattlerTag = BattlerTag>(tagFilter: (tag: T) => boolean): T | undefined {
    return this.summonData.tags.find(tagFilter) as T | undefined;
  }

  /**
   * Filters the {@linkcode BattlerTag}s attached to the pokemon and returns the result
   * @param tagFilter - The filter to apply to the tag list
   * @returns An array of {@linkcode BattlerTag}s matching the input filter
   */
  public findTags<T extends BattlerTag = BattlerTag>(tagFilter: (tag: T) => boolean): T[] {
    return this.summonData.tags.filter(tagFilter) as T[];
  }

  /**
   * Calls the `lapse()` method of the specified {@linkcode BattlerTag}
   * @param tagType - The {@linkcode BattlerTagType} to lapse
   * @returns Whether the specified tag is still active
   */
  public lapseTag(tagType: BattlerTagType): boolean {
    const tags = this.summonData.tags;
    const tag = tags.find((t) => t.tagType === tagType);
    if (tag && !tag.lapse(this, BattlerTagLapseType.CUSTOM)) {
      tag.onRemove(this);
      tags.splice(tags.indexOf(tag), 1);
    }
    return !!tag;
  }

  /**
   * Lapses all {@linkcode BattlerTag}s attached to the pokemon with the specified lapse type
   * and then removes the ones that should be removed
   * @param lapseType - The {@linkcode BattlerTagLapseType} to trigger
   * @see {@linkcode BattlerTag.lapse}
   */
  public lapseTags(lapseType: BattlerTagLapseType): void {
    const tags = this.summonData.tags;
    tags
      .filter(
        (t) =>
          lapseType === BattlerTagLapseType.FAINT
          || (t.lapseTypes.some((lType) => lType === lapseType) && !t.lapse(this, lapseType)),
      )
      .forEach((t) => {
        t.onRemove(this);
        tags.splice(tags.indexOf(t), 1);
      });
  }

  /**
   * Removes a {@linkcode BattlerTag} from the pokemon without calling its `lapse()` method
   * @param tagType - The {@linkcode BattlerTagType} to remove
   * @returns Whether the specified tag was attached to the pokemon before being removed
   * @see {@linkcode BattlerTag.onRemove}
   */
  public removeTag(tagType: BattlerTagType): boolean {
    const tags = this.summonData.tags;
    const tag = tags.find((t) => t.tagType === tagType);
    if (tag) {
      tag.onRemove(this);
      tags.splice(tags.indexOf(tag), 1);
    }
    return !!tag;
  }

  /**
   * Removes all {@linkcode BattlerTag}s matching the input filter without calling their `lapse()` methods
   * @param tagFilter - The filter to apply
   */
  public findAndRemoveTags(tagFilter: (tag: BattlerTag) => boolean): void {
    const tags = this.summonData.tags;
    const tagsToRemove = this.findTags(tagFilter);
    for (const tag of tagsToRemove) {
      tag.turnCount = 0;
      tag.onRemove(this);
      tags.splice(tags.indexOf(tag), 1);
    }
  }

  /**
   * Removes all {@linkcode BattlerTag}s from the pokemon whose source was the specified pokemon ID
   * @param sourceId - The ID of the source pokemon
   */
  public removeTagsBySourceId(sourceId: number): void {
    this.findAndRemoveTags((t) => t.isSourceLinked() && t.sourceId === sourceId);
  }

  /**
   * Updates the source ID of all {@linkcode BattlerTag}s attached this pokemon
   * @param sourceId - The ID of the previous source pokemon
   * @param newSourceId - The ID of the new source pokemon
   * @todo Think of a better name for this, the tags aren't being transferred
   */
  public transferTagsBySourceId(sourceId: number, newSourceId: number): void {
    const tags = this.summonData.tags;
    // biome-ignore lint/suspicious/noAssignInExpressions: the return value of the assignment isn't being used
    tags.filter((t) => t.sourceId === sourceId).forEach((t) => (t.sourceId = newSourceId));
  }

  // #endregion

  /**
   * Transferring stat changes and Tags
   * @param source {@linkcode Pokemon} the pokemon whose stats/Tags are to be passed on from, ie: the Pokemon using Baton Pass
   */
  transferSummon(source: Pokemon): void {
    // Copy all stat stages
    for (const s of BATTLE_STATS) {
      const sourceStage = source.getStatStage(s);
      this.setStatStage(s, sourceStage);
    }

    for (const tag of source.summonData.tags) {
      if (!tag.isBatonPassable) {
        continue;
      }

      if (tag instanceof PowerTrickTag) {
        tag.swapStat(this);
      }

      this.summonData.tags.push(tag);
    }

    this.updateInfo();
  }

  /**
   * Gets whether the given move is currently disabled for this Pokemon.
   *
   * @param moveId ID of the {@linkcode MoveId | move} to check
   * @returns `true` if the move is disabled for this Pokemon, otherwise `false`
   *
   * @see {@linkcode MoveRestrictionBattlerTag}
   */
  public isMoveRestricted(moveId: MoveId, pokemon?: Pokemon): boolean {
    return this.getRestrictingTag(moveId, pokemon) !== null;
  }

  /**
   * Gets whether the given move is currently disabled for the user based on the player's target selection
   *
   * @param moveId ID of the {@linkcode MoveId | move} to check
   * @param user {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon | target} of the move
   *
   * @returns `true` if the move is disabled for this Pokemon due to the player's target selection
   *
   * @see {@linkcode MoveRestrictionBattlerTag}
   */
  isMoveTargetRestricted(moveId: MoveId, user: Pokemon, target: Pokemon): boolean {
    const restrictingTags = this.findTags<MoveRestrictionBattlerTag>((t) =>
      t.isType<MoveRestrictionBattlerTag>(...RESTRICTING_TAG_TYPES),
    );
    return restrictingTags.some((tag) => tag.isMoveTargetRestricted(moveId, user, target));
  }

  /**
   * Gets the {@link RestrictingBattlerTag} that is restricting a move, if it exists.
   *
   * @param moveId ID of the {@linkcode MoveId | move} to check
   * @param user {@linkcode Pokemon} using the move, used when the target is a factor in the move's restricted status
   * @param target the {@linkcode Pokemon | target} of the move, used when the target is a factor in the move's restricted status
   * @returns the first {@linkcode RestrictingBattlerTag | tag} on this Pokemon that restricts the move, or `null` if the move is not restricted.
   */
  getRestrictingTag(moveId: MoveId, user?: Pokemon, target?: Pokemon): RestrictingBattlerTag | null {
    for (const opponent of this.getOpponents()) {
      const imprisoningTag = opponent.getTag<ImprisoningTag>(BattlerTagType.IMPRISONING);
      if (imprisoningTag?.apply(opponent, true, this, moveId)) {
        return imprisoningTag;
      }
    }

    const restrictingTags = this.findTags<MoveRestrictionBattlerTag>((t) =>
      t.isType<MoveRestrictionBattlerTag>(...RESTRICTING_TAG_TYPES),
    );
    for (const tag of restrictingTags) {
      if (tag.isMoveRestricted(moveId, user)) {
        return tag;
      }
      if (user && target && tag.isMoveTargetRestricted(moveId, user, target)) {
        return tag;
      }
    }
    return null;
  }

  public getMoveHistory(): TurnMove[] {
    return this.summonData.moveHistory;
  }

  public pushMoveHistory(turnMove: TurnMove): void {
    if (!this.isOnField()) {
      return;
    }
    turnMove.turn = globalScene.currentBattle?.turn;
    this.getMoveHistory().push(turnMove);
  }

  /**
   * Returns a list of the most recent move entries in this Pokemon's move history.
   * The retrieved move entries are sorted in order from NEWEST to OLDEST.
   * @param moveCount The number of move entries to retrieve.
   *   If negative, retrieve the Pokemon's entire move history (equivalent to reversing the output of {@linkcode getMoveHistory()}).
   *   Default is `1`.
   * @returns A list of {@linkcode TurnMove}, as specified above.
   */
  getLastXMoves(moveCount: number = 1): TurnMove[] {
    const moveHistory = this.getMoveHistory();
    if (moveCount >= 0) {
      return moveHistory.slice(Math.max(moveHistory.length - moveCount, 0)).reverse();
    }
    return moveHistory.slice().reverse();
  }

  getMoveQueue(): TurnMove[] {
    return this.summonData.moveQueue;
  }

  changeForm(formChange: SpeciesFormChange): Promise<void> {
    return new Promise((resolve) => {
      this.formIndex = Math.max(
        this.species.forms.findIndex((f) => f.formKey === formChange.formKey),
        0,
      );
      this.generateName();
      const abilityCount = this.getSpeciesForm().getAbilityCount();
      if (this.abilityIndex >= abilityCount) {
        // Shouldn't happen
        this.abilityIndex = abilityCount - 1;
      }
      globalScene.gameData.setPokemonSeen(this, false);
      this.setScale(this.getSpriteScale());
      this.loadAssets().then(() => {
        this.calculateStats();
        globalScene.updateModifiers(this.isPlayer(), true);
        Promise.all([this.updateInfo(), globalScene.updateFieldScale()]).then(() => resolve());
      });
    });
  }

  cry(soundConfig?: Phaser.Types.Sound.SoundConfig): AnySound {
    return this.getSpeciesForm().cry(soundConfig);
  }

  faintCry(callback: VoidFunction): void {
    const key = this.species.getCryKey(this.formIndex);
    let rate = 0.85;
    const cry = globalScene.audioManager.playSound(key, { rate }) as AnySound;
    if (!cry || settings.effectiveFieldVolume === 0) {
      callback();
      return;
    }
    const sprite = this.getSprite();
    const tintSprite = this.getTintSprite();
    const delay = Math.max(globalScene.sound.get(key).totalDuration * 50, 25);

    let frameProgress = 0;
    let frameThreshold: number;

    sprite.anims.pause();
    tintSprite?.anims.pause();

    let faintCryTimer: Phaser.Time.TimerEvent | null = globalScene.time.addEvent({
      delay: fixedNumber(delay),
      repeat: -1,
      callback: () => {
        frameThreshold = sprite.anims.msPerFrame / rate;
        frameProgress += delay;
        while (frameProgress > frameThreshold) {
          if (sprite.anims.duration) {
            sprite.anims.nextFrame();
            tintSprite?.anims.nextFrame();
          }
          frameProgress -= frameThreshold;
        }
        if (cry && !cry.pendingRemove) {
          rate *= 0.99;
          cry.setRate(rate);
        } else {
          faintCryTimer?.destroy();
          faintCryTimer = null;
          if (callback) {
            callback();
          }
        }
      },
    });

    // Failsafe
    globalScene.time.delayedCall(fixedNumber(3000), () => {
      if (!faintCryTimer || !globalScene) {
        return;
      }
      if (cry?.isPlaying) {
        cry.stop();
      }
      faintCryTimer.destroy();
      if (callback) {
        callback();
      }
    });
  }

  isOppositeGender(pokemon: Pokemon): boolean {
    return (
      this.gender !== Gender.GENDERLESS
      && pokemon.gender === (this.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE)
    );
  }

  /**
   * Helper function that determines if a Pokemon has a specified non-volatile status effect and/or is confused
   * @param statusList - The status(es) to be checked
   * @param includeConfusion - (Default `false`) Whether Confusion should also be considered
   * @param ignoreMockAbility - (Default `false`) Whether abilities that act as a status effect (e.g. Comatose) should be ignored
   * @returns Whether the Pokemon has a status effect
   */
  hasStatusEffect(
    statusList: StatusEffect | StatusEffect[],
    includeConfusion: boolean = false,
    ignoreMockAbility: boolean = false,
  ): boolean {
    statusList = coerceArray(statusList);
    if (
      statusList.includes(this.getStatusEffect(ignoreMockAbility))
      || (includeConfusion && this.hasTag(BattlerTagType.CONFUSED))
    ) {
      return true;
    }
    return false;
  }

  /**
   * Helper function that checks if a Pokemon has one of any non-volatile status effects
   * and/or is confused (which is a volatile status effect but is lumped into this category for some status-recovery effects)
   * @param includeConfusion - (Default `false`) Whether Confusion should also be considered
   * @param ignoreMockAbility - (Default `false`) Whether abilities that act as a status effect (e.g. Comatose) should be ignored
   * @returns Whether the Pokemon has any non-volatile status effect
   */
  hasNonVolatileStatusEffect(includeConfusion: boolean = false, ignoreMockAbility: boolean = false): boolean {
    return this.hasStatusEffect([...NON_VOLATILE_STATUS_EFFECTS], includeConfusion, ignoreMockAbility);
  }

  /**
   * Helper function that retrieves the Pokemon's non-volatile status effect
   * @param ignoreMockAbility - (Default `false`) Whether abilities that act as a status effect (e.g. Comatose) should be ignored
   * @returns The Pokemon's current {@linkcode StatusEffect | status effect}
   */
  getStatusEffect(ignoreMockAbility: boolean = false): StatusEffect {
    const statusEffect = new NumberHolder(StatusEffect.NONE);
    if (this.status) {
      statusEffect.value = this.status.effect;
    }
    if (!ignoreMockAbility) {
      applyAbAttrs<MockStatusEffectAbAttr>(AbAttrFlag.MOCK_STATUS_EFFECT, this, false, statusEffect);
    }
    return statusEffect.value as StatusEffect;
  }

  /**
   * Checks if a status effect can be applied to the Pokemon.
   * @param effect - The {@linkcode StatusEffect | status effect} to check
   * @param quiet - (Default `false`) Whether in-battle messages should trigger or not
   * @param overrideStatus - (Default `false`) Whether the Pokemon's current status can be overriden
   * @param sourcePokemon - (Default `null`) The Pokemon that is setting the status effect, if applicable
   * @param ignoreField - (Default `false`) Whether to ignore field effects (weather, terrain, etc.)
   */
  canSetStatus(
    effect: StatusEffect,
    quiet: boolean = false,
    overrideStatus: boolean = false,
    sourcePokemon: Pokemon | null = null,
    ignoreField: boolean = false,
  ): boolean {
    if (overrideStatus ? this.status?.effect === effect : this.status) {
      return false;
    }
    if (this.isGrounded() && !ignoreField && globalScene.arena.hasTerrain(TerrainType.MISTY)) {
      return false;
    }

    if (sourcePokemon && sourcePokemon !== this && this.isSafeguarded(sourcePokemon)) {
      return false;
    }

    const types = this.getTypes(true, true);

    switch (effect) {
      case StatusEffect.POISON:
      case StatusEffect.TOXIC: {
        // Check if the Pokemon is immune to Poison/Toxic or if the source pokemon is canceling the immunity
        const poisonImmunity = types.map((defType) => {
          // Check if the Pokemon is not immune to Poison/Toxic
          if (defType !== ElementalType.POISON && defType !== ElementalType.STEEL) {
            return false;
          }

          // Check if the source Pokemon has an ability that cancels the Poison/Toxic immunity
          const cancelImmunity = new BooleanHolder(false);
          if (sourcePokemon) {
            applyAbAttrs<IgnoreTypeStatusEffectImmunityAbAttr>(
              AbAttrFlag.IGNORE_TYPE_STATUS_EFFECT_IMMUNITY,
              sourcePokemon,
              false,
              cancelImmunity,
              effect,
              defType,
            );
            if (cancelImmunity.value) {
              return false;
            }
          }

          return true;
        });

        if (
          (this.isOfType(ElementalType.POISON) || this.isOfType(ElementalType.STEEL))
          && poisonImmunity.includes(true)
        ) {
          return false;
        }
        break;
      }
      case StatusEffect.PARALYSIS:
        if (this.isOfType(ElementalType.ELECTRIC)) {
          return false;
        }
        break;
      case StatusEffect.SLEEP: {
        const preventSleep = new BooleanHolder(false);
        globalScene
          .getField(true)
          .forEach((p) => applyBattlerTags<UproarTag>(BattlerTagType.UPROAR, p, quiet, this, preventSleep));

        if (preventSleep.value || (this.isGrounded() && globalScene.arena.hasTerrain(TerrainType.ELECTRIC))) {
          return false;
        }
        break;
      }
      case StatusEffect.FREEZE:
        if (
          this.isOfType(ElementalType.ICE)
          || (!ignoreField && globalScene.arena.hasWeather([WeatherType.SUNNY, WeatherType.HARSH_SUN]))
        ) {
          return false;
        }
        break;
      case StatusEffect.BURN:
        if (this.isOfType(ElementalType.FIRE)) {
          return false;
        }
        break;
    }

    const cancelled = new BooleanHolder(false);
    applyAbAttrs<StatusEffectImmunityAbAttr>(AbAttrFlag.STATUS_EFFECT_IMMUNITY, this, quiet, effect, cancelled);

    const userField = this.getField();
    userField.forEach((pokemon) =>
      applyAbAttrs<UserFieldStatusEffectImmunityAbAttr>(
        AbAttrFlag.USER_FIELD_STATUS_EFFECT_IMMUNITY,
        pokemon,
        quiet,
        effect,
        cancelled,
      ),
    );

    if (cancelled.value) {
      return false;
    }

    return true;
  }

  /** @todo Refactor this */
  trySetStatus(
    effect: StatusEffect,
    asPhase: boolean = false,
    sourcePokemon: Pokemon | null = null,
    turnsRemaining: number = 0,
    sourceText: string | null = null,
  ): boolean {
    if (!this.canSetStatus(effect, !asPhase, false, sourcePokemon)) {
      return false;
    }
    if (this.isFainted()) {
      return false;
    }

    /**
     * If this Pokemon falls asleep or freezes in the middle of a multi-hit attack,
     * cancel the attack's subsequent hits.
     */
    if (effect === StatusEffect.SLEEP || effect === StatusEffect.FREEZE) {
      const currentPhase = globalScene.phaseManager.getCurrentPhase();
      if (currentPhase?.is("MoveEffectPhase") && currentPhase.getUserPokemon() === this) {
        this.stopMultiHit();
      }
    }

    if (asPhase) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "ObtainStatusEffectPhase",
        this.getBattlerIndex(),
        effect,
        turnsRemaining,
        sourceText,
        sourcePokemon,
      );
      return true;
    }

    const sleepTurnsRemaining: NumberHolder = new NumberHolder(0);

    if (effect === StatusEffect.SLEEP) {
      sleepTurnsRemaining.value =
        turnsRemaining !== 0
          ? turnsRemaining
          : this.randSeedIntRange(DEFAULT_MIN_SLEEP_DURATION, DEFAULT_MAX_SLEEP_DURATION);

      this.setFrameRate(4);

      const tag = this.getTag(...SEMI_INVULNERABLE_BATTLER_TAG_TYPES);

      if (tag) {
        this.removeTag(tag.tagType);
        this.getMoveQueue().pop();
      }
    }

    this.setStatus(effect, { sleepTurnsRemaining: sleepTurnsRemaining.value });

    globalScene.triggerPokemonFormChange(this, SpeciesFormChangeStatusEffectTrigger, true);
    if (sourcePokemon) {
      applyAbAttrs<SynchronizeStatusAbAttr>(AbAttrFlag.SYNCHRONIZE_STATUS, this, false, sourcePokemon, effect);
    }

    return true;
  }

  protected setStatus(
    effect: StatusEffect,
    { toxicTurnCount = 0, sleepTurnsRemaining = 0 }: Partial<Omit<Status, "effect">>,
  ): void {
    this.status = {
      effect,
      toxicTurnCount,
      sleepTurnsRemaining,
    };
  }

  public advanceStatusCounter(): void {
    if (!this.status) {
      return;
    }
    switch (this.status.effect) {
      case StatusEffect.TOXIC:
        this.status.toxicTurnCount++;
        break;
      case StatusEffect.SLEEP:
        if (activeOverrides.STATUS_ACTIVATION_OVERRIDE === true) {
          this.status.sleepTurnsRemaining = Math.max(this.status.sleepTurnsRemaining, 1);
          break;
        }
        if (activeOverrides.STATUS_ACTIVATION_OVERRIDE === false) {
          this.status.sleepTurnsRemaining = 0;
          break;
        }
        this.status.sleepTurnsRemaining--;
        break;
      default:
        // intentionally left blank
        break;
    }
  }

  /** If the pokemon is statused, reset {@linkcode toxicTurnCount} to 0 */
  public resetToxicTurnCounter(): void {
    if (!this.status) {
      return;
    }
    this.status.toxicTurnCount = 0;
  }

  /**
   * Resets the status of a pokemon.
   * @param confusion - (Default `false`) Whether to include confusion
   * @param reloadAssets - (Default `false`) Whether to reload the assets
   */
  resetStatus(confusion: boolean = false, reloadAssets: boolean = false): void {
    const lastStatus = this.getStatusEffect(true);
    this.status = null;
    if (lastStatus === StatusEffect.SLEEP) {
      this.setFrameRate(10);
      this.lapseTag(BattlerTagType.NIGHTMARE);
    }
    if (confusion) {
      this.lapseTag(BattlerTagType.CONFUSED);
    }
    if (reloadAssets) {
      this.loadAssets(false).then(() => this.playAnim());
    }
  }

  /**
   * Checks if this Pokemon is protected by Safeguard
   * @param attacker - The {@linkcode Pokemon} inflicting a status on this Pokemon
   * @returns Whether this Pokemon is protected by Safeguard
   */
  isSafeguarded(attacker: Pokemon): boolean {
    const defendingSide = this.getArenaTagSide();
    if (globalScene.arena.hasTag(ArenaTagType.SAFEGUARD, defendingSide)) {
      const bypassed = new BooleanHolder(false);
      if (attacker) {
        applyAbAttrs<InfiltratorAbAttr>(AbAttrFlag.INFILTRATOR, attacker, false, bypassed);
      }
      return !bypassed.value;
    }
    return false;
  }

  public primeSummonData(summonDataPrimer: PokemonSummonData): void {
    this.summonDataPrimer = summonDataPrimer;
  }

  /**
   * Resets {@linkcode summonData} to the default values.
   *
   * @todo This currently checks for the existence of {@linkcode summonDataPrimer} and
   * applies its values to `summonData` if it exists. `summonDataPrimer` should be removed.
   */
  public resetSummonData(): void {
    this.summonData = {
      statStages: [0, 0, 0, 0, 0, 0, 0],
      moveQueue: [],
      tags: [],
      abilitySuppressed: false,
      abilitiesApplied: [],
      speciesForm: null,
      ability: AbilityId.NONE,
      passiveAbility: AbilityId.NONE,
      gender: null,
      stats: [0, 0, 0, 0, 0, 0],
      moveset: [],
      types: [],
      addedType: null,
      turnCount: 0,
      waveTurnCount: 0,
      moveHistory: [],
      toJSON: summonDataToJSON,
    };
    this.setSwitchOutStatus(false);
    if (globalScene) {
      globalScene.triggerPokemonFormChange(this, SpeciesFormChangePostMoveTrigger, true);
    }
    if (this.summonDataPrimer) {
      for (const k of Object.keys(this.summonData)) {
        if (this.summonDataPrimer[k]) {
          this.summonData[k] = this.summonDataPrimer[k];
        }
      }

      // If this Pokemon has a Substitute when loading in, play an animation to add its sprite
      const subTag = this.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);
      if (subTag) {
        globalScene.triggerPokemonBattleAnim(this, PokemonAnimType.SUBSTITUTE_ADD);
        subTag.sourceInFocus = false;
      }

      // If this Pokemon has Commander and Dondozo as an active ally, hide this Pokemon's sprite.
      if (
        this.hasAbilityWithAttr(AbAttrFlag.COMMANDER)
        && globalScene.currentBattle.double
        && this.getAlly()?.species.speciesId === SpeciesId.DONDOZO
      ) {
        this.setVisible(false);
      }
      this.summonDataPrimer = null;
    }
    if (this.battleInfo) {
      this.updateInfo();
    }
  }

  public resetWaveData(): void {
    this.waveData = {
      hitCount: 0,
      berriesEaten: [],
      abilitiesApplied: [],
      abilitiesRevealed: [],
    };
  }

  public resetTurnData(): void {
    this.turnData = {
      flinched: false,
      acted: false,
      hitCount: 0,
      hitsLeft: -1,
      totalDamageDealt: 0,
      singleHitDamageDealt: 0,
      damageTaken: 0,
      attacksReceived: [],
      order: 0,
      statStagesIncreased: false,
      statStagesDecreased: false,
      moveEffectiveness: null,
      switchedInThisTurn: false,
      failedRunAway: false,
      joinedRound: false,
    };
  }

  public resetCustomPokemonData(data: Partial<CustomPokemonData> = {}): void {
    const { spriteScale = -1, ability = -1, passive = -1, nature = -1, types = [] } = data;
    this.customPokemonData = { spriteScale, ability, passive, nature, types: [...types] };
  }

  /**
   * Custom legacy exp formula to multiply the base exp (along with form modifiers) by level/5 +1
   */
  getExpValue(): number {
    // Logic to factor in victor level has been removed for balancing purposes, so the player doesn't have to focus on EXP maxxing
    return (this.getSpeciesForm().getBaseExp() * this.level) / 5 + 1;
  }

  stopMultiHit(): void {
    this.turnData.hitCount = 1;
    this.turnData.hitsLeft = 1;
  }

  setFrameRate(frameRate: number) {
    globalScene.anims.get(this.getBattleSpriteKey()).frameRate = frameRate;
    this.playAnim();
  }

  tint(color: number, alpha?: number, duration?: number, ease?: string) {
    const tintSprite = this.getTintSprite();
    tintSprite?.setTintFill(color);
    tintSprite?.setVisible(true);

    if (duration) {
      tintSprite?.setAlpha(0);

      globalScene.tweens.add({
        targets: tintSprite,
        alpha: alpha || 1,
        duration,
        ease: ease || "Linear",
      });
    } else {
      tintSprite?.setAlpha(alpha);
    }
  }

  untint(duration: number, ease?: string) {
    const tintSprite = this.getTintSprite();

    if (duration) {
      globalScene.tweens.add({
        targets: tintSprite,
        alpha: 0,
        duration,
        ease: ease || "Linear",
        onComplete: () => {
          tintSprite?.setVisible(false);
          tintSprite?.setAlpha(1);
        },
      });
    } else {
      tintSprite?.setVisible(false);
      tintSprite?.setAlpha(1);
    }
  }

  enableMask() {
    if (!this.maskEnabled) {
      this.maskSprite = this.getTintSprite();
      this.maskSprite?.setVisible(true);
      this.maskSprite?.setPosition(
        this.x * this.parentContainer.scale + this.parentContainer.x,
        this.y * this.parentContainer.scale + this.parentContainer.y,
      );
      this.maskSprite?.setScale(this.getSpriteScale() * this.parentContainer.scale);
      this.maskEnabled = true;
    }
  }

  disableMask() {
    if (this.maskEnabled) {
      this.maskSprite?.setVisible(false);
      this.maskSprite?.setPosition(0, 0);
      this.maskSprite?.setScale(this.getSpriteScale());
      this.maskSprite = null;
      this.maskEnabled = false;
    }
  }

  sparkle(): void {
    if (this.shinySparkle) {
      globalScene.animations.doShinySparkleAnim(this.shinySparkle, this.variant);
    }
  }

  /**
   * Generates a random number using the current battle's seed, or the global seed if {@linkcode globalScene.currentBattle} is falsy
   * This calls either {@linkcode BattleScene.randBattleSeedInt}({@linkcode range}, {@linkcode min}) in `src/battle-scene.ts`
   * which calls {@linkcode Battle.randSeedInt}({@linkcode range}, {@linkcode min}) in `src/battle.ts`
   * which calls {@linkcode randSeedInt randSeedInt}({@linkcode range}, {@linkcode min}) in `src/utils.ts`,
   * or it directly calls {@linkcode randSeedInt randSeedInt}({@linkcode range}, {@linkcode min}) in `src/utils.ts` if there is no current battle
   *
   * @param range How large of a range of random numbers to choose from. If {@linkcode range} <= 1, returns {@linkcode min}
   * @param min The minimum integer to pick, default `0`
   * @returns A random integer between {@linkcode min} and ({@linkcode min} + {@linkcode range} - 1)
   */
  randSeedInt(range: number, min: number = 0): number {
    return globalScene.currentBattle ? globalScene.randBattleSeedInt(range, min) : randSeedInt(range, min);
  }

  /**
   * Generates a random number using the current battle's seed, or the global seed if `globalScene.currentBattle` is falsy
   * @param min The minimum integer to generate
   * @param max The maximum integer to generate
   * @returns a random integer between {@linkcode min} and {@linkcode max} inclusive
   */
  randSeedIntRange(min: number, max: number): number {
    return this.randSeedInt(max - min + 1, min);
  }

  /**
   * Causes a Pokemon to leave the field (such as in preparation for a switch out/escape).
   * @param clearEffects Indicates if effects should be cleared (true) or passed
   * to the next pokemon, such as during a baton pass (false)
   * @param hideInfo Indicates if this should also play the animation to hide the Pokemon's
   * info container.
   */
  leaveField(clearEffects: boolean = true, hideInfo: boolean = true) {
    this.resetSprite();
    this.resetTurnData();
    if (clearEffects) {
      this.destroySubstitute();
      this.resetSummonData();
    }
    if (hideInfo) {
      this.hideInfo();
    }
    globalScene.field.remove(this);
    this.setSwitchOutStatus(true);
    globalScene.triggerPokemonFormChange(this, SpeciesFormChangeActiveTrigger, true);
  }

  override destroy(): void {
    this.battleInfo?.destroy();
    this.destroySubstitute();
    super.destroy();
  }

  getBattleInfo(): BattleInfo {
    return this.battleInfo;
  }

  /**
   * Checks whether or not the Pokemon's root form has the same ability
   * @param abilityIndex the given ability index we are checking
   * @returns true if the abilities are the same
   */
  hasSameAbilityInRootForm(abilityIndex: number): boolean {
    const currentAbilityIndex = this.abilityIndex;
    const rootForm = getPokemonSpecies(this.species.getRootSpeciesId());
    return rootForm.getAbility(abilityIndex) === rootForm.getAbility(currentAbilityIndex);
  }

  /**
   * Helper function to check if the player already owns the starter data of the Pokemon's
   * current ability
   * @param ownedAbilityAttrs the owned abilityAttr of this Pokemon's root form
   * @returns true if the player already has it, false otherwise
   */
  checkIfPlayerHasAbilityOfStarter(ownedAbilityAttrs: number): boolean {
    if ((ownedAbilityAttrs & AbilityAttr.ABILITY_1) > 0 && this.hasSameAbilityInRootForm(0)) {
      return true;
    }
    if ((ownedAbilityAttrs & AbilityAttr.ABILITY_2) > 0 && this.hasSameAbilityInRootForm(1)) {
      return true;
    }
    if ((ownedAbilityAttrs & AbilityAttr.ABILITY_HIDDEN) > 0 && this.hasSameAbilityInRootForm(2)) {
      return true;
    }
    return false;
  }

  /**
   * Reduces one of this Pokemon's held item stacks by 1, and removes the item if applicable.
   * Does nothing if this Pokemon is somehow not the owner of the held item.
   * @param heldItem The item stack to be reduced by 1.
   * @param forBattle If `false`, do not trigger in-battle effects (such as Unburden) from losing the item. For example, set this to `false` if the Pokemon is giving away the held item for a Mystery Encounter. Default is `true`.
   * @returns `true` if the item was removed successfully, `false` otherwise.
   */
  public loseHeldItem(heldItem: PokemonHeldItemModifier, forBattle: boolean = true): boolean {
    if (heldItem.pokemonId === -1 || heldItem.pokemonId === this.id) {
      heldItem.stackCount--;
      if (heldItem.stackCount <= 0) {
        globalScene.removeModifier(heldItem, !this.isPlayer());
      }
      if (forBattle) {
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, this, false);
      }
      return true;
    }
    return false;
  }
}

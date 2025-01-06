import type { BattlerIndex } from "#app/battle";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Localizable } from "#app/interfaces/locales";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  PokemonMoveAccuracyBoosterModifier,
  PokemonMultiHitModifier,
  AttackTypeBoosterModifier,
} from "#app/modifier/modifier";
import type { Constructor, nil } from "#app/utils";
import { BooleanHolder, NumberHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveFlags } from "#enums/move-flags";
import { MoveTarget } from "#enums/move-target";
import { Moves } from "#enums/moves";
import { Type } from "#enums/type";
import { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { AllyMoveCategoryPowerBoostAbAttr } from "./ab-attrs/ally-move-category-power-boost-ab-attr";
import { ChangeMovePriorityAbAttr } from "./ab-attrs/change-move-priority-ab-attr";
import { FieldMoveTypePowerBoostAbAttr } from "./ab-attrs/field-move-type-power-boost-ab-attr";
import { IgnoreContactAbAttr } from "./ab-attrs/ignore-contact-ab-attr";
import { IgnoreProtectOnContactAbAttr } from "./ab-attrs/ignore-protect-on-contact-ab-attr";
import { InfiltratorAbAttr } from "./ab-attrs/infiltrator-ab-attr";
import { MoveAbilityBypassAbAttr } from "./ab-attrs/move-ability-bypass-ab-attr";
import { MoveTypeChangeAbAttr } from "./ab-attrs/move-type-change-ab-attr";
import { UserFieldMoveTypePowerBoostAbAttr } from "./ab-attrs/user-field-move-type-power-boost-ab-attr";
import { VariableMovePowerAbAttr } from "./ab-attrs/variable-move-power-ab-attr";
import { WonderSkinAbAttr } from "./ab-attrs/wonder-skin-ab-attr";
import { applyAbAttrs, applyPreAttackAbAttrs, applyPreDefendAbAttrs } from "./ability";
import { WeakenMoveTypeTag } from "./arena-tag";
import { HelpingHandTag, TypeBoostTag } from "./battler-tags";
import { IncrementMovePriorityAttr } from "./move-attrs/increment-move-priority-attr";
import type { MoveAttr } from "./move-attrs/move-attr";
import { MultiHitAttr } from "./move-attrs/multi-hit-attr";
import { OneHitKOAccuracyAttr } from "./move-attrs/one-hit-ko-accuracy-attr";
import { SacrificialAttr } from "./move-attrs/sacrificial-attr";
import { SacrificialAttrOnHit } from "./move-attrs/sacrificial-attr-on-hit";
import { TypelessAttr } from "./move-attrs/typeless-attr";
import { VariableAccuracyAttr } from "./move-attrs/variable-accuracy-attr";
import { VariablePowerAttr } from "./move-attrs/variable-power-attr";
import { VariableTargetAttr } from "./move-attrs/variable-target-attr";
import type { MoveConditionFunc } from "./move-conditions";
import { MoveCondition } from "./move-conditions";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { HealStatusEffectAttr } from "./move-attrs/heal-status-effect-attr";
import { VariableAtkAttr } from "./move-attrs/variable-atk-attr";
import { ChargeAnim } from "./battle-anims";
import { allMoves } from "#app/data/all-moves";

export abstract class Move implements Localizable {
  public id: Moves;
  public name: string;
  private _type: Type;
  private _category: MoveCategory;
  public moveTarget: MoveTarget;
  public power: number;
  public accuracy: number;
  public pp: number;
  public effect: string;
  /** The chance of a move's secondary effects activating */
  public chance: number;
  public priority: number;
  public generation: number;
  public attrs: MoveAttr[] = [];
  private conditions: MoveCondition[] = [];
  /** The move's {@linkcode MoveFlags} */
  private flags: number = 0;
  private nameAppend: string = "";

  constructor(
    id: Moves,
    type: Type,
    category: MoveCategory,
    defaultMoveTarget: MoveTarget,
    power: number,
    accuracy: number,
    pp: number,
    chance: number,
    priority: number,
    generation: number,
  ) {
    this.id = id;
    this._type = type;
    this._category = category;
    this.moveTarget = defaultMoveTarget;
    this.power = power;
    this.accuracy = accuracy;
    this.pp = pp;
    this.chance = chance;
    this.priority = priority;
    this.generation = generation;

    if (defaultMoveTarget === MoveTarget.USER) {
      this.setFlag(MoveFlags.IGNORE_PROTECT, true);
    }
    if (category === MoveCategory.PHYSICAL) {
      this.setFlag(MoveFlags.MAKES_CONTACT, true);
    }

    this.localize();
  }

  get type() {
    return this._type;
  }
  get category() {
    return this._category;
  }

  localize(): void {
    const i18nKey = Moves[this.id]
      .split("_")
      .filter((f) => f)
      .map((f, i) => (i ? `${f[0]}${f.slice(1).toLowerCase()}` : f.toLowerCase()))
      .join("") as unknown as string;

    this.name = this.id ? `${i18next.t(`move:${i18nKey}.name`)}${this.nameAppend}` : "";
    this.effect = this.id ? `${i18next.t(`move:${i18nKey}.effect`)}${this.nameAppend}` : "";
  }

  /**
   * Get all move attributes that match `attrType`
   * @param attrType any attribute that extends {@linkcode MoveAttr}
   * @returns Array of attributes that match `attrType`, Empty Array if none match.
   */
  getAttrs<T extends MoveAttr>(attrType: Constructor<T>): T[] {
    return this.attrs.filter((a): a is T => a instanceof attrType);
  }

  /**
   * Check if a move has an attribute that matches `attrType`
   * @param attrType any attribute that extends {@linkcode MoveAttr}
   * @returns true if the move has attribute `attrType`
   */
  hasAttr<T extends MoveAttr>(attrType: Constructor<T>): boolean {
    return this.attrs.some((attr) => attr instanceof attrType);
  }

  /**
   * Takes as input a boolean function and returns the first MoveAttr in attrs that matches true
   * @param attrPredicate
   * @returns the first {@linkcode MoveAttr} element in attrs that makes the input function return true
   */
  findAttr(attrPredicate: (attr: MoveAttr) => boolean): MoveAttr {
    return this.attrs.find(attrPredicate)!; // TODO: is the bang correct?
  }

  /**
   * Adds a new MoveAttr to the move (appends to the attr array)
   * if the MoveAttr also comes with a condition, also adds that to the conditions array: {@linkcode MoveCondition}
   * @param AttrType {@linkcode MoveAttr} the constructor of a MoveAttr class
   * @param args the args needed to instantiate a the given class
   * @returns the called object {@linkcode Move}
   */
  attr<T extends Constructor<MoveAttr>>(AttrType: T, ...args: ConstructorParameters<T>): this {
    const attr = new AttrType(...args);
    this.attrs.push(attr);
    let attrCondition = attr.getCondition();
    if (attrCondition) {
      if (typeof attrCondition === "function") {
        attrCondition = new MoveCondition(attrCondition);
      }
      this.conditions.push(attrCondition);
    }

    return this;
  }

  /**
   * Adds a new MoveAttr to the move (appends to the attr array)
   * if the MoveAttr also comes with a condition, also adds that to the conditions array: {@linkcode MoveCondition}
   * Almost identical to {@link attr}, except you are passing in a MoveAttr object, instead of a constructor and it's arguments
   * @param attrAdd {@linkcode MoveAttr} the attribute to add
   * @returns the called object {@linkcode Move}
   */
  addAttr(attrAdd: MoveAttr): this {
    this.attrs.push(attrAdd);
    let attrCondition = attrAdd.getCondition();
    if (attrCondition) {
      if (typeof attrCondition === "function") {
        attrCondition = new MoveCondition(attrCondition);
      }
      this.conditions.push(attrCondition);
    }

    return this;
  }

  /**
   * Sets the move target of this move
   * @param moveTarget {@linkcode MoveTarget} the move target to set
   * @returns the called object {@linkcode Move}
   */
  target(moveTarget: MoveTarget): this {
    this.moveTarget = moveTarget;
    return this;
  }

  /**
   * Getter function that returns if this Move has a MoveFlag
   * @param flag {@linkcode MoveFlags} to check
   * @returns boolean
   */
  hasFlag(flag: MoveFlags): boolean {
    // internally it is taking the bitwise AND (MoveFlags are represented as bit-shifts) and returning False if result is 0 and true otherwise
    return !!(this.flags & flag);
  }

  /**
   * Getter function that returns if the move hits multiple targets
   * @returns boolean
   */
  isMultiTarget(): boolean {
    switch (this.moveTarget) {
      case MoveTarget.ALL_OTHERS:
      case MoveTarget.ALL_NEAR_OTHERS:
      case MoveTarget.ALL_NEAR_ENEMIES:
      case MoveTarget.ALL_ENEMIES:
      case MoveTarget.USER_AND_ALLIES:
      case MoveTarget.ALL:
      case MoveTarget.USER_SIDE:
      case MoveTarget.ENEMY_SIDE:
      case MoveTarget.BOTH_SIDES:
        return true;
    }
    return false;
  }

  /**
   * Getter function that returns if the move targets the user or its ally
   * @returns boolean
   */
  isAllyTarget(): boolean {
    switch (this.moveTarget) {
      case MoveTarget.USER:
      case MoveTarget.NEAR_ALLY:
      case MoveTarget.ALLY:
      case MoveTarget.USER_OR_NEAR_ALLY:
      case MoveTarget.USER_AND_ALLIES:
      case MoveTarget.USER_SIDE:
        return true;
    }
    return false;
  }

  isFieldTarget(): boolean {
    switch (this.moveTarget) {
      case MoveTarget.BOTH_SIDES:
      case MoveTarget.USER_SIDE:
      case MoveTarget.ENEMY_SIDE:
        return true;
    }
    return false;
  }

  isChargingMove(): this is ChargingMove {
    return false;
  }

  /**
   * Checks if the move is immune to certain types.
   * Currently looks at cases of Grass types with powder moves and Dark types with moves affected by Prankster.
   * @param user the source of this move
   * @param target the target of this move
   * @param type the type of the move's target
   * @returns boolean
   */
  isTypeImmune(user: Pokemon, target: Pokemon, type: Type): boolean {
    if (this.moveTarget === MoveTarget.USER) {
      return false;
    }

    switch (type) {
      case Type.GRASS:
        if (this.hasFlag(MoveFlags.POWDER_MOVE)) {
          return true;
        }
        break;
      case Type.DARK:
        if (
          user.hasAbility(Abilities.PRANKSTER)
          && this.category === MoveCategory.STATUS
          && user.isPlayer() !== target.isPlayer()
        ) {
          return true;
        }
        break;
    }
    return false;
  }

  /**
   * Checks if the move would hit its target's Substitute instead of the target itself.
   * @param user The {@linkcode Pokemon} using this move
   * @param target The {@linkcode Pokemon} targeted by this move
   * @returns `true` if the move can bypass the target's Substitute; `false` otherwise.
   */
  hitsSubstitute(user: Pokemon, target: Pokemon | nil): boolean {
    if (
      [MoveTarget.USER, MoveTarget.USER_SIDE, MoveTarget.ENEMY_SIDE, MoveTarget.BOTH_SIDES].includes(this.moveTarget)
      || !target?.getTag(BattlerTagType.SUBSTITUTE)
    ) {
      return false;
    }

    const bypassed = new BooleanHolder(false);
    // TODO: Allow this to be simulated
    applyAbAttrs(InfiltratorAbAttr, user, null, false, bypassed);

    return !bypassed.value && !this.hasFlag(MoveFlags.SOUND_BASED) && !this.hasFlag(MoveFlags.IGNORE_SUBSTITUTE);
  }

  /**
   * Adds a move condition to the move
   * @param condition {@linkcode MoveCondition} or {@linkcode MoveConditionFunc}, appends to conditions array a new MoveCondition object
   * @returns the called object {@linkcode Move}
   */
  condition(condition: MoveCondition | MoveConditionFunc): this {
    if (typeof condition === "function") {
      condition = new MoveCondition(condition as MoveConditionFunc);
    }
    this.conditions.push(condition);

    return this;
  }

  /**
   * Internal dev flag for documenting edge cases. When using this, please document the known edge case.
   * @returns the called object {@linkcode Move}
   */
  edgeCase(): this {
    return this;
  }

  /**
   * Marks the move as "partial": appends texts to the move name
   * @returns the called object {@linkcode Move}
   */
  partial(): this {
    this.nameAppend += " (P)";
    return this;
  }

  /**
   * Marks the move as "unimplemented": appends texts to the move name
   * @returns the called object {@linkcode Move}
   */
  unimplemented(): this {
    this.nameAppend += " (N)";
    return this;
  }

  /**
   * Sets the flags of the move
   * @param flag {@linkcode MoveFlags}
   * @param on a boolean, if True, then "ORs" the flag onto existing ones, if False then "XORs" the flag onto existing ones
   */
  private setFlag(flag: MoveFlags, on: boolean): void {
    // bitwise OR and bitwise XOR respectively
    if (on) {
      this.flags |= flag;
    } else {
      this.flags ^= flag;
    }
  }

  /**
   * Sets the {@linkcode MoveFlags.MAKES_CONTACT} flag for the calling Move
   * @param setFlag Default `true`, set to `false` if the move doesn't make contact
   * @see {@linkcode Abilities.STATIC}
   * @returns The {@linkcode Move} that called this function
   */
  makesContact(setFlag: boolean = true): this {
    this.setFlag(MoveFlags.MAKES_CONTACT, setFlag);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_PROTECT} flag for the calling Move
   * @see {@linkcode Moves.CURSE}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresProtect(): this {
    this.setFlag(MoveFlags.IGNORE_PROTECT, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_VIRTUAL} flag for the calling Move
   * @see {@linkcode Moves.NATURE_POWER}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresVirtual(): this {
    this.setFlag(MoveFlags.IGNORE_VIRTUAL, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.SOUND_BASED} flag for the calling Move
   * @see {@linkcode Moves.UPROAR}
   * @returns The {@linkcode Move} that called this function
   */
  soundBased(): this {
    this.setFlag(MoveFlags.SOUND_BASED, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.HIDE_USER} flag for the calling Move
   * @see {@linkcode Moves.TELEPORT}
   * @returns The {@linkcode Move} that called this function
   */
  hidesUser(): this {
    this.setFlag(MoveFlags.HIDE_USER, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.HIDE_TARGET} flag for the calling Move
   * @see {@linkcode Moves.WHIRLWIND}
   * @returns The {@linkcode Move} that called this function
   */
  hidesTarget(): this {
    this.setFlag(MoveFlags.HIDE_TARGET, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.BITING_MOVE} flag for the calling Move
   * @see {@linkcode Moves.BITE}
   * @returns The {@linkcode Move} that called this function
   */
  bitingMove(): this {
    this.setFlag(MoveFlags.BITING_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.PULSE_MOVE} flag for the calling Move
   * @see {@linkcode Moves.WATER_PULSE}
   * @returns The {@linkcode Move} that called this function
   */
  pulseMove(): this {
    this.setFlag(MoveFlags.PULSE_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.PUNCHING_MOVE} flag for the calling Move
   * @see {@linkcode Moves.DRAIN_PUNCH}
   * @returns The {@linkcode Move} that called this function
   */
  punchingMove(): this {
    this.setFlag(MoveFlags.PUNCHING_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.SLICING_MOVE} flag for the calling Move
   * @see {@linkcode Moves.X_SCISSOR}
   * @returns The {@linkcode Move} that called this function
   */
  slicingMove(): this {
    this.setFlag(MoveFlags.SLICING_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.RECKLESS_MOVE} flag for the calling Move
   * @see {@linkcode Abilities.RECKLESS}
   * @returns The {@linkcode Move} that called this function
   */
  recklessMove(): this {
    this.setFlag(MoveFlags.RECKLESS_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.BALLBOMB_MOVE} flag for the calling Move
   * @see {@linkcode Moves.ELECTRO_BALL}
   * @returns The {@linkcode Move} that called this function
   */
  ballBombMove(): this {
    this.setFlag(MoveFlags.BALLBOMB_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.POWDER_MOVE} flag for the calling Move
   * @see {@linkcode Moves.STUN_SPORE}
   * @returns The {@linkcode Move} that called this function
   */
  powderMove(): this {
    this.setFlag(MoveFlags.POWDER_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.DANCE_MOVE} flag for the calling Move
   * @see {@linkcode Moves.PETAL_DANCE}
   * @returns The {@linkcode Move} that called this function
   */
  danceMove(): this {
    this.setFlag(MoveFlags.DANCE_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.WIND_MOVE} flag for the calling Move
   * @see {@linkcode Moves.HURRICANE}
   * @returns The {@linkcode Move} that called this function
   */
  windMove(): this {
    this.setFlag(MoveFlags.WIND_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.TRIAGE_MOVE} flag for the calling Move
   * @see {@linkcode Moves.ABSORB}
   * @returns The {@linkcode Move} that called this function
   */
  triageMove(): this {
    this.setFlag(MoveFlags.TRIAGE_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_ABILITIES} flag for the calling Move
   * @see {@linkcode Moves.SUNSTEEL_STRIKE}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresAbilities(): this {
    this.setFlag(MoveFlags.IGNORE_ABILITIES, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.CHECK_ALL_HITS} flag for the calling Move
   * @see {@linkcode Moves.TRIPLE_AXEL}
   * @returns The {@linkcode Move} that called this function
   */
  checkAllHits(): this {
    this.setFlag(MoveFlags.CHECK_ALL_HITS, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_SUBSTITUTE} flag for the calling Move
   * @see {@linkcode Moves.WHIRLWIND}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresSubstitute(): this {
    this.setFlag(MoveFlags.IGNORE_SUBSTITUTE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.REDIRECT_COUNTER} flag for the calling Move
   * @see {@linkcode Moves.METAL_BURST}
   * @returns The {@linkcode Move} that called this function
   */
  redirectCounter(): this {
    this.setFlag(MoveFlags.REDIRECT_COUNTER, true);
    return this;
  }

  /**
   * Checks if the move flag applies to the pokemon(s) using/receiving the move
   * @param flag {@linkcode MoveFlags} MoveFlag to check on user and/or target
   * @param user {@linkcode Pokemon} the Pokemon using the move
   * @param target {@linkcode Pokemon} the Pokemon receiving the move
   * @returns boolean
   */
  checkFlag(flag: MoveFlags, user: Pokemon, target: Pokemon | null): boolean {
    // special cases below, eg: if the move flag is MAKES_CONTACT, and the user pokemon has an ability that ignores contact (like "Long Reach"), then overrides and move does not make contact
    switch (flag) {
      case MoveFlags.MAKES_CONTACT:
        if (user.hasAbilityWithAttr(IgnoreContactAbAttr) || this.hitsSubstitute(user, target)) {
          return false;
        }
        break;
      case MoveFlags.IGNORE_ABILITIES:
        if (user.hasAbilityWithAttr(MoveAbilityBypassAbAttr)) {
          const abilityEffectsIgnored = new BooleanHolder(false);
          applyAbAttrs(MoveAbilityBypassAbAttr, user, abilityEffectsIgnored, false, this);
          if (abilityEffectsIgnored.value) {
            return true;
          }
        }
        break;
      case MoveFlags.IGNORE_PROTECT:
        if (
          user.hasAbilityWithAttr(IgnoreProtectOnContactAbAttr)
          && this.checkFlag(MoveFlags.MAKES_CONTACT, user, null)
        ) {
          return true;
        }
        break;
    }

    return !!(this.flags & flag);
  }

  /**
   * Applies each {@linkcode MoveCondition} function of this move to the params, determines if the move can be used prior to calling each attribute's apply()
   * @param user {@linkcode Pokemon} to apply conditions to
   * @param target {@linkcode Pokemon} to apply conditions to
   * @param move {@linkcode Move} to apply conditions to
   * @returns boolean: false if any of the apply()'s return false, else true
   */
  applyConditions(user: Pokemon, target: Pokemon, move: Move): boolean {
    for (const condition of this.conditions) {
      if (!condition.apply(user, target, move)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Sees if a move has a custom failure text (by looking at each {@linkcode MoveAttr} of this move)
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @param cancelled {@linkcode BooleanHolder} to hold boolean value
   * @returns string of the custom failure text, or `null` if it uses the default text ("But it failed!")
   */
  getFailedText(user: Pokemon, target: Pokemon, move: Move, cancelled: BooleanHolder): string | null {
    for (const attr of this.attrs) {
      const failedText = attr.getFailedText(user, target, move, cancelled);
      if (failedText !== null) {
        return failedText;
      }
    }
    return null;
  }

  /**
   * Calculates the userBenefitScore across all the attributes and conditions
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @returns integer representing the total benefitScore
   */
  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let score = 0;

    for (const attr of this.attrs) {
      score += attr.getUserBenefitScore(user, target, move);
    }

    for (const condition of this.conditions) {
      score += condition.getUserBenefitScore(user, target, move);
    }

    return score;
  }

  /**
   * Calculates the targetBenefitScore across all the attributes
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @returns integer representing the total benefitScore
   */
  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let score = 0;

    if (target.getAlly()?.getTag(BattlerTagType.COMMANDED)?.getSourcePokemon() === target) {
      return 20 * (target.isPlayer() === user.isPlayer() ? -1 : 1); // always -20 with how the AI handles this score
    }

    for (const attr of this.attrs) {
      // conditionals to check if the move is self targeting (if so then you are applying the move to yourself, not the target)
      score +=
        attr.getTargetBenefitScore(user, !attr.selfTarget ? target : user, move)
        * (target !== user && attr.selfTarget ? -1 : 1);
    }

    return score;
  }

  /**
   * Calculates the accuracy of a move in battle based on various conditions and attributes.
   *
   * @param user {@linkcode Pokemon} The Pokémon using the move.
   * @param target {@linkcode Pokemon} The Pokémon being targeted by the move.
   * @returns The calculated accuracy of the move.
   */
  calculateBattleAccuracy(user: Pokemon, target: Pokemon, simulated: boolean = false) {
    const moveAccuracy = new NumberHolder(this.accuracy);

    applyMoveAttrs(VariableAccuracyAttr, user, target, this, moveAccuracy);
    applyPreDefendAbAttrs(WonderSkinAbAttr, target, user, this, { value: false }, simulated, moveAccuracy);

    if (moveAccuracy.value === -1) {
      return moveAccuracy.value;
    }

    const isOhko = this.hasAttr(OneHitKOAccuracyAttr);

    if (!isOhko) {
      globalScene.applyModifiers(PokemonMoveAccuracyBoosterModifier, user.isPlayer(), user, moveAccuracy);
    }

    if (globalScene.arena.weather?.weatherType === WeatherType.FOG) {
      /**
       *  The 0.9 multiplier is Game-specific implementation, Bulbapedia uses 3/5
       *  See Fog {@link https://bulbapedia.bulbagarden.net/wiki/Fog}
       */
      moveAccuracy.value = Math.floor(moveAccuracy.value * 0.9);
    }

    if (!isOhko && globalScene.arena.getTag(ArenaTagType.GRAVITY)) {
      moveAccuracy.value = Math.floor(moveAccuracy.value * 1.67);
    }

    return moveAccuracy.value;
  }

  /**
   * Calculates the power of a move in battle based on various conditions and attributes.
   *
   * @param source {@linkcode Pokemon} The Pokémon using the move.
   * @param target {@linkcode Pokemon} The Pokémon being targeted by the move.
   * @returns The calculated power of the move.
   */
  calculateBattlePower(source: Pokemon, target: Pokemon, simulated: boolean = false): number {
    if (this.category === MoveCategory.STATUS) {
      return -1;
    }

    const power = new NumberHolder(this.power);
    const typeChangeMovePowerMultiplier = new NumberHolder(1);

    applyPreAttackAbAttrs(MoveTypeChangeAbAttr, source, target, this, true, null, typeChangeMovePowerMultiplier);

    const sourceTeraType = source.getTeraType();
    if (
      sourceTeraType !== Type.UNKNOWN
      && sourceTeraType === this.type
      && power.value < 60
      && this.priority <= 0
      && !this.hasAttr(MultiHitAttr)
      && !globalScene.findModifier((m) => m instanceof PokemonMultiHitModifier && m.pokemonId === source.id)
    ) {
      power.value = 60;
    }

    applyPreAttackAbAttrs(VariableMovePowerAbAttr, source, target, this, simulated, power);

    if (source.getAlly()) {
      applyPreAttackAbAttrs(AllyMoveCategoryPowerBoostAbAttr, source.getAlly(), target, this, simulated, power);
    }

    const fieldAuras = new Set(
      globalScene
        .getField(true)
        .map(
          (p) =>
            p.getAbilityAttrs(FieldMoveTypePowerBoostAbAttr).filter((attr) => {
              const condition = attr.getCondition();
              return !condition || condition(p);
            }) as FieldMoveTypePowerBoostAbAttr[],
        )
        .flat(),
    );
    for (const aura of fieldAuras) {
      aura.applyPreAttack(source, null, simulated, target, this, [power]);
    }

    const alliedField: Pokemon[] = source.getField();
    alliedField.forEach((p) =>
      applyPreAttackAbAttrs(UserFieldMoveTypePowerBoostAbAttr, p, target, this, simulated, power),
    );

    power.value *= typeChangeMovePowerMultiplier.value;

    const typeBoost = source.findTag((t) => t instanceof TypeBoostTag && t.boostedType === this.type) as TypeBoostTag;
    if (typeBoost) {
      power.value *= typeBoost.boostValue;
    }

    applyMoveAttrs(VariablePowerAttr, source, target, this, power);

    if (!this.hasAttr(TypelessAttr)) {
      globalScene.arena.applyTags(WeakenMoveTypeTag, simulated, this.type, power);
      globalScene.applyModifiers(AttackTypeBoosterModifier, source.isPlayer(), source, this.type, power);
    }

    if (source.getTag(HelpingHandTag)) {
      power.value *= 1.5;
    }

    return power.value;
  }

  getPriority(user: Pokemon, simulated: boolean = true) {
    const priority = new NumberHolder(this.priority);

    applyMoveAttrs(IncrementMovePriorityAttr, user, null, this, priority);
    applyAbAttrs(ChangeMovePriorityAbAttr, user, null, simulated, this, priority);

    return priority.value;
  }

  /**
   * Returns `true` if this move can be given additional strikes
   * by enhancing effects.
   * Currently used for {@link https://bulbapedia.bulbagarden.net/wiki/Parental_Bond_(Ability) | Parental Bond}
   * and {@linkcode PokemonMultiHitModifier | Multi-Lens}.
   * @param user The {@linkcode Pokemon} using the move
   */
  canBeMultiStrikeEnhanced(user: Pokemon): boolean {
    // Multi-strike enhancers...

    // ...cannot enhance moves that hit multiple targets
    const { targets, multiple } = getMoveTargets(user, this.id);
    const isMultiTarget = multiple && targets.length > 1;

    // ...cannot enhance multi-hit or sacrificial moves
    const exceptAttrs: Constructor<MoveAttr>[] = [MultiHitAttr, SacrificialAttr, SacrificialAttrOnHit];

    // ...and cannot enhance these specific moves.
    const exceptMoves: Moves[] = [Moves.FLING, Moves.UPROAR, Moves.ROLLOUT, Moves.ICE_BALL, Moves.ENDEAVOR];

    return (
      !isMultiTarget
      && !this.isChargingMove()
      && !exceptAttrs.some((attr) => this.hasAttr(attr))
      && !exceptMoves.some((id) => this.id === id)
      && this.category !== MoveCategory.STATUS
    );
  }
}

export class AttackMove extends Move {
  constructor(
    id: Moves,
    type: Type,
    category: MoveCategory,
    power: number,
    accuracy: number,
    pp: number,
    chance: number,
    priority: number,
    generation: number,
  ) {
    super(id, type, category, MoveTarget.NEAR_OTHER, power, accuracy, pp, chance, priority, generation);

    /**
     * {@link https://bulbapedia.bulbagarden.net/wiki/Freeze_(status_condition)}
     * > All damaging Fire-type moves can now thaw a frozen target, regardless of whether or not they have a chance to burn;
     */
    if (this.type === Type.FIRE) {
      this.addAttr(new HealStatusEffectAttr(false, StatusEffect.FREEZE));
    }
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let ret = super.getTargetBenefitScore(user, target, move);

    let attackScore = 0;

    const effectiveness = target.getAttackTypeEffectiveness(this.type, user, undefined, undefined, this);
    attackScore = Math.pow(effectiveness - 1, 2) * effectiveness < 1 ? -2 : 2;
    if (attackScore) {
      if (this.category === MoveCategory.PHYSICAL) {
        const atk = new NumberHolder(user.getEffectiveStat(Stat.ATK, target));
        applyMoveAttrs(VariableAtkAttr, user, target, move, atk);
        if (atk.value > user.getEffectiveStat(Stat.SPATK, target)) {
          const statRatio = user.getEffectiveStat(Stat.SPATK, target) / atk.value;
          if (statRatio <= 0.75) {
            attackScore *= 2;
          } else if (statRatio <= 0.875) {
            attackScore *= 1.5;
          }
        }
      } else {
        const spAtk = new NumberHolder(user.getEffectiveStat(Stat.SPATK, target));
        applyMoveAttrs(VariableAtkAttr, user, target, move, spAtk);
        if (spAtk.value > user.getEffectiveStat(Stat.ATK, target)) {
          const statRatio = user.getEffectiveStat(Stat.ATK, target) / spAtk.value;
          if (statRatio <= 0.75) {
            attackScore *= 2;
          } else if (statRatio <= 0.875) {
            attackScore *= 1.5;
          }
        }
      }

      const power = new NumberHolder(this.power);
      applyMoveAttrs(VariablePowerAttr, user, target, move, power);

      attackScore += Math.floor(power.value / 5);
    }

    ret -= attackScore;

    return ret;
  }
}

export class StatusMove extends Move {
  constructor(
    id: Moves,
    type: Type,
    accuracy: number,
    pp: number,
    chance: number,
    priority: number,
    generation: number,
  ) {
    super(id, type, MoveCategory.STATUS, MoveTarget.NEAR_OTHER, -1, accuracy, pp, chance, priority, generation);
  }
}

export class SelfStatusMove extends Move {
  constructor(
    id: Moves,
    type: Type,
    accuracy: number,
    pp: number,
    chance: number,
    priority: number,
    generation: number,
  ) {
    super(id, type, MoveCategory.STATUS, MoveTarget.USER, -1, accuracy, pp, chance, priority, generation);
  }
}

type SubMove = new (...args: any[]) => Move;

function ChargeMove<TBase extends SubMove>(Base: TBase) {
  return class extends Base {
    /** The animation to play during the move's charging phase */
    public readonly chargeAnim: ChargeAnim = ChargeAnim[`${Moves[this.id]}_CHARGING`];
    /** The message to show during the move's charging phase */
    private _chargeText: string;

    /** Move attributes that apply during the move's charging phase */
    public chargeAttrs: MoveAttr[] = [];

    override isChargingMove(): this is ChargingMove {
      return true;
    }

    /**
     * Sets the text to be displayed during this move's charging phase.
     * References to the user Pokemon should be written as "{USER}", and
     * references to the target Pokemon should be written as "{TARGET}".
     * @param chargeText the text to set
     * @returns this {@linkcode Move} (for chaining API purposes)
     */
    chargeText(chargeText: string): this {
      this._chargeText = chargeText;
      return this;
    }

    /**
     * Queues the charge text to display to the player
     * @param user the {@linkcode Pokemon} using this move
     * @param target the {@linkcode Pokemon} targeted by this move (optional)
     */
    showChargeText(user: Pokemon, target?: Pokemon): void {
      globalScene.queueMessage(
        this._chargeText
          .replace("{USER}", getPokemonNameWithAffix(user))
          .replace("{TARGET}", getPokemonNameWithAffix(target)),
      );
    }

    /**
     * Gets all charge attributes of the given attribute type.
     * @param attrType any attribute that extends {@linkcode MoveAttr}
     * @returns Array of attributes that match `attrType`, or an empty array if
     * no matches are found.
     */
    getChargeAttrs<T extends MoveAttr>(attrType: Constructor<T>): T[] {
      return this.chargeAttrs.filter((attr): attr is T => attr instanceof attrType);
    }

    /**
     * Checks if this move has an attribute of the given type.
     * @param attrType any attribute that extends {@linkcode MoveAttr}
     * @returns `true` if a matching attribute is found; `false` otherwise
     */
    hasChargeAttr<T extends MoveAttr>(attrType: Constructor<T>): boolean {
      return this.chargeAttrs.some((attr) => attr instanceof attrType);
    }

    /**
     * Adds an attribute to this move to be applied during the move's charging phase
     * @param ChargeAttrType the type of {@linkcode MoveAttr} being added
     * @param args the parameters to construct the given {@linkcode MoveAttr} with
     * @returns this {@linkcode Move} (for chaining API purposes)
     */
    chargeAttr<T extends Constructor<MoveAttr>>(ChargeAttrType: T, ...args: ConstructorParameters<T>): this {
      const chargeAttr = new ChargeAttrType(...args);
      this.chargeAttrs.push(chargeAttr);

      return this;
    }
  };
}

export class ChargingAttackMove extends ChargeMove(AttackMove) {}
export class ChargingSelfStatusMove extends ChargeMove(SelfStatusMove) {}

export type ChargingMove = ChargingAttackMove | ChargingSelfStatusMove;

export type MoveAttrFilter = (attr: MoveAttr) => boolean;

function applyMoveAttrsInternal(
  attrFilter: MoveAttrFilter,
  user: Pokemon | null,
  target: Pokemon | null,
  move: Move,
  ...args: unknown[]
): void {
  move.attrs.filter((attr) => attrFilter(attr)).forEach((attr) => attr.apply(user, target, move, ...args));
}

function applyMoveChargeAttrsInternal(
  attrFilter: MoveAttrFilter,
  user: Pokemon | null,
  target: Pokemon | null,
  move: ChargingMove,
  ...args: unknown[]
): void {
  move.chargeAttrs.filter((attr) => attrFilter(attr)).forEach((attr) => attr.apply(user, target, move, ...args));
}

export function applyMoveAttrs(
  attrType: Constructor<MoveAttr>,
  user: Pokemon | null,
  target: Pokemon | null,
  move: Move,
  ...args: unknown[]
): void {
  applyMoveAttrsInternal((attr: MoveAttr) => attr instanceof attrType, user, target, move, ...args);
}

export function applyFilteredMoveAttrs(
  attrFilter: MoveAttrFilter,
  user: Pokemon,
  target: Pokemon | null,
  move: Move,
  ...args: unknown[]
): void {
  applyMoveAttrsInternal(attrFilter, user, target, move, ...args);
}

export function applyMoveChargeAttrs(
  attrType: Constructor<MoveAttr>,
  user: Pokemon | null,
  target: Pokemon | null,
  move: ChargingMove,
  ...args: unknown[]
): void {
  applyMoveChargeAttrsInternal((attr: MoveAttr) => attr instanceof attrType, user, target, move, ...args);
}

export type MoveTargetSet = {
  targets: BattlerIndex[];
  multiple: boolean;
};

export function getMoveTargets(user: Pokemon, move: Moves): MoveTargetSet {
  const variableTarget = new NumberHolder(0);
  user.getOpponents().forEach((p) => applyMoveAttrs(VariableTargetAttr, user, p, allMoves[move], variableTarget));

  const moveTarget = allMoves[move].hasAttr(VariableTargetAttr)
    ? variableTarget.value
    : move
      ? allMoves[move].moveTarget
      : move === undefined
        ? MoveTarget.NEAR_ENEMY
        : [];
  const opponents = user.getOpponents();

  let set: Pokemon[] = [];
  let multiple = false;

  switch (moveTarget) {
    case MoveTarget.USER:
    case MoveTarget.PARTY:
      set = [user];
      break;
    case MoveTarget.NEAR_OTHER:
    case MoveTarget.OTHER:
    case MoveTarget.DRAGON_DARTS:
    case MoveTarget.ALL_NEAR_OTHERS:
    case MoveTarget.ALL_OTHERS:
      set = opponents.concat([user.getAlly()]);
      multiple = moveTarget === MoveTarget.ALL_NEAR_OTHERS || moveTarget === MoveTarget.ALL_OTHERS;
      break;
    case MoveTarget.NEAR_ENEMY:
    case MoveTarget.ALL_NEAR_ENEMIES:
    case MoveTarget.ALL_ENEMIES:
    case MoveTarget.ENEMY_SIDE:
      set = opponents;
      multiple = moveTarget !== MoveTarget.NEAR_ENEMY;
      break;
    case MoveTarget.RANDOM_NEAR_ENEMY:
      set = [opponents[user.randSeedInt(opponents.length)]];
      break;
    case MoveTarget.ATTACKER:
      return { targets: [-1 as BattlerIndex], multiple: false };
    case MoveTarget.NEAR_ALLY:
    case MoveTarget.ALLY:
      set = [user.getAlly()];
      break;
    case MoveTarget.USER_OR_NEAR_ALLY:
    case MoveTarget.USER_AND_ALLIES:
    case MoveTarget.USER_SIDE:
      set = [user, user.getAlly()];
      multiple = moveTarget !== MoveTarget.USER_OR_NEAR_ALLY;
      break;
    case MoveTarget.ALL:
    case MoveTarget.BOTH_SIDES:
      set = [user, user.getAlly()].concat(opponents);
      multiple = true;
      break;
    case MoveTarget.CURSE:
      set = user.getTypes(true).includes(Type.GHOST) ? opponents.concat([user.getAlly()]) : [user];
      break;
  }

  return {
    targets: set
      .filter((p) => p?.isActive(true))
      .map((p) => p.getBattlerIndex())
      .filter((t) => t !== undefined),
    multiple,
  };
}

export const selfStatLowerMoves: Moves[] = [];

import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { ArenaTagType } from "#enums/arena-tag-type";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "../move";
import { MoveEffectAttr, type MoveEffectAttrOptions } from "./move-effect-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export interface ChanceBasedMoveEffectAttrOptions extends MoveEffectAttrOptions {
  /** Overrides the secondary effect chance for this attr if set. */
  effectChanceOverride?: number;
}

/**
 * Attribute for effects that have a random chance of triggering.
 * @extends MoveEffectAttr
 */
export abstract class ChanceBasedMoveEffectAttr extends MoveEffectAttr {
  protected override options?: ChanceBasedMoveEffectAttrOptions;

  constructor(selfTarget: boolean = false, options?: ChanceBasedMoveEffectAttrOptions) {
    super(selfTarget, options);
    this.options = options;
  }

  /**
   * If defined, overrides the move's base chance for this
   * secondary effect to trigger.
   */
  public get effectChanceOverride() {
    return this.options?.effectChanceOverride;
  }

  public override canApply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (super.canApply(user, target, move)) {
      const effectChance = this.getMoveChance(user, target, move, this.selfTarget, true);
      return effectChance < 0 || user.randSeedInt(100) < effectChance;
    }
    return false;
  }

  /**
   * Gets the used move's additional effect chance after modifications from:
   * - the user's Sheer Force and/or Serene Grace
   * - the target's Shield Dust
   * - the "rainbow effect" from combining Water Pledge and Fire Pledge
   * @param user the {@linkcode Pokemon} using this move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param selfEffect `true` if move targets user.
   * @returns The final percent chance of this attribute's effect applying. If negative, the
   * effect is guaranteed to apply.
   */
  public getMoveChance(
    user: Pokemon,
    target: Pokemon,
    move: Move,
    selfEffect: boolean,
    showAbility: boolean = false,
  ): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs(AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER, user, false, moveChance, move, showAbility);

    const userSide = user.getArenaTagSide();
    globalScene.arena.applyTagsForSide(ArenaTagType.WATER_FIRE_PLEDGE, userSide, false, moveChance);

    if (!selfEffect) {
      applyAbAttrs(AbAttrFlag.IGNORE_MOVE_EFFECTS, target, false, user, move, moveChance);
    }
    return moveChance.value;
  }
}

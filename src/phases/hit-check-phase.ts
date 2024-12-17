import { BattlerIndex } from "#app/battle";
import { AlwaysHitAbAttr } from "#app/data/ab-attrs/always-hit-ab-attr";
import { MaxMultiHitAbAttr } from "#app/data/ab-attrs/max-multi-hit-ab-attr";
import { ConditionalProtectTag } from "#app/data/arena-tag";
import { DamageProtectedTag, SemiInvulnerableTag, ProtectedTag, SkyDropTag } from "#app/data/battler-tags";
import { MoveFlags, MoveTarget, HitsTagAttr, ToxicAccuracyAttr, MoveCategory, OneHitKOAttr } from "#app/data/move";
import type { TypeDamageMultiplier } from "#app/data/type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitCheckResult } from "#enums/hit-check-result";
import { Type } from "#enums/type";
import type { Pokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BooleanHolder } from "#app/utils";
import { PokemonPhase } from "#app/phases/pokemon-phase";

type HitCheckEntry = [HitCheckResult, TypeDamageMultiplier];

/**
 * Abstract class for phases that may calculate hit checks.
 * Currently a parent class for {@linkcode MoveEffectPhase}
 * and {@linkcode MoveChargePhase}.
 * @see {@linkcode hitCheck}
 */
export abstract class HitCheckPhase extends PokemonPhase {
  public move: PokemonMove;
  protected targets: BattlerIndex[];
  protected hitChecks: HitCheckEntry[];

  constructor(battlerIndex: BattlerIndex, targets: BattlerIndex[], move: PokemonMove) {
    super(battlerIndex);

    this.move = move;
    this.targets = targets;
    this.hitChecks = Array(targets.length).fill(HitCheckResult.PENDING);
  }

  /**
   * Resolves whether this phase's invoked move hits the given target
   * @param target - The {@linkcode Pokemon} targeted by the invoked move
   * @returns a {@linkcode HitCheckEntry} containing the attack's {@linkcode HitCheckResult}
   * and {@linkcode TypeDamageMultiplier | effectiveness} against the target.
   */
  public hitCheck(target: Pokemon): HitCheckEntry {
    const user = this.getUserPokemon();
    const move = this.move.getMove();

    if (!user) {
      return [HitCheckResult.ERROR, 0];
    }

    // Moves targeting the user or field bypass accuracy and effectiveness checks
    if (move.moveTarget === MoveTarget.USER || move.isFieldTarget()) {
      return [HitCheckResult.HIT, 1];
    }

    // If the target is somehow not on the field, cancel the hit check silently
    if (!target.isActive(true)) {
      return [HitCheckResult.NO_EFFECT_NO_MESSAGE, 0];
    }

    /** Is the target hidden by the effects of its Commander ability? */
    const isCommanding =
      globalScene.currentBattle.double
      && target.getAlly()?.getTag(BattlerTagType.COMMANDED)?.getSourcePokemon() === target;
    if (isCommanding) {
      return [HitCheckResult.MISS, 0];
    }

    /** Is there an effect that causes the move to bypass accuracy checks, including semi-invulnerability? */
    const alwaysHit =
      [user, target].some((p) => p.hasAbilityWithAttr(AlwaysHitAbAttr))
      || (user.getTag(BattlerTagType.IGNORE_ACCURACY)
        && (user.getLastXMoves().find(() => true)?.targets ?? []).indexOf(target.getBattlerIndex()) !== -1)
      || !!target.getTag(BattlerTagType.ALWAYS_GET_HIT);

    const semiInvulnerableTag = target.getTag(SemiInvulnerableTag) ?? target.getTag(SkyDropTag);
    /** Should the move miss due to the target's semi-invulnerability? */
    const targetIsSemiInvulnerable =
      !!semiInvulnerableTag
      && !this.move
        .getMove()
        .getAttrs(HitsTagAttr)
        .some((hta) => hta.tagType === semiInvulnerableTag.tagType)
      && !(this.move.getMove().hasAttr(ToxicAccuracyAttr) && user.isOfType(Type.POISON));

    if (targetIsSemiInvulnerable && !alwaysHit) {
      return [HitCheckResult.MISS, 0];
    }

    // Check if the target is protected by any effect
    /** The {@linkcode ArenaTagSide} to which the target belongs */
    const targetSide = target.getArenaTagSide();
    /** Has the invoked move been cancelled by conditional protection (e.g Quick Guard)? */
    const hasConditionalProtectApplied = new BooleanHolder(false);
    /** Does the applied conditional protection bypass Protect-ignoring effects? */
    const bypassIgnoreProtect = new BooleanHolder(false);
    /** If the move is not targeting a Pokemon on the user's side, try to apply conditional protection effects */
    if (!this.move.getMove().isAllyTarget()) {
      globalScene.arena.applyTagsForSide(
        ConditionalProtectTag,
        targetSide,
        false,
        hasConditionalProtectApplied,
        user,
        target,
        move.id,
        bypassIgnoreProtect,
      );
    }

    /** Is the target protected by Protect, etc. or a relevant conditional protection effect? */
    const isProtected =
      (bypassIgnoreProtect.value || !this.move.getMove().checkFlag(MoveFlags.IGNORE_PROTECT, user, target))
      && (hasConditionalProtectApplied.value
        || (!target.findTags((t) => t instanceof DamageProtectedTag).length
          && target.findTags((t) => t instanceof ProtectedTag).find((t) => target.lapseTag(t.tagType)))
        || (this.move.getMove().category !== MoveCategory.STATUS
          && target.findTags((t) => t instanceof DamageProtectedTag).find((t) => target.lapseTag(t.tagType))));

    if (isProtected) {
      return [HitCheckResult.PROTECTED, 0];
    }

    /** If `true`, the default message "It doesn't affect {target}!" is suppressed. */
    const cancelNoEffectMessage = new BooleanHolder(false);
    /**
     * The effectiveness of the move against the given target.
     * Accounts for type and move immunities from defensive typing, abilities, and other effects.
     */
    const effectiveness = target.getMoveEffectiveness(user, move, false, false, cancelNoEffectMessage);
    if (effectiveness === 0) {
      return cancelNoEffectMessage.value
        ? [HitCheckResult.NO_EFFECT_NO_MESSAGE, effectiveness]
        : [HitCheckResult.NO_EFFECT, effectiveness];
    }

    // Strikes after the first in a multi-strike move are guaranteed to hit,
    // unless the move is flagged to check all hits and the user does not have Skill Link.
    if (user.turnData.hitsLeft < user.turnData.hitCount) {
      if (!move.hasFlag(MoveFlags.CHECK_ALL_HITS) || user.hasAbilityWithAttr(MaxMultiHitAbAttr)) {
        return [HitCheckResult.HIT, effectiveness];
      }
    }

    if (alwaysHit || (target.getTag(BattlerTagType.TELEKINESIS) && !move.hasAttr(OneHitKOAttr))) {
      return [HitCheckResult.HIT, effectiveness];
    }

    const moveAccuracy = move.calculateBattleAccuracy(user, target);

    // Sure-hit moves are encoded with an accuracy of -1
    if (moveAccuracy === -1) {
      return [HitCheckResult.HIT, effectiveness];
    }

    const accuracyMultiplier = user.getAccuracyMultiplier(target, move);
    const rand = user.randSeedInt(100);

    if (rand < moveAccuracy * accuracyMultiplier) {
      return [HitCheckResult.HIT, effectiveness];
    } else {
      return [HitCheckResult.MISS, 0];
    }
  }

  /** @returns The {@linkcode Pokemon} using this phase's invoked move */
  public getUserPokemon(): Pokemon | null {
    if (this.battlerIndex > BattlerIndex.ENEMY_2) {
      return globalScene.getPokemonById(this.battlerIndex);
    }
    return (this.player ? globalScene.getPlayerField() : globalScene.getEnemyField())[this.fieldIndex];
  }

  /** @returns An array of all {@linkcode Pokemon} targeted by this phase's invoked move */
  public getTargets(): Pokemon[] {
    return globalScene.getField(true).filter((p) => this.targets.indexOf(p.getBattlerIndex()) > -1);
  }

  /** @returns The first target of this phase's invoked move */
  public getFirstTarget(): Pokemon | null {
    return this.getTargets()[0] ?? null;
  }
}

import { globalScene } from "#app/global-scene";
import type { ConditionalProtectTag } from "#arena-tags/conditional-protect-tag";
import { applyBattlerTags } from "#battler-tags/apply-battler-tags";
import type { ProtectedTag } from "#battler-tags/protected-tag";
import { CONDITIONAL_PROTECT_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { PROTECTION_BATTLER_TAG_TYPES, SEMI_INVULNERABLE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import type { TypeDamageMultiplier } from "#data/type";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { HitCheckResult } from "#enums/hit-check-result";
import { MoveFlags } from "#enums/move-flags";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import { BideEffectAttr } from "#moves/bide-effect-attr";
import { HitsTagAttr } from "#moves/hits-tag-attr";
import { OneHitKOAttr } from "#moves/one-hit-ko-attr";
import { ToxicAccuracyAttr } from "#moves/toxic-accuracy-attr";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { BooleanHolder } from "#utils/common-utils";

//#region Types

type HitCheckEntry = [HitCheckResult, TypeDamageMultiplier];

//#endregion

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
    this.hitChecks = new Array(targets.length).fill(HitCheckResult.PENDING);
  }

  /**
   * Resolves whether this phase's invoked move hits the given target
   * @param target - The {@linkcode Pokemon} targeted by the invoked move
   * @param simulated - If `true`, does not change game state during calculation (default `false`)
   * @returns a {@linkcode HitCheckEntry} containing the attack's {@linkcode HitCheckResult}
   * and {@linkcode TypeDamageMultiplier | effectiveness} against the target.
   */
  public hitCheck(target: Pokemon, simulated: boolean = false): HitCheckEntry {
    const user = this.getUserPokemon();
    const move = this.move.getMove();

    if (!user) {
      return [HitCheckResult.ERROR, 0];
    }

    const isBideAttack = move.hasAttr(BideEffectAttr) && user.getTag(BattlerTagType.BIDE)?.turnCount === 1;

    // Moves targeting the user or field bypass accuracy and effectiveness checks
    if ((move.moveTarget === MoveTarget.USER && !isBideAttack) || move.isFieldTarget()) {
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
      [user, target].some((p) => p.hasAbilityWithAttr(AbAttrFlag.ALWAYS_HIT))
      || (user.hasTag(BattlerTagType.IGNORE_ACCURACY)
        && (user.getLastXMoves()[0]?.targets ?? []).indexOf(target.getBattlerIndex()) !== -1)
      || target.hasTag(BattlerTagType.ALWAYS_GET_HIT);

    const semiInvulnerableTag =
      target.getTag(...SEMI_INVULNERABLE_BATTLER_TAG_TYPES) ?? target.getTag(BattlerTagType.SKY_DROP);
    /** Should the move miss due to the target's semi-invulnerability? */
    const targetIsSemiInvulnerable =
      !!semiInvulnerableTag
      && !this.move
        .getMove()
        .getAttrs(HitsTagAttr)
        .some((hta) => hta.tagType === semiInvulnerableTag.tagType)
      && !(this.move.getMove().hasAttr(ToxicAccuracyAttr) && user.isOfType(ElementalType.POISON));

    if (targetIsSemiInvulnerable && !alwaysHit) {
      return [HitCheckResult.MISS, 0];
    }

    // Check if the target is protected by any effect
    /** The {@linkcode ArenaTagSide} to which the target belongs */
    const targetSide = target.getArenaTagSide();
    /** Has the invoked move been cancelled by conditional protection (e.g Quick Guard)? */
    const hasConditionalProtectApplied = new BooleanHolder(false);
    /** If the move is not targeting a Pokemon on the user's side, try to apply conditional protection effects */
    if (!this.move.getMove().isAllyTarget()) {
      globalScene.arena.applyTags<ConditionalProtectTag>(
        [...CONDITIONAL_PROTECT_ARENA_TAG_TYPES],
        targetSide,
        simulated,
        hasConditionalProtectApplied,
        user,
        target,
        move.id,
      );
    }

    /** Is the target protected by Protect, etc. or a relevant conditional protection effect? */
    const isProtected =
      hasConditionalProtectApplied.value
      || applyBattlerTags<ProtectedTag>(PROTECTION_BATTLER_TAG_TYPES, target, simulated, user, move);

    if (isProtected) {
      return [HitCheckResult.PROTECTED, 0];
    }

    /** If `true`, the default message "It doesn't affect {target}!" is suppressed. */
    const cancelNoEffectMessage = new BooleanHolder(false);
    /**
     * The effectiveness of the move against the given target.
     * Accounts for type and move immunities from defensive typing, abilities, and other effects.
     */
    const effectiveness = target.getMoveEffectiveness(
      user,
      move,
      AbilityApplyMode.DEFAULT,
      simulated,
      cancelNoEffectMessage,
    );
    if (effectiveness === 0) {
      return cancelNoEffectMessage.value
        ? [HitCheckResult.NO_EFFECT_NO_MESSAGE, effectiveness]
        : [HitCheckResult.NO_EFFECT, effectiveness];
    }

    // Strikes after the first in a multi-strike move are guaranteed to hit,
    // unless the move is flagged to check all hits and the user does not have Skill Link.
    if (
      user.turnData.hitsLeft < user.turnData.hitCount
      && (!move.checkFlag(MoveFlags.CHECK_ALL_HITS, user, target) || user.hasAbilityWithAttr(AbAttrFlag.MAX_MULTI_HIT))
    ) {
      return [HitCheckResult.HIT, effectiveness];
    }

    if (alwaysHit || (target.hasTag(BattlerTagType.TELEKINESIS) && !move.hasAttr(OneHitKOAttr))) {
      return [HitCheckResult.HIT, effectiveness];
    }

    const moveAccuracy = move.calculateBattleAccuracy(user, target);

    // Sure-hit moves are encoded with an accuracy of -1
    if (moveAccuracy === -1) {
      return [HitCheckResult.HIT, effectiveness];
    }

    const accuracyMultiplier = user.getAccuracyMultiplier(target, move, simulated);
    const rand = user.randSeedInt(100);

    if (rand < moveAccuracy * accuracyMultiplier) {
      return [HitCheckResult.HIT, effectiveness];
    }
    return [HitCheckResult.MISS, 0];
  }

  /** @returns The {@linkcode Pokemon} using this phase's invoked move */
  public getUserPokemon(): Pokemon | undefined {
    if (this.battlerIndex > BattlerIndex.ENEMY_2) {
      return globalScene.getPokemonById(this.battlerIndex);
    }
    return (this.isPlayer ? globalScene.getPlayerField() : globalScene.getEnemyField())[this.fieldIndex];
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

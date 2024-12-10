import { BattlerIndex } from "#app/battle";
import { globalScene } from "#app/global-scene";
import {
  AddSecondStrikeAbAttr,
  AlwaysHitAbAttr,
  applyPostAttackAbAttrs,
  applyPostDamageAbAttrs,
  applyPostDefendAbAttrs,
  applyPreAttackAbAttrs,
  IgnoreMoveEffectsAbAttr,
  MaxMultiHitAbAttr,
  PostAttackAbAttr,
  PostDamageAbAttr,
  PostDefendAbAttr,
} from "#app/data/ability";
import { ArenaTagSide, ConditionalProtectTag } from "#app/data/arena-tag";
import { MoveAnim } from "#app/data/battle-anims";
import {
  BattlerTagLapseType,
  DamageProtectedTag,
  ProtectedTag,
  SemiInvulnerableTag,
  SubstituteTag,
  TypeBoostTag,
} from "#app/data/battler-tags";
import type { MoveAttr } from "#app/data/move";
import {
  applyFilteredMoveAttrs,
  applyMoveAttrs,
  AttackMove,
  DelayedAttackAttr,
  FlinchAttr,
  HitsTagAttr,
  MissEffectAttr,
  MoveCategory,
  MoveEffectAttr,
  MoveEffectTrigger,
  MoveFlags,
  MoveTarget,
  MultiHitAttr,
  NoEffectAttr,
  OneHitKOAttr,
  OverrideMoveEffectAttr,
  ToxicAccuracyAttr,
} from "#app/data/move";
import { SpeciesFormChangePostMoveTrigger } from "#app/data/pokemon-forms";
import { Type } from "#enums/type";
import type { DamageResult, PokemonMove, TurnMove } from "#app/field/pokemon";
import type Pokemon from "#app/field/pokemon";
import { HitResult, MoveResult } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  ContactHeldItemTransferChanceModifier,
  DamageMoneyRewardModifier,
  EnemyAttackStatusEffectChanceModifier,
  EnemyEndureChanceModifier,
  FlinchChanceModifier,
  HitHealModifier,
  PokemonMultiHitModifier,
} from "#app/modifier/modifier";
import { PokemonPhase } from "#app/phases/pokemon-phase";
import { BooleanHolder, isNullOrUndefined, NumberHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import i18next from "i18next";
import type { TypeDamageMultiplier } from "#app/data/type";
import { DamageAchv } from "#app/system/achv";
import { FaintPhase } from "#app/phases/faint-phase";
import { HitCheckResult } from "#app/enums/hit-check-result";

type HitCheckEntry = [HitCheckResult, TypeDamageMultiplier];

export class MoveEffectPhase extends PokemonPhase {
  public move: PokemonMove;
  protected targets: BattlerIndex[];

  private hitChecks: HitCheckEntry[];
  private moveHistoryEntry: TurnMove;

  /** MOVE EFFECT TRIGGER CONDITIONS */

  /** Is this the first strike of a move? */
  private firstHit: boolean;
  /** Is this the last strike of a move? */
  private lastHit: boolean;

  constructor(battlerIndex: BattlerIndex, targets: BattlerIndex[], move: PokemonMove) {
    super(battlerIndex);
    this.move = move;
    /**
     * In double battles, if the right Pokemon selects a spread move and the left Pokemon dies
     * with no party members available to switch in, then the right Pokemon takes the index
     * of the left Pokemon and gets hit unless this is checked.
     */
    if (targets.includes(battlerIndex) && this.move.getMove().moveTarget === MoveTarget.ALL_NEAR_OTHERS) {
      const i = targets.indexOf(battlerIndex);
      targets.splice(i, i + 1);
    }
    this.targets = targets;
    this.hitChecks = Array(this.targets.length).fill([HitCheckResult.PENDING, 0]);
  }

  public override start(): void {
    super.start();

    /** The Pokemon using this phase's invoked move */
    const user = this.getUserPokemon();
    /** All Pokemon targeted by this phase's invoked move */
    const targets = this.getTargets();

    if (!user) {
      return super.end();
    }

    const isDelayedAttack = this.move.getMove().hasAttr(DelayedAttackAttr);
    /** If the user was somehow removed from the field and it's not a delayed attack, end this phase */
    if (!user.isOnField()) {
      if (!isDelayedAttack) {
        return super.end();
      } else {
        if (!user.scene) {
          /**
           * This happens if the Pokemon that used the delayed attack gets caught and released
           * on the turn the attack would have triggered. Having access to the global scene
           * in the future may solve this entirely, so for now we just cancel the hit
           */
          return super.end();
        }
        if (isNullOrUndefined(user.turnData)) {
          user.resetTurnData();
        }
      }
    }

    /**
     * Does an effect from this move override other effects on this turn?
     * e.g. Metronome/Nature Power when queueing a generated move.
     */
    const overridden = new BooleanHolder(false);
    /** The {@linkcode Move} object from {@linkcode allMoves} invoked by this phase */
    const move = this.move.getMove();

    // Assume single target for override
    applyMoveAttrs(OverrideMoveEffectAttr, user, this.getFirstTarget() ?? null, move, overridden, this.move.virtual);
    // If other effects were overridden, stop this phase before they can be applied
    if (overridden.value) {
      return this.end();
    }

    // Lapse `MOVE_EFFECT` effects (i.e. semi-invulnerability) when applicable
    user.lapseTags(BattlerTagLapseType.MOVE_EFFECT);

    // If the user is acting again (such as due to Instruct), reset hitsLeft/hitCount so that
    // the move executes correctly (ensures all hits of a multi-hit are properly calculated)
    if (user.turnData.hitsLeft === 0 && user.turnData.hitCount > 0 && user.turnData.extraTurns > 0) {
      user.turnData.hitsLeft = -1;
      user.turnData.hitCount = 0;
      user.turnData.extraTurns--;
    }

    /**
     * If this phase is for the first hit of the invoked move,
     * resolve the move's total hit count. This block combines the
     * effects of the move itself, Parental Bond, and Multi-Lens to do so.
     */
    if (user.turnData.hitsLeft === -1) {
      const hitCount = new NumberHolder(1);
      // Assume single target for multi hit
      applyMoveAttrs(MultiHitAttr, user, this.getFirstTarget() ?? null, move, hitCount);
      // If Parental Bond is applicable, add another hit
      applyPreAttackAbAttrs(AddSecondStrikeAbAttr, user, null, move, false, hitCount, null);
      // If Multi-Lens is applicable, add hits equal to the number of held Multi-Lenses
      globalScene.applyModifiers(PokemonMultiHitModifier, user.isPlayer(), user, move.id, hitCount);
      // Set the user's relevant turnData fields to reflect the final hit count
      user.turnData.hitCount = hitCount.value;
      user.turnData.hitsLeft = hitCount.value;
    }

    /**
     * Log to be entered into the user's move history once the move result is resolved.
     * Note that `result` (a {@linkcode MoveResult}) logs whether the move was successfully
     * used in the sense of "Does it have an effect on the user?".
     */
    this.moveHistoryEntry = {
      move: this.move.moveId,
      targets: this.targets,
      result: MoveResult.PENDING,
      virtual: this.move.virtual,
    };

    // Update hit checks for each target
    targets.forEach((t, i) => (this.hitChecks[i] = this.hitCheck(t)));

    // If somehow none of this move's targets are on the field,
    // log the move as a FAIL.
    if (!targets.some((t) => t.isActive(true))) {
      globalScene.queueMessage(i18next.t("battle:attackFailed"));
      this.moveHistoryEntry.result = MoveResult.FAIL;
    }

    if (this.hitChecks.some((hc) => hc[0] === HitCheckResult.HIT)) {
      // Moves are logged as a SUCCESS if at least one target was successfully hit
      this.moveHistoryEntry.result = MoveResult.SUCCESS;
    } else {
      user.turnData.hitCount = 1;
      user.turnData.hitsLeft = 1;

      // If all targets were missed, log the move as a MISS.
      // Otherwise, log the move as a FAIL.
      if (this.hitChecks.every((hc) => hc[0] === HitCheckResult.MISS)) {
        this.moveHistoryEntry.result = MoveResult.MISS;
      } else {
        this.moveHistoryEntry.result = MoveResult.FAIL;
      }
    }

    this.firstHit = user.turnData.hitCount === user.turnData.hitsLeft;
    this.lastHit = user.turnData.hitsLeft === 1 || !targets.some((t) => t.isActive(true));

    // If the move successfully hit at least 1 target, or the move has a
    // post-target effect, play the move's animation
    const tryPlayAnim =
      this.moveHistoryEntry.result === MoveResult.SUCCESS
      || move.getAttrs(MoveEffectAttr).some((attr) => attr.trigger === MoveEffectTrigger.POST_TARGET)
        ? this.playMoveAnim(user)
        : Promise.resolve();

    tryPlayAnim.then(() => {
      // If this phase represents the first strike of the given move,
      // log the move in the user's move history.
      if (this.firstHit) {
        user.pushMoveHistory(this.moveHistoryEntry);
      }

      for (const target of targets) {
        const [hitCheckResult, effectiveness] = this.hitChecks[targets.indexOf(target)];

        switch (hitCheckResult) {
          case HitCheckResult.HIT:
            this.applyMoveEffects(target, effectiveness);
            break;
          case HitCheckResult.NO_EFFECT:
            if (move.id === Moves.SHEER_COLD) {
              globalScene.queueMessage(
                i18next.t("battle:hitResultImmune", { pokemonName: getPokemonNameWithAffix(target) }),
              );
            } else {
              globalScene.queueMessage(
                i18next.t("battle:hitResultNoEffect", { pokemonName: getPokemonNameWithAffix(target) }),
              );
            }
          case HitCheckResult.NO_EFFECT_NO_MESSAGE:
          case HitCheckResult.PROTECTED:
            applyMoveAttrs(NoEffectAttr, user, target, move);
            break;
          case HitCheckResult.MISS:
            globalScene.queueMessage(
              i18next.t("battle:attackMissed", { pokemonNameWithAffix: getPokemonNameWithAffix(target) }),
            );
            applyMoveAttrs(MissEffectAttr, user, target, move);
            break;
          case HitCheckResult.PENDING:
          case HitCheckResult.ERROR:
            console.log(`Unexpected hit check result ${HitCheckResult[hitCheckResult]}. Aborting phase.`);
            return this.end();
        }
      }

      if (this.lastHit) {
        this.triggerMoveEffects(MoveEffectTrigger.POST_TARGET, user, null);
      }
      this.updateSubstitutes();
      this.end();
    });
  }

  /**
   * Plays this phase's move's animation.
   * @param user the {@linkcode Pokemon} using the move
   * @returns the Promise playing the animation
   */
  protected playMoveAnim(user: Pokemon): Promise<void> {
    return new Promise((resolve) => {
      const move = this.move.getMove();
      const firstTargetPokemon = this.getFirstTarget() ?? null;
      const playOnEmptyField = globalScene.currentBattle?.mysteryEncounter?.hasBattleAnimationsWithoutTargets ?? false;
      new MoveAnim(move.id, user, firstTargetPokemon!.getBattlerIndex(), playOnEmptyField).play(
        move.hitsSubstitute(user, firstTargetPokemon),
        () => resolve(),
      );
    });
  }

  /**
   * Applies all move effects that trigger in the event of a successful hit.
   * @param target the {@linkcode Pokemon} hit by this phase's move.
   * @param effectiveness the effectiveness of the move (as previously evaluated in {@linkcode hitCheck})
   */
  protected applyMoveEffects(target: Pokemon, effectiveness: TypeDamageMultiplier): void {
    const user = this.getUserPokemon();
    const move = this.move.getMove();

    /** The first target hit by the move */
    const firstTarget = target === this.getTargets().find((_, i) => this.hitChecks[i][1] > 0);

    if (isNullOrUndefined(user)) {
      return;
    }

    // prevent field-targeted moves from activating multiple times
    if (move.isFieldTarget() && target !== this.getTargets()[this.targets.length - 1]) {
      return;
    }

    this.triggerMoveEffects(MoveEffectTrigger.PRE_APPLY, user, target);

    const hitResult = this.applyMove(target, effectiveness);

    this.triggerMoveEffects(MoveEffectTrigger.POST_APPLY, user, target, firstTarget, true);
    if (!move.hitsSubstitute(user, target)) {
      this.applyOnTargetEffects(user, target, hitResult, firstTarget);
    }
    if (this.lastHit) {
      globalScene.triggerPokemonFormChange(user, SpeciesFormChangePostMoveTrigger);

      // Multi-hit check for Wimp Out/Emergency Exit
      if (user.turnData.hitCount > 1) {
        applyPostDamageAbAttrs(PostDamageAbAttr, target, 0, target.hasPassive(), false, [], user);
      }
    }
  }

  /**
   * Triggers move effects of the given move effect trigger.
   * @param triggerType The {@linkcode MoveEffectTrigger} being applied
   * @param user The {@linkcode Pokemon} using the move
   * @param target The {@linkcode Pokemon} targeted by the move
   * @param firstTarget Whether the target is the first to be hit by the current strike
   * @param selfTarget If defined, limits the effects triggered to either self-targeted
   * effects (if set to `true`) or targeted effects (if set to `false`).
   * @returns a `Promise` applying the relevant move effects.
   */
  protected triggerMoveEffects(
    triggerType: MoveEffectTrigger,
    user: Pokemon,
    target: Pokemon | null,
    firstTarget?: boolean | null,
    selfTarget?: boolean,
  ): void {
    return applyFilteredMoveAttrs(
      (attr: MoveAttr) =>
        attr instanceof MoveEffectAttr
        && attr.trigger === triggerType
        && (isNullOrUndefined(selfTarget) || attr.selfTarget === selfTarget)
        && (!attr.firstHitOnly || this.firstHit)
        && (!attr.lastHitOnly || this.lastHit)
        && (!attr.firstTargetOnly || (firstTarget ?? true)),
      user,
      target,
      this.move.getMove(),
    );
  }

  /**
   * Apply the results of this phase's move to the given target
   * @param target The {@linkcode Pokemon} struck by the move
   * @param effectiveness The effectiveness of the move (as determined previously in {@linkcode hitCheck})
   */
  protected applyMove(target: Pokemon, effectiveness: TypeDamageMultiplier): HitResult {
    /** The {@linkcode Pokemon} using the move */
    const user = this.getUserPokemon()!;

    /** The {@linkcode Move} being used */
    const move = this.move.getMove();
    const moveCategory = user.getMoveCategory(target, move);

    if (moveCategory === MoveCategory.STATUS) {
      return HitResult.STATUS;
    }

    const isCritical = target.getCriticalHitResult(user, move, false);

    const { result: result, damage: dmg } = target.getAttackDamage(
      user,
      move,
      false,
      false,
      isCritical,
      false,
      effectiveness,
    );

    const typeBoost = user.findTag(
      (t) => t instanceof TypeBoostTag && t.boostedType === user.getMoveType(move),
    ) as TypeBoostTag;
    if (typeBoost?.oneUse) {
      user.removeTag(typeBoost.tagType);
    }

    // In case of fatal damage, this tag would have gotten cleared before we could lapse it.
    const destinyTag = target.getTag(BattlerTagType.DESTINY_BOND);
    const grudgeTag = target.getTag(BattlerTagType.GRUDGE);

    const isOneHitKo = result === HitResult.ONE_HIT_KO;

    if (dmg) {
      target.lapseTags(BattlerTagLapseType.HIT);

      const substitute = target.getTag(SubstituteTag);
      const isBlockedBySubstitute = !!substitute && move.hitsSubstitute(user, target);
      if (isBlockedBySubstitute) {
        substitute.hp -= dmg;
      }
      if (!target.isPlayer() && dmg >= target.hp) {
        globalScene.applyModifiers(EnemyEndureChanceModifier, false, target);
      }

      /**
       * We explicitly require to ignore the faint phase here, as we want to show the messages
       * about the critical hit and the super effective/not very effective messages before the faint phase.
       */
      const damage = target.damageAndUpdate(
        isBlockedBySubstitute ? 0 : dmg,
        result as DamageResult,
        isCritical,
        isOneHitKo,
        isOneHitKo,
        true,
        user,
      );

      if (damage > 0) {
        if (user.isPlayer()) {
          globalScene.validateAchvs(DamageAchv, new NumberHolder(damage));
          if (damage > globalScene.gameData.gameStats.highestDamage) {
            globalScene.gameData.gameStats.highestDamage = damage;
          }
        }
        user.turnData.totalDamageDealt += damage;
        user.turnData.singleHitDamageDealt = damage;
        target.turnData.damageTaken += damage;
        target.battleData.hitCount++;

        const attackResult = {
          move: move.id,
          result: result as DamageResult,
          damage: damage,
          critical: isCritical,
          sourceId: user.id,
          sourceBattlerIndex: user.getBattlerIndex(),
        };
        target.turnData.attacksReceived.unshift(attackResult);
        if (user.isPlayer() && !target.isPlayer()) {
          globalScene.applyModifiers(DamageMoneyRewardModifier, true, user, new NumberHolder(damage));
        }
      }
    }

    if (isCritical) {
      globalScene.queueMessage(i18next.t("battle:hitResultCriticalHit"));
    }

    // want to include is.Fainted() in case multi hit move ends early, still want to render message
    if (user.turnData.hitsLeft === 1 || target.isFainted()) {
      switch (result) {
        case HitResult.SUPER_EFFECTIVE:
          globalScene.queueMessage(i18next.t("battle:hitResultSuperEffective"));
          break;
        case HitResult.NOT_VERY_EFFECTIVE:
          globalScene.queueMessage(i18next.t("battle:hitResultNotVeryEffective"));
          break;
        case HitResult.ONE_HIT_KO:
          globalScene.queueMessage(i18next.t("battle:hitResultOneHitKO"));
          break;
      }
    }

    if (target.isFainted()) {
      // set splice index here, so future scene queues happen before FaintedPhase
      globalScene.setPhaseQueueSplice();
      globalScene.unshiftPhase(new FaintPhase(target.getBattlerIndex(), isOneHitKo, destinyTag, grudgeTag, user));

      target.destroySubstitute();
      target.lapseTag(BattlerTagType.COMMANDED);
      target.resetSummonData();
    }

    return result;
  }

  /**
   * Applies all effects aimed at the move's target.
   * To be used when the target is successfully and directly hit by the move.
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param hitResult the {@linkcode HitResult} obtained from applying the move
   * @param firstTarget `true` if the target is the first Pokemon hit by the attack
   */
  protected applyOnTargetEffects(user: Pokemon, target: Pokemon, hitResult: HitResult, firstTarget: boolean): void {
    const move = this.move.getMove();

    /** Does {@linkcode hitResult} indicate that damage was dealt to the target? */
    const dealsDamage = [
      HitResult.EFFECTIVE,
      HitResult.SUPER_EFFECTIVE,
      HitResult.NOT_VERY_EFFECTIVE,
      HitResult.ONE_HIT_KO,
    ].includes(hitResult);

    this.triggerMoveEffects(MoveEffectTrigger.POST_APPLY, user, target, firstTarget, false);
    this.applyHeldItemFlinchCheck(user, target, dealsDamage);
    this.applyOnGetHitAbEffects(user, target, hitResult);
    applyPostAttackAbAttrs(PostAttackAbAttr, user, target, move, hitResult);
    if (move instanceof AttackMove) {
      globalScene.applyModifiers(ContactHeldItemTransferChanceModifier, this.player, user, target);
    }
  }

  public override end(): void {
    const user = this.getUserPokemon();
    /**
     * If this phase isn't for the invoked move's last strike,
     * unshift another MoveEffectPhase for the next strike.
     * Otherwise, queue a message indicating the number of times the move has struck
     * (if the move has struck more than once), then apply the heal from Shell Bell
     * to the user.
     */
    if (user) {
      if (user.turnData.hitsLeft && --user.turnData.hitsLeft >= 1 && this.getFirstTarget()?.isActive()) {
        globalScene.unshiftPhase(this.getNewHitPhase());
      } else {
        // Queue message for number of hits made by multi-move
        // If multi-hit attack only hits once, still want to render a message
        const hitsTotal = user.turnData.hitCount - Math.max(user.turnData.hitsLeft, 0);
        if (hitsTotal > 1 || (user.turnData.hitsLeft && user.turnData.hitsLeft > 0)) {
          // If there are multiple hits, or if there are hits of the multi-hit move left
          globalScene.queueMessage(i18next.t("battle:attackHitsCount", { count: hitsTotal }));
        }
        globalScene.applyModifiers(HitHealModifier, this.player, user);
        // Clear all cached move effectiveness values among targets
        this.getTargets().forEach((target) => (target.turnData.moveEffectiveness = null));
      }
    }

    super.end();
  }

  /**
   * Applies reactive effects that occur when a Pokémon is hit.
   * (i.e. Effect Spore, Disguise, Liquid Ooze, Beak Blast)
   * @param user - The {@linkcode Pokemon} using this phase's invoked move
   * @param target - {@linkcode Pokemon} the current target of this phase's invoked move
   * @param hitResult - The {@linkcode HitResult} of the attempted move
   * @returns a `Promise` intended to be passed into a `then()` call.
   */
  protected applyOnGetHitAbEffects(user: Pokemon, target: Pokemon, hitResult: HitResult): void {
    if (!target.isFainted() || target.canApplyAbility()) {
      applyPostDefendAbAttrs(PostDefendAbAttr, target, user, this.move.getMove(), hitResult);

      if (!this.move.getMove().hitsSubstitute(user, target)) {
        if (!user.isPlayer() && this.move.getMove() instanceof AttackMove) {
          globalScene.applyShuffledModifiers(EnemyAttackStatusEffectChanceModifier, false, target);
        }

        target.lapseTags(BattlerTagLapseType.AFTER_HIT);
      }
    }
  }

  /**
   * Handles checking for and applying Flinches
   * @param user - The {@linkcode Pokemon} using this phase's invoked move
   * @param target - {@linkcode Pokemon} the current target of this phase's invoked move
   * @param dealsDamage - `true` if the attempted move successfully dealt damage
   * @returns a function intended to be passed into a `then()` call.
   */
  protected applyHeldItemFlinchCheck(user: Pokemon, target: Pokemon, dealsDamage: boolean): void {
    if (this.move.getMove().hasAttr(FlinchAttr)) {
      return;
    }

    if (
      dealsDamage
      && !target.hasAbilityWithAttr(IgnoreMoveEffectsAbAttr)
      && !this.move.getMove().hitsSubstitute(user, target)
    ) {
      const flinched = new BooleanHolder(false);
      globalScene.applyModifiers(FlinchChanceModifier, user.isPlayer(), user, flinched);
      if (flinched.value) {
        target.addTag(BattlerTagType.FLINCHED, undefined, this.move.moveId, user.id);
      }
    }
  }

  /**
   * Resolves whether this phase's invoked move hits the given target
   * @param target - The {@linkcode Pokemon} targeted by the invoked move
   * @returns `true` if the move hits the target
   */
  public hitCheck(target: Pokemon): HitCheckEntry {
    const user = this.getUserPokemon();
    const move = this.move.getMove();

    if (isNullOrUndefined(user)) {
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

    const semiInvulnerableTag = target.getTag(SemiInvulnerableTag);
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
    const targetSide = target.isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY;
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

  /** Removes all substitutes that were broken by this phase's invoked move */
  protected updateSubstitutes(): void {
    const targets = this.getTargets();
    targets.forEach((target) => {
      const substitute = target.getTag(SubstituteTag);
      if (substitute && substitute.hp <= 0) {
        target.lapseTag(BattlerTagType.SUBSTITUTE);
      }
    });
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
  public getFirstTarget(): Pokemon | undefined {
    return this.getTargets()[0];
  }

  /** @returns A new `MoveEffectPhase` with the same properties as this phase */
  protected getNewHitPhase(): MoveEffectPhase {
    return new MoveEffectPhase(this.battlerIndex, this.targets, this.move);
  }
}

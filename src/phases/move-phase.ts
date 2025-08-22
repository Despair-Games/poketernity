import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PokemonTypeChangeAbAttr } from "#abilities/pokemon-type-change-ab-attr";
import type { PostMoveUsedAbAttr } from "#abilities/post-move-used-ab-attr";
import type { RedirectMoveAbAttr } from "#abilities/redirect-move-ab-attr";
import type { ReduceSleepDurationAbAttr } from "#abilities/reduce-sleep-duration-ab-attr";
import type { ReflectMovesAbAttr } from "#abilities/reflect-moves-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { activeOverrides } from "#app/overrides";
import { applyBattlerTags } from "#battler-tags/apply-battler-tags";
import type { CenterOfAttentionTag } from "#battler-tags/center-of-attention-tag";
import type { ImprisoningTag } from "#battler-tags/imprisoning-tag";
import type { MagicCoatTag } from "#battler-tags/magic-coat-tag";
import type { SnatchingTag } from "#battler-tags/snatch-tag";
import { allMoves } from "#data/data-lists";
import { getTerrainBlockMessage } from "#data/terrain";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { StatusEffect } from "#enums/status-effect";
import { WeatherType } from "#enums/weather-type";
import { MoveUsedEvent } from "#events/battle-scene";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import { SpeciesFormChangePreMoveTrigger } from "#form-change-triggers/species-form-change-pre-move-trigger";
import { BypassRedirectAttr } from "#moves/bypass-redirect-attr";
import { BypassSleepAttr } from "#moves/bypass-sleep-attr";
import { CopycatAttr } from "#moves/copycat-attr";
import { HealStatusEffectAttr } from "#moves/heal-status-effect-attr";
import { getMoveTargets, SelfStatusMove } from "#moves/move";
import { PreMoveMessageAttr } from "#moves/pre-move-message-attr";
import { VariableMoveMessageAttr } from "#moves/variable-move-message-attr";
import { BattlePhase } from "#phases/base/battle-phase";
import { BooleanHolder, isNil, NumberHolder } from "#utils/common-utils";
import { applyMoveAttrs, isFieldTargeted } from "#utils/move-utils";
import { getStatusEffectActivationText, getStatusEffectHealText } from "#utils/status-effect-utils";
import i18next from "i18next";

interface MovePhaseOptions {
  /**
   * If `true`, some condition checks are skipped for this use of the move:
   * - Effects from non-volatile status conditions (i.e. Sleep, Freeze, and Paralysis)
   * - Volatile status effects; namely Confusion and Infatuation
   * - The effects of the user's Truant ability. Truant will not cancel the move nor
   * increment its turn counter.
   * - The move-cancelling effects of Imprison from any Pokemon other than the user
   * - The move-copying effects of Dancer from any Pokemon other than the user
   */
  followUp?: boolean;
  /** If `true`, this use of the move will not consume any PP */
  ignorePp?: boolean;
  /**
   * Whether or not this move is a "bounced" move as a result of
   * the Pokemon's ongoing Magic Coat effect or Magic Bounce ability.
   */
  reflected?: boolean;
  /**
   * Whether or not this move is a "stolen" move as
   * a result of the user previously using Snatch.
   */
  snatched?: boolean;
}

/**
 * Resolves the following:
 * - Checks if the move can be executed
 * - Applies target redirection based on move effects and abilities
 * - Chooses the move target for counterattack moves
 * - Applies the effects of statuses that might stop a move from executing
 * - Lapses `PRE_MOVE` and `MOVE` `BattlerTag`s
 * - Checks if it's the first turn of a charging move and passes off to a {@linkcode MoveChargePhase} if so
 * - Handles the delayed attack of Future Sight and Doom Desire
 * - Handles PP usage
 * - Handles move failure due to weather or terrain
 * - Handles the Dancer ability
 *
 * If the move is successful, then a {@linkcode MoveEffectPhase} is queued.
 */
export class MovePhase extends BattlePhase {
  public override readonly phaseName = "MovePhase";

  /** The {@linkcode Pokemon} using the move */
  public readonly pokemon: Pokemon;
  /** The {@linkcode PokemonMove} to be used */
  public readonly pokemonMove: PokemonMove;
  /** The {@linkcode BattlerIndex | indexes} of the move's targets on the field */
  public readonly targets: BattlerIndex[];
  /**
   * If `true`, some condition checks are skipped for this use of the move:
   * - Effects from non-volatile status conditions (i.e. Sleep, Freeze, and Paralysis)
   * - Volatile status effects; namely Confusion and Infatuation
   * - The effects of the user's Truant ability. Truant will not cancel the move nor
   * increment its turn counter.
   * - The move-cancelling effects of Imprison from any Pokemon other than the user
   * - The move-copying effects of Dancer from any Pokemon other than the user
   */
  private readonly followUp: boolean;
  /** If `true`, this use of the move will not consume any PP */
  private ignorePp: boolean;
  /**
   * Whether or not this move is a "bounced" move as a result of
   * the Pokemon's ongoing Magic Coat effect or Magic Bounce ability.
   */
  private readonly reflected: boolean;
  /**
   * Whether or not this move is a "stolen" move as
   * a result of the user previously using Snatch.
   * @privateRemarks
   * This is only `public` because Swallow is meant to always succeed
   * when snatched -- even when the user does not have Stockpile stacks.
   * However, whether or not the move was snatched cannot be verified without
   * peeking into the current phase.
   */
  public readonly snatched: boolean;
  private failed: boolean = false;
  private cancelled: boolean = false;

  /**
   * @param followUp Indicates that the move being used is a "follow-up" - for example, a move being used by Metronome or Dancer.
   *                 Follow-ups bypass a few failure conditions, including flinches, sleep/paralysis/freeze and volatile status checks, etc.
   */
  constructor(
    pokemon: Pokemon,
    targets: BattlerIndex[],
    move: PokemonMove | MoveId,
    { followUp = false, ignorePp = false, reflected = false, snatched = false }: MovePhaseOptions = {},
  ) {
    super();

    this.pokemon = pokemon;
    this.targets = targets;
    this.pokemonMove =
      typeof move === "number" ? new PokemonMove(move, { pokemonId: pokemon.id, virtual: true }) : move;
    this.followUp = followUp;
    this.ignorePp = ignorePp;
    this.reflected = reflected;
    this.snatched = snatched;
  }

  /**
   * Checks if the pokemon is active, if the move is usable, and that the move is targetting something.
   * @param ignoreDisableTags `true` to not check if the move is disabled
   * @returns `true` if all the checks pass
   */
  public canMove(ignoreDisableTags: boolean = false): boolean {
    return (
      this.pokemon.isActive(true)
      && this.pokemonMove.isUsable(this.pokemon, this.ignorePp, ignoreDisableTags)
      && (this.targets.length > 0 || this.pokemonMove.getMove().isFieldTarget())
    );
  }

  /** Signifies the current move should fail but still use PP */
  public fail(): void {
    this.failed = true;
  }

  /** Signifies the current move should cancel and retain PP */
  public cancel(): void {
    this.cancelled = true;
  }

  public override start(): void {
    super.start();

    // If the user is affected by another Pokemon's Sky Drop, skip the user's turn
    const skyDropTag = this.pokemon.getTag(BattlerTagType.SKY_DROP);
    if (skyDropTag && skyDropTag.sourceId !== this.pokemon.id) {
      this.end();
      return;
    }

    console.log(MoveId[this.pokemonMove.moveId], `(${getPokemonNameWithAffix(this.pokemon)})`);

    // Check if move is unusable (e.g. because it's out of PP due to a mid-turn Spite).
    if (!this.canMove(true)) {
      if (this.pokemon.isActive(true)) {
        this.fail();
        this.showMoveText();
        this.showFailedText();
      }
      this.end();
      return;
    }

    this.pokemon.turnData.acted = true;

    // Reset hit-related turn data
    this.pokemon.turnData.hitsLeft = -1;
    this.pokemon.turnData.hitCount = 0;

    // Check move to see if arena.ignoreAbilities should be true.
    if (!this.followUp) {
      if (this.pokemonMove.getMove().checkFlag(MoveFlags.IGNORE_ABILITIES, this.pokemon)) {
        globalScene.arena.setIgnoreAbilities(true, this.pokemon.getBattlerIndex());
      }
    }

    this.resolvePreMoveStatusEffects();

    this.resolveImprisoningEffects();

    this.lapsePreMoveAndMoveTags();

    if (!this.cancelled) {
      // trigger pre-move form changes (e.g. Aegislash's stance change)
      globalScene.triggerPokemonFormChange(this.pokemon, SpeciesFormChangePreMoveTrigger);

      this.showMoveText();

      this.resolveRedirectTarget();

      this.resolveCounterAttackTarget();

      this.trySnatchMove();

      this.tryReflectMove();
    }

    if (!(this.failed || this.cancelled)) {
      this.resolveFinalPreMoveCancellationChecks();
    }

    if (this.cancelled || this.failed) {
      this.handlePreMoveFailures();
    } else if (this.pokemonMove.getMove().isChargingMove() && !this.pokemon.hasTag(BattlerTagType.CHARGING)) {
      this.chargeMove();
    } else {
      this.useMove();
    }

    this.end();
  }

  /**
   * Check for cancellation edge cases.
   * Currently only checks if {@linkcode MoveId.NONE}
   * is in the user's move queue
   */
  protected resolveFinalPreMoveCancellationChecks(): void {
    const moveQueue = this.pokemon.getMoveQueue();
    const targets = this.getActiveTargetPokemon();

    if (
      (targets.length === 0 && !isFieldTargeted(this.targets))
      || (moveQueue.length && moveQueue[0].move.id === MoveId.NONE)
    ) {
      this.showFailedText();
      this.cancel();
    }
  }

  /**
   * @returns An array of all {@linkcode Pokemon} targeted by this phase's invoked move.
   * Unless the move is field-targeting, this array only includes active (e.g., non-fainted) targets.
   */
  public getActiveTargetPokemon(): Pokemon[] {
    const activeOnly = !this.pokemonMove.getMove().isFieldTarget();
    return globalScene.getField(activeOnly).filter((p) => this.targets.includes(p.getBattlerIndex()));
  }

  /**
   * Handles {@link StatusEffect.SLEEP Sleep}/{@link StatusEffect.PARALYSIS Paralysis}/{@link StatusEffect.FREEZE Freeze} rolls and side effects.
   */
  protected resolvePreMoveStatusEffects(): void {
    if (
      !this.followUp
      && this.pokemon.hasStatusEffect([StatusEffect.SLEEP, StatusEffect.PARALYSIS, StatusEffect.FREEZE], false, true)
    ) {
      this.pokemon.advanceStatusCounter();
      let activated = false;
      let healed = false;

      const statusEffect = this.pokemon.getStatusEffect(true);
      switch (statusEffect) {
        case StatusEffect.PARALYSIS:
          activated =
            (!this.pokemon.randSeedInt(4) || activeOverrides.STATUS_ACTIVATION_OVERRIDE === true)
            && activeOverrides.STATUS_ACTIVATION_OVERRIDE !== false;
          break;
        case StatusEffect.SLEEP:
          applyMoveAttrs(BypassSleepAttr, this.pokemon, null, this.pokemonMove.getMove());
          applyAbAttrs<ReduceSleepDurationAbAttr>(AbAttrFlag.REDUCE_SLEEP_DURATION, this.pokemon, false, statusEffect);
          healed = this.pokemon.sleepTurnsRemaining <= 0;
          activated = !healed && !this.pokemon.hasTag(BattlerTagType.BYPASS_SLEEP);
          break;
        case StatusEffect.FREEZE:
          healed =
            !!this.pokemonMove
              .getMove()
              .findAttr(
                (attr) =>
                  attr instanceof HealStatusEffectAttr && attr.selfTarget && attr.isOfEffect(StatusEffect.FREEZE),
              )
            || (!this.pokemon.randSeedInt(5) && activeOverrides.STATUS_ACTIVATION_OVERRIDE !== true)
            || activeOverrides.STATUS_ACTIVATION_OVERRIDE === false;

          activated = !healed;
          break;
      }

      if (activated) {
        this.cancel();
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          getStatusEffectActivationText(statusEffect, getPokemonNameWithAffix(this.pokemon)),
        );
        globalScene.phaseManager.createAndUnshiftPhase(
          "CommonAnimPhase",
          (CommonAnim.POISON + (statusEffect - 1)) as CommonAnim,
          this.pokemon.getBattlerIndex(),
        );
      } else if (healed) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          getStatusEffectHealText(statusEffect, getPokemonNameWithAffix(this.pokemon)),
        );
        this.pokemon.resetStatus();
        this.pokemon.updateInfo();
      }
    }
  }

  /**
   * Lapse {@linkcode BattlerTagLapseType.PRE_MOVE PRE_MOVE} tags that trigger before a move is used, regardless of whether or not it failed.
   * Also lapse {@linkcode BattlerTagLapseType.MOVE MOVE} tags if the move should be successful.
   */
  protected lapsePreMoveAndMoveTags(): void {
    this.pokemon.lapseTags(BattlerTagLapseType.PRE_MOVE);

    // TODO: does this intentionally happen before the no targets/MoveId.NONE on queue cancellation case is checked?
    if (!this.followUp && this.canMove() && !this.cancelled) {
      this.pokemon.lapseTags(BattlerTagLapseType.MOVE);
    }
  }

  /**
   * Checks this phase's move against all opponents with ongoing effects from
   * {@link https://bulbapedia.bulbagarden.net/wiki/Imprison_(move) | Imprison}.
   * If an opponent currently has a matching move in their moveset, the move is
   * cancelled, and the corresponding tag's interrupting message is played.
   */
  protected resolveImprisoningEffects(): void {
    if (this.followUp || this.cancelled || this.failed) {
      return;
    }

    for (const opponent of this.pokemon.getOpponents()) {
      if (
        applyBattlerTags<ImprisoningTag>(
          BattlerTagType.IMPRISONING,
          opponent,
          false,
          this.pokemon,
          this.pokemonMove.moveId,
        )
      ) {
        this.cancel();
        break;
      }
    }
  }

  /**
   * Checks if any active Pokemon's Snatch can steal this phase's move. If so, the
   * Pokemon with Snatch steals the move, cancelling this phase and starting a duplicate phase
   * with the snatching Pokemon as the user.
   */
  protected trySnatchMove(): void {
    const move = this.pokemonMove.getMove();

    if (this.snatched || !move.checkFlag(MoveFlags.SNATCHABLE, this.pokemon)) {
      return;
    }

    // Rest and Swallow are only stolen if they would have an effect on the original user
    if (
      [MoveId.REST, MoveId.SWALLOW].includes(this.pokemonMove.moveId)
      && !this.pokemonMove.getMove().applyConditions(this.pokemon, this.pokemon, this.pokemonMove.getMove())
    ) {
      return;
    }

    /**
     * All Pokemon on the field that have acted this turn, excluding the user and any Pokemon
     * under the effects of Sky Drop, in order of when they acted.
     */
    const otherPokemon = globalScene
      .getField(true)
      .filter((p) => p !== this.pokemon && p.turnData.acted && !p.hasTag(BattlerTagType.SKY_DROP))
      .sort((pokemonA, pokemonB) => {
        const [orderA, orderB] = [pokemonA, pokemonB].map((p) => p.turnData.order);
        return orderA - orderB;
      });

    /**
     * The first Pokemon in turn order to have Snatch in effect uses this phase's move
     * for itself and cancels the original move's execution.
     */
    for (const p of otherPokemon) {
      if (applyBattlerTags<SnatchingTag>(BattlerTagType.SNATCHING, p, false, this.pokemon)) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MovePhase",
          p,
          getMoveTargets(p, this.pokemonMove.moveId).targets,
          this.pokemonMove,
          {
            followUp: true,
            snatched: true,
          },
        );

        /**
         * Remove Snatch's effect from the Pokemon to prevent it from
         * stealing subsequent moves in the turn.
         */
        p.removeTag(BattlerTagType.SNATCHING);
        // Cancel the original move
        this.cancel();
        return;
      }
    }
  }

  /**
   * If applicable, applies the effects of the targets' Magic Bounce or Magic Coat
   * to reflect this phase's move onto the user.
   */
  protected tryReflectMove(): void {
    const move = this.pokemonMove.getMove();

    if (this.reflected || !move.checkFlag(MoveFlags.BOUNCEABLE, this.pokemon)) {
      return;
    }

    /** The {@linkcode Pokemon} affected by the move in progress */
    const targets: Pokemon[] = [];

    for (const t of this.targets) {
      switch (t) {
        case BattlerIndex.ATTACKER:
          break;
        case BattlerIndex.PLAYER_SIDE:
          targets.push(...globalScene.getPlayerField().filter((p) => p.isActive(true)));
          break;
        case BattlerIndex.ENEMY_SIDE:
          targets.push(...globalScene.getEnemyField().filter((p) => p.isActive(true)));
          break;
        case BattlerIndex.BOTH_SIDES:
          targets.push(...globalScene.getField(true));
          break;
        default: {
          const target = globalScene.getPokemonByBattlerIndex(t);
          if (!isNil(target)) {
            targets.push(target);
          }
          break;
        }
      }
    }

    const targetSet = new Set<Pokemon>(targets);
    for (const target of targetSet) {
      if (target.isSemiInvulnerable()) {
        continue;
      }

      const reflected = new BooleanHolder(false);
      applyBattlerTags<MagicCoatTag>(BattlerTagType.MAGIC_COAT, target, false, this.pokemon, move, reflected);
      applyAbAttrs<ReflectMovesAbAttr>(AbAttrFlag.REFLECT_MOVES, target, false, this.pokemon, move, reflected);

      if (reflected.value) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MovePhase",
          target,
          this.getReflectionTargets(target),
          move.id,
          {
            followUp: true,
            reflected: true,
          },
        );

        // Only one Pokemon can reflect a field-targeting move (e.g. Spikes) at a time
        if (isFieldTargeted(this.targets)) {
          this.cancel();
          return;
        }
        // Remove this target from the current move's list of targets.
        // If no targets are left after this point, cancel the move.
        this.targets.splice(this.targets.indexOf(target.getBattlerIndex()), 1);
        if (this.targets.length === 0) {
          this.cancel();
        }
      }
    }
  }

  /**
   * Obtains the targets of a move reflected by the given Pokemon's
   * Magic Bounce or Magic Coat
   * @param reflectSource the {@linkcode Pokemon} reflecting the move
   * @returns the new targets of the reflected move by {@linkcode BattlerIndex}
   */
  protected getReflectionTargets(reflectSource: Pokemon): BattlerIndex[] {
    const { targets, multiple } = getMoveTargets(reflectSource, this.pokemonMove.moveId);

    /**
     * - Moves that target multiple Pokemon are reflected in full, e.g. a reflected
     * Growl will reduce both the original attacker and its ally's Attack
     * - Moves that target a side of the field are reflected onto the other side of
     * the field.
     * - Single-target moves are reflected back at the original attacker.
     */
    if (multiple || isFieldTargeted(targets)) {
      return targets;
    }
    return [this.pokemon.getBattlerIndex()];
  }

  protected useMove(): void {
    const targets = this.getActiveTargetPokemon();
    const moveQueue = this.pokemon.getMoveQueue();

    if (moveQueue.length > 0) {
      // Using .shift here clears out two turn moves once they've been used
      this.ignorePp = moveQueue.shift()?.ignorePP ?? false;
    }

    if (this.pokemon.getTag(BattlerTagType.CHARGING)?.sourceMoveId === this.pokemonMove.moveId) {
      this.pokemon.lapseTag(BattlerTagType.CHARGING);
    }

    // "commit" to using the move, deducting PP.
    if (!this.ignorePp) {
      const ppUsed = 1 + this.getPpIncreaseFromPressure(targets);

      this.pokemonMove.usePp(ppUsed);
      globalScene.eventTarget.dispatchEvent(
        new MoveUsedEvent(this.pokemon?.id, this.pokemonMove.getMove(), this.pokemonMove.ppUsed),
      );
    }

    /**
     * Determine if the move is successful (meaning that its damage/effects can be attempted)
     * by checking that all of the following are true:
     * - Conditional attributes of the move are all met
     * - The target's `ForceSwitchOutImmunityAbAttr` is not triggered (see {@linkcode Move.prototype.applyConditions})
     * - Weather does not block the move
     * - Terrain does not block the move
     *
     * TODO: These steps are straightforward, but the implementation below is extremely convoluted.
     */

    const move = this.pokemonMove.getMove();

    /**
     * Move conditions assume the move has a single target
     * TODO: is this sustainable?
     */
    const passesConditions = move.applyConditions(this.pokemon, targets[0] ?? null, move);
    const failedDueToWeather: boolean = globalScene.arena.isMoveWeatherCancelled(this.pokemon, move);
    const failedDueToTerrain: boolean = globalScene.arena.isMoveTerrainCancelled(this.pokemon, this.targets, move);

    const success = passesConditions && !failedDueToWeather && !failedDueToTerrain;

    this.updateLastMoveId(success);

    /**
     * If the move has not failed, trigger ability-based user type changes and then execute it.
     *
     * Notably, Roar, Whirlwind, Trick-or-Treat, and Forest's Curse will trigger these type changes even
     * if the move fails.
     */
    if (success) {
      applyAbAttrs<PokemonTypeChangeAbAttr>(
        AbAttrFlag.POKEMON_TYPE_CHANGE,
        this.pokemon,
        false,
        this.pokemonMove.getMove(),
      );
      this.showPreMoveMessages();
      globalScene.phaseManager.createAndUnshiftPhase(
        "MoveEffectPhase",
        this.pokemon.getBattlerIndex(),
        this.targets,
        this.pokemonMove,
      );
    } else {
      if (
        [MoveId.ROAR, MoveId.WHIRLWIND, MoveId.TRICK_OR_TREAT, MoveId.FORESTS_CURSE].includes(this.pokemonMove.moveId)
      ) {
        applyAbAttrs<PokemonTypeChangeAbAttr>(
          AbAttrFlag.POKEMON_TYPE_CHANGE,
          this.pokemon,
          false,
          this.pokemonMove.getMove(),
        );
      }

      this.pokemon.pushMoveHistory({
        move: this.pokemonMove.getMove(),
        targets: this.targets,
        result: MoveResult.FAIL,
        type: this.pokemon.getMoveType(this.pokemonMove.getMove()),
        virtual: this.pokemonMove.virtual,
      });

      let failedText: string | undefined;
      let failureMessage = move.getFailedText(this.pokemon, targets[0], move, new BooleanHolder(false));

      if (failedDueToWeather) {
        if (globalScene.arena.weather?.weatherType === WeatherType.HARSH_SUN) {
          failureMessage = i18next.t("weather:harshSunStopAttackMessage");
        } else {
          failureMessage = i18next.t("weather:heavyRainStopAttackMessage");
        }
      }

      if (failureMessage) {
        failedText = failureMessage;
      } else if (failedDueToTerrain) {
        failedText = getTerrainBlockMessage(targets[0], globalScene.arena.getTerrainType());
      }

      this.showFailedText(failedText);

      // Remove the user from its semi-invulnerable state (if applicable)
      this.pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);
    }

    // Handle Dancer, which triggers immediately after a move is used (rather than waiting on `this.end()`).
    // Note that the `!this.followUp` check here prevents an infinite Dancer loop.
    if (this.pokemonMove.getMove().checkFlag(MoveFlags.DANCE_MOVE, this.pokemon, targets[0]) && !this.followUp) {
      globalScene.getField(true).forEach((pokemon) => {
        applyAbAttrs<PostMoveUsedAbAttr>(
          AbAttrFlag.POST_MOVE_USED,
          pokemon,
          false,
          this.pokemonMove,
          this.pokemon,
          this.targets,
        );
      });
    }
  }

  /** Queues a {@linkcode MoveChargePhase} for this phase's invoked move. */
  protected chargeMove(): void {
    const move = this.pokemonMove.getMove();
    const targets = this.getActiveTargetPokemon();

    if (move.applyConditions(this.pokemon, targets[0], move)) {
      this.updateLastMoveId(true);

      // Protean and Libero apply on the charging turn of charge moves
      applyAbAttrs<PokemonTypeChangeAbAttr>(
        AbAttrFlag.POKEMON_TYPE_CHANGE,
        this.pokemon,
        false,
        this.pokemonMove.getMove(),
      );

      globalScene.phaseManager.createAndUnshiftPhase(
        "MoveChargePhase",
        this.pokemon.getBattlerIndex(),
        this.targets,
        this.pokemonMove,
      );
    } else {
      this.pokemon.pushMoveHistory({
        move: this.pokemonMove.getMove(),
        targets: this.targets,
        result: MoveResult.FAIL,
        type: this.pokemon.getMoveType(this.pokemonMove.getMove()),
        virtual: this.pokemonMove.virtual,
      });

      const failureMessage = move.getFailedText(this.pokemon, targets[0], move, new BooleanHolder(false));
      this.showFailedText(failureMessage ?? undefined);

      // Remove the user from its semi-invulnerable state (if applicable)
      this.pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);
    }
  }

  /**
   * Update the battle's "last move" pointer, unless we're currently mimicking a move.
   * The last move used is unaffected by moves that fail.
   * @param success - Whether the move was successful or not.
   */
  protected updateLastMoveId(success: boolean): void {
    if (!allMoves.get(this.pokemonMove.moveId).hasAttr(CopycatAttr)) {
      if (success) {
        globalScene.currentBattle.lastMove = this.pokemonMove.getMove();
      }
    }
  }

  /**
   * Applies PP increasing abilities (currently only {@link AbilityId.PRESSURE Pressure}) if they exist on the target pokemon.
   * Note that targets must include only active pokemon.
   *
   * TODO: This hardcodes the PP increase at 1 per opponent, rather than deferring to the ability.
   */
  public getPpIncreaseFromPressure(targets: Pokemon[]): number {
    const foesWithPressure = this.pokemon
      .getOpponents()
      .filter((o) => targets.includes(o) && o.isActive(true) && o.hasAbilityWithAttr(AbAttrFlag.INCREASE_PP));
    return foesWithPressure.length;
  }

  /**
   * Modifies `this.targets` in place, based upon:
   * - Move redirection abilities, effects, etc.
   * - Counterattacks, which pass a special value into the `targets` constructor param (`[`{@linkcode BattlerIndex.ATTACKER}`]`).
   */
  protected resolveRedirectTarget(): void {
    if (this.targets.length === 1) {
      const currentTarget = this.targets[0];
      const redirectTarget = new NumberHolder(currentTarget);

      // check move redirection abilities of every pokemon *except* the user.
      globalScene
        .getField(true)
        .filter((p) => p !== this.pokemon)
        .forEach((p) =>
          applyAbAttrs<RedirectMoveAbAttr>(
            AbAttrFlag.REDIRECT_MOVE,
            p,
            false,
            this.pokemonMove.moveId,
            this.pokemon,
            redirectTarget,
          ),
        );

      /** `true` if an Ability is responsible for redirecting the move to another target; `false` otherwise */
      let redirectedByAbility = currentTarget !== redirectTarget.value;

      // check for center-of-attention tags (note that this will override redirect abilities)
      this.pokemon.getOpponents().forEach((p) => {
        const redirectTag = p.getTag<CenterOfAttentionTag>(BattlerTagType.CENTER_OF_ATTENTION);

        // TODO: don't hardcode this interaction.
        // Handle interaction between the rage powder center-of-attention tag and moves used by grass types/overcoat-havers (which are immune to RP's redirect)
        if (
          redirectTag
          && (!redirectTag.powder
            || (!this.pokemon.isOfType(ElementalType.GRASS) && !this.pokemon.hasAbility(AbilityId.OVERCOAT)))
        ) {
          redirectTarget.value = p.getBattlerIndex();
          redirectedByAbility = false;
        }
      });

      if (currentTarget !== redirectTarget.value) {
        const bypassRedirectAttrs = this.pokemonMove.getMove().getAttrs(BypassRedirectAttr);
        bypassRedirectAttrs.forEach((attr) => {
          if (!attr.abilitiesOnly || redirectedByAbility) {
            redirectTarget.value = currentTarget;
          }
        });

        if (this.pokemon.hasAbilityWithAttr(AbAttrFlag.BLOCK_REDIRECT)) {
          redirectTarget.value = currentTarget;
          globalScene.phaseManager.createAndUnshiftPhase(
            "ShowAbilityPhase",
            this.pokemon.getBattlerIndex(),
            this.pokemon.getPassiveAbility().hasAttrFlag(AbAttrFlag.BLOCK_REDIRECT),
          );
        }

        this.targets[0] = redirectTarget.value;
      }
    }
  }

  /**
   * Counter-attacking moves pass in `[`{@linkcode BattlerIndex.ATTACKER}`]` into the constructor's `targets` param.
   * This function modifies `this.targets` to reflect the actual battler index of the user's last
   * attacker.
   *
   * If there is no last attacker, or they are no longer on the field, a message is displayed and the
   * move is marked for failure.
   */
  protected resolveCounterAttackTarget(): void {
    if (this.targets.length === 1 && this.targets[0] === BattlerIndex.ATTACKER) {
      if (this.pokemon.turnData.attacksReceived.length) {
        this.targets[0] = this.pokemon.turnData.attacksReceived[0].sourceBattlerIndex;
        const [target] = this.targets;
        const targetPkm = globalScene.getPokemonByBattlerIndex(target);

        // account for metal burst and comeuppance hitting remaining targets in double battles
        // counterattack will redirect to remaining ally if original attacker faints
        if (
          globalScene.currentBattle.double
          && this.pokemonMove.getMove().checkFlag(MoveFlags.REDIRECT_COUNTER, this.pokemon, targetPkm)
        ) {
          if (!targetPkm?.hp) {
            const opposingField = this.pokemon.getOpposingField();
            this.targets[0] = opposingField.find((p) => p.hp > 0)?.getBattlerIndex() ?? BattlerIndex.ATTACKER;
          }
        }
      }

      if (this.targets[0] === BattlerIndex.ATTACKER) {
        this.fail();
        this.showFailedText();
      }
    }
  }

  /**
   * Handles the case where the move was cancelled or failed:
   * - Uses PP if the move failed (not cancelled) and should use PP (failed moves are not affected by {@link AbilityId.PRESSURE Pressure})
   * - Records a cancelled OR failed move in move history, so abilities like {@link AbilityId.TRUANT Truant} don't trigger on the
   *   next turn and soft-lock.
   * - Lapses `MOVE_EFFECT` tags:
   *   - Semi-invulnerable battler tags (Fly/Dive/etc.) are intended to lapse on move effects, but also need
   *     to lapse on move failure/cancellation.
   *
   *     TODO: ...this seems weird.
   * - Removes the second turn of charge moves
   */
  protected handlePreMoveFailures(): void {
    if (this.cancelled || this.failed) {
      if (this.failed) {
        const ppUsed = this.ignorePp ? 0 : 1;

        if (ppUsed) {
          this.pokemonMove.usePp();
        }

        globalScene.eventTarget.dispatchEvent(new MoveUsedEvent(this.pokemon?.id, this.pokemonMove.getMove(), ppUsed));
      }

      this.pokemon.pushMoveHistory({
        move: SelfStatusMove.none(),
        result: MoveResult.FAIL,
        type: ElementalType.UNKNOWN,
        targets: this.targets,
      });

      this.pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);

      this.pokemon.getMoveQueue().shift();
    }
  }

  /**
   * Displays the move's usage text to the player, unless the Pokemon
   * is on a recharge turn (ie: {@link MoveId.HYPER_BEAM Hyper Beam}),
   * or a 2-turn move was interrupted (ie: {@link MoveId.FLY Fly}).
   */
  public showMoveText(): void {
    if (this.reflected || this.snatched || this.pokemonMove.moveId === MoveId.NONE) {
      return;
    }

    if (this.pokemon.hasTag(BattlerTagType.RECHARGING, BattlerTagType.INTERRUPTED)) {
      return;
    }

    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", this.getMoveText(), 500);
  }

  /**
   * Obtains the move's usage text, accounting for changes from the used move's
   * {@link VariableMoveMessageAttr} attribute.
   * @returns the final move message text to display.
   */
  private getMoveText(): string {
    const move = this.pokemonMove.getMove();
    /** @todo This call doesn't have a proper "target"; it just reuses the user Pokemon */
    const variableMessage = move.getAttrs(VariableMoveMessageAttr)[0]?.getMoveMessage(this.pokemon, this.pokemon, move);

    return (
      variableMessage
      ?? i18next.t("battle:useMove", {
        pokemonNameWithAffix: getPokemonNameWithAffix(this.pokemon),
        moveName: this.pokemonMove.name,
      })
    );
  }

  public showFailedText(failedText?: string): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", failedText ?? i18next.t("battle:attackFailed"));
  }

  /**
   * Displays the move's pre-execution messages, if applicable.
   * Ex. Chilly Reception's "<Pokemon> is preparing to tell a chillingly bad joke!"
   */
  public showPreMoveMessages(): void {
    applyMoveAttrs(PreMoveMessageAttr, this.pokemon, this.pokemon.getOpponents()[0], this.pokemonMove.getMove());
  }
}

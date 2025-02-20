import { BattlerIndex } from "#enums/battler-index";
import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import { allMoves } from "#app/data/data-lists";
import { CommonAnim } from "#enums/common-anim";
import { type CenterOfAttentionTag } from "#app/data/battler-tags";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { applyMoveAttrs, isFieldTargeted } from "#app/utils/move-utils";
import { BypassRedirectAttr } from "#app/data/move-attrs/bypass-redirect-attr";
import { BypassSleepAttr } from "#app/data/move-attrs/bypass-sleep-attr";
import { CopyMoveAttr } from "#app/data/move-attrs/copy-move-attr";
import { HealStatusEffectAttr } from "#app/data/move-attrs/heal-status-effect-attr";
import { PreMoveMessageAttr } from "#app/data/move-attrs/pre-move-message-attr";
import { SpeciesFormChangePreMoveTrigger } from "#app/data/species-form-change-triggers/species-form-change-pre-move-trigger";
import { getStatusEffectActivationText, getStatusEffectHealText } from "#app/data/status-effect";
import { getTerrainBlockMessage } from "#app/data/terrain";
import { MoveUsedEvent } from "#app/events/battle-scene";
import { type Pokemon } from "#app/field/pokemon";
import { PokemonMove } from "#app/field/pokemon-move";
import { MoveResult } from "#enums/move-result";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import Overrides from "#app/overrides";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { BooleanHolder, NumberHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";
import { ElementalType } from "#enums/elemental-type";
import i18next from "i18next";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PhaseId } from "#enums/phase-id";
import { SelfStatusMove } from "#app/data/move";
import { WeatherType } from "#enums/weather-type";

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
 * If the move is successful then a {@linkcode MoveEffectPhase} is queued.
 * Regardless of success, a {@linkcode MoveEndPhase} is queued.
 *
 * @extends BattlePhase
 */
export class MovePhase extends BattlePhase {
  override readonly id = PhaseId.MOVE;

  protected _pokemon: Pokemon;
  protected _move: PokemonMove;
  protected _targets: BattlerIndex[];
  protected followUp: boolean;
  protected ignorePp: boolean;
  protected failed: boolean = false;
  protected cancelled: boolean = false;

  /**
   * @param followUp Indicates that the move being used is a "follow-up" - for example, a move being used by Metronome or Dancer.
   *                 Follow-ups bypass a few failure conditions, including flinches, sleep/paralysis/freeze and volatile status checks, etc.
   */
  constructor(
    pokemon: Pokemon,
    targets: BattlerIndex[],
    move: PokemonMove | MoveId,
    followUp: boolean = false,
    ignorePp: boolean = false,
  ) {
    super();

    this.pokemon = pokemon;
    this.targets = targets;
    this.move = typeof move === "number" ? new PokemonMove(move, 0, 0, true) : move;
    this.followUp = followUp;
    this.ignorePp = ignorePp;
  }

  public get pokemon(): Pokemon {
    return this._pokemon;
  }

  protected set pokemon(pokemon: Pokemon) {
    this._pokemon = pokemon;
  }

  public get move(): PokemonMove {
    return this._move;
  }

  protected set move(move: PokemonMove) {
    this._move = move;
  }

  public get targets(): BattlerIndex[] {
    return this._targets;
  }

  protected set targets(targets: BattlerIndex[]) {
    this._targets = targets;
  }

  /**
   * Checks if the pokemon is active, if the move is usable, and that the move is targetting something.
   * @param ignoreDisableTags `true` to not check if the move is disabled
   * @returns `true` if all the checks pass
   */
  public canMove(ignoreDisableTags: boolean = false): boolean {
    return (
      this.pokemon.isActive(true)
      && this.move.isUsable(this.pokemon, this.ignorePp, ignoreDisableTags)
      && (this.targets.length > 0 || this.move.getMove().isFieldTarget())
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
      return this.end();
    }

    console.log(MoveId[this.move.moveId]);

    // Check if move is unusable (e.g. because it's out of PP due to a mid-turn Spite).
    if (!this.canMove(true)) {
      if (this.pokemon.isActive(true)) {
        this.fail();
        this.showMoveText();
        this.showFailedText();
      }
      return this.end();
    }

    this.pokemon.turnData.acted = true;

    // Reset hit-related turn data when starting follow-up moves (e.g. Metronomed moves, Dancer repeats)
    if (this.followUp) {
      this.pokemon.turnData.hitsLeft = -1;
      this.pokemon.turnData.hitCount = 0;
    }

    // Check move to see if arena.ignoreAbilities should be true.
    if (!this.followUp) {
      if (this.move.getMove().checkFlag(MoveFlags.IGNORE_ABILITIES, this.pokemon, null)) {
        globalScene.arena.setIgnoreAbilities(true, this.pokemon.getBattlerIndex());
      }
    }

    this.resolveRedirectTarget();

    this.resolveCounterAttackTarget();

    this.resolvePreMoveStatusEffects();

    this.lapsePreMoveAndMoveTags();

    if (!(this.failed || this.cancelled)) {
      this.resolveFinalPreMoveCancellationChecks();
    }

    if (this.cancelled || this.failed) {
      this.handlePreMoveFailures();
    } else if (this.move.getMove().isChargingMove() && !this.pokemon.getTag(BattlerTagType.CHARGING)) {
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
      || (moveQueue.length && moveQueue[0].moveId === MoveId.NONE)
    ) {
      this.showMoveText();
      this.showFailedText();
      this.cancel();
    }
  }

  /**
   * @returns An array of all {@linkcode Pokemon} targeted by this phase's invoked move.
   * Unless the move is field-targeting, this array only includes active (e.g., non-fainted) targets.
   */
  public getActiveTargetPokemon(): Pokemon[] {
    const activeOnly = !this.move.getMove().isFieldTarget();
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
      this.pokemon.status!.incrementTurn();
      let activated = false;
      let healed = false;

      const statusEffect = this.pokemon.getStatusEffect(true);
      switch (statusEffect) {
        case StatusEffect.PARALYSIS:
          activated =
            (!this.pokemon.randSeedInt(4) || Overrides.STATUS_ACTIVATION_OVERRIDE === true)
            && Overrides.STATUS_ACTIVATION_OVERRIDE !== false;
          break;
        case StatusEffect.SLEEP:
          applyMoveAttrs(BypassSleepAttr, this.pokemon, null, this.move.getMove());
          const turnsRemaining = new NumberHolder(this.pokemon.status!.sleepTurnsRemaining ?? 0);
          applyAbAttrs(
            AbAttrFlag.REDUCE_SLEEP_DURATION,
            this.pokemon,
            false,
            statusEffect,
            turnsRemaining,
          );
          if (Overrides.STATUS_ACTIVATION_OVERRIDE === true) {
            turnsRemaining.value = Math.max(turnsRemaining.value, 1);
          } else if (Overrides.STATUS_ACTIVATION_OVERRIDE === false) {
            turnsRemaining.value = 0;
          }
          this.pokemon.status!.sleepTurnsRemaining = turnsRemaining.value;
          healed = this.pokemon.status!.sleepTurnsRemaining <= 0;
          activated = !healed && !this.pokemon.getTag(BattlerTagType.BYPASS_SLEEP);
          break;
        case StatusEffect.FREEZE:
          healed =
            !!this.move
              .getMove()
              .findAttr(
                (attr) =>
                  attr instanceof HealStatusEffectAttr && attr.selfTarget && attr.isOfEffect(StatusEffect.FREEZE),
              )
            || (!this.pokemon.randSeedInt(5) && Overrides.STATUS_ACTIVATION_OVERRIDE !== true)
            || Overrides.STATUS_ACTIVATION_OVERRIDE === false;

          activated = !healed;
          break;
      }

      if (activated) {
        this.cancel();
        globalScene.queueMessage(
          getStatusEffectActivationText(statusEffect, getPokemonNameWithAffix(this.pokemon)),
        );
        globalScene.unshiftPhase(
          new CommonAnimPhase(
            this.pokemon.getBattlerIndex(),
            undefined,
            CommonAnim.POISON + (statusEffect - 1),
          ),
        );
      } else if (healed) {
        globalScene.queueMessage(
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

  protected useMove(): void {
    const targets = this.getActiveTargetPokemon();
    const moveQueue = this.pokemon.getMoveQueue();

    // form changes happen even before we know that the move wll execute.
    globalScene.triggerPokemonFormChange(this.pokemon, SpeciesFormChangePreMoveTrigger);

    this.showMoveText();

    if (moveQueue.length > 0) {
      // Using .shift here clears out two turn moves once they've been used
      this.ignorePp = moveQueue.shift()?.ignorePP ?? false;
    }

    if (this.pokemon.getTag(BattlerTagType.CHARGING)?.sourceMoveId === this.move.moveId) {
      this.pokemon.lapseTag(BattlerTagType.CHARGING);
    }

    // "commit" to using the move, deducting PP.
    if (!this.ignorePp) {
      const ppUsed = 1 + this.getPpIncreaseFromPressure(targets);

      this.move.usePp(ppUsed);
      globalScene.eventTarget.dispatchEvent(new MoveUsedEvent(this.pokemon?.id, this.move.getMove(), this.move.ppUsed));
    }

    // Update the battle's "last move" pointer, unless we're currently mimicking a move.
    if (!allMoves[this.move.moveId].hasAttr(CopyMoveAttr)) {
      globalScene.currentBattle.lastMove = this.move.getMove();
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

    const move = this.move.getMove();

    /**
     * Move conditions assume the move has a single target
     * TODO: is this sustainable?
     */
    const passesConditions = move.applyConditions(this.pokemon, targets[0] ?? null, move);
    const failedDueToWeather: boolean = globalScene.arena.isMoveWeatherCancelled(this.pokemon, move);
    const failedDueToTerrain: boolean = globalScene.arena.isMoveTerrainCancelled(this.pokemon, this.targets, move);

    const success = passesConditions && !failedDueToWeather && !failedDueToTerrain;

    /**
     * If the move has not failed, trigger ability-based user type changes and then execute it.
     *
     * Notably, Roar, Whirlwind, Trick-or-Treat, and Forest's Curse will trigger these type changes even
     * if the move fails.
     */
    if (success) {
      applyAbAttrs(AbAttrFlag.POKEMON_TYPE_CHANGE, this.pokemon, false, this.move.getMove());
      this.showPreMoveMessages();
      globalScene.unshiftPhase(new MoveEffectPhase(this.pokemon.getBattlerIndex(), this.targets, this.move));
    } else {
      if ([MoveId.ROAR, MoveId.WHIRLWIND, MoveId.TRICK_OR_TREAT, MoveId.FORESTS_CURSE].includes(this.move.moveId)) {
        applyAbAttrs(AbAttrFlag.POKEMON_TYPE_CHANGE, this.pokemon, false, this.move.getMove());
      }

      this.pokemon.pushMoveHistory({
        move: this.move.getMove(),
        targets: this.targets,
        result: MoveResult.FAIL,
        type: this.pokemon.getMoveType(this.move.getMove()),
        virtual: this.move.virtual,
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
    if (this.move.getMove().hasFlag(MoveFlags.DANCE_MOVE) && !this.followUp) {
      globalScene.getField(true).forEach((pokemon) => {
        applyAbAttrs(AbAttrFlag.POST_MOVE_USED, pokemon, false, this.move, this.pokemon, this.targets);
      });
    }
  }

  /** Queues a {@linkcode MoveChargePhase} for this phase's invoked move. */
  protected chargeMove(): void {
    const move = this.move.getMove();
    const targets = this.getActiveTargetPokemon();

    if (move.applyConditions(this.pokemon, targets[0], move)) {
      // Protean and Libero apply on the charging turn of charge moves
      applyAbAttrs(AbAttrFlag.POKEMON_TYPE_CHANGE, this.pokemon, false, this.move.getMove());

      this.showMoveText();
      globalScene.chargeMove(this.pokemon.getBattlerIndex(), this.targets, this.move);
    } else {
      this.pokemon.pushMoveHistory({
        move: this.move.getMove(),
        targets: this.targets,
        result: MoveResult.FAIL,
        type: this.pokemon.getMoveType(this.move.getMove()),
        virtual: this.move.virtual,
      });

      const failureMessage = move.getFailedText(this.pokemon, targets[0], move, new BooleanHolder(false));
      this.showMoveText();
      this.showFailedText(failureMessage ?? undefined);

      // Remove the user from its semi-invulnerable state (if applicable)
      this.pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);
    }
  }

  /**
   * Queues a {@linkcode MoveEndPhase} if the move wasn't a {@linkcode followUp} and {@linkcode canMove()} returns `true`,
   * then ends the phase.
   */
  public override end(): void {
    if (!this.followUp && this.canMove()) {
      globalScene.unshiftPhase(new MoveEndPhase(this.pokemon.getBattlerIndex()));
    }

    super.end();
  }

  /**
   * Applies PP increasing abilities (currently only {@link Abilities.PRESSURE Pressure}) if they exist on the target pokemon.
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
        .forEach((p) => applyAbAttrs(AbAttrFlag.REDIRECT_MOVE, p, false, this.move.moveId, redirectTarget));

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
            || (!this.pokemon.isOfType(ElementalType.GRASS) && !this.pokemon.hasAbility(Abilities.OVERCOAT)))
        ) {
          redirectTarget.value = p.getBattlerIndex();
          redirectedByAbility = false;
        }
      });

      if (currentTarget !== redirectTarget.value) {
        const bypassRedirectAttrs = this.move.getMove().getAttrs(BypassRedirectAttr);
        bypassRedirectAttrs.forEach((attr) => {
          if (!attr.abilitiesOnly || redirectedByAbility) {
            redirectTarget.value = currentTarget;
          }
        });

        if (this.pokemon.hasAbilityWithAttr(AbAttrFlag.BLOCK_REDIRECT)) {
          redirectTarget.value = currentTarget;
          globalScene.unshiftPhase(
            new ShowAbilityPhase(
              this.pokemon.getBattlerIndex(),
              this.pokemon.getPassiveAbility().hasAttrFlag(AbAttrFlag.BLOCK_REDIRECT),
            ),
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

        // account for metal burst and comeuppance hitting remaining targets in double battles
        // counterattack will redirect to remaining ally if original attacker faints
        if (globalScene.currentBattle.double && this.move.getMove().hasFlag(MoveFlags.REDIRECT_COUNTER)) {
          if (!globalScene.getFieldPokemonByBattlerIndex(this.targets[0])?.hp) {
            const opposingField = this.pokemon.getOpposingField();
            this.targets[0] = opposingField.find((p) => p.hp > 0)?.getBattlerIndex() ?? BattlerIndex.ATTACKER;
          }
        }
      }

      if (this.targets[0] === BattlerIndex.ATTACKER) {
        this.fail();
        this.showMoveText();
        this.showFailedText();
      }
    }
  }

  /**
   * Handles the case where the move was cancelled or failed:
   * - Uses PP if the move failed (not cancelled) and should use PP (failed moves are not affected by {@link Abilities.PRESSURE Pressure})
   * - Records a cancelled OR failed move in move history, so abilities like {@link Abilities.TRUANT Truant} don't trigger on the
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
          this.move.usePp();
        }

        globalScene.eventTarget.dispatchEvent(new MoveUsedEvent(this.pokemon?.id, this.move.getMove(), ppUsed));
      }

      this.pokemon.pushMoveHistory({
        move: SelfStatusMove.none(),
        result: MoveResult.FAIL,
        type: ElementalType.UNKNOWN,
      });

      this.pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);

      this.pokemon.getMoveQueue().shift();
    }
  }

  /**
   * Displays the move's usage text to the player, unless it's a charge turn (ie: {@link MoveId.SOLAR_BEAM Solar Beam}),
   * the pokemon is on a recharge turn (ie: {@link MoveId.HYPER_BEAM Hyper Beam}), or a 2-turn move was interrupted (ie: {@link MoveId.FLY Fly}).
   */
  public showMoveText(): void {
    if (this.move.moveId === MoveId.NONE) {
      return;
    }

    if (this.pokemon.getTag(BattlerTagType.RECHARGING) || this.pokemon.getTag(BattlerTagType.INTERRUPTED)) {
      return;
    }

    globalScene.queueMessage(
      i18next.t("battle:useMove", {
        pokemonNameWithAffix: getPokemonNameWithAffix(this.pokemon),
        moveName: this.move.getName(),
      }),
      500,
    );
  }

  public showFailedText(failedText?: string): void {
    globalScene.queueMessage(failedText ?? i18next.t("battle:attackFailed"));
  }

  /**
   * Displays the move's pre-execution messages, if applicable.
   * Ex. Chilly Reception's "<Pokemon> is preparing to tell a chillingly bad joke!"
   */
  public showPreMoveMessages(): void {
    applyMoveAttrs(PreMoveMessageAttr, this.pokemon, this.pokemon.getOpponents()[0], this.move.getMove());
  }
}

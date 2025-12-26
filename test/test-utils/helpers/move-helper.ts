import { getPokemonNameWithAffix } from "#app/messages";
import { activeOverrides } from "#app/overrides";
import { allMoves } from "#data/data-lists";
import { BattleCommand } from "#enums/battle-command";
import { BattlerIndex } from "#enums/battler-index";
import { Button } from "#enums/button";
import { MoveId } from "#enums/move-id";
import { UiMode } from "#enums/ui-mode";
import type { Pokemon } from "#field/pokemon";
import { getMoveTargets } from "#moves/move";
import type { CommandPhase } from "#phases/command-phase";
import type { EnemyCommandPhase } from "#phases/enemy-command-phase";
import type { MoveEffectPhase } from "#phases/move-effect-phase";
import type { SelectTargetPhase } from "#phases/select-target-phase";
import { getMovePosition } from "#test/test-utils/game-manager-utils";
import { GameManagerHelper } from "#test/test-utils/helpers/game-manager-helper";
import type { FightUiHandler } from "#ui/fight-ui-handler";
import type { TargetSelectUiHandler } from "#ui/target-select-ui-handler";
import { coerceArray } from "#utils/common-utils";
import chalk from "chalk";
import { expect, vi } from "vitest";

// Chalk must be set to level 3 when used with Vitest in order to properly color the console output
chalk.level = 3;

/**
 * Helper to handle a Pokemon's move
 */
export class MoveHelper extends GameManagerHelper {
  /**
   * Intercepts {@linkcode MoveEffectPhase} and mocks the phase's move's
   * accuracy to -1, guaranteeing a hit.
   */
  public async forceHit(): Promise<void> {
    await this.game.phaseInterceptor.to("MoveEffectPhase", false);
    const moveEffectPhase = this.game.scene.phaseManager.getCurrentPhase<MoveEffectPhase>();
    expect(moveEffectPhase).toBeDefined();
    const move = moveEffectPhase!.move.getMove();
    vi.spyOn(move, "calculateBattleAccuracy").mockImplementation((user, _target, _simulated) => {
      console.log(chalk.gray(`- Forcing hit on ${getPokemonNameWithAffix(user)}'s ${move.name}! - `));
      return -1;
    });
  }

  /**
   * Intercepts {@linkcode MoveEffectPhase} and mocks the phase's move's accuracy
   * to 0, guaranteeing a miss.
   * @param firstTargetOnly - Whether the move should force miss on the first target only, in the case of multi-target moves.
   */
  public async forceMiss(firstTargetOnly: boolean = false): Promise<void> {
    await this.game.phaseInterceptor.to("MoveEffectPhase", false);
    const moveEffectPhase = this.game.scene.phaseManager.getCurrentPhase() as MoveEffectPhase;
    const accuracy = vi.spyOn(moveEffectPhase.move.getMove(), "calculateBattleAccuracy");

    if (firstTargetOnly) {
      accuracy.mockReturnValueOnce(0);
    } else {
      accuracy.mockReturnValue(0);
    }
  }

  /**
   * Select the move to be used by the given Pokemon(-index). Triggers during the next {@linkcode CommandPhase}
   * @param moveId - the move to use
   * @param pkmIndex - the pokemon index. Relevant for double-battles only (defaults to 0)
   * @param targetIndex - (optional) The {@linkcode BattlerIndex} of the Pokemon to target for single-target moves, or `null` if a manual call to `selectTarget()` is required
   * @param useTera - If `true`, the Pokemon also chooses to Terastallize. This does not require a Tera Orb. Default: `false`.
   */
  public select(
    moveId: MoveId,
    pkmIndex: 0 | 1 = 0,
    targetIndex?: BattlerIndex | null,
    useTera: boolean = false,
  ): void {
    const movePosition = getMovePosition(this.game.scene, pkmIndex, moveId);

    this.game.onNextPrompt("CommandPhase", UiMode.COMMAND, () => {
      // biome-ignore lint/nursery/noFloatingPromises: TODO: fix this
      this.game.scene.ui.setMode<FightUiHandler>(
        UiMode.FIGHT,
        (this.game.scene.phaseManager.getCurrentPhase() as CommandPhase).getFieldIndex(),
      );
    });
    this.game.onNextPrompt("CommandPhase", UiMode.FIGHT, () => {
      (this.game.scene.phaseManager.getCurrentPhase() as CommandPhase).handleCommand(
        useTera ? BattleCommand.TERA : BattleCommand.FIGHT,
        movePosition,
        false,
      );
    });

    if (targetIndex !== null) {
      this.selectTarget(movePosition, targetIndex);
    }
  }

  /**
   * Modifies a player pokemon's moveset to contain only the selected move and then
   * selects it to be used during the next {@linkcode CommandPhase}.
   *
   * Warning: Will disable the player moveset override if it is enabled!
   *
   * Note: If you need to check for changes in the player's moveset as part of the test, it may be
   * best to use {@linkcode changeMoveset} and {@linkcode select} instead.
   * @param moveId - the move to use
   * @param pkmIndex - the pokemon index. Relevant for double-battles only (defaults to 0)
   * @param targetIndex - (optional) The {@linkcode BattlerIndex} of the Pokemon to target for single-target moves, or `null` if a manual call to `selectTarget()` is required
   * @param useTera - If `true`, the Pokemon also chooses to Terastallize. This does not require a Tera Orb. Default: `false`.
   */
  public use(moveId: MoveId, pkmIndex: 0 | 1 = 0, targetIndex?: BattlerIndex | null, useTera: boolean = false): void {
    if (coerceArray(activeOverrides.MOVESET_OVERRIDE).length > 0) {
      vi.spyOn(activeOverrides, "MOVESET_OVERRIDE", "get").mockReturnValue([]);
      console.warn("Warning: `use` overwrites the Pokemon's moveset and disables the player moveset override!");
    }

    const pokemon = this.game.scene.getPlayerField()[pkmIndex];
    pokemon.setMoveset(moveId);

    this.select(moveId, pkmIndex, targetIndex, useTera);
  }

  /**
   * Forces the statuses Paralysis, Freeze, Sleep, Confusion, or Infatuation to activate on the next move by temporarily mocking {@linkcode activeOverrides.STATUS_ACTIVATION_OVERRIDE},
   * advancing to the next `MovePhase`, and then resetting the override to `null`
   * @param activated - `true` to force the status to activate, `false` to force the status to not activate (will cause Freeze to heal)
   */
  public async forceStatusActivation(activated: boolean): Promise<void> {
    vi.spyOn(activeOverrides, "STATUS_ACTIVATION_OVERRIDE", "get").mockReturnValue(activated);
    await this.game.phaseInterceptor.to("MovePhase");
    vi.spyOn(activeOverrides, "STATUS_ACTIVATION_OVERRIDE", "get").mockReturnValue(null);
  }

  /**
   * Changes a pokemon's moveset to the given move(s).
   *
   * Used when the normal moveset override can't be used (such as when it's necessary to check or update properties of the moveset).
   *
   * **Note**: Will disable the moveset override matching the pokemon's party!
   * @param pokemon - The {@linkcode Pokemon} being modified
   * @param moveset - The {@linkcode MoveId | moves} (single or array) to change the Pokemon's moveset to
   */
  public changeMoveset(pokemon: Pokemon, moveset: MoveId | MoveId[]): void {
    if (pokemon.isPlayer()) {
      if (coerceArray(activeOverrides.MOVESET_OVERRIDE).length > 0) {
        vi.spyOn(activeOverrides, "MOVESET_OVERRIDE", "get").mockReturnValue([]);
        console.warn("Player moveset override disabled due to use of `game.move.changeMoveset`!");
      }
    } else if (coerceArray(activeOverrides.ENEMY_MOVESET_OVERRIDE).length > 0) {
      vi.spyOn(activeOverrides, "ENEMY_MOVESET_OVERRIDE", "get").mockReturnValue([]);
      console.warn("Enemy moveset override disabled due to use of `game.move.changeMoveset`!");
    }

    const newMoveset = coerceArray(moveset);
    pokemon.setMoveset(...newMoveset);
    const movesetStr = newMoveset.map((moveId) => MoveId[moveId]).join(", ");
    console.log(
      `Pokemon ${pokemon.species.name}'s moveset manually set to ${movesetStr} (=[${newMoveset.join(", ")}])!`,
    );
  }

  /**
   * Forces the next enemy selecting a move to use the given move in its moveset
   * against the given target (if applicable).
   * @param moveId The {@linkcode MoveId | move} the enemy will use
   * @param target (Optional) the {@linkcode BattlerIndex | target} which the enemy will use the given move against
   */
  public async selectEnemyMove(moveId: MoveId, target?: BattlerIndex) {
    // Wait for the next EnemyCommandPhase to start
    await this.game.phaseInterceptor.to("EnemyCommandPhase", false);
    const enemy =
      this.game.scene.getEnemyField()[this.game.scene.phaseManager.getCurrentPhase<EnemyCommandPhase>()!.fieldIndex];
    const legalTargets = getMoveTargets(enemy, moveId);

    vi.spyOn(enemy, "getNextMove").mockReturnValueOnce({
      move: allMoves.get(moveId),
      targets:
        target !== undefined && !legalTargets.multiple && legalTargets.targets.includes(target)
          ? [target]
          : enemy.getNextTargets(moveId),
      type: enemy.getMoveType(allMoves.get(moveId)),
    });

    /**
     * Run the EnemyCommandPhase to completion.
     * This allows this function to be called consecutively to
     * force a move for each enemy in a double battle.
     */
    await this.game.phaseInterceptor.to("EnemyCommandPhase");
  }

  /**
   * Forces the next enemy selecting a move to use the given move against the given target (if applicable).
   *
   * Warning: Overwrites the pokemon's moveset and disables the moveset override!
   *
   * Note: If you need to check for changes in the enemy's moveset as part of the test, it may be
   * best to use {@linkcode changeMoveset} and {@linkcode selectEnemyMove} instead.
   * @param moveId The {@linkcode MoveId | move} the enemy will use
   * @param target (Optional) the {@linkcode BattlerIndex | target} which the enemy will use the given move against
   */
  public async forceEnemyMove(moveId: MoveId, target?: BattlerIndex) {
    // Wait for the next EnemyCommandPhase to start
    await this.game.phaseInterceptor.to("EnemyCommandPhase", false);
    const enemy =
      this.game.scene.getEnemyField()[this.game.scene.phaseManager.getCurrentPhase<EnemyCommandPhase>()!.fieldIndex];

    if (coerceArray(activeOverrides.ENEMY_MOVESET_OVERRIDE).length > 0) {
      vi.spyOn(activeOverrides, "ENEMY_MOVESET_OVERRIDE", "get").mockReturnValue([]);
      console.warn(
        "Warning: `forceEnemyMove` overwrites the Pokemon's moveset and disables the enemy moveset override!",
      );
    }

    enemy.setMoveset(moveId);
    const legalTargets = getMoveTargets(enemy, moveId);

    vi.spyOn(enemy, "getNextMove").mockReturnValueOnce({
      move: allMoves.get(moveId),
      targets:
        target !== undefined && !legalTargets.multiple && legalTargets.targets.includes(target)
          ? [target]
          : enemy.getNextTargets(moveId),
      type: enemy.getMoveType(allMoves.get(moveId)),
    });

    /**
     * Run the EnemyCommandPhase to completion.
     * This allows this function to be called consecutively to
     * force a move for each enemy in a double battle.
     */
    await this.game.phaseInterceptor.to("EnemyCommandPhase");
  }

  /**
   * Emulate a player's target selection after a move is chosen, called automatically by {@linkcode MoveHelper.select}.
   * Will trigger during the next {@linkcode SelectTargetPhase}
   * @param movePosition - The index of the move in the Pokemon's {@linkcode Pokemon.moveset | moveset}
   * @param targetIndex - The index of the attack target, or `undefined` for multi-target attacks
   */
  private selectTarget(movePosition: number, targetIndex?: BattlerIndex) {
    this.game.onNextPrompt(
      "SelectTargetPhase",
      UiMode.TARGET_SELECT,
      () => {
        const handler = this.game.scene.ui.getCurrentHandler<TargetSelectUiHandler>();
        const phase = this.game.scene.phaseManager.getCurrentPhase<SelectTargetPhase>()!;
        const move = phase.getPokemon().getMoveset()[movePosition].getMove();
        if (!move.isMultiTarget()) {
          handler.setCursor(targetIndex ?? BattlerIndex.ENEMY);
        } else if (targetIndex !== undefined) {
          expect.fail(`\`targetIndex\` was passed to \`selectMove()\` but move ("${move.name}") is not targeted`);
        }
        handler.processInput(Button.ACTION);
      },
      () =>
        this.game.isCurrentPhase("CommandPhase")
        || this.game.isCurrentPhase("MovePhase")
        || this.game.isCurrentPhase("TurnStartPhase")
        || this.game.isCurrentPhase("TurnEndPhase"),
    );
  }
}

import type { BattlerIndex } from "#app/battle";
import { getMoveTargets } from "#app/data/move";
import { PokemonMove, type Pokemon } from "#app/field/pokemon";
import Overrides from "#app/overrides";
import type { CommandPhase } from "#app/phases/command-phase";
import type { EnemyCommandPhase } from "#app/phases/enemy-command-phase";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { Command } from "#app/ui/command-ui-handler";
import { Mode } from "#app/ui/ui";
import { Moves } from "#enums/moves";
import { getMovePosition } from "#test/testUtils/gameManagerUtils";
import { GameManagerHelper } from "#test/testUtils/helpers/gameManagerHelper";
import { vi } from "vitest";

/**
 * Helper to handle a Pokemon's move
 */
export class MoveHelper extends GameManagerHelper {
  /**
   * Intercepts {@linkcode MoveEffectPhase} and mocks the phase's move's
   * accuracy to -1, guaranteeing a hit.
   */
  public async forceHit(): Promise<void> {
    await this.game.phaseInterceptor.to(MoveEffectPhase, false);
    const moveEffectPhase = this.game.scene.getCurrentPhase() as MoveEffectPhase;
    vi.spyOn(moveEffectPhase.move.getMove(), "calculateBattleAccuracy").mockReturnValue(-1);
  }

  /**
   * Intercepts {@linkcode MoveEffectPhase} and mocks the phase's move's accuracy
   * to 0, guaranteeing a miss.
   * @param firstTargetOnly - Whether the move should force miss on the first target only, in the case of multi-target moves.
   */
  public async forceMiss(firstTargetOnly: boolean = false): Promise<void> {
    await this.game.phaseInterceptor.to(MoveEffectPhase, false);
    const moveEffectPhase = this.game.scene.getCurrentPhase() as MoveEffectPhase;
    const accuracy = vi.spyOn(moveEffectPhase.move.getMove(), "calculateBattleAccuracy");

    if (firstTargetOnly) {
      accuracy.mockReturnValueOnce(0);
    } else {
      accuracy.mockReturnValue(0);
    }
  }

  /**
   * Select the move to be used by the given Pokemon(-index). Triggers during the next {@linkcode CommandPhase}
   * @param move - the move to use
   * @param pkmIndex - the pokemon index. Relevant for double-battles only (defaults to 0)
   * @param targetIndex - (optional) The {@linkcode BattlerIndex} of the Pokemon to target for single-target moves, or `null` if a manual call to `selectTarget()` is required
   */
  public select(move: Moves, pkmIndex: 0 | 1 = 0, targetIndex?: BattlerIndex | null): void {
    const movePosition = getMovePosition(this.game.scene, pkmIndex, move);

    this.game.onNextPrompt("CommandPhase", Mode.COMMAND, () => {
      this.game.scene.ui.setMode(Mode.FIGHT, (this.game.scene.getCurrentPhase() as CommandPhase).getFieldIndex());
    });
    this.game.onNextPrompt("CommandPhase", Mode.FIGHT, () => {
      (this.game.scene.getCurrentPhase() as CommandPhase).handleCommand(Command.FIGHT, movePosition, false);
    });

    if (targetIndex !== null) {
      this.game.selectTarget(movePosition, targetIndex);
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
   * @param move - the move to use
   * @param pkmIndex - the pokemon index. Relevant for double-battles only (defaults to 0)
   * @param targetIndex - (optional) The {@linkcode BattlerIndex} of the Pokemon to target for single-target moves, or `null` if a manual call to `selectTarget()` is required
   */
  public useMove(move: Moves, pkmIndex: 0 | 1 = 0, targetIndex?: BattlerIndex | null): void {
    const movesetOverride = Array.isArray(Overrides.MOVESET_OVERRIDE)
      ? Overrides.MOVESET_OVERRIDE
      : [Overrides.MOVESET_OVERRIDE];
    if (movesetOverride.length > 0) {
      Overrides.MOVESET_OVERRIDE = [];
      console.warn(
        "Warning: Player moveset override disabled! Do not use the moveset override when using this function!",
      );
    }

    const pokemon = this.game.scene.getPlayerField()[pkmIndex];
    pokemon.moveset = [new PokemonMove(move)];

    this.select(move, pkmIndex, targetIndex);
  }

  /**
   * Forces the statuses Paralysis, Freeze, Sleep, Confusion, or Infatuation to activate on the next move by temporarily mocking {@linkcode Overrides.STATUS_ACTIVATION_OVERRIDE},
   * advancing to the next `MovePhase`, and then resetting the override to `null`
   * @param activated - `true` to force the status to activate, `false` to force the status to not activate (will cause Freeze to heal)
   */
  public async forceStatusActivation(activated: boolean): Promise<void> {
    vi.spyOn(Overrides, "STATUS_ACTIVATION_OVERRIDE", "get").mockReturnValue(activated);
    await this.game.phaseInterceptor.to("MovePhase");
    vi.spyOn(Overrides, "STATUS_ACTIVATION_OVERRIDE", "get").mockReturnValue(null);
  }

  /**
   * Used when the normal moveset override can't be used (such as when it's necessary to check updated properties of the moveset).
   * @param pokemon - The pokemon being modified
   * @param moveset - The moveset to use
   */
  public changeMoveset(pokemon: Pokemon, moveset: Moves | Moves[]): void {
    if (!Array.isArray(moveset)) {
      moveset = [moveset];
    }
    pokemon.moveset = [];
    moveset.forEach((move) => {
      pokemon.moveset.push(new PokemonMove(move));
    });
    const movesetStr = moveset.map((moveId) => Moves[moveId]).join(", ");
    console.log(`Pokemon ${pokemon.species.name}'s moveset manually set to ${movesetStr} (=[${moveset.join(", ")}])!`);
  }

  /**
   * Forces the next enemy selecting a move to use the given move in its moveset
   * against the given target (if applicable).
   * @param moveId The {@linkcode Moves | move} the enemy will use
   * @param target (Optional) the {@linkcode BattlerIndex | target} which the enemy will use the given move against
   */
  async selectEnemyMove(moveId: Moves, target?: BattlerIndex) {
    // Wait for the next EnemyCommandPhase to start
    await this.game.phaseInterceptor.to("EnemyCommandPhase", false);
    const enemy =
      this.game.scene.getEnemyField()[(this.game.scene.getCurrentPhase() as EnemyCommandPhase).getFieldIndex()];
    const legalTargets = getMoveTargets(enemy, moveId);

    vi.spyOn(enemy, "getNextMove").mockReturnValueOnce({
      move: moveId,
      targets:
        target !== undefined && !legalTargets.multiple && legalTargets.targets.includes(target)
          ? [target]
          : enemy.getNextTargets(moveId),
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
   * @param moveId The {@linkcode Moves | move} the enemy will use
   * @param target (Optional) the {@linkcode BattlerIndex | target} which the enemy will use the given move against
   */
  async forceEnemyMove(moveId: Moves, target?: BattlerIndex) {
    // Wait for the next EnemyCommandPhase to start
    await this.game.phaseInterceptor.to("EnemyCommandPhase", false);
    const enemy =
      this.game.scene.getEnemyField()[(this.game.scene.getCurrentPhase() as EnemyCommandPhase).getFieldIndex()];

    const movesetOverride = Array.isArray(Overrides.OPP_MOVESET_OVERRIDE)
      ? Overrides.OPP_MOVESET_OVERRIDE
      : [Overrides.OPP_MOVESET_OVERRIDE];
    if (movesetOverride.length > 0) {
      Overrides.OPP_MOVESET_OVERRIDE = [];
      console.warn(
        "Warning: Enemy moveset override disabled! Do not use the moveset override when using this function!",
      );
    }
    enemy.moveset = [new PokemonMove(moveId)];
    const legalTargets = getMoveTargets(enemy, moveId);

    vi.spyOn(enemy, "getNextMove").mockReturnValueOnce({
      move: moveId,
      targets:
        target !== undefined && !legalTargets.multiple && legalTargets.targets.includes(target)
          ? [target]
          : enemy.getNextTargets(moveId),
    });

    /**
     * Run the EnemyCommandPhase to completion.
     * This allows this function to be called consecutively to
     * force a move for each enemy in a double battle.
     */
    await this.game.phaseInterceptor.to("EnemyCommandPhase");
  }
}

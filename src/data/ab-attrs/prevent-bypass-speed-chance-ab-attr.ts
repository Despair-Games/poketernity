import type { Move } from "#app/data/move";
import { allMoves } from "#app/data/all-moves";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Command } from "#app/ui/command-ui-handler";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * This attribute checks if a Pokemon's move meets a provided condition to determine if the Pokemon can use Quick Claw
 * It was created because Pokemon with the ability Mycelium Might cannot access Quick Claw's benefits when using status moves.
 * @param condition checks if a move meets certain conditions
 * @extends AbAttr
 */
export class PreventBypassSpeedChanceAbAttr extends AbAttr {
  private readonly condition: (pokemon: Pokemon, move: Move) => boolean;

  constructor(condition: (pokemon: Pokemon, move: Move) => boolean) {
    super(true);
    this.condition = condition;
  }

  /**
   * @param bypassSpeed - `args[0]`: determines if a Pokemon is able to bypass speed at the moment
   * @param canCheckHeldItems - `args[1]`: determines if a Pokemon has access to Quick Claw's effects or not
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const bypassSpeed = args[0] as BooleanHolder;
    const canCheckHeldItems = args[1] as BooleanHolder;

    const turnCommand = globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
    const isCommandFight = turnCommand?.command === Command.FIGHT;
    const move = turnCommand?.move?.move ? allMoves[turnCommand.move.move] : null;
    if (move && this.condition(pokemon, move) && isCommandFight) {
      bypassSpeed.value = false;
      canCheckHeldItems.value = false;
      return false;
    }
    return true;
  }
}

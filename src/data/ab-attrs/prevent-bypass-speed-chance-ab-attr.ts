import type { Move } from "#app/data/move";
import { allMoves } from "#app/data/all-moves";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattleCommand } from "#enums/battle-command";
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

  override apply(pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    const turnCommand = globalScene.currentBattle.turnManager.findCommand((tc) => tc.pokemon === pokemon);
    const isCommandFight = turnCommand?.command === BattleCommand.FIGHT;
    const move = turnCommand?.move?.move ? allMoves[turnCommand.move.move] : null;
    if (move && this.condition(pokemon, move) && isCommandFight) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}

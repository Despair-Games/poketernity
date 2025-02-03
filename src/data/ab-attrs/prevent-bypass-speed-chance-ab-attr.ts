import type { Move } from "#app/data/move";
import { allMoves } from "#app/data/all-moves";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattleCommand } from "#enums/battle-command";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

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
    this._flags.add(AbAttrFlag.PREVENT_BYPASS_SPEED_CHANCE);
    this.condition = condition;
  }

  /**
   * @param bypassSpeed determines if a Pokemon is able to bypass speed at the moment
   * @param canCheckHeldItems determines if a Pokemon has access to Quick Claw's effects or not
   */
  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    bypassSpeed: BooleanHolder,
    canCheckHeldItems: BooleanHolder,
  ): boolean {
    const turnCommand = globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
    const isCommandFight = turnCommand?.command === BattleCommand.FIGHT;
    const move = turnCommand?.move?.moveId ? allMoves[turnCommand.move.moveId] : null;
    if (move && this.condition(pokemon, move) && isCommandFight) {
      bypassSpeed.value = false;
      canCheckHeldItems.value = false;
      return false;
    }
    return true;
  }
}

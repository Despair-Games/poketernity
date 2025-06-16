import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattleCommand } from "#enums/battle-command";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * This attribute checks if a Pokemon's move meets a provided condition to determine if the Pokemon can use Quick Claw
 * It was created because Pokemon with the ability Mycelium Might cannot access Quick Claw's benefits when using status moves.
 * @param condition checks if a move meets certain conditions
 */
export class PreventBypassSpeedChanceAbAttr extends AbAttr {
  private readonly condition: (pokemon: Pokemon, move: Move) => boolean;

  constructor(condition: (pokemon: Pokemon, move: Move) => boolean) {
    super(true);
    this._flags.add(AbAttrFlag.PREVENT_BYPASS_SPEED_CHANCE);
    this.condition = condition;
  }

  public override apply(pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    const turnCommand = globalScene.currentBattle.turnManager.findCommandFromPokemon(pokemon);
    const isCommandFight = turnCommand?.command === BattleCommand.FIGHT;
    const move = turnCommand?.turnMove?.move;
    if (move && this.condition(pokemon, move) && isCommandFight) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}

import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { BattleCommand } from "#enums/battle-command";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";

type ConditionFunc = (pokemon: Pokemon, move: Move) => boolean;

/**
 * If a Pokemon has Mycelium Might and is holding a Quick Claw, the Quick Claw cannot activate for status moves.
 * @see {@link https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9438575}
 */
export class PreventBypassSpeedChanceAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PreventBypassSpeedChanceAbAttr";

  private readonly condition: ConditionFunc;

  constructor(condition: ConditionFunc) {
    super();
    this.condition = condition;
  }

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    const turnCommand = globalScene.currentBattle.turnManager.findCommandFromPokemon(pokemon);
    const isCommandFight = turnCommand?.command === BattleCommand.FIGHT;
    const move = turnCommand?.turnMove?.move;

    return move != null && isCommandFight && this.condition(pokemon, move);
  }
}

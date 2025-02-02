import { allMoves } from "#app/data/all-moves";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattleCommand } from "#enums/battle-command";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { AbAttr } from "./ab-attr";

/**
 * If a Pokémon with this Ability selects a damaging move, it has a 30% chance of going first in its priority bracket. If the Ability activates, this is announced at the start of the turn (after move selection).
 *
 * @extends AbAttr
 */
export class BypassSpeedChanceAbAttr extends AbAttr {
  public readonly chance: number;

  /**
   * @param chance probability of ability being active.
   */
  constructor(chance: number) {
    super(true);
    this.chance = chance;
  }

  /**
   * bypass move order in their priority bracket when pokemon choose damaging move
   * @param pokemon {@linkcode Pokemon} applying this ability
   * @param simulated if `true`, suppresses changes to game state
   * @param bypassSpeed {@linkcode BooleanHolder} set to true when the ability activated
   * @returns whether the ability was activated
   */
  override apply(pokemon: Pokemon, simulated: boolean, bypassSpeed: BooleanHolder): boolean {
    if (simulated) {
      return false;
    }

    if (!bypassSpeed.value && pokemon.randSeedInt(100) < this.chance) {
      const turnCommand = globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
      const isCommandFight = turnCommand?.command === BattleCommand.FIGHT;
      const move = turnCommand?.move?.moveId ? allMoves[turnCommand.move.moveId] : null;
      const isDamageMove = move?.category === MoveCategory.PHYSICAL || move?.category === MoveCategory.SPECIAL;

      if (isCommandFight && isDamageMove) {
        bypassSpeed.value = true;
        return true;
      }
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:quickDraw", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
}

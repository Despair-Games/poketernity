import { allMoves } from "../move";
import { MoveCategory } from "../../enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { Command } from "#app/ui/command-ui-handler";
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
   * @param _passive N/A
   * @param _cancelled N/A
   * @param args [0] {@linkcode BooleanHolder} set to true when the ability activated
   * @returns whether the ability was activated
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (simulated) {
      return false;
    }
    const bypassSpeed = args[0] as BooleanHolder;

    if (!bypassSpeed.value && pokemon.randSeedInt(100) < this.chance) {
      const turnCommand = globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
      const isCommandFight = turnCommand?.command === Command.FIGHT;
      const move = turnCommand?.move?.move ? allMoves[turnCommand.move.move] : null;
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

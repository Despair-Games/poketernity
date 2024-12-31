import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class ResetStatsAttr extends MoveEffectAttr {
  private targetAllPokemon: boolean;
  constructor(targetAllPokemon: boolean) {
    super();
    this.targetAllPokemon = targetAllPokemon;
  }

  /**
   * If {@linkcode targetAllPokemon} is `true`, resets the stat stages
   * of all active Pokemon on the field.
   * Otherwise, resets the stat stages of the given target.
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    if (this.targetAllPokemon) {
      // Target all pokemon on the field when Freezy Frost or Haze are used
      const activePokemon = globalScene.getField(true);
      activePokemon.forEach((p) => this.resetStats(p));
      globalScene.queueMessage(i18next.t("moveTriggers:statEliminated"));
    } else {
      // Affects only the single target when Clear Smog is used
      this.resetStats(target);
      globalScene.queueMessage(i18next.t("moveTriggers:resetStats", { pokemonName: getPokemonNameWithAffix(target) }));
    }
    return true;
  }

  private resetStats(pokemon: Pokemon): void {
    for (const s of BATTLE_STATS) {
      pokemon.setStatStage(s, 0);
    }
    pokemon.updateInfo();
  }
}

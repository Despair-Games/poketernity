import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to reset the stat stages of a single Pokemon
 * (e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Clear_Smog_(move) Clear Smog})
 * or all Pokemon on the field
 * (e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Haze_(move) Haze}).
 * @extends MoveEffectAttr
 */
export class ResetStatsAttr extends MoveEffectAttr {
  /** Should this attribute reset the stat stages of *all* Pokemon on the field? */
  private targetAllPokemon: boolean;
  constructor(targetAllPokemon: boolean) {
    super();
    this.targetAllPokemon = targetAllPokemon;
  }

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

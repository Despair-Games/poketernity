import { globalScene } from "#app/global-scene";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";

/**
 * Battler tag indicating a Tatsugiri with {@link https://bulbapedia.bulbagarden.net/wiki/Commander_(Ability) | Commander}
 * has entered the tagged Pokemon's mouth.
 */
export class CommandedTag extends BattlerTag {
  private _tatsugiriFormKey: string;

  constructor(sourceId: number) {
    super(BattlerTagType.COMMANDED, BattlerTagLapseType.CUSTOM, 0, MoveId.NONE, sourceId);
  }

  public get tatsugiriFormKey(): string {
    return this._tatsugiriFormKey;
  }

  /** Caches the Tatsugiri's form key and sharply boosts the tagged Pokemon's stats */
  override onAdd(pokemon: Pokemon): void {
    this._tatsugiriFormKey = this.getSourcePokemon()?.getFormKey() ?? "curly";
    globalScene.phaseManager.unshiftPhase(
      new StatStageChangePhase(
        pokemon.getBattlerIndex(),
        pokemon,
        [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD],
        2,
      ),
    );
  }

  /** Triggers an {@linkcode PokemonAnimType | animation} of the tagged Pokemon "spitting out" Tatsugiri */
  override onRemove(pokemon: Pokemon): void {
    if (this.getSourcePokemon()?.isActive(true)) {
      globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.COMMANDER_REMOVE);
    }
  }

  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this._tatsugiriFormKey = source._tatsugiriFormKey;
  }
}

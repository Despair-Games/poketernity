import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { MovePhase } from "#phases/move-phase";
import i18next from "i18next";

/**
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Flinch | Flinch (Bulbapedia)}
 */
export class FlinchedTag extends BattlerTag {
  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.FLINCHED, [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.TURN_END], 0, sourceMoveId);
  }

  public override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isMax();
  }

  public override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
  }

  public override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType !== BattlerTagLapseType.PRE_MOVE) {
      return super.lapse(pokemon, lapseType);
    }

    globalScene.phaseManager.getCurrentPhase<MovePhase>().cancel();
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:flinchedLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );

    applyAbAttrs("FlinchEffectAbAttr", { pokemon, simulated: false });

    return true;
  }

  public override getDescriptor(): string {
    return i18next.t("battlerTags:flinchedDesc");
  }
}

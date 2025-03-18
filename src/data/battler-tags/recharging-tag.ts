import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { SelfStatusMove } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MovePhase } from "#app/phases/move-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the "recharge" effects of moves
 * e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Hyper_Beam_(move) | Hyper Beam}
 * @extends BattlerTag
 */
export class RechargingTag extends BattlerTag {
  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.RECHARGING, [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.TURN_END], 2, sourceMoveId);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    // Queue a placeholder move for the Pokemon to "use" next turn
    pokemon.getMoveQueue().push({ move: SelfStatusMove.none(), targets: [], type: ElementalType.UNKNOWN });
  }

  /** Cancels the source's move this turn and queues a "__ must recharge!" message */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.PRE_MOVE) {
      globalScene.queueMessage(
        i18next.t("battlerTags:rechargingLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
      (globalScene.getCurrentPhase() as MovePhase).cancel();
      pokemon.getMoveQueue().shift();
    }
    return super.lapse(pokemon, lapseType);
  }
}

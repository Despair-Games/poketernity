import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Wish_(move) Wish}.
 * Heals the Pokémon in the user's position the turn after Wish is used.
 */
export class WishTag extends ArenaTag {
  private battlerIndex: BattlerIndex;
  private triggerMessage: string;
  private healHp: number;

  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.WISH, turnCount, MoveId.WISH, sourceId, side);
  }

  override onAdd(_arena: Arena): void {
    if (this.sourceId) {
      const user = globalScene.getPokemonById(this.sourceId);
      if (user) {
        this.battlerIndex = user.getBattlerIndex();
        this.triggerMessage = i18next.t("arenaTag:wishTagOnAdd", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
        });
        this.healHp = toDmgValue(user.getMaxHp() / 2);
      } else {
        console.warn("Failed to get source for WishTag onAdd");
      }
    }
  }

  override onRemove(_arena: Arena): void {
    const target = globalScene.getPokemonByBattlerIndex(this.battlerIndex);
    if (target?.isActive(true)) {
      globalScene.phaseManager.queueMessagePhase(this.triggerMessage);
      globalScene.phaseManager.queuePokemonHealPhase(target.getBattlerIndex(), this.healHp);
    }
  }
}

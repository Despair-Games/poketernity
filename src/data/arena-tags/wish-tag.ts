import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Wish_(move) Wish}.
 * Heals the Pokémon in the user's position the turn after Wish is used.
 */
export class WishTag extends ArenaTag {
  private battlerIndex: FieldBattlerIndex;
  private triggerMessage: string;
  private healHp: number;

  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.WISH, turnCount, MoveId.WISH, sourceId, side);
  }

  override onAdd(): void {
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

  override onRemove(): void {
    const target = globalScene.getPokemonByBattlerIndex(this.battlerIndex);
    if (target?.isActive(true)) {
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", this.triggerMessage);
      globalScene.phaseManager.createAndUnshiftPhase("PokemonHealPhase", target.getBattlerIndex(), this.healHp);
    }
  }
}

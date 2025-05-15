import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { TRAPPED_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { allMoves } from "#data/data-lists";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Tag to prevent the owner from switching out or fleeing from battle.
 * @extends BattlerTag
 */
export class TrappedTag extends BattlerTag {
  constructor(
    tagType: BattlerTagType,
    lapseType: BattlerTagLapseType,
    turnCount: number,
    sourceMoveId: MoveId,
    sourceId: number,
  ) {
    super(tagType, lapseType, turnCount, sourceMoveId, sourceId, true);
  }

  override canAdd(pokemon: Pokemon): boolean {
    const source = globalScene.getPokemonById(this.sourceId!)!;
    const move = allMoves.get(this.sourceMoveId);

    const isGhost = pokemon.isOfType(ElementalType.GHOST);
    const isTrapped = pokemon.getTag(...TRAPPED_BATTLER_TAG_TYPES);
    const hasSubstitute = move.hitsSubstitute(source, pokemon);

    return !isTrapped && !isGhost && (this.sourceMoveId === MoveId.G_MAX_TERROR || !hasSubstitute);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(this.getTrapMessage(pokemon));
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:trappedOnRemove", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        moveName: this.getMoveName(),
      }),
    );
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:trappedDesc");
  }

  override isSourceLinked(): boolean {
    return true;
  }

  getTrapMessage(pokemon: Pokemon): string {
    return i18next.t("battlerTags:trappedOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
}

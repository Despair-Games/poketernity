import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import type { BaseArenaTag } from "#types/arena-tag-types";
import type { Mutable } from "#types/utility-types";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Wish_(move) Wish}.
 * Heals the Pokémon in the user's position the turn after Wish is used.
 */
export class WishTag extends SerializableArenaTag {
  // The following fields are meant to be inwardly mutable, but outwardly immutable.
  public readonly battlerIndex: BattlerIndex;
  public readonly healHp: number;
  public readonly sourceName: string;
  // End inwardly mutable fields

  public override readonly tagType = ArenaTagType.WISH;

  constructor(turnCount: number, sourceId: number | undefined, side: ArenaTagSide) {
    super(turnCount, MoveId.WISH, sourceId, side);
  }

  override onAdd(): void {
    if (this.sourceId == null) {
      console.warn("Source ID missing for `WishTag`!");
      return;
    }

    const source = globalScene.getPokemonById(this.sourceId);
    if (source == null) {
      console.warn("Unable to find source Pokemon for `WishTag`!");
      return;
    }

    (this as Mutable<this>).sourceName = getPokemonNameWithAffix(source);
    (this as Mutable<this>).healHp = toDmgValue(source.getMaxHp() / 2);
    (this as Mutable<this>).battlerIndex = source.getBattlerIndex();
  }

  override onRemove(): void {
    const target = globalScene.getPokemonByBattlerIndex(this.battlerIndex);
    if (target?.isActive(true)) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        // TODO: Rename key as it triggers on activation
        i18next.t("arenaTag:wishTagOnAdd", {
          pokemonNameWithAffix: this.sourceName,
        }),
      );
      globalScene.phaseManager.createAndUnshiftPhase("PokemonHealPhase", target.getBattlerIndex(), this.healHp);
    }
  }

  public override loadTag(
    source: BaseArenaTag & Pick<WishTag, "tagType" | "battlerIndex" | "healHp" | "sourceName">,
  ): void {
    super.loadTag(source);
    (this as Mutable<this>).battlerIndex = source.battlerIndex;
    (this as Mutable<this>).healHp = source.healHp;
    (this as Mutable<this>).sourceName = source.sourceName;
  }
}

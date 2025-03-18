import type { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { MoveRestrictionBattlerTag } from "#app/data/battler-tags/move-restriction-battler-tag";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import i18next from "i18next";

/**
 * Tag used by Gorilla Tactics to restrict the user to using only one move.
 * @extends MoveRestrictionBattlerTag
 */
export class GorillaTacticsTag extends MoveRestrictionBattlerTag {
  private moveId = MoveId.NONE;

  constructor() {
    super(BattlerTagType.GORILLA_TACTICS, BattlerTagLapseType.CUSTOM, 0);
  }

  /** @override */
  override isMoveRestricted(moveId: MoveId): boolean {
    return moveId !== this.moveId;
  }

  /**
   * @override
   * @param pokemon - The {@linkcode Pokemon} to check if the tag can be added
   * @returns `true` if the pokemon has a valid move and no existing {@linkcode GorillaTacticsTag}; `false` otherwise
   */
  override canAdd(pokemon: Pokemon): boolean {
    return this.getLastValidMove(pokemon) !== undefined && !pokemon.getTag(BattlerTagType.GORILLA_TACTICS);
  }

  /**
   * Ensures that move history exists on {@linkcode Pokemon} and has a valid move.
   * If so, sets the {@linkcode moveId} and increases the user's Attack by 50%.
   * @override
   * @param pokemon the {@linkcode Pokemon} to add the tag to
   */
  override onAdd(pokemon: Pokemon): void {
    const lastValidMove = this.getLastValidMove(pokemon);

    if (!lastValidMove) {
      return;
    }

    this.moveId = lastValidMove.id;
    pokemon.setStat(Stat.ATK, pokemon.getStat(Stat.ATK, false) * 1.5, false);
  }

  /**
   * Loads the Gorilla Tactics Battler Tag along with its unique class variable moveId
   * @override
   * @param source Gorilla Tactics' {@linkcode BattlerTag} information
   */
  public override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.moveId = source.moveId;
  }

  /**
   *
   * @override
   * @param pokemon n/a
   * @param _moveId {@linkcode MoveId} ID of the move being denied
   * @returns text to display when the move is denied
   */
  override getSelectionDeniedText(pokemon: Pokemon, _moveId: MoveId): string {
    return i18next.t("battle:canOnlyUseMove", {
      moveName: allMoves.get(this.moveId).name,
      pokemonName: getPokemonNameWithAffix(pokemon),
    });
  }

  override getInterruptedText(_pokemon: Pokemon, _moveId: MoveId): string {
    return "";
  }
}

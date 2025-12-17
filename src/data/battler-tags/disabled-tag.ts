import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTag } from "#battler-tags/battler-tag";
import { MoveRestrictionBattlerTag } from "#battler-tags/move-restriction-battler-tag";
import type { AbilityId } from "#enums/ability-id";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { getPokemonMoveName } from "#utils/pokemon-utils";
import i18next from "i18next";

/**
 * Tag representing the "disabling" effect performed by {@linkcode MoveId.DISABLE} and {@linkcode AbilityId.CURSED_BODY}.
 * When the tag is added, the last-used move of the tag holder is set as the disabled move.
 */
export class DisabledTag extends MoveRestrictionBattlerTag {
  /** The move being disabled. Gets set when {@linkcode onAdd} is called for this tag. */
  private moveId: MoveId = MoveId.NONE;

  constructor(sourceId: number) {
    super(
      BattlerTagType.DISABLED,
      [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.TURN_END],
      4,
      MoveId.DISABLE,
      sourceId,
    );
  }

  /** @override */
  override isMoveRestricted(moveId: MoveId): boolean {
    return moveId === this.moveId;
  }

  /**
   * @override
   *
   * Ensures that move history exists on `pokemon` and has a valid move. If so, sets the {@linkcode moveId} and shows a message.
   * Otherwise the move ID will not get assigned and this tag will get removed next turn.
   */
  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    const lastValidMove = this.getLastValidMove(pokemon);
    if (lastValidMove === undefined) {
      return;
    }

    this.moveId = lastValidMove.id;
    const moveName = getPokemonMoveName(pokemon, this.moveId);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:disabledOnAdd", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        moveName,
      }),
    );
  }

  /** @override */
  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    const moveName = getPokemonMoveName(pokemon, this.moveId);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:disabledLapse", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        moveName,
      }),
    );
  }

  /** @override */
  override getSelectionDeniedText(pokemon: Pokemon, moveId: MoveId): string {
    const moveName = getPokemonMoveName(pokemon, moveId);
    return i18next.t("battle:moveDisabled", { moveName });
  }

  /**
   * @override
   * @param pokemon - {@linkcode Pokemon} attempting to use the restricted move
   * @param moveId - The {@linkcode MoveId | move} being interrupted
   * @returns text to display when the move is interrupted
   */
  override getInterruptedText(pokemon: Pokemon, moveId: MoveId): string {
    const moveName = getPokemonMoveName(pokemon, moveId);
    return i18next.t("battle:disableInterruptedMove", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName,
    });
  }

  /** @override */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.moveId = source.moveId;
  }
}

import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTag } from "#arena-tags/arena-tag";
import { allMoves } from "#data/data-lists";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { ProtectConditionFunc } from "#types/move-types";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Class to implement conditional team protection.
 * Applies protection based on the attributes of incoming moves.
 */
export abstract class ConditionalProtectTag extends ArenaTag {
  /** The condition function to determine which moves are negated */
  protected protectConditionFunc: ProtectConditionFunc;
  /** Does this apply to all moves, including those that ignore other forms of protection? */
  protected ignoresBypass: boolean;

  constructor(
    tagType: ArenaTagType,
    sourceMoveId: MoveId,
    sourceId: number,
    side: ArenaTagSide,
    condition: ProtectConditionFunc,
    ignoresBypass: boolean = false,
  ) {
    super(tagType, 1, sourceMoveId, sourceId, side);

    this.protectConditionFunc = condition;
    this.ignoresBypass = ignoresBypass;
  }

  override onAdd(): void {
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(`arenaTag:conditionalProtectOnAdd${this.i18nSideKey}`, { moveName: super.getMoveName() }),
    );
  }

  // Removes default message for effect removal
  override onRemove(): void {}

  /**
   * Checks incoming moves against the condition function
   * and protects the target if conditions are met
   * @param simulated `true` if the tag is applied quietly; `false` otherwise.
   * @param isProtected a {@linkcode BooleanHolder} used to flag if the move is protected against
   * @param attacker the attacking {@linkcode Pokemon}
   * @param defender the defending {@linkcode Pokemon}
   * @param moveId the {@linkcode MoveId | identifier} for the move being used
   * @param ignoresProtectBypass a {@linkcode BooleanHolder} used to flag if a protection effect supercedes effects that ignore protection
   * @returns `true` if this tag protected against the attack; `false` otherwise
   */
  override apply(
    simulated: boolean,
    isProtected: BooleanHolder,
    attacker: Pokemon,
    defender: Pokemon,
    moveId: MoveId,
  ): boolean {
    if (
      (this.side === ArenaTagSide.PLAYER) === defender.isPlayer()
      && this.protectConditionFunc(moveId)
      && (this.ignoresBypass || !allMoves.get(moveId).checkFlag(MoveFlags.IGNORE_PROTECT, attacker, defender))
    ) {
      if (!isProtected.value) {
        isProtected.value = true;
        if (!simulated) {
          new CommonBattleAnim(CommonAnim.PROTECT, defender).play();
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
            i18next.t("arenaTag:conditionalProtectApply", {
              moveName: super.getMoveName(),
              pokemonNameWithAffix: getPokemonNameWithAffix(defender),
            }),
          );
        }
      }
      return true;
    }
    return false;
  }
}

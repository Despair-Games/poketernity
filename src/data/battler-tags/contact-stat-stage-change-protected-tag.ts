import { globalScene } from "#app/global-scene";
import type { BattlerTag } from "#battler-tags/battler-tag";
import { DamageProtectedTag } from "#battler-tags/damage-protected-tag";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";

/**
 * Tag used to block damaging moves and change the attacker's stats if the move makes contact.
 * Used by {@linkcode MoveId.KINGS_SHIELD}, {@linkcode MoveId.OBSTRUCT}, and {@linkcode MoveId.SILK_TRAP}
 */
export class ContactStatStageChangeProtectedTag extends DamageProtectedTag {
  private stat: BattleStat;
  private levels: number;

  constructor(sourceMoveId: MoveId, tagType: BattlerTagType, stat: BattleStat, levels: number) {
    super(sourceMoveId, tagType);

    this.stat = stat;
    this.levels = levels;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.stat = source.stat;
    this.levels = source.levels;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (!super.apply(pokemon, simulated, attacker, move)) {
      return false;
    }

    if (!simulated && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker)) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(attacker.getBattlerIndex(), pokemon, [this.stat], this.levels),
      );
    }
    return true;
  }
}

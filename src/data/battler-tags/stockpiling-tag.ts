import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { type StatStageChangeCallback, StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import i18next from "i18next";

/**
 * Tag enabling the "energy storage" effect of {@link https://bulbapedia.bulbagarden.net/wiki/Stockpile_(move) | Stockpile}.
 * This tag handles:
 * - Stack tracking, including max limit enforcement (which is replicated in Stockpile for redundancy).
 *
 * - Stat changes on adding a stack. Adding a stockpile stack attempts to raise the pokemon's DEF and SPDEF by +1.
 *
 * - Stat changes on removal of (all) stacks.
 *   - Removing stacks decreases DEF and SPDEF, independently, by one stage for each stack that successfully changed
 *     the stat when added.
 * @extends BattlerTag
 */
export class StockpilingTag extends BattlerTag {
  public stockpiledCount: number = 0;
  public statChangeCounts: { [Stat.DEF]: number; [Stat.SPDEF]: number } = {
    [Stat.DEF]: 0,
    [Stat.SPDEF]: 0,
  };

  constructor(sourceMoveId: MoveId = MoveId.NONE) {
    super(BattlerTagType.STOCKPILING, BattlerTagLapseType.CUSTOM, 1, sourceMoveId);
  }

  private onStatStagesChanged: StatStageChangeCallback = (statsChanged, statChanges) => {
    const defChange = statChanges[statsChanged.indexOf(Stat.DEF)] ?? 0;
    const spDefChange = statChanges[statsChanged.indexOf(Stat.SPDEF)] ?? 0;

    if (defChange) {
      this.statChangeCounts[Stat.DEF]++;
    }
    if (spDefChange) {
      this.statChangeCounts[Stat.SPDEF]++;
    }
  };

  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.stockpiledCount = source.stockpiledCount ?? 0;
    this.statChangeCounts = {
      [Stat.DEF]: source.statChangeCounts?.[Stat.DEF] ?? 0,
      [Stat.SPDEF]: source.statChangeCounts?.[Stat.SPDEF] ?? 0,
    };
  }

  /**
   * Adds a stockpile stack to a pokemon, up to a maximum of 3 stacks. Note that onOverlap defers to this method.
   *
   * If a stack is added, a message is displayed and the pokemon's DEF and SPDEF are increased by 1.
   * For each stat, an internal counter is incremented (by 1) if the stat was successfully changed.
   */
  override onAdd(pokemon: Pokemon): void {
    if (this.stockpiledCount < 3) {
      this.stockpiledCount++;

      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:stockpilingOnAdd", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          stockpiledCount: this.stockpiledCount,
        }),
      );

      // Attempt to increase DEF and SPDEF by one stage, keeping track of successful changes.
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [Stat.SPDEF, Stat.DEF], 1, {
          onChange: this.onStatStagesChanged,
        }),
      );
    }
  }

  override onOverlap(pokemon: Pokemon): void {
    this.onAdd(pokemon);
  }

  /**
   * Removing the tag removes all stacks, and the pokemon's DEF and SPDEF are decreased by
   * one stage for each stack which had successfully changed that particular stat during onAdd.
   */
  override onRemove(pokemon: Pokemon): void {
    const defChange = this.statChangeCounts[Stat.DEF];
    const spDefChange = this.statChangeCounts[Stat.SPDEF];

    if (defChange) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [Stat.DEF], -defChange),
      );
    }

    if (spDefChange) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [Stat.SPDEF], -spDefChange),
      );
    }
  }
}

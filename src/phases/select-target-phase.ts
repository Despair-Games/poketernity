import type { BattlerIndex } from "#enums/battler-index";
import { allMoves } from "#app/data/data-lists";
import { globalScene } from "#app/global-scene";
import { UiMode } from "#enums/ui-mode";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { CommandPhase } from "./command-phase";
import { PhaseId } from "#enums/phase-id";

export class SelectTargetPhase extends PokemonPhase {
  override readonly id = PhaseId.SELECT_TARGET;

  constructor(fieldIndex: number) {
    super(fieldIndex);
  }

  public override start(): void {
    super.start();

    const { currentBattle, ui } = globalScene;
    const { turnCommands } = currentBattle;

    const turnCommand = turnCommands[this.fieldIndex];
    const moveId = turnCommand?.turnMove?.move.id ?? MoveId.NONE;

    ui.setMode(UiMode.TARGET_SELECT, this.fieldIndex, moveId, (targets: BattlerIndex[]) => {
      ui.setMode(UiMode.MESSAGE);

      const user = globalScene.getFieldPokemonByBattlerIndex(this.fieldIndex);
      const firstTarget = globalScene.getFieldPokemonByBattlerIndex(targets[0]);
      const moveObject = allMoves[moveId];

      // TODO: Resolve bang
      if (user?.isMoveTargetRestricted(moveObject.id, user, firstTarget!)) {
        const errorMessage = user
          .getRestrictingTag(moveId, user, firstTarget)
          ?.selectionDeniedText(user, moveObject.id);

        globalScene.queueMessage(
          errorMessage ?? i18next.t("battle:moveCannotBeSelected", { moveName: allMoves[moveId].name }),
          0,
          true,
        );
        targets = [];
      }

      if (targets.length < 1) {
        turnCommands[this.fieldIndex] = null;
        globalScene.unshiftPhase(new CommandPhase(this.fieldIndex));
      } else {
        if (turnCommand) {
          turnCommand.targets = targets;
        }
      }

      this.end();
    });
  }
}

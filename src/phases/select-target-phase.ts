import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import type { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { UiMode } from "#enums/ui-mode";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import type { TargetSelectUiHandler } from "#ui/target-select-ui-handler";
import i18next from "i18next";

export class SelectTargetPhase extends PokemonPhase {
  public override readonly phaseName = "SelectTargetPhase";

  public override start(): void {
    super.start();

    const { currentBattle, ui } = globalScene;
    const { turnManager } = currentBattle;
    const pokemon = this.getPokemon();

    const turnCommand = turnManager.findCommandFromPokemon(pokemon);
    const moveId = turnCommand?.turnMove?.move.id ?? MoveId.NONE;

    const targetSelectedCallback = (targets: BattlerIndex[]) => {
      ui.setMessageMode();

      const user = globalScene.getPokemonByBattlerIndex(this.fieldIndex);
      const firstTarget = globalScene.getPokemonByBattlerIndex(targets[0]);
      const moveObject = allMoves.get(moveId);

      // TODO: Resolve bang
      if (user?.isMoveTargetRestricted(moveObject.id, user, firstTarget!)) {
        const errorMessage = user
          .getRestrictingTag(moveId, user, firstTarget)
          ?.getSelectionDeniedText(user, moveObject.id);

        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          errorMessage ?? i18next.t("battle:moveCannotBeSelected", { moveName: allMoves.get(moveId).name }),
          0,
          true,
        );
        targets = [];
      }

      if (targets.length < 1) {
        turnManager.tryRemoveCommand((tc) => tc.pokemon === user);
        globalScene.phaseManager.createAndUnshiftPhase("CommandPhase", this.fieldIndex);
      } else {
        if (turnCommand) {
          turnCommand.targets = targets;
        }
      }

      this.end();
    };

    ui.setMode<TargetSelectUiHandler>(UiMode.TARGET_SELECT, this.fieldIndex, moveId, targetSelectedCallback);
  }
}

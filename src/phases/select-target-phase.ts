import { allMoves } from "#app/data/data-lists";
import { globalScene } from "#app/global-scene";
import type { TargetSelectUiHandler } from "#app/ui/handlers/target-select-ui-handler";
import type { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { CommandPhase } from "./command-phase";

export class SelectTargetPhase extends PokemonPhase {
  override readonly id = PhaseId.SELECT_TARGET;

  constructor(fieldIndex: number) {
    super(fieldIndex);
  }

  public override start(): void {
    super.start();

    const { currentBattle, ui } = globalScene;
    const { turnManager } = currentBattle;
    const pokemon = this.getPokemon();

    const turnCommand = turnManager.findCommandFromPokemon(pokemon);
    const moveId = turnCommand?.turnMove?.move.id ?? MoveId.NONE;

    const targetSelectedCallback = (targets: BattlerIndex[]) => {
      ui.setMessageMode();

      const user = globalScene.getFieldPokemonByBattlerIndex(this.fieldIndex);
      const firstTarget = globalScene.getFieldPokemonByBattlerIndex(targets[0]);
      const moveObject = allMoves.get(moveId);

      // TODO: Resolve bang
      if (user?.isMoveTargetRestricted(moveObject.id, user, firstTarget!)) {
        const errorMessage = user
          .getRestrictingTag(moveId, user, firstTarget)
          ?.getSelectionDeniedText(user, moveObject.id);

        globalScene.queueMessage(
          errorMessage ?? i18next.t("battle:moveCannotBeSelected", { moveName: allMoves.get(moveId).name }),
          0,
          true,
        );
        targets = [];
      }

      if (targets.length < 1) {
        turnManager.tryRemoveCommand((tc) => tc.pokemon === user);
        globalScene.unshiftPhase(new CommandPhase(this.fieldIndex));
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

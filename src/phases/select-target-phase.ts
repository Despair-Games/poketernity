import type { BattlerIndex } from "#app/battle";
import { allMoves } from "#app/data/all-moves";
import { globalScene } from "#app/global-scene";
import { Command } from "#app/ui/command-ui-handler";
import { Mode } from "#app/ui/ui";
import { Moves } from "#enums/moves";
import i18next from "i18next";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { CommandPhase } from "./command-phase";
import { isNullOrUndefined } from "#app/utils";

export class SelectTargetPhase extends PokemonPhase {
  constructor(fieldIndex: number) {
    super(fieldIndex);
  }

  public override start(): void {
    super.start();

    const { currentBattle, ui } = globalScene;
    const { turnCommands } = currentBattle;

    const turnCommand = turnCommands[this.fieldIndex];
    const move = turnCommand?.move?.move;

    ui.setMode(Mode.TARGET_SELECT, this.fieldIndex, move, (targets: BattlerIndex[]) => {
      ui.setMode(Mode.MESSAGE);

      const fieldSide = globalScene.getField();
      const user = fieldSide[this.fieldIndex];
      const moveObject = allMoves[move ?? Moves.NONE];

      if (moveObject && user.isMoveTargetRestricted(moveObject.id, user, fieldSide[targets[0]])) {
        const errorMessage = user
          .getRestrictingTag(move ?? Moves.NONE, user, fieldSide[targets[0]])
          ?.selectionDeniedText(user, moveObject.id);
        globalScene.queueMessage(i18next.t(errorMessage ?? "", { moveName: moveObject.name }), 0, true);
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

      // required for null check
      const idx = this.fieldIndex - 1;
      if (turnCommand?.command === Command.BALL && this.fieldIndex && !isNullOrUndefined(turnCommands[idx])) {
        turnCommands[idx].skip = true;
      }

      this.end();
    });
  }
}

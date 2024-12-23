import type { BattlerIndex } from "#app/battle";
import { allMoves } from "#app/data/move";
import { globalScene } from "#app/global-scene";
import i18next from "#app/plugins/i18n";
import { Command } from "#app/ui/command-ui-handler";
import { Mode } from "#app/ui/ui";
import { Moves } from "#enums/moves";
import { CommandPhase } from "./command-phase";
import { PokemonPhase } from "./abstract-pokemon-phase";

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

      if (turnCommand?.command === Command.BALL && this.fieldIndex) {
        turnCommands[this.fieldIndex - 1]!.skip = true; //TODO: is the bang correct here?
      }

      this.end();
    });
  }
}

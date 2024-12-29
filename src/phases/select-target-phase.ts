import type { BattlerIndex } from "#app/battle";
import { allMoves } from "#app/data/all-moves";
import { globalScene } from "#app/global-scene";
import { Mode } from "#app/ui/ui";
import { Moves } from "#enums/moves";
import i18next from "i18next";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { CommandPhase } from "./command-phase";

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

      const user = globalScene.getFieldPokemonByBattlerIndex(this.fieldIndex)!;
      const firstTarget = globalScene.getFieldPokemonByBattlerIndex(targets[0])!;
      const moveObject = allMoves[move ?? Moves.NONE];

      if (moveObject && user.isMoveTargetRestricted(moveObject.id, user, firstTarget)) {
        const errorMessage = user
          .getRestrictingTag(move ?? Moves.NONE, user, firstTarget)
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

      this.end();
    });
  }
}

import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#app/battle";
import { Command } from "#app/ui/command-ui-handler";
import { Mode } from "#app/ui/ui";
import { CommandPhase } from "./command-phase";
import { PokemonPhase } from "./pokemon-phase";
import i18next from "#app/plugins/i18n";
import { allMoves } from "#app/data/all-moves";

export class SelectTargetPhase extends PokemonPhase {
  constructor(fieldIndex: number) {
    super(fieldIndex);
  }

  override start() {
    super.start();

    const turnCommand = globalScene.currentBattle.turnCommands[this.fieldIndex];
    const move = turnCommand?.move?.move;
    globalScene.ui.setMode(Mode.TARGET_SELECT, this.fieldIndex, move, (targets: BattlerIndex[]) => {
      globalScene.ui.setMode(Mode.MESSAGE);
      const user = globalScene.getFieldPokemonByBattlerIndex(this.fieldIndex)!;
      const firstTarget = globalScene.getFieldPokemonByBattlerIndex(targets[0])!;
      const moveObject = allMoves[move!];
      if (moveObject && user.isMoveTargetRestricted(moveObject.id, user, firstTarget)) {
        const errorMessage = user.getRestrictingTag(move!, user, firstTarget)!.selectionDeniedText(user, moveObject.id);
        globalScene.queueMessage(i18next.t(errorMessage, { moveName: moveObject.name }), 0, true);
        targets = [];
      }
      if (targets.length < 1) {
        globalScene.currentBattle.turnCommands[this.fieldIndex] = null;
        globalScene.unshiftPhase(new CommandPhase(this.fieldIndex));
      } else {
        turnCommand!.targets = targets; //TODO: is the bang correct here?
      }
      if (turnCommand?.command === Command.BALL && this.fieldIndex) {
        globalScene.currentBattle.turnCommands[this.fieldIndex - 1]!.skip = true; //TODO: is the bang correct here?
      }
      this.end();
    });
  }
}

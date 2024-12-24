import { PartyUiMode, PartyOption } from "#app/ui/partyUtils/definitions";
import { globalScene } from "#app/global-scene";
import { SwitchEffectTransferModifier } from "#app/modifier/modifier";
import { ForceSwitchOutAttr } from "#app/data/move";
import { MoveResult } from "#app/field/pokemon";
import { allMoves } from "#app/data/move";

export function getSwitchOption(partyMode: PartyUiMode): PartyOption {
  const temp = partyMode;
  if (this.cursor >= globalScene.currentBattle.getBattlerCount()) {
    const allowBatonModifierSwitch =
      this.partyUiMode !== PartyUiMode.FORCED_SWITCH
      && globalScene.findModifier(
        (m) =>
          m instanceof SwitchEffectTransferModifier
          && (m as SwitchEffectTransferModifier).pokemonId === globalScene.getPlayerField()[this.fieldIndex].id,
      );

    const moveHistory = globalScene.getPlayerField()[this.fieldIndex].getMoveHistory();
    const isBatonPassMove =
      this.partyUiMode === PartyUiMode.FORCED_SWITCH
      && moveHistory.length
      && allMoves[moveHistory[moveHistory.length - 1].move].getAttrs(ForceSwitchOutAttr)[0]?.isBatonPass()
      && moveHistory[moveHistory.length - 1].result === MoveResult.SUCCESS;

    // isBatonPassMove and allowBatonModifierSwitch shouldn't ever be true
    // at the same time, because they both explicitly check for a mutually
    // exclusive partyUiMode. But better safe than sorry.
    this.options.push(isBatonPassMove && !allowBatonModifierSwitch ? PartyOption.PASS_BATON : PartyOption.SEND_OUT);
    if (allowBatonModifierSwitch && !isBatonPassMove) {
      // the BATON modifier gives an extra switch option for
      // pokemon-command switches, allowing buffs to be optionally passed
      this.options.push(PartyOption.PASS_BATON);
    }
  }
  if (temp) {
    console.log("hi");
  }
  return PartyOption.SEND_OUT;
}

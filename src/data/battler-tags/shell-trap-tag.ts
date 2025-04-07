import { getMoveEffectPhaseData } from "./utils/get-move-effect-phase-data";
import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import i18next from "i18next";

/**
 * Tag implementing Shell Trap's pre-move behavior.
 * Pokemon with this tag will act immediately after being hit by a physical move.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Shell_Trap_(move) | Shell Trap}
 * @extends BattlerTag
 */
export class ShellTrapTag extends BattlerTag {
  public activated: boolean = false;

  constructor() {
    super(BattlerTagType.SHELL_TRAP, [BattlerTagLapseType.TURN_END, BattlerTagLapseType.AFTER_HIT], 1);
  }

  override onAdd(pokemon: Pokemon): void {
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:setUpShellTrap", { pokemonName: getPokemonNameWithAffix(pokemon) }),
    );
  }

  /**
   * "Activates" the shell trap, causing the tag owner to move next.
   * @param pokemon {@linkcode Pokemon} the owner of this tag
   * @param lapseType {@linkcode BattlerTagLapseType} the type of functionality invoked in battle
   * @returns `true` if invoked with the `AFTER_HIT` lapse type
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.AFTER_HIT) {
      const phaseData = getMoveEffectPhaseData(pokemon);

      // Trap should only be triggered by opponent's Physical moves
      if (phaseData?.move.category === MoveCategory.PHYSICAL && pokemon.isOpponent(phaseData.attacker)) {
        const { turnManager } = globalScene.currentBattle;
        this.activated = turnManager.preemptFightCommand((tc) => tc.pokemon === pokemon);
      }

      return true;
    }

    return super.lapse(pokemon, lapseType);
  }
}

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { SummonMissingPhase } from "#app/phases/summon-missing-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { Mode } from "#app/ui/ui";
import { BattleStyle } from "#enums/battle-style";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SwitchType } from "#enums/switch-type";
import i18next from "i18next";

/**
 * Handles the prompt to switch pokemon at the start of a battle when the player is playing in Switch mode
 * @extends BattlePhase
 */
export class CheckSwitchPhase extends BattlePhase {
  protected readonly fieldIndex: number;
  /** Whether to use the pokemon's name or "Pokemon" when displaying the dialog box */
  protected readonly useName: boolean;

  constructor(fieldIndex: number, useName: boolean) {
    super();

    this.fieldIndex = fieldIndex;
    this.useName = useName;
  }

  public override start(): void {
    super.start();

    const pokemon = globalScene.getPlayerField()[this.fieldIndex];

    // End this phase early...

    // ...if the user is playing in Set Mode
    if (globalScene.battleStyle === BattleStyle.SET) {
      return this.end();
    }

    // ...if the checked Pokemon is somehow not on the field
    if (globalScene.field.getAll().indexOf(pokemon) === -1) {
      globalScene.unshiftPhase(new SummonMissingPhase(this.fieldIndex));
      return this.end();
    }

    // ...if there are no other allowed Pokemon in the player's party to switch with
    if (
      !globalScene
        .getPlayerParty()
        .slice(1)
        .filter((p) => p.isActive()).length
    ) {
      return this.end();
    }

    // ...or if any player Pokemon has an effect that prevents the checked Pokemon from switching
    if (
      pokemon.getTag(BattlerTagType.FRENZY)
      || pokemon.isTrapped()
      || globalScene.getPlayerField().some((p) => p.getTag(BattlerTagType.COMMANDED))
    ) {
      return this.end();
    }

    globalScene.ui.showText(
      i18next.t("battle:switchQuestion", {
        pokemonName: this.useName ? getPokemonNameWithAffix(pokemon) : i18next.t("battle:pokemon"),
      }),
      null,
      () => {
        globalScene.ui.setMode(
          Mode.CONFIRM,
          () => {
            globalScene.ui.setMode(Mode.MESSAGE);
            globalScene.unshiftPhase(new SwitchPhase(SwitchType.INITIAL_SWITCH, this.fieldIndex, false, true));
            this.end();
          },
          () => {
            globalScene.ui.setMode(Mode.MESSAGE);
            this.end();
          },
        );
      },
    );
  }
}

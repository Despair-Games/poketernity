import type BattleScene from "#app/battle-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlePhase } from "#app/phases/battle-phase";
import { PostSummonPhase } from "#app/phases/post-summon-phase";
import { SummonMissingPhase } from "#app/phases/summon-missing-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { Mode } from "#app/ui/ui";
import { BattleStyle } from "#enums/battle-style";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SwitchType } from "#enums/switch-type";
import i18next from "i18next";

export class CheckSwitchPhase extends BattlePhase {
  protected fieldIndex: number;
  /** Whether to use the pokemon's name or "Pokemon" when displaying the dialog box */
  protected useName: boolean;

  constructor(scene: BattleScene, fieldIndex: number, useName: boolean) {
    super(scene);

    this.fieldIndex = fieldIndex;
    this.useName = useName;
  }

  public override start(): void {
    super.start();

    const pokemon = this.scene.getPlayerField()[this.fieldIndex];

    // End this phase early...

    // ...if the user is playing in Set Mode
    if (this.scene.battleStyle === BattleStyle.SET) {
      return this.end();
    }

    // ...if the checked Pokemon is somehow not on the field
    if (this.scene.field.getAll().indexOf(pokemon) === -1) {
      this.scene.unshiftPhase(new SummonMissingPhase(this.scene, this.fieldIndex));
      return this.end();
    }

    // ...if there are no other allowed Pokemon in the player's party to switch with
    if (!this.scene.getPlayerParty().slice(1).filter(p => p.isActive()).length) {
      return this.end();
    }

    // ...or if any player Pokemon has an effect that prevents the checked Pokemon from switching
    if (pokemon.getTag(BattlerTagType.FRENZY)
        || pokemon.isTrapped()
        || this.scene.getPlayerField().some(p => p.getTag(BattlerTagType.COMMANDED))
    ) {
      return this.end();
    }

    this.scene.ui.showText(i18next.t("battle:switchQuestion", { pokemonName: this.useName ? getPokemonNameWithAffix(pokemon) : i18next.t("battle:pokemon") }), null, () => {
      this.scene.ui.setMode(Mode.CONFIRM, () => {
        this.scene.ui.setMode(Mode.MESSAGE);
        this.scene.tryRemovePhase(p => p instanceof PostSummonPhase && p.player && p.fieldIndex === this.fieldIndex);
        this.scene.unshiftPhase(new SwitchPhase(this.scene, SwitchType.INITIAL_SWITCH, this.fieldIndex, false, true));
        this.end();
      }, () => {
        this.scene.ui.setMode(Mode.MESSAGE);
        this.end();
      });
    });
  }
}

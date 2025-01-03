import { globalScene } from "#app/global-scene";
import type { ModifierType, ModifierTypeFunc } from "#app/modifier/modifier-type";
import { getModifierType } from "#app/modifier/modifier-type";
import { Phase } from "#app/phase";
import i18next from "i18next";

export class ModifierRewardPhase extends Phase {
  protected readonly modifierType: ModifierType;

  constructor(modifierTypeFunc: ModifierTypeFunc) {
    super();

    this.modifierType = getModifierType(modifierTypeFunc);
  }

  public override start(): void {
    super.start();

    this.doReward().then(() => this.end());
  }

  protected doReward(): Promise<void> {
    return new Promise<void>((resolve) => {
      const newModifier = this.modifierType.newModifier();
      globalScene.addModifier(newModifier);
      globalScene.playSound("item_fanfare");
      globalScene.ui.showText(
        i18next.t("battle:rewardGain", { modifierName: newModifier?.type.name }),
        null,
        () => resolve(),
        null,
        true,
      );
    });
  }
}

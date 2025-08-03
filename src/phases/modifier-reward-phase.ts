import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { ModifierType, ModifierTypeFunc } from "#modifier/modifier-type";
import type { PhaseKey } from "#types/phase-types";
import { getModifierType } from "#utils/modifier-type-utils";
import i18next from "i18next";

export class ModifierRewardPhase extends Phase {
  public override readonly phaseName: PhaseKey = "ModifierRewardPhase";

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
      globalScene.audioManager.playSound("item_fanfare");
      globalScene.ui.showText(i18next.t("battle:rewardGain", { modifierName: newModifier?.type.name }), {
        callback: () => resolve(),
        prompt: true,
      });
    });
  }
}

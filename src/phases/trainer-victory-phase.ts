import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import { modifierTypes } from "#modifier/modifier-types";
import { vouchers } from "#system/voucher";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

export class TrainerVictoryPhase extends Phase {
  public override readonly phaseName = "TrainerVictoryPhase";

  public override async start(): Promise<void> {
    const { currentBattle, enemyTrainers, ui } = globalScene;
    const { trainerData } = currentBattle;
    globalScene.disableMenu = true;

    if (!trainerData) {
      this.end();
      return;
    }

    globalScene.audioManager.playBgm(trainerData.victoryBgm);

    globalScene.phaseManager.createAndUnshiftPhase("MoneyRewardPhase", trainerData.moneyMultiplier);

    const modifierRewardFuncs = trainerData.modifierRewards;
    for (const modifierRewardFunc of modifierRewardFuncs) {
      globalScene.phaseManager.createAndUnshiftPhase("ModifierRewardPhase", modifierRewardFunc);
    }

    const trainerType = trainerData.trainers[TrainerSlot.TRAINER].trainerType;
    const trainerTypeKey = enumValueToKey(TrainerType, trainerType);
    // Validate Voucher for boss trainers
    if (
      Object.hasOwn(vouchers, trainerTypeKey)
      && !globalScene.validateVoucher(vouchers[trainerTypeKey])
      && trainerData.isBoss
    ) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "ModifierRewardPhase",
        [modifierTypes.VOUCHER, modifierTypes.VOUCHER, modifierTypes.VOUCHER_PLUS, modifierTypes.VOUCHER_PREMIUM][
          vouchers[trainerTypeKey].voucherType
        ],
      );
    }

    // TODO: Add name getter for `TrainerDataSet`
    ui.showText(
      i18next.t("battle:trainerDefeated", {
        trainerName: trainerData.getLocalizedName(),
      }),
      {
        callback: async () => {
          await globalScene.showTrainerDialogue("victory");
        },
        prompt: true,
      },
    );

    await enemyTrainers?.show();
  }
}

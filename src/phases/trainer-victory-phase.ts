import { getCharVariantFromDialogue } from "#app/data/dialogue";
import { TrainerSlot } from "#app/data/trainer-config";
import { globalScene } from "#app/global-scene";
import { modifierTypes } from "#app/modifier/modifier-type";
import { achvs } from "#app/system/achv";
import { vouchers } from "#app/system/voucher";
import { randSeedItem } from "#app/utils";
import { Biome } from "#enums/biome";
import { TrainerType } from "#enums/trainer-type";
import i18next from "i18next";
import { BattlePhase } from "./battle-phase";
import { ModifierRewardPhase } from "./modifier-reward-phase";
import { MoneyRewardPhase } from "./money-reward-phase";

export class TrainerVictoryPhase extends BattlePhase {
  public override start(): void {
    globalScene.disableMenu = true;

    globalScene.playBgm(globalScene.currentBattle.trainer?.config.victoryBgm);

    globalScene.unshiftPhase(new MoneyRewardPhase(globalScene.currentBattle.trainer?.config.moneyMultiplier!)); // TODO: is this bang correct?

    const modifierRewardFuncs = globalScene.currentBattle.trainer?.config.modifierRewardFuncs!; // TODO: is this bang correct?
    for (const modifierRewardFunc of modifierRewardFuncs) {
      globalScene.unshiftPhase(new ModifierRewardPhase(modifierRewardFunc));
    }

    if (globalScene.eventManager.isEventActive()) {
      for (const rewardFunc of globalScene.currentBattle.trainer?.config.eventRewardFuncs!) {
        globalScene.unshiftPhase(new ModifierRewardPhase(rewardFunc));
      }
    }

    const trainerType = globalScene.currentBattle.trainer?.config.trainerType!; // TODO: is this bang correct?
    // Validate Voucher for boss trainers
    if (vouchers.hasOwnProperty(TrainerType[trainerType])) {
      if (
        !globalScene.validateVoucher(vouchers[TrainerType[trainerType]])
        && globalScene.currentBattle.trainer?.config.isBoss
      ) {
        globalScene.unshiftPhase(
          new ModifierRewardPhase(
            [modifierTypes.VOUCHER, modifierTypes.VOUCHER, modifierTypes.VOUCHER_PLUS, modifierTypes.VOUCHER_PREMIUM][
              vouchers[TrainerType[trainerType]].voucherType
            ],
          ),
        );
      }
    }
    // Breeders in Space achievement
    if (
      globalScene.arena.biomeType === Biome.SPACE
      && (trainerType === TrainerType.BREEDER || trainerType === TrainerType.EXPERT_POKEMON_BREEDER)
    ) {
      globalScene.validateAchv(achvs.BREEDERS_IN_SPACE);
    }

    globalScene.ui.showText(
      i18next.t("battle:trainerDefeated", {
        trainerName: globalScene.currentBattle.trainer?.getName(TrainerSlot.NONE, true),
      }),
      null,
      () => {
        const victoryMessages = globalScene.currentBattle.trainer?.getVictoryMessages()!; // TODO: is this bang correct?
        let message: string;
        globalScene.executeWithSeedOffset(
          () => (message = randSeedItem(victoryMessages)),
          globalScene.currentBattle.waveIndex,
        );
        message = message!; // tell TS compiler it's defined now

        const showMessage = (): void => {
          const originalFunc = showMessageOrEnd;
          showMessageOrEnd = (): void =>
            globalScene.ui.showDialogue(
              message,
              globalScene.currentBattle.trainer?.getName(TrainerSlot.TRAINER, true),
              null,
              originalFunc,
            );

          showMessageOrEnd();
        };
        let showMessageOrEnd = (): void => this.end();
        if (victoryMessages?.length) {
          if (globalScene.currentBattle.trainer?.config.hasCharSprite && !globalScene.ui.shouldSkipDialogue(message)) {
            const originalFunc = showMessageOrEnd;
            showMessageOrEnd = (): Promise<void> =>
              globalScene.charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => originalFunc()));
            globalScene
              .showFieldOverlay(500)
              .then(() =>
                globalScene.charSprite
                  .showCharacter(
                    globalScene.currentBattle.trainer?.getKey()!,
                    getCharVariantFromDialogue(victoryMessages[0]),
                  )
                  .then(() => showMessage()),
              ); // TODO: is this bang correct?
          } else {
            showMessage();
          }
        } else {
          showMessageOrEnd();
        }
      },
      null,
      true,
    );

    this.showEnemyTrainer();
  }
}

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
    const { arena, charSprite, currentBattle, eventManager, ui } = globalScene;
    const { trainer, waveIndex } = currentBattle;
    globalScene.disableMenu = true;

    if (!trainer) {
      return this.end();
    }

    globalScene.playBgm(trainer.config.victoryBgm);

    globalScene.unshiftPhase(new MoneyRewardPhase(trainer.config.moneyMultiplier));

    const modifierRewardFuncs = trainer.config.modifierRewardFuncs;
    for (const modifierRewardFunc of modifierRewardFuncs) {
      globalScene.unshiftPhase(new ModifierRewardPhase(modifierRewardFunc));
    }

    if (eventManager.isEventActive()) {
      for (const rewardFunc of trainer.config.eventRewardFuncs) {
        globalScene.unshiftPhase(new ModifierRewardPhase(rewardFunc));
      }
    }

    const trainerType = trainer.config.trainerType;
    // Validate Voucher for boss trainers
    if (vouchers.hasOwnProperty(TrainerType[trainerType])) {
      if (!globalScene.validateVoucher(vouchers[TrainerType[trainerType]]) && trainer.config.isBoss) {
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
      arena.biomeType === Biome.SPACE
      && (trainerType === TrainerType.BREEDER || trainerType === TrainerType.EXPERT_POKEMON_BREEDER)
    ) {
      globalScene.validateAchv(achvs.BREEDERS_IN_SPACE);
    }

    ui.showText(
      i18next.t("battle:trainerDefeated", {
        trainerName: trainer.getName(TrainerSlot.NONE, true),
      }),
      null,
      () => {
        const victoryMessages = trainer.getVictoryMessages();
        let message: string;
        globalScene.executeWithSeedOffset(() => (message = randSeedItem(victoryMessages)), waveIndex);
        message = message!; // tell TS compiler it's defined now

        const showMessage = (): void => {
          const originalFunc = showMessageOrEnd;
          showMessageOrEnd = (): void =>
            ui.showDialogue(message, trainer.getName(TrainerSlot.TRAINER, true), null, originalFunc);

          showMessageOrEnd();
        };
        let showMessageOrEnd = (): void => this.end();
        if (victoryMessages.length) {
          if (trainer.config.hasCharSprite && !ui.shouldSkipDialogue(message)) {
            const originalFunc = showMessageOrEnd;
            showMessageOrEnd = (): Promise<void> =>
              charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => originalFunc()));
            globalScene
              .showFieldOverlay(500)
              .then(() =>
                charSprite
                  .showCharacter(trainer.getKey(), getCharVariantFromDialogue(victoryMessages[0]))
                  .then(() => showMessage()),
              );
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

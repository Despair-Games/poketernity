import { getCharVariantFromDialogue } from "#app/data/dialogue";
import { TrainerSlot } from "#app/data/trainer-config";
import { globalScene } from "#app/global-scene";
import { IvScannerModifier } from "#app/modifier/modifier";
import { Phase } from "#app/phase";
import { CheckSwitchPhase } from "#app/phases/check-switch-phase";
import { ReturnPhase } from "#app/phases/return-phase";
import { ScanIvsPhase } from "#app/phases/scan-ivs-phase";
import { SummonPhase } from "#app/phases/summon-phase";
import { ToggleDoublePositionPhase } from "#app/phases/toggle-double-position-phase";
import { randSeedItem } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import i18next from "i18next";

const { currentBattle, tweens, ui } = globalScene;
const { double, mysteryEncounter, trainer } = currentBattle;
const encounterMode = mysteryEncounter?.encounterMode;

/**
 * Will handle (in order):
 * - Setting BGM
 * - Showing intro dialogue for an enemy trainer or wild Pokemon
 * - Sliding in the visuals for enemy trainer or wild Pokemon, as well as handling summoning animations
 * - Queue the {@linkcode SummonPhase}s, {@linkcode PostSummonPhase}s, etc., required to initialize the phase queue for a battle
 */
export class MysteryEncounterBattlePhase extends Phase {
  protected disableSwitch: boolean;

  constructor(disableSwitch: boolean = false) {
    super();
    this.disableSwitch = disableSwitch;
  }

  /**
   * Sets up a ME battle
   */
  public override start(): void {
    super.start();

    this.doMysteryEncounterBattle();
  }

  /**
   * Gets intro battle message for new battle
   * @private
   */
  private getBattleMessage(): string {
    const enemyField = globalScene.getEnemyField();

    // This shouldn't ever happen, right?
    if (currentBattle.isClassicFinalBoss) {
      return i18next.t("battle:bossAppeared", { bossName: enemyField[0].name });
    }

    if (encounterMode === MysteryEncounterMode.TRAINER_BATTLE) {
      return i18next.t(`battle:trainerAppeared${double ? "Double" : ""}`, {
        trainerName: trainer?.getName(TrainerSlot.NONE, true),
      });
    }

    return enemyField.length === 1
      ? i18next.t("battle:singleWildAppeared", { pokemonName: enemyField[0].name })
      : i18next.t("battle:multiWildAppeared", { pokemonName1: enemyField[0].name, pokemonName2: enemyField[1].name });
  }

  /**
   * Queues {@linkcode SummonPhase}s for the new battle, and handles trainer animations/dialogue if it's a Trainer battle
   * @private
   */
  private doMysteryEncounterBattle(): void {
    if (encounterMode === MysteryEncounterMode.WILD_BATTLE || encounterMode === MysteryEncounterMode.BOSS_BATTLE) {
      if (encounterMode === MysteryEncounterMode.BOSS_BATTLE) {
        globalScene.playBgm();
      }
      const availablePartyMembers = globalScene.getEnemyParty().filter((p) => !p.isFainted()).length;
      globalScene.unshiftPhase(new SummonPhase(0, false));
      if (double && availablePartyMembers > 1) {
        globalScene.unshiftPhase(new SummonPhase(1, false));
      }

      if (!mysteryEncounter?.hideBattleIntroMessage) {
        ui.showText(this.getBattleMessage(), null, () => this.endBattleSetup(), 0);
      } else {
        this.endBattleSetup();
      }
    } else if (encounterMode === MysteryEncounterMode.TRAINER_BATTLE) {
      this.showEnemyTrainer();
      const doSummon = (): void => {
        currentBattle.started = true;
        globalScene.playBgm();
        globalScene.pbTray.showPbTray(globalScene.getPlayerParty());
        globalScene.pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
        const doTrainerSummon = (): void => {
          this.hideEnemyTrainer();
          const availablePartyMembers = globalScene.getEnemyParty().filter((p) => !p.isFainted()).length;
          globalScene.unshiftPhase(new SummonPhase(0, false));
          if (double && availablePartyMembers > 1) {
            globalScene.unshiftPhase(new SummonPhase(1, false));
          }
          this.endBattleSetup();
        };
        if (!mysteryEncounter?.hideBattleIntroMessage) {
          ui.showText(this.getBattleMessage(), null, doTrainerSummon, 1000, true);
        } else {
          doTrainerSummon();
        }
      };

      const encounterMessages = trainer?.getEncounterMessages();

      if (!encounterMessages || !encounterMessages.length) {
        doSummon();
      } else {
        let message: string;
        globalScene.executeWithSeedOffset(
          () => (message = randSeedItem(encounterMessages)),
          mysteryEncounter?.getSeedOffset() ?? 0,
        );
        message = message!; // tell TS compiler it's defined now
        const showDialogueAndSummon = (): void => {
          ui.showDialogue(message, trainer?.getName(TrainerSlot.NONE, true), null, () => {
            globalScene.charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => doSummon()));
          });
        };
        if (trainer?.config.hasCharSprite && !ui.shouldSkipDialogue(message)) {
          globalScene
            .showFieldOverlay(500)
            .then(() =>
              globalScene.charSprite
                .showCharacter(trainer.getKey(), getCharVariantFromDialogue(encounterMessages[0]))
                .then(() => showDialogueAndSummon()),
            );
        } else {
          showDialogueAndSummon();
        }
      }
    }
  }

  /**
   * Initiate {@linkcode SummonPhase}s, {@linkcode ScanIvsPhase}, {@linkcode PostSummonPhase}s, etc.
   * @private
   */
  private endBattleSetup(): void {
    const enemyField = globalScene.getEnemyField();

    // PostSummon and ShinySparkle phases are handled by SummonPhase

    if (encounterMode !== MysteryEncounterMode.TRAINER_BATTLE) {
      const ivScannerModifier = globalScene.findModifier((m) => m instanceof IvScannerModifier);
      if (ivScannerModifier) {
        enemyField.map((p) =>
          globalScene.pushPhase(
            new ScanIvsPhase(p.getBattlerIndex(), Math.min(ivScannerModifier.getStackCount() * 2, 6)),
          ),
        );
      }
    }

    const availablePartyMembers = globalScene.getPlayerParty().filter((p) => p.isAllowedInBattle());

    if (!availablePartyMembers[0].isOnField()) {
      globalScene.pushPhase(new SummonPhase(0));
    }

    if (double) {
      if (availablePartyMembers.length > 1) {
        globalScene.pushPhase(new ToggleDoublePositionPhase(true));
        if (!availablePartyMembers[1].isOnField()) {
          globalScene.pushPhase(new SummonPhase(1));
        }
      }
    } else {
      if (availablePartyMembers.length > 1 && availablePartyMembers[1].isOnField()) {
        globalScene.getPlayerField().forEach((pokemon) => pokemon.lapseTag(BattlerTagType.COMMANDED));
        globalScene.pushPhase(new ReturnPhase(1));
      }
      globalScene.pushPhase(new ToggleDoublePositionPhase(false));
    }

    if (encounterMode !== MysteryEncounterMode.TRAINER_BATTLE && !this.disableSwitch) {
      const minPartySize = double ? 2 : 1;
      if (availablePartyMembers.length > minPartySize) {
        globalScene.pushPhase(new CheckSwitchPhase(0, double));
        if (double) {
          globalScene.pushPhase(new CheckSwitchPhase(1, double));
        }
      }
    }

    this.end();
  }

  /**
   * Ease in enemy trainer
   * @private
   */
  private showEnemyTrainer(): void {
    if (!trainer) {
      return;
    }
    trainer.alpha = 0;
    trainer.x += 16;
    trainer.y -= 16;
    trainer.setVisible(true);
    tweens.add({
      targets: trainer,
      x: "-=16",
      y: "+=16",
      alpha: 1,
      ease: "Sine.easeInOut",
      duration: 750,
      onComplete: () => {
        trainer.untint(100, "Sine.easeOut");
        trainer.playAnim();
      },
    });
  }

  private hideEnemyTrainer(): void {
    tweens.add({
      targets: trainer,
      x: "+=16",
      y: "-=16",
      alpha: 0,
      ease: "Sine.easeInOut",
      duration: 750,
    });
  }
}

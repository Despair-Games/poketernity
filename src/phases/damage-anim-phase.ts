import { globalScene } from "#app/global-scene";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { HitResult } from "#enums/hit-result";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { settings } from "#system/settings-manager";
import type { DamageResult } from "#types/move-types";
import { fixedNumber } from "#utils/common-utils";

/** Displays damage numbers and plays move hit SFX during battle */
export class DamageAnimPhase extends PokemonPhase {
  public override readonly phaseName = "DamageAnimPhase";

  private amount: number;
  private readonly damageResult: DamageResult;
  private readonly critical: boolean;

  constructor(
    battlerIndex: FieldBattlerIndex,
    amount: number,
    damageResult: DamageResult = HitResult.EFFECTIVE,
    critical: boolean = false,
  ) {
    super(battlerIndex);

    this.amount = amount;
    this.damageResult = damageResult;
    this.critical = critical;
  }

  public override async start(): Promise<void> {
    if (this.damageResult === HitResult.ONE_HIT_KO) {
      if (settings.display.enableMoveAnimations) {
        globalScene.toggleInvert(true);
      }
      globalScene.time.delayedCall(fixedNumber(1000), async () => {
        globalScene.toggleInvert(false);
        await this.displayDamage();
      });
      return;
    }

    await this.displayDamage();
  }

  public updateAmount(amount: number): void {
    this.amount = amount;
  }

  protected async displayDamage(): Promise<void> {
    switch (this.damageResult) {
      case HitResult.EFFECTIVE:
        globalScene.audioManager.playSound("se/hit");
        break;
      case HitResult.SUPER_EFFECTIVE:
      case HitResult.ONE_HIT_KO:
        globalScene.audioManager.playSound("se/hit_strong");
        break;
      case HitResult.NOT_VERY_EFFECTIVE:
        globalScene.audioManager.playSound("se/hit_weak");
        break;
    }

    if (this.amount) {
      globalScene.damageNumberHandler.add(this.getPokemon(), this.amount, this.damageResult, this.critical);
    }

    const excludedHitResults: HitResult[] = [HitResult.OTHER, HitResult.SELF_KO];
    if (!excludedHitResults.includes(this.damageResult) && this.amount > 0) {
      const flashTimer = globalScene.time.addEvent({
        delay: 100,
        repeat: 5,
        startAt: 200,
        callback: async () => {
          this.getPokemon()
            .getSprite()
            .setVisible(flashTimer.repeatCount % 2 === 0);
          if (!flashTimer.repeatCount) {
            await this.getPokemon().updateInfo();
            this.end();
          }
        },
      });
    } else {
      await this.getPokemon().updateInfo();
      this.end();
    }
  }

  public override end(): void {
    if (globalScene.currentBattle.isClassicFinalBoss) {
      globalScene.initFinalBossPhaseTwo(this.getPokemon());
    } else {
      super.end();
    }
  }
}

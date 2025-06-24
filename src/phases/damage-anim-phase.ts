import { globalScene } from "#app/global-scene";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { HitResult } from "#enums/hit-result";
import { PhaseId } from "#enums/phase-id";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";
import { settings } from "#system/settings-manager";
import type { DamageResult } from "#types/damage-result";
import { fixedNumber } from "#utils/common-utils";

/**
 * Displays damage numbers and plays move hit SFX during battle
 */
export class DamageAnimPhase extends PokemonPhase {
  override readonly id = PhaseId.DAMAGE_ANIM;

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

  public override start(): void {
    super.start();

    if (this.damageResult === HitResult.ONE_HIT_KO) {
      if (settings.display.enableMoveAnimations) {
        globalScene.toggleInvert(true);
      }
      globalScene.time.delayedCall(fixedNumber(1000), () => {
        globalScene.toggleInvert(false);
        this.displayDamage();
      });
      return;
    }

    this.displayDamage();
  }

  public updateAmount(amount: number): void {
    this.amount = amount;
  }

  protected displayDamage(): void {
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

    if (![HitResult.OTHER, HitResult.SELF_KO].includes(this.damageResult) && this.amount > 0) {
      const flashTimer = globalScene.time.addEvent({
        delay: 100,
        repeat: 5,
        startAt: 200,
        callback: () => {
          this.getPokemon()
            .getSprite()
            .setVisible(flashTimer.repeatCount % 2 === 0);
          if (!flashTimer.repeatCount) {
            this.getPokemon()
              .updateInfo()
              .then(() => this.end());
          }
        },
      });
    } else {
      this.getPokemon()
        .updateInfo()
        .then(() => this.end());
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

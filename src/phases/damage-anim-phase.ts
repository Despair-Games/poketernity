import { globalScene } from "#app/global-scene";
import { type DamageResult, HitResult } from "#app/field/pokemon";
import { fixedInt } from "#app/utils";
import { PokemonPhase } from "#app/phases/pokemon-phase";
import type { BattlerIndex } from "#app/enums/battler-index";

export class DamageAnimPhase extends PokemonPhase {
  private amount: number;
  private damageResult: DamageResult;
  private critical: boolean;

  constructor(
    battlerIndex: BattlerIndex,
    amount: number,
    damageResult: DamageResult = HitResult.EFFECTIVE,
    critical: boolean = false,
  ) {
    super(battlerIndex);

    this.amount = amount;
    this.damageResult = damageResult;
    this.critical = critical;
  }

  override start() {
    super.start();

    if (this.damageResult === HitResult.ONE_HIT_KO) {
      if (globalScene.moveAnimations) {
        globalScene.toggleInvert(true);
      }
      globalScene.time.delayedCall(fixedInt(1000), () => {
        globalScene.toggleInvert(false);
        this.applyDamage();
      });
      return;
    }

    this.applyDamage();
  }

  updateAmount(amount: number): void {
    this.amount = amount;
  }

  applyDamage() {
    switch (this.damageResult) {
      case HitResult.EFFECTIVE:
        globalScene.playSound("se/hit");
        break;
      case HitResult.SUPER_EFFECTIVE:
      case HitResult.ONE_HIT_KO:
        globalScene.playSound("se/hit_strong");
        break;
      case HitResult.NOT_VERY_EFFECTIVE:
        globalScene.playSound("se/hit_weak");
        break;
    }

    if (this.amount) {
      globalScene.damageNumberHandler.add(this.getPokemon(), this.amount, this.damageResult, this.critical);
    }

    if (this.damageResult !== HitResult.OTHER && this.amount > 0) {
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

  override end() {
    if (globalScene.currentBattle.isClassicFinalBoss) {
      globalScene.initFinalBossPhaseTwo(this.getPokemon());
    } else {
      super.end();
    }
  }
}

import { type BattlerIndex } from "#app/battle";
import { type DamageResult, HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "#app/phases/pokemon-phase";
import { BattleSpec } from "#enums/battle-spec";

/** Displays damage numbers and plays move hit SFX during battle */
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

  public override start(): void {
    super.start();

    if (this.damageResult === HitResult.ONE_HIT_KO) {
      if (globalScene.moveAnimations) {
        globalScene.toggleInvert(true);
      }
      globalScene.time.delayedCall(1000, () => {
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

  public override end(): void {
    if (globalScene.currentBattle.battleSpec === BattleSpec.FINAL_BOSS) {
      globalScene.initFinalBossPhaseTwo(this.getPokemon());
    } else {
      super.end();
    }
  }
}

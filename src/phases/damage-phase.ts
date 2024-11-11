import { globalScene } from "#app/battle-scene";
import { BattlerIndex } from "#app/battle";
import { BattleSpec } from "#app/enums/battle-spec";
import { DamageResult, HitResult } from "#app/field/pokemon";
import * as Utils from "#app/utils";
import { PokemonPhase } from "./pokemon-phase";

export class DamagePhase extends PokemonPhase {
  private amount: integer;
  private damageResult: DamageResult;
  private critical: boolean;

  constructor(battlerIndex: BattlerIndex, amount: integer, damageResult?: DamageResult, critical: boolean = false) {
    super(battlerIndex);

    this.amount = amount;
    this.damageResult = damageResult || HitResult.EFFECTIVE;
    this.critical = critical;
  }

  start() {
    super.start();

    if (this.damageResult === HitResult.ONE_HIT_KO) {
      if (globalScene.moveAnimations) {
        globalScene.toggleInvert(true);
      }
      globalScene.time.delayedCall(Utils.fixedInt(1000), () => {
        globalScene.toggleInvert(false);
        this.applyDamage();
      });
      return;
    }

    this.applyDamage();
  }

  updateAmount(amount: integer): void {
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
          this.getPokemon().getSprite().setVisible(flashTimer.repeatCount % 2 === 0);
          if (!flashTimer.repeatCount) {
            this.getPokemon().updateInfo().then(() => this.end());
          }
        }
      });
    } else {
      this.getPokemon().updateInfo().then(() => this.end());
    }
  }

  override end() {
    if (globalScene.currentBattle.battleSpec === BattleSpec.FINAL_BOSS) {
      globalScene.initFinalBossPhaseTwo(this.getPokemon());
    } else {
      super.end();
    }
  }
}

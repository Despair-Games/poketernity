import { globalScene } from "#app/global-scene";
import { EnemyPersistentModifier } from "#app/modifier/modifier";
import { ModifierTier } from "#app/modifier/modifier-tier";
import {
  ModifierPoolType,
  getEnemyBuffModifierForWave,
  regenerateModifierPoolThresholds,
} from "#app/modifier/modifier-type";
import { Phase } from "#app/phase";

/** Adds buff tokens to enemy pokemon in endless mode based on the current wave. */
export class AddEnemyBuffModifierPhase extends Phase {
  public override start(): void {
    super.start();

    const waveIndex = globalScene.currentBattle.waveIndex;
    const tier = !(waveIndex % 1000)
      ? ModifierTier.ULTRA
      : !(waveIndex % 250)
        ? ModifierTier.GREAT
        : ModifierTier.COMMON;

    regenerateModifierPoolThresholds(globalScene.getEnemyParty(), ModifierPoolType.ENEMY_BUFF);

    const count = Math.ceil(waveIndex / 250);
    for (let i = 0; i < count; i++) {
      globalScene.addEnemyModifier(
        getEnemyBuffModifierForWave(
          tier,
          globalScene.findModifiers((m) => m instanceof EnemyPersistentModifier, false),
        ),
        true,
        true,
      );
    }
    globalScene.updateModifiers(false, true).then(() => this.end());
  }
}

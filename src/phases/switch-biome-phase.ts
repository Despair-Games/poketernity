import { getBiomeKey } from "#app/field/arena";
import { globalScene } from "#app/global-scene";
import type { Biome } from "#enums/biome";
import { BattlePhase } from "./abstract-battle-phase";

export class SwitchBiomePhase extends BattlePhase {
  private readonly nextBiome: Biome;

  constructor(nextBiome: Biome) {
    super();

    this.nextBiome = nextBiome;
  }

  public override start(): void {
    super.start();

    const {
      arenaBg,
      arenaBgTransition,
      arenaEnemy,
      arenaNextEnemy,
      arenaPlayer,
      arenaPlayerTransition,
      lastEnemyTrainer,
      tweens,
    } = globalScene;

    tweens.add({
      targets: [arenaEnemy, lastEnemyTrainer],
      x: "+=300",
      duration: 2000,
      onComplete: () => {
        arenaEnemy.setX(arenaEnemy.x - 600);

        globalScene.newArena(this.nextBiome);

        const biomeKey = getBiomeKey(this.nextBiome);
        const bgTexture = `${biomeKey}_bg`;
        arenaBgTransition.setTexture(bgTexture);
        arenaBgTransition.setAlpha(0);
        arenaBgTransition.setVisible(true);
        arenaPlayerTransition.setBiome(this.nextBiome);
        arenaPlayerTransition.setAlpha(0);
        arenaPlayerTransition.setVisible(true);

        tweens.add({
          targets: [arenaPlayer, arenaBgTransition, arenaPlayerTransition],
          duration: 1000,
          delay: 1000,
          ease: "Sine.easeInOut",
          alpha: (target: unknown) => (target === arenaPlayer ? 0 : 1),
          onComplete: () => {
            arenaBg.setTexture(bgTexture);
            arenaPlayer.setBiome(this.nextBiome);
            arenaPlayer.setAlpha(1);
            arenaEnemy.setBiome(this.nextBiome);
            arenaEnemy.setAlpha(1);
            arenaNextEnemy.setBiome(this.nextBiome);
            arenaBgTransition.setVisible(false);
            arenaPlayerTransition.setVisible(false);
            if (lastEnemyTrainer) {
              lastEnemyTrainer.destroy();
            }

            this.end();
          },
        });
      },
    });
  }
}

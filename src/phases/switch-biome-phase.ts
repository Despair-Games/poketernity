import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { BiomeId } from "#enums/biome-id";
import { getBiomeKey } from "#field/arena";

export class SwitchBiomePhase extends Phase {
  public override readonly phaseName = "SwitchBiomePhase";

  private readonly nextBiome: BiomeId;

  constructor(nextBiome: BiomeId) {
    super();

    this.nextBiome = nextBiome;
  }

  public override start(): void {
    const {
      arenaBg,
      arenaBgTransition,
      arenaEnemy,
      arenaNextEnemy,
      arenaPlayer,
      arenaPlayerTransition,
      enemyTrainers,
      tweens,
    } = globalScene;

    tweens.add({
      targets: [arenaEnemy, enemyTrainers],
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
            // TODO: Check timing of `enemyTrainers` initialization
            enemyTrainers?.destroy();

            this.end();
          },
        });
      },
    });
  }
}

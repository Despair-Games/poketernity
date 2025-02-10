import { globalScene } from "#app/global-scene";

/**
 * Function used to bring in a ME's intro visuals
 * @param hide - If true, performs ease out and hide visuals. If false, eases in visuals. Defaults to true
 * @param destroy - If true, will destroy visuals ONLY ON HIDE TRANSITION. Does nothing on show. Defaults to true
 * @param duration - Delay in milliseconds (default 750)
 */
export function transitionMysteryEncounterIntroVisuals(
  hide: boolean = true,
  destroy: boolean = true,
  duration: number = 750,
): Promise<boolean> {
  return new Promise((resolve) => {
    const introVisuals = globalScene.currentBattle.mysteryEncounter!.introVisuals;
    const enemyPokemon = globalScene.getEnemyField();
    if (enemyPokemon) {
      globalScene.currentBattle.enemyParty = [];
    }
    if (introVisuals) {
      if (!hide) {
        // Make sure visuals are in proper state for showing
        introVisuals.setVisible(true);
        introVisuals.x = 244;
        introVisuals.y = 60;
        introVisuals.alpha = 0;
      }

      // Transition
      globalScene.tweens.add({
        targets: [introVisuals, enemyPokemon],
        x: `${hide ? "+" : "-"}=16`,
        y: `${hide ? "-" : "+"}=16`,
        alpha: hide ? 0 : 1,
        ease: "Sine.easeInOut",
        duration,
        onComplete: () => {
          if (hide && destroy) {
            globalScene.field.remove(introVisuals, true);

            enemyPokemon.forEach((pokemon) => {
              globalScene.field.remove(pokemon, true);
            });

            globalScene.currentBattle.mysteryEncounter!.introVisuals = undefined;
          }
          resolve(true);
        },
      });
    } else {
      resolve(true);
    }
  });
}

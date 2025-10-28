import { globalScene } from "#app/global-scene";
import { activeOverrides } from "#app/overrides";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { playTween } from "#utils/anim-utils";
import { clamp } from "#utils/common-utils";
import i18next from "i18next";

/** Handles the Player attempting to run away from a Wild Battle via a "Run" command. */
export class AttemptRunPhase extends PokemonPhase {
  public override readonly phaseName = "AttemptRunPhase";

  public override async start(): Promise<void> {
    if (this.canRunAway()) {
      await this.handleSuccessfulRunAway();
    } else {
      this.handleFailedRunAway();
    }
    this.end();
  }

  /** @returns `true` if this run attempt is successful */
  private canRunAway(): boolean {
    if (activeOverrides.RUN_RESULT_OVERRIDE != null) {
      return activeOverrides.RUN_RESULT_OVERRIDE;
    }

    const playerField = globalScene.getPlayerField().filter((p) => p.isActive(true));
    if (playerField.some((p) => p.hasAbilityWithAttr(AbAttrFlag.RUN_SUCCESS))) {
      return true;
    }

    const enemyField = globalScene.getEnemyField().filter((p) => p.isActive(true));

    const escapeChance = this.getEscapeChance(playerField, enemyField);

    return this.getPokemon().randSeedInt(100) < escapeChance;
  }

  /**
   * Calculates the chance of the Player escaping battle in the current game state
   * (assuming Run Away and other external effects are not active).
   * @param playerField - The active {@linkcode PlayerPokemon} on the field
   * @param enemyField - The active {@linkcode EnemyPokemon} on the field
   * @returns the chance (in percent) of the Player to escape safely from battle
   */
  private getEscapeChance(playerField: Pokemon[], enemyField: Pokemon[]): number {
    /** Sum of the speed of all enemy pokemon on the field */
    const enemySpeed = enemyField.reduce(
      (total: number, enemyPokemon: Pokemon) => total + enemyPokemon.getStat(Stat.SPD),
      0,
    );
    /** Sum of the speed of all player pokemon on the field */
    const playerSpeed = playerField.reduce(
      (total: number, playerPokemon: Pokemon) => total + playerPokemon.getStat(Stat.SPD),
      0,
    );

    /*
     * The way the escape chance works is by looking at the difference between your speed and the enemy field's average speed as a ratio. The higher this ratio, the higher your chance of success.
     * However, there is a cap for the ratio of your speed vs enemy speed which beyond that point, you won't gain any advantage. It also looks at how many times you've tried to escape.
     * Again, the more times you've tried to escape, the higher your odds of escaping. Bosses and non-bosses are calculated differently - bosses are harder to escape from vs non-bosses
     * Finally, there's a minimum and maximum escape chance as well so that escapes aren't guaranteed, yet they are never 0 either.
     * The percentage chance to escape from a pokemon for both bosses and non bosses is linear and based on the minimum and maximum chances, and the speed ratio cap.
     *
     * At the time of writing, these conditions should be met:
     * - The minimum escape chance should be 5% for bosses and non bosses
     * - Bosses should have a maximum escape chance of 25%, whereas non-bosses should be 95%
     * - The bonus per previous escape attempt should be 2% for bosses and 10% for non-bosses
     * - The speed ratio cap should be 6x for bosses and 4x for non-bosses
     * - The "default" escape chance when your speed equals the enemy speed should be 8.33% for bosses and 27.5% for non-bosses
     *
     * From the above, we can calculate the below values
     */

    const isBoss = enemyField.some((p) => p.isBoss());

    /** The ratio between the speed of your active pokemon and the speed of the enemy field */
    const speedRatio = playerSpeed / enemySpeed;
    /** The max ratio before escape chance stops increasing. Increased if there is a boss on the field */
    const speedCap = isBoss ? 6 : 4;
    /** Minimum percent chance to escape */
    const minChance = 5;
    /** Maximum percent chance to escape. Decreased if a boss is on the field */
    const maxChance = isBoss ? 25 : 95;
    /** How much each escape attempt increases the chance of the next attempt. Decreased if a boss is on the field */
    const escapeBonus = isBoss ? 2 : 10;
    /** Slope of the escape chance curve */
    const escapeSlope = (maxChance - minChance) / speedCap;

    // This will calculate the escape chance given all of the above and clamp it to the range of [`minChance`, `maxChance`]
    return clamp(
      Math.round(escapeSlope * speedRatio + minChance + escapeBonus * globalScene.currentBattle.escapeAttempts++),
      minChance,
      maxChance,
    );
  }

  /**
   * Applies all data and visual feedback for the Player successfully fleeing from battle, including:
   * - Playing animations to clear the enemy's side of the field
   * - Destroying enemy assets (e.g. sprites)
   * - Scheduling a phase to advance to the next wave
   */
  private async handleSuccessfulRunAway(): Promise<void> {
    const { arena, arenaEnemy, audioManager, phaseManager } = globalScene;
    const enemyField = globalScene.getEnemyField().filter((p) => p.isActive(true));

    audioManager.playSound("se/flee");
    phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("battle:runAwaySuccess"), undefined, true, 500);

    await playTween({
      targets: [arenaEnemy, ...enemyField],
      alpha: 0,
      duration: 250,
      ease: "Sine.easeIn",
    });

    globalScene.clearEnemyHeldItemModifiers();
    // clear all queued delayed attacks (e.g. from Future Sight)
    arena.removeTag(ArenaTagType.DELAYED_ATTACK);

    // TODO: Should this be run at the same time as the tween?
    await Promise.allSettled(enemyField.map((p) => p.hideInfo()));
    enemyField.forEach((p) => p.destroy());

    phaseManager.clearAllPhases();
    phaseManager.queueNextBattle(false);
  }

  /** Applies all data and visual feedback for the Player failing to flee from battle. */
  private handleFailedRunAway(): void {
    globalScene.getPlayerField().forEach((p) => {
      // TODO: This flag should be in another scope. Attaching it to Pokemon may lead to duplicate data
      p.turnData.failedRunAway = true;
    });
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battle:runAwayCannotEscape"),
      undefined,
      true,
      500,
    );
  }
}

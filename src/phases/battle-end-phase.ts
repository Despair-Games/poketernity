import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PostBattleAbAttr } from "#abilities/post-battle-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { LapsingPersistentModifier, LapsingPokemonHeldItemModifier } from "#modifier/modifier";
import { BattlePhase } from "#phases/base/battle-phase";

/**
 * Handles the effects that need to trigger after a battle ends (game stats updates, reducing item turn count, etc)
 */
export class BattleEndPhase extends BattlePhase {
  public override readonly phaseName = "BattleEndPhase";

  /** If true, will increment battles won */
  public readonly isVictory: boolean;

  constructor(isVictory: boolean) {
    super();

    this.isVictory = isVictory;
  }

  public override start(): void {
    const { currentBattle, gameData } = globalScene;

    gameData.gameStats.battles++;

    for (const pokemon of globalScene.getPlayerField()) {
      if (pokemon) {
        pokemon.summonData.waveTurnCount = 0;
      }
    }

    for (const pokemon of globalScene.getPokemonAllowedInBattle()) {
      applyAbAttrs<PostBattleAbAttr>(AbAttrFlag.POST_BATTLE, pokemon, false, this.isVictory);
    }

    if (this.isVictory) {
      currentBattle.addBattleScore();

      if (currentBattle.trainer) {
        gameData.gameStats.trainersDefeated++;
      }

      /**
       * Custom behavior that differs slightly from mainline
       * Will award money on defeating foe
       * Will award money on capturing foe
       * Will NOT award money on forcing foe to flee
       * Will NOT award money if foe flees
       */
      if (currentBattle.moneyScattered) {
        currentBattle.pickUpScatteredMoney();
      }
    }

    globalScene.clearEnemyHeldItemModifiers();

    for (const p of globalScene.getEnemyParty()) {
      try {
        p.destroy();
      } catch {
        console.warn("Unable to destroy stale pokemon object in BattleEndPhase:", p);
      }
    }

    const lapsingModifiers = globalScene.findModifiers(
      (m) => m.isLapsingPersistentModifier() || m.isLapsingPokemonHeldItemModifier(),
    ) as (LapsingPersistentModifier | LapsingPokemonHeldItemModifier)[];
    for (const m of lapsingModifiers) {
      const args: any[] = [];
      if (m.isLapsingPokemonHeldItemModifier()) {
        args.push(globalScene.getPokemonById(m.pokemonId));
      }
      if (!m.lapse(...args)) {
        globalScene.removeModifier(m);
      }
    }

    globalScene.updateModifiers();
    this.end();
  }
}

import { BattlerIndex } from "#app/battle";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { MoveResult } from "#app/field/pokemon";
import { GameManager } from "#test/testUtils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Gastro Acid", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.overridesHelper.battleType("double");
    game.overridesHelper.startingLevel(1);
    game.overridesHelper.enemyLevel(100);
    game.overridesHelper.ability(Abilities.NONE);
    game.overridesHelper.moveset([Moves.GASTRO_ACID, Moves.WATER_GUN, Moves.SPLASH, Moves.CORE_ENFORCER]);
    game.overridesHelper.enemySpecies(Species.BIDOOF);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    game.overridesHelper.enemyAbility(Abilities.WATER_ABSORB);
  });

  it("suppresses effect of ability", async () => {
    /*
     * Expected flow (enemies have WATER ABSORD, can only use SPLASH)
     * - player mon 1 uses GASTRO ACID, player mon 2 uses SPLASH
     * - both player mons use WATER GUN on their respective enemy mon
     * - player mon 1 should have dealt damage, player mon 2 should have not
     */

    await game.startBattle();

    game.moveHelper.select(Moves.GASTRO_ACID, 0, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("TurnInitPhase");

    const enemyField = game.scene.getEnemyField();
    expect(enemyField[0].summonData.abilitySuppressed).toBe(true);
    expect(enemyField[1].summonData.abilitySuppressed).toBe(false);

    game.moveHelper.select(Moves.WATER_GUN, 0, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.WATER_GUN, 1, BattlerIndex.ENEMY_2);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyField[0].hp).toBeLessThan(enemyField[0].getMaxHp());
    expect(enemyField[1].isFullHp()).toBe(true);
  });

  it("fails if used on an enemy with an already-suppressed ability", async () => {
    game.overridesHelper.battleType("single");

    await game.startBattle();

    game.moveHelper.select(Moves.CORE_ENFORCER);
    // Force player to be slower to enable Core Enforcer to proc its suppression effect
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("TurnInitPhase");

    game.moveHelper.select(Moves.GASTRO_ACID);

    await game.phaseInterceptor.to("TurnInitPhase");

    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });
});

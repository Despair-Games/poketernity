import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Damp", () => {
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
    game.override
      .ability(AbilityId.DAMP)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100);
  });

  it.each([
    { moveName: "Explosion", moveId: MoveId.EXPLOSION },
    { moveName: "Self-Destruct", moveId: MoveId.SELF_DESTRUCT },
    { moveName: "Misty Explosion", moveId: MoveId.MISTY_EXPLOSION },
    { moveName: "Mind Blown", moveId: MoveId.MIND_BLOWN },
  ])("should prevent the move $moveName from being used", async ({ moveId }) => {
    game.override.battleType("double").enemyMoveset(moveId);
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.ABRA);

    const playerPokemon2 = game.scene.getPlayerField()[1];
    const enemyPokemon1 = game.scene.getEnemyField()[0];

    game.move.use(MoveId.SPLASH);
    game.move.use(moveId, 1);
    await game.toEndOfTurn();

    expect(playerPokemon2).toHaveUsedMove({ moveId, result: MoveResult.FAIL });
    expect(enemyPokemon1).toHaveUsedMove({ moveId, result: MoveResult.FAIL });
  });

  it("should prevent damage from the ability Aftermath", async () => {
    game.override.enemyAbility(AbilityId.AFTERMATH);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();
    enemyPokemon.hp = 1;

    game.move.use(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(playerPokemon).toHaveFullHp();
    expect(enemyPokemon).toHaveFainted();
  });
});

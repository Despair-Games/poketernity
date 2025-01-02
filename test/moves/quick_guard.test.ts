import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { GameManager } from "#test/testUtils/gameManager";
import { Species } from "#enums/species";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Stat } from "#enums/stat";
import { BattlerIndex } from "#app/battle";
import { MoveResult } from "#app/field/pokemon";

describe("Moves - Quick Guard", () => {
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

    game.overridesHelper.moveset([Moves.QUICK_GUARD, Moves.SPLASH, Moves.FOLLOW_ME]);

    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyMoveset([Moves.QUICK_ATTACK]);
    game.overridesHelper.enemyAbility(Abilities.INSOMNIA);

    game.overridesHelper.startingLevel(100);
    game.overridesHelper.enemyLevel(100);
  });

  test("should protect the user and allies from priority moves", async () => {
    await game.classicModeHelper.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();

    game.moveHelper.select(Moves.QUICK_GUARD);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    playerPokemon.forEach((p) => expect(p.hp).toBe(p.getMaxHp()));
  });

  test("should protect the user and allies from Prankster-boosted moves", async () => {
    game.overridesHelper.enemyAbility(Abilities.PRANKSTER);
    game.overridesHelper.enemyMoveset([Moves.GROWL]);

    await game.classicModeHelper.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();

    game.moveHelper.select(Moves.QUICK_GUARD);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    playerPokemon.forEach((p) => expect(p.getStatStage(Stat.ATK)).toBe(0));
  });

  test("should stop subsequent hits of a multi-hit priority move", async () => {
    game.overridesHelper.enemyMoveset([Moves.WATER_SHURIKEN]);

    await game.classicModeHelper.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.moveHelper.select(Moves.QUICK_GUARD);
    game.moveHelper.select(Moves.FOLLOW_ME, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    playerPokemon.forEach((p) => expect(p.hp).toBe(p.getMaxHp()));
    enemyPokemon.forEach((p) => expect(p.turnData.hitCount).toBe(1));
  });

  test("should fail if the user is the last to move in the turn", async () => {
    game.overridesHelper.battleType("single");
    game.overridesHelper.enemyMoveset([Moves.QUICK_GUARD]);

    await game.classicModeHelper.startBattle([Species.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.QUICK_GUARD);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(playerPokemon.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });
});

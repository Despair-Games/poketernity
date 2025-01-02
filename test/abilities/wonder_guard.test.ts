import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Wonder Guard", () => {
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
    game.overridesHelper
      .moveset([Moves.TACKLE, Moves.THUNDERBOLT])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.WONDER_GUARD)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should prevent damage from attacks that aren't >=2x effectiveness", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(enemy.hp).toBe(1);
  });

  it("should not prevent damage from attacks that are >=2x effectiveness", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.THUNDERBOLT);
    await game.phaseInterceptor.to("BattleEndPhase");

    expect(enemy.isFainted()).toBe(true);
  });
});

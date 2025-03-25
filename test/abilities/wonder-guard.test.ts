import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
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
    game.override
      .moveset([MoveId.TACKLE, MoveId.THUNDERBOLT])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.WONDER_GUARD)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should prevent damage from attacks that aren't >=2x effectiveness", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(enemy.hp).toBe(1);
  });

  it("should not prevent damage from attacks that are >=2x effectiveness", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.THUNDERBOLT);
    await game.phaseInterceptor.to("BattleEndPhase");

    expect(enemy.isFainted()).toBe(true);
  });
});

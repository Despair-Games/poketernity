import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Endure", () => {
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
      .moveset([MoveId.THUNDER, MoveId.BULLET_SEED, MoveId.TOXIC])
      .ability(AbilityId.SKILL_LINK)
      .startingLevel(100)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.NO_GUARD)
      .enemyMoveset(MoveId.ENDURE);
  });

  it("should let the pokemon survive with 1 HP", async () => {
    await game.classicMode.startBattle([SpeciesId.ARCEUS]);

    game.move.select(MoveId.THUNDER);
    await game.toEndOfTurn();

    expect(game.scene.getEnemyPokemon()!.hp).toBe(1);
  });

  it("should let the pokemon survive with 1 HP when hit with a multihit move", async () => {
    await game.classicMode.startBattle([SpeciesId.ARCEUS]);

    game.move.select(MoveId.BULLET_SEED);
    await game.toEndOfTurn();

    expect(game.scene.getEnemyPokemon()!.hp).toBe(1);
  });

  it("shouldn't prevent fainting from indirect damage", async () => {
    game.override.enemyLevel(100);
    await game.classicMode.startBattle([SpeciesId.ARCEUS]);

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.hp = 2;

    game.move.select(MoveId.TOXIC);
    await game.phaseInterceptor.to("VictoryPhase");

    expect(enemy.isFainted()).toBe(true);
  });
});

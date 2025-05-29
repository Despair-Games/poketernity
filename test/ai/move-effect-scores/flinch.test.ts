import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Flinch", () => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.ASTONISH, MoveId.SPLASH, MoveId.TACKLE])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should grant an incentive when the user is faster than the target", async () => {
    await game.classicMode.startBattle([SpeciesId.DONDOZO]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy.outspeeds(player)).toBeTruthy();
    expect(enemy).toPreferSelectingMove(MoveId.ASTONISH);
  });

  it("should not affect score when the target is faster than the user", async () => {
    await game.classicMode.startBattle([SpeciesId.REGIELEKI]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    expect(player.outspeeds(enemy)).toBeTruthy();
    expect(enemy).toPreferSelectingMove(MoveId.TACKLE);
  });

  it("should grant an incentive when the move has increased priority", async () => {
    game.override.enemyMoveset([MoveId.FAKE_OUT, MoveId.TACKLE, MoveId.SPLASH]);

    await game.classicMode.startBattle([SpeciesId.REGIELEKI]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    expect(player.outspeeds(enemy)).toBeTruthy();
    expect(enemy).toPreferSelectingMove(MoveId.FAKE_OUT);
  });
});

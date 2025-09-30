import { allAbilities } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Ability - Victory Star", () => {
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
      .ability(AbilityId.VICTORY_STAR)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should increase accuracy by 10%", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "getAccuracyMultiplier");

    game.move.use(MoveId.PYRO_BALL);
    await game.toEndOfTurn();

    expect(player.getAccuracyMultiplier).toHaveLastReturnedWith(1.1);
  });

  it("should increase allies' accuracy by 10%", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerField();
    vi.spyOn(magikarp, "getAccuracyMultiplier");
    vi.spyOn(feebas, "getAccuracyMultiplier");
    vi.spyOn(feebas, "getAbility").mockReturnValue(allAbilities[AbilityId.BALL_FETCH]);

    game.move.use(MoveId.PYRO_BALL, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.PYRO_BALL, 1, BattlerIndex.ENEMY_2);
    await game.toEndOfTurn();

    expect(magikarp.getAccuracyMultiplier).toHaveLastReturnedWith(1.1);
    expect(feebas.getAccuracyMultiplier).toHaveLastReturnedWith(1.1);
  });

  it("should not increase opponents' accuracy", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    vi.spyOn(enemy, "getAccuracyMultiplier");

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.PYRO_BALL);
    await game.toEndOfTurn();

    expect(enemy.getAccuracyMultiplier).toHaveLastReturnedWith(1);
  });

  it("should stack multiplicatively with other instances of Victory Star", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerField();
    vi.spyOn(magikarp, "getAccuracyMultiplier");
    vi.spyOn(feebas, "getAccuracyMultiplier");

    game.move.use(MoveId.PYRO_BALL, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.PYRO_BALL, 1, BattlerIndex.ENEMY_2);
    await game.toEndOfTurn();

    expect(magikarp.getAccuracyMultiplier).toHaveLastReturnedWith(expect.closeTo(1.21));
    expect(feebas.getAccuracyMultiplier).toHaveLastReturnedWith(expect.closeTo(1.21));
  });
});

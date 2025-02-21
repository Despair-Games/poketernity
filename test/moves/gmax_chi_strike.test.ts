import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";

describe("Moves - G-Max Chi Strike grants a stackable crit boost", () => {
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
      .startingLevel(100)
      .moveset([MoveId.G_MAX_CHI_STRIKE, MoveId.BITE, MoveId.FOCUS_ENERGY, MoveId.BATON_PASS])
      .enemySpecies(Species.BLISSEY)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("G-Max chi strike should grant a non-expiring stackable crit boost", async () => {
    game.override.enemyAbility(Abilities.PRANKSTER).enemyMoveset([MoveId.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.MACHAMP]);

    const enemy = game.scene.getEnemyField()[0];
    vi.spyOn(enemy, "getCritStage");

    game.move.select(MoveId.G_MAX_CHI_STRIKE);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(0); // getCritStage is called on defender
    await game.toNextTurn();

    game.move.select(MoveId.G_MAX_CHI_STRIKE);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(1);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    game.move.select(MoveId.BITE);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(2);
  });

  it("G-Max chi strike should not grant the boost if the opponent is ghost", async () => {
    game.override.enemySpecies(Species.GENGAR);
    await game.classicMode.startBattle([Species.MACHAMP]);

    const enemy = game.scene.getEnemyField()[0];
    vi.spyOn(enemy, "getCritStage");

    game.move.select(MoveId.G_MAX_CHI_STRIKE);
    await game.toNextTurn();

    game.move.select(MoveId.BITE);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(0);
  });

  it("G-Max chi strike should grant ally stackable crit boost", async () => {
    game.override
      .battleType("double")
      .enemyAbility(Abilities.PRANKSTER)
      .moveset([MoveId.G_MAX_CHI_STRIKE, MoveId.BITE, MoveId.SPLASH, MoveId.DRAGON_CHEER])
      .enemyMoveset([MoveId.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.MACHAMP, Species.SHUCKLE]);

    const enemy = game.scene.getEnemyField()[0];
    vi.spyOn(enemy, "getCritStage");

    game.move.select(MoveId.G_MAX_CHI_STRIKE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.BITE, 1, BattlerIndex.ENEMY);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(1);

    game.move.select(MoveId.DRAGON_CHEER);
    game.move.select(MoveId.BITE, 1, BattlerIndex.ENEMY);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(2);
  });

  it("G-Max chi strike crit boost is not baton passable", async () => {
    game.override.enemyAbility(Abilities.PRANKSTER).enemyMoveset([MoveId.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.MACHAMP, Species.SHUCKLE]);

    const enemy = game.scene.getEnemyField()[0];
    vi.spyOn(enemy, "getCritStage");

    game.move.select(MoveId.G_MAX_CHI_STRIKE);
    await game.toNextTurn();

    game.move.select(MoveId.BATON_PASS);
    game.doSelectPartyPokemon(1);
    await game.toEndOfTurn();

    game.move.select(MoveId.G_MAX_CHI_STRIKE);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(0);
    await game.toNextTurn();

    game.move.select(MoveId.BITE);
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(1);
  });
});

import { ArenaTagType } from "#enums/arena-tag-type";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#enums/battler-index";

describe("Abilities - Screen Cleaner", () => {
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
    game.override.battleType("single");
    game.override.ability(Abilities.SCREEN_CLEANER);
    game.override.enemySpecies(Species.SHUCKLE);
  });

  it("removes Aurora Veil", async () => {
    game.override.enemyMoveset(MoveId.AURORA_VEIL);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.MAGIKARP]);

    game.move.use(MoveId.HAIL);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.getTag(ArenaTagType.AURORA_VEIL)).toBeDefined();

    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.phaseInterceptor.to("PostSummonPhase");

    expect(game.scene.arena.getTag(ArenaTagType.AURORA_VEIL)).toBeUndefined();
  });

  it("removes Light Screen", async () => {
    game.override.enemyMoveset(MoveId.LIGHT_SCREEN);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.MAGIKARP]);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.getTag(ArenaTagType.LIGHT_SCREEN)).toBeDefined();

    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.phaseInterceptor.to("PostSummonPhase");

    expect(game.scene.arena.getTag(ArenaTagType.LIGHT_SCREEN)).toBeUndefined();
  });

  it("removes Reflect", async () => {
    game.override.enemyMoveset(MoveId.REFLECT);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.MAGIKARP]);

    game.move.use(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.getTag(ArenaTagType.REFLECT)).toBeDefined();

    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.phaseInterceptor.to("PostSummonPhase");

    expect(game.scene.arena.getTag(ArenaTagType.REFLECT)).toBeUndefined();
  });
});

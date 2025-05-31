import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

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
    game.override.ability(AbilityId.SCREEN_CLEANER);
    game.override.enemySpecies(SpeciesId.SHUCKLE);
  });

  it("removes Aurora Veil", async () => {
    game.override.moveset([MoveId.HAIL]);
    game.override.enemyMoveset([MoveId.AURORA_VEIL, MoveId.AURORA_VEIL, MoveId.AURORA_VEIL, MoveId.AURORA_VEIL]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.MAGIKARP);

    game.move.select(MoveId.HAIL);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.hasTag(ArenaTagType.AURORA_VEIL, ArenaTagSide.ENEMY)).toBeTruthy();

    await game.toNextTurn();
    game.switchPokemon(1);
    await game.phaseInterceptor.to("PostSummonPhase");

    expect(game.scene.arena.hasTag(ArenaTagType.AURORA_VEIL, ArenaTagSide.ENEMY)).toBeFalsy();
  });

  it("removes Light Screen", async () => {
    game.override.enemyMoveset(MoveId.LIGHT_SCREEN);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.MAGIKARP);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.hasTag(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.ENEMY)).toBeTruthy();

    await game.toNextTurn();
    game.switchPokemon(1);
    await game.phaseInterceptor.to("PostSummonPhase");

    expect(game.scene.arena.hasTag(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.ENEMY)).toBeFalsy();
  });

  it("removes Reflect", async () => {
    game.override.enemyMoveset(MoveId.REFLECT);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.MAGIKARP);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.hasTag(ArenaTagType.REFLECT, ArenaTagSide.ENEMY)).toBeTruthy();

    await game.toNextTurn();
    game.switchPokemon(1);
    await game.phaseInterceptor.to("PostSummonPhase");

    expect(game.scene.arena.hasTag(ArenaTagType.REFLECT, ArenaTagSide.ENEMY)).toBeFalsy();
  });
});

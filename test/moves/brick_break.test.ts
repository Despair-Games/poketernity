import { allMoves } from "#app/data/data-lists";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Brick Break", () => {
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
      .moveset([MoveId.BRICK_BREAK])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each([
    { tagType: ArenaTagType.LIGHT_SCREEN, name: "Light Screen" },
    { tagType: ArenaTagType.REFLECT, name: "Reflect" },
    { tagType: ArenaTagType.AURORA_VEIL, name: "Aurora Veil" },
  ])("should remove the effects of $name from the target's side of the field", async ({ tagType }) => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY].forEach((side) =>
      game.scene.arena.addTag(tagType, 0, 2, MoveId.NONE, side),
    );

    game.move.select(MoveId.BRICK_BREAK);

    await game.toEndOfTurn();
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.ENEMY)).toBeUndefined();
  });

  it("Reflect should not reduce Brick Break's damage when removed", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.scene.arena.addTag(ArenaTagType.REFLECT, 0, 2, MoveId.NONE, ArenaTagSide.ENEMY);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;
    const spy = vi.spyOn(enemy, "getAttackDamage");

    game.move.select(MoveId.BRICK_BREAK);
    await game.toEndOfTurn();

    const damage = spy.mock.results.at(-1)?.value.damage;

    expect(damage).toBe(toDmgValue(enemy.getBaseDamage(player, allMoves[MoveId.BRICK_BREAK], MoveCategory.PHYSICAL)));
  });

  it("should not remove screens if the move has no effect", async () => {
    game.override.enemySpecies(Species.DUSKULL);

    await game.classicMode.startBattle([Species.FEEBAS]);

    game.scene.arena.addTag(ArenaTagType.REFLECT, 0, 2, MoveId.NONE, ArenaTagSide.ENEMY);

    game.move.select(MoveId.BRICK_BREAK);

    await game.toEndOfTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.ENEMY)).toBeDefined();
  });
});

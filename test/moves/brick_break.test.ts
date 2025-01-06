import { allMoves } from "#app/data/all-moves";
import { ArenaTagSide } from "#app/data/arena-tag";
import { toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { Moves } from "#enums/moves";
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
      .moveset([Moves.BRICK_BREAK])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
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
      game.scene.arena.addTag(tagType, 2, Moves.NONE, 0, side),
    );

    game.move.select(Moves.BRICK_BREAK);

    await game.phaseInterceptor.to("BerryPhase", false);
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.ENEMY)).toBeUndefined();
  });

  it("Reflect should not reduce Brick Break's damage when removed", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.scene.arena.addTag(ArenaTagType.REFLECT, 2, Moves.NONE, 0, ArenaTagSide.ENEMY);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;
    const spy = vi.spyOn(enemy, "getAttackDamage");

    game.move.select(Moves.BRICK_BREAK);
    await game.phaseInterceptor.to("BerryPhase", false);

    const damage = spy.mock.results.at(-1)?.value.damage;

    expect(damage).toBe(toDmgValue(enemy.getBaseDamage(player, allMoves[Moves.BRICK_BREAK], MoveCategory.PHYSICAL)));
  });

  it("should not remove screens if the move has no effect", async () => {
    game.override.enemySpecies(Species.DUSKULL);

    await game.classicMode.startBattle([Species.FEEBAS]);

    game.scene.arena.addTag(ArenaTagType.REFLECT, 2, Moves.NONE, 0, ArenaTagSide.ENEMY);

    game.move.select(Moves.BRICK_BREAK);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(game.scene.arena.getTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.ENEMY)).toBeDefined();
  });
});

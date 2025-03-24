import { EntryHazardTag } from "#app/data/arena-tag";
import { TrappedTag } from "#app/data/battler-tags/trapped-tag";
import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("Moves - Protect", () => {
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

    game.override.moveset([MoveId.PROTECT]);
    game.override.enemySpecies(SpeciesId.SNORLAX);

    game.override.enemyAbility(AbilityId.INSOMNIA);
    game.override.enemyMoveset([MoveId.TACKLE]);

    game.override.startingLevel(100);
    game.override.enemyLevel(100);
  });

  test("should protect the user from attacks", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
  });

  test("should prevent secondary effects from the opponent's attack", async () => {
    game.override.enemyMoveset([MoveId.CEASELESS_EDGE]);
    vi.spyOn(allMoves.get(MoveId.CEASELESS_EDGE), "accuracy", "get").mockReturnValue(100);

    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
    expect(game.scene.arena.getTagOnSide(EntryHazardTag, ArenaTagSide.ENEMY)).toBeUndefined();
  });

  test("should protect the user from status moves", async () => {
    game.override.enemyMoveset([MoveId.CHARM]);

    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(0);
  });

  test("should stop subsequent hits of a multi-hit move", async () => {
    game.override.enemyMoveset([MoveId.TACHYON_CUTTER]);

    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
    expect(enemyPokemon.turnData.hitCount).toBe(1);
  });

  test("certain moves can bypass protect", async () => {
    game.override.enemyMoveset([MoveId.BLOCK]);

    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.findTag((t) => t instanceof TrappedTag)).toBeDefined();
  });

  test("should fail if the user is the last to move in the turn", async () => {
    game.override.enemyMoveset([MoveId.PROTECT]);

    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.PROTECT);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    expect(enemyPokemon.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(leadPokemon.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });
});

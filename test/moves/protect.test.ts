import { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import { TrappedTag } from "#battler-tags/trapped-tag";
import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { ProtectAttr } from "#moves/protect-attr";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

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

  it("should protect the user from attacks", async () => {
    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
  });

  it("should prevent secondary effects from the opponent's attack", async () => {
    game.override.enemyMoveset([MoveId.CEASELESS_EDGE]);
    vi.spyOn(allMoves.get(MoveId.CEASELESS_EDGE), "accuracy", "get").mockReturnValue(100);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
    expect(game.scene.arena.getTags((t) => t instanceof EntryHazardTag, ArenaTagSide.ENEMY)).toEqual([]);
  });

  it("should protect the user from status moves", async () => {
    game.override.enemyMoveset([MoveId.CHARM]);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should stop subsequent hits of a multi-hit move", async () => {
    game.override.enemyMoveset([MoveId.TACHYON_CUTTER]);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
    expect(enemyPokemon.turnData.hitCount).toBe(1);
  });

  it("certain moves can bypass protect", async () => {
    game.override.enemyMoveset([MoveId.BLOCK]);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.PROTECT);

    await game.toEndOfTurn();

    expect(leadPokemon.findTag((t) => t instanceof TrappedTag)).toBeDefined();
  });

  it("should fail if the user is the last to move in the turn", async () => {
    game.override.enemyMoveset([MoveId.PROTECT]);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.PROTECT);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    expect(enemyPokemon).toHaveMoveResult(MoveResult.SUCCESS);
    expect(leadPokemon).toHaveMoveResult(MoveResult.FAIL);
  });

  it.each([
    [1 / 3, 1],
    [1 / 9, 2],
    [1 / 27, 3],
  ])(
    "should have a success rate of %d after being used %d consecutive time(s) successfully",
    async (expectedRate, numUses) => {
      await game.classicMode.startBattle(SpeciesId.CHARIZARD);

      const protect = allMoves.get(MoveId.PROTECT);
      const protectAttr = protect.getAttrs(ProtectAttr)[0];
      vi.spyOn(protect, "applyConditions").mockReturnValue(true);

      for (let i = 0; i < numUses; i++) {
        game.move.use(MoveId.PROTECT);
        await game.toNextTurn();
      }

      const player = game.field.getPlayerPokemon();

      let successes = 0;
      const numTrials = 1000;
      await game.rng.equalSample(numTrials, () => {
        if (protectAttr.getCondition()(player, player, allMoves.get(MoveId.PROTECT))) {
          successes++;
        }
      });

      expect(successes / numTrials).toBeCloseTo(expectedRate);
    },
  );
});

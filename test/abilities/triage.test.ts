import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Triage", () => {
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
      .moveset([MoveId.SPLASH])
      .ability(AbilityId.TRIAGE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  // Note: All affected moves have been verified to have the TRIAGE_MOVE flag by all_moves
  it.each([
    { moveId: MoveId.RECOVER, moveName: "Recover" },
    { moveId: MoveId.HEALING_WISH, moveName: "Healing Wish (P)" },
    { moveId: MoveId.BITTER_BLADE, moveName: "Bitter Blade" },
  ])("should increase the priority of HP-recovery moves by 3", async ({ moveId }) => {
    game.override.moveset(moveId);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.field.getPlayerPokemon();
    const moveToUse = allMoves.get(moveId);
    const originalPriority = moveToUse.priority;
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(moveToUse.hasFlag(MoveFlags.TRIAGE_MOVE)).toBe(true);
    expect(moveToUse.checkFlag(MoveFlags.TRIAGE_MOVE, playerPokemon)).toBe(true);
    expect(moveToUse.getPriority(playerPokemon)).toBe(originalPriority + 3);
  });

  it.each([
    { moveId: MoveId.AQUA_RING, moveName: "Aqua Ring" },
    { moveId: MoveId.INGRAIN, moveName: "Ingrain" },
    { moveId: MoveId.GRASSY_TERRAIN, moveName: "Grassy Terrain" },
    { moveId: MoveId.LEECH_SEED, moveName: "Leech Seed" },
    { moveId: MoveId.SAPPY_SEED, moveName: "Sappy Seed" },
    { moveId: MoveId.PAIN_SPLIT, moveName: "Pain Split" },
  ])("should not increase the priority of $moveName", async ({ moveId }) => {
    game.override.moveset(moveId);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.field.getPlayerPokemon();
    const moveToUse = allMoves.get(moveId);
    const originalPriority = moveToUse.priority;
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(moveToUse.hasFlag(MoveFlags.TRIAGE_MOVE)).toBe(false);
    expect(moveToUse.checkFlag(MoveFlags.TRIAGE_MOVE, playerPokemon)).toBe(false);
    expect(moveToUse.getPriority(playerPokemon)).toBe(originalPriority);
  });

  it("should not increase the priority of Pollen Puff if it heals the user's ally", async () => {
    game.override
      .moveset([MoveId.POLLEN_PUFF, MoveId.SPLASH])
      .battleType("double")
      .startingLevel(10)
      .enemyMoveset(MoveId.QUICK_ATTACK);
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.GOLDEEN);

    const playerPokemon = game.scene.getPlayerField()[0];

    game.move.select(MoveId.POLLEN_PUFF, 0, BattlerIndex.PLAYER_2);
    game.move.select(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    // The Pokemon using Pollen Puff on its ally should be after the enemy Pokemon using Quick Attack
    const pollenPuffMove = allMoves.get(MoveId.POLLEN_PUFF);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(pollenPuffMove.hasFlag(MoveFlags.TRIAGE_MOVE)).toBe(false);
    expect(pollenPuffMove.checkFlag(MoveFlags.TRIAGE_MOVE, playerPokemon)).toBe(false);
    expect(playerPokemon.turnData.order).toBeGreaterThanOrEqual(2);
  });
});

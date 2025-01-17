import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import { TurnStartPhase } from "#app/phases/turn-start-phase";
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
      .moveset([Moves.SPLASH])
      .ability(Abilities.TRIAGE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  // Note: All affected moves have been verified to have the TRIAGE_MOVE flag by all_moves
  it.each([
    { move: Moves.RECOVER, moveName: "Recover" },
    { move: Moves.HEALING_WISH, moveName: "Healing Wish (P)" },
    { move: Moves.BITTER_BLADE, moveName: "Bitter Blade" },
  ])("should increase the priority of HP-recovery moves by 3", async ({ move }) => {
    game.override.moveset(move);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const moveToUse = allMoves[move];
    const originalPriority = moveToUse.priority;
    expect(moveToUse.getPriority(playerPokemon)).toBe(originalPriority + 3);
  });

  it.each([
    { move: Moves.AQUA_RING, moveName: "Aqua Ring" },
    { move: Moves.INGRAIN, moveName: "Ingrain" },
    { move: Moves.GRASSY_TERRAIN, moveName: "Grassy Terrain" },
    { move: Moves.LEECH_SEED, moveName: "Leech Seed" },
    { move: Moves.SAPPY_SEED, moveName: "Sappy Seed" },
    { move: Moves.PAIN_SPLIT, moveName: "Pain Split" },
  ])("should not increase the priority of $moveName", async ({ move }) => {
    game.override.moveset(move);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const moveToUse = allMoves[move];
    const originalPriority = moveToUse.priority;
    expect(moveToUse.getPriority(playerPokemon)).toBe(originalPriority);
  });

  it.todo("should not increase the priority of Present if it heals the target", async () => {
    game.override.moveset(Moves.PRESENT);
    await game.classicMode.startBattle([Species.FEEBAS]);
  });

  it("should not increase the priority of Pollen Puff if it heals the user's ally", async () => {
    game.override
      .moveset([Moves.POLLEN_PUFF, Moves.SPLASH])
      .battleType("double")
      .startingLevel(10)
      .enemyMoveset(Moves.QUICK_ATTACK);
    await game.classicMode.startBattle([Species.FEEBAS, Species.GOLDEEN]);

    game.move.select(Moves.POLLEN_PUFF, 0, BattlerIndex.PLAYER_2);
    game.move.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to(TurnStartPhase, false);
    const phase = game.scene.getCurrentPhase() as TurnStartPhase;
    const healingPokemonIndex = phase.getCommandOrder().indexOf(BattlerIndex.PLAYER);

    // The Pokemon using Pollen Puff on its ally should be after the enemy Pokemon using Quick Attack
    expect(healingPokemonIndex).toBeGreaterThanOrEqual(2);
  });
});

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

  it.each([
    { move: Moves.ABSORB, moveName: "Absorb" },
    { move: Moves.MEGA_DRAIN, moveName: "Mega Drain" },
    { move: Moves.RECOVER, moveName: "Recover" },
    { move: Moves.SOFT_BOILED, moveName: "Soft-Boiled" },
    { move: Moves.DREAM_EATER, moveName: "Dream Eater" },
    { move: Moves.LEECH_LIFE, moveName: "Leech Life" },
    { move: Moves.REST, moveName: "Rest" },
    { move: Moves.GIGA_DRAIN, moveName: "Giga Drain" },
    { move: Moves.MILK_DRINK, moveName: "Milk Drink" },
    { move: Moves.MORNING_SUN, moveName: "Morning Sun" },
    { move: Moves.SYNTHESIS, moveName: "Synthesis" },
    { move: Moves.MOONLIGHT, moveName: "Moonlight" },
    { move: Moves.SWALLOW, moveName: "Swallow" },
    { move: Moves.WISH, moveName: "Wish" },
    { move: Moves.SLACK_OFF, moveName: "Slack Off" },
    { move: Moves.ROOST, moveName: "Roost" },
    { move: Moves.HEALING_WISH, moveName: "Healing Wish (P)" },
    { move: Moves.DRAIN_PUNCH, moveName: "Drain Punch" },
    { move: Moves.HEAL_ORDER, moveName: "Heal Order" },
    { move: Moves.LUNAR_DANCE, moveName: "Lunar Dance (P)" },
    { move: Moves.HEAL_PULSE, moveName: "Heal Pulse" },
    { move: Moves.HORN_LEECH, moveName: "Horn Leech" },
    { move: Moves.PARABOLIC_CHARGE, moveName: "Parabolic Charge" },
    { move: Moves.DRAINING_KISS, moveName: "Draining Kiss" },
    { move: Moves.OBLIVION_WING, moveName: "Oblivion Wing" },
    { move: Moves.SHORE_UP, moveName: "Shore Up" },
    { move: Moves.FLORAL_HEALING, moveName: "Floral Healing" },
    { move: Moves.STRENGTH_SAP, moveName: "Strength Sap" },
    { move: Moves.PURIFY, moveName: "Purify" },
    { move: Moves.BOUNCY_BUBBLE, moveName: "Bouncy Bubble" },
    { move: Moves.LIFE_DEW, moveName: "Life Dew" },
    { move: Moves.JUNGLE_HEALING, moveName: "Jungle Healing" },
    { move: Moves.LUNAR_BLESSING, moveName: "Lunar Blessing" },
    { move: Moves.REVIVAL_BLESSING, moveName: "Revival Blessing" },
    { move: Moves.BITTER_BLADE, moveName: "Bitter Blade" },
    { move: Moves.MATCHA_GOTCHA, moveName: "Matcha Gotcha" },
  ])("should increase the priority of $moveName by 3", async ({ move }) => {
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

  // Test for Present if it heals
  it.todo("should not increase the priority of Present if it heals the user", async () => {
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

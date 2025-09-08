import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Psychic Terrain", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.PSYCHIC_TERRAIN, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  const equalizeSpd = () => {
    game.scene.getField(true).forEach((p) => p.setStat(Stat.SPD, 50));
  };

  it("should not be preferred when no synergies are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    equalizeSpd();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.PSYCHIC_TERRAIN);
  });

  it("should be preferred when the user is Psychic-type", async () => {
    game.override.enemySpecies(SpeciesId.ESPURR);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    equalizeSpd();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.PSYCHIC_TERRAIN);
  });

  it("should be avoided when the opponent is Psychic-type", async () => {
    await game.classicMode.startBattle(SpeciesId.ESPURR);

    equalizeSpd();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.PSYCHIC_TERRAIN);
  });

  it.each([
    { moveName: "Terrain Pulse", moveId: MoveId.TERRAIN_PULSE },
    { moveName: "Expanding Force", moveId: MoveId.EXPANDING_FORCE },
  ])("should be preferred when the user has $moveName", async ({ moveId }) => {
    game.override.enemyMoveset([MoveId.PSYCHIC_TERRAIN, moveId, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    equalizeSpd();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.PSYCHIC_TERRAIN);
  });

  it("should be avoided when the user has a priority move", async () => {
    game.override.enemyMoveset([MoveId.PSYCHIC_TERRAIN, MoveId.QUICK_ATTACK, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    equalizeSpd();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.PSYCHIC_TERRAIN);
  });

  it("should be preferred when the opponent is known to have a priority move", async () => {
    game.override.moveset(MoveId.QUICK_ATTACK);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    equalizeSpd();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.PSYCHIC_TERRAIN);

    game.field.revealAllMoves();
    expect(enemy).toPreferSelectingMove(MoveId.PSYCHIC_TERRAIN);
  });

  it("should be preferred when the user is faster than the opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStat(Stat.SPD, 50);
    enemy.setStat(Stat.SPD, 100);

    expect(enemy).toPreferSelectingMove(MoveId.PSYCHIC_TERRAIN);
  });
});

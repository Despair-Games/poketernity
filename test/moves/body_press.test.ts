import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Body Press", () => {
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should use the user's Defense stat to calculate damage", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const bodyPress = allMoves[MoveId.BODY_PRESS];

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "stats", "get").mockReturnValue(Array(6).fill(100));

    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, bodyPress);

    // double the player's Defense
    vi.spyOn(player, "stats", "get").mockReturnValue([100, 100, 200, 100, 100, 100]);

    const { damage: postDamage } = enemy.getAttackDamage(player, bodyPress);

    expect(postDamage).toBeGreaterThan(2 * preDamage - 3);
    expect(postDamage).toBeLessThan(2 * preDamage + 3);
  });

  it("should use Defense stat stages during damage calculation", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const bodyPress = allMoves[MoveId.BODY_PRESS];

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, bodyPress);

    game.move.use(MoveId.IRON_DEFENSE);

    await game.toNextTurn();

    const { damage: postDamage } = enemy.getAttackDamage(player, bodyPress);

    expect(postDamage).toBeGreaterThan(2 * preDamage - 3);
    expect(postDamage).toBeLessThan(2 * preDamage + 3);
  });

  it("should only apply Attack stat multipliers from abilities for damage", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const bodyPress = allMoves[MoveId.BODY_PRESS];

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, bodyPress);

    game.override.ability(Abilities.HUSTLE).passiveAbility(Abilities.FUR_COAT);

    const { damage: postDamage } = enemy.getAttackDamage(player, bodyPress);

    expect(postDamage).toBeGreaterThan(1.5 * preDamage - 3);
    expect(postDamage).toBeLessThan(1.5 * preDamage + 3);
  });
});

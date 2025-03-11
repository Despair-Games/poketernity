import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Glaive Rush", () => {
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
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([MoveId.GLAIVE_RUSH])
      .starterSpecies(Species.KLINK)
      .ability(Abilities.BALL_FETCH)
      .moveset([MoveId.SHADOW_SNEAK, MoveId.AVALANCHE, MoveId.SPLASH, MoveId.GLAIVE_RUSH]);
  });

  it("takes double damage from attacks", async () => {
    await game.classicMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.hp = 1000;

    game.move.select(MoveId.SHADOW_SNEAK);
    await game.phaseInterceptor.to("DamageAnimPhase");
    const damageDealt = 1000 - enemy.hp;
    await game.toEndOfTurn();
    game.move.select(MoveId.SHADOW_SNEAK);
    await game.phaseInterceptor.to("DamageAnimPhase");
    expect(enemy.hp).toBeLessThanOrEqual(1001 - damageDealt * 3);
  });

  it("always gets hit by attacks", async () => {
    await game.classicMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.hp = 1000;

    const player = game.scene.getPlayerPokemon()!;
    vi.spyOn(player, "getAccuracyMultiplier").mockReturnValue(0);

    game.move.select(MoveId.AVALANCHE);
    await game.toEndOfTurn();
    expect(enemy.hp).toBeLessThan(1000);
  });

  it("interacts properly with multi-lens", async () => {
    game.override.ability(Abilities.PARENTAL_BOND).enemyMoveset([MoveId.AVALANCHE]);
    await game.classicMode.startBattle();

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    enemy.hp = 1000;
    player.hp = 1000;

    vi.spyOn(enemy, "getAccuracyMultiplier").mockReturnValue(0);

    game.move.select(MoveId.GLAIVE_RUSH);
    await game.toEndOfTurn();
    expect(player.hp).toBeLessThan(1000);
    player.hp = 1000;
    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(player.hp).toBe(1000);
  });

  it("secondary effects only last until next move", async () => {
    game.override.enemyMoveset([MoveId.SHADOW_SNEAK]);
    await game.classicMode.startBattle();

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    enemy.hp = 1000;
    player.hp = 1000;

    vi.spyOn(enemy, "getAccuracyMultiplier").mockReturnValue(0);

    game.move.select(MoveId.GLAIVE_RUSH);
    await game.toEndOfTurn();
    expect(player.hp).toBe(1000);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    const damagedHp = player.hp;
    expect(player.hp).toBeLessThan(1000);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(player.hp).toBe(damagedHp);
  });

  it("secondary effects are removed upon switching", async () => {
    game.override.enemyMoveset([MoveId.SHADOW_SNEAK]).starterSpecies(0);
    await game.classicMode.startBattle([Species.KLINK, Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    enemy.hp = 1000;

    vi.spyOn(enemy, "getAccuracyMultiplier").mockReturnValue(0);

    game.move.select(MoveId.GLAIVE_RUSH);
    await game.toEndOfTurn();
    expect(player.hp).toBe(player.getMaxHp());

    game.doSwitchPokemon(1);
    await game.toEndOfTurn();
    game.doSwitchPokemon(1);
    await game.toEndOfTurn();
    expect(player.hp).toBe(player.getMaxHp());
  });

  it("secondary effects don't activate if move fails", async () => {
    game.override.moveset([MoveId.SHADOW_SNEAK, MoveId.PROTECT, MoveId.SPLASH, MoveId.GLAIVE_RUSH]);
    await game.classicMode.startBattle();

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    enemy.hp = 1000;
    player.hp = 1000;

    game.move.select(MoveId.PROTECT);
    await game.toEndOfTurn();

    game.move.select(MoveId.SHADOW_SNEAK);
    await game.toEndOfTurn();
    game.override.enemyMoveset([MoveId.SPLASH]);
    const damagedHP1 = 1000 - enemy.hp;
    enemy.hp = 1000;

    game.move.select(MoveId.SHADOW_SNEAK);
    await game.toEndOfTurn();
    const damagedHP2 = 1000 - enemy.hp;

    expect(damagedHP2).toBeGreaterThanOrEqual(damagedHP1 * 2 - 1);
  });
});

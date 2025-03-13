import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Battle order", () => {
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
      .enemySpecies(Species.MEWTWO)
      .enemyAbility(Abilities.INSOMNIA)
      .ability(Abilities.INSOMNIA)
      .moveset([MoveId.TACKLE]);
  });

  it("opponent faster than player 50 vs 150", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(playerPokemon, "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 50]); // set playerPokemon's speed to 50
    vi.spyOn(enemyPokemon, "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 150]); // set enemyPokemon's speed to 150
    game.scene.getField(true).forEach((p) => (p.hp = p.getMaxHp()));

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    const { turnManager } = game.scene.currentBattle;
    expect(turnManager.isEmpty()).toBeTruthy();

    const turnOrder = game.field.getTurnOrder();
    expect(turnOrder).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
  });

  it("Player faster than opponent 150 vs 50", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(playerPokemon, "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 150]); // set playerPokemon's speed to 150
    vi.spyOn(enemyPokemon, "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 50]); // set enemyPokemon's speed to 50
    game.scene.getField(true).forEach((p) => (p.hp = p.getMaxHp()));

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    const turnOrder = game.field.getTurnOrder();
    expect(turnOrder).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
  });

  it("double - both opponents faster than player 50/50 vs 150/150", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.BULBASAUR, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    playerPokemon.forEach((p) => vi.spyOn(p, "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 50])); // set both playerPokemons' speed to 50
    enemyPokemon.forEach((p) => vi.spyOn(p, "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 150])); // set both enemyPokemons' speed to 150
    game.scene.getField(true).forEach((p) => (p.hp = p.getMaxHp()));

    game.move.select(MoveId.TACKLE);
    game.move.select(MoveId.TACKLE, 1);
    await game.toEndOfTurn();

    const turnOrder = game.field.getTurnOrder();
    enemyPokemon.forEach((p) => expect(turnOrder.slice(0, 2)).toContain(p.getBattlerIndex()));
    playerPokemon.forEach((p) => expect(turnOrder.slice(2)).toContain(p.getBattlerIndex()));
  });

  it("double - speed tie except 1 - 100/100 vs 100/150", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.BULBASAUR, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();
    playerPokemon.forEach((p) => vi.spyOn(p, "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 100])); //set both playerPokemons' speed to 100
    vi.spyOn(enemyPokemon[0], "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 100]); // set enemyPokemon's speed to 100
    vi.spyOn(enemyPokemon[1], "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 150]); // set enemyPokemon's speed to 150
    game.scene.getField(true).forEach((p) => (p.hp = p.getMaxHp()));

    game.move.select(MoveId.TACKLE);
    game.move.select(MoveId.TACKLE, 1);

    await game.toEndOfTurn();

    const turnOrder = game.field.getTurnOrder();
    expect(turnOrder).toHaveLength(4);
    expect(turnOrder[0]).toBe(BattlerIndex.ENEMY_2);
  });

  it("double - speed tie 100/150 vs 100/150", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.BULBASAUR, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();
    vi.spyOn(playerPokemon[0], "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 100]); // set one playerPokemon's speed to 100
    vi.spyOn(playerPokemon[1], "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 150]); // set other playerPokemon's speed to 150
    vi.spyOn(enemyPokemon[0], "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 100]); // set one enemyPokemon's speed to 100
    vi.spyOn(enemyPokemon[1], "stats", "get").mockReturnValue([100, 20, 20, 20, 20, 150]); // set other enemyPokemon's speed to 150
    game.scene.getField(true).forEach((p) => (p.hp = p.getMaxHp()));

    game.move.select(MoveId.TACKLE);
    game.move.select(MoveId.TACKLE, 1);

    await game.toEndOfTurn();

    const turnOrder = game.field.getTurnOrder();
    expect(turnOrder).toHaveLength(4);
    [BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2].forEach((i) => expect(turnOrder.slice(0, 2)).toContain(i));
    [BattlerIndex.PLAYER, BattlerIndex.ENEMY].forEach((i) => expect(turnOrder.slice(2)).toContain(i));
  });
});

import { Stat } from "#enums/stat";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";

describe("Moves - Tailwind", () => {
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
      .battleType("double")
      .moveset([MoveId.TAILWIND, MoveId.SPLASH, MoveId.PETAL_BLIZZARD, MoveId.SANDSTORM])
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(Abilities.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("doubles the Speed stat of the Pokemon on its side", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP, Species.MEOWTH]);
    const magikarp = game.scene.getPlayerField()[0];
    const meowth = game.scene.getPlayerField()[1];

    const magikarpSpd = magikarp.getStat(Stat.SPD);
    const meowthSpd = meowth.getStat(Stat.SPD);

    expect(magikarp.getEffectiveStat(Stat.SPD)).equal(magikarpSpd);
    expect(meowth.getEffectiveStat(Stat.SPD)).equal(meowthSpd);

    game.move.select(MoveId.TAILWIND);
    game.move.select(MoveId.SPLASH, 1);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(magikarp.getEffectiveStat(Stat.SPD)).toBe(magikarpSpd * 2);
    expect(meowth.getEffectiveStat(Stat.SPD)).toBe(meowthSpd * 2);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.PLAYER)).toBeDefined();
  });

  it("lasts for 4 turns", async () => {
    game.override.battleType("single");

    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.select(MoveId.TAILWIND);
    await game.toNextTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.PLAYER)).toBeDefined();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.PLAYER)).toBeDefined();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.PLAYER)).toBeDefined();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.PLAYER)).toBeUndefined();
  });

  it("does not affect the opposing side", async () => {
    game.override.battleType("single");

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const ally = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    const allySpd = ally.getStat(Stat.SPD);
    const enemySpd = enemy.getStat(Stat.SPD);

    expect(ally.getEffectiveStat(Stat.SPD)).equal(allySpd);
    expect(enemy.getEffectiveStat(Stat.SPD)).equal(enemySpd);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.PLAYER)).toBeUndefined();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.ENEMY)).toBeUndefined();

    game.move.select(MoveId.TAILWIND);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(ally.getEffectiveStat(Stat.SPD)).toBe(allySpd * 2);
    expect(enemy.getEffectiveStat(Stat.SPD)).equal(enemySpd);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.TAILWIND, ArenaTagSide.ENEMY)).toBeUndefined();
  });

  it("modifies turn order on the turn it is set", async () => {
    game.override.battleType("double").enemySpecies(Species.EXCADRILL).ability(Abilities.PRANKSTER);

    await game.classicMode.startBattle([Species.WHIMSICOTT, Species.URSALUNA]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    playerPokemon[0].setStat(Stat.SPD, 100);
    playerPokemon[1].setStat(Stat.SPD, 50);
    enemyPokemon.forEach((p) => p.setStat(Stat.SPD, 80));

    game.move.use(MoveId.TACKLE, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.TACKLE, 1, BattlerIndex.ENEMY_2);

    await game.toEndOfTurn();

    const firstTurnOrder = game.field.getTurnOrder();
    // Ursaluna should be last in the turn order without Tailwind
    expect(firstTurnOrder.at(-1)).toBe(BattlerIndex.PLAYER_2);

    await game.toNextTurn();

    game.move.use(MoveId.TAILWIND, 0);
    game.move.use(MoveId.TACKLE, 1, BattlerIndex.ENEMY);

    await game.toEndOfTurn();

    const secondTurnOrder = game.field.getTurnOrder();

    expect(secondTurnOrder).not.toEqual(firstTurnOrder);
    expect(secondTurnOrder[0]).toBe(BattlerIndex.PLAYER);
    expect(secondTurnOrder[1]).toBe(BattlerIndex.PLAYER_2);
  });
});

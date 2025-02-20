import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { Abilities } from "#enums/abilities";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Tar Shot", () => {
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
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(Species.TANGELA)
      .enemyLevel(1000)
      .moveset([MoveId.TAR_SHOT, MoveId.FIRE_PUNCH])
      .disableCrits();
  });

  it("lowers the target's Speed stat by one stage and doubles the effectiveness of Fire-type moves used on the target", async () => {
    await game.classicMode.startBattle([Species.PIKACHU]);

    const enemy = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.TAR_SHOT);

    await game.toEndOfTurn();
    expect(enemy.getStatStage(Stat.SPD)).toBe(-1);

    await game.toNextTurn();

    game.move.select(MoveId.FIRE_PUNCH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getMoveEffectiveness).toHaveReturnedWith(4);
  });

  it("will not double the effectiveness of Fire-type moves used on a target that is already under the effect of Tar Shot (but may still lower its Speed)", async () => {
    await game.classicMode.startBattle([Species.PIKACHU]);

    const enemy = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.TAR_SHOT);

    await game.toEndOfTurn();
    expect(enemy.getStatStage(Stat.SPD)).toBe(-1);

    await game.toNextTurn();

    game.move.select(MoveId.TAR_SHOT);

    await game.toEndOfTurn();
    expect(enemy.getStatStage(Stat.SPD)).toBe(-2);

    await game.toNextTurn();

    game.move.select(MoveId.FIRE_PUNCH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getMoveEffectiveness).toHaveReturnedWith(4);
  });

  it("does not double the effectiveness of Fire-type moves against a Pokémon that is Terastallized", async () => {
    game.override.enemyHeldItems([{ name: "TERA_SHARD", type: ElementalType.GRASS }]).enemySpecies(Species.SPRIGATITO);
    await game.classicMode.startBattle([Species.PIKACHU]);

    const enemy = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.TAR_SHOT);

    await game.toEndOfTurn();
    expect(enemy.getStatStage(Stat.SPD)).toBe(-1);

    await game.toNextTurn();

    game.move.select(MoveId.FIRE_PUNCH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getMoveEffectiveness).toHaveReturnedWith(2);
  });

  it("doubles the effectiveness of Fire-type moves against a Pokémon that is already under the effects of Tar Shot before it Terastallized", async () => {
    game.override.enemySpecies(Species.SPRIGATITO);
    await game.classicMode.startBattle([Species.PIKACHU]);

    const enemy = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.TAR_SHOT);

    await game.toEndOfTurn();
    expect(enemy.getStatStage(Stat.SPD)).toBe(-1);

    await game.toNextTurn();

    game.override.enemyHeldItems([{ name: "TERA_SHARD", type: ElementalType.GRASS }]);

    game.move.select(MoveId.FIRE_PUNCH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getMoveEffectiveness).toHaveReturnedWith(4);
  });
});

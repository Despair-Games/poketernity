import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { BATTLE_STATS, EFFECTIVE_STATS, Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

// TODO: Add more tests once Transform is fully implemented
describe("Moves - Transform", () => {
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
    game.override //
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyLevel(200);
  });

  it("should copy species, ability, gender, all stats except HP, all stat stages, moveset, and types of target", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.changeMoveset(enemy, MoveId.SPLASH);

    game.move.use(MoveId.TRANSFORM);
    await game.toEndOfTurn();

    expect(player.getSpeciesForm().speciesId).toBe(enemy.getSpeciesForm().speciesId);
    expect(player.getAbility()).toBe(enemy.getAbility());
    expect(player.getGender()).toBe(enemy.getGender());

    expect(player.getStat(Stat.HP, false)).not.toBe(enemy.getStat(Stat.HP));
    for (const s of EFFECTIVE_STATS) {
      expect(player.getStat(s, false)).toBe(enemy.getStat(s, false));
    }

    for (const s of BATTLE_STATS) {
      expect(player.getStatStage(s)).toBe(enemy.getStatStage(s));
    }

    const playerMoveset = player.getMoveset();
    const enemyMoveset = player.getMoveset();

    expect(playerMoveset.length).toBe(enemyMoveset.length);
    for (let i = 0; i < playerMoveset.length && i < enemyMoveset.length; i++) {
      expect(playerMoveset[i]?.moveId).toBe(enemyMoveset[i]?.moveId);
    }

    const playerTypes = player.getTypes();
    const enemyTypes = enemy.getTypes();

    expect(playerTypes.length).toBe(enemyTypes.length);
    for (let i = 0; i < playerTypes.length && i < enemyTypes.length; i++) {
      expect(playerTypes[i]).toBe(enemyTypes[i]);
    }
  });

  it("should copy in-battle overridden stats", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.changeMoveset(enemy, MoveId.POWER_SPLIT);

    const avgAtk = Math.floor((player.getStat(Stat.ATK, false) + enemy.getStat(Stat.ATK, false)) / 2);
    const avgSpAtk = Math.floor((player.getStat(Stat.SPATK, false) + enemy.getStat(Stat.SPATK, false)) / 2);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.use(MoveId.TRANSFORM);
    await game.toEndOfTurn();

    expect(player.getStat(Stat.ATK, false)).toBe(avgAtk);
    expect(enemy.getStat(Stat.ATK, false)).toBe(avgAtk);

    expect(player.getStat(Stat.SPATK, false)).toBe(avgSpAtk);
    expect(enemy.getStat(Stat.SPATK, false)).toBe(avgSpAtk);
  });

  it("should set each move's pp to a maximum of 5", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.changeMoveset(enemy, [MoveId.SWORDS_DANCE, MoveId.GROWL, MoveId.SKETCH, MoveId.RECOVER]);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.TRANSFORM);
    await game.phaseInterceptor.to("PostActionPhase");

    const moveset = player.getMoveset();
    const playerMovesetNames = moveset.map((m) => m.name);
    const enemyMovesetNames = enemy.getMoveset().map((m) => m.name);
    expect(moveset, `Player moveset: ${playerMovesetNames} | Enemy moveset: ${enemyMovesetNames}`).toHaveLength(4);

    for (const move of moveset) {
      // Should set correct maximum PP without touching `ppUp`
      if (move.moveId === MoveId.SKETCH) {
        expect(move.getMovePp()).toBe(1);
      } else {
        expect(move.getMovePp()).toBe(5);
      }
      expect(move.ppUp).toBe(0);
    }
  });

  it("should persist transformed attributes across reloads", async () => {
    game.override.enemySpecies(SpeciesId.UNOWN).enemyForms({ [SpeciesId.UNOWN]: 5 });
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.changeMoveset(player, MoveId.TRANSFORM);
    game.move.changeMoveset(enemy, MoveId.MEMENTO);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.select(MoveId.TRANSFORM);
    await game.move.selectEnemyMove(MoveId.MEMENTO);
    await game.toNextWave();

    expect(game.scene.phaseManager.getCurrentPhase()?.phaseName).toBe("CommandPhase");
    expect(game.scene.currentBattle.waveIndex).toBe(2);

    await game.reload.reloadSession();

    const playerReloaded = game.field.getPlayerPokemon();
    const moveset = playerReloaded.getMoveset();
    const speciesForm = playerReloaded.getSpeciesForm();

    expect(speciesForm.speciesId).toBe(enemy.getSpeciesForm().speciesId);
    expect(speciesForm.formIndex).toBe(enemy.getSpeciesForm().formIndex);
    expect(playerReloaded.getAbility()).toBe(enemy.getAbility());
    expect(playerReloaded.getGender()).toBe(enemy.getGender());

    expect(playerReloaded.getStat(Stat.HP, false)).not.toBe(enemy.getStat(Stat.HP));
    for (const s of EFFECTIVE_STATS) {
      expect(playerReloaded.getStat(s, false)).toBe(enemy.getStat(s, false));
    }

    expect(moveset).toHaveLength(1);
    expect(moveset[0]?.moveId).toBe(MoveId.MEMENTO);
  });
});

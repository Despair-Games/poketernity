import { AbilityId } from "#enums/ability-id";
import { BattleCommand } from "#enums/battle-command";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import type { CommandPhase } from "#phases/command-phase";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// TODO: https://github.com/pagefaultgames/pokerogue/pull/5381
describe.todo("Abilities - Neutralizing Gas", () => {
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
      .ability(AbilityId.NEUTRALIZING_GAS)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should prevent other abilities from activating", async () => {
    game.override.enemyAbility(AbilityId.INTIMIDATE);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    // Intimidate is suppressed, so the attack stat should not be lowered
    expect(game.field.getPlayerPokemon()).toHaveStatStage(Stat.ATK, 0);
  });

  it("should allow the user's passive to activate", async () => {
    game.override.passiveAbility(AbilityId.INTREPID_SWORD);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon()).toHaveStatStage(Stat.ATK, 1);
  });

  // TODO: https://github.com/Despair-Games/poketernity/issues/1211
  it.todo("should activate before other abilities", async () => {
    game.override.enemySpecies(SpeciesId.ACCELGOR).enemyLevel(100).enemyAbility(AbilityId.INTIMIDATE);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    // Intimidate is suppressed even when the user's speed is lower
    expect(game.field.getPlayerPokemon()).toHaveStatStage(Stat.ATK, 0);
  });

  it("should activate other abilities when removed", async () => {
    game.override
      .enemyAbility(AbilityId.INTREPID_SWORD)
      .enemyPassiveAbility(AbilityId.DAUNTLESS_SHIELD)
      .enemyMoveset(MoveId.ENTRAINMENT);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon).toHaveStatStage(Stat.ATK, 0);
    expect(enemyPokemon).toHaveStatStage(Stat.DEF, 0);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    // Enemy removes user's ability, so both abilities are activated
    expect(enemyPokemon).toHaveStatStage(Stat.ATK, 1);
    expect(enemyPokemon).toHaveStatStage(Stat.DEF, 1);
  });

  it("should not activate the user's other ability when removed", async () => {
    game.override.passiveAbility(AbilityId.INTIMIDATE).enemyMoveset(MoveId.ENTRAINMENT);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    // Neutralising gas user's passive is still active
    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon).toHaveStatStage(Stat.ATK, -1);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    // Intimidate did not reactivate after neutralizing gas was removed
    expect(enemyPokemon).toHaveStatStage(Stat.ATK, -1);
  });

  it("should only deactivate when all setters are off the field", async () => {
    game.override.enemyMoveset([MoveId.ENTRAINMENT, MoveId.SPLASH]).battleType("double");
    await game.classicMode.startBattle(SpeciesId.ACCELGOR, SpeciesId.ACCELGOR);

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.SPLASH, 1);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.move.selectEnemyMove(MoveId.ENTRAINMENT, BattlerIndex.PLAYER);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();
    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeDefined(); // Now one neut gas user is left

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.SPLASH, 1);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.move.selectEnemyMove(MoveId.ENTRAINMENT, BattlerIndex.PLAYER_2);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();
    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeUndefined(); // No neut gas users are left
  });

  it("should deactivate when suppressed by gastro acid", async () => {
    game.override.enemyMoveset(MoveId.GASTRO_ACID);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeUndefined();
  });

  it("should deactivate when the pokemon faints", async () => {
    game.override.ability(AbilityId.BALL_FETCH).enemyAbility(AbilityId.NEUTRALIZING_GAS);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    game.move.select(MoveId.SPLASH);
    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeDefined();
    // await game.doKillOpponents();

    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeUndefined();
  });

  it("should deactivate upon catching a wild pokemon", async () => {
    game.override.battleType("single").enemyAbility(AbilityId.NEUTRALIZING_GAS).ability(AbilityId.BALL_FETCH);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeDefined();

    game.scene.pokeballCounts[PokeballType.MASTER_BALL] = 1;
    // game.doThrowPokeball(PokeballType.MASTER_BALL);
    await game.toEndOfTurn();

    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeUndefined();
  });

  it("should deactivate after fleeing from a wild pokemon", async () => {
    game.override.enemyAbility(AbilityId.NEUTRALIZING_GAS).ability(AbilityId.BALL_FETCH);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeDefined();

    // vi.spyOn(game.field.getPlayerPokemon(), "randBattleSeedInt").mockReturnValue(0);

    // TODO: add currentphase helper that `expect`s the correct phase
    const commandPhase = game.scene.phaseManager.getCurrentPhase<CommandPhase>();
    expect(commandPhase.phaseName).toBe("CommandPhase");
    commandPhase.handleCommand(BattleCommand.RUN, 0);
    await game.toEndOfTurn();

    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeUndefined();
  });

  it("should not activate abilities of pokemon no longer on the field", async () => {
    game.override.battleType("single").ability(AbilityId.NEUTRALIZING_GAS).enemyAbility(AbilityId.DELTA_STREAM);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.scene.getEnemyPokemon()!;
    const weatherChangeAttr = enemy.getAbilityAttrs("PostWeatherChangeAbAttr", false)[0];
    vi.spyOn(weatherChangeAttr, "apply");

    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeDefined();

    game.move.select(MoveId.SPLASH);
    // await game.killPokemon(enemy);
    // await game.killPokemon(game.field.getPlayerPokemon());

    // expect(game.scene.arena.getTag(ArenaTagType.NEUTRALIZING_GAS)).toBeUndefined();
    expect(weatherChangeAttr.apply).not.toHaveBeenCalled();
  });
});

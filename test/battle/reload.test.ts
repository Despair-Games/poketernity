import { GameModes } from "#enums/game-modes";
import { api } from "#app/plugins/api/api";
import { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "#enums/buttons";
import { UiMode } from "#enums/ui-mode";
import { StatusEffect } from "#enums/status-effect";

describe("Reload", () => {
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

  beforeEach(async () => {
    game = new GameManager(phaserGame);
    vi.spyOn(api, "getGameTitleStats").mockResolvedValue({ battleCount: -1, playerCount: -1 });
    vi.spyOn(api.daily, "getSeed").mockResolvedValue("test-seed");
    await api.ping();
  });

  it("should not have RNG inconsistencies in a Classic run", async () => {
    await game.classicMode.startBattle();

    const preReloadRngState = Phaser.Math.RND.state();

    await game.reload.reloadSession();

    const postReloadRngState = Phaser.Math.RND.state();

    expect(preReloadRngState).toBe(postReloadRngState);
  });

  it("should not have RNG inconsistencies after a biome switch", async () => {
    game.override
      .startingWave(10)
      .battleType("single")
      .startingLevel(100) // Avoid levelling up
      .disableTrainerWaves()
      .moveset([MoveId.SPLASH])
      .enemyMoveset(MoveId.SPLASH);
    await game.dailyMode.startBattle();

    // Transition from Wave 10 to Wave 11 in order to trigger biome switch
    game.move.select(MoveId.SPLASH);
    game.onNextPrompt("SelectBiomePhase", UiMode.OPTION_SELECT, () => {
      // Input first option for Map
      game.scene.ui.getHandler().processInput(Button.ACTION);
    });
    await game.doKillOpponents();
    await game.toNextWave();
    expect(game.phaseInterceptor.log).toContain("NewBiomeEncounterPhase");

    const preReloadRngState = Phaser.Math.RND.state();

    await game.reload.reloadSession();

    const postReloadRngState = Phaser.Math.RND.state();

    expect(preReloadRngState).toBe(postReloadRngState);
  });

  it("should not have weather inconsistencies after a biome switch", async () => {
    game.override
      .startingWave(10)
      .startingBiome(Biome.ICE_CAVE) // Will lead to Snowy Forest with randomly generated weather
      .battleType("single")
      .startingLevel(100) // Avoid levelling up
      .disableTrainerWaves()
      .moveset([MoveId.SPLASH])
      .enemyMoveset(MoveId.SPLASH);
    await game.classicMode.startBattle(); // Apparently daily mode would override the biome

    // Transition from Wave 10 to Wave 11 in order to trigger biome switch
    game.move.select(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.toNextWave();
    expect(game.phaseInterceptor.log).toContain("NewBiomeEncounterPhase");

    const preReloadWeather = game.scene.arena.weather;

    await game.reload.reloadSession();

    const postReloadWeather = game.scene.arena.weather;

    expect(postReloadWeather).toStrictEqual(preReloadWeather);
  });

  it("should not have RNG inconsistencies at a Daily run wild Pokemon fight", async () => {
    await game.dailyMode.startBattle();

    const preReloadRngState = Phaser.Math.RND.state();

    await game.reload.reloadSession();

    const postReloadRngState = Phaser.Math.RND.state();

    expect(preReloadRngState).toBe(postReloadRngState);
  });

  it("should not have RNG inconsistencies at a Daily run double battle", async () => {
    game.override.battleType("double");
    await game.dailyMode.startBattle();

    const preReloadRngState = Phaser.Math.RND.state();

    await game.reload.reloadSession();

    const postReloadRngState = Phaser.Math.RND.state();

    expect(preReloadRngState).toBe(postReloadRngState);
  });

  it("should not have RNG inconsistencies at a Daily run Gym Leader fight", async () => {
    game.override.battleType("single").startingWave(40);
    await game.dailyMode.startBattle();

    const preReloadRngState = Phaser.Math.RND.state();

    await game.reload.reloadSession();

    const postReloadRngState = Phaser.Math.RND.state();

    expect(preReloadRngState).toBe(postReloadRngState);
  });

  it("should not have RNG inconsistencies at a Daily run regular trainer fight", async () => {
    game.override.battleType("single").startingWave(45);
    await game.dailyMode.startBattle();

    const preReloadRngState = Phaser.Math.RND.state();

    await game.reload.reloadSession();

    const postReloadRngState = Phaser.Math.RND.state();

    expect(preReloadRngState).toBe(postReloadRngState);
  });

  it("should not have RNG inconsistencies at a Daily run wave 50 Boss fight", async () => {
    game.override.battleType("single").startingWave(50);
    await game.runToFinalBossEncounter([Species.BULBASAUR], GameModes.DAILY);

    const preReloadRngState = Phaser.Math.RND.state();

    await game.reload.reloadSession();

    const postReloadRngState = Phaser.Math.RND.state();

    expect(preReloadRngState).toBe(postReloadRngState);
  });

  it("should save status effects properly", async () => {
    game.override.battleType("single").enemySpecies(Species.MAREANIE).enemyMoveset(MoveId.TOXIC);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.toNextWave();

    expect(game.field.getPlayerPokemon().getStatusEffect(true)).toBe(StatusEffect.TOXIC);

    await game.reload.reloadSession();

    const newPokemon = game.field.getPlayerPokemon();
    expect(newPokemon.getStatusEffect(true)).toBe(StatusEffect.TOXIC);
    expect(newPokemon.status?.toxicTurnCount).toBe(2);
  });
});

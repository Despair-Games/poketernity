import { Stat } from "#enums/stat";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { CommandPhase } from "#app/phases/command-phase";
import { Command } from "#app/ui/command-ui-handler";
import { AttemptRunPhase } from "#app/phases/attempt-run-phase";

describe("Abilities - Speed Boost", () => {
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

    game.overridesHelper
      .battleType("single")
      .enemySpecies(Species.SHUCKLE)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyLevel(100)
      .ability(Abilities.SPEED_BOOST)
      .enemyMoveset(Moves.SPLASH)
      .moveset([Moves.SPLASH, Moves.U_TURN]);
  });

  it("should increase speed by 1 stage at end of turn", async () => {
    await game.classicModeHelper.startBattle();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(1);
  });

  it("should not trigger this turn if pokemon was switched into combat via attack, but the turn after", async () => {
    await game.classicModeHelper.startBattle([Species.SHUCKLE, Species.NINJASK]);

    game.moveHelper.select(Moves.U_TURN);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();
    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(0);

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(1);
  });

  it("checking back to back swtiches", async () => {
    await game.classicModeHelper.startBattle([Species.SHUCKLE, Species.NINJASK]);

    const [shuckle, ninjask] = game.scene.getPlayerParty();

    game.moveHelper.select(Moves.U_TURN);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();
    expect(game.scene.getPlayerPokemon()!).toBe(ninjask);
    expect(ninjask.getStatStage(Stat.SPD)).toBe(0);

    game.moveHelper.select(Moves.U_TURN);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();
    expect(game.scene.getPlayerPokemon()!).toBe(shuckle);
    expect(shuckle.getStatStage(Stat.SPD)).toBe(0);

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();
    expect(shuckle.getStatStage(Stat.SPD)).toBe(1);
  });

  it("should not trigger this turn if pokemon was switched into combat via normal switch, but the turn after", async () => {
    await game.classicModeHelper.startBattle([Species.SHUCKLE, Species.NINJASK]);

    game.doSwitchPokemon(1);
    await game.toNextTurn();
    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(0);

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(1);
  });

  it("should not trigger if pokemon fails to escape", async () => {
    await game.classicModeHelper.startBattle([Species.SHUCKLE]);

    const commandPhase = game.scene.getCurrentPhase() as CommandPhase;
    commandPhase.handleCommand(Command.RUN, 0);
    const runPhase = game.scene.getCurrentPhase() as AttemptRunPhase;
    runPhase.forceFailEscape = true;
    await game.phaseInterceptor.to(AttemptRunPhase);
    await game.toNextTurn();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(0);

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(1);
  });
});

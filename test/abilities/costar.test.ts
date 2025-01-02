import { Stat } from "#enums/stat";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { CommandPhase } from "#app/phases/command-phase";
import { MessagePhase } from "#app/phases/message-phase";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Abilities - COSTAR", () => {
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
    game.overridesHelper.battleType("double");
    game.overridesHelper.ability(Abilities.COSTAR);
    game.overridesHelper.moveset([Moves.SPLASH, Moves.NASTY_PLOT]);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
  });

  test("ability copies positive stat stages", async () => {
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);

    await game.startBattle([Species.MAGIKARP, Species.MAGIKARP, Species.FLAMIGO]);

    let [leftPokemon, rightPokemon] = game.scene.getPlayerField();

    game.moveHelper.select(Moves.NASTY_PLOT);
    await game.phaseInterceptor.to(CommandPhase);
    game.moveHelper.select(Moves.SPLASH, 1);
    await game.toNextTurn();

    expect(leftPokemon.getStatStage(Stat.SPATK)).toBe(2);
    expect(rightPokemon.getStatStage(Stat.SPATK)).toBe(0);

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(CommandPhase);
    game.doSwitchPokemon(2);
    await game.phaseInterceptor.to(MessagePhase);

    [leftPokemon, rightPokemon] = game.scene.getPlayerField();
    expect(leftPokemon.getStatStage(Stat.SPATK)).toBe(2);
    expect(rightPokemon.getStatStage(Stat.SPATK)).toBe(2);
  });

  test("ability copies negative stat stages", async () => {
    game.overridesHelper.enemyAbility(Abilities.INTIMIDATE);

    await game.startBattle([Species.MAGIKARP, Species.MAGIKARP, Species.FLAMIGO]);

    let [leftPokemon, rightPokemon] = game.scene.getPlayerField();

    expect(leftPokemon.getStatStage(Stat.ATK)).toBe(-2);
    expect(leftPokemon.getStatStage(Stat.ATK)).toBe(-2);

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(CommandPhase);
    game.doSwitchPokemon(2);
    await game.phaseInterceptor.to(MessagePhase);

    [leftPokemon, rightPokemon] = game.scene.getPlayerField();
    expect(leftPokemon.getStatStage(Stat.ATK)).toBe(-2);
    expect(rightPokemon.getStatStage(Stat.ATK)).toBe(-2);
  });
});

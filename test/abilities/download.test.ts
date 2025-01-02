import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Download", () => {
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
      .moveset([Moves.SPLASH])
      .ability(Abilities.DOWNLOAD)
      .battleType("single")
      .disableCrits()
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should boost special attack if the enemy's defense is higher", async () => {
    game.overridesHelper.enemySpecies(Species.STEELIX);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to("TurnStartPhase");

    expect(player.getStatStage(Stat.SPATK)).toBe(1);
  });

  it("should boost attack if the enemy's special defense is higher", async () => {
    game.overridesHelper.enemySpecies(Species.REGICE);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to("TurnStartPhase");

    expect(player.getStatStage(Stat.ATK)).toBe(1);
  });
});

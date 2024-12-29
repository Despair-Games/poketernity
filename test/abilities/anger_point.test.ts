import { BattlerIndex } from "#app/battle";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Anger Point", () => {
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
      .startingLevel(10)
      .moveset([Moves.SPLASH, Moves.SUBSTITUTE])
      .ability(Abilities.ANGER_POINT)
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.STORM_THROW);
  });

  it("should maximize the ability holder's attack if it receives a critical hit", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.getStatStage(Stat.ATK)).toBe(6);
  });

  it("should not maximize the ability holder's attack if its substitute receives a critical hit", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.SUBSTITUTE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.getStatStage(Stat.ATK)).toBe(0);
  });
});

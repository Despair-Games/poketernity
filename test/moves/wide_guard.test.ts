import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { GameManager } from "#test/testUtils/gameManager";
import { Species } from "#enums/species";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Stat } from "#enums/stat";

describe("Moves - Wide Guard", () => {
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
      .enemySpecies(Species.SNORLAX)
      .enemyMoveset([Moves.SWIFT])
      .enemyAbility(Abilities.INSOMNIA)
      .startingLevel(100)
      .enemyLevel(100);
  });

  test("should protect the user and allies from multi-target attack moves", async () => {
    await game.classicMode.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerField();

    game.move.useMove(Moves.WIDE_GUARD);
    game.move.useMove(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    leadPokemon.forEach((p) => expect(p.hp).toBe(p.getMaxHp()));
  });

  test("should protect the user and allies from multi-target status moves", async () => {
    game.override.enemyMoveset([Moves.GROWL]);

    await game.classicMode.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerField();

    game.move.useMove(Moves.WIDE_GUARD);
    game.move.useMove(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    leadPokemon.forEach((p) => expect(p.getStatStage(Stat.ATK)).toBe(0));
  });

  test("should not protect the user and allies from single-target moves", async () => {
    game.override.enemyMoveset([Moves.TACKLE]);

    await game.classicMode.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerField();

    game.move.useMove(Moves.WIDE_GUARD);
    game.move.useMove(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.some((p) => p.hp < p.getMaxHp())).toBeTruthy();
  });

  test("should protect the user from its ally's multi-target move", async () => {
    game.override.enemyMoveset([Moves.SPLASH]);

    await game.classicMode.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.move.useMove(Moves.WIDE_GUARD);
    game.move.useMove(Moves.SURF, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon[0].hp).toBe(leadPokemon[0].getMaxHp());
    enemyPokemon.forEach((p) => expect(p.hp).toBeLessThan(p.getMaxHp()));
  });
});

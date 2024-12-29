import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Thick Fat", () => {
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
      .moveset([Moves.FIRE_FANG, Moves.ICE_FANG, Moves.EMBER, Moves.ICE_BEAM])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.THICK_FAT)
      .enemyMoveset(Moves.SPLASH);
  });

  it.each([
    { move: Moves.FIRE_FANG, type: "fire" },
    { move: Moves.ICE_FANG, type: "ice" },
  ])("should reduce the attacker's attack by 50% if it is using a physical $type-type move", async ({ move }) => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(pokemon, "getEffectiveStat");

    game.move.select(move);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    console.log(pokemon.stats);
    expect(pokemon.getEffectiveStat).toHaveReturnedWith(Math.floor(pokemon.stats[Stat.ATK] / 2));
  });
});

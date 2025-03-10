import { allMoves } from "#app/data/data-lists";
import { MetronomeAttr } from "#app/data/move-attrs/metronome-attr";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Moongeist Beam", () => {
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
      .moveset([MoveId.MOONGEIST_BEAM, MoveId.METRONOME])
      .ability(Abilities.BALL_FETCH)
      .startingLevel(200)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.STURDY)
      .enemyMoveset(MoveId.SPLASH);
  });

  // Also covers Photon Geyser and Sunsteel Strike
  it("should ignore enemy abilities", async () => {
    await game.classicMode.startBattle([Species.MILOTIC]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.MOONGEIST_BEAM);
    await game.toEndOfTurn();

    expect(enemy.isFainted()).toBe(true);
  });

  // Also covers Photon Geyser and Sunsteel Strike
  it("should not ignore enemy abilities when called by another move, such as metronome", async () => {
    await game.classicMode.startBattle([Species.MILOTIC]);
    vi.spyOn(allMoves.get(MoveId.METRONOME).getAttrs(MetronomeAttr)[0], "getRandomMove").mockReturnValue(
      MoveId.MOONGEIST_BEAM,
    );

    game.move.select(MoveId.METRONOME);
    await game.toEndOfTurn();

    expect(game.scene.getEnemyPokemon()!.isFainted()).toBe(false);
    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0].move.id).toBe(MoveId.MOONGEIST_BEAM);
  });
});

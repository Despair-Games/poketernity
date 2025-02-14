import { allMoves } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Super Luck", () => {
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
      .moveset([MoveId.TACKLE, MoveId.RAZOR_LEAF])
      .ability(Abilities.SUPER_LUCK)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should boost the ability holder's critical stage by 1", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();

    expect(playerPokemon.getCritStage(playerPokemon, allMoves[MoveId.TACKLE])).toBe(1);
    expect(playerPokemon.getCritStage(playerPokemon, allMoves[MoveId.RAZOR_LEAF])).toBe(2);
  });
});

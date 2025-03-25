import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
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
      .ability(AbilityId.SUPER_LUCK)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should boost the ability holder's critical stage by 1", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();

    expect(playerPokemon.getCritStage(playerPokemon, allMoves.get(MoveId.TACKLE))).toBe(1);
    expect(playerPokemon.getCritStage(playerPokemon, allMoves.get(MoveId.RAZOR_LEAF))).toBe(2);
  });
});

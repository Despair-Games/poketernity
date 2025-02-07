import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { ElementalType } from "#enums/elemental-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Reflect Type", () => {
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
    game.override.ability(Abilities.BALL_FETCH).battleType("single").disableCrits().enemyAbility(Abilities.BALL_FETCH);
  });

  it("will make the user Normal/Grass if targetting a typeless Pokemon affected by Forest's Curse", async () => {
    game.override
      .moveset([MoveId.FORESTS_CURSE, MoveId.REFLECT_TYPE])
      .startingLevel(60)
      .enemySpecies(Species.CHARMANDER)
      .enemyMoveset([MoveId.BURN_UP, MoveId.SPLASH]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    const enemyPokemon = game.scene.getEnemyPokemon();

    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.BURN_UP);
    await game.toNextTurn();

    game.move.select(MoveId.FORESTS_CURSE);
    await game.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    expect(enemyPokemon?.getTypes().includes(ElementalType.UNKNOWN)).toBe(true);
    expect(enemyPokemon?.getTypes().includes(ElementalType.GRASS)).toBe(true);

    game.move.select(MoveId.REFLECT_TYPE);
    await game.forceEnemyMove(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(playerPokemon?.getTypes()[0]).toBe(ElementalType.NORMAL);
    expect(playerPokemon?.getTypes().includes(ElementalType.GRASS)).toBe(true);
  });
});

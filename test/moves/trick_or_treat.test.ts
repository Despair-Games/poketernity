import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { ElementalType } from "#enums/elemental-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Trick Or Treat", () => {
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
      .moveset([MoveId.FORESTS_CURSE, MoveId.TRICK_OR_TREAT])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("will replace added type from Forest's Curse", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon();
    game.move.select(MoveId.FORESTS_CURSE);
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(enemyPokemon!.summonData.addedType).toBe(ElementalType.GRASS);

    game.move.select(MoveId.TRICK_OR_TREAT);
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(enemyPokemon?.summonData.addedType).toBe(ElementalType.GHOST);
  });
});

import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
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
    game.override
      .moveset([MoveId.SPLASH])
      .ability(AbilityId.DOWNLOAD)
      .battleType("single")
      .disableCrits()
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should boost special attack if the enemy's defense is higher", async () => {
    game.override.enemySpecies(SpeciesId.STEELIX);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnStartPhase");

    expect(player.getStatStage(Stat.SPATK)).toBe(1);
  });

  it("should boost attack if the enemy's special defense is higher", async () => {
    game.override.enemySpecies(SpeciesId.REGICE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnStartPhase");

    expect(player.getStatStage(Stat.ATK)).toBe(1);
  });
});

import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Smack Down", () => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SPORE, MoveId.SPLASH, MoveId.TACKLE])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be strongly preferred over low-impact moves", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.SPORE);
  });

  it("should be preferred over less accurate moves that inflict sleep", async () => {
    game.override.enemyMoveset([MoveId.SPORE, MoveId.SLEEP_POWDER, MoveId.HYPNOSIS]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SPORE);
  });

  it("should be preferred over moves with a lower chance to inflict sleep", async () => {
    game.override.enemyMoveset([MoveId.SPORE, MoveId.WICKED_TORQUE]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SPORE);
  });

  it("should be avoided if the opponent is under the effects of Safeguard", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.scene.arena.addTag(ArenaTagType.SAFEGUARD, 0, 1, MoveId.NONE, ArenaTagSide.PLAYER);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SPORE);
  });

  it("should be avoided if the opponent is Grass-type", async () => {
    await game.classicMode.startBattle(SpeciesId.ODDISH);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SPORE);
  });
});

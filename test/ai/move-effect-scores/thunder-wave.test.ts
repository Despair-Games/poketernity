import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Thunder Wave", () => {
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
      .enemyMoveset([MoveId.THUNDER_WAVE, MoveId.SUPER_FANG])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over Super Fang if the user is slower than the opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.PURUGLY);

    const enemy = game.scene.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.THUNDER_WAVE);
  });

  it("should not be preferred over Super Fang if the user is faster than the opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.SNORLAX);

    const enemy = game.scene.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.THUNDER_WAVE);
  });

  it("should be preferred over moves with a lower chance to paralyze", async () => {
    game.override.enemyMoveset([MoveId.THUNDER_WAVE, MoveId.DRAGON_BREATH]);

    await game.classicMode.startBattle(SpeciesId.SNORLAX);

    const enemy = game.scene.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.THUNDER_WAVE);
  });

  it("should be avoided if the opponent is under the effects of Safeguard", async () => {
    await game.classicMode.startBattle(SpeciesId.PURUGLY);

    game.scene.arena.addTag(ArenaTagType.SAFEGUARD, 0, 1, MoveId.NONE, ArenaTagSide.PLAYER);

    const enemy = game.scene.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.THUNDER_WAVE);
  });

  it("should be avoided if the opponent is Ground-type", async () => {
    await game.classicMode.startBattle(SpeciesId.DUGTRIO);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.THUNDER_WAVE);
  });
});

import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Will-O-Wisp", () => {
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
      .enemySpecies(SpeciesId.GYARADOS)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.WILL_O_WISP, MoveId.SUPER_FANG])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over Super Fang if the opponent is a physical attacker", async () => {
    await game.classicMode.startBattle(SpeciesId.EXCADRILL);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.WILL_O_WISP);
  });

  it("should not be preferred over Super Fang if the opponent is a special attacker", async () => {
    await game.classicMode.startBattle(SpeciesId.ELECTRODE);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.WILL_O_WISP);
  });

  it("should be preferred over moves with a lower chance to burn", async () => {
    game.override.enemyMoveset([MoveId.WILL_O_WISP, MoveId.EMBER]);

    await game.classicMode.startBattle(SpeciesId.GYARADOS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.WILL_O_WISP);
  });

  it("should be avoided if the opponent is under the effects of Safeguard", async () => {
    await game.classicMode.startBattle(SpeciesId.EXCADRILL);

    game.scene.arena.addTag(ArenaTagType.SAFEGUARD, 0, 1, MoveId.NONE, ArenaTagSide.PLAYER, true);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.WILL_O_WISP);
  });

  it("should be avoided if the opponent is Fire-type", async () => {
    await game.classicMode.startBattle(SpeciesId.CINDERACE);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.WILL_O_WISP);
  });
});

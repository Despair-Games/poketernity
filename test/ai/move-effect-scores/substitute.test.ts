import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Substitute", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.EXCADRILL)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SUBSTITUTE, MoveId.SPLASH, MoveId.BULLDOZE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user has a strong matchup against the opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.BELLIBOLT);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.SUBSTITUTE);
  });

  it("should not be preferred when the user has a weak matchup against the opponent", async () => {
    game.override.enemyMoveset([MoveId.SUBSTITUTE, MoveId.EXTREME_SPEED, MoveId.SPLASH]);

    await game.classicMode.startBattle(SpeciesId.GYARADOS);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.SUBSTITUTE);
  });

  it("should be avoided when the user is a Boss Pokemon", async () => {
    game.override.enemyHealthSegments(2);

    await game.classicMode.startBattle(SpeciesId.BELLIBOLT);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SUBSTITUTE);
  });

  it("should be avoided when the user is critically damaged", async () => {
    await game.classicMode.startBattle(SpeciesId.BELLIBOLT);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = 1;

    expect(enemy).toNeverSelectMove(MoveId.SUBSTITUTE);
  });

  it("should be avoided when the user already has an active substitute", async () => {
    await game.classicMode.startBattle(SpeciesId.BELLIBOLT);

    const enemy = game.field.getEnemyPokemon();
    enemy.addTag(BattlerTagType.SUBSTITUTE, 0, MoveId.NONE, enemy.id);

    expect(enemy).toNeverSelectMove(MoveId.SUBSTITUTE);
  });
});

import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllAbilities } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Strength Sap", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.STRENGTH_SAP, MoveId.GROWL, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user is damaged", async () => {
    await game.classicMode.startBattle(SpeciesId.EXCADRILL);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp / 2);

    expect(enemy).toPreferSelectingMove(MoveId.STRENGTH_SAP);
  });

  it("should be avoided when the opponent has Liquid Ooze", async () => {
    game.override.ability(AbilityId.LIQUID_OOZE);

    await game.classicMode.startBattle(SpeciesId.EXCADRILL);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp / 2);

    expect(enemy).toNeverSelectMove(MoveId.STRENGTH_SAP);
  });

  it("should be avoided when the opponent has Clear Body", async () => {
    game.override.ability(AbilityId.CLEAR_BODY);

    await game.classicMode.startBattle(SpeciesId.EXCADRILL);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.STRENGTH_SAP);
  });
});

import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Screech", () => {
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
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SCREECH, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user is a physical attacker", async () => {
    game.override.enemySpecies(SpeciesId.DRILBUR);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SCREECH);
  });

  it("should not be preferred when the user is a special attacker", async () => {
    game.override.enemySpecies(SpeciesId.SOBBLE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SCREECH);
  });

  it("should be strongly preferred when the opponent is known to have Simple", async () => {
    game.override.enemySpecies(SpeciesId.DRILBUR).ability(AbilityId.SIMPLE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.SCREECH);
  });

  it.each([
    { abilityName: "Contrary", abilityId: AbilityId.CONTRARY },
    { abilityName: "Clear Body", abilityId: AbilityId.CLEAR_BODY },
    { abilityName: "White Smoke", abilityId: AbilityId.WHITE_SMOKE },
  ])("should be avoided when the opponent is known to have $abilityName", async ({ abilityId }) => {
    game.override.enemySpecies(SpeciesId.DRILBUR).ability(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SCREECH);
  });
});

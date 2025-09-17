import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Charm", () => {
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
      .enemyMoveset([MoveId.CHARM, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the opponent is a physical attacker", async () => {
    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.CHARM);
  });

  it("should not be preferred when the opponent is a special attacker", async () => {
    await game.classicMode.startBattle(SpeciesId.SOBBLE);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.CHARM);
  });

  it("should be strongly preferred when the opponent is known to have Simple", async () => {
    game.override.ability(AbilityId.SIMPLE);

    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.CHARM);
  });

  it.each([
    { abilityName: "Contrary", abilityId: AbilityId.CONTRARY },
    { abilityName: "Clear Body", abilityId: AbilityId.CLEAR_BODY },
    { abilityName: "White Smoke", abilityId: AbilityId.WHITE_SMOKE },
    { abilityName: "Hyper Cutter", abilityId: AbilityId.HYPER_CUTTER },
  ])("should be avoided when the opponent is known to have $abilityName", async ({ abilityId }) => {
    game.override.ability(abilityId);

    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.CHARM);
  });
});

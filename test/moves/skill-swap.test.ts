import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Skill Swap", () => {
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
      .moveset([MoveId.SPLASH, MoveId.SKILL_SWAP])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should swap the two abilities", async () => {
    game.override.ability(AbilityId.ADAPTABILITY);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.select(MoveId.SKILL_SWAP);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getAbility().id).toBe(AbilityId.BALL_FETCH);
    expect(game.field.getEnemyPokemon().getAbility().id).toBe(AbilityId.ADAPTABILITY);
  });

  // TODO: https://github.com/pagefaultgames/pokerogue/pull/5146
  it.todo("should activate post-summon abilities", async () => {
    game.override.ability(AbilityId.INTIMIDATE);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.select(MoveId.SKILL_SWAP);
    await game.toEndOfTurn();

    // player atk should be -1 after opponent gains intimidate and it activates
    expect(game.field.getPlayerPokemon()).toHaveStatStage(Stat.ATK, -1);
  });
});

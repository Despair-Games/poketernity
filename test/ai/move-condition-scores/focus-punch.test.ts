import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Condition Scores - Focus Punch", () => {
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
      .enemyMoveset([MoveId.FOCUS_PUNCH, MoveId.SPLASH, MoveId.TACKLE])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be penalized under normal circumstances", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.FOCUS_PUNCH);
  });

  it("should not be penalized if the user has an active Substitute", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();
    enemy.addTag(BattlerTagType.SUBSTITUTE, 0, MoveId.SUBSTITUTE, enemy.id);

    expect(enemy).toPreferSelectingMove(MoveId.FOCUS_PUNCH);
  });

  it.each([
    ["asleep", StatusEffect.SLEEP],
    ["frozen", StatusEffect.FREEZE],
  ])("should not be penalized if opponents are %s", async (_, statusEffect) => {
    game.override.statusEffect(statusEffect);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.FOCUS_PUNCH);
  });

  it("should be given a smaller penalty if opponents are paralyzed", async () => {
    game.override
      .statusEffect(StatusEffect.PARALYSIS)
      .enemyMoveset([MoveId.FOCUS_PUNCH, MoveId.SWALLOW, MoveId.SPIT_UP]);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.FOCUS_PUNCH);
  });
});

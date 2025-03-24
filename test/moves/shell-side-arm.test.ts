import { BattlerIndex } from "#enums/battler-index";
import { allMoves } from "#app/data/data-lists";
import { ShellSideArmCategoryAttr } from "#app/data/moves/move-attrs/shell-side-arm-category-attr";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Shell Side Arm", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const shellSideArm = allMoves.get(MoveId.SHELL_SIDE_ARM);
  const shellSideArmAttr = shellSideArm.getAttrs(ShellSideArmCategoryAttr)[0];

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
      .moveset([MoveId.SHELL_SIDE_ARM, MoveId.SPLASH])
      .battleType("single")
      .startingLevel(100)
      .enemyLevel(100)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("becomes a physical attack if forecasted to deal more damage as physical", async () => {
    game.override.enemySpecies(SpeciesId.SNORLAX);

    await game.classicMode.startBattle([SpeciesId.RAMPARDOS]);

    vi.spyOn(shellSideArmAttr, "apply");

    game.move.select(MoveId.SHELL_SIDE_ARM);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(shellSideArmAttr.apply).toHaveLastReturnedWith(true);
  });

  it("should make contact if the move becomes physical", async () => {
    game.override.enemySpecies(SpeciesId.SNORLAX).enemyAbility(AbilityId.ROUGH_SKIN);

    await game.classicMode.startBattle([SpeciesId.RAMPARDOS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.SHELL_SIDE_ARM);
    await game.toNextTurn();

    expect(player.getMaxHp()).toBeGreaterThan(player.hp);
  });

  it("remains a special attack if forecasted to deal more damage as special", async () => {
    game.override.enemySpecies(SpeciesId.SLOWBRO);

    await game.classicMode.startBattle([SpeciesId.XURKITREE]);

    vi.spyOn(shellSideArmAttr, "apply");

    game.move.select(MoveId.SHELL_SIDE_ARM);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(shellSideArmAttr.apply).toHaveLastReturnedWith(false);
  });

  it("should not make contact if the move becomes special", async () => {
    game.override.enemySpecies(SpeciesId.SLOWBRO).enemyAbility(AbilityId.ROUGH_SKIN);

    await game.classicMode.startBattle([SpeciesId.XURKITREE]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.SHELL_SIDE_ARM);
    await game.toNextTurn();

    expect(player.getMaxHp()).toBe(player.hp);
  });

  it("respects stat stage changes when forecasting base damage", async () => {
    game.override.enemySpecies(SpeciesId.SNORLAX).enemyMoveset(MoveId.COTTON_GUARD);

    await game.classicMode.startBattle([SpeciesId.MANAPHY]);

    vi.spyOn(shellSideArmAttr, "apply");

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    game.move.select(MoveId.SHELL_SIDE_ARM);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(shellSideArmAttr.apply).toHaveLastReturnedWith(false);
  });

  it("should ignore abilities when forecasting damage", async () => {
    game.override.enemySpecies(SpeciesId.SNORLAX).enemyAbility(AbilityId.FUR_COAT);

    await game.classicMode.startBattle([SpeciesId.MANAPHY]);

    vi.spyOn(shellSideArmAttr, "apply");

    const enemy = game.field.getEnemyPokemon();
    vi.spyOn(enemy, "stats", "get").mockReturnValue([100, 100, 75, 100, 100, 100]);

    game.move.select(MoveId.SHELL_SIDE_ARM);
    await game.toEndOfTurn();

    expect(shellSideArmAttr.apply).toHaveLastReturnedWith(true);
  });
});

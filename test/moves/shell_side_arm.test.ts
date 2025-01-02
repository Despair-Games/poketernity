import { BattlerIndex } from "#app/battle";
import { allMoves } from "#app/data/all-moves";
import { ShellSideArmCategoryAttr } from "#app/data/move-attrs/shell-side-arm-category-attr";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Shell Side Arm", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const shellSideArm = allMoves[Moves.SHELL_SIDE_ARM];
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
    game.overridesHelper
      .moveset([Moves.SHELL_SIDE_ARM, Moves.SPLASH])
      .battleType("single")
      .startingLevel(100)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("becomes a physical attack if forecasted to deal more damage as physical", async () => {
    game.overridesHelper.enemySpecies(Species.SNORLAX);

    await game.classicModeHelper.startBattle([Species.RAMPARDOS]);

    vi.spyOn(shellSideArmAttr, "apply");

    game.moveHelper.select(Moves.SHELL_SIDE_ARM);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(shellSideArmAttr.apply).toHaveLastReturnedWith(true);
  });

  it("should make contact if the move becomes physical", async () => {
    game.overridesHelper.enemySpecies(Species.SNORLAX).enemyAbility(Abilities.ROUGH_SKIN);

    await game.classicModeHelper.startBattle([Species.RAMPARDOS]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SHELL_SIDE_ARM);
    await game.toNextTurn();

    expect(player.getMaxHp()).toBeGreaterThan(player.hp);
  });

  it("remains a special attack if forecasted to deal more damage as special", async () => {
    game.overridesHelper.enemySpecies(Species.SLOWBRO);

    await game.classicModeHelper.startBattle([Species.XURKITREE]);

    vi.spyOn(shellSideArmAttr, "apply");

    game.moveHelper.select(Moves.SHELL_SIDE_ARM);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(shellSideArmAttr.apply).toHaveLastReturnedWith(false);
  });

  it("should not make contact if the move becomes special", async () => {
    game.overridesHelper.enemySpecies(Species.SLOWBRO).enemyAbility(Abilities.ROUGH_SKIN);

    await game.classicModeHelper.startBattle([Species.XURKITREE]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SHELL_SIDE_ARM);
    await game.toNextTurn();

    expect(player.getMaxHp()).toBe(player.hp);
  });

  it("respects stat stage changes when forecasting base damage", async () => {
    game.overridesHelper.enemySpecies(Species.SNORLAX).enemyMoveset(Moves.COTTON_GUARD);

    await game.classicModeHelper.startBattle([Species.MANAPHY]);

    vi.spyOn(shellSideArmAttr, "apply");

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    game.moveHelper.select(Moves.SHELL_SIDE_ARM);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(shellSideArmAttr.apply).toHaveLastReturnedWith(false);
  });
});

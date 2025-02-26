import { type BypassSpeedChanceAbAttr } from "#app/data/ab-attrs/bypass-speed-chance-ab-attr";
import { allAbilities } from "#app/data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("Abilities - Quick Draw", () => {
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
      .ability(Abilities.QUICK_DRAW)
      .enemySpecies(Species.REGIELEKI)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);

    vi.spyOn(
      allAbilities[Abilities.QUICK_DRAW].getAttrs<BypassSpeedChanceAbAttr>(AbAttrFlag.BYPASS_SPEED_CHANCE)[0],
      "chance",
      "get",
    ).mockReturnValue(100);
  });

  test("should cause the source to move first in its priority bracket", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(player.turnData.order).toBeLessThan(enemy.turnData.order);
    expect(player.battleData.abilitiesApplied).toContain(Abilities.QUICK_DRAW);
  });

  test("should not apply when the source uses a status move", async () => {
    await game.classicMode.startBattle();

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.TAIL_WHIP);
    await game.toEndOfTurn();

    expect(player.turnData.order).toBeGreaterThan(enemy.turnData.order);
    expect(player.battleData.abilitiesApplied).not.toContain(Abilities.QUICK_DRAW);
  });

  test("should not cause the source to move before higher-priority moves", async () => {
    await game.classicMode.startBattle();

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.TACKLE);
    await game.move.forceEnemyMove(MoveId.QUICK_ATTACK);
    await game.toEndOfTurn();

    expect(player.turnData.order).toBeGreaterThan(enemy.turnData.order);
    expect(player.battleData.abilitiesApplied).contain(Abilities.QUICK_DRAW);
  });
});

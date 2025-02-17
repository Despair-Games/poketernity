import { type BypassSpeedChanceAbAttr } from "#app/data/ab-attrs/bypass-speed-chance-ab-attr";
import { allAbilities } from "#app/data/data-lists";
import { FaintPhase } from "#app/phases/faint-phase";
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
    game.override.battleType("single");

    game.override.starterSpecies(Species.MAGIKARP);
    game.override.ability(Abilities.QUICK_DRAW);
    game.override.moveset([MoveId.TACKLE, MoveId.TAIL_WHIP]);

    game.override.enemyLevel(100);
    game.override.enemySpecies(Species.MAGIKARP);
    game.override.enemyAbility(Abilities.BALL_FETCH);
    game.override.enemyMoveset([MoveId.TACKLE]);

    vi.spyOn(
      allAbilities[Abilities.QUICK_DRAW].getAttrs<BypassSpeedChanceAbAttr>(AbAttrFlag.BYPASS_SPEED_CHANCE)[0],
      "chance",
      "get",
    ).mockReturnValue(100);
  });

  test("makes pokemon going first in its priority bracket", async () => {
    await game.startBattle();

    const pokemon = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    pokemon.hp = 1;
    enemy.hp = 1;

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to(FaintPhase, false);

    expect(pokemon.isFainted()).toBe(false);
    expect(enemy.isFainted()).toBe(true);
    expect(pokemon.battleData.abilitiesApplied).contain(Abilities.QUICK_DRAW);
  }, 20000);

  test(
    "does not triggered by non damage moves",
    {
      retry: 5,
    },
    async () => {
      await game.startBattle();

      const pokemon = game.scene.getPlayerPokemon()!;
      const enemy = game.scene.getEnemyPokemon()!;

      pokemon.hp = 1;
      enemy.hp = 1;

      game.move.select(MoveId.TAIL_WHIP);
      await game.phaseInterceptor.to(FaintPhase, false);

      expect(pokemon.isFainted()).toBe(true);
      expect(enemy.isFainted()).toBe(false);
      expect(pokemon.battleData.abilitiesApplied).not.contain(Abilities.QUICK_DRAW);
    },
  );

  test("does not increase priority", async () => {
    game.override.enemyMoveset([MoveId.EXTREME_SPEED]);

    await game.startBattle();

    const pokemon = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    pokemon.hp = 1;
    enemy.hp = 1;

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to(FaintPhase, false);

    expect(pokemon.isFainted()).toBe(true);
    expect(enemy.isFainted()).toBe(false);
    expect(pokemon.battleData.abilitiesApplied).contain(Abilities.QUICK_DRAW);
  }, 20000);
});

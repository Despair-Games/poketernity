import { BypassSpeedChanceAbAttr } from "#app/data/ab-attrs/bypass-speed-chance-ab-attr";
import { allAbilities } from "#app/data/ability";
import { FaintPhase } from "#app/phases/faint-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
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
    game.overridesHelper.battleType("single");

    game.overridesHelper.starterSpecies(Species.MAGIKARP);
    game.overridesHelper.ability(Abilities.QUICK_DRAW);
    game.overridesHelper.moveset([Moves.TACKLE, Moves.TAIL_WHIP]);

    game.overridesHelper.enemyLevel(100);
    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);
    game.overridesHelper.enemyMoveset([Moves.TACKLE]);

    vi.spyOn(allAbilities[Abilities.QUICK_DRAW].getAttrs(BypassSpeedChanceAbAttr)[0], "chance", "get").mockReturnValue(
      100,
    );
  });

  test("makes pokemon going first in its priority bracket", async () => {
    await game.startBattle();

    const pokemon = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    pokemon.hp = 1;
    enemy.hp = 1;

    game.move.select(Moves.TACKLE);
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

      game.move.select(Moves.TAIL_WHIP);
      await game.phaseInterceptor.to(FaintPhase, false);

      expect(pokemon.isFainted()).toBe(true);
      expect(enemy.isFainted()).toBe(false);
      expect(pokemon.battleData.abilitiesApplied).not.contain(Abilities.QUICK_DRAW);
    },
  );

  test("does not increase priority", async () => {
    game.overridesHelper.enemyMoveset([Moves.EXTREME_SPEED]);

    await game.startBattle();

    const pokemon = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    pokemon.hp = 1;
    enemy.hp = 1;

    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to(FaintPhase, false);

    expect(pokemon.isFainted()).toBe(true);
    expect(enemy.isFainted()).toBe(false);
    expect(pokemon.battleData.abilitiesApplied).contain(Abilities.QUICK_DRAW);
  }, 20000);
});

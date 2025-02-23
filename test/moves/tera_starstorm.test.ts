import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";

describe("Moves - Tera Starstorm", () => {
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
      .moveset([MoveId.TERA_STARSTORM, MoveId.SPLASH])
      .battleType("double")
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(30)
      .enemySpecies(Species.MAGIKARP)
      .startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.FIRE }]);
  });

  it("changes type to Stellar when used by Terapagos in its Stellar Form", async () => {
    game.override.battleType("single");
    await game.classicMode.startBattle([Species.TERAPAGOS]);

    const terapagos = game.scene.getPlayerPokemon()!;

    vi.spyOn(terapagos, "getMoveType");

    game.move.select(MoveId.TERA_STARSTORM);
    await game.toEndOfTurn();

    expect(terapagos.isTerastallized()).toBe(true);
    expect(terapagos.getMoveType).toHaveReturnedWith(ElementalType.STELLAR);
  });

  it("targets both opponents in a double battle when used by Terapagos in its Stellar Form", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP, Species.TERAPAGOS]);

    game.move.select(MoveId.TERA_STARSTORM, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.TERA_STARSTORM, 1);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    const enemyField = game.scene.getEnemyField();

    // Pokemon other than Terapagos should not be affected - only hits one target
    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemyField.some((pokemon) => pokemon.isFullHp())).toBe(true);

    // Terapagos in Stellar Form should hit both targets
    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemyField.every((pokemon) => pokemon.isFullHp())).toBe(false);
  });
});

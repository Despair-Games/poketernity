import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { BerryPhase } from "#app/phases/berry-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Hyper Beam", () => {
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
    game.overridesHelper.ability(Abilities.BALL_FETCH);
    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);
    game.overridesHelper.enemyMoveset([Moves.SPLASH]);
    game.overridesHelper.enemyLevel(100);

    game.overridesHelper.moveset([Moves.HYPER_BEAM, Moves.TACKLE]);
    vi.spyOn(allMoves[Moves.HYPER_BEAM], "accuracy", "get").mockReturnValue(100);
  });

  it("should force the user to recharge on the next turn (and only that turn)", async () => {
    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.HYPER_BEAM);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.hp).toBeLessThan(enemyPokemon.getMaxHp());
    expect(leadPokemon.getTag(BattlerTagType.RECHARGING)).toBeDefined();

    const enemyPostAttackHp = enemyPokemon.hp;

    /** Game should progress without a new command from the player */
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.hp).toBe(enemyPostAttackHp);
    expect(leadPokemon.getTag(BattlerTagType.RECHARGING)).toBeUndefined();

    game.moveHelper.select(Moves.TACKLE);

    await game.phaseInterceptor.to(BerryPhase, false);

    expect(enemyPokemon.hp).toBeLessThan(enemyPostAttackHp);
  });
});

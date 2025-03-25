import { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Items - Leftovers", () => {
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
    game.override.startingLevel(2000);
    game.override.ability(AbilityId.UNNERVE);
    game.override.moveset([MoveId.SPLASH]);
    game.override.enemySpecies(SpeciesId.SHUCKLE);
    game.override.enemyAbility(AbilityId.UNNERVE);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
    game.override.startingHeldItems([{ name: "LEFTOVERS", count: 1 }]);
  });

  it("leftovers works", async () => {
    await game.startBattle([SpeciesId.ARCANINE]);

    // Make sure leftovers are there
    expect(game.scene.modifiers[0].type.id).toBe("LEFTOVERS");

    const leadPokemon = game.scene.getPlayerPokemon()!;

    // We should have full hp
    expect(leadPokemon.isFullHp()).toBe(true);

    game.move.select(MoveId.SPLASH);

    // We should have less hp after the attack
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(leadPokemon.hp).toBeLessThan(leadPokemon.getMaxHp());

    const leadHpAfterDamage = leadPokemon.hp;

    // Check if leftovers heal us
    await game.phaseInterceptor.to(TurnEndPhase);
    expect(leadPokemon.hp).toBeGreaterThan(leadHpAfterDamage);
  }, 20000);
});

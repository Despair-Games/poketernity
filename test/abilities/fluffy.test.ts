import { ReceivedMoveDamageMultiplierAbAttr } from "#app/data/ab-attrs/received-move-damage-multiplier-ab-attr";
import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { MoveFlags } from "#enums/move-flags";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import type { NumberHolder } from "#app/utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Fluffy", () => {
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
      .moveset([Moves.TACKLE, Moves.EMBER, Moves.FIRE_FANG])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.RATTATA)
      .enemyAbility(Abilities.FLUFFY)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should reduce the damage of contact moves by half", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(ReceivedMoveDamageMultiplierAbAttr)[0], "applyPreDefend");

    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[6] as NumberHolder).value;
    expect(allMoves[Moves.TACKLE].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageMultiplier).toBe(0.5);
  });

  it("should double the damage of a non-contact fire move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(ReceivedMoveDamageMultiplierAbAttr)[0], "applyPreDefend");

    game.move.select(Moves.EMBER);
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[6] as NumberHolder).value;
    expect(damageMultiplier).toBe(2);
  });

  it("should not alter the damage of a contact-making fire move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(ReceivedMoveDamageMultiplierAbAttr)[0], "applyPreDefend");

    game.move.select(Moves.FIRE_FANG);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[6] as NumberHolder).value;
    expect(allMoves[Moves.FIRE_FANG].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageMultiplier).toBe(1);
  });

  it("should not alter the damage of contact moves if the attacker has the ability Long Reach", async () => {
    game.override.ability(Abilities.LONG_REACH);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(ReceivedMoveDamageMultiplierAbAttr)[0], "applyPreDefend");

    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[6] as NumberHolder).value;
    expect(allMoves[Moves.TACKLE].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageMultiplier).toBe(1);
  });
});

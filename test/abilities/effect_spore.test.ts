import { EffectSporeAbAttr } from "#app/data/ab-attrs/effect-spore-ab-attr";
import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Effect Spore", () => {
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
      .moveset([MoveId.SPLASH])
      .ability(Abilities.EFFECT_SPORE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([MoveId.TACKLE, MoveId.WATER_GUN]);

    // Force minimum RNG roll so that Effect Spore's RNG roll succeeds
    vi.spyOn(game.scene, "randBattleSeedInt").mockImplementation((_range, min: 0) => min);
  });

  it("should have a chance of inflicting a status effect if user is hit with a contact move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const abilityAttr = game.scene.getPlayerPokemon()?.getAbilityAttrs(EffectSporeAbAttr)[0]!;
    vi.spyOn(abilityAttr, "apply");
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.apply).toHaveLastReturnedWith(true);
    expect(enemyPokemon.status).toBeDefined();
  });

  it("should not affect Pokemon with the ability Overcoat", async () => {
    game.override.enemyAbility(Abilities.OVERCOAT);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const abilityAttr = game.scene.getPlayerPokemon()?.getAbilityAttrs(EffectSporeAbAttr)[0]!;
    vi.spyOn(abilityAttr, "apply");

    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.apply).toHaveLastReturnedWith(false);
  });

  it("should not affect Grass-type Pokemon", async () => {
    game.override.enemySpecies(Species.TREECKO);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const abilityAttr = game.scene.getPlayerPokemon()?.getAbilityAttrs(EffectSporeAbAttr)[0]!;
    vi.spyOn(abilityAttr, "apply");

    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.apply).toHaveLastReturnedWith(false);
  });

  it("should require contact to activate", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const abilityAttr = game.scene.getPlayerPokemon()?.getAbilityAttrs(EffectSporeAbAttr)[0]!;
    vi.spyOn(abilityAttr, "apply");

    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.WATER_GUN);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.apply).toHaveLastReturnedWith(false);
  });

  it("should have correct chances of inflicting sleep (11%), paralysis (10%), and poison (9%)", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const abilityAttr = playerPokemon.getAbilityAttrs(EffectSporeAbAttr)[0]!;

    let rngSweepProgress = 0; // Will simulate full range of RNG rolls by steadily increasing from 0 to 100
    vi.spyOn(game.scene, "randBattleSeedInt").mockImplementation((range, min: 0) => {
      if (range === 100) {
        return min + rngSweepProgress;
      } else {
        return min + range - 1;
      }
    });

    // Setup for counting number of times each status gets inflicted
    let sleepCount = 0;
    let parCount = 0;
    let poisonCount = 0;
    vi.spyOn(enemyPokemon, "trySetStatus").mockImplementation((status): boolean => {
      if (status === StatusEffect.SLEEP) {
        sleepCount++;
      } else if (status === StatusEffect.PARALYSIS) {
        parCount++;
      } else if (status === StatusEffect.POISON) {
        poisonCount++;
      }
      return true;
    });

    // Apply the Effect Spore attr while simulating the full range of possible RNG rolls.
    // Unfortunately, actually using Tackle 100 times takes too long, so we only apply the attr.
    for (rngSweepProgress = 0; rngSweepProgress < 100; rngSweepProgress++) {
      abilityAttr.apply(playerPokemon, false, enemyPokemon, allMoves[MoveId.TACKLE]);
    }

    expect(sleepCount).toBe(11);
    expect(parCount).toBe(10);
    expect(poisonCount).toBe(9);
  });
});

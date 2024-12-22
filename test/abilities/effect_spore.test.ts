import { EffectSporeAbAttr } from "#app/data/ab-attrs/effect-spore-ab-attr";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
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
      .moveset([Moves.SPLASH])
      .ability(Abilities.EFFECT_SPORE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([Moves.TACKLE, Moves.WATER_GUN]);
  });

  it("should do not affect Pokemon with the ability Overcoat", async () => {
    game.override.enemyAbility(Abilities.OVERCOAT);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const abilityAttr = game.scene.getPlayerPokemon()?.getAbilityAttrs(EffectSporeAbAttr)[0]!;
    vi.spyOn(abilityAttr, "applyPostDefend");

    game.move.select(Moves.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.applyPostDefend).toHaveLastReturnedWith(false);
  });

  it("should do not affect Grass-type Pokemon", async () => {
    game.override.enemySpecies(Species.TREECKO);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const abilityAttr = game.scene.getPlayerPokemon()?.getAbilityAttrs(EffectSporeAbAttr)[0]!;
    vi.spyOn(abilityAttr, "applyPostDefend");

    game.move.select(Moves.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.applyPostDefend).toHaveLastReturnedWith(false);
  });

  it("should require contact to activate", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const abilityAttr = game.scene.getPlayerPokemon()?.getAbilityAttrs(EffectSporeAbAttr)[0]!;
    vi.spyOn(abilityAttr, "applyPostDefend");

    game.move.select(Moves.WATER_GUN);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.applyPostDefend).toHaveLastReturnedWith(false);
  });
});

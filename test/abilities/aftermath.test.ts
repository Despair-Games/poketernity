import { toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Aftermath", () => {
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
    game.overridesHelper
      .moveset([Moves.GIGA_IMPACT, Moves.HYPER_BEAM])
      .ability(Abilities.NO_GUARD)
      .startingLevel(50)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.AFTERMATH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should cause the attacker to take damage equal to 25% of their max HP when fainted by a contact move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.GIGA_IMPACT);
    await game.phaseInterceptor.to("BerryPhase");

    expect(player.hp).toBe(toDmgValue((player.getMaxHp() * 3) / 4));
  });

  it("should not cause the attacker to take damage when fainted by a non-contact move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.HYPER_BEAM);
    await game.phaseInterceptor.to("BerryPhase");

    expect(player.isFullHp()).toBe(true);
  });

  it("should not cause the attacker to take damage when it has Magic Guard", async () => {
    game.overridesHelper.passiveAbility(Abilities.MAGIC_GUARD);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.GIGA_IMPACT);
    await game.phaseInterceptor.to("BerryPhase");

    expect(player.isFullHp()).toBe(true);
  });
});

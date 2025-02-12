import { allMoves } from "#app/data/data-lists";
import { UseHigherAttackingStatAttr } from "#app/data/move-attrs/use-higher-attacking-stat-attr";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Photon Geyser", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const photonGeyserAttr = allMoves[MoveId.PHOTON_GEYSER].getAttrs(UseHigherAttackingStatAttr)[0];

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
      .moveset([MoveId.PHOTON_GEYSER])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);

    vi.spyOn(photonGeyserAttr, "apply");
  });

  it("should be special if the user's Special Attack is higher", async () => {
    await game.classicMode.startBattle([Species.CHANDELURE]);

    game.move.select(MoveId.PHOTON_GEYSER);
    await game.phaseInterceptor.to("BerryPhase");

    expect(photonGeyserAttr.apply).toHaveReturnedWith(false);
  });

  it("should be physical if the user's Attack is higher", async () => {
    await game.classicMode.startBattle([Species.KARTANA]);

    game.move.select(MoveId.PHOTON_GEYSER);
    await game.phaseInterceptor.to("BerryPhase");

    expect(photonGeyserAttr.apply).toHaveReturnedWith(true);
  });

  it("should ignore abilities' effects when resolving move category", async () => {
    game.override.ability(Abilities.HUGE_POWER);

    await game.classicMode.startBattle([Species.MANAPHY]);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "stats", "get").mockReturnValue([100, 75, 100, 100, 100, 100]);

    game.move.select(MoveId.PHOTON_GEYSER);
    await game.phaseInterceptor.to("BerryPhase");

    expect(photonGeyserAttr.apply).toHaveReturnedWith(false);
  });
});

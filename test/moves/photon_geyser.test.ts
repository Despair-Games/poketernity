import { allMoves } from "#app/data/all-moves";
import { PhotonGeyserCategoryAttr } from "#app/data/move-attrs/photon-geyser-category-attr";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Photon Geyser", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const photonGeyserAttr = allMoves[Moves.PHOTON_GEYSER].getAttrs(PhotonGeyserCategoryAttr)[0];

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
      .moveset([Moves.PHOTON_GEYSER])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);

    vi.spyOn(photonGeyserAttr, "apply");
  });

  it("should be special if the user's Special Attack is higher", async () => {
    await game.classicMode.startBattle([Species.CHANDELURE]);

    game.move.select(Moves.PHOTON_GEYSER);
    await game.phaseInterceptor.to("BerryPhase");

    expect(photonGeyserAttr.apply).toHaveReturnedWith(false);
  });

  it("should be physical if the user's Attack is higher", async () => {
    await game.classicMode.startBattle([Species.KARTANA]);

    game.move.select(Moves.PHOTON_GEYSER);
    await game.phaseInterceptor.to("BerryPhase");

    expect(photonGeyserAttr.apply).toHaveReturnedWith(true);
  });
});

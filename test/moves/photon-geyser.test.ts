import { allMoves } from "#app/data/data-lists";
import { UseHigherAttackingStatAttr } from "#app/data/moves/move-attrs/use-higher-attacking-stat-attr";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Photon Geyser", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const photonGeyserAttr = allMoves.get(MoveId.PHOTON_GEYSER).getAttrs(UseHigherAttackingStatAttr)[0];

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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);

    vi.spyOn(photonGeyserAttr, "apply");
  });

  it("should be special if the user's Special Attack is higher", async () => {
    await game.classicMode.startBattle([SpeciesId.CHANDELURE]);

    game.move.select(MoveId.PHOTON_GEYSER);
    await game.toEndOfTurn();

    expect(photonGeyserAttr.apply).toHaveReturnedWith(false);
  });

  it("should be physical if the user's Attack is higher", async () => {
    await game.classicMode.startBattle([SpeciesId.KARTANA]);

    game.move.select(MoveId.PHOTON_GEYSER);
    await game.toEndOfTurn();

    expect(photonGeyserAttr.apply).toHaveReturnedWith(true);
  });

  it("should ignore abilities' effects when resolving move category", async () => {
    game.override.ability(AbilityId.HUGE_POWER);

    await game.classicMode.startBattle([SpeciesId.MANAPHY]);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "stats", "get").mockReturnValue([100, 75, 100, 100, 100, 100]);

    game.move.select(MoveId.PHOTON_GEYSER);
    await game.toEndOfTurn();

    expect(photonGeyserAttr.apply).toHaveReturnedWith(false);
  });
});

import { BattlerIndex } from "#app/battle";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { allMoves } from "#app/data/all-moves";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { FlinchAttr } from "#app/data/move-attrs/flinch-attr";

describe("Abilities - Serene Grace", () => {
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
      .disableCrits()
      .battleType("single")
      .ability(Abilities.SERENE_GRACE)
      .moveset([Moves.AIR_SLASH])
      .enemySpecies(Species.ALOLA_GEODUDE)
      .enemyLevel(10)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([Moves.SPLASH]);
  });

  it("Serene Grace should double the secondary effect chance of a move", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);

    const airSlashMove = allMoves[Moves.AIR_SLASH];
    const airSlashFlinchAttr = airSlashMove.getAttrs(FlinchAttr)[0];
    vi.spyOn(airSlashFlinchAttr, "getMoveChance");

    game.moveHelper.select(Moves.AIR_SLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.moveHelper.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(airSlashFlinchAttr.getMoveChance).toHaveLastReturnedWith(60);
  });
});

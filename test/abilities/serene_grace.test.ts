import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { allMoves } from "#app/data/data-lists";
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
    game.override
      .disableCrits()
      .battleType("single")
      .ability(Abilities.SERENE_GRACE)
      .moveset([MoveId.AIR_SLASH])
      .enemySpecies(Species.ALOLA_GEODUDE)
      .enemyLevel(10)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([MoveId.SPLASH]);
  });

  it("Serene Grace should double the secondary effect chance of a move", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);

    const airSlashMove = allMoves[MoveId.AIR_SLASH];
    const airSlashFlinchAttr = airSlashMove.getAttrs(FlinchAttr)[0];
    vi.spyOn(airSlashFlinchAttr, "getMoveChance");

    game.move.select(MoveId.AIR_SLASH);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(airSlashFlinchAttr.getMoveChance).toHaveLastReturnedWith(60);
  });
});

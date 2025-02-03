import { allMoves } from "#app/data/all-moves";
import { FlinchAttr } from "#app/data/move-attrs/flinch-attr";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Triple Arrows", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const tripleArrows = allMoves[MoveId.TRIPLE_ARROWS];
  const flinchAttr = tripleArrows.getAttrs(FlinchAttr)[0];
  const defDropAttr = tripleArrows.getAttrs(StatStageChangeAttr)[0];

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
      .ability(Abilities.BALL_FETCH)
      .moveset([MoveId.TRIPLE_ARROWS])
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.STURDY)
      .enemyMoveset(MoveId.SPLASH);

    vi.spyOn(flinchAttr, "getMoveChance");
    vi.spyOn(defDropAttr, "getMoveChance");
  });

  it("has a 30% flinch chance and 50% defense drop chance", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.TRIPLE_ARROWS);
    await game.phaseInterceptor.to("BerryPhase");

    expect(flinchAttr.getMoveChance).toHaveReturnedWith(30);
    expect(defDropAttr.getMoveChance).toHaveReturnedWith(50);
  });

  it("is affected normally by Serene Grace", async () => {
    game.override.ability(Abilities.SERENE_GRACE);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.TRIPLE_ARROWS);
    await game.phaseInterceptor.to("BerryPhase");

    expect(flinchAttr.getMoveChance).toHaveReturnedWith(60);
    expect(defDropAttr.getMoveChance).toHaveReturnedWith(100);
  });
});

import { allMoves } from "#app/data/data-lists";
import { FlinchAttr } from "#app/data/moves/move-attrs/flinch-attr";
import { StatStageChangeAttr } from "#app/data/moves/move-attrs/stat-stage-change-attr";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Triple Arrows", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const tripleArrows = allMoves.get(MoveId.TRIPLE_ARROWS);
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
      .ability(AbilityId.BALL_FETCH)
      .moveset([MoveId.TRIPLE_ARROWS])
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.STURDY)
      .enemyMoveset(MoveId.SPLASH);

    vi.spyOn(flinchAttr, "getMoveChance");
    vi.spyOn(defDropAttr, "getMoveChance");
  });

  it("has a 30% flinch chance and 50% defense drop chance", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.select(MoveId.TRIPLE_ARROWS);
    await game.toEndOfTurn();

    expect(flinchAttr.getMoveChance).toHaveReturnedWith(30);
    expect(defDropAttr.getMoveChance).toHaveReturnedWith(50);
  });

  it("is affected normally by Serene Grace", async () => {
    game.override.ability(AbilityId.SERENE_GRACE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.select(MoveId.TRIPLE_ARROWS);
    await game.toEndOfTurn();

    expect(flinchAttr.getMoveChance).toHaveReturnedWith(60);
    expect(defDropAttr.getMoveChance).toHaveReturnedWith(100);
  });
});

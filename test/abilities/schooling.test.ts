import { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Abilities - SCHOOLING", () => {
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
    const moveToUse = MoveId.SPLASH;
    game.override.battleType("single");
    game.override.ability(AbilityId.SCHOOLING);
    game.override.moveset([moveToUse]);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
  });

  test("check if fainted pokemon switches to base form on arena reset", async () => {
    const soloForm = 0,
      schoolForm = 1;
    game.override.startingWave(4);
    game.override.starterForms({
      [SpeciesId.WISHIWASHI]: schoolForm,
    });

    await game.startBattle([SpeciesId.MAGIKARP, SpeciesId.WISHIWASHI]);

    const wishiwashi = game.scene.getPlayerParty().find((p) => p.species.speciesId === SpeciesId.WISHIWASHI)!;
    expect(wishiwashi).not.toBe(undefined);
    expect(wishiwashi.formIndex).toBe(schoolForm);

    wishiwashi.faint();
    expect(wishiwashi.isFainted()).toBe(true);

    game.move.select(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to(TurnEndPhase);
    game.doSelectModifier();
    await game.phaseInterceptor.to(QuietFormChangePhase);

    expect(wishiwashi.formIndex).toBe(soloForm);
  });
});

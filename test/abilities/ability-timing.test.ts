import { AbilityId } from "#enums/ability-id";
import { BattleStyle } from "#enums/battle-style";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { UiMode } from "#enums/ui-mode";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Ability Timing", () => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.INTIMIDATE)
      .ability(AbilityId.BALL_FETCH);
  });

  it("should trigger after switch check", async () => {
    game.settings.battleStyle = BattleStyle.SWITCH;
    await game.classicMode.runToSummon(SpeciesId.EEVEE, SpeciesId.FEEBAS);
    await game.phaseInterceptor.to("CheckSwitchPhase", false);

    const eevee = game.field.getPlayerPokemon();
    expect(eevee).toHaveStatStage(Stat.ATK, 0);

    game.onNextPrompt(
      "CheckSwitchPhase",
      UiMode.CONFIRM,
      () => {
        game.setMode(UiMode.MESSAGE);
        game.endPhase();
      },
      () => game.isCurrentPhase("CommandPhase") || game.isCurrentPhase("TurnInitPhase"),
    );

    await game.phaseInterceptor.to("CommandPhase", false);
    expect(eevee).toHaveStatStage(Stat.ATK, -1);
  }, 5000);
});

import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Flinch", () => {
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
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.FAKE_OUT)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should stay flinched if moving twice in a turn", async () => {
    const { override, classicMode, move, phaseInterceptor } = game;

    override.battleType("double").ability(AbilityId.DANCER);

    await classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.SQUIRTLE]);

    const player1 = game.scene.getPlayerPokemon()!;
    move.use(MoveId.SWORDS_DANCE, BattlerIndex.PLAYER);
    move.use(MoveId.SWORDS_DANCE, BattlerIndex.PLAYER_2);
    await move.forceEnemyMove(MoveId.FAKE_OUT, BattlerIndex.PLAYER);
    await move.forceEnemyMove(MoveId.SPLASH);

    expect(player1).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await phaseInterceptor.to("PostActionPhase", true);
    await phaseInterceptor.to("PostActionPhase", true);

    expect(player1).toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await phaseInterceptor.to("PostActionPhase", true);

    expect(player1).toHaveBattlerTagType(BattlerTagType.FLINCHED);
    await game.toEndOfTurn();

    expect(player1).not.toHaveBattlerTagType(BattlerTagType.FLINCHED); // tag was lapsed

    // Check that Player 1 attempted to copy Swords Dance but could not move due to flinching
    expect(player1).toHaveAbilityApplied(AbilityId.DANCER);
    expect(player1).toHaveStatStage(Stat.ATK, 0);
  });
});

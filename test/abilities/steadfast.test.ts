import { IGNORING_ABILITIES } from "#constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import { capitalizeString } from "#utils/string-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Steadfast", () => {
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
      .ability(AbilityId.STEADFAST)
      .startingLevel(100)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset([MoveId.SPLASH, MoveId.FAKE_OUT])
      .enemyLevel(100);
  });

  it("should boost SPD +1 after flinching", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await phaseInterceptor.to("PostActionPhase", true);

    expect(playerPkm).toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, +1);
  });

  it("should NOT boost SPD when Pokemon does NOT flinch", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.forceEnemyMove(MoveId.QUICK_ATTACK);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await phaseInterceptor.to("PostActionPhase", true);

    expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });

  it("should NOT boost SPD if flinching occured after owner acted", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await phaseInterceptor.to("PostActionPhase", true);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await phaseInterceptor.to("PostActionPhase", true);

    expect(playerPkm).toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });

  it.each([
    {
      abilityName: "Inner Focus",
      abilityId: AbilityId.INNER_FOCUS,
    },
    {
      abilityName: "Shield Dust",
      abilityId: AbilityId.SHIELD_DUST,
    },
  ])(`should NOT boost SPD if flinching is prevented by "$abilityName" ability`, async ({ abilityId }) => {
    const { classicMode, field, move, phaseInterceptor } = game;
    game.override.passiveAbility(abilityId);
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await phaseInterceptor.to("PostActionPhase", true);

    expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });

  it.todo(`should NOT boost SPD if flinching is prevented by "Covert Cloak" Item `, async () => {
    // Item not yet implemented
  });

  it.each(
    IGNORING_ABILITIES.map((abilityId) => ({
      abilityName: capitalizeString(AbilityId[abilityId], "_", false, true),
      abilityId,
    })),
  )("should boost SPD +1 if Inner Focus is overridden by enemy $abilityName ability", async ({ abilityId }) => {
    const { classicMode, field, move, phaseInterceptor } = game;
    game.override.enemyAbility(abilityId).passiveAbility(AbilityId.INNER_FOCUS);
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await phaseInterceptor.to("PostActionPhase", true);

    expect(playerPkm).toHaveBattlerTagType(BattlerTagType.FLINCHED);

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, +1);
  });
});

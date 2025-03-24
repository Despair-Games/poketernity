import { BattlerIndex } from "#enums/battler-index";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Rapid Spin", () => {
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
      .moveset([MoveId.RAPID_SPIN])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should increase the user's Speed", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.RAPID_SPIN);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.SPD)).toBe(1);
  });

  it("should remove binding effects from the user", async () => {
    game.override.enemyMoveset(MoveId.INFESTATION);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.RAPID_SPIN);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    expect(player.getTag(BattlerTagType.INFESTATION)).toBeUndefined();
  });

  it.each([
    { tagType: ArenaTagType.SPIKES, name: "Spikes" },
    { tagType: ArenaTagType.TOXIC_SPIKES, name: "Toxic Spikes" },
    { tagType: ArenaTagType.STEALTH_ROCK, name: "Stealth Rock" },
    { tagType: ArenaTagType.STICKY_WEB, name: "Sticky Web" },
  ])("should remove the effects of $name only from the user's side of the field", async ({ tagType }) => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY].forEach((side) =>
      game.scene.arena.addTag(tagType, 0, 1, MoveId.NONE, side),
    );

    game.move.select(MoveId.RAPID_SPIN);

    await game.toEndOfTurn();

    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.PLAYER)).toBeUndefined();
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.ENEMY)).toBeDefined();
  });
});

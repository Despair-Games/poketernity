import { BattlerIndex } from "#enums/battler-index";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
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
      .moveset([Moves.RAPID_SPIN])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should increase the user's Speed", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(Moves.RAPID_SPIN);
    await game.phaseInterceptor.to("BerryPhase");

    expect(player.getStatStage(Stat.SPD)).toBe(1);
  });

  it("should remove binding effects from the user", async () => {
    game.override.enemyMoveset(Moves.INFESTATION);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(Moves.RAPID_SPIN);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(player.getTag(BattlerTagType.INFESTATION)).toBeUndefined();
  });

  it.each([
    { tagType: ArenaTagType.SPIKES, name: "Spikes" },
    { tagType: ArenaTagType.TOXIC_SPIKES, name: "Toxic Spikes" },
    { tagType: ArenaTagType.STEALTH_ROCK, name: "Stealth Rock" },
    { tagType: ArenaTagType.STICKY_WEB, name: "Sticky Web" },
  ])("should remove the effects of $name only from the user's side of the field", async ({ tagType }) => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY].forEach((side) =>
      game.scene.arena.addTag(tagType, 1, Moves.NONE, 0, side),
    );

    game.move.select(Moves.RAPID_SPIN);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.PLAYER)).toBeUndefined();
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.ENEMY)).toBeDefined();
  });
});

import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Tidy Up", () => {
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
      .enemyAbility(AbilityId.STURDY)
      .enemyMoveset(MoveId.SPLASH)
      .ability(AbilityId.STURDY)
      .moveset([MoveId.TIDY_UP])
      .startingLevel(50);
  });

  it.each([
    { hazardName: "Spikes", moveId: MoveId.SPIKES, tagType: ArenaTagType.SPIKES },
    { hazardName: "Stealth Rocks", moveId: MoveId.STEALTH_ROCK, tagType: ArenaTagType.STEALTH_ROCK },
    { hazardName: "Toxic Spikes", moveId: MoveId.TOXIC_SPIKES, tagType: ArenaTagType.TOXIC_SPIKES },
    { hazardName: "Sticky Webs", moveId: MoveId.STICKY_WEB, tagType: ArenaTagType.STICKY_WEB },
    { hazardName: "Sharp Steel", moveId: MoveId.G_MAX_STEELSURGE, tagType: ArenaTagType.SHARP_STEEL },
  ])("clears $hazardName", async ({ moveId, tagType }) => {
    game.override.enemyMoveset(moveId);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.use(moveId);
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(game.scene.arena.hasTag(tagType, ArenaTagSide.PLAYER)).toBeTruthy();
    expect(game.scene.arena.hasTag(tagType, ArenaTagSide.ENEMY)).toBeTruthy();
    game.move.use(MoveId.TIDY_UP);
    await game.phaseInterceptor.to("PostActionPhase");
    expect(game.scene.arena.hasTag(tagType)).toBeFalsy();
  });

  it("clears Substitutes", async () => {
    game.override.moveset([MoveId.SUBSTITUTE, MoveId.TIDY_UP]);
    game.override.enemyMoveset(MoveId.SUBSTITUTE);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.select(MoveId.SUBSTITUTE);
    await game.phaseInterceptor.to("TurnEndPhase");
    game.move.select(MoveId.TIDY_UP);
    await game.phaseInterceptor.to("PostActionPhase");

    const pokemon = [game.scene.getPlayerPokemon()!, game.scene.getEnemyPokemon()!];
    pokemon.forEach((p) => {
      expect(p).toBeDefined();
      expect(p!.getTag(BattlerTagType.SUBSTITUTE)).toBeUndefined();
    });
  });

  it("user's stats are raised with no traps set", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(0);
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(0);

    game.move.select(MoveId.TIDY_UP);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(1);
    expect(playerPokemon.getStatStage(Stat.SPD)).toBe(1);
  });
});

import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Rapid Spin", () => {
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
      .battleType("double")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100)
      .enemyMoveset([MoveId.RAPID_SPIN, MoveId.FACADE]);
  });

  it("should not be preferred when no effects are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.MUNCHLAX);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.RAPID_SPIN);
  });

  it.each([
    { moveName: "Bind", tagType: BattlerTagType.BIND },
    { moveName: "Wrap", tagType: BattlerTagType.WRAP },
    { moveName: "Clamp", tagType: BattlerTagType.CLAMP },
    { moveName: "Sand Tomb", tagType: BattlerTagType.SAND_TOMB },
    { moveName: "G-Max Sand Blast", tagType: BattlerTagType.G_MAX_SAND_TOMB },
    { moveName: "Magma Storm", tagType: BattlerTagType.MAGMA_STORM },
    { moveName: "Snap Trap", tagType: BattlerTagType.SNAP_TRAP },
    { moveName: "Thunder Cage", tagType: BattlerTagType.THUNDER_CAGE },
    { moveName: "Infestation", tagType: BattlerTagType.INFESTATION },
    { moveName: "Fire Spin", tagType: BattlerTagType.FIRE_SPIN },
    { moveName: "G-Max Centiferno", tagType: BattlerTagType.G_MAX_FIRE_SPIN },
    { moveName: "Whirlpool", tagType: BattlerTagType.WHIRLPOOL },
    { moveName: "Leech Seed", tagType: BattlerTagType.SEEDED },
  ])("should be preferred when the user is afflicted with the effects of $moveName", async ({ tagType }) => {
    await game.classicMode.startBattle(SpeciesId.MUNCHLAX);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    enemy.addTag(tagType, 0, MoveId.NONE, player.id);
    expect(enemy).toPreferSelectingMove(MoveId.RAPID_SPIN);
  });

  it.each([
    { tagName: "Spikes", tagType: ArenaTagType.SPIKES },
    { tagName: "Toxic Spikes", tagType: ArenaTagType.TOXIC_SPIKES },
    { tagName: "Stealth Rock", tagType: ArenaTagType.STEALTH_ROCK },
    { tagName: "Sticky Web", tagType: ArenaTagType.STICKY_WEB },
    { tagName: "Sharp Steel", tagType: ArenaTagType.SHARP_STEEL },
  ])(`should be preferred when $tagName is on the user's side of the field`, async ({ tagType }) => {
    await game.classicMode.startBattle(SpeciesId.MUNCHLAX);

    game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.ENEMY, true);
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.RAPID_SPIN);
  });

  it("should not gain or lose incentive from hazards on the opposing side", async () => {
    await game.classicMode.startBattle(SpeciesId.MUNCHLAX);

    game.scene.arena.addTag(ArenaTagType.SPIKES, 0, 0, MoveId.NONE, ArenaTagSide.PLAYER, true);
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.RAPID_SPIN);
    expect(enemy).not.toNeverSelectMove(MoveId.RAPID_SPIN);
  });
});

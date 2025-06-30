import { HIGH_VALUE_ABILITIES } from "#constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllAbilities } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Ability Change", () => {
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
      .enemyMoveset([MoveId.WORRY_SEED, MoveId.SPLASH, MoveId.TACKLE, MoveId.GROWL])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each(
    HIGH_VALUE_ABILITIES.map((abId) => {
      return { abilityName: AbilityId[abId], abilityId: abId };
    }),
  )("Enemy should prefer selecting Worry Seed when the opponent has $abilityName", async ({ abilityId }) => {
    game.override.ability(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemyPokemon = game.field.getEnemyPokemon();

    expect(enemyPokemon).toPreferSelectingMove(MoveId.WORRY_SEED);
  });

  it("Enemy should not prefer selecting Worry Seed when the opponent has a non-high-value ability", async () => {
    game.override.ability(AbilityId.TORRENT);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemyPokemon = game.field.getEnemyPokemon();

    expect(enemyPokemon).not.toPreferSelectingMove(MoveId.WORRY_SEED);
  });

  it("Enemy should not prefer selecting Worry Seed when the opponent's ability isn't revealed", async () => {
    game.override.ability(AbilityId.HUGE_POWER);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemyPokemon = game.field.getEnemyPokemon();

    expect(enemyPokemon).not.toPreferSelectingMove(MoveId.WORRY_SEED);
  });

  it("Enemy should avoid selecting Worry Seed when the opponent already has Insomnia", async () => {
    game.override.ability(AbilityId.INSOMNIA);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemyPokemon = game.field.getEnemyPokemon();

    expect(enemyPokemon).toNeverSelectMove(MoveId.WORRY_SEED);
  });

  it("Enemy should avoid selecting Worry Seed when the opponent's ability is unsuppressable", async () => {
    game.override.ability(AbilityId.SCHOOLING);

    await game.classicMode.startBattle(SpeciesId.WISHIWASHI);

    revealAllAbilities(game.scene);
    const enemyPokemon = game.field.getEnemyPokemon();

    expect(enemyPokemon).toNeverSelectMove(MoveId.WORRY_SEED);
  });
});

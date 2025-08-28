import { DETRIMENTAL_ABILITIES, HIGH_VALUE_ABILITIES } from "#constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Ability Give", () => {
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
      .enemyAbility(AbilityId.TORRENT)
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.ENTRAINMENT, MoveId.SPLASH, MoveId.TACKLE, MoveId.GROWL])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each(
    HIGH_VALUE_ABILITIES.map((abId) => {
      return { abilityName: AbilityId[abId], abilityId: abId };
    }),
  )("Enemy should prefer selecting Entrainment when the opponent has $abilityName", async ({ abilityId }) => {
    game.override.ability(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.ENTRAINMENT);
  });

  it.each(
    DETRIMENTAL_ABILITIES.map((abId) => {
      return { abilityName: AbilityId[abId], abilityId: abId };
    }),
  )("Enemy should prefer selecting Entrainment when it has $abilityName", async ({ abilityId }) => {
    game.override.enemyAbility(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.ENTRAINMENT);
  });

  it("Enemy should not prefer selecting Entrainment when the opponent's ability isn't revealed", async () => {
    game.override.ability(AbilityId.HUGE_POWER);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.ENTRAINMENT);
  });

  it("Enemy should avoid selecting Entrainment when the opponent has the same ability", async () => {
    game.override.ability(AbilityId.TORRENT);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.ENTRAINMENT);
  });

  it("Enemy should avoid selecting Entrainment when its ability is uncopiable", async () => {
    game.override.enemyAbility(AbilityId.COMATOSE).ability(AbilityId.HUGE_POWER);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.ENTRAINMENT);
  });

  it("Enemy should avoid selecting Entrainment when the opponent's ability is unsuppressable", async () => {
    game.override.enemyAbility(AbilityId.TRUANT).ability(AbilityId.COMATOSE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.ENTRAINMENT);
  });
});

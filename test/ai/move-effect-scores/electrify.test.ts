import { ELECTRIC_IMMUNE_ABILITIES } from "#constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import { capitalizeString } from "#utils/string-utils";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Electrify", () => {
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
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.ELECTRIFY, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be avoided if the user is slower than the target", async () => {
    await game.classicMode.startBattle([SpeciesId.DIGLETT]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    player.setStat(Stat.SPD, 100);
    enemy.setStat(Stat.SPD, 1);

    expect(enemy).toNeverSelectMove(MoveId.ELECTRIFY);
  });

  it("should be avoided if the user is not Electric-immune", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    player.setStat(Stat.SPD, 1);
    enemy.setStat(Stat.SPD, 100);

    expect(enemy).toNeverSelectMove(MoveId.ELECTRIFY);
  });

  it("should be preferred if the user is a Ground-type Pokemon", async () => {
    game.override.enemySpecies(SpeciesId.DIGLETT);
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    player.setStat(Stat.SPD, 1);
    enemy.setStat(Stat.SPD, 100);

    expect(enemy).toPreferSelectingMove(MoveId.ELECTRIFY);
  });

  it.each(
    ELECTRIC_IMMUNE_ABILITIES.map((abilityId) => ({
      abilityName: capitalizeString(AbilityId[abilityId], "_", false, true),
      abilityId,
    })),
  )("should be preferred if the user has $abilityName", async ({ abilityId }) => {
    game.override.enemyAbility(abilityId);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    player.setStat(Stat.SPD, 1);
    enemy.setStat(Stat.SPD, 100);

    expect(enemy).toPreferSelectingMove(MoveId.ELECTRIFY);
  });
});

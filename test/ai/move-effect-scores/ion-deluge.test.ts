import { ELECTRIC_IMMUNE_ABILITIES } from "#app/constants/ability-constants";
import { capitalizeString } from "#app/utils/string-utils";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Ion Deluge", () => {
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
      .enemyMoveset([MoveId.ION_DELUGE, MoveId.SPLASH, MoveId.TACKLE])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the enemy is Ground-type", async () => {
    game.override.enemySpecies(SpeciesId.DRILBUR);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.ION_DELUGE);
  });

  it.each(
    ELECTRIC_IMMUNE_ABILITIES.map((abilityId) => ({
      abilityName: capitalizeString(AbilityId[abilityId], "_", false, true),
      abilityId,
    })),
  )("should be preferred when the enemy has $abilityName", async ({ abilityId }) => {
    game.override.enemyAbility(abilityId);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.ION_DELUGE);
  });
});

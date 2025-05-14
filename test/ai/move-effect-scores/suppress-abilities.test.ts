import { HIGH_VALUE_ABILITIES } from "#app/constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllAbilities } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Ability Suppression", () => {
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
      .ability(AbilityId.TORRENT)
      .enemyAbility(AbilityId.TORRENT)
      .enemyMoveset([MoveId.GASTRO_ACID, MoveId.SPLASH, MoveId.SUPER_FANG, MoveId.GROWL])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each(
    HIGH_VALUE_ABILITIES.map((abId) => {
      return { abilityName: AbilityId[abId], abilityId: abId };
    }),
  )("Enemy should prefer selecting Gastro Acid if the opponent has $abilityName", async ({ abilityId }) => {
    game.override.ability(abilityId);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.GASTRO_ACID);
  });

  it("Enemy should not prefer selecting Gastro Acid if the opponent has Torrent", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.GASTRO_ACID);
  });

  it("Enemy should not prefer selecting Gastro Acid if the opponent's ability isn't revealed", async () => {
    game.override.ability(AbilityId.HUGE_POWER);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.GASTRO_ACID);
  });

  it("Enemy should avoid selecting Gastro Acid if the opponent's ability is unsuppressable", async () => {
    game.override.ability(AbilityId.SCHOOLING);

    await game.classicMode.startBattle([SpeciesId.WISHIWASHI]);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.GASTRO_ACID);
  });
});

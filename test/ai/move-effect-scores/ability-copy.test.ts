import { DETRIMENTAL_ABILITIES } from "#app/constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllAbilities } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Ability Copy", () => {
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
      .startingLevel(100)
      .enemyLevel(100);
  });

  const detAbilityData = DETRIMENTAL_ABILITIES.map((abId) => {
    return { abilityName: AbilityId[abId], abilityId: abId };
  });

  describe.each([
    { moveName: "Role Play", moveId: MoveId.ROLE_PLAY },
    { moveName: "Doodle", moveId: MoveId.DOODLE },
  ])("$moveName", ({ moveId }) => {
    beforeEach(() => {
      game.override.enemyMoveset([moveId, MoveId.SPLASH, MoveId.GROWL, MoveId.TACKLE]);
    });

    it.each(detAbilityData)(
      "should be preferred during move selection if the user has $abilityName",
      async ({ abilityId }) => {
        game.override.enemyAbility(abilityId);

        await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

        revealAllAbilities(game.scene);
        const enemy = game.field.getEnemyPokemon();

        expect(enemy).toPreferSelectingMove(moveId);
      },
    );

    it.each(detAbilityData)(
      "should be avoided during move selection if the opponent has $abilityName",
      async ({ abilityId }) => {
        game.override.ability(abilityId);

        await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

        revealAllAbilities(game.scene);
        const enemy = game.field.getEnemyPokemon();

        expect(enemy).toNeverSelectMove(moveId);
      },
    );
  });

  it.each(detAbilityData)(
    "Enemy should prefer selecting Doodle if its active ally has $abilityName",
    async ({ abilityId }) => {
      game.override.battleType("double").enemyMoveset([MoveId.DOODLE, MoveId.SPLASH, MoveId.TACKLE, MoveId.GROWL]);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

      const [enemy1, enemy2] = game.scene.getEnemyField();
      game.field.mockAbility(enemy2, abilityId);
      revealAllAbilities(game.scene);

      expect(enemy1).toPreferSelectingMove(MoveId.DOODLE);
    },
  );
});

import { DETRIMENTAL_ABILITIES } from "#constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllAbilities } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Ability Switching", () => {
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
      .enemyMoveset([MoveId.SKILL_SWAP, MoveId.SPLASH, MoveId.TACKLE, MoveId.GROWL])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each([
    { abilityName: "Huge Power", abilityId: AbilityId.HUGE_POWER },
    { abilityName: "Pure Power", abilityId: AbilityId.PURE_POWER },
    { abilityName: "Contrary", abilityId: AbilityId.CONTRARY },
  ])("Enemy should prefer selecting Skill Swap when the opponent has $abilityName", async ({ abilityId }) => {
    game.override.ability(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.SKILL_SWAP);
  });

  it.each([
    // Torrent isn't on any high-value ability list
    { abilityName: "Torrent", abilityId: AbilityId.TORRENT },
    // The three abilities below are on high-value ability lists for other effects, but not Skill Swap
    { abilityName: "Desolate Land", abilityId: AbilityId.DESOLATE_LAND },
    { abilityName: "Primordial Sea", abilityId: AbilityId.PRIMORDIAL_SEA },
    { abilityName: "Wonder Guard", abilityId: AbilityId.WONDER_GUARD },
  ])("Enemy should not prefer selecting Skill Swap when the opponent has $abilityName", async ({ abilityId }) => {
    game.override.ability(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.SKILL_SWAP);
  });

  it.each(
    DETRIMENTAL_ABILITIES.map((abId) => {
      return { abilityName: AbilityId[abId], abilityId: abId };
    }),
  )("Enemy should prefer selecting Skill Swap when it has $abilityName", async ({ abilityId }) => {
    game.override.enemyAbility(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.SKILL_SWAP);
  });

  it("Enemy should avoid selecting Skill Swap when it has an unswappable ability", async () => {
    game.override.enemyAbility(AbilityId.COMATOSE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.SKILL_SWAP);
  });

  it("Enemy should avoid selecting Skill Swap when the opponent has an unswappable ability", async () => {
    game.override.ability(AbilityId.COMATOSE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.SKILL_SWAP);
  });

  it("Enemy should not prefer selecting Skill Swap when no abilities are revealed", async () => {
    game.override.ability(AbilityId.HUGE_POWER);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.SKILL_SWAP);
  });
});

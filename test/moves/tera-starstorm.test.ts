import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Tera Starstorm", () => {
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
      .moveset([MoveId.TERA_STARSTORM, MoveId.SPLASH])
      .battleType("double")
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(30)
      .enemySpecies(SpeciesId.MAGIKARP);
  });

  it("changes type to Stellar when used by Terapagos in its Stellar Form", async () => {
    game.override.battleType("single");
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    const terapagos = game.field.getPlayerPokemon();
    vi.spyOn(terapagos, "getMoveType");
    game.field.forceTera(terapagos);

    game.move.select(MoveId.TERA_STARSTORM);
    await game.toEndOfTurn();

    expect(terapagos.isTerastallized).toBe(true);
    expect(terapagos.getMoveType).toHaveReturnedWith(ElementalType.STELLAR);
  });

  it("should be affected by type-changing abilities (e.g., Aerilate) if user is not Terastallized", async () => {
    game.override.ability(AbilityId.AERILATE);
    game.override.battleType("single");
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "getMoveType");

    game.move.use(MoveId.TERA_STARSTORM);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(player.getMoveType).toHaveLastReturnedWith(ElementalType.FLYING);
  });

  it("targets both opponents in a double battle when used by Terapagos in its Stellar Form", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.TERAPAGOS);

    const terapagos = game.field.getPlayerPokemon();
    game.field.forceTera(terapagos);

    game.move.select(MoveId.TERA_STARSTORM, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.TERA_STARSTORM, 1);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    const enemyField = game.scene.getEnemyField();

    // Pokemon other than Terapagos should not be affected - only hits one target
    await game.phaseInterceptor.to("PostActionPhase");
    expect(enemyField.some((pokemon) => pokemon.isFullHp())).toBe(true);

    // Terapagos in Stellar Form should hit both targets
    await game.phaseInterceptor.to("PostActionPhase");
    expect(enemyField.every((pokemon) => pokemon.isFullHp())).toBe(false);
  });
});

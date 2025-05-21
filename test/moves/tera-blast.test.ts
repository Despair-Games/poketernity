import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Tera Blast", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const moveToCheck = allMoves.get(MoveId.TERA_BLAST);

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
      .disableCrits()
      .moveset([MoveId.TERA_BLAST])
      .ability(AbilityId.BALL_FETCH)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyLevel(20);

    vi.spyOn(moveToCheck, "calculateBattlePower");
  });

  it("changes type to match user's tera type", async () => {
    game.override.enemySpecies(SpeciesId.FURRET);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "getMoveEffectiveness");

    const player = game.field.getPlayerPokemon();
    game.field.forceTera(player, ElementalType.FIGHTING);

    game.move.select(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemyPokemon.getMoveEffectiveness).toHaveReturnedWith(2);
  });

  it("increases power if user is Stellar tera type", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    game.field.forceTera(player, ElementalType.STELLAR);

    game.move.select(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(moveToCheck.calculateBattlePower).toHaveReturnedWith(100);
  });

  it("is super effective against terastallized targets if user is Stellar tera type", async () => {
    game.override.forceEnemyTera().teraType(ElementalType.STELLAR);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "getMoveEffectiveness");

    game.move.select(MoveId.TERA_BLAST, 0, BattlerIndex.ENEMY, true); // Terastallize into Stellar type
    await game.toEndOfTurn();

    expect(enemyPokemon.isTerastallized).toBe(true);
    expect(enemyPokemon.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  // Currently abilities are bugged and can't see when a move's category is changed
  it.todo("uses the higher stat of the user's Atk and SpAtk for damage calculation", async () => {
    game.override.enemyAbility(AbilityId.TOXIC_DEBRIS);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    player.stats[Stat.ATK] = 100;
    player.stats[Stat.SPATK] = 1;

    game.move.select(MoveId.TERA_BLAST);
    await game.toEndOfTurn();
    expect(game.field.getEnemyPokemon().waveData.abilitiesApplied).toContain(AbilityId.TOXIC_DEBRIS);
  });

  it("causes stat drops if user is Stellar tera type", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    game.field.forceTera(player, ElementalType.STELLAR);

    game.move.select(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("PostActionPhase");

    expect(player.getStatStage(Stat.SPATK)).toBe(-1);
    expect(player.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should be affected by type-changing abilities (e.g., Aerilate) if user is not Terastallized", async () => {
    game.override.enemySpecies(SpeciesId.FURRET).ability(AbilityId.AERILATE);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "getMoveType");

    game.move.use(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(player.getMoveType).toHaveLastReturnedWith(ElementalType.FLYING);
  });

  it("should NOT be affected by type-changing abilities (e.g., Aerilate) if user is Terastallized", async () => {
    game.override.enemySpecies(SpeciesId.CHIKORITA).ability(AbilityId.AERILATE);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    game.field.forceTera(player, ElementalType.NORMAL);
    vi.spyOn(player, "getMoveType");

    game.move.use(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(player.getMoveType).toHaveLastReturnedWith(ElementalType.NORMAL);
  });
});

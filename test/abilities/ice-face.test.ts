import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Ice Face", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const noiceForm = 1;
  const icefaceForm = 0;

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
    game.override.battleType("single").enemySpecies(SpeciesId.EISCUE).enemyAbility(AbilityId.ICE_FACE);
  });

  it("takes no damage from physical move and transforms to Noice", async () => {
    await game.classicMode.startBattle(SpeciesId.HITMONLEE);

    game.move.use(MoveId.TACKLE);

    await game.phaseInterceptor.to("PostActionPhase");

    const eiscue = game.field.getEnemyPokemon();

    expect(eiscue).toHaveFullHp();
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("takes no damage from the first hit of multihit physical move and transforms to Noice", async () => {
    game.override.enemyLevel(1);
    await game.classicMode.startBattle(SpeciesId.HITMONLEE);

    game.move.use(MoveId.SURGING_STRIKES);

    const eiscue = game.field.getEnemyPokemon();
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeDefined();

    // First hit
    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(eiscue).toHaveFullHp();
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    // Second hit
    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(eiscue).not.toHaveFullHp();
    expect(eiscue.formIndex).toBe(noiceForm);

    await game.phaseInterceptor.to("PostActionPhase");

    expect(eiscue).not.toHaveFullHp();
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("takes damage from special moves", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.move.use(MoveId.ICE_BEAM);

    await game.phaseInterceptor.to("PostActionPhase");

    const eiscue = game.field.getEnemyPokemon();

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue).not.toHaveFullHp();
  });

  it("takes effects from status moves", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.move.use(MoveId.TOXIC_THREAD);

    await game.phaseInterceptor.to("PostActionPhase");

    const eiscue = game.field.getEnemyPokemon();

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
  });

  it("transforms to Ice Face when Hail or Snow starts", async () => {
    game.override.enemyMoveset([MoveId.HAIL, MoveId.HAIL, MoveId.HAIL, MoveId.HAIL]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.move.use(MoveId.QUICK_ATTACK);

    await game.phaseInterceptor.to("PostActionPhase");

    const eiscue = game.field.getEnemyPokemon();

    expect(eiscue).toHaveFullHp();
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    await game.phaseInterceptor.to("PostActionPhase");

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBeNull();
    expect(eiscue.formIndex).toBe(icefaceForm);
  });

  it("transforms to Ice Face when summoned on arena with active Snow or Hail", async () => {
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.EISCUE, SpeciesId.NINJASK);

    game.move.use(MoveId.SNOWSCAPE);

    await game.phaseInterceptor.to("TurnEndPhase");
    let eiscue = game.field.getPlayerPokemon();

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue).toHaveFullHp();

    await game.toNextTurn();
    game.switchPokemon(1);
    await game.toNextTurn();
    game.switchPokemon(1);

    await game.phaseInterceptor.to("QuietFormChangePhase");
    eiscue = game.field.getPlayerPokemon();

    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
  });

  it("will not revert to its Ice Face if there is already Hail when it changes into Noice", async () => {
    game.override.enemySpecies(SpeciesId.SHUCKLE);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.EISCUE);

    game.move.use(MoveId.HAIL);
    const eiscue = game.field.getPlayerPokemon();

    await game.phaseInterceptor.to("QuietFormChangePhase");

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("persists form change when switched out", async () => {
    game.override.enemyMoveset([MoveId.QUICK_ATTACK, MoveId.QUICK_ATTACK, MoveId.QUICK_ATTACK, MoveId.QUICK_ATTACK]);

    await game.classicMode.startBattle(SpeciesId.EISCUE, SpeciesId.MAGIKARP);

    game.move.use(MoveId.SPLASH);

    await game.phaseInterceptor.to("TurnEndPhase");
    let eiscue = game.field.getPlayerPokemon();

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue).toHaveFullHp();

    await game.toNextTurn();
    game.switchPokemon(1);

    await game.phaseInterceptor.to("TurnEndPhase");
    eiscue = game.scene.getPlayerParty()[1];

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("reverts to Ice Face on arena reset", async () => {
    game.override.startingWave(4);
    game.override.startingLevel(4);
    game.override.enemySpecies(SpeciesId.MAGIKARP);
    game.override.starterForms({
      [SpeciesId.EISCUE]: noiceForm,
    });

    await game.classicMode.startBattle(SpeciesId.EISCUE);

    const eiscue = game.field.getPlayerPokemon();

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    game.move.use(MoveId.ICE_BEAM);
    await game.faintOpponents();
    await game.phaseInterceptor.to("TurnEndPhase");
    game.doSelectModifier();
    await game.phaseInterceptor.to("TurnInitPhase");

    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
  });

  it("doesn't trigger if user is behind a substitute", async () => {
    game.override.enemyMoveset(MoveId.SUBSTITUTE).moveset(MoveId.POWER_TRIP);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.use(MoveId.POWER_TRIP);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(game.field.getEnemyPokemon().formIndex).toBe(icefaceForm);
  });

  it("cannot be suppressed", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.move.use(MoveId.GASTRO_ACID);

    await game.phaseInterceptor.to("TurnEndPhase");

    const eiscue = game.field.getEnemyPokemon();

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.summonData.abilitySuppressed).toBe(false);
  });

  it("cannot be swapped with another ability", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.move.use(MoveId.SKILL_SWAP);

    await game.phaseInterceptor.to("TurnEndPhase");

    const eiscue = game.field.getEnemyPokemon();

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.hasAbility(AbilityId.ICE_FACE)).toBe(true);
  });

  it("cannot be copied", async () => {
    game.override.ability(AbilityId.TRACE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.move.use(MoveId.SIMPLE_BEAM);

    await game.phaseInterceptor.to("TurnInitPhase");

    const eiscue = game.field.getEnemyPokemon();

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(game.field.getPlayerPokemon().hasAbility(AbilityId.TRACE)).toBe(true);
  });
});

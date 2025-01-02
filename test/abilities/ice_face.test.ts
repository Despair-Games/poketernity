import { BattlerIndex } from "#app/battle";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
    game.overridesHelper.battleType("single");
    game.overridesHelper.enemySpecies(Species.EISCUE);
    game.overridesHelper.enemyAbility(Abilities.ICE_FACE);
    game.overridesHelper.moveset([Moves.TACKLE, Moves.ICE_BEAM, Moves.TOXIC_THREAD, Moves.HAIL]);
  });

  it("takes no damage from physical move and transforms to Noice", async () => {
    await game.classicModeHelper.startBattle([Species.HITMONLEE]);

    game.moveHelper.select(Moves.TACKLE);

    await game.phaseInterceptor.to(MoveEndPhase);

    const eiscue = game.scene.getEnemyPokemon()!;

    expect(eiscue.isFullHp()).toBe(true);
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("takes no damage from the first hit of multihit physical move and transforms to Noice", async () => {
    game.overridesHelper.moveset([Moves.SURGING_STRIKES]);
    game.overridesHelper.enemyLevel(1);
    await game.classicModeHelper.startBattle([Species.HITMONLEE]);

    game.moveHelper.select(Moves.SURGING_STRIKES);

    const eiscue = game.scene.getEnemyPokemon()!;
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeDefined();

    // First hit
    await game.phaseInterceptor.to(MoveEffectPhase);
    expect(eiscue.isFullHp()).toBe(true);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    // Second hit
    await game.phaseInterceptor.to(MoveEffectPhase);
    expect(eiscue.hp).lessThan(eiscue.getMaxHp());
    expect(eiscue.formIndex).toBe(noiceForm);

    await game.phaseInterceptor.to(MoveEndPhase);

    expect(eiscue.hp).lessThan(eiscue.getMaxHp());
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("takes damage from special moves", async () => {
    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.ICE_BEAM);

    await game.phaseInterceptor.to(MoveEndPhase);

    const eiscue = game.scene.getEnemyPokemon()!;

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.hp).toBeLessThan(eiscue.getMaxHp());
  });

  it("takes effects from status moves", async () => {
    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.TOXIC_THREAD);

    await game.phaseInterceptor.to(MoveEndPhase);

    const eiscue = game.scene.getEnemyPokemon()!;

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
  });

  it("transforms to Ice Face when Hail or Snow starts", async () => {
    game.overridesHelper.moveset([Moves.QUICK_ATTACK]);
    game.overridesHelper.enemyMoveset([Moves.HAIL, Moves.HAIL, Moves.HAIL, Moves.HAIL]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.QUICK_ATTACK);

    await game.phaseInterceptor.to(MoveEndPhase);

    const eiscue = game.scene.getEnemyPokemon()!;

    expect(eiscue.isFullHp()).toBe(true);
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    await game.phaseInterceptor.to(MoveEndPhase);

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBeNull();
    expect(eiscue.formIndex).toBe(icefaceForm);
  });

  it("transforms to Ice Face when summoned on arena with active Snow or Hail", async () => {
    game.overridesHelper.enemyMoveset([Moves.TACKLE, Moves.TACKLE, Moves.TACKLE, Moves.TACKLE]);
    game.overridesHelper.moveset([Moves.SNOWSCAPE]);

    await game.classicModeHelper.startBattle([Species.EISCUE, Species.NINJASK]);

    game.moveHelper.select(Moves.SNOWSCAPE);

    await game.phaseInterceptor.to(TurnEndPhase);
    let eiscue = game.scene.getPlayerPokemon()!;

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.isFullHp()).toBe(true);

    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    game.doSwitchPokemon(1);

    await game.phaseInterceptor.to(QuietFormChangePhase);
    eiscue = game.scene.getPlayerPokemon()!;

    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
  });

  it("will not revert to its Ice Face if there is already Hail when it changes into Noice", async () => {
    game.overridesHelper.enemySpecies(Species.SHUCKLE);
    game.overridesHelper.enemyMoveset([Moves.TACKLE, Moves.TACKLE, Moves.TACKLE, Moves.TACKLE]);

    await game.classicModeHelper.startBattle([Species.EISCUE]);

    game.moveHelper.select(Moves.HAIL);
    const eiscue = game.scene.getPlayerPokemon()!;

    await game.phaseInterceptor.to(QuietFormChangePhase);

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("persists form change when switched out", async () => {
    game.overridesHelper.enemyMoveset([Moves.QUICK_ATTACK, Moves.QUICK_ATTACK, Moves.QUICK_ATTACK, Moves.QUICK_ATTACK]);

    await game.classicModeHelper.startBattle([Species.EISCUE, Species.MAGIKARP]);

    game.moveHelper.select(Moves.ICE_BEAM);

    await game.phaseInterceptor.to(TurnEndPhase);
    let eiscue = game.scene.getPlayerPokemon()!;

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.isFullHp()).toBe(true);

    await game.toNextTurn();
    game.doSwitchPokemon(1);

    await game.phaseInterceptor.to(TurnEndPhase);
    eiscue = game.scene.getPlayerParty()[1];

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();
  });

  it("reverts to Ice Face on arena reset", async () => {
    game.overridesHelper.startingWave(4);
    game.overridesHelper.startingLevel(4);
    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.starterForms({
      [Species.EISCUE]: noiceForm,
    });

    await game.classicModeHelper.startBattle([Species.EISCUE]);

    const eiscue = game.scene.getPlayerPokemon()!;

    expect(eiscue.formIndex).toBe(noiceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).toBeUndefined();

    game.moveHelper.select(Moves.ICE_BEAM);
    await game.doKillOpponents();
    await game.phaseInterceptor.to(TurnEndPhase);
    game.doSelectModifier();
    await game.phaseInterceptor.to(TurnInitPhase);

    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
  });

  it("doesn't trigger if user is behind a substitute", async () => {
    game.overridesHelper.enemyMoveset(Moves.SUBSTITUTE).moveset(Moves.POWER_TRIP);
    await game.classicModeHelper.startBattle();

    game.moveHelper.select(Moves.POWER_TRIP);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(game.scene.getEnemyPokemon()!.formIndex).toBe(icefaceForm);
  });

  it("cannot be suppressed", async () => {
    game.overridesHelper.moveset([Moves.GASTRO_ACID]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.GASTRO_ACID);

    await game.phaseInterceptor.to(TurnEndPhase);

    const eiscue = game.scene.getEnemyPokemon()!;

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.summonData.abilitySuppressed).toBe(false);
  });

  it("cannot be swapped with another ability", async () => {
    game.overridesHelper.moveset([Moves.SKILL_SWAP]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.SKILL_SWAP);

    await game.phaseInterceptor.to(TurnEndPhase);

    const eiscue = game.scene.getEnemyPokemon()!;

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(eiscue.hasAbility(Abilities.ICE_FACE)).toBe(true);
  });

  it("cannot be copied", async () => {
    game.overridesHelper.ability(Abilities.TRACE);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.SIMPLE_BEAM);

    await game.phaseInterceptor.to(TurnInitPhase);

    const eiscue = game.scene.getEnemyPokemon()!;

    expect(eiscue.getTag(BattlerTagType.ICE_FACE)).not.toBe(undefined);
    expect(eiscue.formIndex).toBe(icefaceForm);
    expect(game.scene.getPlayerPokemon()!.hasAbility(Abilities.TRACE)).toBe(true);
  });
});

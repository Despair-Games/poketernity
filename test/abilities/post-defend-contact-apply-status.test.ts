import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { type PostDefendContactApplyStatusEffectAbAttr } from "#app/data/abilities/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { StatusEffect } from "#enums/status-effect";
import { ElementalType } from "#enums/elemental-type";
import { AbAttrFlag } from "#enums/ab-attr-flag";

describe("Abilities - Flame Body/Poison Point/Static", () => {
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
      .moveset([MoveId.SPLASH])
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  it.each([
    { abilityName: "Flame Body", ability: AbilityId.FLAME_BODY, status: StatusEffect.BURN },
    { abilityName: "Poison Point", ability: AbilityId.POISON_POINT, status: StatusEffect.POISON },
    { abilityName: "Static", ability: AbilityId.STATIC, status: StatusEffect.PARALYSIS },
  ])("$abilityName should status an attacking, applicable Pokemon if contact is made", async ({ ability, status }) => {
    game.override.ability(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();
    vi.spyOn(
      pokemon!
        .getAbility()
        .getAttrs<PostDefendContactApplyStatusEffectAbAttr>(AbAttrFlag.POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT)[0],
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.TACKLE);
    await game.toEndOfTurn();

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.getStatusEffect(true)).toBe(status);
  });

  it.each([
    { abilityName: "Poison Point", ability: AbilityId.POISON_POINT, status: StatusEffect.POISON },
    { abilityName: "Static", ability: AbilityId.STATIC, status: StatusEffect.PARALYSIS },
    { abilityName: "Flame Body", ability: AbilityId.FLAME_BODY, status: StatusEffect.BURN },
  ])("$abilityName should not activate from a non-contact attack", async ({ ability }) => {
    game.override.ability(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();
    vi.spyOn(
      pokemon!
        .getAbility()
        .getAttrs<PostDefendContactApplyStatusEffectAbAttr>(AbAttrFlag.POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT)[0],
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });

  it("Static can paralyze a Ground-type Pokemon", async () => {
    game.override.ability(AbilityId.STATIC).enemySpecies(SpeciesId.DIGLETT);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(
      pokemon!
        .getAbility()
        .getAttrs<PostDefendContactApplyStatusEffectAbAttr>(AbAttrFlag.POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT)[0],
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.TACKLE);
    await game.toEndOfTurn();

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.getTypes()).toContain(ElementalType.GROUND);
    expect(attacker?.getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
  });
});

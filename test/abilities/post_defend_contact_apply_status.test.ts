import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { PostDefendContactApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { StatusEffect } from "#enums/status-effect";
import { Type } from "#enums/type";

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
      .moveset([Moves.SPLASH])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([Moves.TACKLE, Moves.WATER_GUN]);
  });

  it.each([
    { abilityName: "Flame Body", ability: Abilities.FLAME_BODY, status: StatusEffect.BURN },
    { abilityName: "Poison Point", ability: Abilities.POISON_POINT, status: StatusEffect.POISON },
    { abilityName: "Static", ability: Abilities.STATIC, status: StatusEffect.PARALYSIS },
  ])("$abilityName should status an attacking, applicable Pokemon if contact is made", async ({ ability, status }) => {
    game.override.ability(ability);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();
    vi.spyOn(
      pokemon
        ?.getAbility()
        .getAttrs(PostDefendContactApplyStatusEffectAbAttr)[0] as PostDefendContactApplyStatusEffectAbAttr,
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.status?.effect).toBe(status);
  });

  it.each([
    { abilityName: "Poison Point", ability: Abilities.POISON_POINT, status: StatusEffect.POISON },
    { abilityName: "Static", ability: Abilities.STATIC, status: StatusEffect.PARALYSIS },
    { abilityName: "Flame Body", ability: Abilities.FLAME_BODY, status: StatusEffect.BURN },
  ])("$abilityName should not activate from a non-contact attack", async ({ ability }) => {
    game.override.ability(ability);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();
    vi.spyOn(
      pokemon
        ?.getAbility()
        .getAttrs(PostDefendContactApplyStatusEffectAbAttr)[0] as PostDefendContactApplyStatusEffectAbAttr,
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.WATER_GUN);
    await game.phaseInterceptor.to("BerryPhase");

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.status).toBeUndefined();
  });

  it("Static can paralyze a Ground-type Pokemon", async () => {
    game.override.ability(Abilities.STATIC).enemySpecies(Species.DIGLETT);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(
      pokemon
        ?.getAbility()
        .getAttrs(PostDefendContactApplyStatusEffectAbAttr)[0] as PostDefendContactApplyStatusEffectAbAttr,
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.getTypes()).toContain(Type.GROUND);
    expect(attacker?.status?.effect).toBe(StatusEffect.PARALYSIS);
  });
});

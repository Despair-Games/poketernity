import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { revealAllAbilities } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Psycho Shift", () => {
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
      .enemyMoveset([MoveId.PSYCHO_SHIFT, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be avoided when the user does not have a status effect", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.PSYCHO_SHIFT);
  });

  it.each([
    ["asleep", StatusEffect.SLEEP],
    ["frozen", StatusEffect.FREEZE],
  ])("should be avoided when the user is %s", async (_, effect) => {
    game.override.enemyStatusEffect(effect);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.PSYCHO_SHIFT);
  });

  describe.each([
    {
      effectName: "Poison",
      effect: StatusEffect.POISON,
      controlMove: MoveId.POISON_GAS,
      immuneTypeName: "Poison",
      immuneSpecies: SpeciesId.GRIMER,
      immuneAbilityName: "Immunity",
      immuneAbilityId: AbilityId.IMMUNITY,
    },
    {
      effectName: "Burn",
      effect: StatusEffect.BURN,
      controlMove: MoveId.WILL_O_WISP,
      immuneTypeName: "Fire",
      immuneSpecies: SpeciesId.SLUGMA,
      immuneAbilityName: "Water Veil",
      immuneAbilityId: AbilityId.WATER_VEIL,
    },
    {
      effectName: "Paralysis",
      effect: StatusEffect.PARALYSIS,
      controlMove: MoveId.THUNDER_WAVE,
      immuneTypeName: "Electric",
      immuneSpecies: SpeciesId.PIKACHU,
      immuneAbilityName: "Limber",
      immuneAbilityId: AbilityId.LIMBER,
    },
  ])(
    "Transferring $effectName",
    ({ effectName, effect, controlMove, immuneTypeName, immuneSpecies, immuneAbilityName, immuneAbilityId }) => {
      beforeEach(() => {
        game.override.enemyStatusEffect(effect).enemyMoveset([MoveId.PSYCHO_SHIFT, controlMove, MoveId.TACKLE]);
      });

      it(`should be strongly preferred when the user can transfer ${effectName} to an opponent`, async () => {
        await game.classicMode.startBattle(SpeciesId.MAGIKARP);

        const enemy = game.field.getEnemyPokemon();
        expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.PSYCHO_SHIFT);
      });

      it(`should be avoided when the opponent is ${immuneTypeName}-type`, async () => {
        await game.classicMode.startBattle(immuneSpecies);

        const enemy = game.field.getEnemyPokemon();
        expect(enemy).toNeverSelectMove(MoveId.PSYCHO_SHIFT);
      });

      it(`should be avoided when the opponent has ${immuneAbilityName}`, async () => {
        game.override.ability(immuneAbilityId);

        await game.classicMode.startBattle(SpeciesId.MAGIKARP);
        revealAllAbilities(game.scene);

        const enemy = game.field.getEnemyPokemon();
        expect(enemy).toNeverSelectMove(MoveId.PSYCHO_SHIFT);
      });

      it(`should be avoided when the opponent is already afflicted with ${effectName}`, async () => {
        game.override.statusEffect(effect);

        await game.classicMode.startBattle(SpeciesId.MAGIKARP);

        const enemy = game.field.getEnemyPokemon();
        expect(enemy).toNeverSelectMove(MoveId.PSYCHO_SHIFT);
      });

      it("should be avoided when the opponent is under the effects of Safeguard", async () => {
        await game.classicMode.startBattle(SpeciesId.MAGIKARP);

        game.scene.arena.addTag(ArenaTagType.SAFEGUARD, 0, 1, MoveId.NONE, ArenaTagSide.PLAYER, true);

        const enemy = game.field.getEnemyPokemon();
        expect(enemy).toNeverSelectMove(MoveId.PSYCHO_SHIFT);
      });
    },
  );
});

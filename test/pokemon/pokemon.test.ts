import { SpeciesId } from "#enums/species-id";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GameManager } from "#test/test-utils/gameManager";
import { PokeballType } from "#enums/pokeball-type";
import type BattleScene from "#app/battle-scene";
import { MoveId } from "#enums/move-id";
import { AbilityId } from "#enums/ability-id";

describe("Spec - Pokemon", () => {
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
  });

  describe("Add To Party", () => {
    let scene: BattleScene;

    beforeEach(async () => {
      game.override.enemySpecies(SpeciesId.ZUBAT);
      await game.classicMode.runToSummon([
        SpeciesId.ABRA,
        SpeciesId.ABRA,
        SpeciesId.ABRA,
        SpeciesId.ABRA,
        SpeciesId.ABRA,
      ]); // 5 Abra, only 1 slot left
      scene = game.scene;
    });

    it("should append a new pokemon by default", async () => {
      const zubat = scene.getEnemyPokemon()!;
      zubat.addToParty(PokeballType.POKEBALL);

      const party = scene.getPlayerParty();
      expect(party).toHaveLength(6);
      party.forEach((pkm, index) => {
        expect(pkm.species.speciesId).toBe(index === 5 ? SpeciesId.ZUBAT : SpeciesId.ABRA);
      });
    });

    it("should put a new pokemon into the passed slotIndex", async () => {
      const slotIndex = 1;
      const zubat = scene.getEnemyPokemon()!;
      zubat.addToParty(PokeballType.POKEBALL, slotIndex);

      const party = scene.getPlayerParty();
      expect(party).toHaveLength(6);
      party.forEach((pkm, index) => {
        expect(pkm.species.speciesId).toBe(index === slotIndex ? SpeciesId.ZUBAT : SpeciesId.ABRA);
      });
    });
  });

  it("should not share tms between different forms", async () => {
    game.override.starterForms({ [SpeciesId.ROTOM]: 4 });

    await game.classicMode.startBattle([SpeciesId.ROTOM]);

    const fanRotom = game.scene.getPlayerPokemon()!;

    expect(fanRotom.compatibleTms).not.toContain(MoveId.BLIZZARD);
    expect(fanRotom.compatibleTms).toContain(MoveId.AIR_SLASH);
  });

  it("should provide Eevee with 3 defined abilities", async () => {
    await game.classicMode.runToSummon([SpeciesId.EEVEE]);
    const eevee = game.scene.getPlayerPokemon()!;

    expect(eevee.getSpeciesForm().getAbilityCount()).toBe(3);

    expect(eevee.getSpeciesForm().getAbility(0)).toBe(AbilityId.RUN_AWAY);
    expect(eevee.getSpeciesForm().getAbility(1)).toBe(AbilityId.ADAPTABILITY);
    expect(eevee.getSpeciesForm().getAbility(2)).toBe(AbilityId.ANTICIPATION);
  });

  it("should set Eeeve abilityIndex between 0-2", async () => {
    await game.classicMode.runToSummon([SpeciesId.EEVEE]);
    const eevee = game.scene.getPlayerPokemon()!;

    expect(eevee.abilityIndex).toBeGreaterThanOrEqual(0);
    expect(eevee.abilityIndex).toBeLessThanOrEqual(2);
  });
});

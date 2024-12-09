import { Species } from "#enums/species";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import GameManager from "#test/testUtils/gameManager";
import { PokeballType } from "#enums/pokeball";
import type BattleScene from "#app/battle-scene";
import { Moves } from "#enums/moves";
import { Abilities } from "#app/enums/abilities";

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

  it("should not crash when trying to set status of undefined", async () => {
    await game.classicMode.runToSummon([Species.ABRA]);

    const pkm = game.scene.getPlayerPokemon()!;
    expect(pkm).toBeDefined();

    expect(pkm.trySetStatus(undefined)).toBe(true);
  });

  describe("Add To Party", () => {
    let scene: BattleScene;

    beforeEach(async () => {
      game.override.enemySpecies(Species.ZUBAT);
      await game.classicMode.runToSummon([Species.ABRA, Species.ABRA, Species.ABRA, Species.ABRA, Species.ABRA]); // 5 Abra, only 1 slot left
      scene = game.scene;
    });

    it("should append a new pokemon by default", async () => {
      const zubat = scene.getEnemyPokemon()!;
      zubat.addToParty(PokeballType.POKEBALL);

      const party = scene.getPlayerParty();
      expect(party).toHaveLength(6);
      party.forEach((pkm, index) => {
        expect(pkm.species.speciesId).toBe(index === 5 ? Species.ZUBAT : Species.ABRA);
      });
    });

    it("should put a new pokemon into the passed slotIndex", async () => {
      const slotIndex = 1;
      const zubat = scene.getEnemyPokemon()!;
      zubat.addToParty(PokeballType.POKEBALL, slotIndex);

      const party = scene.getPlayerParty();
      expect(party).toHaveLength(6);
      party.forEach((pkm, index) => {
        expect(pkm.species.speciesId).toBe(index === slotIndex ? Species.ZUBAT : Species.ABRA);
      });
    });
  });

  it("should not share tms between different forms", async () => {
    game.override.starterForms({ [Species.ROTOM]: 4 });

    await game.classicMode.startBattle([Species.ROTOM]);

    const fanRotom = game.scene.getPlayerPokemon()!;

    expect(fanRotom.compatibleTms).not.toContain(Moves.BLIZZARD);
    expect(fanRotom.compatibleTms).toContain(Moves.AIR_SLASH);
  });

  it("should provide Eevee with 3 defined abilities", async () => {
    await game.classicMode.runToSummon([Species.EEVEE]);
    const eevee = game.scene.getPlayerPokemon()!;

    expect(eevee.getSpeciesForm().getAbilityCount()).toBe(3);

    expect(eevee.getSpeciesForm().getAbility(0)).toBe(Abilities.RUN_AWAY);
    expect(eevee.getSpeciesForm().getAbility(1)).toBe(Abilities.ADAPTABILITY);
    expect(eevee.getSpeciesForm().getAbility(2)).toBe(Abilities.ANTICIPATION);
  });

  it("should set Eeeve abilityIndex between 0-2", async () => {
    await game.classicMode.runToSummon([Species.EEVEE]);
    const eevee = game.scene.getPlayerPokemon()!;

    expect(eevee.abilityIndex).toBeGreaterThanOrEqual(0);
    expect(eevee.abilityIndex).toBeLessThanOrEqual(2);
  });
});

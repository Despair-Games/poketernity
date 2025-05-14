import * as Messages from "#app/messages";
import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TrainerSlot } from "#enums/trainer-slot";
import { GameManager } from "#test/test-utils/game-manager";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

function testMoveEffectiveness(
  game: GameManager,
  moveId: MoveId,
  targetSpecies: SpeciesId,
  expected: number,
  targetAbility: AbilityId = AbilityId.BALL_FETCH,
  teraType?: ElementalType,
): void {
  // Suppress getPokemonNameWithAffix because it calls on a null battle spec
  vi.spyOn(Messages, "getPokemonNameWithAffix").mockReturnValue("");
  game.override.enemyAbility(targetAbility);

  const user = game.scene.addPlayerPokemon(getPokemonSpecies(SpeciesId.SNORLAX), 5);
  const target = game.scene.addEnemyPokemon(getPokemonSpecies(targetSpecies), 5, TrainerSlot.NONE);

  if (teraType !== undefined) {
    game.field.forceTera(target, teraType);
  }

  expect(target.getMoveEffectiveness(user, allMoves.get(moveId))).toBe(expected);
  user.destroy();
  target.destroy();
}

describe("Moves - Type Effectiveness", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    game = new GameManager(phaserGame);

    game.override.ability(AbilityId.BALL_FETCH);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  it("Normal-type attacks are neutrally effective against primary Normal-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.TACKLE, SpeciesId.SNORLAX, 1));

  it("Normal-type attacks are not very effective against primary Steel-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.TACKLE, SpeciesId.REGISTEEL, 0.5));

  it("Normal-type attacks are doubly resisted by Steel/Rock-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.TACKLE, SpeciesId.AGGRON, 0.25));

  it("Normal-type attacks have no effect on primary Ghost-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.TACKLE, SpeciesId.DUSCLOPS, 0));

  it("Normal-type status moves are not affected by type matchups", () =>
    testMoveEffectiveness(game, MoveId.GROWL, SpeciesId.DUSCLOPS, 1));

  it("Ghost-type attacks have no effect on primary Normal-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.SHADOW_BALL, SpeciesId.SNORLAX, 0));

  it("Ghost-type attacks have no effect on secondary Normal-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.SHADOW_BALL, SpeciesId.URSALUNA, 0));

  it("Electric-type attacks are super-effective against primary Water-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.THUNDERBOLT, SpeciesId.BLASTOISE, 2));

  it("Electric-type attacks are doubly super-effective against Water/Flying-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.THUNDERBOLT, SpeciesId.GYARADOS, 4));

  it("Electric-type attacks are negated by Volt Absorb", () =>
    testMoveEffectiveness(game, MoveId.THUNDERBOLT, SpeciesId.GYARADOS, 0, AbilityId.VOLT_ABSORB));

  it("Electric-type attacks are super-effective against Tera-Water Pokemon", () =>
    testMoveEffectiveness(game, MoveId.THUNDERBOLT, SpeciesId.EXCADRILL, 2, AbilityId.BALL_FETCH, ElementalType.WATER));

  it("Powder moves have no effect on primary Grass-type Pokemon", () =>
    testMoveEffectiveness(game, MoveId.SLEEP_POWDER, SpeciesId.AMOONGUSS, 0));

  it("Powder moves have no effect on Tera-Grass Pokemon", () =>
    testMoveEffectiveness(game, MoveId.SLEEP_POWDER, SpeciesId.SNORLAX, 0, AbilityId.BALL_FETCH, ElementalType.GRASS));

  it("Prankster-boosted status moves have no effect on primary Dark-type Pokemon", () => {
    game.override.ability(AbilityId.PRANKSTER);
    testMoveEffectiveness(game, MoveId.BABY_DOLL_EYES, SpeciesId.MIGHTYENA, 0);
  });

  it("Prankster-boosted status moves have no effect on Tera-Dark Pokemon", () => {
    game.override.ability(AbilityId.PRANKSTER);
    testMoveEffectiveness(game, MoveId.BABY_DOLL_EYES, SpeciesId.SNORLAX, 0, AbilityId.BALL_FETCH, ElementalType.DARK);
  });
});

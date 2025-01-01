import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { FieldPhase } from "./abstract-field-phase";

// TODO: Delete this class and replace its uses with `PokemonPhase`
export abstract class PartyMemberPokemonPhase extends FieldPhase {
  protected partyMemberIndex: number;
  protected fieldIndex: number;
  protected isPlayer: boolean;

  constructor(partyMemberIndex: number, isPlayer: boolean) {
    super();

    this.partyMemberIndex = partyMemberIndex;
    this.fieldIndex = partyMemberIndex < globalScene.currentBattle.getBattlerCount() ? partyMemberIndex : -1;
    this.isPlayer = isPlayer;
  }

  public getAlliedParty(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
  }

  public getOpposingParty(): Pokemon[] {
    return this.isPlayer ? globalScene.getEnemyParty() : globalScene.getPlayerParty();
  }

  public getAlliedField(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerField() : globalScene.getEnemyField();
  }

  public getOpposingField(): Pokemon[] {
    return this.isPlayer ? globalScene.getEnemyField() : globalScene.getPlayerField();
  }

  public getPokemon(): Pokemon {
    return this.getAlliedParty()[this.partyMemberIndex];
  }
}

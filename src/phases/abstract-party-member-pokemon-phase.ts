import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { FieldPhase } from "./abstract-field-phase";

export abstract class PartyMemberPokemonPhase extends FieldPhase {
  protected partyMemberIndex: number;
  protected fieldIndex: number;
  protected isPlayer: boolean;

  constructor(partyMemberIndex: number, player: boolean) {
    super();

    this.partyMemberIndex = partyMemberIndex;
    this.fieldIndex = partyMemberIndex < globalScene.currentBattle.getBattlerCount() ? partyMemberIndex : -1;
    this.isPlayer = player;
  }

  public getParty(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
  }

  public getField(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerField() : globalScene.getEnemyField();
  }

  public getOpposingField(): Pokemon[] {
    return this.isPlayer ? globalScene.getEnemyField() : globalScene.getPlayerField();
  }

  public getPokemon(): Pokemon {
    return this.getParty()[this.partyMemberIndex];
  }
}

import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { FieldPhase } from "./field-phase";

export abstract class PartyMemberPokemonPhase extends FieldPhase {
  protected partyMemberIndex: number;
  protected fieldIndex: number;
  protected player: boolean;

  constructor(partyMemberIndex: number, player: boolean) {
    super();

    this.partyMemberIndex = partyMemberIndex;
    this.fieldIndex = partyMemberIndex < globalScene.currentBattle.getBattlerCount() ? partyMemberIndex : -1;
    this.player = player;
  }

  public getParty(): Pokemon[] {
    return this.player ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
  }

  public getPokemon(): Pokemon {
    return this.getParty()[this.partyMemberIndex];
  }
}

import type { PlayerPokemon } from "#app/field/pokemon";
import { PartyMemberPokemonPhase } from "./abstract-party-member-pokemon-phase";

export abstract class PlayerPartyMemberPokemonPhase extends PartyMemberPokemonPhase {
  constructor(partyMemberIndex: number) {
    super(partyMemberIndex, true);
  }

  public getPlayerPokemon(): PlayerPokemon {
    return super.getPokemon() as PlayerPokemon;
  }
}

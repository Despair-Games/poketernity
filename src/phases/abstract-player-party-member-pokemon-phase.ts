import type { PlayerPokemon } from "#app/field/pokemon";
import { PartyMemberPokemonPhase } from "./abstract-party-member-pokemon-phase";

// TODO: Delete this phase and replace it with PokemonPhase
export abstract class PlayerPartyMemberPokemonPhase extends PartyMemberPokemonPhase {
  constructor(partyMemberIndex: number) {
    super(partyMemberIndex, true);
  }

  public getPlayerPokemon(): PlayerPokemon {
    return super.getPokemon() as PlayerPokemon;
  }
}

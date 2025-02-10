import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PhaseId } from "#enums/phase-id";

/**
 * Provides EXP to the player's party *without* doing any Pokemon defeated checks or queueing extraneous post-battle phases.
 *
 * Intended to be used as a more 1-off phase to provide exp to the party (such as during MEs), rather than cleanup a battle entirely.
 *
 * @extends Phase
 */
export class PartyExpPhase extends Phase {
  override readonly id = PhaseId.PARTY_EXP;

  protected readonly expValue: number;
  protected readonly useWaveIndexMultiplier?: boolean;
  protected readonly pokemonParticipantIds?: Set<number>;

  constructor(expValue: number, useWaveIndexMultiplier?: boolean, pokemonParticipantIds?: Set<number>) {
    super();

    this.expValue = expValue;
    this.useWaveIndexMultiplier = useWaveIndexMultiplier;
    this.pokemonParticipantIds = pokemonParticipantIds;
  }

  public override start(): void {
    super.start();

    globalScene.applyPartyExp(this.expValue, false, this.useWaveIndexMultiplier, this.pokemonParticipantIds);

    this.end();
  }
}

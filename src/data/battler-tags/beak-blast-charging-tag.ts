import { MoveChargeAnim } from "#animations/move-charge-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { getMoveEffectPhaseData } from "#battler-tags/get-move-effect-phase-data";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ChargeAnim } from "#enums/charge-anim";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Tag representing the "charge phase" of Beak Blast.
 * Pokemon with this tag will burn any attacker that makes contact with it.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Beak_Blast_(move) | Beak Blast}
 */
export class BeakBlastChargingTag extends BattlerTag {
  constructor() {
    super(
      BattlerTagType.BEAK_BLAST_CHARGING,
      [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.TURN_END, BattlerTagLapseType.AFTER_HIT],
      1,
      MoveId.BEAK_BLAST,
    );
  }

  override onAdd(pokemon: Pokemon): void {
    // Play Beak Blast's charging animation
    new MoveChargeAnim(ChargeAnim.BEAK_BLAST_CHARGING, this.sourceMoveId, pokemon).play();

    // Queue Beak Blast's header message
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:startedHeatingUpBeak", { pokemonName: getPokemonNameWithAffix(pokemon) }),
    );
  }

  /**
   * Inflicts `BURN` status on attackers that make contact, and causes this tag
   * to be removed after the source makes a move (or the turn ends, whichever comes first)
   * @param pokemon {@linkcode Pokemon} the owner of this tag
   * @param lapseType {@linkcode BattlerTagLapseType} the type of functionality invoked in battle
   * @returns `true` if invoked with the `AFTER_HIT` lapse type
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.AFTER_HIT) {
      const phaseData = getMoveEffectPhaseData(pokemon);
      if (phaseData?.move.checkFlag(MoveFlags.MAKES_CONTACT, pokemon)) {
        phaseData.attacker.trySetStatus(StatusEffect.BURN, true, pokemon);
      }
      return true;
    }
    return super.lapse(pokemon, lapseType);
  }
}

import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

/**
 * Attribute to damage all sleeping opponents by 1/8 of their max hp at the end of turn.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Bad_Dreams_(Ability) | Bad Dreams (Bulbapedia)}.
 */
// TODO: This should extend `PostTurnAbAttr` but currently does not as a workaround until proper ability timing is implemented.
export class BadDreamsAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BadDreamsAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    for (const opponent of inSpeedOrder(pokemon.getOpposingArenaTagSide())) {
      const isAsleep = opponent.hasStatusEffect(StatusEffect.SLEEP);
      const blocksNonDirectDamage = opponent.hasAbilityWithAttr("BlockNonDirectDamageAbAttr");

      if ((isAsleep || this.willFallAsleep(opponent)) && !blocksNonDirectDamage && !opponent.switchOutStatus) {
        opponent.damageAndUpdate(toDmgValue(opponent.getMaxHp() / 8), { result: HitResult.OTHER });
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("abilityTriggers:badDreams", { pokemonName: getPokemonNameWithAffix(opponent) }),
        );
      }
    }
  }

  public override canApply({ pokemon, simulated }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.getOpponents().some((opponent) => {
      const isAsleep = opponent.hasStatusEffect(StatusEffect.SLEEP);

      return (
        (isAsleep || this.willFallAsleep(opponent, simulated))
        && !opponent.hasAbilityWithAttr("BlockNonDirectDamageAbAttr")
        && !opponent.switchOutStatus
      );
    });
  }

  // TODO: Workaround because Drowsy sets the sleep status AFTER applying bad dreams due to "asPhase = true"
  private willFallAsleep(opponent: Pokemon, quiet: boolean = true): boolean {
    // TODO: investigate when the `quiet` parameter of `canSetStatus()` should be `true`
    return opponent.getTag(BattlerTagType.DROWSY)?.turnCount === 1 && opponent.canSetStatus(StatusEffect.SLEEP, quiet);
  }
}

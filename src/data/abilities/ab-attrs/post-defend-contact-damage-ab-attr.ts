import { PostDefendAbAttr } from "#app/data/abilities/ab-attrs/post-defend-ab-attr";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import { MoveFlags } from "#enums/move-flags";
import i18next from "i18next";

export class PostDefendContactDamageAbAttr extends PostDefendAbAttr {
  private readonly damageRatio: number;

  constructor(damageRatio: number) {
    super();

    this.damageRatio = damageRatio;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (
      !simulated
      && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.hasAbilityWithAttr(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE)
    ) {
      attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio)), {
        result: HitResult.OTHER,
      });
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postDefendContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}

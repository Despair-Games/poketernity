import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { HitResult } from "#enums/hit-result";
import { MoveFlags } from "#enums/move-flags";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

export class PostDefendContactDamageAbAttr extends PostDefendAbAttr {
  private readonly damageRatio: number;

  constructor(damageRatio: number) {
    super();

    this.damageRatio = damageRatio;
  }

  public override apply({ simulated, attacker }: PostDefendAbAttrParams): void {
    if (!simulated) {
      attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio)), { result: HitResult.OTHER });
    }
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.hasAbilityWithAttr("BlockNonDirectDamageAbAttr")
    );
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}

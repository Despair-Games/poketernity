import { applyAbAttrs } from "#app/data/ability";
import type Move from "#app/data/move";
import { MoveFlags } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue } from "#app/utils";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "./block-non-direct-damage-ab-attr";
import { FieldPreventExplosionLikeAbAttr } from "./field-prevent-explosion-like-ab-attr";
import { PostFaintAbAttr } from "./post-faint-ab-attr";

export class PostFaintContactDamageAbAttr extends PostFaintAbAttr {
  private readonly damageRatio: number;

  constructor(damageRatio: number) {
    super();

    this.damageRatio = damageRatio;
  }

  override applyPostFaint(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker?: Pokemon,
    move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    if (move && attacker && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)) {
      //If the mon didn't die to indirect damage
      const cancelled = new BooleanHolder(false);
      globalScene.getField(true).map((p) => applyAbAttrs(FieldPreventExplosionLikeAbAttr, p, cancelled, simulated));
      applyAbAttrs(BlockNonDirectDamageAbAttr, attacker, cancelled, simulated);
      if (cancelled.value) {
        return false;
      }
      if (!simulated) {
        attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio)), HitResult.OTHER);
        // TODO: This should be handled by `damage()`
        attacker.turnData.damageTaken += toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio));
      }
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postFaintContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}

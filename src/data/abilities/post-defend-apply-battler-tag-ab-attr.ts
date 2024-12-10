import type { BattlerTagType } from "#app/enums/battler-tag-type";
import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { PokemonDefendCondition } from "../ability";
import type Move from "../move";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendApplyBattlerTagAbAttr extends PostDefendAbAttr {
  private condition: PokemonDefendCondition;
  private tagType: BattlerTagType;
  constructor(condition: PokemonDefendCondition, tagType: BattlerTagType) {
    super(true);

    this.condition = condition;
    this.tagType = tagType;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (this.condition(pokemon, attacker, move) && !move.hitsSubstitute(attacker, pokemon)) {
      if (!pokemon.getTag(this.tagType) && !simulated) {
        pokemon.addTag(this.tagType, undefined, undefined, pokemon.id);
        globalScene.queueMessage(
          i18next.t("abilityTriggers:windPowerCharged", {
            pokemonName: getPokemonNameWithAffix(pokemon),
            moveName: move.name,
          }),
        );
      }
      return true;
    }
    return false;
  }
}

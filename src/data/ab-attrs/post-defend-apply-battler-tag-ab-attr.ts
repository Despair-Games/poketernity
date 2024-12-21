import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendApplyBattlerTagAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly tagType: BattlerTagType;
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
    if (this.condition(pokemon, attacker, move)) {
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

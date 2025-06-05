import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/pokemon-defend-condition";
import i18next from "i18next";

export class PostDefendApplyBattlerTagAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly tagType: BattlerTagType;
  constructor(condition: PokemonDefendCondition, tagType: BattlerTagType) {
    super(true);

    this.condition = condition;
    this.tagType = tagType;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (this.condition(pokemon, attacker, move)) {
      if (!pokemon.hasTag(this.tagType) && !simulated) {
        pokemon.addTag(this.tagType, undefined, undefined, pokemon.id);
        globalScene.phaseManager.queueMessagePhase(
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

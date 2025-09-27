import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/move-types";
import i18next from "i18next";

export class PostDefendApplyBattlerTagAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly tagType: BattlerTagType;
  constructor(condition: PokemonDefendCondition, tagType: BattlerTagType) {
    super();

    this.condition = condition;
    this.tagType = tagType;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, _attacker: Pokemon, move: Move): void {
    if (simulated) {
      return;
    }
    pokemon.addTag(this.tagType, undefined, undefined, pokemon.id);

    const pokemonName = getPokemonNameWithAffix(pokemon);
    const moveName = pokemon.getPokemonMove(move.id)?.name ?? move.name;
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:windPowerCharged", {
        pokemonName,
        moveName,
      }),
    );
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, attacker, move) && !pokemon.hasTag(this.tagType);
  }
}

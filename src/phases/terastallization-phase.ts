import { CommonBattleAnim } from "#app/data/animations/common-battle-anim";
import { SpeciesFormChangeTeraTrigger } from "#app/data/pokemon-forms";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import { PhaseId } from "#enums/phase-id";
import i18next from "i18next";

export class TerastallizationPhase extends BattlePhase {
  public override readonly id = PhaseId.TERASTALLIZATION;
  public pokemon: Pokemon;

  constructor(pokemon: Pokemon) {
    super();

    this.pokemon = pokemon;
  }

  public override start(): void {
    super.start();

    new CommonBattleAnim(CommonAnim.TERASTALLIZE, this.pokemon).play(false, () => {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battle:pokemonTerastallized", {
          pokemonNameWithAffix: getPokemonNameWithAffix(this.pokemon),
          type: i18next.t(`pokemonInfo:Type.${ElementalType[this.pokemon.teraType]}`),
        }),
      );

      this.end();
    });
  }

  public override end(): void {
    this.pokemon.isTerastallized = true;
    if (this.pokemon.summonData) {
      this.pokemon.summonData.addedType = null;
    }
    this.pokemon.updateSpritePipelineData();

    if (this.pokemon.isPlayer()) {
      globalScene.playerTerasUsed += 1;
    }

    globalScene.triggerPokemonFormChange(this.pokemon, SpeciesFormChangeTeraTrigger);

    super.end();
  }
}

import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SpeciesFormChangeTeraTrigger } from "#data/pokemon-forms";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import { PhaseId } from "#enums/phase-id";
import type { Pokemon } from "#field/pokemon";
import { BattlePhase } from "#phases/abstract-battle-phase";
import { enumValueToKey } from "#utils/common-utils";
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
          type: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, this.pokemon.teraType)}`),
        }),
      );

      this.end();
    });
  }

  public override end(): void {
    this.pokemon.isTerastallized = true;
    this.pokemon.summonData.addedType = null;
    this.pokemon.updateSpritePipelineData();

    if (this.pokemon.isPlayer()) {
      globalScene.playerTerasUsed += 1;
    }

    globalScene.triggerPokemonFormChange(this.pokemon, SpeciesFormChangeTeraTrigger);

    super.end();
  }
}

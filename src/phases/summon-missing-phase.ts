import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { SummonPhase } from "./summon-phase";
import { PhaseId } from "#enums/phase-id";

export class SummonMissingPhase extends SummonPhase {
  override readonly id = PhaseId.SUMMON_MISSING;

  constructor(fieldIndex: number) {
    super(fieldIndex);
  }

  protected override preSummon(): void {
    globalScene.ui.showText(
      i18next.t("battle:sendOutPokemon", { pokemonName: getPokemonNameWithAffix(this.getPokemon()) }),
    );
    globalScene.time.delayedCall(250, () => this.summon());
  }
}

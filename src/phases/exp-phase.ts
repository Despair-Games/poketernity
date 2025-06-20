import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PhaseId } from "#enums/phase-id";
import { ExpBoosterModifier } from "#modifier/modifier";
import { PlayerPartyMemberPokemonPhase } from "#phases/abstract-player-party-member-pokemon-phase";
import { LevelUpPhase } from "#phases/level-up-phase";
import { NumberHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Grants a player pokemon EXP and pushes a {@linkcode LevelUpPhase} if it leveled up
 */
export class ExpPhase extends PlayerPartyMemberPokemonPhase {
  override readonly id = PhaseId.EXP;

  private readonly expValue: number;

  constructor(partyMemberIndex: number, expValue: number) {
    super(partyMemberIndex);

    this.expValue = expValue;
  }

  public override start(): void {
    super.start();

    const pokemon = this.getPokemon();
    const exp = new NumberHolder(this.expValue);
    globalScene.applyModifiers(ExpBoosterModifier, true, exp);
    exp.value = Math.floor(exp.value);
    globalScene.ui.showText(
      i18next.t("battle:expGain", { pokemonName: getPokemonNameWithAffix(pokemon), exp: exp.value }),
      null,
      () => {
        const lastLevel = pokemon.level;
        pokemon.addExp(exp.value);
        const newLevel = pokemon.level;
        if (newLevel > lastLevel) {
          globalScene.phaseManager.unshiftPhase(new LevelUpPhase(this.partyMemberIndex, lastLevel, newLevel));
        }
        pokemon.updateInfo().then(() => this.end());
      },
      null,
      true,
    );
  }
}

import { globalScene } from "#app/global-scene";
import { EXP_GAIN_SPEED_MAP, ExpGainSpeed } from "#enums/exp-gain-speed";
import { ExpNotification } from "#enums/exp-notification";
import { ExpBoosterModifier } from "#modifier/modifier";
import { PlayerPartyMemberPokemonPhase } from "#phases/base/player-party-member-pokemon-phase";
import { settings } from "#system/settings-manager";
import { NumberHolder } from "#utils/common-utils";

export class ShowPartyExpBarPhase extends PlayerPartyMemberPokemonPhase {
  public override readonly phaseName = "ShowPartyExpBarPhase";

  private readonly expValue: number;

  constructor(partyMemberIndex: number, expValue: number) {
    super(partyMemberIndex);

    this.expValue = expValue;
  }

  public override start(): void {
    const pokemon = this.getPokemon();
    const exp = new NumberHolder(this.expValue);

    globalScene.applyModifiers(ExpBoosterModifier, true, exp);
    exp.value = Math.floor(exp.value);

    const lastLevel = pokemon.level;
    pokemon.addExp(exp.value);
    const newLevel = pokemon.level;
    if (newLevel > lastLevel) {
      globalScene.phaseManager.createAndUnshiftPhase("LevelUpPhase", this.partyMemberIndex, lastLevel, newLevel);
    }
    pokemon.updateInfo();

    const { partyExpBar } = globalScene;
    const { partyExpNotificationMode, expGainSpeed } = settings.general;

    if (partyExpNotificationMode === ExpNotification.SKIP) {
      this.end();
    } else if (partyExpNotificationMode === ExpNotification.ONLY_LEVEL_UP) {
      if (newLevel > lastLevel) {
        // this means if we level up
        // instead of displaying the exp gain in the small frame, we display the new level
        // we use the same method for mode 0 & 1, by giving a parameter saying to display the exp or the level
        partyExpBar
          .showPokemonExp(pokemon, exp.value, partyExpNotificationMode === ExpNotification.ONLY_LEVEL_UP, newLevel)
          .then(() => {
            setTimeout(() => this.end(), 800 * EXP_GAIN_SPEED_MAP[expGainSpeed]);
          });
      } else {
        this.end();
      }
    } else if (expGainSpeed < ExpGainSpeed.SKIP) {
      partyExpBar.showPokemonExp(pokemon, exp.value, false, newLevel).then(() => {
        setTimeout(() => this.end(), 500 * EXP_GAIN_SPEED_MAP[expGainSpeed]);
      });
    } else {
      this.end();
    }
  }

  public override end(): void {
    globalScene.partyExpBar.hide().then(() => super.end());
  }
}

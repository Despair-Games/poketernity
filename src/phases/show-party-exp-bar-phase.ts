import { globalScene } from "#app/global-scene";
import { ExpBoosterModifier } from "#app/modifier/modifier";
import { NumberHolder } from "#app/utils";
import { ExpGainsSpeed } from "#enums/exp-gains-speed";
import { ExpNotification } from "#enums/exp-notification";
import { PlayerPartyMemberPokemonPhase } from "./abstract-player-party-member-pokemon-phase";
import { LevelUpPhase } from "./level-up-phase";

export class ShowPartyExpBarPhase extends PlayerPartyMemberPokemonPhase {
  private readonly expValue: number;

  constructor(partyMemberIndex: number, expValue: number) {
    super(partyMemberIndex);

    this.expValue = expValue;
  }

  public override start(): void {
    super.start();

    const { expParty, expGainsSpeed, partyExpBar } = globalScene;

    const pokemon = this.getPokemon();
    const exp = new NumberHolder(this.expValue);

    globalScene.applyModifiers(ExpBoosterModifier, true, exp);
    exp.value = Math.floor(exp.value);

    const lastLevel = pokemon.level;
    pokemon.addExp(exp.value);
    const newLevel = pokemon.level;
    if (newLevel > lastLevel) {
      globalScene.unshiftPhase(new LevelUpPhase(this.partyMemberIndex, lastLevel, newLevel));
    }
    pokemon.updateInfo();

    if (expParty === ExpNotification.SKIP) {
      this.end();
    } else if (expParty === ExpNotification.ONLY_LEVEL_UP) {
      if (newLevel > lastLevel) {
        // this means if we level up
        // instead of displaying the exp gain in the small frame, we display the new level
        // we use the same method for mode 0 & 1, by giving a parameter saying to display the exp or the level
        partyExpBar
          .showPokemonExp(pokemon, exp.value, expParty === ExpNotification.ONLY_LEVEL_UP, newLevel)
          .then(() => {
            setTimeout(() => this.end(), 800 / Math.pow(2, expGainsSpeed));
          });
      } else {
        this.end();
      }
    } else if (expGainsSpeed < ExpGainsSpeed.SKIP) {
      partyExpBar.showPokemonExp(pokemon, exp.value, false, newLevel).then(() => {
        setTimeout(() => this.end(), 500 / Math.pow(2, expGainsSpeed));
      });
    } else {
      this.end();
    }
  }

  public override end(): void {
    globalScene.partyExpBar.hide();
    super.end();
  }
}

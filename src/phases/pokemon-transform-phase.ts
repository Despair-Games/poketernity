import type { BattlerIndex } from "#app/battle";
import { PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BATTLE_STATS, EFFECTIVE_STATS } from "#enums/stat";
import { PokemonPhase } from "./pokemon-phase";

/**
 * Transforms a Pokemon into another Pokemon on the field.
 * Used for Transform (move) and Imposter (ability)
 */
export class PokemonTransformPhase extends PokemonPhase {
  protected readonly targetIndex: BattlerIndex;
  private readonly playSound: boolean;

  constructor(userIndex: BattlerIndex, targetIndex: BattlerIndex, playSound: boolean = false) {
    super(userIndex);

    this.targetIndex = targetIndex;
    this.playSound = playSound;
  }

  public override start(): void {
    const user = this.getPokemon();
    const target = globalScene.getField(true).find((p) => p.getBattlerIndex() === this.targetIndex);

    if (!target) {
      return this.end();
    }

    user.summonData.speciesForm = target.getSpeciesForm();
    user.summonData.ability = target.getAbility().id;
    user.summonData.gender = target.getGender();

    // Power Trick's effect is removed after using Transform
    user.removeTag(BattlerTagType.POWER_TRICK);

    // Copy all stats (except HP)
    for (const s of EFFECTIVE_STATS) {
      user.setStat(s, target.getStat(s, false), false);
    }

    // Copy all stat stages
    for (const s of BATTLE_STATS) {
      user.setStatStage(s, target.getStatStage(s));
    }

    user.summonData.moveset = target.getMoveset().map((m) => {
      // If PP value is less than 5, do nothing. If greater, we need to reduce the value to 5.
      return new PokemonMove(m.moveId, 0, 0, false, Math.min(m.getMove().pp, 5));
    });
    user.summonData.types = target.getTypes();

    const promises = [user.updateInfo()];

    if (this.playSound) {
      globalScene.playSound("battle_anims/PRSFX- Transform");
    }

    promises.push(
      user.loadAssets(false).then(() => {
        user.playAnim();
        user.updateInfo();
      }),
    );

    Promise.allSettled(promises).then(() => this.end());
  }
}

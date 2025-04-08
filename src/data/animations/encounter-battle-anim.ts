import type { AnimConfig } from "#app/data/animations/anim-config";
import { BattleAnim } from "./battle-anims";
import type { Pokemon } from "#app/field/pokemon";
import { type EncounterAnim } from "#enums/encounter-anims";
import { encounterAnims } from "./encounter-anims";

/**
 * Animation for effects that occur at the beginning
 * of certain Mystery Encounters. This usually only plays the
 * "graphic" frames of the animation.
 * @extends BattleAnim
 * @todo Remove the "user" and "target" constructor parameters
 */
export class EncounterBattleAnim extends BattleAnim {
  public encounterAnim: EncounterAnim;
  public oppAnim: boolean;

  constructor(encounterAnim: EncounterAnim, user: Pokemon, target?: Pokemon, oppAnim?: boolean) {
    super(user, target ?? user, true);

    this.encounterAnim = encounterAnim;
    this.oppAnim = oppAnim ?? false;
  }

  getAnim(): AnimConfig | null {
    return encounterAnims.get(this.encounterAnim) ?? null;
  }

  isOppAnim(): boolean {
    return this.oppAnim;
  }
}

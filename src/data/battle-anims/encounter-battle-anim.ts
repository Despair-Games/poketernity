import type { AnimConfig } from "#app/data/anim-config";
import { BattleAnim } from "#app/data/battle-anims";
import type { Pokemon } from "#app/field/pokemon";
import { type EncounterAnim } from "#enums/encounter-anims";
import { encounterAnims } from "../encounter-anims";

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

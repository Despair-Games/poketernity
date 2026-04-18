import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { ReflectStatStageChangeAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Attribute to reflect stat-lowering effects from moves and abilities back to their source.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Mirror_Armor_(Ability)}.
 */
export class ReflectStatStageChangeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ReflectStatStageChangeAbAttr";

  constructor() {
    super(true);
  }

  public override apply({
    pokemon,
    simulated,
    source,
    stats,
    stages,
    reflected,
  }: ReflectStatStageChangeAbAttrParams): void {
    if (!simulated && source) {
      const reflectedStats = stats.filter((stat) => pokemon.getStatStage(stat) > -6);
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        source.id,
        pokemon,
        reflectedStats,
        stages,
        { bypassReflect: true },
      );
    }
    // TODO: shouldn't this be inside the `if`?
    reflected.value = true;
  }

  public override canApply({ pokemon, source, stats, stages, reflected }: Parameters<this["apply"]>[0]): boolean {
    return (
      pokemon !== source && stages < 0 && stats.some((stat) => pokemon.getStatStage(stat) > -6) && !reflected.value
    );
  }
}

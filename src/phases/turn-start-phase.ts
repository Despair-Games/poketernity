import { globalScene } from "#app/global-scene";
import { CheckStatusEffectPhase } from "#app/phases/check-status-effect-phase";
import { PhaseId } from "#enums/phase-id";
import { FieldPhase } from "./abstract-field-phase";
import { BerryPhase } from "./berry-phase";
import { TurnEndPhase } from "./turn-end-phase";
import { WeatherEffectPhase } from "./weather-effect-phase";

export class TurnStartPhase extends FieldPhase {
  override readonly id = PhaseId.TURN_START;

  public override start(): void {
    super.start();

    const { turnManager } = globalScene.currentBattle;

    turnManager.startTurn();

    this.end();
  }

  public override end(): void {
    globalScene.pushPhase(new WeatherEffectPhase());
    globalScene.pushPhase(new BerryPhase());
    globalScene.pushPhase(new CheckStatusEffectPhase());
    globalScene.pushPhase(new TurnEndPhase());

    super.end();
  }
}

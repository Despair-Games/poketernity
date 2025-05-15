import type { InputsEvent } from "#types/inputs-event";
import type { LanguageEvent } from "#types/language";
import type { SettingsEvent } from "#types/settings";
import type { TouchControlsEvent } from "#types/touch-controls-event";
import Phaser from "phaser";

type EventName = SettingsEvent | InputsEvent | TouchControlsEvent | LanguageEvent;
type CallbackFn<D> = (data: D) => void;

/**
 * Adoption of {@linkcode Phaser.Events.EventEmitter} with a custom type of event names
 */
class EventBus extends Phaser.Events.EventEmitter {
  override on<D = any, C = any>(event: EventName, fn: CallbackFn<D>, context?: C): this {
    return super.on(event, fn, context);
  }

  override once<D = any, C = any>(event: EventName, fn: CallbackFn<D>, context?: C): this {
    return super.once(event, fn, context);
  }

  override off<D = any, C = any>(event: EventName, fn?: CallbackFn<D>, context?: C, once?: boolean): this {
    return super.off(event, fn, context, once);
  }

  override emit(event: EventName, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  override removeAllListeners(event?: EventName): this {
    return super.removeAllListeners(event);
  }

  override addListener<D = any, C = any>(event: EventName, fn: CallbackFn<D>, context?: C): this {
    return super.addListener(event, fn, context);
  }

  override removeListener<D = any, C = any>(event: EventName, fn?: CallbackFn<D>, context?: C, once?: boolean): this {
    return super.removeListener(event, fn, context, once);
  }
}

/** Global event bus */
export const eventBus = new EventBus();

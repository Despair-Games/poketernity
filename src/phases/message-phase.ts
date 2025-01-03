import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

export class MessagePhase extends Phase {
  private text: string;
  private readonly callbackDelay: number | null;
  private readonly prompt: boolean | null;
  private readonly promptDelay: number | null;
  private readonly speaker?: string;

  constructor(
    text: string,
    callbackDelay: number | null = null,
    prompt: boolean | null = null,
    promptDelay: number | null = null,
    speaker?: string,
  ) {
    super();

    this.text = text;
    this.callbackDelay = callbackDelay;
    this.prompt = prompt;
    this.promptDelay = promptDelay;
    this.speaker = speaker;
  }

  public override start(): void {
    super.start();

    if (this.text.indexOf("$") > -1) {
      const pageIndex = this.text.indexOf("$");
      globalScene.unshiftPhase(
        new MessagePhase(
          this.text.slice(pageIndex + 1),
          this.callbackDelay,
          this.prompt,
          this.promptDelay,
          this.speaker,
        ),
      );
      this.text = this.text.slice(0, pageIndex).trim();
    }

    if (this.speaker) {
      globalScene.ui.showDialogue(
        this.text,
        this.speaker,
        null,
        () => this.end(),
        this.callbackDelay ?? (this.prompt ? 0 : 1500),
        this.promptDelay ?? 0,
      );
    } else {
      globalScene.ui.showText(
        this.text,
        null,
        () => this.end(),
        this.callbackDelay ?? (this.prompt ? 0 : 1500),
        this.prompt,
        this.promptDelay,
      );
    }
  }

  public override end(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.hide();
    }

    super.end();
  }
}

import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

export class MessagePhase extends Phase {
  public override readonly phaseName = "MessagePhase";

  private text: string;
  private readonly callbackDelay?: number;
  private readonly prompt: boolean;
  private readonly promptDelay: number;
  private readonly speaker?: string;

  constructor(
    text: string,
    callbackDelay?: number,
    prompt: boolean = false,
    promptDelay: number = 0,
    speaker?: string,
  ) {
    super();

    this.text = text;
    this.callbackDelay = callbackDelay ?? (prompt ? 0 : 1500);
    this.prompt = prompt;
    this.promptDelay = promptDelay;
    this.speaker = speaker;
  }

  public override start(): void {
    if (this.text.indexOf("$") > -1) {
      const pageIndex = this.text.indexOf("$");
      globalScene.phaseManager.unshiftPhase(
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
        () => this.end(),
        undefined,
        this.callbackDelay,
        this.promptDelay ?? 0,
      );
    } else {
      globalScene.ui.showText(this.text, {
        callback: () => this.end(),
        callbackDelay: this.callbackDelay,
        prompt: this.prompt,
        promptDelay: this.promptDelay,
      });
    }
  }
}

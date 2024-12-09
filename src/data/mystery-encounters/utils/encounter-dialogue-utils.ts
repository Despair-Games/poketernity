import { globalScene } from "#app/global-scene";
import type { TextStyle } from "#app/ui/text";
import { getTextWithColors } from "#app/ui/text";
import { UiTheme } from "#enums/ui-theme";
import { isNullOrUndefined } from "#app/utils";
import i18next from "i18next";

/**
 * Will inject all relevant dialogue tokens that exist into i18n text.
 * Also adds BBCodeText fragments for colored text, if applicable
 * @param keyOrString The key or string that represents the text
 * @param primaryStyle Can define a text style to be applied to the entire string. Must be defined for BBCodeText styles to be applied correctly
 */
export function getEncounterText(keyOrString?: string, primaryStyle?: TextStyle): string | null {
  if (isNullOrUndefined(keyOrString)) {
    return null;
  }

  const uiTheme = globalScene.uiTheme ?? UiTheme.DEFAULT;

  let textString: string | null = getTextWithDialogueTokens(keyOrString);

  // Can only color the text if a Primary Style is defined
  // primaryStyle is applied to all text that does not have its own specified style
  if (primaryStyle && textString) {
    textString = getTextWithColors(textString, primaryStyle, uiTheme, true);
  }

  return textString;
}

/**
 * Helper function to inject {@linkcode globalScene.currentBattle.mysteryEncounter.dialogueTokens} into a given content string
 * @param keyOrString The key or string that represents the text
 */
function getTextWithDialogueTokens(keyOrString: string): string | null {
  const tokens = globalScene.currentBattle?.mysteryEncounter?.dialogueTokens;

  if (i18next.exists(keyOrString, tokens)) {
    return i18next.t(keyOrString, tokens) as string;
  }

  return keyOrString ?? null;
}

/**
 * Will queue a message in UI with injected encounter data tokens
 * @param contentKey the key representing the localized text
 */
export function queueEncounterMessage(contentKey: string): void {
  const text: string | null = getEncounterText(contentKey);
  globalScene.queueMessage(text ?? "", null, true);
}

/**
 * Will display a message in UI with injected encounter data tokens
 * @param contentKey the key representing the localized text
 * @param delay the delay in milliseconds (20 if null or undefined)
 * @param callbackDelay the delay of resolving the promise in milliseconds
 * @param prompt whether or not to use the promptDelay
 * @param promptDelay the delay of the prompt in milliseconds
 */
export function showEncounterText(
  contentKey: string,
  delay: number | null = null,
  callbackDelay: number = 0,
  prompt: boolean = true,
  promptDelay: number | null = null,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const text: string | null = getEncounterText(contentKey);
    globalScene.ui.showText(text ?? "", delay, () => resolve(), callbackDelay, prompt, promptDelay);
  });
}

/**
 * Will display a dialogue (with speaker title) in UI with injected encounter data tokens
 * @param textContentKey the content key relating to the dialogue
 * @param speakerContentKey the content key relating to the speaker
 * @param delay the delay in milliseconds (20 if null or undefined)
 * @param callbackDelay the delay of resolving the promise in milliseconds
 */
export function showEncounterDialogue(
  textContentKey: string,
  speakerContentKey: string,
  delay: number | null = null,
  callbackDelay: number = 0,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const text: string | null = getEncounterText(textContentKey);
    const speaker: string | null = getEncounterText(speakerContentKey);
    globalScene.ui.showDialogue(text ?? "", speaker ?? "", delay, () => resolve(), callbackDelay);
  });
}

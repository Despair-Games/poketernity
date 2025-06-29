import { IS_BETA } from "#constants/app-constants";
import { supportedLanguages } from "#system/supported-languages";

export function setCookie(cName: string, cValue: string): void {
  const expiration = new Date();
  expiration.setTime(Date.now() + 3600000 * 24 * 30 * 3 /*7*/);
  document.cookie = `${cName}=${cValue};Secure;SameSite=Strict;Domain=${window.location.hostname};Path=/;Expires=${expiration.toUTCString()}`;
}

export function removeCookie(cName: string): void {
  if (IS_BETA) {
    // we need to remove the cookie from the main domain as well
    document.cookie = `${cName}=;Secure;SameSite=Strict;Domain=poketernity.com;Path=/;Max-Age=-1`;
  }

  document.cookie = `${cName}=;Secure;SameSite=Strict;Domain=${window.location.hostname};Path=/;Max-Age=-1`;
  // legacy cookie without domain, for older cookies to prevent a login loop
  document.cookie = `${cName}=;Secure;SameSite=Strict;Path=/;Max-Age=-1`;
}

export function getCookie(cName: string): string {
  // check if there are multiple cookies with the same name and delete them
  if (document.cookie.split(";").filter((c) => c.includes(cName)).length > 1) {
    removeCookie(cName);
    return "";
  }
  const name = `${cName}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Check if a language is supported
 * @param key - The language key (e.g. "en") to check
 * @returns `true` if the language is supported
 */
export function isSupportedLanguage(key: string): boolean {
  return supportedLanguages.some((l) => l.key === key);
}

/**
 * @returns `true` if the device has a touchscreen, otherwise `false`.
 */
export function hasTouchscreen(): boolean {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

/**
 * Checks if the orientation of the scene is landscape
 * @param scene - The scene/game to check (Must have a `scale: Phaser.Scale.ScaleManager` property)
 * @returns `true` if the game is running in landscape mode (Primary or Secondary), otherwise `false`.
 */
export function isLandscapeMode(scene: { scale: Phaser.Scale.ScaleManager }): boolean {
  return [Phaser.Scale.Orientation.LANDSCAPE, Phaser.Scale.Orientation.LANDSCAPE_SECONDARY].includes(
    scene.scale.orientation,
  );
}

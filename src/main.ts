import "#app/polyfills"; // polyfills must be first
import "#app/phaser-extensions";

import { IS_BETA, IS_DEV } from "#constants/app-constants";

if (IS_DEV || IS_BETA) {
  document.title += " (Beta)";
}

window.onerror = (_message, _source, _lineno, _colno, error) => {
  console.error(error);
  // Avoids logging the error a second time.
  return true;
};

window.addEventListener("unhandledrejection", (event) => {
  console.error(event.reason);
});

document.fonts.load("16px emerald").then(() => document.fonts.load("10px pkmnems"));

const startGame = async (manifest?: any) => {
  try {
    const { initI18n } = await import("./plugins/i18n");
    await initI18n();

    const { game } = await import("./game");
    game.sound.pauseOnBlur = false;

    if (manifest) {
      game["manifest"] = manifest;
    }
  } catch (err) {
    console.error("Game failed to launch:", err);
    alert("The game failed to launch. Please try again.\nFor more information, check the js console.");
  }
};

try {
  const json = await (await fetch("/manifest.json")).json();
  await startGame(json.manifest);
} catch {
  // The manifest wasn't found, likely due to running locally
  await startGame();
}

if (IS_DEV) {
  await import("./dev");
}

import "#app/phaser-extensions";

// Catch global errors and display them in an alert so users can report the issue.
window.onerror = function (_message, _source, _lineno, _colno, error) {
  console.error(error);
  // const errorString = `Received unhandled error. Open browser console and click OK to see details.\nError: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nStack: ${error.stack}`;
  //alert(errorString);
  // Avoids logging the error a second time.
  return true;
};

// Catch global promise rejections and display them in an alert so users can report the issue.
window.addEventListener("unhandledrejection", (event) => {
  // const errorString = `Received unhandled promise rejection. Open browser console and click OK to see details.\nReason: ${event.reason}`;
  console.error(event.reason);
  //alert(errorString);
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

fetch("/manifest.json")
  .then((res) => res.json())
  .then((jsonResponse) => {
    startGame(jsonResponse.manifest);
  })
  .catch(() => {
    // Manifest not found (likely local build)
    startGame();
  });

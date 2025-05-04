/**
 * This script creates a test boilerplate file in the appropriate
 * directory based on the type selected.
 * @example npm run test:create
 */

import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeChoices = ["Move", "Ability", "Item", "Mystery Encounter"];

/**
 * Get the path to a given folder in the test directory
 * @param  {...string} folders the subfolders to append to the base path
 * @returns {string} the path to the requested folder
 */
function getTestFolderPath(...folders) {
  return path.join(__dirname, "test", ...folders);
}

/**
 * Prompts the user to select a type via list.
 * @returns {Promise<{selectedOption: string}>} the selected type
 */
async function promptTestType() {
  const typeAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedOption",
      message: "What type of test would you like to create:",
      choices: [...typeChoices, "EXIT"],
    },
  ]);

  if (typeAnswer.selectedOption === "EXIT") {
    console.log("Exiting...");
    return process.exit();
  } else if (!typeChoices.includes(typeAnswer.selectedOption)) {
    console.error(`Please provide a valid type (${typeChoices.join(", ")})!`);
    return await promptTestType();
  }

  return typeAnswer;
}

/**
 * Prompts the user to provide a file name.
 * @param {string} selectedType
 * @returns {Promise<{userInput: string}>} the selected file name
 */
async function promptFileName(selectedType) {
  const fileNameAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "userInput",
      message: `Please provide the name of the ${selectedType}:`,
    },
  ]);

  if (!fileNameAnswer.userInput || fileNameAnswer.userInput.trim().length === 0) {
    console.error("Please provide a valid file name!");
    return await promptFileName(selectedType);
  }

  return fileNameAnswer;
}

/**
 * Runs the interactive test:create "CLI"
 * @returns {Promise<void>}
 */
async function runInteractive() {
  const typeAnswer = await promptTestType();
  const fileNameAnswer = await promptFileName(typeAnswer.selectedOption);

  const type = typeAnswer.selectedOption.toLowerCase();
  // Convert fileName from snake_case or camelCase to kebab-case
  const fileName = fileNameAnswer.userInput
    .replace(/_+/g, "-") // Convert snake_case (underscore) to kebab-case (dashes)
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Convert camelCase to kebab-case
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .toLowerCase(); // Ensure all lowercase
  // Format the description for the test case

  const formattedName = fileName.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  // Determine the directory based on the type
  let dir;
  let description;
  switch (type) {
    case "move":
      dir = getTestFolderPath("moves");
      description = `Moves - ${formattedName}`;
      break;
    case "ability":
      dir = getTestFolderPath("abilities");
      description = `Abilities - ${formattedName}`;
      break;
    case "item":
      dir = getTestFolderPath("items");
      description = `Items - ${formattedName}`;
      break;
    case "mystery encounter":
      dir = getTestFolderPath("mystery-encounter", "encounters");
      description = `Mystery Encounter - ${formattedName}`;
      break;
    default:
      console.error(`Invalid type. Please use one of the following: ${typeChoices.join(", ")}.`);
      process.exit(1);
  }

  // Define the content template
  const content = `import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("${description}", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should do X", async () => {
    await game.classicMode.startBattle([ SpeciesId.FEEBAS ]);

    game.move.use(MoveId.SPLASH);
    
    await game.toEndOfTurn();

    expect(true).toBe(true);
  });
});
`;

  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create the file with the given name
  const filePath = path.join(dir, `${fileName}.test.ts`);

  if (fs.existsSync(filePath)) {
    console.error(`File "${fileName}.test.ts" already exists.`);
    process.exit(1);
  }

  // Write the template content to the file
  fs.writeFileSync(filePath, content, "utf8");

  console.log(`File created at: ${filePath}`);
}

runInteractive();

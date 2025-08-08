// biome-ignore-all lint/performance/noNamespaceImport: This is the intended import method for these modules
import * as core from "@actions/core";
import * as github from "@actions/github";

const PREFIXES = [
  "balance", // Primarily a balance change
  "deps", // Primarily adding/updating/removing dependencies
  "dev", // Improving the developer experience (such as by modifying lint rules or creating cli scripts)
  "docs", // Primarily adding/updating documentation
  "feat", // Adding a new feature (e.g. adding a new implementation of a move) or redesigning an existing feature
  "fix", // Fixing a bug
  "github", // Updating the CI pipeline or otherwise modifying something in the `./github/` directory
  "i18n", // Updating the localization submodule, adding new translatable text, etc
  "refactor", // A change that doesn't impact functionality or fix any bugs (except incidentally)
  "revert", // Reverting a previous commit
  "test", // Primarily adding/updating tests or modifying the test framework
] as const;

const ALL_SCOPES = [
  "ability",
  "ai",
  "anomaly", // Formerly "Mystery Encounters"
  "audio",
  "battle", // Relating to the general battle engine
  "biomes",
  "challenge",
  "data", // Data not covered by other scopes, such as TM lists
  "event",
  "graphics", // Anything related to art/graphics (adding new sprites, fixing a sprite that isn't displaying, etc)
  "item",
  "move",
  "ui", // UI/UX
] as const;

const PREFIX_SCOPE_MAP = {
  balance: ["ability", "ai", "anomaly", "biomes", "challenge", "item", "move"],
  deps: [],
  dev: [],
  docs: [],
  feat: ALL_SCOPES,
  fix: ALL_SCOPES,
  github: [],
  i18n: [],
  refactor: ALL_SCOPES,
  revert: [],
  test: [],
} as const;

const validEvent = ["pull_request"];

async function run() {
  try {
    // Make sure the prefix:scope map stays in sync with the list of prefixes
    for (const p of PREFIXES) {
      if (PREFIX_SCOPE_MAP[p] === undefined) {
        core.setFailed(`Prefix "${p}" missing from prefix map!`);
        return;
      }
    }
    for (const key in PREFIX_SCOPE_MAP) {
      if (!([...PREFIXES] as string[]).includes(key)) {
        core.setFailed(`Prefix "${key}" missing from prefix list: [${PREFIXES}]!`);
        return;
      }
    }
    const authToken = core.getInput("github_token", { required: true });
    const eventName = github.context.eventName;
    core.info(`Event name: ${eventName}`);
    if (!validEvent.includes(eventName)) {
      core.setFailed(`Invalid event: ${eventName}`);
      return;
    }

    const client = github.getOctokit(authToken);
    // The pull request info on the context isn't up to date.
    // When the user updates the title and re-runs the workflow, it would be outdated.
    // Therefore fetch the pull request via the REST API to ensure we use the current title.
    const { data: pullRequest } = await client.rest.pulls.get({
      owner: github.context.payload.pull_request!.base.user.login,
      repo: github.context.payload.pull_request!.base.repo.name,
      pull_number: github.context.payload.pull_request!.number,
    });

    const { title } = pullRequest;
    core.info(`Pull Request title: "${title}"`);

    // if (title.length > 72) {
    //   core.setFailed(`Max title length of 72 exceeded! Current length: ${title.length}`);
    //   return;
    // }

    // Note: `!` allowed before `:` for changes including a save migrator and/or version increase
    const info = `
Terminology: fix(move): Future Sight no longer crashes
             ^   ^      ^
             |   |      |__ Subject
             |   |_________ Scope (optional)
             |_____________ Prefix
`;

    core.info(info.trim());

    // Check if title passes regex
    // Example of regex: https://regex101.com/r/FeN8jG/7
    const regex = /^([a-z]+)!?(\([a-z]+\))?: .+/;
    if (!regex.test(title)) {
      core.setFailed(`Pull Request title "${title}" failed to match - "Prefix(Scope): Subject"`);
      return;
    }

    const regexResult = regex.exec(title);
    const prefix = regexResult[1];
    const scope = regexResult[2]?.replace(/[()]/g, "");

    // Check if title starts with an allowed prefix
    core.info(`Allowed prefixes: ${PREFIXES}`);
    if (!PREFIXES.some((p) => p === prefix)) {
      core.setFailed(`Pull Request title "${title}" did not match any of the prefixes: [${PREFIXES}]`);
      return;
    }

    // Check if title has an allowed scope
    if (scope?.length && !PREFIX_SCOPE_MAP[prefix].includes(scope)) {
      core.setFailed(`Pull Request title "${title}" has an invalid prefix (${prefix}) + scope (${scope}) combination!`);
      return;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

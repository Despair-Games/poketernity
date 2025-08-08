<!-- Once you have read these comments, you are free to remove them -->

<!-- Feel free to look at other PRs for examples -->

<!--
The PR title must match this format (and is ideally less than or equal to 72 characters):

fix(move): Future Sight no longer crashes
^   ^      ^
|   |      |__ Subject
|   |_________ Scope (optional)
|_____________ Prefix

You should add a `!` before the `:` if the PR includes a version increase / save migrator. Example:
refactor!: change Tera mechanic to match mainline

List of valid prefixes:
  balance - Primarily a balance change
  deps - Primarily adding/updating/removing dependencies
  dev - Improving the developer experience (such as by modifying lint rules or creating cli scripts)
  docs - Primarily adding/updating documentation
  feat - Adding a new feature (e.g. adding a new implementation of a move) or redesigning an existing feature
  fix - Fixing a bug
  github - Updating the CI pipeline or otherwise modifying something in the `./github/` directory
  i18n - Updating the localization submodule, adding new translatable text, etc
  refactor - A change that doesn't impact functionality or fix any bugs (except incidentally)
  revert - Reverting a previous commit
  test - Primarily adding/updating tests or modifying the test framework

List of valid scopes:
  ability
  ai
  anomaly - Formerly "Mystery Encounters"
  audio
  battle - Relating to the general battle engine
  biomes
  challenge
  data - Data not covered by other scopes, such as TM lists
  event
  graphics - Anything related to art/graphics (adding new sprites, fixing a sprite that isn't displaying, etc)
  item
  move
  ui - UI/UX

List of valid "prefix(scope)" combinations:
  balance - ability, ai, anomaly, biomes, challenge, item, move
  deps - N/A
  dev - N/A
  docs - N/A
  feat - All
  fix - All
  github - N/A
  i18n - N/A
  refactor - All
  revert - N/A
  test - N/A
-->

<!--
Make sure that this PR is not overlapping with someone else's work
Please try to keep the PR self-contained (and small)
-->

## What are the changes the user will see?

<!-- Summarize what are the changes from a user perspective on the application -->

## Why am I making these changes?

<!--
Explain why you decided to introduce these changes
Does it come from an issue or another PR? Please link it
Explain why you believe this can enhance user experience
-->
<!--
If there are existing GitHub issues related to the PR that would be fixed,
you can add "Fixes #[issue number]" (ie: "Fixes #1234") to link an issue to your PR
so that it will automatically be closed when the PR is merged.
-->

## What are the changes from a developer perspective?

<!--
Explicitly state what are the changes introduced by the PR
You can make use of a comparison between what was the state before and after your PR changes
Ex: What files have been changed? What classes/functions/variables/etc have been added or changed?
-->

## Screenshots/Videos

<!--
If your changes are changing anything on the user experience, please provide visual proofs of it
Please take screenshots/videos before and after your changes, to show what is brought by this PR
-->

## How to test the changes?

<!--
How can a reviewer test your changes once they check out on your branch?
Did you make use of the `src/overrides.ts` file?
Did you introduce any automated tests?
Do the reviewers need to do something special in order to test your changes?
-->

## Checklist

- [ ] ⚠️ If this is a PR for `main` (such as a hotfix), has the game version been updated (`pnpm update-version:patch` / `pnpm update-version:minor`?
- [ ] Otherwise: **I'm using `beta` as my base branch**
- [ ] There is no overlap with another PR?
- [ ] The PR is self-contained and cannot be split into smaller PRs?
- [ ] Have I provided a clear explanation of the changes?
- [ ] Have I tested the changes manually?
- [ ] Are all unit tests still passing? (`pnpm test:silent`)
  - [ ] Have I created new automated tests (`pnpm test:create`) or updated existing tests related to the PR's changes?
- [ ] Have I provided screenshots/videos of the changes (if applicable)?
  - [ ] Have I made sure that any UI change works for both UI themes (dark and light)?

#### Are there any localization additions or changes? If so:

- [ ] Has a locales PR been created on the [locales](https://github.com/despair-games/poketernity-locales) repo?
  - [ ] If so, please leave a link to it here:
- [ ] Have I added the `Localization` tag to this PR?
<!-- not relevant for now - [ ] Has the translation team been contacted for proofreading/translation? -->
<!-- You can find a summarized version of the merging process surrounding locale PRs in your locale PR itself. For full instructions, check [localization.md](https://github.com/Despair-Games/poketernity/blob/beta/docs/localization.md) -->

#### If there are no locale changes:
- [ ] Have I made sure **not** to commit any changes to the locale repo on this branch?
<!-- check the `Files Changed` tab on the PR to be sure. 
`public/locales` should not appear here, or it will create needless conflicts for future PRs and could potentially roll back changes already merged to beta. -->

<!-- How to fix it if no: -->
<!-- #### Using the Command Line:
- Go to https://github.com/Despair-Games/poketernity/tree/beta/public and copy the hash of the current locale commit beta is pointing to
- If the hash corresponds to the latest commit in the locale repo:
  - `pnpm update-locales:remote`
  - `git add public/locales`
  - make your commit, push etc
- If it's not the latest commit:
  - `git checkout beta`
  - if not up to date: `git pull`. Otherwise: `pnpm update-locales:remote`
  - `git checkout {this pr's branch}`
  - `git add public/locales`
  - make your commit, push etc

 /!\ anyone using another tool, feel free to add instructions there /!\

You may have to do this again later and fix conflicts if beta keeps updating the locale repo.
**When fixing conflicts, make sure you prioritize the latest commit between the one on beta and this branch, to avoid any rollbacks.** -->
<!--
SPDX-FileCopyrightText: 2025-2026 Despair Games
SPDX-FileContributor: NightKev <https://github.com/DayKev>
SPDX-FileContributor: Bertie690 <https://github.com/Bertie690>

SPDX-License-Identifier: CC-BY-NC-SA-4.0
-->

## ✅ Submitting a Pull Request

Most information related to submitting a pull request is contained within comments inside the [default pull request template](./.github/pull_request_template.md). \
This section serves to elaborate on particular parts of the PR creation workflow that cannot fit fully inside the margins.

### PR Title Format
This repository follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard for PR titles, enforced by an automated GitHub Actions workflow.

Each PR must contain a valid prefix (and optionally a valid scope), followed by a colon and then the PR's subject line. \
```
fix(move): Future Sight no longer crashes
^   ^      ^
|   |      |__ Subject
|   |_________ Scope (optional)
|_____________ Prefix
```

> [!IMPORTANT]
> If a save migrator, version increase or other breaking change is part of the PR, a `!` must be added before the `:`.

Try to keep the title under 72 characters, as GitHub cuts off commit titles longer than this length.

#### Examples
```
refactor(data)!: improve serialization of Pokemon save data
balance: update TM compatibility lists
fix(move): Retaliate now saves power boost between waves
test: preserve text output of original shards
```

#### List of valid prefixes

- "balance" - Changes primarily related to game balance
- "chore" - Misc project upkeep (e.g. updating submodules, updating dependencies) not covered by other prefixes
- "dev" - Improving the developer experience (such as by modifying lint rules or creating cli scripts)
- "docs" - Primarily adding/updating documentation
- "feat" - Adding a new feature (e.g. adding a new implementation of a move) or redesigning an existing feature
- "fix" - Fixing a bug
- "github" - Updating the CI pipeline or otherwise modifying something in the `./github/**` directory
- "i18n" - Adding/modifying translation keys, etc
- "misc" - A change that doesn't fit any other prefix
- "perf" - A refactor aimed at improving performance
- "refactor" - A change that doesn't impact functionality or fix any bugs (except incidentally)
- "test" - Primarily adding/updating tests or modifying the test framework

#### List of valid scopes

- "ability"
- "ai"
- "anomaly" - Formerly "Mystery Encounters"
- "audio"
- "battle" - Relating to the general battle engine
- "biomes"
- "challenge"
- "event" - e.g. adding a Christmas event to the game
- "graphics" - Anything related to art/graphics (adding new sprites, fixing a sprite that isn't displaying properly, etc)
- "item"
- "move"
- "ui" - UI/UX

> [!IMPORTANT]
> All scopes are valid when using the "docs", "feat", "fix", "refactor" and "test" prefixes. \
> All scopes except "audio", "battle", "graphics", and "ui" are valid when using the "balance" prefix. \
> No other prefixes have valid scopes.
>
> There is a special "beta" scope for the "fix" prefix,
> for fixing bugs that only existed on the `beta` branch that never made it onto `main`.
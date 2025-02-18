# Pokéternity

Pokéternity is a browser based Pokémon fangame heavily inspired by the roguelite genre. Battle endlessly while gathering stacking items, exploring many different biomes, fighting trainers, bosses, and more!

# Contributing

Make sure to read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing!

## 🛠️ Development

If you have the motivation and experience with Typescript/Javascript (or are willing to learn) please feel free to fork the repository and make pull requests with contributions. If you don't know what to work on but want to help, reference the below **To-Do** section.

### 💻 Environment Setup

#### Prerequisites

- node: 20.13.1
- npm: [how to install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- git: [how to install](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (needed to retrieve the translations)

#### Running Locally

1. Clone the repo through git and in the root directory run `npm install`
If the install process seems to hang at the post-install step, you likely just need to press `Enter` for it continue.
<!--   - _if you run into any errors, reach out in the **#dev-corner** channel in discord_-->
2. Run `npm run start:dev` to locally run the project in `localhost:8000`
If you want to access the game from any device on your local network, you can run `npm run start:dev -- --host`

#### Tests

We are using [vitest](https://vitest.dev/) as a testing framework for the game. The full test suite can be run with the command `npm run test:silent`. Most PRs are expected to add tests for their new features or bug fixes to avoid future regression. A basic test file for a variety of cases can be created by running the `npm run test:create` command.

#### Code-Style

We are using [prettier](https://prettier.io/) to format our code. It will run automatically during the pre-commit hook so don't worry about having to format the code manually properly.

#### Linting

We're using ESLint as our common linter and formatter. It will run automatically during the pre-commit hook but if you would like to manually run it, use the `npm run eslint` script. To view the complete rules, check out the [eslint.config.js](./eslint.config.js) file.

#### Localization

Pokéternity's translations are managed under a dedicated repository at https://github.com/Despair-Games/poketernity-locales/. There is a specific process involved in making PRs that impacts the in game text, which can be found in the [localization.md](./docs/localization.md) file.


<!-- Todo: write up on typecheck and depcruise -->

<!-- ### 📚 Documentation

You can find the auto-generated documentation [here](https://despair-games.github.io/poketernity/main/index.html).
For information on enemy AI, check out the [enemy-ai.md](./docs/enemy-ai.md) file.
For detailed guidelines on documenting your code, refer to the [comments.md](./docs/comments.md) file. -->

### ❔ FAQ

**How do I test a new **\_\_\_**?**

- In the `src/overrides.ts` file there are overrides for most values you'll need to change for testing

**How do I retrieve the translations?**

- The translations are found in a [dedicated repository](https://github.com/despair-games/poketernity-locales) and are applied as a submodule in this project.
- The command to retrieve the translations is `git submodule update --init --recursive`. <!--If you still struggle to get it working, please reach out in [TBD].-->

> [!NOTE]
> We have recently made major changes to our testing framework (see #158 and #247). If you experience any weird issues with unit tests, especially issues that only occur when running multiple test files in a single run, please feel free to reach out for help.

## 🪧 To Do

Check out [Github Issues](https://github.com/despair-games/poketernity/issues) to see how can you help us!

# 📝 Credits

> If this project contains assets you have produced and you do not see your name, **please** reach out [here on GitHub](https://github.com/despair-games/poketernity/issues/new).

Thank you to all the wonderful people that have contributed to the project! You can find the credits [here](./CREDITS.md).

# Pokéternity

Pokéternity is a browser based Pokémon fangame heavily inspired by the roguelite genre. Battle endlessly while gathering stacking items, exploring many different biomes, fighting trainers, bosses, and more!

# Contributing

## 🛠️ Development

If you have the motivation and experience with Typescript/Javascript (or are willing to learn) please feel free to fork the repository and make pull requests with contributions. If you don't know what to work on but want to help, reference the below **To-Do** section.

### 💻 Environment Setup

#### Prerequisites

- node: 20.13.1
- npm: [how to install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### Running Locally

1. Clone the repo and in the root directory run `npm install`
<!--   - _if you run into any errors, reach out in the **#dev-corner** channel in discord_-->
2. Run `npm run start:dev` to locally run the project in `localhost:8000`

#### Code-Style

We are using [prettier](https://prettier.io/) to format our code. It will run automatically during the pre-commit hook so don't worry about having to format the code manually properly.

#### Linting

We're using ESLint as our common linter and formatter. It will run automatically during the pre-commit hook but if you would like to manually run it, use the `npm run eslint` script. To view the complete rules, check out the [eslint.config.js](./eslint.config.js) file.

<!-- ### 📚 Documentation

You can find the auto-generated documentation [here](https://despair-games.github.io/poketernity/main/index.html).
For information on enemy AI, check out the [enemy-ai.md](./docs/enemy-ai.md) file.
For detailed guidelines on documenting your code, refer to the [comments.md](./docs/comments.md) file. -->

### ❔ FAQ

**How do I test a new **\_\_\_**?**

- In the `src/overrides.ts` file there are overrides for most values you'll need to change for testing

**How do I retrieve the translations?**

- The translations were moved to the [dedicated translation repository](https://github.com/despair-games/poketernity-locales) and are now applied as a submodule in this project.
- The command to retrieve the translations is `git submodule update --init --recursive`. <!--If you still struggle to get it working, please reach out to #dev-corner channel in Discord.-->

## 🪧 To Do

Check out [Github Issues](https://github.com/despair-games/poketernity/issues) to see how can you help us!

# 📝 Credits

> If this project contains assets you have produced and you do not see your name, **please** reach out [here on GitHub](https://github.com/despair-games/poketernity/issues/new).

Thank you to all the wonderful people that have contributed to the project! You can find the credits [here](./CREDITS.md).

# Localization (for Developers)

Pokéternity's Team puts immense effort into making the game accessible around the world, supporting over 9 different languages at the time of writing this document. As a developer, it's important to help maintain global accessibility by effectively coordinating with the Translation Team on any new feature or enhancement. This document will cover everything you need to know to help keep the integration process for localization smooth and simple.

Before you continue, this document assumes:
- You are familiar with Git commands and GitHub's tools at a basic level.
- You have already set up an environment for development according to the README at https://github.com/Despair-Games/poketernity/.
<!-- TBD You have joined the [community Discord]() and joined the development channels via **#select-roles**. The development channels are the easiest way to keep in touch with the Translation Team and other developers. -->

## About the `poketernity-locales` Submodule

Pokéternity's translations are managed under a dedicated repository at https://github.com/Despair-Games/poketernity-locales/. This repository is integrated into the main repository as a [submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) within the `public/locales` folder.

### What Is a Submodule?

Basically, if a project wants to invoke another project from within, the project being used internally (in this case, `poketernity-locales`) is implemented as a **submodule**. From the perspective of the main project, the locales submodule is fairly simple to work with, but there are some important commands to keep in mind for development and troubleshooting.

#### Setting Up the Submodule in Your Main Fork

When you first start development in your main fork, you can fetch translations from the locales repo with this command:
```
git submodule update --init --recursive
```

If you run into issues with your development environment after doing so, you may have to delete the `.git/modules/public` and `public/locales` folders, then run the command again.

#### Updating Locales to the Latest Version

When you need to fetch recent locale changes into your working branch, you can do so with this command:
```
git submodule update --remote --recursive
```

## Adding Translated Text

### How Are Translations Integrated?

This project uses the [i18next library](https://www.i18next.com/) to integrate translations from `public/locales` into the source code based on the user's settings or location. The basic process for fetching translated text is as follows:
1. The source code fetches text by a given key, e.g.
    ```ts
    i18next.t("fileName:keyName", { arg1: "Hello", arg2: "an example", ... })
    ```
2. The game looks up the key in the corresponding JSON file in the user's language, e.g.
    ```ts
    // from "en/file-name.json"...
    "keyName": "{{arg1}}! This is {{arg2}} of translated text!"
    ```
    If the key doesn't exist for the user's language, the game will default to the corresponding English key.
3. The game shows the text to the user:
    ```ts
    "Hello! This is an example of translated text!"
    ```

### Requirements for Adding Translated Text

If you have a feature or enhancement that requires additions or changes to in-game text, you will need to make a fork of the `poketernity-locales` repo and submit your text changes as a pull request to that repo in addition to your pull request to the main project. Since these two PRs aren't technically linked, it's important to coordinate with the Translation Team to ensure that both PRs are integrated safely into the project. As the developer, you are responsible for creating or adjusting English keys in support of your feature or enhancement; the Translation Team will take care of the rest.

When your new feature or enhancement requires a new key **without changing text in existing keys**, we require the following workflow with regards to localization:
1. You (the developer) make a pull request to the main repository for your new feature. If this feature requires new text, the text should be integrated into the code with a new `i18next` key pointing to where you plan to add it into the `poketernity-locales` repository. **DO NOT HARDCODE PLAYER-FACING ENGLISH TEXT INTO THE CODE!**
2. You then make another pull request -- this time to the `poketernity-locales` repository -- adding a new entry to the English locale with text for each key you added to your main PR. For any feature pulled from the mainline Pokémon games (e.g. a Move or Ability implementation), it's best practice to include a source link for any added text within the locale PR. [Poké Corpus](https://abcboy101.github.io/poke-corpus/) is a great resource for finding text from the mainline games; otherwise, a YouTube video link showing the text in mainline is sufficient.
<!-- You should also {who to contact/where to post} whenever you make a new PR to locales to ensure a fast response. -->
3. The Translation Team will approve the locale PR (after corrections, if necessary), then merge it into `poketernity-locales`.
4. You can then test integration in your main PR after fetching the updated locale (`git submodule update --remote --recursive`). To ease the review process, you should provide a video of any text additions being shown in-game at this point.
5. The Dev Team will approve your main PR for your feature, then merge it into Pokéternity's beta environment.

### Requirements for Modifying Translated Text

PRs that modify existing text have different risks with respect to coordination between development and translation, so their requirements are slightly different:
- As above, you set up 2 PRs: one for the feature itself in the main repo, and another for the changes you need to make to the locale repo as a result of your feature.
- Now, however, you need to have your main PR be approved by the Dev Team **before** your corresponding locale changes are merged in.
- After your main PR is approved, the Translation Team will merge your locale PR, and you may update the submodule and post video evidence of locale integration as above.
<!-- - A Lead or Senior Translator from the Translation Team will then approve your main PR (if all is well), clearing your feature for merging into beta. -->

If you have any questions about the developer process for localization, don't hesitate to ask in the PR itself. <!--feel free to contact us on [Discord]().--> The Dev Team and Translation Team will be happy to help!
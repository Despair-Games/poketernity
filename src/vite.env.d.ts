/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT?: string;
  readonly VITE_BYPASS_LOGIN?: string;
  readonly VITE_BYPASS_TUTORIAL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SERVER_URL?: string;
  readonly VITE_DISCORD_CLIENT_ID?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_WIKI_URL?: string;
  readonly VITE_DISCORD_URL?: string;
  readonly VITE_GITHUB_URL?: string;
  readonly VITE_REDDIT_URL?: string;
  readonly VITE_DONATE_URL?: string;
  readonly VITE_APP_ABBREVIATION?: string;
  // Debug vars
  /** Enables i18n debug logging when set to `"1"` */
  readonly VITE_I18N_DEBUG?: string;
  /** Enables API debug logging when set to `"1"` */
  readonly VITE_API_DEBUG?: string;
  /** Enables Modifiers debug logging when set to `"1"` */
  readonly VITE_MODIFIERS_DEBUG?: string;
  /** Enables UI debug logging. `"0"`: disabled; `"1"`: only logs ui mode changes; `"2"`: all ui logging enabled */
  readonly VITE_UI_DEBUG?: string;
  /** Contains the name of the current git branch (Only available in development!) */
  readonly VITE_GIT_BRANCH?: string;
  /** Set to `"0"` to remove the branch-name element from the DOM. Set to `"1"` to show it. _Only available in `"development"` mode!_ */
  readonly VITE_SHOW_BRANCH_NAME?: string;
  readonly NODE_ENV?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

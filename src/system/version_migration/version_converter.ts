import type { SessionSaveData } from "#app/@types/SessionData";
import type { SessionSaveMigrator } from "#app/@types/SessionSaveMigrator";
import type { Settings } from "#app/@types/Settings";
import type { SettingsSaveMigrator } from "#app/@types/SettingsSaveMigrator";
import type { SystemSaveData } from "#app/@types/SystemData";
import type { SystemSaveMigrator } from "#app/@types/SystemSaveMigrator";
import { compareVersions } from "compare-versions";
import { version } from "../../../package.json";

/*
// template for save migrator creation
// versions/vA_B_C.ts

// The version for each migrator should match the filename, ie: `vA_B_C.ts` -> `version: "A.B.C"

// The name for each migrator should match its purpose. For example, if you're fixing
// the ability index of a pokemon, it might be called `migratePokemonAbilityIndex`

const systemMigratorA: SystemSaveMigrator = {
  version: "A.B.C",
  migrate: (data: SystemSaveData): void => {
    // migration code goes here
  },
};

export const vA_B_C_SystemMigrators: SystemSaveMigrator[] = [systemMigratorA] as const;

const sessionMigratorA: SessionSaveMigrator = {
  version: "A.B.C",
  migrate: (data: SessionSaveData): void => {
    // migration code goes here
  },
};

export const vA_B_C_SessionMigrators: SessionSaveMigrator[] = [sessionMigratorA] as const;

const settingsMigratorA: SettingsSaveMigrator = {
  version: "A.B.C",
  migrate: (data: Partial<Settings>): void => {
    // migration code goes here
  },
};

export const vA_B_C_SettingsMigrators: SettingsSaveMigrator[] = [settingsMigratorA] as const;
*/

// --- vA.B.C PATCHES --- //
// import { vA_B_C_SystemMigrators, vA_B_C_SessionMigrators, vA_B_C_SettingsMigrators } from "./versions/vA_B_C";

/** Current game version */
const LATEST_VERSION = version;

type SaveMigrator = SystemSaveMigrator | SessionSaveMigrator | SettingsSaveMigrator;

type SaveData = SystemSaveData | SessionSaveData | Partial<Settings>;

// To add new migrators, create a new `.push()` line like so:
// `systemMigrators.push(...v1_1_0_SystemMigrators);`

/** All system save migrators */
const systemMigrators: SystemSaveMigrator[] = [];
systemMigrators.push(/* ...vA_B_C_SystemMigrators */);

/** All session save migrators */
const sessionMigrators: SessionSaveMigrator[] = [];
sessionMigrators.push(/* ...vA_B_C_SessionMigrators */);

/** All settings migrators */
const settingsMigrators: SettingsSaveMigrator[] = [];
settingsMigrators.push(/* ...vA_B_C_SettingsMigrators */);

/** Sorts migrators by their stated version, ensuring they are applied in order from oldest to newest */
const sortMigrators = (migrators: SaveMigrator[]): void => {
  migrators.sort((a, b) => compareVersions(a.version, b.version));
};

sortMigrators(systemMigrators);
sortMigrators(sessionMigrators);
sortMigrators(settingsMigrators);

const applyMigrators = (migrators: readonly SaveMigrator[], data: SaveData, saveVersion: string) => {
  for (const migrator of migrators) {
    const isMigratorVersionHigher = compareVersions(saveVersion, migrator.version) === -1;
    if (isMigratorVersionHigher) {
      migrator.migrate(data as any);
    }
  }
};

/**
 * Converts incoming {@linkcode SystemSaveData} that has a version below the
 * current version number listed in `package.json`.
 *
 * Note that no transforms act on the {@linkcode data} if its version matches
 * the current version or if there are no migrations made between its version up
 * to the current version.
 * @param data {@linkcode SystemSaveData}
 * @see {@link SystemVersionConverter}
 */
export function applySystemVersionMigration(data: SystemSaveData) {
  const prevVersion = data.gameVersion;
  const isCurrentVersionHigher = compareVersions(prevVersion, LATEST_VERSION) === -1;

  if (isCurrentVersionHigher) {
    applyMigrators(systemMigrators, data, prevVersion);
    console.log(`System data successfully migrated to v${LATEST_VERSION}!`);
  }
}

/**
 * Converts incoming {@linkcode SessionSavaData} that has a version below the
 * current version number listed in `package.json`.
 *
 * Note that no transforms act on the {@linkcode data} if its version matches
 * the current version or if there are no migrations made between its version up
 * to the current version.
 * @param data {@linkcode SessionSaveData}
 * @see {@link SessionVersionConverter}
 */
export function applySessionVersionMigration(data: SessionSaveData) {
  const prevVersion = data.gameVersion;
  const isCurrentVersionHigher = compareVersions(prevVersion, LATEST_VERSION) === -1;

  if (isCurrentVersionHigher) {
    // Always sanitize money as a safeguard
    data.money = Math.floor(data.money);

    applyMigrators(sessionMigrators, data, prevVersion);
    console.log(`Session data successfully migrated to v${LATEST_VERSION}!`);
  }
}

/**
 * Converts incoming settings data that has a version below the
 * current version number listed in `package.json`.
 *
 * Note that no transforms act on the {@linkcode data} if its version matches
 * the current version or if there are no migrations made between its version up
 * to the current version.
 * @param data Settings data object
 * @see {@link SettingsVersionConverter}
 */
export function applySettingsVersionMigration(data: Partial<Settings>) {
  const prevVersion = data.meta?.gameVersion;
  const isCurrentVersionHigher = prevVersion && compareVersions(prevVersion, LATEST_VERSION) === -1;

  if (isCurrentVersionHigher) {
    applyMigrators(settingsMigrators, data, prevVersion);
    console.log(`Settings successfully migrated to v${LATEST_VERSION}!`);
  }
}

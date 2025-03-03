import type { SessionSaveData } from "#app/@types/SessionData";
import type { Settings } from "#app/@types/Settings";
import type { SystemSaveData } from "#app/@types/SystemData";
import { compareVersions } from "compare-versions";
import { version } from "../../../package.json";

/*
// template for save migrator creation
// versions/vA_B_C.ts

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
  migrate: (data: Settings): void => {
    // migration code goes here
  },
};

export const vA_B_C_SettingsMigrators: SettingsSaveMigrator[] = [settingsMigratorA] as const;
*/

// --- vA.B.C PATCHES --- //
// import { vA_B_C_SystemMigrators, vA_B_C_SessionMigrators, vA_B_C_SettingsMigrators } from "./versions/vA_B_C";

/** Current game version */
const LATEST_VERSION = version;

interface SystemSaveMigrator {
  version: string;
  migrate: (data: SystemSaveData) => void;
}

interface SessionSaveMigrator {
  version: string;
  migrate: (data: SessionSaveData) => void;
}

interface SettingsSaveMigrator {
  version: string;
  migrate: (data: Partial<Settings>) => void;
}

type SaveMigrator = SystemSaveMigrator | SessionSaveMigrator | SettingsSaveMigrator;

type SaveData = SystemSaveData | SessionSaveData | Partial<Settings>;

// Add new migrators within the appropriate `.concat()`
// Example: `const systemMigrators: SystemSaveMigrator[] = [].concat(v1_1_0_SystemMigrators, v1_3_1_SystemMigrators);`

/** All system save migrators */
const systemMigrators: SystemSaveMigrator[] = [].concat();
/** All session save migrators */
const sessionMigrators: SessionSaveMigrator[] = [].concat();
/** All settings migrators */
const settingsMigrators: SettingsSaveMigrator[] = [].concat();

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

import type { SessionSaveData } from "#app/@types/SessionData";
import type { Settings } from "#app/@types/Settings";
import type { SystemSaveData } from "#app/@types/SystemData";
import { compareVersions } from "compare-versions";
import { version } from "../../../package.json";

/*
// template for save migrator creation
// versions/vA_B_C.ts
const systemMigratorA = (data: SystemSaveData): void => {};

export const systemMigrators = [systemMigratorA] as const;

const settingsMigratorA = (data: Settings): void => {};

export const settingsMigrators = [settingsMigratorA] as const;

const sessionMigratorA = (data: SessionSaveData): void => {};

export const sessionMigrators = [sessionMigratorA] as const;
*/

// --- vA.B.C PATCHES --- //
// import * as vA_B_C from "./versions/vA_B_C";

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
  const isCurrentVersionHigher = compareVersions(prevVersion, version) === -1;

  if (isCurrentVersionHigher) {
    const converter = new SystemVersionConverter();
    converter.applyStaticPreprocessors(data);
    converter.applyMigration(data, prevVersion);
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
  const isCurrentVersionHigher = compareVersions(prevVersion, version) === -1;

  if (isCurrentVersionHigher) {
    const converter = new SessionVersionConverter();
    converter.applyStaticPreprocessors(data);
    converter.applyMigration(data, prevVersion);
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
  const isCurrentVersionHigher = prevVersion && compareVersions(prevVersion, version) === -1;

  if (isCurrentVersionHigher) {
    const converter = new SettingsVersionConverter();
    converter.applyStaticPreprocessors(data);
    converter.applyMigration(data, prevVersion);
  }
}

/**
 * Abstract class encapsulating the logic for migrating data from a given version up to
 * the current version listed in `package.json`.
 *
 * Note that, for any version converter, the corresponding `applyMigration`
 * function would only need to be changed once when the first migration for a
 * given version is introduced. Similarly, a version file (within the `versions`
 * folder) would only need to be created for a version once with the appropriate
 * array nomenclature.
 */
abstract class VersionConverter {
  /**
   * Iterates through an array of designated migration functions that are each
   * called one by one to transform the data.
   * @param data The data to be operated on
   * @param migrationArr An array of functions that will transform the incoming data
   */
  callMigrators(data: any, migrationArr: readonly any[]) {
    for (const migrate of migrationArr) {
      migrate(data);
    }
  }

  /**
   * Applies any version-agnostic data sanitation as defined within the function
   * body.
   * @param data The data to be operated on
   */
  applyStaticPreprocessors(_data: any): void {}

  /**
   * Uses the current version the incoming data to determine the starting point
   * of the migration which will cascade up to the latest version, calling the
   * necessary migration functions in the process.
   * @param data The data to be operated on
   * @param curVersion [0] Current major version
   *                   [1] Current minor version
   *                   [2] Current patch version
   */
  abstract applyMigration(data: any, prevVersion: string): void;
}

/**
 * Class encapsulating the logic for migrating {@linkcode SessionSaveData} from
 * a given version up to the current version listed in `package.json`.
 * @extends VersionConverter
 */
class SessionVersionConverter extends VersionConverter {
  override applyStaticPreprocessors(data: SessionSaveData): void {
    // Always sanitize money as a safeguard
    data.money = Math.floor(data.money);
  }

  override applyMigration(_data: SessionSaveData, _prevVersion: string): void {
    console.log(`Session data successfully migrated to v${version}!`);
  }
}

/**
 * Class encapsulating the logic for migrating {@linkcode SystemSaveData} from
 * a given version up to the current version listed in `package.json`.
 * @extends VersionConverter
 */
class SystemVersionConverter extends VersionConverter {
  override applyMigration(_data: SystemSaveData, _prevVersion: string): void {
    console.log(`System data successfully migrated to v${version}!`);
  }
}

/**
 * Class encapsulating the logic for migrating settings data from
 * a given version up to the current version listed in `package.json`.
 * @extends VersionConverter
 */
class SettingsVersionConverter extends VersionConverter {
  override applyMigration(_data: Partial<Settings>, _prevVersion: string): void {
    console.log(`Settings successfully migrated to v${version}!`);
  }
}

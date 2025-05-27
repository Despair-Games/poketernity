import { api } from "#api/api";
import {
  BYPASS_LOGIN,
  RUN_HISTORY_LS_KEY_PREFIX,
  SAVE_SLOT_LIMIT,
  SEEN_DIALOGUE_LS_KEY,
  SESSION_DATA_LS_KEY_PREFIX,
  SETTINGS_LS_KEY,
  STARTER_PREF_LS_KEY_PREFIX,
  SYSTEM_DATA_LS_KEY_PREFIX,
  TUTORIALS_LS_KEY,
} from "#constants/app-constants";
import { GameDataType } from "#enums/game-data-type";
import type { UserInfo } from "#types/user-info";
import { randomString } from "#utils/random-utils";

export let loggedInUser: UserInfo | null = null;
// This is a random string that is used to identify the client session - unique per session (tab or window) so that the game will only save on the one that the server is expecting
export const clientSessionId = randomString(32);

const OFFLINE_USERNAME = "Guest";

export function initLoggedInUser(): void {
  loggedInUser = { username: OFFLINE_USERNAME, lastSessionSlot: -1, discordId: "", googleId: "", hasAdminRole: false };
}

export function updateUserInfo(): Promise<[boolean, number]> {
  return new Promise<[boolean, number]>((resolve) => {
    // Offline
    if (BYPASS_LOGIN) {
      loggedInUser = {
        username: OFFLINE_USERNAME,
        lastSessionSlot: -1,
        discordId: "",
        googleId: "",
        hasAdminRole: false,
      };
      let lastSessionSlot = -1;
      for (let s = 0; s < SAVE_SLOT_LIMIT; s++) {
        if (localStorage.getItem(getLocalStorageKey(GameDataType.SESSION, s))) {
          lastSessionSlot = s;
          break;
        }
      }
      loggedInUser.lastSessionSlot = lastSessionSlot;
      return resolve([true, 200]);
    }

    // Online
    api.account.getInfo().then(([accountInfo, status]) => {
      if (!accountInfo) {
        resolve([false, status]);
        return;
      }
      loggedInUser = accountInfo;
      resolve([true, 200]);
    });
  });
}

/**
 * Retrieve the local storage key used to store the given data type.
 * For System data, Session data, Run history and starter preferences the key depends on the username.
 *
 * Note: needs to be in this file to prevent circular dependencies due to `updateUserInfo` calling it.
 *
 * @param dataType - The {@linkcode GameDataType} we want to store / retrieve from storage.
 * @param slotId - The save slot index, from 0 to 4 - only used for session data. Default: `0`.
 * @returns the key needed to store or retrieve the data.
 */
export function getLocalStorageKey(dataType: GameDataType, slotId: number = 0): string {
  let prefix = "";
  switch (dataType) {
    // Those data types have a static storage key
    case GameDataType.SETTINGS:
      return SETTINGS_LS_KEY;
    case GameDataType.TUTORIALS:
      return TUTORIALS_LS_KEY;
    case GameDataType.SEEN_DIALOGUES:
      return SEEN_DIALOGUE_LS_KEY;
    // The other data types have the username appended to the storage key
    case GameDataType.SYSTEM:
      prefix = SYSTEM_DATA_LS_KEY_PREFIX;
      break;
    case GameDataType.SESSION:
      prefix = `${SESSION_DATA_LS_KEY_PREFIX}${slotId + 1}`;
      break;
    case GameDataType.RUN_HISTORY:
      prefix = RUN_HISTORY_LS_KEY_PREFIX;
      break;
    case GameDataType.STARTER_PREFS:
      prefix = STARTER_PREF_LS_KEY_PREFIX;
      break;
  }
  return `${prefix}_${loggedInUser?.username}`;
}

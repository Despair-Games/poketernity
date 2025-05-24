import { loggedInUser } from "#app/account";
import {
  SETTINGS_LS_KEY,
  TUTORIALS_LS_KEY,
  SEEN_DIALOGUE_LS_KEY,
  SYSTEM_DATA_LS_KEY_PREFIX,
  SESSION_DATA_LS_KEY_PREFIX,
  RUN_HISTORY_LS_KEY_PREFIX,
  STARTER_PREF_LS_KEY_PREFIX,
} from "#constants/app-constants";
import { GameDataType } from "#enums/game-data-type";

/**
 * Retrieve the local storage key used to store the given data type.
 * For System data, Session data, Run history and starter preferences the key depends on the username.
 * @param dataType - The {@linkcode GameDataType} we want to store / retrieve from storage.
 * @param slotId - The save slot index, only used for session data. Default: `0`.
 * @returns the key needed to store or retrieve the data.
 */
export function getDataTypeKey(dataType: GameDataType, slotId: number = 0): string {
  let prefix = "";
  switch (dataType) {
    // Those data type have a static storage key
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
    case GameDataType.SESSION: {
      prefix = SESSION_DATA_LS_KEY_PREFIX;
      if (slotId) {
        prefix += slotId;
      }
      break;
    }
    case GameDataType.RUN_HISTORY:
      prefix = RUN_HISTORY_LS_KEY_PREFIX;
      break;
    case GameDataType.STARTER_PREFS:
      prefix = STARTER_PREF_LS_KEY_PREFIX;
      break;
  }
  return `${prefix}_${loggedInUser?.username}`;
}

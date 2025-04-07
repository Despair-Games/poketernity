import type { UserInfo } from "#app/@types/UserInfo";
import { bypassLogin } from "#app/constants";
import { api } from "#app/plugins/api/api";
import { randomString } from "#app/utils";

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
    if (bypassLogin) {
      loggedInUser = {
        username: OFFLINE_USERNAME,
        lastSessionSlot: -1,
        discordId: "",
        googleId: "",
        hasAdminRole: false,
      };
      let lastSessionSlot = -1;
      for (let s = 0; s < 5; s++) {
        if (localStorage.getItem(`sessionData${s ? s : ""}_${loggedInUser.username}`)) {
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
      } else {
        loggedInUser = accountInfo;
        resolve([true, 200]);
      }
    });
  });
}

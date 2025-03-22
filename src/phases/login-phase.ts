import { updateUserInfo } from "#app/account";
import { bypassLogin, SESSION_ID_COOKIE } from "#app/constants";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { settings } from "#app/system/settings/settings-manager";
import { handleTutorial } from "#app/tutorial";
import type { LoadingModalUiHandler } from "#app/ui/handlers/loading-modal-ui-handler";
import type { LoginFormUiHandler } from "#app/ui/handlers/login-form-ui-handler";
import type { RegistrationFormUiHandler } from "#app/ui/handlers/registration-form-ui-handler";
import { executeIf, getCookie, removeCookie } from "#app/utils";
import { PhaseId } from "#enums/phase-id";
import { PlayerGender } from "#enums/player-gender";
import { Tutorial } from "#enums/tutorial";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { SelectGenderPhase } from "./select-gender-phase";
import { UnavailablePhase } from "./unavailable-phase";

export class LoginPhase extends Phase {
  override readonly id = PhaseId.LOGIN;

  private readonly showText: boolean;

  constructor(showText: boolean = true) {
    super();

    this.showText = showText;
  }

  public override start(): void {
    super.start();

    const { gameData, ui } = globalScene;

    const hasSession = !!getCookie(SESSION_ID_COOKIE);

    ui.setMode<LoadingModalUiHandler>(UiMode.LOADING, { buttonActions: [] });
    executeIf(bypassLogin || hasSession, updateUserInfo).then((response) => {
      const success = response ? response[0] : false;
      const statusCode = response ? response[1] : null;
      if (!success) {
        if (!statusCode || statusCode === 400) {
          if (this.showText) {
            ui.showText(i18next.t("menu:logInOrCreateAccount"));
          }

          globalScene.audioManager.playSound("menu_open");

          const loadData = (): void => {
            updateUserInfo().then((success) => {
              if (!success[0]) {
                removeCookie(SESSION_ID_COOKIE);
                globalScene.reset(true, true);
                return;
              }
              gameData.loadSystem().then(() => this.end());
            });
          };

          ui.setMode<LoginFormUiHandler>(UiMode.LOGIN_FORM, {
            buttonActions: [
              (): void => {
                ui.playSelect();
                loadData();
              },
              (): void => {
                globalScene.audioManager.playSound("menu_open");
                ui.setMode<RegistrationFormUiHandler>(UiMode.REGISTRATION_FORM, {
                  buttonActions: [
                    (): void => {
                      ui.playSelect();
                      updateUserInfo().then((success) => {
                        if (!success[0]) {
                          removeCookie(SESSION_ID_COOKIE);
                          globalScene.reset(true, true);
                          return;
                        }
                        this.end();
                      });
                    },
                    (): void => {
                      globalScene.toLoginScreen({ showText: false, eager: true });
                      this.end();
                    },
                  ],
                });
              },
              (): void => {
                const redirectUri = encodeURIComponent(`${import.meta.env.VITE_SERVER_URL}/auth/discord/callback`);
                const discordId = import.meta.env.VITE_DISCORD_CLIENT_ID;
                const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&prompt=none`;
                window.open(discordUrl, "_self");
              },
              (): void => {
                const redirectUri = encodeURIComponent(`${import.meta.env.VITE_SERVER_URL}/auth/google/callback`);
                const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                const googleUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;
                window.open(googleUrl, "_self");
              },
            ],
          });
        } else if (statusCode === 401) {
          removeCookie(SESSION_ID_COOKIE);
          globalScene.reset(true, true);
        } else {
          globalScene.unshiftPhase(new UnavailablePhase());
          super.end();
        }
        return null;
      } else {
        gameData.loadSystem().then((success) => {
          if (success || bypassLogin) {
            this.end();
          } else {
            ui.setMessageMode();
            ui.showText(i18next.t("menu:failedToLoadSaveData"));
          }
        });
      }
    });
  }

  public override end(): void {
    globalScene.ui.setMessageMode();

    if (settings.display.playerGender === PlayerGender.UNSET) {
      globalScene.unshiftPhase(new SelectGenderPhase());
    }

    handleTutorial(Tutorial.INTRO).then(() => super.end());
  }
}

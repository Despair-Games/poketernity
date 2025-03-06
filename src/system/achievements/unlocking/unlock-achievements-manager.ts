import { battleSceneBus } from "#app/battle-scene-bus";
import { SceneBase } from "#app/scene-base";
import type { AchvCategory } from "#enums/achv-category";
import { newAchvs } from "../achievements";
import AchvBanner from "./achievements-banner";
import { achievementsBus } from "../achievements-events";

type UnlockAchievementsManagerData = {
  context: AchvCategory;
  unlockedAchievements: string[];
};

export class UnlockAchievementsManager extends SceneBase {
  private lockedAchievements: string[];
  private validAchievements: string[];
  private achievementBanners: AchvBanner[];

  constructor() {
    super({ key: "Achievements_Manager" });
  }

  init(data: UnlockAchievementsManagerData): void {
    this.validAchievements = [];
    this.achievementBanners = [];
    const unlockedAchievements = Object.keys(data.unlockedAchievements);
    this.lockedAchievements = Object.keys(newAchvs).filter(
      (achv) => newAchvs[achv].category === data.context && !unlockedAchievements.includes(achv),
    );
    this.events.once("create", () => {
      battleSceneBus.emit("scene/achievement_manager/ready");
    });
  }

  create() {
    achievementsBus.once("achievements/validate", (params) => this.validateAchievements(params));
    achievementsBus.on("achievements/display_banner", () => this.displayBanner());
    achievementsBus.on("achievements/queue_next_banner", () => this.queueNextBanner());
    achievementsBus.on("achievements/validation_completed", () =>
      battleSceneBus.emit("scene/achievement_manager/stop"),
    );
  }

  stop() {
    achievementsBus.removeAllListeners();
  }

  private validateAchievements(params: any): void {
    this.lockedAchievements.forEach((achv) => {
      if (newAchvs[achv].conditionFunc(params) && !this.validAchievements.includes(achv)) {
        this.validAchievements.push(achv);
      }
    });
    if (this.validAchievements.length > 0) {
      this.celebrateAchievements();
    } else {
      achievementsBus.emit("achievements/validation_completed");
    }
  }

  private celebrateAchievements(): void {
    battleSceneBus.emit("game_data/update/achievements", this.validAchievements);
    // Create as many banners as needed and update save data
    this.validAchievements.forEach((achv) => {
      this.achievementBanners.push(new AchvBanner(newAchvs[achv]));
    });
    achievementsBus.emit("achievements/display_banner");
  }

  private displayBanner(): void {
    this.achievementBanners[0].tween.play();
  }

  private queueNextBanner(): void {
    if (this.achievementBanners.length > 0) {
      this.achievementBanners[0].destroy();
    }
    this.achievementBanners.shift();
    if (this.achievementBanners.length === 0) {
      achievementsBus.emit("achievements/validation_completed");
    } else {
      achievementsBus.emit("achievements/display_banner");
    }
  }
}

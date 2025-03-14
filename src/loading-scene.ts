// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type UiWindowStyle } from "#enums/ui-window-style";
// -- end tsdoc imports --
import { GachaType } from "#enums/gacha-types";
import { getBiomeHasProps } from "#app/field/arena";
import CacheBustedLoaderPlugin from "#app/plugins/cache-busted-loader-plugin";
import { SceneBase } from "#app/scene-base";
import { getWindowVariantSuffix } from "#app/ui/ui-theme";
import { WindowVariant } from "#enums/window-variant";
import { isMobile } from "#app/touch-controls";
import { getEnumValues, getEnumKeys } from "#app/utils";
import { initPokemonPreEvolutions } from "#app/data/pokemon-pre-evolutions";
import { initBiomes } from "#app/data/balance/biomes";
import { initEggMoves } from "#app/data/balance/egg-moves";
import { initPokemonForms } from "#app/data/pokemon-forms";
import { initSpecies } from "./data/init/init-species";
import { initAchievements } from "#app/system/achievements";
import { initTrainerTypeDialogue } from "./data/init/init-trainer-type-dialogue";
import { initChallenges } from "#app/data/challenge";
import i18next from "i18next";
import { Biome } from "#enums/biome";
import { initMysteryEncounters } from "#app/data/mystery-encounters/mystery-encounters";
import { initVouchers } from "#app/system/init-vouchers";
import { CANVAS_SCALE, GAME_HEIGHT, GAME_WIDTH, TEMP_SCALE_ADJUSTMENT } from "#app/ui-constants";
import { ImagesFolder } from "#enums/images-folders";
import { CommonColor } from "#enums/color";
import { initAbilities } from "#app/data/init/init-abilities";
import { api } from "#app/plugins/api/api";
import { initMoves } from "#app/data/init/init-moves";
import { initModifierTypes } from "#app/modifier/init-modifier-types";
import { initModifierPools } from "#app/modifier/init-modifier-pools";
import { timedEventManager } from "#app/timed-event-manager";
import { DEFAULT_LANGUAGE_KEY } from "#app/system/settings/supported-languages";

export class LoadingScene extends SceneBase {
  public static readonly KEY = "loading";

  readonly LOAD_EVENTS = Phaser.Loader.Events;

  constructor() {
    super(LoadingScene.KEY);

    Phaser.Plugins.PluginCache.register("Loader", CacheBustedLoaderPlugin, "load");
  }

  preload() {
    api.ping();
    this.load["manifest"] = this.game["manifest"];

    this.loadImage("loading_bg", ImagesFolder.ARENAS);
    this.loadImage("logo");

    /** UI Elements that change based on the {@linkcode UiWindowStyle} */
    for (const windowVariant of getEnumValues(WindowVariant)) {
      this.loadSpritesheet(`window${getWindowVariantSuffix(windowVariant)}`, ImagesFolder.UI_WINDOWS, 24, 24, {
        windowStyleDependant: true,
        uiThemeDependant: true,
      });
    }
    this.loadSpritesheet("trainer_namebox", ImagesFolder.UI_WINDOWS, 20, 20, { windowStyleDependant: true });
    this.loadSpritesheet("battle_message_box", ImagesFolder.UI_WINDOWS, 320, 48, { windowStyleDependant: true });

    this.loadSpritesheet("scroll_bar", ImagesFolder.UI, 8, 8, { windowStyleDependant: true });
    this.loadSpritesheet("scroll_bar_handle", ImagesFolder.UI, 8, 8, { windowStyleDependant: true });

    this.loadAtlas("numbers", ImagesFolder.UI);
    this.loadAtlas("numbers_red", ImagesFolder.UI);

    this.loadAtlas("type_bgs", ImagesFolder.UI);
    this.loadImage("type_tera", ImagesFolder.UI);

    this.loadAtlas("prompt", ImagesFolder.UI_CURSORS);
    this.loadImage("cursor", ImagesFolder.UI_CURSORS, { uiThemeDependant: true });
    this.loadImage("cursor_reverse", ImagesFolder.UI_CURSORS, { uiThemeDependant: true });
    this.loadImage("select_cursor", ImagesFolder.UI_CURSORS);
    this.loadImage("select_cursor_highlight", ImagesFolder.UI_CURSORS);
    this.loadImage("select_cursor_highlight_thick", ImagesFolder.UI_CURSORS);
    this.loadImage("select_cursor_pokerus", ImagesFolder.UI_CURSORS);
    this.loadImage("select_gen_cursor", ImagesFolder.UI_CURSORS); // same as select_cursor, could be removed by using it as a nineslice
    this.loadAtlas("summary_moves_cursor", ImagesFolder.UI_CURSORS);

    this.loadImage("ability_bar_left", ImagesFolder.UI_NOTIFICATION_BARS);
    this.loadImage("bgm_bar", ImagesFolder.UI_NOTIFICATION_BARS); // same as abilitity_bar_left, could be removed by using it as a nineslice
    this.loadImage("party_exp_bar", ImagesFolder.UI_NOTIFICATION_BARS); // same as abilitity_bar_left, could be removed by using it as a nineslice
    this.loadImage("achv_bar", ImagesFolder.UI_NOTIFICATION_BARS);
    this.loadImage("achv_bar_2", ImagesFolder.UI_NOTIFICATION_BARS);
    this.loadImage("achv_bar_3", ImagesFolder.UI_NOTIFICATION_BARS);
    this.loadImage("achv_bar_4", ImagesFolder.UI_NOTIFICATION_BARS);
    this.loadImage("achv_bar_5", ImagesFolder.UI_NOTIFICATION_BARS);

    this.loadImage("saving_icon", ImagesFolder.UI_MENU_ICONS);
    this.loadImage("discord", ImagesFolder.UI_MENU_ICONS);
    this.loadImage("google", ImagesFolder.UI_MENU_ICONS);
    this.loadImage("settings_icon", ImagesFolder.UI_MENU_ICONS);
    this.loadImage("link_icon", ImagesFolder.UI_MENU_ICONS);
    this.loadImage("unlink_icon", ImagesFolder.UI_MENU_ICONS);
    this.loadImage("icon_lock", ImagesFolder.UI_MENU_ICONS);
    this.loadImage("icon_stop", ImagesFolder.UI_MENU_ICONS);

    this.loadImage("shiny_star", ImagesFolder.UI_GAME_ICONS, { filenameRoot: "shiny" });
    this.loadImage("shiny_star_1", ImagesFolder.UI_GAME_ICONS, { filenameRoot: "shiny_1" });
    this.loadImage("shiny_star_2", ImagesFolder.UI_GAME_ICONS, { filenameRoot: "shiny_2" });
    this.loadImage("shiny_star_small", ImagesFolder.UI_GAME_ICONS, { filenameRoot: "shiny_small" });
    this.loadImage("shiny_star_small_1", ImagesFolder.UI_GAME_ICONS, { filenameRoot: "shiny_small_1" });
    this.loadImage("shiny_star_small_2", ImagesFolder.UI_GAME_ICONS, { filenameRoot: "shiny_small_2" });
    this.loadImage("icon_favorite", ImagesFolder.UI_GAME_ICONS);
    this.loadAtlas("shiny_icons", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("icon_ha_capsule", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("icon_champion_ribbon", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("icon_tera", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("icon_owned", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("icon_egg_move", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("candy", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("candy_overlay", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("friendship", ImagesFolder.UI_GAME_ICONS);
    this.loadImage("friendship_overlay", ImagesFolder.UI_GAME_ICONS);

    this.loadImage("pbinfo_player", ImagesFolder.UI_PB_INFO);
    this.loadImage("pbinfo_player_stats", ImagesFolder.UI_PB_INFO);
    this.loadImage("pbinfo_player_mini", ImagesFolder.UI_PB_INFO);
    this.loadImage("pbinfo_player_mini_stats", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_player_type", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_player_type1", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_player_type2", ImagesFolder.UI_PB_INFO);
    this.loadImage("pbinfo_enemy_mini", ImagesFolder.UI_PB_INFO);
    this.loadImage("pbinfo_enemy_mini_stats", ImagesFolder.UI_PB_INFO);
    this.loadImage("pbinfo_enemy_boss", ImagesFolder.UI_PB_INFO);
    this.loadImage("pbinfo_enemy_boss_stats", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_enemy_type", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_enemy_type1", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_enemy_type2", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_stat", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pbinfo_stat_numbers", ImagesFolder.UI_PB_INFO);

    this.loadImage("pb_tray_overlay_player", ImagesFolder.UI_PB_INFO);
    this.loadImage("pb_tray_overlay_enemy", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("pb_tray_ball", ImagesFolder.UI_PB_INFO);

    this.loadImage("overlay_lv", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("overlay_hp", ImagesFolder.UI_PB_INFO);
    this.loadAtlas("overlay_hp_boss", ImagesFolder.UI_PB_INFO);
    this.loadImage("overlay_exp", ImagesFolder.UI_PB_INFO);

    this.loadImage("dawn_icon_fg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("dawn_icon_mg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("dawn_icon_bg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("day_icon_fg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("day_icon_mg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("day_icon_bg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("dusk_icon_fg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("dusk_icon_mg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("dusk_icon_bg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("night_icon_fg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("night_icon_mg", ImagesFolder.UI_TIME_OF_DAY);
    this.loadImage("night_icon_bg", ImagesFolder.UI_TIME_OF_DAY);

    this.loadImage("party_bg_double", ImagesFolder.UI_PARTY);
    this.loadImage("party_bg", ImagesFolder.UI_PARTY);
    this.loadAtlas("party_cancel", ImagesFolder.UI_PARTY);
    this.loadImage("party_slot_hp_bar", ImagesFolder.UI_PARTY);
    this.loadAtlas("party_slot_hp_overlay", ImagesFolder.UI_PARTY);
    this.loadImage("party_slot_overlay_lv", ImagesFolder.UI_PARTY);
    this.loadAtlas("party_slot_main", ImagesFolder.UI_PARTY);
    this.loadAtlas("party_slot", ImagesFolder.UI_PARTY);

    this.loadImage("summary_bg", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_overlay_shiny", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_profile", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_profile_prompt_z", ImagesFolder.UI_SUMMARY); // The pixel Z button prompt
    this.loadImage("summary_profile_prompt_a", ImagesFolder.UI_SUMMARY); // The pixel A button prompt
    this.loadImage("summary_profile_ability", ImagesFolder.UI_SUMMARY); // Pixel text 'ABILITY'
    this.loadImage("summary_profile_passive", ImagesFolder.UI_SUMMARY); // Pixel text 'PASSIVE'
    this.loadImage("summary_status", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_stats", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_stats_overlay_exp", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_moves", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_moves_effect", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_moves_overlay_row", ImagesFolder.UI_SUMMARY);
    this.loadImage("summary_moves_overlay_pp", ImagesFolder.UI_SUMMARY);
    // Background of the 3 tabs of a pokemon's summary
    for (let t = 1; t <= 3; t++) {
      this.loadImage(`summary_tabs_${t}`, ImagesFolder.UI_SUMMARY);
    }

    this.loadImage("egg_list_bg", ImagesFolder.UI);
    this.loadImage("egg_summary_bg", ImagesFolder.UI);

    this.loadImage("starter_container_bg", ImagesFolder.UI);
    this.loadImage("starter_select_bg", ImagesFolder.UI);
    this.loadImage("passive_bg", ImagesFolder.UI);

    // Get current language and load the different localized images and atlases for it
    const lang = i18next.resolvedLanguage ?? DEFAULT_LANGUAGE_KEY;
    this.loadAtlas("status_icons", ImagesFolder.UI_STATUS_ICONS, { languageKey: lang });
    this.loadAtlas("type_icons", ImagesFolder.UI_TYPE_ICONS, { languageKey: lang });

    // Load the banner for the current or next event with a banner, if any
    const eventBanner = timedEventManager.getActiveOrNextEventBanner();
    if (eventBanner?.availableLangs) {
      // Banner with different localized versions
      const bannerLang = eventBanner.availableLangs.includes(lang) ? lang : DEFAULT_LANGUAGE_KEY;
      this.loadImage(eventBanner.key, ImagesFolder.BANNERS, { languageKey: bannerLang });
    } else if (eventBanner) {
      // Non localized banner
      this.loadImage(eventBanner.key, ImagesFolder.BANNERS);
    }

    // Load arena images
    this.loadImage("default_bg", ImagesFolder.ARENAS);
    getEnumValues(Biome).map((bt) => {
      const btKey = Biome[bt].toLowerCase();
      const isBaseAnimated = btKey === "end";
      const baseAKey = `${btKey}_a`;
      const baseBKey = `${btKey}_b`;
      this.loadImage(`${btKey}_bg`, ImagesFolder.ARENAS);
      if (!isBaseAnimated) {
        this.loadImage(baseAKey, ImagesFolder.ARENAS);
      } else {
        this.loadAtlas(baseAKey, ImagesFolder.ARENAS);
      }
      if (!isBaseAnimated) {
        this.loadImage(baseBKey, ImagesFolder.ARENAS);
      } else {
        this.loadAtlas(baseBKey, ImagesFolder.ARENAS);
      }
      if (getBiomeHasProps(bt)) {
        for (let p = 1; p <= 3; p++) {
          const isPropAnimated = p === 3 && ["power_plant", "end"].find((b) => b === btKey);
          const propKey = `${btKey}_b_${p}`;
          if (!isPropAnimated) {
            this.loadImage(propKey, ImagesFolder.ARENAS);
          } else {
            this.loadAtlas(propKey, ImagesFolder.ARENAS);
          }
        }
      }
    });

    // Load trainer images
    this.loadAtlas("trainer_m_back", ImagesFolder.TRAINER);
    this.loadAtlas("trainer_m_back_pb", ImagesFolder.TRAINER);
    this.loadAtlas("trainer_f_back", ImagesFolder.TRAINER);
    this.loadAtlas("trainer_f_back_pb", ImagesFolder.TRAINER);

    // Load character sprites
    this.loadAtlas("c_rival_m", ImagesFolder.CHARACTER, { filenameRoot: "rival_m" });
    this.loadAtlas("c_rival_f", ImagesFolder.CHARACTER, { filenameRoot: "rival_f" });

    // Load pokemon-related images
    this.loadImage("pkmn__back__sub", ImagesFolder.POKEMON_BACK, { filenameRoot: "sub" });
    this.loadImage("pkmn__sub", ImagesFolder.POKEMON, { filenameRoot: "sub" });
    this.loadAtlas("battle_stats", ImagesFolder.EFFECTS);
    this.loadAtlas("shiny", ImagesFolder.EFFECTS);
    this.loadAtlas("shiny_2", ImagesFolder.EFFECTS);
    this.loadAtlas("shiny_3", ImagesFolder.EFFECTS);
    this.loadImage("tera", ImagesFolder.EFFECTS);
    this.loadAtlas("pb_particles", ImagesFolder.EFFECTS);
    this.loadImage("evo_sparkle", ImagesFolder.EFFECTS);
    this.loadAtlas("tera_sparkle", ImagesFolder.EFFECTS);
    this.load.video("evo_bg", "images/effects/evo_bg.mp4", true);

    this.loadAtlas("pb");
    this.loadAtlas("items");
    this.loadAtlas("categories");

    this.loadAtlas("egg", ImagesFolder.EGG);
    this.loadAtlas("egg_crack", ImagesFolder.EGG);
    this.loadAtlas("egg_icons", ImagesFolder.EGG);
    this.loadAtlas("egg_shard", ImagesFolder.EGG);
    this.loadAtlas("egg_lightrays", ImagesFolder.EGG);
    getEnumKeys(GachaType).forEach((gt) => {
      const key = gt.toLowerCase();
      this.loadImage(`gacha_${key}`, ImagesFolder.EGG);
      this.loadAtlas(`gacha_underlay_${key}`, ImagesFolder.EGG);
    });
    this.loadImage("gacha_glass", ImagesFolder.EGG);
    this.loadImage("gacha_eggs", ImagesFolder.EGG);
    this.loadAtlas("gacha_hatch", ImagesFolder.EGG);
    this.loadImage("gacha_knob", ImagesFolder.EGG);

    this.loadImage("end_m", ImagesFolder.CG);
    this.loadImage("end_f", ImagesFolder.CG);

    for (let i = 0; i < 10; i++) {
      this.loadAtlas(`pokemon_icons_${i}`);
      if (i) {
        this.loadAtlas(`pokemon_icons_${i}v`);
      }
    }

    // Load Mystery Encounter dex progress icon
    this.loadImage("encounter_radar", ImagesFolder.ME);

    // Load controller button icons
    this.loadAtlas("dualshock", ImagesFolder.INPUTS);
    this.loadAtlas("xbox", ImagesFolder.INPUTS);
    this.loadAtlas("keyboard", ImagesFolder.INPUTS);

    // Load bitmap fonts
    this.load.bitmapFont("item-count", "fonts/item-count.png", "fonts/item-count.xml");

    // Load sound effects and music
    this.loadSe("select", "ui");
    this.loadSe("menu_open", "ui");
    this.loadSe("error", "ui");
    this.loadSe("hit");
    this.loadSe("hit_strong");
    this.loadSe("hit_weak");
    this.loadSe("stat_up");
    this.loadSe("stat_down");
    this.loadSe("faint");
    this.loadSe("flee");
    this.loadSe("low_hp");
    this.loadSe("exp");
    this.loadSe("level_up");
    this.loadSe("sparkle");
    this.loadSe("restore");
    this.loadSe("shine");
    this.loadSe("shing");
    this.loadSe("charge");
    this.loadSe("beam");
    this.loadSe("upgrade");
    this.loadSe("buy");
    this.loadSe("achv");

    this.loadSe("pb_rel");
    this.loadSe("pb_throw");
    this.loadSe("pb_bounce_1");
    this.loadSe("pb_bounce_2");
    this.loadSe("pb_move");
    this.loadSe("pb_catch");
    this.loadSe("pb_lock");
    this.loadSe("crit_throw");

    this.loadSe("pb_tray_enter");
    this.loadSe("pb_tray_ball");
    this.loadSe("pb_tray_empty");

    this.loadSe("egg_crack");
    this.loadSe("egg_hatch");
    this.loadSe("gacha_dial");
    this.loadSe("gacha_running");
    this.loadSe("gacha_dispense");

    this.loadSe("PRSFX- Transform", "battle_anims");

    this.loadBgm("menu");

    this.loadBgm("level_up_fanfare", "bw/level_up_fanfare.mp3");
    this.loadBgm("item_fanfare", "bw/item_fanfare.mp3");
    this.loadBgm("minor_fanfare", "bw/minor_fanfare.mp3");
    this.loadBgm("heal", "bw/heal.mp3");
    this.loadBgm("victory_trainer", "bw/victory_trainer.mp3");
    this.loadBgm("victory_team_plasma", "bw/victory_team_plasma.mp3");
    this.loadBgm("victory_gym", "bw/victory_gym.mp3");
    this.loadBgm("victory_champion", "bw/victory_champion.mp3");
    this.loadBgm("evolution", "bw/evolution.mp3");
    this.loadBgm("evolution_fanfare", "bw/evolution_fanfare.mp3");

    this.load.plugin(
      "rextexteditplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js",
      true,
    );

    this.loadLoadingScreen();

    initModifierTypes();
    initModifierPools();
    initAchievements();
    initVouchers();
    initPokemonPreEvolutions();
    initBiomes();
    initEggMoves();
    initPokemonForms();
    initTrainerTypeDialogue();
    initSpecies();
    initMoves();
    initAbilities();
    initChallenges();
    initMysteryEncounters();
  }

  loadLoadingScreen() {
    const mobile = isMobile();

    const loadingGraphics: any[] = [];

    const bg = this.add.image(0, 0, "");
    bg.setOrigin(0, 0);
    bg.setScale(CANVAS_SCALE);
    bg.setVisible(false);

    const graphics = this.add.graphics();

    graphics.lineStyle(4, 0xff00ff, 1).setDepth(10);

    const progressBar = this.add.graphics();
    // TODO: I think progressBox was meant to put a border around the progress bar, but isn't used at all?
    const progressBox = this.add.graphics();
    progressBox.lineStyle(5, 0xff00ff, 1.0);
    progressBox.fillStyle(0x222222, 0.8);

    const width = CANVAS_SCALE * GAME_WIDTH;
    const height = CANVAS_SCALE * GAME_HEIGHT;

    const midWidth = width / 2;
    const midHeight = height / 2;

    // TODO: add logo with proper scale and placement
    const logo = this.add.image(midWidth, height / 5, "");
    logo.setVisible(false);
    logo.setOrigin(0.5, 0.5);
    logo.setScale(4 * TEMP_SCALE_ADJUSTMENT);

    const percentText = this.make.text({
      x: midWidth,
      y: midHeight - 4 * CANVAS_SCALE,
      scale: TEMP_SCALE_ADJUSTMENT,
      text: "0%",
      style: {
        font: "72px emerald",
        color: CommonColor.WHITE,
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: midWidth,
      y: midHeight + 8 * CANVAS_SCALE,
      scale: TEMP_SCALE_ADJUSTMENT,
      text: "",
      style: {
        font: "48px emerald",
        color: CommonColor.WHITE,
      },
    });
    assetText.setOrigin(0.5, 0.5);

    const disclaimerText = this.make.text({
      x: midWidth,
      y: assetText.y + 25 * CANVAS_SCALE,
      scale: TEMP_SCALE_ADJUSTMENT,
      text: i18next.t("menu:disclaimer"),
      style: {
        font: "72px emerald",
        color: CommonColor.WARM_RED,
      },
    });
    disclaimerText.setOrigin(0.5, 0.5);

    const disclaimerDescriptionText = this.make.text({
      x: midWidth,
      y: disclaimerText.y + 20 * CANVAS_SCALE,
      scale: TEMP_SCALE_ADJUSTMENT,
      text: i18next.t("menu:disclaimerDescription"),
      style: {
        font: "48px emerald",
        color: CommonColor.OFF_WHITE,
        align: "center",
      },
    });
    disclaimerDescriptionText.setOrigin(0.5, 0.5);

    loadingGraphics.push(
      bg,
      graphics,
      progressBar,
      progressBox,
      logo,
      percentText,
      assetText,
      disclaimerText,
      disclaimerDescriptionText,
    );

    if (!mobile) {
      loadingGraphics.map((g) => g.setVisible(false));
    }

    this.load.once(this.LOAD_EVENTS.START, () => {
      setTimeout(() => {
        loadingGraphics.forEach((g) => g.setVisible(true));
      }, 500);
    });

    const progressBarWidth = width / 3;
    const progressBarHeight = 10 * CANVAS_SCALE;
    this.load.on(this.LOAD_EVENTS.PROGRESS, (progress: number) => {
      percentText.setText(`${Math.floor(progress * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 0.8);
      progressBar.fillRect(midWidth - progressBarWidth / 2, height / 3, progressBarWidth * progress, progressBarHeight);
    });

    this.load.on(this.LOAD_EVENTS.FILE_COMPLETE, (key: string) => {
      assetText.setText(i18next.t("menu:loadingAsset", { assetName: key }));
      switch (key) {
        case "loading_bg":
          bg.setTexture("loading_bg");
          if (mobile) {
            bg.setVisible(true);
          }
          break;
        case "logo":
          logo.setTexture("logo");
          if (mobile) {
            logo.setVisible(true);
          }
          break;
      }
    });

    this.load.on(this.LOAD_EVENTS.COMPLETE, () => {
      loadingGraphics.forEach((go) => go.destroy());
    });
  }

  get gameHeight() {
    return this.game.config.height as number;
  }

  get gameWidth() {
    return this.game.config.width as number;
  }

  async create() {
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.handleDestroy());
    this.scene.start("battle");
  }

  handleDestroy() {
    console.debug(`Destroying ${LoadingScene.KEY} scene`);
    this.load.off(this.LOAD_EVENTS.PROGRESS);
    this.load.off(this.LOAD_EVENTS.FILE_COMPLETE);
    this.load.off(this.LOAD_EVENTS.COMPLETE);
    // this.textures.remove("loading_bg"); is removed in BattleScene.launchBattle()
    this.children.removeAll(true);
    console.debug(`Destroyed ${LoadingScene.KEY} scene`);
  }
}

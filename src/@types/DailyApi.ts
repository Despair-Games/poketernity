import type { ScoreboardCategory } from "#enums/scoreboard-category";

export interface GetDailyRankingsRequest {
  category: ScoreboardCategory;
  page?: number;
}

export interface GetDailyRankingsPageCountRequest {
  category: ScoreboardCategory;
}

import type { BattleCommand } from "#enums/battle-command";

export type FightCommand = typeof BattleCommand.FIGHT | typeof BattleCommand.TERA;

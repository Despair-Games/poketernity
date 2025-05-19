import type { TurnCommand } from "#app/turn-command-manager";

export type TurnCommandFilter = (command: TurnCommand) => boolean;

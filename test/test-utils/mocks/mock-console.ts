const util = require("util");

const originalLog = console.log;
const originalError = console.error;
const originalDebug = console.debug;
const originalWarn = console.warn;

const blacklist = [
  "variant icon does not exist", // Repetitive warnings about icons not found
  'Texture "%s" not found', // Repetitive warnings about textures not found
  "type: 'Pokemon',", // Large Pokemon objects
  "gameVersion: ", // Large session-data and system-data objects
  "newModifierFunc: ", // Large ModifierType objects, displayed by ModifierSelectPhase
];
const whitelist = ["Start Phase"];

const RED_ANSI_CODE = "\u001b[31m";
const GREEN_ANSI_CODE = "\u001b[32m";
const YELLOW_ANSI_CODE = "\u001b[33m";
const BLUE_ANSI_CODE = "\u001b[36m";
const WHITE_ANSI_CODE = "\u001b[37m";

export class MockConsole {
  private logs: any[] = [];
  private notified: any[] = [];

  /**
   * A list of warnings that are queued to be displayed after all tests in the same file are finished.
   */
  private static queuedWarnings: any[] = [];

  /**
   * Queues a warning to be printed after all tests in the same file are finished.
   */
  public static queuePostTestWarning(...args) {
    MockConsole.queuedWarnings.push(args);
  }

  /**
   * Prints all post-test warnings that have been queued, and then also clears the queue.
   */
  public static printPostTestWarnings() {
    for (const args of MockConsole.queuedWarnings) {
      console.warn(...args);
    }
    MockConsole.queuedWarnings = [];
  }

  public log(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(argsStr);
    if (!whitelist.some((b) => argsStr.includes(b)) && blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    if (args[1] === "color:green;") {
      // Edge case for displaying green "Start phase" messages
      originalLog(...this.addColor(GREEN_ANSI_CODE, args[0].replace("%c", "")));
    } else if (args[0] === ">>") {
      // Displaying dialogue and in-battle messages caught by the TextInterceptor mock
      originalLog(...this.addColor(BLUE_ANSI_CODE, ...args));
    } else {
      originalLog(...args);
    }
  }
  public error(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(argsStr);
    originalError(...this.addColor(RED_ANSI_CODE, ...args));
  }
  public debug(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(argsStr);
    if (!whitelist.some((b) => argsStr.includes(b)) && blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    originalDebug(...this.addColor(WHITE_ANSI_CODE, ...args));
  }
  public warn(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(args);
    if (!whitelist.some((b) => argsStr.includes(b)) && blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    originalWarn(...this.addColor(YELLOW_ANSI_CODE, ...args));
  }

  public notify(msg) {
    originalLog(msg);
    this.notified.push(msg);
  }
  public getLogs() {
    return this.logs;
  }
  public clearLogs() {
    this.logs = [];
  }

  /**
   * Returns a human-readable string representation of `args`.
   */
  public getStr(args: any[]) {
    return util.inspect(args);
  }

  /**
   * Prepends the given color to every argument in the given args.
   * Also appends the white ANSI code as an extra argument, so that the added color does not leak to future messages.
   * @param color An ANSI escape sequence representing a color.
   * @param args The args that the color should be applied to.
   * @return A copy of `args` with the color prepended to every argument.
   */
  private addColor(color: string, ...args: any[]): any[] {
    return [...args.map((a) => `${color}${typeof a === "string" ? a : this.getStr(a)}`), WHITE_ANSI_CODE];
  }
}

const originalLog = console.log;
const originalError = console.error;
const originalDebug = console.debug;
const originalWarn = console.warn;

const blacklist = ["Phaser", "variant icon does not exist", 'Texture "%s" not found'];
const whitelist = ["Phase"];

const RED_ANSI_CODE = "\u001b[31m";
const YELLOW_ANSI_CODE = "\u001b[33m";

export class MockConsole {
  private logs: any[] = [];
  private notified: any[] = [];

  /**
   * A list of warnings that are queued to be displayed after all tests are finished.
   *
   * This is static so that it does not get overridden by the test framework constructing new `MockConsoleLog`s.
   */
  private static queuedWarnings: any[] = [];

  /**
   * Queues a warning to be printed after all tests are finished.
   */
  public static queuePostTestWarning(...args) {
    MockConsole.queuedWarnings.push(args);
  }

  /**
   * Prints all post-test warnings that have been queued. Does not clear the queue.
   */
  public static printPostTestWarnings() {
    for (const args of MockConsole.queuedWarnings) {
      console.warn(...args);
    }
  }

  public log(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(argsStr);
    if (!whitelist.some((b) => argsStr.includes(b)) && blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    originalLog(...args);
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
    originalDebug(...args);
  }
  public warn(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(args);
    if (!whitelist.some((b) => argsStr.includes(b)) && blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    originalWarn(...this.addColor(YELLOW_ANSI_CODE, ...args)); // Yellow
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
   * Return a semicolon-separated string listing all string arguments in `args`.
   */
  public getStr(args: any[]) {
    return args.filter((arg) => typeof arg === "string").join(";");
  }

  /**
   * Prepends the given color to every string in the given args.
   * @param color An ANSI escape sequence representing a color.
   * @param args The args that the color should be applied to.
   * @return A copy of `args` with the color prepended to every string argument.
   */
  private addColor(color: string, ...args: any[]): any[] {
    return args.map((a) => (typeof a === "string" ? color + a : a));
  }
}

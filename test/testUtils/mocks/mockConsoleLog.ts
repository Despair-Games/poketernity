const originalLog = console.log;
const originalError = console.error;
const originalDebug = console.debug;
const originalWarn = console.warn;

const blacklist = ["Phaser", "variant icon does not exist", 'Texture "%s" not found'];
const whitelist = ["Phase"];

export class MockConsoleLog {
  constructor(
    private logDisabled = false,
    private phaseText = false,
  ) {}
  private logs: any[] = [];
  private notified: any[] = [];

  /**
   * A list of warnings that are queued to be displayed after all tests are finished.
   *
   * This is static so that it does not get overridden by the test framework constructing new `MockConsoleLog`s.
   */
  private static queuedWarnings: any[] = [];

  public log(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(argsStr);
    if (this.logDisabled && !this.phaseText) {
      return;
    }
    if ((this.phaseText && !whitelist.some((b) => argsStr.includes(b))) || blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    originalLog(args);
  }
  public error(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(argsStr);
    originalError(args); // Appelle le console.error originel
  }
  public debug(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(argsStr);
    if (this.logDisabled && !this.phaseText) {
      return;
    }
    if (!whitelist.some((b) => argsStr.includes(b)) || blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    originalDebug(args);
  }
  public warn(...args) {
    const argsStr = this.getStr(args);
    this.logs.push(args);
    if (this.logDisabled && !this.phaseText) {
      return;
    }
    if (!whitelist.some((b) => argsStr.includes(b)) || blacklist.some((b) => argsStr.includes(b))) {
      return;
    }
    originalWarn(args);
  }

  /**
   * Queues a warning to be printed after all tests are finished.
   */
  public queuePostTestWarning(...args) {
    MockConsoleLog.queuedWarnings.push(args);
  }

  /**
   * Prints all post-test warnings that have been queued. Does not clear the queue.
   */
  public printPostTestWarnings() {
    for (const args of MockConsoleLog.queuedWarnings) {
      this.log(...args);
    }
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
  public getStr(...args) {
    return args
      .map((arg) => {
        if (typeof arg === "object" && arg !== null) {
          // Handle objects including arrays
          return JSON.stringify(arg, (_key, value) => (typeof value === "bigint" ? value.toString() : value));
        } else if (typeof arg === "bigint") {
          // Handle BigInt values
          return arg.toString();
        } else {
          // Handle all other types
          return arg.toString();
        }
      })
      .join(";");
  }
}

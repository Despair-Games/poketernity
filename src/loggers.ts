export class CallSourceLogger {
  private readonly ignoredFnNames: string[];

  /**
   * Constructs a logger that appends a line of the current execution's stack trace to the output.
   *
   * The line that gets outputted is the first line whose function is not listed in
   * {@linkcode ignoredFnNames}. (If no such line exists, the logger has no additional behaviour,
   * and simply behaves as the regular console.)
   *
   * This logger can be useful for determining the source of a certain function call.
   *
   * Note: This extra functionality is currently only supported on Chrome and Firefox. On other
   * browsers, it will most likely just behave as the regular console.
   *
   * @param ignoredFnNames A list of function names to ignore.
   */
  constructor(ignoredFnNames: string[]) {
    this.ignoredFnNames = ["getStackTraceLine", "trace", "debug", "log", "info", "warn", "error", ...ignoredFnNames];
  }

  /**
   * Return the first line in the current execution's stack trace whose function is not
   * listed in {@linkcode ignoredFnNames}.
   *
   * If no such line exists, return an empty string.
   */
  private getStackTraceLine(): string {
    const stack = Error().stack?.split("\n") as string[];

    for (const line of stack) {
      // On Chrome, each line is of the form "at <functionName> (.../<fileName>.ts?t=<timestamp>:<lineNumbers>)"
      const chromeRegex = RegExp("at (.*?(\\w+)) \\(.*\\/(.*\\.ts).*:(\\d*:\\d*)\\)");
      // On Firefox, each line is of the form "<functionName>@.../<fileName>.ts?t=<timestamp>:<lineNumbers>",
      // or "<functionName>/<@.../<fileName>.ts?t=<timestamp>:<lineNumbers>"
      const firefoxRegex = RegExp("(.*?(\\w+))(?:\\/<|)@.*\\/(.*\\.ts).*:(\\d*:\\d*)");
      const match = line.match(chromeRegex) ?? line.match(firefoxRegex);
      if (match) {
        const fullFunctionName = match[1]; // e.g., "BattleScene.reset"
        const rootFunctionName = match[2]; // e.g., "reset"
        const fileName = match[3]; // e.g., "battle-scene.ts"
        // const _lineNumbers = match[4]; // e.g., "1216:10". However, this is bugged due to the browser removing empty lines from TS files.
        if (!this.ignoredFnNames.includes(rootFunctionName)) {
          return `\n-- at ${fullFunctionName} (${fileName})`;
        }
      }
    }

    return "";
  }

  public trace(...args: any[]) {
    console.trace(...args, this.getStackTraceLine());
  }
  public debug(...args: any[]) {
    console.debug(...args, this.getStackTraceLine());
  }
  public log(...args: any[]) {
    console.log(...args, this.getStackTraceLine());
  }
  public info(...args: any[]) {
    console.info(...args, this.getStackTraceLine());
  }
  public warn(...args: any[]) {
    console.warn(...args, this.getStackTraceLine());
  }
  public error(...args: any[]) {
    console.error(...args, this.getStackTraceLine());
  }
}

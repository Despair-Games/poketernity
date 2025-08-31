export function rgbHexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const color = hex.match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i) ?? ["000000", "00", "00", "00"];
  return {
    r: Number.parseInt(color[1], 16),
    g: Number.parseInt(color[2], 16),
    b: Number.parseInt(color[3], 16),
    a: 255,
  };
}

/**
 * Provided valid HSV values, calculates and stitches together a string of that
 * HSV color's corresponding hex code.
 *
 * @see {@link https://stackoverflow.com/a/44134328}.
 * @param h - Hue in degrees, must be in a range of [0, 360]
 * @param s - Saturation percentage, must be in a range of [0, 1]
 * @param l - Ligthness percentage, must be in a range of [0, 1]
 * @returns a string of the corresponding color hex code with a "#" prefix
 */
export function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const rgb = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(rgb * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {number} value The number to limit in range
 * @param {number} min The lower boundary of the output range
 * @param {number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type number
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

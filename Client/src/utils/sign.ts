/**
 *
 * @param num A number
 * @returns The sign of the number, or zero if the number is zero
 */
export default function sign(num: number) {
  if (num < 0) {
    return -1;
  }
  if (num === 0) {
    return 0;
  }
  return 1;
}

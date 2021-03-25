/**
 *
 * @param value The value to clamp
 * @param min Lower bound
 * @param max Upper bound
 * @returns Value clamped between min and max bounds (return bound itself if value is out of bound)
 */
export default function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(value, min));
}

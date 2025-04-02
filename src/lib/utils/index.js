import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class strings with Tailwind's merge.
 *
 * @param {string} inputs - Class names to be merged.
 * @returns {string} - A single string with merged class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

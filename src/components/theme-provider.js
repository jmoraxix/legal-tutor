"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme provider component for handling light/dark modes.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @param {string} props.attribute - HTML attribute to apply the theme.
 * @param {string} props.defaultTheme - Default theme.
 * @param {boolean} props.enableSystem - Whether to enable system theme detection.
 * @returns {React.ReactNode} The rendered component.
 */
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

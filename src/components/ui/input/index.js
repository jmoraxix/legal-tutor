import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input component for forms with various styles.
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.type - Input type (text, email, password, etc.)
 * @returns {React.ReactNode} The rendered input component
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-legal-300 dark:border-legal-700 bg-white dark:bg-legal-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-legal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-legal-600 dark:focus-visible:ring-legal-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

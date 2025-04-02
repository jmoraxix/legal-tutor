import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card component for displaying content in a contained card.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Child elements
 * @returns {React.ReactNode} The rendered card component
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * Card header component.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Child elements
 * @returns {React.ReactNode} The rendered card header component
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Card title component.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Child elements
 * @returns {React.ReactNode} The rendered card title component
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Card description component.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Child elements
 * @returns {React.ReactNode} The rendered card description component
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Card content component.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Child elements
 * @returns {React.ReactNode} The rendered card content component
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Card footer component.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Child elements
 * @returns {React.ReactNode} The rendered card footer component
 */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

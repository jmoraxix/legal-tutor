"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

/**
 * Componente Label para formularios
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.className - Clases CSS adicionales
 * @param {React.ReactNode} props.children - Contenido del label
 * @returns {React.ReactNode} Componente Label
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };

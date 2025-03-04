"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full",
        "bg-zinc-800/50"
      )}
    >
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary/80 to-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block size-4 rounded-full border border-primary/50",
        "bg-background shadow-sm transition-colors focus-visible:outline-none",
        "focus-visible:ring-1 focus-visible:ring-primary",
        "dark:border-primary/50 dark:bg-zinc-950",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-accent hover:border-primary"
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

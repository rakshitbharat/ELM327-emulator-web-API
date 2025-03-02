import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full h-2 bg-gray-200 rounded-full",
      className
    )}
    {...props}
  >
    <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full" style={{ width: `${props.value}%` }} />
  </div>
))
Slider.displayName = "Slider"

export { Slider }

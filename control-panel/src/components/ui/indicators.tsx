"use client"

import { cn } from "@/lib/utils"

export function LED({ active, color = "green", size = "md", pulse = false }) {
  return (
    <div
      className={cn(
        "rounded-full shadow-lg",
        size === "sm" && "h-2 w-2",
        size === "md" && "h-3 w-3",
        size === "lg" && "h-4 w-4",
        active ? "shadow-glow" : "opacity-30",
        color === "green" && "bg-green-500",
        color === "red" && "bg-red-500",
        color === "yellow" && "bg-yellow-500",
        pulse && active && "animate-pulse"
      )}
    />
  )
}

interface VoltMeterProps {
  value: number;
  max?: number;
  min?: number;
  showTicks?: boolean;
}

export function VoltMeter({ value, max = 100, min = 0, showTicks = true }: VoltMeterProps) {
  // Normalize value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  const getColor = (percent: number) => {
    if (percent > 80) return "from-red-500 to-red-300"
    if (percent > 60) return "from-yellow-500 to-yellow-300"
    return "from-blue-500 to-blue-300"
  }

  return (
    <div className="relative h-3 w-full rounded-full bg-black/40 border border-zinc-800/50 backdrop-blur overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${getColor(normalizedValue)}`}
        style={{ width: `${normalizedValue}%` }}
      />
      {showTicks && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="flex justify-between px-1">
            {[0, 25, 50, 75, 100].map((tick) => (
              <div key={tick} className="w-px h-full bg-zinc-700/30" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

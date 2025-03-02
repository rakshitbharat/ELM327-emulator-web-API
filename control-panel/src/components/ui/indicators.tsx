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

export function VoltMeter({ value, max = 100 }) {
  const percentage = (value / max) * 100
  return (
    <div className="h-2 w-full rounded-full bg-black/20">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

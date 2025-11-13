import Image from "next/image"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  centered?: boolean
}

export function Spinner({ className, size = "lg", centered = true }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  }

  const spinner = (
    <div className={cn("relative", sizeClasses[size])} role="status" aria-label="Loading">
      <div
        className={cn(
          "absolute inset-0 rounded-full border-4 border-blue-300",
          "animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"
        )}
      />
      <div
        className={cn(
          "absolute inset-[12%] rounded-full border-4 border-blue-400",
          "animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_0.3s]"
        )}
      />
      <div
        className={cn(
          "absolute inset-[24%] rounded-full border-4 border-blue-500",
          "animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_0.6s]"
        )}
      />
      <div
        className={cn(
          "absolute inset-[36%] rounded-full border-4 border-blue-600",
          "animate-pulse"
        )}
      />
    </div>
  )

  if (centered) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-200">
        {spinner}
      </div>
    )
  }

  return spinner
}

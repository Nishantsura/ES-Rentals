import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

const VisuallyHidden = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "absolute h-px w-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      {...props}
    />
  )
}

export { VisuallyHidden }

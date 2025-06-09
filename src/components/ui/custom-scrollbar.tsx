
import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CustomScrollbar = React.memo(React.forwardRef<HTMLDivElement, CustomScrollbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-corner-transparent will-change-scroll",
          className
        )}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(203 213 225) transparent',
          WebkitOverflowScrolling: 'touch' // Better mobile scrolling
        }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            div::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background: rgb(203 213 225);
              border-radius: 4px;
              transition: background 0.2s ease;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: rgb(148 163 184);
            }
            div::-webkit-scrollbar-corner {
              background: transparent;
            }
          `
        }} />
        {children}
      </div>
    )
  }
));

CustomScrollbar.displayName = "CustomScrollbar"

export { CustomScrollbar }

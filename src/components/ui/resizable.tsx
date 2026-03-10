import * as React from "react"
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "../../lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Group>) => (
  <ResizablePrimitive.Group
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.Separator
    data-slot="resizable-handle"
    className={cn(
      "relative flex w-1.5 items-center justify-center bg-border transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none hover:bg-primary/50",
      "data-[panel-group-direction=vertical]:h-1.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
      "data-[panel-group-direction=horizontal]:w-1.5 data-[panel-group-direction=horizontal]:h-full data-[panel-group-direction=horizontal]:cursor-col-resize",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-6 w-4 items-center justify-center rounded-md border bg-background shadow-sm hover:border-primary/50 transition-all">
        <GripVertical className="h-2.5 w-2.5 text-muted-foreground/60" />
      </div>
    )}
  </ResizablePrimitive.Separator>
)

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }

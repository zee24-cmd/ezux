import React from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';
import { Box } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { GroupNodeData } from '../EzFlow.types';

export const GroupNode = React.memo(({ data, selected }: NodeProps) => {
  const { label, description } = data as GroupNodeData;
  const [lockRatio, setLockRatio] = React.useState(false);

  return (
    <div
      className={cn(
        'w-full h-full rounded-2xl transition-all duration-200 relative group',
        'border-2 border-dashed border-muted-foreground/20 bg-muted/5 backdrop-blur-sm',
        'p-4',
        selected && 'ring-2 ring-primary/30 border-primary/40 bg-muted/10'
      )}
      onPointerDownCapture={(e) => {
        const handle = (e.target as HTMLElement).closest('.react-flow__resize-control');
        if (handle) {
          const pos = handle.getAttribute('data-handlepos');
          const isCorner = pos?.includes('-');
          setLockRatio(!!isCorner);
        }
      }}
      role="group"
      aria-label={`Group node: ${label || 'Group'}`}
    >
      <NodeResizer
        color="oklch(var(--primary))"
        isVisible={selected}
        minWidth={200}
        minHeight={150}
        keepAspectRatio={lockRatio}
        handleClassName={cn(
          "!w-3 !h-3 !bg-white !border-2 transition-all hover:!scale-125 !z-[70] shadow-sm",
          "data-[handlepos^='top-']:!rounded-sm data-[handlepos^='bottom-']:!rounded-sm !border-indigo-600", // Corners: Square
          "data-[handlepos='top']:!rounded-full data-[handlepos='bottom']:!rounded-full data-[handlepos='left']:!rounded-full data-[handlepos='right']:!rounded-full !border-slate-400" // Sides: Circle
        )}
        lineClassName="!border-indigo-500/30"
      />

      {/* Group header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-muted-foreground/10">
        <Box size={14} className="text-muted-foreground/60" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          {label || 'Sub-process'}
        </span>
      </div>
      {description && (
        <p className="text-[10px] text-muted-foreground/40 mb-4">
          {description}
        </p>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-muted-foreground/40 !border-2 !border-background"
        aria-label="Input connection"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-muted-foreground/40 !border-2 !border-background"
        aria-label="Output connection"
      />
    </div>
  );
});

GroupNode.displayName = 'GroupNode';

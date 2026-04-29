import React from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';
import { Repeat } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import type { LoopNodeData } from '../EzFlow.types';

export const LoopNode = React.memo(({ data, selected }: NodeProps) => {
  const { label, description, maxIterations } = data as LoopNodeData;

  const [lockRatio, setLockRatio] = React.useState(false);

  return (
    <div 
      className="w-full h-full relative group"
      onPointerDownCapture={(e) => {
        const handle = (e.target as HTMLElement).closest('.react-flow__resize-control');
        if (handle) {
          const pos = handle.getAttribute('data-handlepos');
          const isCorner = pos?.includes('-');
          setLockRatio(!!isCorner);
        }
      }}
    >
      <NodeResizer
        color="oklch(var(--primary))"
        isVisible={selected}
        minWidth={160}
        minHeight={80}
        keepAspectRatio={lockRatio}
        handleClassName={cn(
          "!w-3 !h-3 !bg-white !border-2 transition-all hover:!scale-125 !z-[70] shadow-sm",
          "data-[handlepos^='top-']:!rounded-sm data-[handlepos^='bottom-']:!rounded-sm !border-indigo-600", // Corners: Square
          "data-[handlepos='top']:!rounded-full data-[handlepos='bottom']:!rounded-full data-[handlepos='left']:!rounded-full data-[handlepos='right']:!rounded-full !border-slate-400" // Sides: Circle
        )}
        lineClassName="!border-indigo-500/30"
      />

      <Card
        className={cn(
          'w-full h-full rounded-2xl transition-all duration-200 overflow-hidden',
          'border-2 border-orange-500/30 bg-orange-500/5 backdrop-blur-xl',
          selected && 'ring-2 ring-orange-500/40 border-orange-500 shadow-lg'
        )}
        role="group"
        aria-label={`Loop node: ${label || 'Loop'}`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3.5 !h-3.5 !bg-orange-500 !border-[3px] !border-background !z-50"
          aria-label="Input connection"
        />

        <CardHeader className="p-4 space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/15">
              <Repeat size={16} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase font-bold tracking-widest text-orange-500/70">
                Loop
              </div>
              <CardTitle className="text-sm font-semibold truncate">{label}</CardTitle>
            </div>
          </div>
          {description && (
            <CardDescription className="text-xs line-clamp-2">
              {description}
            </CardDescription>
          )}
          {maxIterations && (
            <div className="text-[10px] text-orange-400/80 font-medium">
              Max: {maxIterations} iterations
            </div>
          )}
        </CardHeader>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-orange-500 !border-[3px] !border-background !z-50"
          aria-label="Output connection"
        />
        {/* Loop-back handle */}
        <Handle
          type="source"
          position={Position.Left}
          id="loop-back"
          className="!w-3 !h-3 !bg-orange-400/70 !border-2 !border-background !z-50"
          aria-label="Loop back connection"
        />
      </Card>
    </div>
  );
});

LoopNode.displayName = 'LoopNode';

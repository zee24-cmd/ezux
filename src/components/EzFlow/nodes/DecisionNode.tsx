import React from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';
import { cn } from '../../../lib/utils';
import type { DecisionNodeData } from '../EzFlow.types';

export const DecisionNode = React.memo(({ data, selected }: NodeProps) => {
  const { label } = data as DecisionNodeData;
  const [lockRatio, setLockRatio] = React.useState(false);

  return (
    <div
      className="relative w-full h-full group"
      onPointerDownCapture={(e) => {
        const handle = (e.target as HTMLElement).closest('.react-flow__resize-control');
        if (handle) {
          const pos = handle.getAttribute('data-handlepos');
          const isCorner = pos?.includes('-');
          setLockRatio(!!isCorner);
        }
      }}
      role="group"
      aria-label={`Decision node: ${label || 'Decision'}`}
    >
      <NodeResizer
        color="oklch(var(--primary))"
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        keepAspectRatio={lockRatio}
        handleClassName={cn(
          "!w-3 !h-3 !bg-white !border-2 transition-all hover:!scale-125 !z-[70] shadow-sm",
          "data-[handlepos^='top-']:!rounded-sm data-[handlepos^='bottom-']:!rounded-sm !border-indigo-600", // Corners: Square
          "data-[handlepos='top']:!rounded-full data-[handlepos='bottom']:!rounded-full data-[handlepos='left']:!rounded-full data-[handlepos='right']:!rounded-full !border-slate-400" // Sides: Circle
        )}
        lineClassName="!border-indigo-500/30"
      />

      {/* Target: Top point */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-4 !h-4 !bg-amber-500 !border-2 !border-background !z-50"
        style={{ top: -8 }}
        aria-label="Input connection"
      />

      {/* YES: Right point */}
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        className="!w-4 !h-4 !bg-emerald-500 !border-2 !border-background !z-50"
        style={{ right: -8, top: '50%' }}
        aria-label="Yes path"
      />

      {/* NO: Bottom point */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="!w-4 !h-4 !bg-rose-500 !border-2 !border-background !z-50"
        style={{ bottom: -8 }}
        aria-label="No path"
      />

      {/* Diamond shape using clip-path for a sharp-pointed square */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-200',
          'border-2 border-amber-500/40 bg-amber-500/10 backdrop-blur-xl',
          selected && 'border-amber-500 bg-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
        )}
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />

      {/* Content (centered, non-rotated) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6">
        <span className="text-[8px] uppercase font-black tracking-widest text-amber-500/80 mb-0.5">
          Decision
        </span>
        <span className="text-[11px] font-bold leading-tight text-foreground text-center max-w-[70px] truncate">
          {label}
        </span>
      </div>

      {/* Labels */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-400 pointer-events-none tracking-widest select-none z-20">
        YES
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-rose-400 pointer-events-none tracking-widest select-none z-20">
        NO
      </div>
    </div>
  );
});

DecisionNode.displayName = 'DecisionNode';

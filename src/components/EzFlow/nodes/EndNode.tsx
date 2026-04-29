import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Square } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { EndNodeData } from '../EzFlow.types';

export const EndNode = React.memo(({ data, selected }: NodeProps) => {
  const { label, description } = data as EndNodeData;

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 px-6 py-3 rounded-full',
        'border-2 transition-all duration-200',
        'bg-rose-500/10 border-rose-500/30 text-rose-400',
        'shadow-xl',
        selected && 'ring-4 ring-rose-500/20 scale-105 border-rose-500/60'
      )}
      role="group"
      aria-label={`End node: ${label || 'End'}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-4 !h-4 !bg-rose-500 !border-[3px] !border-background"
        aria-label="Input connection"
      />
      <Square size={10} className="fill-rose-500 text-rose-500" />
      <div className="flex flex-col">
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
          {label || 'END'}
        </span>
        {description && (
          <span className="text-[8px] opacity-40 uppercase tracking-tight">
            {description}
          </span>
        )}
      </div>
    </div>
  );
});

EndNode.displayName = 'EndNode';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { StartNodeData } from '../EzFlow.types';

export const StartNode = React.memo(({ data, selected }: NodeProps) => {
  const { label, description } = data as StartNodeData;

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center gap-1 px-6 py-3 rounded-full',
        'border-2 transition-all duration-200',
        'bg-emerald-500/10 border-emerald-500/40 text-emerald-500',
        'shadow-[0_0_20px_rgba(16,185,129,0.08)]',
        selected && 'ring-4 ring-emerald-500/20 scale-105 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
      )}
      role="group"
      aria-label={`Start node: ${label || 'Start'}`}
    >
      <div className="flex items-center gap-2">
        <Play size={14} className="fill-emerald-500" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
          {label || 'START'}
        </span>
      </div>
      {description && (
        <span className="text-[8px] opacity-50 uppercase tracking-tight">
          {description}
        </span>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-4 !h-4 !bg-emerald-500 !border-[3px] !border-background !-bottom-2 shadow-lg shadow-emerald-500/30"
        aria-label="Output connection"
      />
    </div>
  );
});

StartNode.displayName = 'StartNode';

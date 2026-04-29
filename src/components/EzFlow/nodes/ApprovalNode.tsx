import React from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';
import { User, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import type { ApprovalNodeData } from '../EzFlow.types';

export const ApprovalNode = React.memo(({ data, selected }: NodeProps) => {
  const { label, description, approverRole, slaHours } = data as ApprovalNodeData;
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
        minWidth={200}
        minHeight={100}
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
          'border-2 border-purple-500/30 bg-purple-500/5 backdrop-blur-xl',
          selected && 'ring-2 ring-purple-500/40 border-purple-500 shadow-lg'
        )}
        role="group"
        aria-label={`Approval node: ${label || 'Approval'}`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3.5 !h-3.5 !bg-purple-500 !border-[3px] !border-background !z-50"
          aria-label="Input connection"
        />

        <CardHeader className="p-4 space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/15">
              <User size={16} className="text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase font-bold tracking-widest text-purple-500/70">
                Approval
              </div>
              <CardTitle className="text-sm font-semibold truncate">{label}</CardTitle>
            </div>
          </div>
          {description && (
            <CardDescription className="text-xs line-clamp-2">
              {description}
            </CardDescription>
          )}
          <div className="flex flex-col gap-1 mt-1">
            {approverRole && (
              <div className="flex items-center gap-1.5 text-[10px] text-purple-400/80 font-medium">
                <User size={10} /> {approverRole}
              </div>
            )}
            {slaHours && (
              <div className="flex items-center gap-1.5 text-[10px] text-purple-400/60 font-medium">
                <Clock size={10} /> {slaHours}h SLA
              </div>
            )}
          </div>
        </CardHeader>

        {/* Approved path */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="approved"
          className="!w-3.5 !h-3.5 !bg-emerald-500 !border-[3px] !border-background !z-50"
          aria-label="Approved path"
        />
        {/* Rejected path */}
        <Handle
          type="source"
          position={Position.Right}
          id="rejected"
          className="!w-3 !h-3 !bg-rose-500 !border-2 !border-background !z-50"
          aria-label="Rejected path"
        />
      </Card>
    </div>
  );
});

ApprovalNode.displayName = 'ApprovalNode';

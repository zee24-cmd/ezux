import React from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';
import { Cloud } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import type { RequestNodeData } from '../EzFlow.types';

export const RequestNode = React.memo(({ data, selected }: NodeProps) => {
  const { label, description, method, url } = data as RequestNodeData;

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
          'border-2 border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xl',
          selected && 'ring-2 ring-indigo-500/40 border-indigo-500 shadow-lg'
        )}
        role="group"
        aria-label={`Request node: ${label || 'HTTP Request'}`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3.5 !h-3.5 !bg-indigo-500 !border-[3px] !border-background !z-50"
          aria-label="Input connection"
        />

        <CardHeader className="p-4 space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/15">
              <Cloud size={16} className="text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase font-bold tracking-widest text-indigo-500/70">
                HTTP Request
              </div>
              <CardTitle className="text-sm font-semibold truncate">{label}</CardTitle>
            </div>
          </div>
          {description && (
            <CardDescription className="text-xs line-clamp-2">
              {description}
            </CardDescription>
          )}
          {(method || url) && (
            <div className="flex items-center gap-2 mt-1">
              {method && (
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                  {method}
                </span>
              )}
              {url && (
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {url}
                </span>
              )}
            </div>
          )}
        </CardHeader>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-indigo-500 !border-[3px] !border-background !z-50"
          aria-label="Output connection"
        />
      </Card>
    </div>
  );
});

RequestNode.displayName = 'RequestNode';

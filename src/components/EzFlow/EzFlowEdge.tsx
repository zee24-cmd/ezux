import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from '@xyflow/react';
import type { EzFlowEdgeProps } from './EzFlow.types';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

export const EzFlowEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  label,
  data,
  id,
  onDelete,
}: EzFlowEdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected
            ? 'oklch(var(--primary))'
            : 'oklch(var(--foreground))',
          transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
        }}
      />

      {/* Edge label */}
      {(label || (data as Record<string, unknown>)?.label) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-widest text-primary shadow-lg">
              {(label as string) || ((data as Record<string, unknown>)?.label as string)}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Delete button when selected */}
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + 22}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <Button
              variant="destructive"
              size="icon"
              className="w-5 h-5 rounded-full shadow-md"
              aria-label="Delete edge"
              onClick={() => onDelete?.(id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

EzFlowEdge.displayName = 'EzFlowEdge';

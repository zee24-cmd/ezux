import type { ConnectionLineComponentProps } from '@xyflow/react';
import { getSmoothStepPath } from '@xyflow/react';

export const EzConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  fromHandle,
}: ConnectionLineComponentProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
    borderRadius: 16,
  });

  const isYes = fromHandle?.id === 'yes' || fromHandle?.id === 'approved';
  const isNo = fromHandle?.id === 'no' || fromHandle?.id === 'rejected';
  const isLoopBack = fromHandle?.id === 'loop-back';

  const color = isYes
    ? 'oklch(0.627 0.154 160.06)'
    : isNo
      ? 'oklch(0.577 0.245 27.325)'
      : isLoopBack
        ? 'oklch(0.7 0.15 45)'
        : 'oklch(var(--primary))';

  const label = isYes ? 'YES?' : isNo ? 'NO?' : isLoopBack ? 'LOOP' : 'CONNECT';

  return (
    <g>
      <path
        fill="none"
        stroke={color}
        strokeWidth={2}
        d={edgePath}
        style={{ strokeDasharray: '6,4' }}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="oklch(var(--background))"
        r={4}
        stroke={color}
        strokeWidth={1.5}
      />
      <foreignObject
        x={toX + 10}
        y={toY - 12}
        width={80}
        height={30}
        className="pointer-events-none"
      >
        <div className="flex items-center">
          <div
            className="px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-md border border-border text-[8px] font-black uppercase tracking-tighter shadow-xl whitespace-nowrap"
            style={{ color }}
          >
            {label}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

EzConnectionLine.displayName = 'EzConnectionLine';

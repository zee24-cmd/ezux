import type { BackgroundProps, BackgroundVariant } from '@xyflow/react';
import { Background } from '@xyflow/react';

export const EzFlowBackground = (props: BackgroundProps) => {
  return (
    <Background
      {...props}
      color="oklch(var(--border))"
      variant={'dots' as BackgroundVariant}
      gap={24}
      size={1}
      className="opacity-40"
    />
  );
};

EzFlowBackground.displayName = 'EzFlowBackground';

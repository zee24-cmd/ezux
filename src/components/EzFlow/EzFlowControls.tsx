import { Controls, type ControlProps } from '@xyflow/react';

export const EzFlowControls = (props: ControlProps) => {
  return (
    <Controls
      {...props}
      className="!bg-card/80 !backdrop-blur-md !border !border-border !shadow-2xl !rounded-2xl !p-1 !flex !flex-row !gap-1 !m-4 !overflow-hidden"
      showInteractive={false}
      aria-label="Canvas zoom and fit controls"
    />
  );
};

EzFlowControls.displayName = 'EzFlowControls';

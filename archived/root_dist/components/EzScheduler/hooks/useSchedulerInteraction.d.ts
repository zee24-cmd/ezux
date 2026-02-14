import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SchedulerEvent } from '../EzScheduler.types';
interface UseSchedulerInteractionProps {
    events: SchedulerEvent[];
    onEventChange?: (event: SchedulerEvent) => void;
    slotDuration?: number;
    slotHeight?: number;
}
export declare const useSchedulerInteraction: ({ events, onEventChange, slotDuration, slotHeight }: UseSchedulerInteractionProps) => {
    sensors: import('@dnd-kit/core').SensorDescriptor<import('@dnd-kit/core').SensorOptions>[];
    activeEvent: SchedulerEvent | null;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
};
export {};

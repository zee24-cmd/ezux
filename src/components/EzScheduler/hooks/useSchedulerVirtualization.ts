import { useVirtualization } from '../../../shared/hooks/useVirtualization';
import { EzSchedulerProps } from '../EzScheduler.types';

/**
 * Manages virtualization for the scheduler time axis
 */
export const useSchedulerVirtualization = (props: EzSchedulerProps) => {
    const { overscanCount = 2, startHour = '00:00', endHour = '24:00' } = props;

    // Parse hours to numbers for calculation
    const start = parseInt(startHour.split(':')[0], 10);
    const end = parseInt(endHour.split(':')[0], 10);
    const slotDuration = props.slotDuration || 30;
    const slotsPerHour = 60 / slotDuration;
    const rowCount = Math.max(1, (end - start) * slotsPerHour);

    // Virtualization via shared abstraction
    const { rowVirtualizer, columnVirtualizer, parentRef: virtualizationParentRef } = useVirtualization({
        // Row Config
        rowCount,
        rowHeight: 64, // Standard slot height
        overscanCount,
        progressiveRendering: props.progressiveRendering,
        prefetchDistance: props.prefetchDistance,

        // Column Config (for Timeline views)
        enableColumnVirtualization: props.view?.startsWith('timeline'),
        columnCount: props.view?.startsWith('timeline') ? rowCount : 0,
        columnWidth: 100, // Standard column width

        id: props.id,
        debug: props.debugVirtualization,
        onScrollStart: () => {
            if (props.virtualScrollStart) props.virtualScrollStart({ virtualizer: {} });
        },
        onScrollStop: () => {
            if (props.virtualScrollStop) props.virtualScrollStop({ virtualizer: {} });
        }
    });

    return {
        parentRef: virtualizationParentRef,
        rowVirtualizer,
        columnVirtualizer
    };
};

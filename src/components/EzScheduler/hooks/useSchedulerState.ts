import { useCallback, useEffect } from 'react';
import { EzSchedulerProps, ViewType, View } from '../EzScheduler.types';
import { useComponentState } from '../../../shared/hooks/useComponentState';

/**
 * Manages the core navigation and view state for EzScheduler
 */
export const useSchedulerState = (props: EzSchedulerProps) => {
    const {
        defaultView = 'week',
        defaultSelectedDate = new Date(),
        onViewChange,
        onDateChange,
        view: propsView,
        selectedDate: propsDate
    } = props;

    const normalizeView = (v: string | undefined): ViewType => {
        if (!v) return (defaultView as ViewType) || 'week';
        const lower = v.toLowerCase();
        if (lower === 'timelineday') return 'timeline-day';
        if (lower === 'timelineweek') return 'timeline-week';
        if (lower === 'timelineworkweek') return 'timeline-week';
        if (lower === 'timelinemonth') return 'timeline-month';
        return lower as ViewType;
    };

    // --- Unified State ---
    const { state, setState } = useComponentState({
        initialState: {
            view: normalizeView(propsView || defaultView),
            currentDate: propsDate || defaultSelectedDate || new Date(),
            slotDuration: props.slotDuration || 30,
            is24Hour: false
        }
    });

    // --- Sync Props to State ---
    useEffect(() => {
        setState(prev => {
            let next = { ...prev };
            let changed = false;

            if (propsView) {
                const normalized = normalizeView(propsView);
                if (normalized !== prev.view) {
                    next.view = normalized;
                    changed = true;
                }
            }

            if (propsDate && propsDate.getTime() !== prev.currentDate.getTime()) {
                next.currentDate = propsDate;
                changed = true;
            }

            if (props.slotDuration && props.slotDuration !== prev.slotDuration) {
                next.slotDuration = props.slotDuration;
                changed = true;
            }

            return changed ? next : prev;
        });
    }, [propsView, propsDate, props.slotDuration, setState]); // normalizeView is stable-ish if we move it or ignore deps

    // --- State Updaters ---
    const setView = useCallback((newView: ViewType) => {
        setState(prev => ({ ...prev, view: newView }));

        // Map ViewType to View
        const mapping: Record<ViewType, View> = {
            'day': 'Day',
            'week': 'Week',
            'workweek': 'WorkWeek',
            'month': 'Month',
            'agenda': 'Agenda',
            'timeline-day': 'TimelineDay',
            'timeline-week': 'TimelineWeek',
            'timeline-month': 'TimelineMonth'
        };

        onViewChange?.(mapping[newView] || (newView as any));
    }, [onViewChange, setState]);

    const setCurrentDate = useCallback((newDate: Date) => {
        setState(prev => ({ ...prev, currentDate: newDate }));
        onDateChange?.(newDate);
    }, [onDateChange, setState]);

    const setSlotDuration = useCallback((duration: number) => {
        setState(prev => ({ ...prev, slotDuration: duration }));
        props.onSlotDurationChange?.(duration);
    }, [props.onSlotDurationChange, setState]);

    const setIs24Hour = useCallback((is24: boolean) => {
        setState(prev => ({ ...prev, is24Hour: is24 }));
    }, [setState]);

    return {
        view: state.view,
        setView,
        currentDate: state.currentDate,
        setCurrentDate,
        slotDuration: state.slotDuration,
        setSlotDuration,
        is24Hour: state.is24Hour,
        setIs24Hour
    };
};


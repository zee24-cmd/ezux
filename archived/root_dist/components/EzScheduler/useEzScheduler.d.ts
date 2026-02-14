import { EzSchedulerProps, ViewType } from './EzScheduler.types';
export declare const useEzScheduler: (props: EzSchedulerProps) => {
    view: ViewType;
    setView: (newView: ViewType) => void;
    currentDate: Date;
    setCurrentDate: (newDate: Date) => void;
    daysInView: import('date-fns').EachDayOfIntervalResult<{
        start: Date;
        end: Date;
    }, undefined>;
    visibleEvents: import('./EzScheduler.types').SchedulerEvent[];
    next: () => void;
    prev: () => void;
    today: () => void;
    dir: "ltr" | "rtl" | "auto";
    layoutState: {
        sidebarOpen: boolean;
        mode: "dashboard" | "auth" | "minimal";
        headerHeight: number;
        sidebarWidth: number;
        viewportHeight: number;
        isMobile: boolean;
        authPage: "signin" | "signup";
    };
    parentRef: import('react').RefObject<HTMLDivElement | null>;
    rowVirtualizer: import('@tanstack/virtual-core').Virtualizer<HTMLDivElement, Element>;
};

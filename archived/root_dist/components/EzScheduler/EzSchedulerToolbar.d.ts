import { ViewType } from './EzScheduler.types';
interface EzSchedulerToolbarProps {
    currentDate: Date;
    view: ViewType;
    setView: (view: ViewType) => void;
    next: () => void;
    prev: () => void;
    today: () => void;
    onAddClick: () => void;
}
export declare const EzSchedulerToolbar: import('react').MemoExoticComponent<({ currentDate, view, setView, next, prev, today, onAddClick }: EzSchedulerToolbarProps) => import("react/jsx-runtime").JSX.Element>;
export {};

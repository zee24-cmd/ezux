import { default as React } from 'react';
import { SchedulerEvent, Resource } from '../EzScheduler.types';
interface EzEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit' | 'view';
    event?: Partial<SchedulerEvent>;
    onSave: (event: Partial<SchedulerEvent>) => void;
    onDelete?: (eventId: string) => void;
    resources?: Resource[];
    locale?: string;
}
export declare const EzEventModal: React.FC<EzEventModalProps>;
export {};

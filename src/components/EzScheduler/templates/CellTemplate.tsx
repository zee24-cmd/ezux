import React from 'react';
import { SchedulerEvent } from '../EzScheduler.types';
import { format } from 'date-fns';

/**
 * Props for the CellTemplate component.
 */
export interface CellTemplateProps {
    /** 
     * The date representing this cell.
     * @group Properties 
     */
    date: Date;
    /** 
     * The type of view context.
     * @group Properties 
     */
    type: 'month' | 'week' | 'day';
    /** 
     * Events occurring on this date.
     * @group Properties 
     */
    events?: SchedulerEvent[];
    /** 
     * Custom content for the cell.
     * @group Properties 
     */
    children?: React.ReactNode;
    /** 
     * Custom CSS class name.
     * @group Properties 
     */
    className?: string;
    /** 
     * Callback when the cell is clicked.
     * @group Events 
     */
    onClick?: (date: Date) => void;
}

/**
 * Default template for rendering a scheduler cell.
 * @group Models
 */
export const CellTemplate: React.FC<CellTemplateProps> = ({
    date,
    type,
    children,
    className,
    onClick
}) => {
    // Default rendering with slot for customization
    return (
        <div
            className={`ez-scheduler-cell ${className || ''}`}
            onClick={() => onClick?.(date)}
            data-date={date.toISOString()}
        >
            {children || (
                <div className="ez-cell-content">
                    {/* Basic date number for month view */}
                    {type === 'month' && (
                        <span className="ez-cell-date">{format(date, 'd')}</span>
                    )}
                </div>
            )}
        </div>
    );
};

import React from 'react';
import { format } from 'date-fns';

/**
 * Props for the HeaderTemplate component.
 */
export interface HeaderTemplateProps {
    /** 
     * The date representing this header.
     * @group Properties 
     */
    date: Date;
    /** 
     * The type of header.
     * @group Properties 
     */
    type: 'day' | 'week' | 'month' | 'resource';
    /** 
     * Date format string for display.
     * @group Properties 
     */
    formatString?: string;
    /** 
     * Custom text for the header.
     * @group Properties 
     */
    text?: string;
    /** 
     * Custom CSS class name.
     * @group Properties 
     */
    className?: string;
}

/**
 * Default template for rendering a scheduler header.
 * @group Models
 */
export const HeaderTemplate: React.FC<HeaderTemplateProps> = ({
    date,

    formatString = 'EEE',
    text,
    className
}) => {
    return (
        <div className={`ez-scheduler-header-cell ${className || ''}`}>
            {text || format(date, formatString)}
        </div>
    );
};

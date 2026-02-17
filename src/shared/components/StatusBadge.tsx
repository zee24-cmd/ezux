import { memo } from 'react';
import { cn } from '../../lib/utils';

export type Status = 'Active' | 'Inactive' | 'Pending' | 'Verified' | 'Unverified' | 'On Leave' | 'Completed' | 'In Progress' | 'Archived';

const STATUS_TYPE_MAP: Record<string, string> = {
    Active: 'success',
    Verified: 'success',
    Completed: 'info',
    'In Progress': 'info',
    Pending: 'warning',
    Inactive: 'error',
    Unverified: 'error',
    'On Leave': 'error',
    Archived: 'neutral',
    Default: 'neutral'
};

export interface StatusBadgeProps {
    status: Status | string;
    className?: string;
    showDot?: boolean;
    variant?: 'solid' | 'outline';
}

/**
 * StatusBadge Component
 * Displays a status with a consistent design system.
 * Features:
 * - Semantic color mapping
 * - Theme-aware styling (Light/Dark)
 * - Dot indicator for better visual recognition
 * - High-contrast styling for maximum visibility (WCAG AA)
 */
export const StatusBadge = memo<StatusBadgeProps>(({
    status,
    className,
    showDot = true,
    variant = 'solid'
}) => {
    const type = STATUS_TYPE_MAP[status] || STATUS_TYPE_MAP.Default;
    const isOutline = variant === 'outline' || status === 'Archived';

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide transition-all duration-300 shadow-sm whitespace-nowrap',
                className
            )}
            style={{
                backgroundColor: isOutline ? 'transparent' : `var(--ez-status-${type}-bg)`,
                color: isOutline ? `var(--ez-status-${type}-bg)` : `var(--ez-status-${type}-text)`,
                borderColor: `var(--ez-status-${type}-border)`,
                minWidth: '120px'
            }}
        >
            {showDot && (
                <span
                    className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] flex-shrink-0"
                    style={{ backgroundColor: `var(--ez-status-${type}-dot)` }}
                />
            )}
            {status}
        </div>
    );
});

StatusBadge.displayName = 'StatusBadge';

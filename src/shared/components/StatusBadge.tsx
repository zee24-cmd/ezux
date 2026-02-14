import { memo } from 'react';
import { cn } from '../../lib/utils';

export type Status = 'Active' | 'Inactive' | 'Pending' | 'Verified' | 'Unverified' | 'On Leave' | 'Completed' | 'In Progress';

const STATUS_CONFIG: Record<string, { container: string; dot: string }> = {
    Active: {
        container: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500 dark:text-emerald-50 dark:border-emerald-400',
        dot: 'bg-emerald-600 dark:bg-emerald-200'
    },
    Verified: {
        container: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500 dark:text-emerald-50 dark:border-emerald-400',
        dot: 'bg-emerald-600 dark:bg-emerald-200'
    },
    Completed: {
        container: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500 dark:text-emerald-50 dark:border-emerald-400',
        dot: 'bg-emerald-600 dark:bg-emerald-200'
    },
    Inactive: {
        container: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-500 dark:text-rose-50 dark:border-rose-400',
        dot: 'bg-rose-600 dark:bg-rose-200'
    },
    Unverified: {
        container: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-500 dark:text-rose-50 dark:border-rose-400',
        dot: 'bg-rose-600 dark:bg-rose-200'
    },
    'On Leave': {
        container: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-500 dark:text-rose-50 dark:border-rose-400',
        dot: 'bg-rose-600 dark:bg-rose-200'
    },
    Pending: {
        container: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500 dark:text-amber-50 dark:border-amber-400',
        dot: 'bg-amber-600 dark:bg-amber-200'
    },
    'In Progress': {
        container: 'bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-500 dark:text-blue-50 dark:border-blue-400',
        dot: 'bg-blue-600 dark:bg-blue-200'
    },
    Default: {
        container: 'bg-slate-100 text-slate-950 border-slate-300 dark:bg-slate-500 dark:text-slate-50 dark:border-slate-400',
        dot: 'bg-slate-600 dark:bg-slate-200'
    }
} as const;

interface StatusBadgeProps {
    status: Status | string;
    className?: string;
}

/**
 * Optimized StatusBadge component
 * - Dot indicator for better visual recognition
 * - High-contrast styling for maximum visibility
 */
export const StatusBadge = memo<StatusBadgeProps>(({ status, className }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Default;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-black border tracking-wide transition-all duration-300 shadow-sm',
                config.container,
                className
            )}
        >
            <span className={cn('w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]', config.dot)} />
            {status}
        </div>
    );
});

StatusBadge.displayName = 'StatusBadge';

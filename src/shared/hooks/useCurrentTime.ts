import { useState, useEffect } from 'react';

/**
 * Shared hook for centralized timekeeping.
 * Updates every minute and provides a stable Date object.
 * Useful for "Current Time" indicators in calendars/schedulers.
 */
export function useCurrentTime(refreshInterval = 60000): Date {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, refreshInterval);

        return () => clearInterval(timer);
    }, [refreshInterval]);

    return now;
}

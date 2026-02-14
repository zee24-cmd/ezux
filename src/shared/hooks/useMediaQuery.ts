import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor media query status.
 * @param query CSS media query string (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);

        // Use modern listener if available, fallback for older browsers
        if (media.addEventListener) {
            media.addEventListener('change', listener);
        } else {
            // @ts-ignore - support for older browsers
            media.addListener(listener);
        }

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', listener);
            } else {
                // @ts-ignore - support for older browsers
                media.removeListener(listener);
            }
        };
    }, [query]);

    return matches;
}

import { useEffect } from 'react';
import { useStore } from '@tanstack/react-store';
import { uiStore } from '../state/store';

/**
 * Hook for accessing and managing theme state
 * Integrates with the global UI store for theme management
 */
export const useTheme = () => {
    const theme = useStore(uiStore, (state) => state.theme);
    const rtl = useStore(uiStore, (state) => state.rtl);

    const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
        uiStore.setState((state) => ({ ...state, theme: newTheme }));

        // Persist to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('ezux-theme', newTheme);

            // Update document class for CSS
            const effectiveTheme = newTheme === 'system'
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : newTheme;

            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(effectiveTheme);
        }
    };

    const toggleTheme = () => {
        const currentTheme = theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const setRTL = (newRtl: boolean) => {
        uiStore.setState((state) => ({ ...state, rtl: newRtl }));

        // Persist to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('ezux-rtl', String(newRtl));
            document.documentElement.dir = newRtl ? 'rtl' : 'ltr';
        }
    };

    // Initialize theme from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('ezux-theme') as 'light' | 'dark' | 'system' | null;
            const savedRTL = localStorage.getItem('ezux-rtl') === 'true';

            if (savedTheme && savedTheme !== theme) {
                setTheme(savedTheme);
            }

            if (savedRTL !== rtl) {
                setRTL(savedRTL);
            }
        }
    }, []);

    const effectiveTheme = theme === 'system'
        ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    return {
        theme,
        rtl,
        setTheme,
        toggleTheme,
        setRTL,
        isDark: effectiveTheme === 'dark',
        isLight: effectiveTheme === 'light',
    };
};

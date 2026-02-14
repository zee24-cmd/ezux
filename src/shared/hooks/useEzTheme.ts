import { useState, useEffect } from 'react';
import { globalServiceRegistry } from '../services/ServiceRegistry';
import { ThemeService, ThemeMode, ThemeColor } from '../services/ThemeService';

/**
 * Hook for accessing and controlling the library's theme state.
 * 
 * Provides current theme mode (light/dark/system), primary colors, and UI radius settings.
 * Automatically synchronizes with the global `ThemeService`.
 * 
 * @group Hooks
 */
export const useEzTheme = () => {
    // Get singleton instance
    const themeService = globalServiceRegistry.get<ThemeService>('ThemeService') || new ThemeService();

    // Register if not already (safeguard)
    if (!globalServiceRegistry.get('ThemeService')) {
        globalServiceRegistry.register('ThemeService', themeService);
    }

    const [state, setState] = useState(themeService.getState());

    useEffect(() => {
        const unsubscribe = themeService.subscribe(setState);
        return unsubscribe;
    }, [themeService]);

    return {
        /** Current theme configuration (mode, color, radius). @group State */
        ...state,
        /** Sets the theme mode (light, dark, or system). @group Methods */
        setMode: (mode: ThemeMode) => themeService.setMode(mode),
        /** Toggles between light and dark modes. @group Methods */
        toggleMode: () => themeService.toggleMode(),
        /** Updates the primary theme color. @group Methods */
        setThemeColor: (color: ThemeColor) => themeService.setThemeColor(color),
        /** Updates the global border radius setting. @group Methods */
        setRadius: (radius: number) => themeService.setRadius(radius),
    };
};

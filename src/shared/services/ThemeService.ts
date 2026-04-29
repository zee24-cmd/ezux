import { IService } from './ServiceRegistry';
import { themes, ThemeName, ThemeMode } from '../themes';

export type { ThemeMode, ThemeName as ThemeColor };

/**
 * A reactive service for managing the library's visual theme.
 * 
 * Handles switching between light, dark, and system modes, as well as applying
 * custom color palettes and UI scaling (radius). Persists settings to local storage.
 * 
 * @group Services
 */
export class ThemeService implements IService {
    name = 'ThemeService';
    private listeners = new Set<(state: any) => void>();

    private state = {
        mode: 'light' as ThemeMode,
        themeColor: 'Zinc' as ThemeName,
        radius: 0.5,
    };

    /**
     * Directly applies a color theme to the document root bypassing the service instance.
     * Useful for initial hydration or static branding.
     * 
     * @param mode Theme mode (light or dark).
     * @param color The name of the color palette to apply.
     * @group Methods
     */
    static setGlobalColorTheme(mode: ThemeMode, color: ThemeName) {
        if (typeof document === 'undefined') return;
        const theme = themes[color][mode] as Record<string, string>;
        const root = document.documentElement;

        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        const baseVars = themes.Zinc[mode] as Record<string, string>;
        for (const key in baseVars) {
            root.style.setProperty(`--${key}`, baseVars[key]);
        }

        const ring = theme.ring;
        if (ring) {
            root.style.setProperty('--ring', ring);
        }
    }

    constructor() {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('ezux-theme-mode') as ThemeMode;
            if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
                this.state.mode = savedMode;
            } else {
                // Default to dark if preferring dark, else light
                this.state.mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            const savedColor = localStorage.getItem('ezux-theme-color') as ThemeName;
            if (savedColor && themes[savedColor]) {
                this.state.themeColor = savedColor;
            }

            const savedRadius = localStorage.getItem('ezux-theme-radius');
            if (savedRadius) {
                this.state.radius = parseFloat(savedRadius);
            }

            this.applyTheme();
        }
    }

    /** Toggles between light and dark modes. @group Methods */
    toggleMode() {
        const newMode = this.state.mode === 'light' ? 'dark' : 'light';
        this.setMode(newMode);
    }

    /** Sets the explicit theme mode. @group Methods */
    setMode(mode: ThemeMode) {
        this.state.mode = mode;
        if (typeof window !== 'undefined') {
            localStorage.setItem('ezux-theme-mode', mode);
        }
        this.applyTheme();
        this.notify();
    }

    /** Updates the primary color palette. @group Methods */
    setThemeColor(color: ThemeName) {
        this.state.themeColor = color;
        if (typeof window !== 'undefined') {
            localStorage.setItem('ezux-theme-color', color);
        }
        this.applyTheme();
        this.notify();
    }

    /** Sets the global UI border radius (in rem). @group Methods */
    setRadius(radius: number) {
        this.state.radius = radius;
        if (typeof window !== 'undefined') {
            localStorage.setItem('ezux-theme-radius', radius.toString());
        }
        this.applyTheme();
        this.notify();
    }

    /** Returns the current active theme state. @group Methods */
    getState() {
        return this.state;
    }

    private applyTheme() {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;

        // 1. Apply Mode (Light/Dark)
        if (this.state.mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // 2. Apply Radius (Base from state)
        root.style.setProperty('--radius', `${this.state.radius}rem`);

        // 3. Apply Theme Color (focus ring only)
        const theme = themes[this.state.themeColor];
        if (theme) {
            const baseVars = themes.Zinc[this.state.mode] as Record<string, string>;
            const modeVars = theme[this.state.mode] as Record<string, string>;

            for (const key in baseVars) {
                root.style.setProperty(`--${key}`, baseVars[key]);
            }

            if (modeVars.ring) {
                root.style.setProperty('--ring', modeVars.ring);
            }
        }

        // Keep the data-theme attribute for any legacy CSS selectors
        root.setAttribute('data-theme', this.state.themeColor);
    }

    /**
     * Subscribes to theme changes.
     * @param listener Callback triggered on state updates.
     * @returns Unsubscribe function.
     * @group Methods
     */
    subscribe(listener: (state: any) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify(): void {
        this.listeners.forEach((listener) => listener(this.state));
    }
}

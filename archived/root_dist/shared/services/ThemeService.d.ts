import { IService } from './ServiceRegistry';
import { ThemeName, ThemeMode } from '../themes';
export type { ThemeMode, ThemeName as ThemeColor };
export declare class ThemeService implements IService {
    name: string;
    private listeners;
    private state;
    /**
     * Static helper to apply a theme directly to the document,
     * matching the implementation pattern from the video.
     */
    static setGlobalColorTheme(mode: ThemeMode, color: ThemeName): void;
    constructor();
    toggleMode(): void;
    setMode(mode: ThemeMode): void;
    setThemeColor(color: ThemeName): void;
    setRadius(radius: number): void;
    getState(): {
        mode: ThemeMode;
        themeColor: ThemeName;
        radius: number;
    };
    private applyTheme;
    subscribe(listener: (state: any) => void): () => void;
    private notify;
}

import { Store } from '@tanstack/store';
export interface UIState {
    theme: 'light' | 'dark' | 'system';
    rtl: boolean;
    locale: string;
}
export declare const uiStore: Store<UIState, (cb: UIState) => UIState>;
export declare const updateTheme: (theme: UIState["theme"]) => void;
export declare const toggleRTL: () => void;
export declare const setLocale: (locale: string) => void;

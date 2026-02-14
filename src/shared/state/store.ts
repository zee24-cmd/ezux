import { Store } from '@tanstack/store';

export interface UIState {
    theme: 'light' | 'dark' | 'system';
    rtl: boolean;
    locale: string;
}

export const uiStore = new Store<UIState>({
    theme: 'system',
    rtl: false,
    locale: 'en-US',
});

export const updateTheme = (theme: UIState['theme']) => {
    uiStore.setState((state) => ({ ...state, theme }));
};

export const toggleRTL = () => {
    uiStore.setState((state) => ({ ...state, rtl: !state.rtl }));
};

export const setLocale = (locale: string) => {
    uiStore.setState((state) => ({ ...state, locale }));
};

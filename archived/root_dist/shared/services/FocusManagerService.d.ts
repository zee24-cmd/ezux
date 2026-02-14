import { IService } from './ServiceRegistry';
export declare class FocusManagerService implements IService {
    name: string;
    private focusableElements;
    private currentFocusIndex;
    constructor();
    registerFocusable(element: HTMLElement): void;
    unregisterFocusable(element: HTMLElement): void;
    focusNext(): void;
    focusPrevious(): void;
    trapFocus(container: HTMLElement): () => void;
    cleanup(): void;
}

import { IService } from './ServiceRegistry';

/**
 * Service for managing keyboard focus and accessibility across the application.
 * 
 * Handles registration of focusable elements, programmatic focus movement,
 * and standard ARIA focus trapping for modals and popovers.
 * 
 * @group Services
 */
export class FocusManagerService implements IService {
    name = 'FocusManagerService';
    private focusableElements: HTMLElement[] = [];
    private currentFocusIndex = -1;

    constructor() { }

    /** Registers an element as focusable and ensures proper tab order. @group Methods */
    registerFocusable(element: HTMLElement): void {
        if (!this.focusableElements.includes(element)) {
            this.focusableElements.push(element);
            // Sort elements by DOM position to ensure correct tab order
            this.focusableElements.sort((a, b) => {
                return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            });
        }
    }

    /** Unregisters an element and updates the current focus tracking. @group Methods */
    unregisterFocusable(element: HTMLElement): void {
        const index = this.focusableElements.indexOf(element);
        if (index > -1) {
            this.focusableElements.splice(index, 1);
            if (this.currentFocusIndex >= index) {
                this.currentFocusIndex--;
            }
        }
    }

    /** Moves focus to the next element in the registration list. @group Methods */
    focusNext(): void {
        if (this.focusableElements.length === 0) return;
        this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
        this.focusableElements[this.currentFocusIndex].focus();
    }

    /** Moves focus to the previous element in the registration list. @group Methods */
    focusPrevious(): void {
        if (this.focusableElements.length === 0) return;
        this.currentFocusIndex =
            (this.currentFocusIndex - 1 + this.focusableElements.length) % this.focusableElements.length;
        this.focusableElements[this.currentFocusIndex].focus();
    }

    /**
     * Traps keyboard focus within a specific DOM container.
     * Common for dialogs and side sheets to maintain focus context.
     * 
     * @param container The element to trap focus inside.
     * @returns Cleanup function to release the trap.
     * @group Methods
     */
    trapFocus(container: HTMLElement): () => void {
        // Basic implementation of focus trap
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                const focusable = container.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        container.addEventListener('keydown', handleKeyDown);
        return () => container.removeEventListener('keydown', handleKeyDown);
    }

    cleanup(): void {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
    }
}

import { IService } from './ServiceRegistry';

/**
 * Represents an individual item in a context menu.
 * @group Services
 */
export interface MenuItem {
    /** Unique identifier for the menu item. @group Data */
    id: string;
    /** Text label to display. @group Data */
    label: string;
    /** Internal action identifier triggered on click. @group Data */
    action: string;
    /** Optional icon element. @group Appearance */
    icon?: React.ReactNode;
    /** Keyboard shortcut hint (e.g., 'Ctrl+C'). @group Appearance */
    shortcut?: string;
    /** Whether the item is non-interactive. @group Properties */
    disabled?: boolean;
    /** Whether to render a visual separator below this item. @group Appearance */
    isSeparator?: boolean;
    /** Custom CSS class for the item. @group Appearance */
    className?: string;
    /** Custom click handler. @group Events */
    onClick?: (data: any) => void;
}

/**
 * Functional provider that generates menu items for a specific data context.
 * @group Services
 */
export type ContextMenuProvider<T = any> = (data: T) => MenuItem[];

/**
 * Service for managing dynamic, context-aware menus across the application.
 * 
 * Supports registration of menu providers by context ID and retrieval
 * of localized, state-dependent menu items for specific data targets.
 * 
 * @group Services
 */
export class ContextMenuService implements IService {
    name = 'ContextMenuService';
    private providers = new Map<string, ContextMenuProvider>();

    /**
     * Registers a menu provider for a specific context.
     * @param contextId Unique ID for the context (e.g., 'table-row').
     * @param provider function that returns menu items based on the target data.
     * @returns Unsubscribe function to remove the provider.
     * @group Methods
     */
    register<T>(contextId: string, provider: ContextMenuProvider<T>) {
        this.providers.set(contextId, provider);
        return () => this.providers.delete(contextId);
    }

    /**
     * Retrieves the list of menu items for a specific context and data target.
     * @param contextId The ID of the context to lookup.
     * @param data The data object the menu is opening for.
     * @group Methods
     */
    getItems(contextId: string, data: any): MenuItem[] {
        const provider = this.providers.get(contextId);
        return provider ? provider(data) : [];
    }

    cleanup() {
        this.providers.clear();
    }
}

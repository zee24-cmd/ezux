import { ServiceRegistry } from '../services/ServiceRegistry';
export interface SharedBaseProps {
    /**
     * Unique identifier for the component instance.
     * critical for accessibility and state management.
     */
    id?: string;
    /**
     * Custom class names for styling.
     */
    className?: string;
    /**
     * Direction of the text.
     * Default: 'ltr'
     */
    dir?: 'ltr' | 'rtl' | 'auto';
    /**
     * The shared service registry instance.
     * This is required to access shared services like HierarchyService, FocusManagerService, etc.
     */
    serviceRegistry?: ServiceRegistry;
}
/**
 * Base interface for data that can be rendered in a table or tree.
 */
export interface TableRowData {
    id: string;
    [key: string]: any;
}

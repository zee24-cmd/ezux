import { ServiceRegistry } from '../services/ServiceRegistry';
import { BaseComponentProps } from './commonTypes';
import { ComponentEventCallbacks } from './common';

export interface SharedBaseProps extends BaseComponentProps, ComponentEventCallbacks {
    /**
     * The shared service registry instance.
     * This is required to access shared services like HierarchyService, FocusManagerService, etc.
     * @group Services
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

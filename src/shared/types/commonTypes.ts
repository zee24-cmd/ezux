import React from 'react';

/**
 * Base Component Types
 */
export interface BaseComponentProps {
    /** 
     * Unique identifier for the component instance 
     * @group Properties
     */
    id?: string;
    /** 
     * Custom class names for styling 
     * @group Properties
     */
    className?: string;
    /** 
     * Inline styles 
     * @group Properties
     */
    style?: React.CSSProperties;
    /** 
     * Data attribute for testing 
     * @group Properties
     */
    dataTestId?: string;
    /** 
     * Direction of the text (ltr, rtl, auto) 
     * @group Properties
     */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * State Types
 */
export interface State<T> {
    data: T;
    loading: boolean;
    error: Error | null;
    initialized: boolean;
}

/**
 * Event Types
 */
export interface BaseEvent {
    timestamp: Date;
    source: string;
}

export interface SelectionEvent<T> extends BaseEvent {
    selected: T[];
    deselected: T[];
    changed: boolean;
}

/**
 * Service Types
 */
export interface Service<T> {
    name: string;
    initialize(): Promise<void>;
    cleanup(): void;
    getState(): T;
    setState(state: T): void;
}

/**
 * Utility Types
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Tree Manipulation Types
 */
export interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
    icon?: React.ReactNode;
    level?: number;
    parentId?: string;
    isLeaf?: boolean;
    isLoading?: boolean;
    isLoaded?: boolean;
    [key: string]: unknown;
}

/**
 * Filter Utilities Types
 */
export type FilterOperator =
    | 'contains'
    | 'doesNotContain'
    | 'shouldContain'
    | 'equals'
    | 'notEquals'
    | 'doesNotEqual'
    | 'startsWith'
    | 'endsWith'
    | 'empty'
    | 'notEmpty'
    | 'gt'
    | 'greaterThan'
    | 'lt'
    | 'lessThan'
    | 'gte'
    | 'greaterThanOrEqual'
    | 'lte'
    | 'lessThanOrEqual'
    | 'between';

export interface FilterRule {
    kind: 'rule';
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
}

export interface FilterGroup {
    kind: 'group';
    id: string;
    logic: 'AND' | 'OR';
    filters: (FilterRule | FilterGroup)[];
}

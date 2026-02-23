import {
    FilterOperator as SharedFilterOperator,
    FilterRule as SharedFilterRule,
    FilterGroup as SharedFilterGroup
} from '../../../shared/types/common';

// Advanced Filter Types (Phase 6.2)
export type FilterOperator = SharedFilterOperator;
export type FilterRule = SharedFilterRule;
export type FilterGroup = SharedFilterGroup;

/**
 * Configuration for filtering behavior.
 * @group Models
 */
export interface FilterSettings {
    /** Filter UI type. @group Properties */
    type?: 'Menu' | 'CheckBox' | 'Excel';
    /** Whether to ignore accents during filtering. @group Properties */
    ignoreAccent?: boolean;
    /** Filter application mode. @group Properties */
    mode?: 'Immediate' | 'OnEnter';
    /** Whether to show the filter bar status. @group Properties */
    showFilterBarStatus?: boolean;
}

/**
 * Configuration for global search behavior.
 * @group Models
 */
export interface SearchSettings {
    /** Specific fields to search in. @group Properties */
    fields?: string[];
    /** Search operator. @group Properties */
    operator?: 'contains' | 'startsWith' | 'endsWith' | 'equal';
    /** Search key/term. @group Properties */
    key?: string;
    /** Whether to ignore case during search. @group Properties */
    ignoreCase?: boolean;
}

/**
 * Configuration for sorting behavior.
 * @group Models
 */
export interface SortSettings {
    /** Sort mode (single or multiple columns). @group Properties */
    mode?: 'Single' | 'Multiple';
    /** Whether to allow unsorting columns. @group Properties */
    allowUnsort?: boolean;
}

/**
 * Configuration for text wrapping.
 * @group Models
 */
export interface TextWrapSettings {
    /** Wrap mode for header, content or both. @group Properties */
    wrapMode?: 'Both' | 'Header' | 'Content';
}

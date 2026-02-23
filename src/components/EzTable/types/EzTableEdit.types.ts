import React from 'react';

/**
 * Configuration for row/cell selection behavior.
 * @group Models
 */
export interface SelectionSettings {
    /** Selection mode. @group Properties */
    mode?: 'Row' | 'Cell' | 'Both';
    /** Selection type. @group Properties */
    type?: 'Single' | 'Multiple';
    /** Whether to allow selection only via checkbox. @group Properties */
    checkboxOnly?: boolean;
    /** Whether to persist selection across data updates. @group Properties */
    persistSelection?: boolean;
}

/**
 * Configuration for editing behavior.
 * @group Models
 */
export interface EditSettings {
    /** Whether to allow adding new rows. @group Properties */
    allowAdding?: boolean;
    /** Whether to allow editing existing rows. @group Properties */
    allowEditing?: boolean;
    /** Whether to allow deleting rows. @group Properties */
    allowDeleting?: boolean;
    /** Edit mode. @group Properties */
    mode?: 'Normal' | 'Dialog' | 'Batch';
    /** Position for newly added rows. @group Properties */
    newRowPosition?: 'Top' | 'Bottom';
    /** Whether to allow editing on double-click. @group Properties */
    allowEditOnDblClick?: boolean;
    /** Primary key field(s) for identification. @group Properties */
    primaryKey?: string | string[];
}

export type ToolbarItemType = 'Search' | 'Print' | 'Export' | 'Add' | 'Edit' | 'Delete' | 'Update' | 'Cancel' | 'ColumnChooser' | string;

/**
 * Represents an item in the table toolbar.
 * @group Models
 */
export interface ToolbarItem {
    /** Display text for the item. @group Properties */
    text?: string;
    /** Tooltip text for the item. @group Properties */
    tooltipText?: string;
    /** Prefix icon for the item. @group Properties */
    prefixIcon?: string | React.ReactNode;
    /** Unique identifier for the item. @group Properties */
    id?: string;
    /** Alignment in the toolbar. @group Properties */
    align?: 'Left' | 'Right' | 'Center';
    /** Predefined or custom type. @group Properties */
    type?: ToolbarItemType;
    /** Custom template for rendering the item. @group Properties */
    template?: React.ReactNode;
    /** Callback when the item is clicked. @group Events */
    onClick?: (e: React.MouseEvent) => void;
}

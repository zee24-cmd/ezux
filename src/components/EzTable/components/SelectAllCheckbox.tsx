import React from 'react';
import { Checkbox } from '../../ui/checkbox';

/**
 * Props for the "Select All" checkbox component.
 * @group Models
 */
interface SelectAllCheckboxProps {
    /** Whether the checkbox is checked (all selected). @group State */
    checked: boolean;
    /** Whether the selection is in an indeterminate state. @group State */
    indeterminate: boolean;
    /** Handler for select all toggle. @group Events */
    onSelectAll: (select: boolean) => void;
    /** Whether to show search result specific text. @group Properties */
    showSearchResults?: boolean;
}

/**
 * Renders a specialized "Select All" checkbox with indeterminate state support.
 * @group Components
 */
export const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = React.memo(({
    checked,
    indeterminate,
    onSelectAll,
    showSearchResults = false
}) => (
    <div
        className="flex items-center space-x-2 px-2 py-1.5 hover:bg-muted rounded text-sm cursor-pointer"
        onClick={() => onSelectAll(!checked)}
    >
        <Checkbox
            checked={checked ? true : (indeterminate ? "indeterminate" : false)}
            onCheckedChange={(c: boolean | "indeterminate") => onSelectAll(c === true)}
        />
        <label className="flex-1 cursor-pointer">
            {showSearchResults ? '(Select All Search Results)' : '(Select All)'}
        </label>
    </div>
));

SelectAllCheckbox.displayName = 'SelectAllCheckbox';

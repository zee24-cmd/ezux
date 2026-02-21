import { useState, useCallback } from 'react';
import { EditMode, ValidationResult } from '../types/common';

/**
 * Configuration for the useEditing hook.
 * @group Properties
 */
export interface EditConfig<TData = any> {
    /** Edit interaction mode (inline, dialog, or batch). @group Properties */
    mode?: EditMode;
    /** Whether adding new records is allowed. @group Properties */
    allowAdding?: boolean;
    /** Whether editing existing records is allowed. @group Properties */
    allowEditing?: boolean;
    /** Whether deleting records is allowed. @group Properties */
    allowDeleting?: boolean;
    /** Whether to prompt for confirmation before deletion. @group Properties */
    showDeleteConfirm?: boolean;

    /** Callback to validate an entire row before saving. @group Events */
    validateRow?: (data: TData) => ValidationResult;
    /** Callback to validate a single field value. @group Events */
    validateField?: (fieldName: string, value: any, data: TData) => boolean | string;

    /** Callback triggered when a row enters edit mode. @group Events */
    onRowEdit?: (data: TData, index: number) => void;
    /** Callback triggered when a new row is being added. @group Events */
    onRowAdd?: (data: TData) => void;
    /** Callback triggered when a row is deleted. @group Events */
    onRowDelete?: (id: string | number) => void;
    /** Callback triggered when changes to a row are saved. @group Events */
    onRowSave?: (data: TData, index: number) => void;
    /** Callback triggered when editing of a row is cancelled. @group Events */
    onRowCancel?: (index: number) => void;
}

/**
 * Internal editing state.
 * @group State
 */
export interface EditState<TData = any> {
    /** Map of row indices to their current pending edits. @group State */
    editingRows: Map<number, TData>;
    /** Current state for a row being added (null if none). @group State */
    addingRow: TData | null;
    /** Set of IDs currently marked for deletion. @group State */
    deletingIds: Set<string | number>;
    /** Map of row indices to their current validation errors. @group State */
    validationErrors: Map<number, Record<string, string>>;
}

/**
 * Public API for editing management.
 * @group Methods
 */
export interface EditAPI<TData = any> {
    /** Starts editing a specific row. @group Methods */
    startEditing: (index: number, data: TData) => void;
    /** Stops editing a specific row without saving. @group Methods */
    stopEditing: (index: number) => void;
    /** Checks if a row is currently in edit mode. @group Methods */
    isEditing: (index: number) => boolean;
    /** Returns the current pending data for an edited row. @group Methods */
    getEditingData: (index: number) => TData | undefined;
    /** Updates the pending data for an edited row. @group Methods */
    updateEditingData: (index: number, data: Partial<TData>) => void;

    /** Starts the process of adding a new row. @group Methods */
    startAdding: (initialData?: Partial<TData>) => void;
    /** Stops the add process without saving. @group Methods */
    stopAdding: () => void;
    /** Checks if a return is currently in add mode. @group Methods */
    isAdding: () => boolean;
    /** Returns the current data for the row being added. @group Methods */
    getAddingData: () => TData | null;
    /** Updates the data for the row being added. @group Methods */
    updateAddingData: (data: Partial<TData>) => void;

    /** Saves changes to a specific row. @group Methods */
    saveRow: (index: number) => Promise<boolean>;
    /** Saves the row currently being added. @group Methods */
    saveNewRow: () => Promise<boolean>;
    /** Cancels editing and reverts changes for a row. @group Methods */
    cancelEdit: (index: number) => void;
    /** Cancels the add process. @group Methods */
    cancelAdd: () => void;

    /** Marks a row for deletion or triggers immediate delete. @group Methods */
    deleteRow: (id: string | number) => void;
    /** Checks if a specific ID is marked for deletion. @group State */
    isDeleting: (id: string | number) => boolean;

    /** Validates a specific row and returns results. @group Methods */
    validateRow: (index: number) => ValidationResult;
    /** Validates a specific field within a row. @group Methods */
    validateField: (index: number, fieldName: string, value: any) => boolean | string;
    /** Returns current validation errors for a row. @group Methods */
    getValidationErrors: (index: number) => Record<string, string> | undefined;

    /** Checks if there are any pending edits or additions. @group Methods */
    hasChanges: () => boolean;
    /** Returns all rows that have pending changes. @group Methods */
    getChangedRows: () => Map<number, TData>;
    /** Saves all pending changes across all edited rows. @group Methods */
    saveAllChanges: () => Promise<boolean>;
    /** Discards all pending edits and additions. @group Methods */
    cancelAllChanges: () => void;
}

/**
 * Shared hook for implementing robust editing features in components.
 * 
 * Manages complex state transitions for inline, batch, and dialog-based editing,
 * including validation logic, pending changes tracking, and transactional saving.
 * 
 * @param config Configuration for editing behavior and callbacks.
 * @group Hooks
 */
export const useEditing = <TData extends Record<string, any> = any>(
    config: EditConfig<TData> = {}
): EditAPI<TData> => {
    const {
        mode: _mode = 'inline',
        allowAdding = true,
        allowEditing = true,
        allowDeleting = true,
        validateRow: validateRowFn,
        validateField: validateFieldFn,
        onRowEdit,
        onRowAdd,
        onRowDelete,
        onRowSave,
        onRowCancel
    } = config;

    const [state, setState] = useState<EditState<TData>>({
        editingRows: new Map(),
        addingRow: null,
        deletingIds: new Set(),
        validationErrors: new Map()
    });

    // Start editing a row
    const startEditing = useCallback((index: number, data: TData) => {
        if (!allowEditing) return;

        setState(prev => {
            const newEditingRows = new Map(prev.editingRows);
            newEditingRows.set(index, { ...data });

            return {
                ...prev,
                editingRows: newEditingRows
            };
        });

        onRowEdit?.(data, index);
    }, [allowEditing, onRowEdit]);

    // Stop editing a row
    const stopEditing = useCallback((index: number) => {
        setState(prev => {
            const newEditingRows = new Map(prev.editingRows);
            newEditingRows.delete(index);

            const newValidationErrors = new Map(prev.validationErrors);
            newValidationErrors.delete(index);

            return {
                ...prev,
                editingRows: newEditingRows,
                validationErrors: newValidationErrors
            };
        });
    }, []);

    // Check if row is being edited
    const isEditing = useCallback((index: number): boolean => {
        return state.editingRows.has(index);
    }, [state.editingRows]);

    // Get editing data for a row
    const getEditingData = useCallback((index: number): TData | undefined => {
        return state.editingRows.get(index);
    }, [state.editingRows]);

    // Update editing data
    const updateEditingData = useCallback((index: number, data: Partial<TData>) => {
        setState(prev => {
            const currentData = prev.editingRows.get(index);
            if (!currentData) return prev;

            const newEditingRows = new Map(prev.editingRows);
            newEditingRows.set(index, { ...currentData, ...data });

            return {
                ...prev,
                editingRows: newEditingRows
            };
        });
    }, []);

    // Start adding a new row
    const startAdding = useCallback((initialData: Partial<TData> = {}) => {
        if (!allowAdding) return;

        setState(prev => ({
            ...prev,
            addingRow: initialData as TData
        }));

        onRowAdd?.(initialData as TData);
    }, [allowAdding, onRowAdd]);

    // Stop adding
    const stopAdding = useCallback(() => {
        setState(prev => ({
            ...prev,
            addingRow: null
        }));
    }, []);

    // Check if adding
    const isAdding = useCallback((): boolean => {
        return state.addingRow !== null;
    }, [state.addingRow]);

    // Get adding data
    const getAddingData = useCallback((): TData | null => {
        return state.addingRow;
    }, [state.addingRow]);

    // Update adding data
    const updateAddingData = useCallback((data: Partial<TData>) => {
        setState(prev => {
            if (!prev.addingRow) return prev;

            return {
                ...prev,
                addingRow: { ...prev.addingRow, ...data }
            };
        });
    }, []);

    // Validate a row
    const validateRow = useCallback((index: number): ValidationResult => {
        const data = state.editingRows.get(index);
        if (!data) return { isValid: true };

        if (validateRowFn) {
            return validateRowFn(data);
        }

        return { isValid: true };
    }, [state.editingRows, validateRowFn]);

    // Validate a field
    const validateField = useCallback((index: number, fieldName: string, value: any): boolean | string => {
        const data = state.editingRows.get(index);
        if (!data) return true;

        if (validateFieldFn) {
            return validateFieldFn(fieldName, value, data);
        }

        return true;
    }, [state.editingRows, validateFieldFn]);

    // Get validation errors
    const getValidationErrors = useCallback((index: number): Record<string, string> | undefined => {
        return state.validationErrors.get(index);
    }, [state.validationErrors]);

    // Save a row
    const saveRow = useCallback(async (index: number): Promise<boolean> => {
        const data = state.editingRows.get(index);
        if (!data) return false;

        // Validate
        const validation = validateRow(index);
        if (!validation.isValid) {
            setState(prev => {
                const newValidationErrors = new Map(prev.validationErrors);
                newValidationErrors.set(index, validation.errors || {});
                return { ...prev, validationErrors: newValidationErrors };
            });
            return false;
        }

        // Save
        onRowSave?.(data, index);
        stopEditing(index);

        return true;
    }, [state.editingRows, validateRow, onRowSave, stopEditing]);

    // Save new row
    const saveNewRow = useCallback(async (): Promise<boolean> => {
        if (!state.addingRow) return false;

        // Validate
        if (validateRowFn) {
            const validation = validateRowFn(state.addingRow);
            if (!validation.isValid) {
                return false;
            }
        }

        // Save
        onRowAdd?.(state.addingRow);
        stopAdding();

        return true;
    }, [state.addingRow, validateRowFn, onRowAdd, stopAdding]);

    // Cancel edit
    const cancelEdit = useCallback((index: number) => {
        stopEditing(index);
        onRowCancel?.(index);
    }, [stopEditing, onRowCancel]);

    // Cancel add
    const cancelAdd = useCallback(() => {
        stopAdding();
    }, [stopAdding]);

    // Delete row
    const deleteRow = useCallback((id: string | number) => {
        if (!allowDeleting) return;

        setState(prev => {
            const newDeletingIds = new Set(prev.deletingIds);
            newDeletingIds.add(id);
            return { ...prev, deletingIds: newDeletingIds };
        });

        onRowDelete?.(id);
        // Note: deletingIds is cleared when the parent refreshes data and the row
        // is no longer present. Avoid raw setTimeout here to prevent use-after-unmount updates.
    }, [allowDeleting, onRowDelete]);

    // Check if deleting
    const isDeleting = useCallback((id: string | number): boolean => {
        return state.deletingIds.has(id);
    }, [state.deletingIds]);

    // Check if has changes
    const hasChanges = useCallback((): boolean => {
        return state.editingRows.size > 0 || state.addingRow !== null;
    }, [state.editingRows, state.addingRow]);

    // Get changed rows
    const getChangedRows = useCallback((): Map<number, TData> => {
        return new Map(state.editingRows);
    }, [state.editingRows]);

    // Save all changes (batch mode)
    const saveAllChanges = useCallback(async (): Promise<boolean> => {
        let allValid = true;

        // Validate all rows
        for (const [index] of state.editingRows) {
            const validation = validateRow(index);
            if (!validation.isValid) {
                allValid = false;
                setState(prev => {
                    const newValidationErrors = new Map(prev.validationErrors);
                    newValidationErrors.set(index, validation.errors || {});
                    return { ...prev, validationErrors: newValidationErrors };
                });
            }
        }

        if (!allValid) return false;

        // Save all rows
        for (const [index, data] of state.editingRows) {
            onRowSave?.(data, index);
        }

        // Clear editing state
        setState(prev => ({
            ...prev,
            editingRows: new Map(),
            validationErrors: new Map()
        }));

        return true;
    }, [state.editingRows, validateRow, onRowSave]);

    // Cancel all changes
    const cancelAllChanges = useCallback(() => {
        setState({
            editingRows: new Map(),
            addingRow: null,
            deletingIds: new Set(),
            validationErrors: new Map()
        });
    }, []);

    return {
        startEditing,
        stopEditing,
        isEditing,
        getEditingData,
        updateEditingData,
        startAdding,
        stopAdding,
        isAdding,
        getAddingData,
        updateAddingData,
        saveRow,
        saveNewRow,
        cancelEdit,
        cancelAdd,
        deleteRow,
        isDeleting,
        validateRow,
        validateField,
        getValidationErrors,
        hasChanges,
        getChangedRows,
        saveAllChanges,
        cancelAllChanges
    };
};

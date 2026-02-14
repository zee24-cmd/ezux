import { useEffect } from 'react';

interface UseDialogStateInitializationOptions {
    dialogState: any;
    isDialogMode: boolean;
    rows: any[];
    table: any;
}

export const useDialogStateInitialization = ({
    dialogState,
    isDialogMode,
    rows,
    table
}: UseDialogStateInitializationOptions) => {
    useEffect(() => {
        if (!isDialogMode) return;

        const editingRowId = Object.keys(table.options.meta?.editingRows || {}).find(k => table.options.meta?.editingRows?.[k]);
        
        if (editingRowId !== undefined) {
            const index = parseInt(editingRowId);
            if (!isNaN(index) && rows[index]) {
                dialogState.open('edit', rows[index].original, { index });
            }
        }
    }, [isDialogMode, dialogState, rows, table]);
};

export default useDialogStateInitialization;
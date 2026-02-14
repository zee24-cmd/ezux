
/**
 * Creates common CRUD methods for imperative APIs
 */
export const createCRUDMethods = <T>(
    getData: () => T[] | Promise<T[]>,
    addItem: (item: T) => void | Promise<any>,
    updateItem: (item: T) => void | Promise<any>,
    deleteItem: (id: string | number) => void | Promise<void>
) => {
    return {
        getData,
        addRecord: addItem,
        updateRecord: updateItem,
        deleteRecord: deleteItem
    };
};

/**
 * Creates common spinner control methods
 */
export const createSpinnerMethods = (
    showSpinner: () => void,
    hideSpinner: () => void
) => {
    return {
        showSpinner,
        hideSpinner
    };
};

/**
 * Creates common refresh methods
 */
export const createRefreshMethods = (
    refresh: () => void,
    forceUpdate?: () => void
) => {
    const methods: Record<string, any> = {
        refresh
    };

    if (forceUpdate) {
        methods.forceUpdate = forceUpdate;
    }

    return methods;
};

/**
 * Creates common selection methods
 */
export const createSelectionMethods = <T>(
    selectItem: (id: string | number) => void,
    selectItems: (ids: (string | number)[]) => void,
    clearSelection: () => void,
    selectAll: () => void,
    getSelectedItems: () => T[],
    selectRowByRange?: (start: string | number, end: string | number) => void
) => {
    const methods: Record<string, any> = {
        selectRow: selectItem,
        selectRows: selectItems,
        clearSelection,
        selectAll,
        getSelectedRecords: getSelectedItems
    };

    if (selectRowByRange) {
        methods.selectRowByRange = selectRowByRange;
    }

    return methods;
};

/**
 * Creates common navigation methods
 */
export const createNavigationMethods = (
    scrollToIndex: (index: number) => void,
    goToPage?: (page: number) => void
) => {
    const methods: Record<string, any> = {
        scrollToIndex
    };

    if (goToPage) {
        methods.goToPage = goToPage;
    }

    return methods;
};

/**
 * Creates common export methods
 */
export const createExportMethods = (
    exportToCsv?: () => void,
    exportToExcel?: () => void,
    print?: () => void
) => {
    const methods: Record<string, any> = {};

    if (exportToCsv) {
        methods.exportDataAsCsv = exportToCsv;
    }

    if (exportToExcel) {
        methods.exportToExcel = exportToExcel;
    }

    if (print) {
        methods.print = print;
    }

    return methods;
};

/**
 * Validates imperative API for completeness and consistency
 */
export const validateImperativeAPI = (api: Record<string, any>, requiredMethods: string[]): boolean => {
    const missingMethods = requiredMethods.filter(method => !(method in api));

    if (missingMethods.length > 0) {
        console.warn(`Missing required methods: ${missingMethods.join(', ')}`);
        return false;
    }

    return true;
};

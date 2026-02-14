interface PaginationProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalRows: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
}
export declare const EzPagination: React.FC<PaginationProps>;
export {};

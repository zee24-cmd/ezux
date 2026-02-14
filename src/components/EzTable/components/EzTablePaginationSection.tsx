import { Table } from '@tanstack/react-table';
import { EzPagination } from '../EzPagination';
import { cn } from '../../../lib/utils';

/**
 * Props for the pagination section of EzTable.
 * @group Models
 */
interface EzTablePaginationSectionProps {
    /** The TanStack Table instance. @group Properties */
    table: Table<any>;
    /** Optional message to display in the pager. @group Properties */
    pagerMessage?: string;
    /** Whether the pagination section is sticky at the bottom. @group Properties */
    enableStickyPagination?: boolean;
    /** Custom class names for the section. @group Properties */
    classNames?: { footer?: string };
    /** Localization strings. @group Properties */
    localization?: any;
    /** Current change counts for display. @group Properties */
    changes?: { added: number; edited: number; deleted: number };
}

/**
 * Renders the pagination footer section for EzTable.
 * @group Components
 */
export function EzTablePaginationSection({
    table,
    pagerMessage,
    enableStickyPagination,
    classNames,
    localization,
    changes
}: EzTablePaginationSectionProps) {
    return (
        <div className={cn(
            "w-full bg-background border-t border-border z-30",
            enableStickyPagination && "sticky bottom-0 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)]",
            classNames?.footer
        )}>
            <EzPagination
                pageIndex={table.getState().pagination.pageIndex}
                pageSize={table.getState().pagination.pageSize}
                pageCount={table.getPageCount()}
                totalRows={table.getPrePaginationRowModel().rows.length}
                canNextPage={table.getCanNextPage()}
                canPreviousPage={table.getCanPreviousPage()}
                onPageChange={table.setPageIndex}
                onPageSizeChange={table.setPageSize}
                localization={{ ...localization, pagerMessage }}
                changes={changes}
            />
        </div>
    );
}

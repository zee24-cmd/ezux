import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { EzTableLocalization } from './EzTable.types';

interface PaginationProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalRows: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    localization?: EzTableLocalization;
    changes?: { added: number; edited: number; deleted: number };
}

export const EzPagination: React.FC<PaginationProps> = ({
    pageIndex,
    pageSize,
    pageCount,
    totalRows,
    onPageChange,
    onPageSizeChange,
    canPreviousPage,
    canNextPage,
    localization,
    changes
}) => {
    return (
        <div className="flex items-center justify-between w-full px-4 py-3 border-t border-border bg-background">
            {/* Left Section: Rows Per Page & Total Info */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="hidden sm:inline whitespace-nowrap">{localization?.rowsPerPageLabel || "Rows per page"}</span>
                    <span className="sm:hidden">{localization?.rowsLabel || "Rows"}</span>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px] bg-muted/20 border-border">
                            <SelectValue placeholder={pageSize.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 40, 50, 100].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="h-4 w-px bg-border hidden sm:block" />

                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted/30 px-3 py-1 rounded-full border border-border/50">
                    <div>
                        {localization?.totalLabel || "Total"} <span className="text-foreground font-bold">{totalRows}</span> {localization?.recordsLabel || "records"}
                    </div>
                    {changes && (changes.added > 0 || changes.edited > 0 || changes.deleted > 0) && (
                        <div className="flex items-center gap-2 border-l border-border/50 pl-2 ml-1">
                            {changes.added > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-bold">{changes.added} added</span>}
                            {changes.edited > 0 && <span className="text-amber-600 dark:text-amber-400 font-bold">{changes.edited} edited</span>}
                            {changes.deleted > 0 && <span className="text-rose-600 dark:text-rose-400 font-bold">{changes.deleted} deleted</span>}
                        </div>
                    )}
                </div>

                {localization?.pagerMessage && (
                    <div className="hidden lg:block text-sm text-muted-foreground italic">
                        {localization.pagerMessage}
                    </div>
                )}
            </div>

            {/* Right Section: Navigation Controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center text-sm font-medium text-foreground whitespace-nowrap bg-muted/20 px-3 py-1 rounded-md border border-border/50 gap-1.5">
                    <span className="text-muted-foreground font-normal">{localization?.pageLabel || "Page"}</span>
                    <span className="text-primary font-black px-0.5">{pageIndex + 1}</span>
                    <span className="text-muted-foreground font-normal">{localization?.ofLabel || "of"}</span>
                    <span className="font-bold px-0.5">{pageCount}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex bg-background border-border hover:bg-muted"
                            onClick={() => onPageChange(0)}
                            disabled={!canPreviousPage}
                            title={localization?.firstPage || "First Page"}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">Go to first page</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 bg-background border-border hover:bg-muted"
                            onClick={() => onPageChange(pageIndex - 1)}
                            disabled={!canPreviousPage}
                            title={localization?.previousPage || "Previous Page"}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Go to previous page</span>
                        </Button>
                    </div>

                    {/* Go To Page Input */}
                    <div className="flex items-center gap-2 px-2 h-8 bg-muted/20 rounded-md border border-border/50 hover:border-primary/50 transition-colors">
                        <span className="text-[10px] hidden sm:inline text-muted-foreground uppercase font-black tracking-tighter">{localization?.goToLabel || "Go To"}</span>
                        <Input
                            type="number"
                            min={1}
                            max={pageCount}
                            value={pageIndex + 1}
                            onFocus={(e) => e.target.select()}
                            onClick={(e) => e.currentTarget.select()}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') return;
                                const page = Number(val) - 1;
                                if (page >= 0 && page < pageCount) {
                                    onPageChange(page);
                                }
                            }}
                            className="h-6 w-10 p-0 text-center border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 bg-background border-border hover:bg-muted"
                            onClick={() => onPageChange(pageIndex + 1)}
                            disabled={!canNextPage}
                            title={localization?.nextPage || "Next Page"}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Go to next page</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex bg-background border-border hover:bg-muted"
                            onClick={() => onPageChange(pageCount - 1)}
                            disabled={!canNextPage}
                            title={localization?.lastPage || "Last Page"}
                        >
                            <ChevronsRight className="h-4 w-4" />
                            <span className="sr-only">Go to last page</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

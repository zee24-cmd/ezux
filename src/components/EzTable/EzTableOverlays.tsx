import React, { memo } from 'react';
import { FilterIcon } from 'lucide-react';

import { EzTableSlots, EzTableLocalization } from './EzTable.types';

interface EzTableOverlaysProps {
    isLoading: boolean;
    rowCount: number;
    renderNoRowsOverlay?: () => React.ReactNode;
    slots?: EzTableSlots;
    localization?: EzTableLocalization;
}

export const EzTableOverlays = memo(({ isLoading, rowCount, renderNoRowsOverlay, slots, localization }: EzTableOverlaysProps) => {
    if (isLoading) {
        const LoadingSlot = slots?.loading || slots?.loadingOverlay;
        if (LoadingSlot) {
            return <LoadingSlot />;
        }
        return (
            <div className="absolute inset-x-0 top-0 z-50 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-[1px] min-h-[200px]">
                <div className="flex flex-col items-center gap-3 py-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{localization?.loadingLabel || "Loading data..."}</span>
                </div>
            </div>
        );
    }

    if (rowCount === 0) {
        const NoRowsSlot = slots?.emptyRecord || slots?.noRowsOverlay;
        if (NoRowsSlot) {
            return <NoRowsSlot />;
        }
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                {renderNoRowsOverlay ? renderNoRowsOverlay() : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                        <FilterIcon className="w-12 h-12 opacity-10 mb-2" />
                        <span className="text-sm font-medium">{localization?.noRowsLabel || "No results found"}</span>
                        <p className="text-xs">Adjust your filters or search to see more results</p>
                    </div>
                )}
            </div>
        );
    }

    return null;
});

EzTableOverlays.displayName = 'EzTableOverlays';

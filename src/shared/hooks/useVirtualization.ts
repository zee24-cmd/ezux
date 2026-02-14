import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useVirtualizer, VirtualizerOptions, Virtualizer, elementScroll } from '@tanstack/react-virtual';
import { defaultRangeExtractor, Range } from '@tanstack/react-virtual';
import { globalServiceRegistry } from '../services/ServiceRegistry';
import { VirtualizationService } from '../services/VirtualizationService';
import { getOrRegisterService } from '../utils/serviceUtils';

/**
 * Configuration for the useVirtualization hook.
 * @group Properties
 */
export interface VirtualizationConfig {
    /** Total number of rows in the dataset. @group Data */
    rowCount: number;
    /** Fixed height or dynamic accessor for row height. @group Appearance */
    rowHeight?: number | ((index: number) => number);
    /** Number of rows to render outside the visible area. @group Performance */
    overscanCount?: number;
    /** Whether row virtualization is enabled. @default true @group Properties */
    enableRowVirtualization?: boolean;
    /** Unique ID for service registration. @group Properties */
    id?: string;

    /** Total number of columns (for 2D virtualization). @group Data */
    columnCount?: number;
    /** Fixed width or dynamic accessor for column width. @group Appearance */
    columnWidth?: number | ((index: number) => number);
    /** Whether column virtualization is enabled. @group Properties */
    enableColumnVirtualization?: boolean;

    /** Margin to add to the scroll container's size. @group Appearance */
    scrollMargin?: number;
    /** Padding at the start of the scrollable area. @group Appearance */
    scrollPaddingStart?: number;
    /** Padding at the end of the scrollable area. @group Appearance */
    scrollPaddingEnd?: number;

    /** Reduces overscan during active scrolling for performance. @group Performance */
    progressiveRendering?: boolean;
    /** Distance in rows to trigger pre-fetching. @group Performance */
    prefetchDistance?: number;
    /** Automatically adjusts sizes based on content. @group Performance */
    adaptiveSizing?: boolean;
    /** Text direction (ltr or rtl). @group Appearance */
    languageDirection?: 'ltr' | 'rtl';
    /** Enables debug logging. @group Properties */
    debug?: boolean;

    /** Custom logic to determine which items to render. @group Performance */
    customRangeExtractor?: (range: Range) => number[];

    /** Callback triggered when scroll offset changes. @group Events */
    onScroll?: (offset: number) => void;
    /** Callback triggered when scrolling begins. @group Events */
    onScrollStart?: () => void;
    /** Callback triggered when scrolling stops. @group Events */
    onScrollStop?: () => void;
}

/**
 * Result object for the useVirtualization hook.
 * @group Methods
 */
export interface VirtualizationResult {
    /** Ref to attach to the scroll container. @group Properties */
    parentRef: React.RefObject<HTMLDivElement | null>;
    /** The TanStack virtualizer instance for rows. @group Properties */
    rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
    /** The TanStack virtualizer instance for columns (if enabled). @group Properties */
    columnVirtualizer?: Virtualizer<HTMLDivElement, Element>;
    /** Scrolls to a specific index (alias for scrollToRow). @group Methods */
    scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void;
    /** Scrolls to a specific row index. @group Methods */
    scrollToRow: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void;
    /** Scrolls to a specific column index. @group Methods */
    scrollToColumn?: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void;
    /** Returns the list of items to currently render. @group Methods */
    getVirtualItems: () => any[];
    /** Current vertical scroll offset. @group State */
    scrollOffset: number;
}

/**
 * Shared virtualization hook for table, tree, and scheduler components.
 * 
 * Provides standardized row and column virtualization using TanStack Virtual.
 * Includes optimized progressive rendering, service integration, and pre-fetching support.
 * 
 * @param config Virtualization configuration.
 * @group Hooks
 */
export const useVirtualization = (config: VirtualizationConfig): VirtualizationResult => {
    const {
        rowCount,
        rowHeight = 48,
        overscanCount = 5,
        enableRowVirtualization: _enableRowVirtualization = true,
        columnCount = 0,
        columnWidth = 150,
        enableColumnVirtualization = false,
        scrollMargin = 0,
        scrollPaddingStart = 0,
        scrollPaddingEnd = 0,
        progressiveRendering = false,
        prefetchDistance = 5,
        adaptiveSizing = false,
        languageDirection = 'ltr',
        debug = false,
        customRangeExtractor,
        onScroll,
        onScrollStart,
        onScrollStop
    } = config;

    const parentRef = useRef<HTMLDivElement>(null);
    const [activeOverscan, setActiveOverscan] = useState(progressiveRendering ? 1 : (overscanCount || prefetchDistance));
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isScrollingRef = useRef(false);


    // Handle progressive overscan
    useEffect(() => {
        if (!progressiveRendering) return;

        let timeoutId: any;
        const handleScroll = () => {
            setActiveOverscan(1); // Reduce overscan during active scroll
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setActiveOverscan(overscanCount || prefetchDistance);
            }, 150); // Restore after scroll stops
        };

        const element = parentRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                element.removeEventListener('scroll', handleScroll);
                clearTimeout(timeoutId);
            };
        }
    }, [progressiveRendering, overscanCount, prefetchDistance]);

    // Enhanced range extractor to prevent blank rendering
    const enhancedRangeExtractor = useMemo(() => {
        if (customRangeExtractor) {
            return customRangeExtractor;
        }

        return (range: Range) => {
            const defaultRange = defaultRangeExtractor(range);

            // Ensure we always render at least one item
            if (defaultRange.length === 0 && range.count > 0) {
                return [0];
            }

            return defaultRange;
        };
    }, [customRangeExtractor]);

    // Custom scrollToFn to prevent scroll jumping during user interaction
    const scrollToFn = useCallback<VirtualizerOptions<HTMLDivElement, Element>['scrollToFn']>(
        (offset, canSmooth, instance) => {
            // Use elementScroll for smooth scrolling without jumping
            elementScroll(offset, canSmooth, instance);
        },
        []
    );

    // Row virtualizer configuration
    const rowVirtualizerConfig: Partial<VirtualizerOptions<HTMLDivElement, Element>> = useMemo(() => ({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: typeof rowHeight === 'function' ? rowHeight : () => rowHeight as number,
        overscan: activeOverscan,
        scrollMargin,
        scrollPaddingStart,
        scrollPaddingEnd,
        rangeExtractor: enhancedRangeExtractor,
        scrollToFn,
        lanugageDirection: languageDirection, // TanStack Virtual v3 uses this specific (misspelled) property
        // Only track scroll state, don't interfere with scroll position
        onChange: (instance: Virtualizer<HTMLDivElement, Element>) => {
            const offset = instance.scrollOffset ?? 0;

            // Debounce onScroll callback to prevent excessive calls
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                onScroll?.(offset);
            }, 16); // ~60fps

            // Track scrolling state with debounce
            if (instance.isScrolling) {
                if (!isScrollingRef.current) {
                    isScrollingRef.current = true;
                    onScrollStart?.();
                }
            } else {
                if (isScrollingRef.current) {
                    isScrollingRef.current = false;
                    onScrollStop?.();
                }
            }
        }
    }), [
        rowCount,
        rowHeight,
        activeOverscan,
        adaptiveSizing,
        scrollMargin,
        scrollPaddingStart,
        scrollPaddingEnd,
        enhancedRangeExtractor,
        scrollToFn,
        onScroll,
        onScrollStart,
        onScrollStop
    ]);

    // Row virtualizer
    const rowVirtualizer = useVirtualizer(rowVirtualizerConfig as VirtualizerOptions<HTMLDivElement, Element>);

    useEffect(() => {
        if (debug) {
            console.log('[DEBUG_VIRTUAL] Virtualizer instance changed');
        }
    }, [rowVirtualizer, debug]);

    // Virtualization Service integration
    const virtualizationService = useMemo(() => getOrRegisterService(
        globalServiceRegistry,
        'VirtualizationService',
        () => new VirtualizationService()
    ) as VirtualizationService, []);

    useEffect(() => {
        // If an ID is provided, register the virtualizer in the service
        if (config.id && virtualizationService) {
            virtualizationService.registerVirtualizer(config.id, rowVirtualizer);
        }
    }, [config.id, rowVirtualizer, virtualizationService]);


    // Column virtualizer (optional)
    const columnVirtualizerConfig: Partial<VirtualizerOptions<HTMLDivElement, Element>> | undefined = useMemo(() => {
        if (!enableColumnVirtualization || !columnCount) {
            return undefined;
        }

        return {
            horizontal: true,
            count: columnCount,
            getScrollElement: () => parentRef.current,
            estimateSize: typeof columnWidth === 'function' ? columnWidth : () => columnWidth as number,
            overscan: activeOverscan,
            rangeExtractor: enhancedRangeExtractor,
            lanugageDirection: languageDirection
        };
    }, [enableColumnVirtualization, columnCount, columnWidth, activeOverscan, enhancedRangeExtractor]);

    const columnVirtualizer = columnVirtualizerConfig
        ? useVirtualizer(columnVirtualizerConfig as VirtualizerOptions<HTMLDivElement, Element>)
        : undefined;

    // Cleanup scroll timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Debug mode
    useEffect(() => {
        if (debug && process.env.NODE_ENV !== 'production') {
            console.log('Virtualization Debug:', {
                rowCount,
                visibleRows: rowVirtualizer.getVirtualItems().length,
                activeOverscan,
                scrollOffset: rowVirtualizer.scrollOffset
            });
        }
    }, [debug, rowCount, rowVirtualizer, activeOverscan]);

    // Scroll utilities
    const scrollToIndex = (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => {
        rowVirtualizer.scrollToIndex(index, options);
    };

    const scrollToRow = scrollToIndex;

    const scrollToColumn = columnVirtualizer
        ? (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => {
            columnVirtualizer.scrollToIndex(index, options);
        }
        : undefined;

    return {
        parentRef,
        rowVirtualizer,
        columnVirtualizer,
        scrollToIndex,
        scrollToRow,
        scrollToColumn,
        getVirtualItems: () => rowVirtualizer.getVirtualItems(),
        scrollOffset: rowVirtualizer.scrollOffset ?? 0
    };
};

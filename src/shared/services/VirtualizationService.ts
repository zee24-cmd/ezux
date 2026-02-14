import { IService } from './ServiceRegistry';
import { Virtualizer, elementScroll } from '@tanstack/virtual-core';

/**
 * Options for creating a new virtualizer instance.
 * @group Properties
 */
export interface VirtualizationOptions {
    /** Total number of items to virtualize. @group Data */
    count: number;
    /** Function to retrieve the scroll container element. @group Data */
    getScrollElement: () => Element | Window | null;
    /** Function to estimate the size of an item by index. @group Appearance */
    estimateSize: (index: number) => number;
    /** Number of items to render outside the visible range. @default 5 @group Performance */
    overscan?: number;
    /** Whether virtualization is horizontal (default is vertical). @default false @group Appearance */
    horizontal?: boolean;
}

/**
 * A central service for managing high-performance virtualization across the library.
 * 
 * Provides a standardized way to create and register TanStack virtualizers,
 * enabling coordinated scroll management and performance monitoring.
 * 
 * @group Services
 */
export class VirtualizationService implements IService {
    name = 'VirtualizationService';
    // In a real implementation, we might store multiple virtualizer instances mapped by ID
    private virtualizers = new Map<string, Virtualizer<Element | Window, Element>>();

    /**
     * Creates and registers a new virtualizer instance.
     * @param id Unique identifier for the virtualizer.
     * @param options Configuration for the virtualizer.
     * @returns The newly created virtualizer instance.
     * @group Methods
     */
    createVirtualizer(id: string, options: VirtualizationOptions): Virtualizer<Element | Window, Element> {
        const virtualizer = new Virtualizer({
            count: options.count,
            getScrollElement: options.getScrollElement,
            estimateSize: options.estimateSize,
            overscan: options.overscan ?? 5,
            horizontal: options.horizontal ?? false,
            scrollToFn: elementScroll as any,
            observeElementRect: (instance, cb) => {
                const element = instance.scrollElement;
                if (!element || element === window) return undefined;
                const observer = new ResizeObserver((entries) => {
                    cb(entries[0].contentRect);
                });
                observer.observe(element as Element);
                return () => observer.disconnect();
            },
            observeElementOffset: (instance, cb) => {
                const element = instance.scrollElement;
                if (!element) return undefined;

                const onScroll = () => {
                    if (element === window) {
                        cb(window.scrollY, true);
                    } else {
                        cb((element as Element).scrollTop, true);
                    }
                }

                element.addEventListener('scroll', onScroll, { passive: true });
                // Initial call
                if (element === window) {
                    cb(window.scrollY, false);
                } else {
                    cb((element as Element).scrollTop, false);
                }

                return () => element.removeEventListener('scroll', onScroll);
            },
        });

        this.virtualizers.set(id, virtualizer);
        return virtualizer;
    }

    /**
     * Registers an existing virtualizer instance with the service.
     * @param id Unique identifier for the virtualizer.
     * @param virtualizer The virtualizer instance to register.
     * @group Methods
     */
    registerVirtualizer(id: string, virtualizer: Virtualizer<any, any>): void {
        this.virtualizers.set(id, virtualizer as any);
    }

    /**
     * Retrieves a registered virtualizer instance by its ID.
     * @group Methods
     */
    getVirtualizer(id: string): Virtualizer<Element | Window, Element> | undefined {
        return this.virtualizers.get(id);
    }


    cleanup(): void {
        this.virtualizers.clear();
    }
}

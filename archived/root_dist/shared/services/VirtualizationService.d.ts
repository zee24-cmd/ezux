import { IService } from './ServiceRegistry';
import { Virtualizer } from '@tanstack/virtual-core';
export interface VirtualizationOptions {
    count: number;
    getScrollElement: () => Element | Window | null;
    estimateSize: (index: number) => number;
    overscan?: number;
    horizontal?: boolean;
}
export declare class VirtualizationService implements IService {
    name: string;
    private virtualizers;
    createVirtualizer(id: string, options: VirtualizationOptions): Virtualizer<Element | Window, Element>;
    getVirtualizer(id: string): Virtualizer<Element | Window, Element> | undefined;
    cleanup(): void;
}

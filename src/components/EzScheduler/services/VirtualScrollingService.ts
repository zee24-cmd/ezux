import { IService } from '../../../shared/services/ServiceRegistry';
import { BaseService } from '../../../shared/services/BaseService';

export interface VirtualScrollState {
    offsets: Record<string, { top: number; left: number }>;
}

export type ScrollDirection = 'vertical' | 'horizontal' | 'both';

/**
 * High-performance service for coordinating virtualization state across components.
 * Supports bidirectional syncing for complex layouts (Timeline, Resource Headers).
 */
export class VirtualScrollingService extends BaseService<VirtualScrollState> implements IService {
    name = 'VirtualScrollingService';
    private registrants = new Map<string, (offset: { top: number; left: number }) => void>();

    constructor() {
        super({ offsets: {} });
    }

    /**
     * Registers a callback for external scroll control
     */
    register(id: string, onUpdate: (offset: { top: number; left: number }) => void) {
        this.registrants.set(id, onUpdate);
        return () => this.registrants.delete(id);
    }

    /**
     * Updates the scroll offset and syncs with all other registrants
     * @param id The source component ID
     * @param top Vertical offset
     * @param left Horizontal offset
     * @param direction Which axis to sync (optimization)
     */
    setScrollOffset(id: string, top: number, left: number, _direction: ScrollDirection = 'both') {
        const currentState = this.getState();
        const current = currentState.offsets[id] || { top: 0, left: 0 };

        // Optimization: Don't update if values haven't changed
        if (current.top === top && current.left === left) return;

        this.setState(prev => ({
            offsets: { ...prev.offsets, [id]: { top, left } }
        }));

        // Notify other registrants to sync
        this.registrants.forEach((fn, regId) => {
            if (regId !== id) {
                // We pass the full new state, but components can choose what to apply
                fn({ top, left });
            }
        });
    }

    cleanup() {
        this.registrants.clear();
        super.cleanup();
    }
}

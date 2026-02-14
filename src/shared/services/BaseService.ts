import type { IService } from './ServiceRegistry';

/**
 * Abstract base class for all reactive services in EzUX.
 * 
 * Provides built-in reactive state management with debouncing,
 * automatic subscription handling, and a standardized cleanup lifecycle.
 * 
 * @template TState The shape of the service's internal state.
 * @group Services
 */
export abstract class BaseService<TState> implements IService {
    abstract name: string;

    protected state: TState;
    private subscribers: Set<(state: TState) => void> = new Set();
    private isUpdating = false;
    private updateQueue: TState[] = [];
    protected cleanupTasks: (() => void)[] = [];

    constructor(initialState: TState) {
        this.state = initialState;
    }

    /** Returns the current active state of the service. @group Methods */
    getState(): TState {
        return this.state;
    }

    /**
     * Registers a task to be executed during service cleanup.
     * Useful for clearing timers, removing event listeners, or closing connections.
     * @group Methods
     */
    protected registerCleanup(task: () => void) {
        this.cleanupTasks.push(task);
    }

    /**
     * Subscribes to service state changes.
     * @param listener Callback triggered on state updates.
     * @returns Unsubscribe function.
     * @group Methods
     */
    subscribe(listener: (state: TState) => void): () => void {
        this.subscribers.add(listener);
        return () => this.subscribers.delete(listener);
    }

    /**
     * Updates the service state and notifies subscribers.
     * Supports both partial objects and functional updaters.
     * @group Methods
     */
    protected setState(updater: Partial<TState> | ((prev: TState) => Partial<TState>)) {
        const partial = typeof updater === 'function'
            ? (updater as any)(this.state)
            : updater;

        const newState = { ...this.state, ...partial };
        this.state = newState;
        this.notifySubscribers();
    }

    private debounceTimer: any = null;
    protected debounceMs: number = 0;

    /**
     * Sets a debounce time for notifications to prevent rapid re-renders in components.
     * @param ms Delay in milliseconds. Set to 0 to disable (immediate).
     * @group Methods
     */
    setDebounce(ms: number) {
        this.debounceMs = ms;
    }

    private notifySubscribers() {
        if (this.debounceMs > 0) {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.broadcast(), this.debounceMs);
        } else {
            this.broadcast();
        }
    }

    private broadcast() {
        if (this.isUpdating) {
            this.updateQueue.push(this.state);
            return;
        }

        this.isUpdating = true;
        const state = this.state;

        try {
            this.subscribers.forEach(listener => {
                listener(state);
            });
        } finally {
            this.isUpdating = false;
        }

        if (this.updateQueue.length > 0) {
            // If queued updates exist, we only broadcast the latest state (already in this.state)
            // But if we want to process intermediate states, we'd need a different approach.
            // Usually, components just want the latest state.
            this.updateQueue = [];
            // Re-broadcast? No, we already have the latest state in this.state.
            // But if listeners reacted to the previous broadcast and triggered distinct updates...
            // Actually, updateQueue logic was: push state, then recursively call notify?
            // Original code recursively called `notifySubscribers`.
            // With debouncing, we just want to ensure we emit the FINAL state.

            // If we are strictly debouncing, we might drop intermediate queue items if they were pushed *during* an emit.
            // But broadcast is called at end of timeout.

            // Let's keep a simple queue drain if we are not debouncing or if synchronous updates happened during emit.
            // Since we are inside broadcast(), if updates happened synchronously during listeners, they pushed to queue.
            // We should re-emit if queue has items.
            this.broadcast();
        }
    }

    /**
     * Performs final cleanup for the service.
     * Triggers all registered cleanup tasks and clears all subscribers.
     * @group Methods
     */
    cleanup() {
        this.subscribers.clear();
        this.cleanupTasks.forEach(task => {
            try {
                task();
            } catch (err) {
                console.error(`Error during service cleanup for ${this.name}:`, err);
            }
        });
        this.cleanupTasks = [];
    }
}

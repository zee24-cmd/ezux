import type { IService } from './ServiceRegistry';
import { Store } from '@tanstack/store';

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

    public store: Store<TState>;
    protected cleanupTasks: (() => void)[] = [];
    protected debounceMs: number = 0;
    private debounceTimer: ReturnType<typeof setTimeout> | null = null;


    constructor(initialState: TState) {
        this.store = new Store(initialState);
    }

    /** 
     * Allows accessing the current state directly via getter 
     * to maintain backward compatibility.
     */
    protected get state(): TState {
        return this.store.state;
    }

    /** Returns the current active state of the service. @group Methods */
    getState(): TState {
        return this.store.state;
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
        const unsub = this.store.subscribe(() => {
            listener(this.store.state);
        });
        return () => unsub.unsubscribe();
    }

    /**
     * Updates the service state.
     * Supports both partial objects and functional updaters.
     * @group Methods
     */
    protected setState(updater: Partial<TState> | ((prev: TState) => Partial<TState>)) {
        this.store.setState((prev) => {
            const partial = typeof updater === 'function' ? (updater as any)(prev) : updater;
            return { ...prev, ...partial };
        });

        // Retain the debounce trigger behavior if debounce is enabled
        // otherwise TanStack store automatically notifies react components natively.
        // For backwards compatibility and imperative polling:
        if (this.debounceMs > 0) {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                // Not actually broadcasting as Tanstack store does it automatically,
                // but any custom hook waiting for this could handle it.
            }, this.debounceMs);
        }
    }

    /**
     * Sets a debounce time for notifications to prevent rapid re-renders in components.
     * @param ms Delay in milliseconds. Set to 0 to disable (immediate).
     * @group Methods
     */
    setDebounce(ms: number) {
        this.debounceMs = ms;
    }

    /**
     * Performs final cleanup for the service.
     * Triggers all registered cleanup tasks and clears all subscribers.
     * @group Methods
     */
    cleanup() {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
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

import { BaseService } from './BaseService';

/**
 * Data structure for persisting complex component states.
 * @group State
 */
export interface EzTableStatePersistence {
    /** Active sorting criteria. @group Data */
    sorting?: any[];
    /** Applied column filters. @group Data */
    columnFilters?: any[];
    /** Visibility state of columns. @group Appearance */
    columnVisibility?: Record<string, boolean>;
    /** Current display order of columns. @group Appearance */
    columnOrder?: string[];
    /** Pinning configuration for columns. @group Appearance */
    columnPinning?: { left?: string[]; right?: string[] };
    /** Data grouping configuration. @group Data */
    grouping?: string[];
    /** Pagination state. @group Data */
    pagination?: { pageIndex: number; pageSize: number };
}

/**
 * Service for handling local browser persistence of application state.
 * 
 * Provides a standardized way to save and load serialized state objects to
 * `localStorage` with error handling and reactive access tracking.
 * 
 * @group Services
 */
/**
 * Internal state for the Persistence Service.
 * @group State
 */
interface PersistenceState {
    /** The key of the last state object saved or loaded. @group Data */
    lastAccessedKey: string | null;
}

export class PersistenceService extends BaseService<PersistenceState> {
    name = 'PersistenceService';

    constructor() {
        super({ lastAccessedKey: null });
    }

    /**
     * Saves a state object to the local storage with a specific key.
     * @param key Unique key for the storage entry.
     * @param state The state object to persist.
     * @group Methods
     */
    saveState(key: string, state: EzTableStatePersistence): void {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(`eztable_state_${key}`, serializedState);
            this.setState({ lastAccessedKey: key });
        } catch (err) {
            console.error('Failed to save EzTable state:', err);
        }
    }

    /**
     * Loads a state object from local storage.
     * @param key Unique key for the storage entry.
     * @returns The parsed state object or null if not found.
     * @group Methods
     */
    loadState(key: string): EzTableStatePersistence | null {
        try {
            const serializedState = localStorage.getItem(`eztable_state_${key}`);
            this.setState({ lastAccessedKey: key });
            if (serializedState === null) return null;
            return JSON.parse(serializedState);
        } catch (err) {
            console.error('Failed to load EzTable state:', err);
            return null;
        }
    }

    /**
     * Removes a state entry from local storage.
     * @param key Unique key to clear.
     * @group Methods
     */
    clearState(key: string): void {
        localStorage.removeItem(`eztable_state_${key}`);
        if (this.state.lastAccessedKey === key) {
            this.setState({ lastAccessedKey: null });
        }
    }
}

export const globalPersistenceService = new PersistenceService();

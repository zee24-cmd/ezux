import { IService } from '../../../shared/services/ServiceRegistry';
import { BaseService } from '../../../shared/services/BaseService';
import { SchedulerEvent } from '../EzScheduler.types';

export interface HistoryState {
    canUndo: boolean;
    canRedo: boolean;
}

export type HistoryActionType = 'ADD_EVENT' | 'UPDATE_EVENT' | 'DELETE_EVENT' | 'BATCH_UPDATE';

export interface HistoryAction {
    type: HistoryActionType;
    previousState: SchedulerEvent[] | SchedulerEvent | null;
    newState: SchedulerEvent[] | SchedulerEvent | null;
    timestamp: number;
    description: string;
}

export class HistoryService extends BaseService<HistoryState> implements IService {
    name = 'HistoryService';

    private undoStack: HistoryAction[] = [];
    private redoStack: HistoryAction[] = [];
    private maxHistorySize = 50;

    constructor() {
        super({ canUndo: false, canRedo: false });
    }

    /**
     * Records an action for potential undo
     */
    record(action: Omit<HistoryAction, 'timestamp'>) {
        const fullAction: HistoryAction = {
            ...action,
            timestamp: Date.now()
        };

        this.undoStack.push(fullAction);
        if (this.undoStack.length > this.maxHistorySize) {
            this.undoStack.shift();
        }

        // Clear redo stack on new action
        this.redoStack = [];

        this.updateState();
    }

    undo(): HistoryAction | null {
        if (this.undoStack.length === 0) return null;

        const action = this.undoStack.pop()!;
        this.redoStack.push(action);

        this.updateState();
        return action;
    }

    redo(): HistoryAction | null {
        if (this.redoStack.length === 0) return null;

        const action = this.redoStack.pop()!;
        this.undoStack.push(action);

        this.updateState();
        return action;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
        this.updateState();
    }

    private updateState() {
        this.setState({
            canUndo: this.undoStack.length > 0,
            canRedo: this.redoStack.length > 0
        });
    }

    cleanup() {
        this.clear();
        super.cleanup();
    }
}

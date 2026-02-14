import { SchedulerEvent, Resource, ISchedulerService } from '../EzScheduler.types';

// Static Mock Database (Simulating a Backend)
const MOCK_DB = {
    events: new Map<string, SchedulerEvent>(),
    resources: new Map<string, Resource>()
};

/**
 * Service for managing scheduler data and operations.
 * @group Services
 */
export class SchedulerService implements ISchedulerService {
    name = 'SchedulerService';

    constructor(initialEvents: SchedulerEvent[] = []) {
        this.initializeWithData(initialEvents);
    }

    /**
     * Initializes the service.
     * @group Methods
     */
    async init(): Promise<void> {
        console.log('[SchedulerService] Initialized');
    }

    /**
     * Cleans up the service.
     * @group Methods
     */
    async cleanup(): Promise<void> {
        // MOCK_DB.events.clear();
        // MOCK_DB.resources.clear();
    }

    /**
     * Seeds the mock database with initial data.
     * @param events Initial events
     * @param resources Initial resources
     * @group Methods
     */
    initializeWithData(events: SchedulerEvent[], resources: Resource[] = []) {
        MOCK_DB.events.clear();
        MOCK_DB.resources.clear();

        events.forEach(event => {
            MOCK_DB.events.set(String(event.id), JSON.parse(JSON.stringify(event)));
        });
        resources.forEach(resource => {
            MOCK_DB.resources.set(String(resource.id), JSON.parse(JSON.stringify(resource)));
        });
    }

    // --- Event Operations ---

    /**
     * Retrieves events within a date range.
     * @param start Start date
     * @param end End date
     * @returns Promise resolving to an array of scheduler events
     * @group Methods
     */
    async getEvents(start?: Date, end?: Date): Promise<SchedulerEvent[]> {
        await this.simulateLatency();
        // If no range provided, return all
        if (!start || !end) {
            return Array.from(MOCK_DB.events.values());
        }
        // Filter events within range
        const events = Array.from(MOCK_DB.events.values()).filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return (
                (eventStart >= start && eventStart < end) ||
                (eventEnd > start && eventEnd <= end) ||
                (eventStart <= start && eventEnd >= end)
            );
        });
        return events.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }));
    }

    /**
     * Adds a new event to the scheduler.
     * @param event The event to add
     * @returns Promise resolving to the added event
     * @group Methods
     */
    async addEvent(event: Partial<SchedulerEvent>): Promise<SchedulerEvent> {
        await this.simulateLatency();
        const newEvent: SchedulerEvent = {
            id: event.id || Math.random().toString(36).substring(2, 9),
            title: event.title || 'Untitled Event',
            start: event.start || new Date(),
            end: event.end || new Date(new Date().getTime() + 60 * 60 * 1000),
            description: event.description,
            resourceId: event.resourceId,
            resourceIds: event.resourceIds,
            allDay: event.allDay || false,
            ...event
        } as SchedulerEvent;

        MOCK_DB.events.set(newEvent.id, newEvent);
        return newEvent;
    }

    /**
     * Updates an existing event.
     * @param event The event to update
     * @returns Promise resolving to the updated event
     * @group Methods
     */
    async updateEvent(event: SchedulerEvent): Promise<SchedulerEvent> {
        console.log('[SchedulerService] Updating event:', event.id, event.start, event.end);
        await this.simulateLatency();

        const strId = String(event.id);

        if (MOCK_DB.events.has(strId)) {
            const existing = MOCK_DB.events.get(strId);
            const updatedEvent = { ...existing, ...event, id: strId };
            MOCK_DB.events.set(strId, updatedEvent);
            console.log('[SchedulerService] Event updated in DB:', updatedEvent);
            return updatedEvent;
        } else if (MOCK_DB.events.has(event.id)) {
            // Fallback for non-string ID if mismatched
            const existing = MOCK_DB.events.get(event.id);
            const updatedEvent = { ...existing, ...event };
            MOCK_DB.events.set(event.id, updatedEvent);
            return updatedEvent;
        }

        console.error('[SchedulerService] Event not found in DB:', event.id, 'Keys:', Array.from(MOCK_DB.events.keys()));
        throw new Error(`Event with ID ${event.id} not found`);
    }

    /**
     * Deletes an event by ID.
     * @param id The ID of the event to delete
     * @returns Promise void
     * @group Methods
     */
    async deleteEvent(id: string | number): Promise<void> {
        await this.simulateLatency();
        const strId = String(id);
        if (MOCK_DB.events.has(strId)) {
            MOCK_DB.events.delete(strId);
        } else {
            // Try raw if string fails
            if (MOCK_DB.events.has(id as string)) MOCK_DB.events.delete(id as string);
        }
    }

    // --- Resource Operations ---

    /**
     * Retrieves all resources.
     * @returns Promise resolving to an array of resources
     * @group Methods
     */
    async getResources(): Promise<Resource[]> {
        await this.simulateLatency();
        return Array.from(MOCK_DB.resources.values());
    }

    /**
     * Adds a new resource.
     * @param resource The resource to add
     * @returns Promise resolving to the added resource
     * @group Methods
     */
    async addResource(resource: Resource): Promise<Resource> {
        await this.simulateLatency();
        if (!resource.id) resource.id = Math.random().toString(36).substring(2, 9);
        MOCK_DB.resources.set(resource.id, resource);
        return resource;
    }

    private simulateLatency(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 300));
    }
}

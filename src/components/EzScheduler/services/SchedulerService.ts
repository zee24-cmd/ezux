import { SchedulerEvent, Resource, ISchedulerService } from '../EzScheduler.types';

/**
 * Service for managing scheduler data and operations.
 * @group Services
 */
export class SchedulerService implements ISchedulerService {
    name = 'SchedulerService';
    private events = new Map<string, SchedulerEvent>();
    private resources = new Map<string, Resource>();

    constructor(initialEvents: SchedulerEvent[] = []) {
        this.initializeWithData(initialEvents);
    }

    /**
     * Initializes the service.
     * @group Methods
     */
    async init(): Promise<void> {
    }

    /**
     * Cleans up the service.
     * @group Methods
     */
    async cleanup(): Promise<void> {
    }

    /**
     * Seeds the mock database with initial data.
     * @param events Initial events
     * @param resources Initial resources
     * @group Methods
     */
    initializeWithData(events: SchedulerEvent[], resources: Resource[] = []) {
        this.events.clear();
        this.resources.clear();

        events.forEach(event => {
            this.events.set(String(event.id), JSON.parse(JSON.stringify(event)));
        });
        resources.forEach(resource => {
            this.resources.set(String(resource.id), JSON.parse(JSON.stringify(resource)));
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
            return Array.from(this.events.values());
        }
        // Filter events within range
        const events = Array.from(this.events.values()).filter(event => {
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

        this.events.set(String(newEvent.id), newEvent);
        return newEvent;
    }

    /**
     * Updates an existing event.
     * @param event The event to update
     * @returns Promise resolving to the updated event
     * @group Methods
     */
    async updateEvent(event: SchedulerEvent): Promise<SchedulerEvent> {
        await this.simulateLatency();

        const strId = String(event.id);

        if (this.events.has(strId)) {
            const existing = this.events.get(strId);
            const updatedEvent = { ...existing, ...event, id: strId };
            this.events.set(strId, updatedEvent);
            return updatedEvent;
        } else if (this.events.has(event.id as string)) {
            // Fallback for non-string ID if mismatched
            const existing = this.events.get(event.id as string);
            const updatedEvent = { ...existing, ...event };
            this.events.set(event.id as string, updatedEvent);
            return updatedEvent;
        }

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
        if (this.events.has(strId)) {
            this.events.delete(strId);
        } else {
            // Try raw if string fails
            if (this.events.has(id as string)) this.events.delete(id as string);
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
        return Array.from(this.resources.values());
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
        this.resources.set(String(resource.id), resource);
        return resource;
    }

    private simulateLatency(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 300));
    }
}

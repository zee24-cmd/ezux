import { IService } from '../../../shared/services/ServiceRegistry';
import { SchedulerEvent } from '../EzScheduler.types';

export interface SearchOptions {
    fields?: ('title' | 'description' | 'location')[];
    matchCase?: boolean;
}

export class SearchService implements IService {
    name = 'SearchService';

    search(events: SchedulerEvent[], query: string, options: SearchOptions = {}): SchedulerEvent[] {
        if (!query || !query.trim()) return events;

        const searchTerm = options.matchCase ? query : query.toLowerCase();
        const fields = options.fields || ['title', 'description', 'location'];

        return events.filter(event => {
            return fields.some(field => {
                const value = event[field];
                if (typeof value !== 'string') return false;

                return options.matchCase
                    ? value.includes(searchTerm)
                    : value.toLowerCase().includes(searchTerm);
            });
        });
    }

    cleanup() { }
}

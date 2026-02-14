import { IService } from '../../../shared/services/ServiceRegistry';
import { SchedulerEvent } from '../EzScheduler.types';

export class PrintService implements IService {
    name = 'PrintService';

    print(_schedulerElementId: string, _events: SchedulerEvent[]) {
        // Simple window.print() approach for now
        // In a real app, this might clone the node into an iframe or efficient print view
        window.print();
    }

    cleanup() { }
}

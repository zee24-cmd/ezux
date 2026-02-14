import { IService } from '../../../shared/services/ServiceRegistry';
import { Attendee } from '../EzScheduler.types';

export class AttendeeService implements IService {
    name = 'AttendeeService';

    constructor() { }

    /**
     * Validates attendee email format
     */
    isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Format status for display
     */
    getStatusLabel(status: Attendee['status']): string {
        switch (status) {
            case 'accepted': return 'Accepted';
            case 'declined': return 'Declined';
            case 'tentative': return 'Tentative';
            case 'needs-action': return 'Needs Action';
            default: return 'Unknown';
        }
    }

    cleanup() { }
}

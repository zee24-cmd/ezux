import { IService } from '../../../shared/services/ServiceRegistry';

export interface AuditLog {
    timestamp: Date;
    action: string;
    userId: string;
    details: any;
    tenantId?: string;
}

export class AuditService implements IService {
    name = 'AuditService';
    private logs: AuditLog[] = [];

    log(action: string, userId: string, details: any, tenantId?: string) {
        const entry: AuditLog = {
            timestamp: new Date(),
            action,
            userId,
            details,
            tenantId
        };
        this.logs.push(entry);
        if (process.env.NODE_ENV !== 'production') {
            console.log('[Audit]', entry);
        }
        // In a real app, this would flush to a backend API
    }

    getLogs(): AuditLog[] {
        return this.logs;
    }

    cleanup() {
        this.logs = [];
    }
}

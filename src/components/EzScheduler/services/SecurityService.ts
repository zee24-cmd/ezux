import { IService } from '../../../shared/services/ServiceRegistry';

export interface UserContext {
    userId: string;
    tenantId: string;
    roles: string[];
    permissions?: string[];
}

export class SecurityService implements IService {
    name = 'SecurityService';
    private currentUser: UserContext | null = null;

    setUser(user: UserContext) {
        this.currentUser = user;
    }

    getUser(): UserContext | null {
        return this.currentUser;
    }

    /**
     * Checks if the current user has permission for a specific action.
     * @param action The action to check (e.g., 'edit_event', 'delete_event').
     * @param resourceId Optional resource ID if checking specific resource access.
     */
    hasPermission(action: string, _resourceId?: string): boolean {
        if (!this.currentUser) return false;

        // Admin override
        if (this.currentUser.roles.includes('admin')) return true;

        // Basic permission check
        if (this.currentUser.permissions && this.currentUser.permissions.includes(action)) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the data belongs to the current user's tenant.
     * @param dataTenantId The tenant ID associated with the data.
     */
    validateTenant(dataTenantId: string): boolean {
        if (!this.currentUser) return false;
        // Multi-tenant isolation: data tenant must match user tenant
        return this.currentUser.tenantId === dataTenantId;
    }

    cleanup() {
        this.currentUser = null;
    }
}

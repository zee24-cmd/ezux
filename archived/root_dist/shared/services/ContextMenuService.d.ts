import { IService } from './ServiceRegistry';
export interface MenuItem {
    id: string;
    label: string;
    action: string;
    icon?: React.ReactNode;
    shortcut?: string;
    disabled?: boolean;
    isSeparator?: boolean;
    className?: string;
    onClick?: (data: any) => void;
}
export type ContextMenuProvider<T = any> = (data: T) => MenuItem[];
export declare class ContextMenuService implements IService {
    name: string;
    private providers;
    register<T>(contextId: string, provider: ContextMenuProvider<T>): () => boolean;
    getItems(contextId: string, data: any): MenuItem[];
    cleanup(): void;
}

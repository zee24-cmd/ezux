import { IService } from './ServiceRegistry';
export interface HierarchyNode {
    id: string;
    children?: string[];
    parentId?: string;
    level: number;
}
export declare class HierarchyService implements IService {
    name: string;
    private nodeMap;
    constructor();
    registerNode(node: HierarchyNode): void;
    unregisterNode(id: string): void;
    getParent(id: string): HierarchyNode | undefined;
    getChildren(id: string): HierarchyNode[];
    cleanup(): void;
}

import { IService } from './ServiceRegistry';

/**
 * Represents a node in a hierarchical data structure.
 * @group Services
 */
export interface HierarchyNode {
    /** Unique identifier for the node. @group Data */
    id: string;
    /** Array of child node IDs. @group Data */
    children?: string[];
    /** ID of the parent node. @group Data */
    parentId?: string;
    /** Depth level in the hierarchy (0-indexed). @group Data */
    level: number;
}

/**
 * Service for managing complex hierarchical relationships between data elements.
 * 
 * Provides utility methods for traversing parent-child relationships,
 * finding ancestors/descendants, and managing structural integrity of trees.
 * 
 * @group Services
 */
export class HierarchyService implements IService {
    name = 'HierarchyService';
    private nodeMap = new Map<string, HierarchyNode>();

    constructor() { }

    /** Registers a node in the hierarchy map. @group Methods */
    registerNode(node: HierarchyNode): void {
        this.nodeMap.set(node.id, node);
    }

    /** Removes a node and its structural links from the map. @group Methods */
    unregisterNode(id: string): void {
        this.nodeMap.delete(id);
    }

    /** Returns the direct parent node of a given node ID. @group Methods */
    getParent(id: string): HierarchyNode | undefined {
        const node = this.nodeMap.get(id);
        if (node && node.parentId) {
            return this.nodeMap.get(node.parentId);
        }
        return undefined;
    }

    /** Returns an array of direct child nodes for a given node ID. @group Methods */
    getChildren(id: string): HierarchyNode[] {
        const node = this.nodeMap.get(id);
        if (node && node.children) {
            return node.children
                .map((childId) => this.nodeMap.get(childId))
                .filter((n): n is HierarchyNode => !!n);
        }
        return [];
    }

    /** Returns all descendants (children, grandchildren, etc.) IDs for a node. @group Methods */
    getDescendants(id: string): string[] {
        const result: string[] = [];
        const stack = [...(this.nodeMap.get(id)?.children || [])];
        while (stack.length > 0) {
            const currentId = stack.pop()!;
            result.push(currentId);
            const node = this.nodeMap.get(currentId);
            if (node?.children) {
                stack.push(...node.children);
            }
        }
        return result;
    }

    /** Returns all ancestor (parent, grandparent, etc.) IDs for a node. @group Methods */
    getAncestors(id: string): string[] {
        const result: string[] = [];
        let currentId = this.nodeMap.get(id)?.parentId;
        while (currentId) {
            result.push(currentId);
            currentId = this.nodeMap.get(currentId)?.parentId;
        }
        return result;
    }

    /** Retrieves a specific hierarchy node by ID. @group Methods */
    getNode(id: string): HierarchyNode | undefined {
        return this.nodeMap.get(id);
    }

    cleanup(): void {
        this.nodeMap.clear();
    }
}

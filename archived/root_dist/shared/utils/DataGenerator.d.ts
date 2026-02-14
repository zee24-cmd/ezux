export interface MockTableData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive' | 'Pending';
    lastLogin: Date;
    department: string;
    salary: number;
    notes?: string;
}
export interface MockTreeNode {
    id: string;
    name: string;
    children?: MockTreeNode[];
    metadata?: any;
    isFolder?: boolean;
}
export interface MockSchedulerEvent {
    id: string;
    resourceId: string;
    title: string;
    start: Date;
    end: Date;
    type: 'meeting' | 'task' | 'holiday';
    color?: string;
}
export declare class DataGenerator {
    static generateTableData(count?: number): MockTableData[];
    static generateTreeData(depth?: number, childrenPerNode?: number): MockTreeNode[];
    static generateSchedulerEvents(count?: number): MockSchedulerEvent[];
}

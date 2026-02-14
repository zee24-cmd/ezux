import { ITreeService, TreeNode } from '../EzTreeView.types';

const MOCK_TREE_DB = new Map<string, TreeNode[]>();

// Initialize with some data if empty
const seedData = () => {
    if (MOCK_TREE_DB.has('root')) return;

    MOCK_TREE_DB.set('root', [
        { id: '1', label: 'Documents', hasChildren: true },
        { id: '2', label: 'Music', hasChildren: true },
        { id: '3', label: 'Pictures', hasChildren: true },
        { id: '4', label: 'Videos', hasChildren: false },
    ]);

    MOCK_TREE_DB.set('1', [
        { id: '1-1', label: 'Work', hasChildren: true },
        { id: '1-2', label: 'Personal', hasChildren: false },
    ]);

    MOCK_TREE_DB.set('1-1', [
        { id: '1-1-1', label: 'Project A', hasChildren: false },
        { id: '1-1-2', label: 'Project B', hasChildren: false },
    ]);

    MOCK_TREE_DB.set('2', [
        { id: '2-1', label: 'Rock', hasChildren: false },
        { id: '2-2', label: 'Pop', hasChildren: false },
    ]);
};

export class TreeService implements ITreeService {
    name = 'TreeService';

    constructor() {
        seedData();
    }

    private async simulateLatency() {
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    }

    async loadNodes(parentId?: string): Promise<TreeNode[]> {
        await this.simulateLatency();
        const key = parentId || 'root';
        return JSON.parse(JSON.stringify(MOCK_TREE_DB.get(key) || []));
    }

    async moveNode(id: string, targetParentId: string, index?: number): Promise<void> {
        await this.simulateLatency();
        // Mock implementation of move... 
        console.log(`Moving node ${id} to ${targetParentId} at index ${index}`);
    }

    async renameNode(id: string, newName: string): Promise<void> {
        await this.simulateLatency();
        // Update in all lists
        for (const [key, nodes] of MOCK_TREE_DB.entries()) {
            const node = nodes.find(n => n.id === id);
            if (node) {
                node.label = newName;
                MOCK_TREE_DB.set(key, [...nodes]);
            }
        }
    }

    async deleteNode(id: string): Promise<void> {
        await this.simulateLatency();
        for (const [key, nodes] of MOCK_TREE_DB.entries()) {
            const index = nodes.findIndex(n => n.id === id);
            if (index !== -1) {
                nodes.splice(index, 1);
                MOCK_TREE_DB.set(key, [...nodes]);
            }
        }
    }

    async addNode(parentId: string, node: Partial<TreeNode>): Promise<TreeNode> {
        await this.simulateLatency();
        const nodes = MOCK_TREE_DB.get(parentId) || [];
        const newNode: TreeNode = {
            id: `new-${Date.now()}`,
            label: 'New Node',
            hasChildren: false,
            ...node
        } as TreeNode;
        MOCK_TREE_DB.set(parentId, [...nodes, newNode]);
        return newNode;
    }
}

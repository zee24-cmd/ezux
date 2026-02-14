Shared Service,Purpose in EzTreeView
TableService (Base),"Inherits subscribers, notifySubscribers, and lifecycle methods."
ServiceEventEmitter,Publishes NODE_EXPANDED and NODE_SELECTED events.
SelectionService,Manages single and multi-node selection states.
VirtualizationService,"Calculates the visible ""window"" for 10k+ nodes."
FocusManagerService,Handles WAI-ARIA arrow-key navigation (Roving TabIndex).
export interface TreeNode extends TableRowData {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  _expanded?: boolean;
  _level: number;
  _parentId?: string;
}

export interface EzTreeViewProps<T = any> {
  data: TreeNode[];
  config: {
    dragDropEnabled: boolean;
    multiSelectEnabled: boolean;
    virtualizationThreshold: number; // e.g., 500 nodes
    collisionPolicy: 'allow' | 'prevent' | 'restricted';
    rtl: boolean;
  };
  // Shared Service Integration
  serviceRegistry?: ServiceRegistry; 
  
  // Context Menu
  // Uses contextId="tree-node" for generic actions via ContextMenuService 
  
  // Callbacks
  onNodeDrop?: (dragged: TreeNode, target: TreeNode, pos: 'inside' | 'before' | 'after') => void;
  onNodeExpand?: (node: TreeNode, expanded: boolean) => void;
}

6. Implementation Roadmap (Multi-Persona Workflow)
Phase 1: The Architect (Shared Extraction) - Completed
- [x] Identify virtualization math in ezTable and move to SharedVirtualizationService.
- [x] Implement HierarchyService in the shared folder to support both Tree and Table row-grouping.

Phase 2: The Designer (UX & Physics) - Completed
- [x] Apply Tailwind 4 Container Queries (@container) for toolbar responsiveness.
- [x] Implement RTL layout mirroring using logical properties (ps-4 for indentation).

Phase 3: The Coder (Execution) - Completed
- [x] Construct EzTreeView using the Factory Pattern to render nodes based on shared TableRowData.
- [x] Integrate React 19 `useTransition` for high-performance branch expansions.
- [x] Implement $O(1)$ navigation via `nodeIdToIndexMap` for instantaneous keyboard traversal.

Phase 4: The Tester (A11y & Performance) - Completed
- [x] Verify WAI-ARIA tree role and keyboard-only navigation.
- [x] Stress test with 20,000+ nodes using shared virtualization.
import { SharedBaseProps } from '../../shared/types/BaseProps';
import { TreeNode as SharedTreeNode } from '../../shared/types/commonTypes';
import { IService } from '../../shared/services/ServiceRegistry';

/**
 * Represents a node in the tree structure.
 * @group Models
 */
export interface TreeNode extends SharedTreeNode { }



export type EzTreeViewRef = EzTreeViewApi;

/**
 * Imperative API for EzTreeView.
 * @group Methods
 */
export interface EzTreeViewApi {
    /** Expand all nodes in the tree. @group Methods */
    expandAll: () => void;
    /** Collapse all nodes in the tree. @group Methods */
    collapseAll: () => void;
    /** Check all nodes (only in checkbox mode). @group Methods */
    checkAll: () => void;
    /** Uncheck all nodes. @group Methods */
    uncheckAll: () => void;
    /** Select a specific node by ID. @group Methods */
    selectNode: (id: string) => void;
    /** Expand or collapse a specific node. @group Methods */
    expandNode: (id: string, expand?: boolean) => void;
    /** Check or uncheck a specific node. @group Methods */
    checkNode: (id: string, check?: boolean) => void;
    /** Returns a flat list of visible nodes with their nesting level. @group Methods */
    getFlattenedNodes: () => { node: TreeNode; level: number }[];
    /** Adds new nodes to the tree at a specific target. @group Methods */
    addNodes: (nodes: TreeNode[], target?: string, index?: number) => void;
    /** Deletes nodes by their IDs. @group Methods */
    removeNodes: (ids: string[]) => void;
    /** Updates properties of an existing node. @group Methods */
    updateNode: (id: string, updates: Partial<TreeNode>) => void;
    /** Moves nodes to a new parent location. @group Methods */
    moveNodes: (ids: string[], target: string, index?: number) => void;
    /** Fetches a node object by ID. @group Methods */
    getNode: (id: string) => TreeNode | undefined;
    /** Returns the full tree data structure. @group Methods */
    getTreeData: () => TreeNode[];
    /** Scrolls and expands parents to make a node visible. @group Methods */
    ensureVisible: (id: string) => void;
    /** Switches a node into its editing state. @group Methods */
    beginEdit: (id: string) => void;
    /** Disables specified nodes. @group Methods */
    disableNodes: (ids: string[], disable?: boolean) => void;
    /** Enables specified nodes. @group Methods */
    enableNodes: (ids: string[], enable?: boolean) => void;
    /** Returns IDs of all checked nodes. @group Methods */
    getAllCheckedNodes: () => string[];
    /** Returns IDs of all disabled nodes. @group Methods */
    getDisabledNodes: () => string[];
}

/**
 * Service interface for tree data operations.
 * @group Services
 */
export interface ITreeService extends IService {
    /** Loads child nodes for a given parent (or root). @group Methods */
    loadNodes(parentId?: string): Promise<TreeNode[]>;
    /** Backend call to move a node. @group Methods */
    moveNode(id: string, targetParentId: string, index?: number): Promise<void>;
    /** Backend call to rename a node. @group Methods */
    renameNode(id: string, newName: string): Promise<void>;
    /** Backend call to delete a node. @group Methods */
    deleteNode(id: string): Promise<void>;
    /** Backend call to add a new node. @group Methods */
    addNode(parentId: string, node: Partial<TreeNode>): Promise<TreeNode>;
}

/**
 * Props for the EzTreeView component, extending shared base props.
 * @group Properties
 */
export interface EzTreeViewProps extends SharedBaseProps {
    /** The hierarchical tree data. @group Data */
    data: TreeNode[];


    /**
     * Component slots for custom rendering override.
     * @group Extensibility
     */
    slots?: {
        node?: React.ComponentType<unknown>;
        expandIcon?: React.ComponentType<unknown>;
        checkbox?: React.ComponentType<unknown>;
        dragHandle?: React.ComponentType<unknown>;
        [key: string]: React.ComponentType<unknown> | undefined;
    };

    /**
     * Props to pass to custom slots.
     * @group Extensibility
     */
    slotProps?: {
        node?: Record<string, unknown>;
        expandIcon?: Record<string, unknown>;
        checkbox?: Record<string, unknown>;
        dragHandle?: Record<string, unknown>;
        [key: string]: unknown;
    };

    /**
     * Selection mode for the tree.
     * @group Properties
     */
    selectionMode?: 'single' | 'multiple';

    /**
     * Whether to show checkboxes for tri-state selection.
     * @group Properties
     */
    showCheckboxes?: boolean;

    /**
     * Whether to enable inline label editing.
     * @group Properties
     */
    allowEditing?: boolean;

    /**
     * Search term for real-time filtering and highlighting.
     * @group Properties
     */
    searchTerm?: string;

    /** 
     * Whether to allow drag-and-drop node reordering.
     * @group Properties 
     */
    allowDragAndDrop?: boolean;
    /** 
     * Whether to allow selecting multiple nodes (if selectionMode is multiple).
     * @group Properties 
     */
    allowMultiSelection?: boolean;
    /** 
     * Whether to allow node labels to wrap to multiple lines.
     * @group Properties 
     */
    allowTextWrap?: boolean;
    /** 
     * Animation configuration for expansion/collapse.
     * @group Properties 
     */
    animation?: boolean | { expand?: boolean; collapse?: boolean };
    /** 
     * Whether to automatically check child nodes when parent is checked.
     * @group Properties 
     */
    autoCheck?: boolean;
    /** 
     * Whether to allow checking nodes that are disabled.
     * @group Properties 
     */
    checkDisabledChildren?: boolean;
    /** 
     * Whether to toggle check state when a node is clicked.
     * @group Properties 
     */
    checkOnClick?: boolean;
    /** 
     * List of IDs for nodes that should be checked (controlled mode).
     * @group Properties 
     */
    checkedNodes?: string[];
    /** 
     * List of IDs for nodes that should be expanded (controlled mode).
     * @group Properties 
     */
    expandedNodes?: string[];
    /** 
     * List of IDs for nodes that should be selected (controlled mode).
     * @group Properties 
     */
    selectedNodes?: string[];
    /** 
     * Field mapping for custom data structures.
     * @group Properties 
     */
    fields?: {
        id?: string;
        text?: string;
        children?: string;
        hasChildren?: string;
        expanded?: string;
        selected?: string;
        isChecked?: string;
        icon?: string;
        tooltip?: string;
    };
    /** 
     * Whether the full row should be navigable via keyboard.
     * @group Properties 
     */
    fullRowNavigable?: boolean;
    /** 
     * Whether the full row should be triggers selection on click.
     * @group Properties 
     */
    fullRowSelect?: boolean;
    /** 
     * Sorting order for tree nodes.
     * @group Properties 
     */
    sortOrder?: 'None' | 'Ascending' | 'Descending';

    /**
     * Callback triggered when selection changes.
     * @group Events
     */
    onSelectionChange?: (selectedIds: string[]) => void;

    /**
     * Callback triggered when check states change.
     * @group Events
     */
    onCheckedChange?: (checkedIds: string[]) => void;

    /**
     * Callback triggered when a node is expanded or collapsed.
     * @group Events
     */
    onNodeExpand?: (nodeId: string, isExpanded: boolean) => void;

    /**
     * Callback for lazy loading children.
     * @group Events
     */
    onLoadChildren?: (nodeId: string) => Promise<TreeNode[]>;

    /**
     * Callback triggered when a node is dropped during D&D.
     * @group Events
     */
    onNodeDrop?: (dragged: TreeNode, target: TreeNode, pos: 'inside' | 'before' | 'after') => void;

    /**
     * Callback triggered when a node is renamed via inline editing.
     * @group Events
     */
    onNodeRename?: (nodeId: string, newLabel: string) => void;

    /** 
     * Callback triggered when an operation fails.
     * @group Events 
     */
    onActionFailure?: (error: Error) => void;
    /** 
     * Callback triggered when the component is created.
     * @group Events 
     */
    onCreated?: () => void;
    /** 
     * Callback triggered after data is bound to the tree.
     * @group Events 
     */
    onDataBound?: () => void;
    /** 
     * Callback triggered when the data source is changed.
     * @group Events 
     */
    onDataSourceChanged?: () => void;
    /** 
     * Callback triggered when the component is destroyed.
     * @group Events 
     */
    onDestroyed?: () => void;
    /** 
     * Callback before rendering each node, allowing for custom logic.
     * @group Events 
     */
    onDrawNode?: (node: TreeNode) => void;
    /** 
     * Callback on key press within the tree.
     * @group Events 
     */
    onKeyPress?: (event: React.KeyboardEvent) => void;
    /** 
     * Callback triggered when a node is checked.
     * @group Events 
     */
    onNodeChecked?: (nodeId: string, isChecked: boolean) => void;
    /** 
     * Callback triggered before checking a node (cancellable).
     * @group Events 
     */
    onNodeChecking?: (nodeId: string, isChecked: boolean) => boolean | void;
    /** 
     * Callback triggered when a node is clicked.
     * @group Events 
     */
    onNodeClicked?: (nodeId: string) => void;
    /** 
     * Callback triggered when a node is collapsed.
     * @group Events 
     */
    onNodeCollapsed?: (nodeId: string) => void;
    /** 
     * Callback triggered before collapsing a node (cancellable).
     * @group Events 
     */
    onNodeCollapsing?: (nodeId: string) => boolean | void;
    /** 
     * Callback triggered when node dragging starts (cancellable).
     * @group Events 
     */
    onNodeDragStart?: (event: React.DragEvent | unknown) => boolean | void;
    /** 
     * Callback triggered when node dragging stops.
     * @group Events 
     */
    onNodeDragStop?: (event: React.DragEvent | unknown) => void;
    /** 
     * Callback triggered during node dragging.
     * @group Events 
     */
    onNodeDragging?: (event: React.DragEvent | unknown) => void;
    /** 
     * Callback triggered when a node is selected.
     * @group Events 
     */
    onNodeSelected?: (nodeId: string) => void;
    /** 
     * Callback triggered before selecting a node (cancellable).
     * @group Events 
     */
    onNodeSelecting?: (nodeId: string) => boolean | void;
    /** 
     * Callback triggered when a node label has been expanded.
     * @group Events 
     */
    onNodeExpanded?: (nodeId: string) => void;
    /** 
     * Callback triggered before expanding a node (cancellable).
     * @group Events 
     */
    onNodeExpanding?: (nodeId: string) => boolean | void;
    /** 
     * Callback triggered before entering node editing mode (cancellable).
     * @group Events 
     */
    onNodeEditing?: (nodeId: string) => boolean | void;

    /**
     * Reference to access the imperative API of the tree.
     * @group Properties
     */
    apiRef?: React.RefObject<EzTreeViewApi | null>;

    /** 
     * Advanced internal configuration options.
     * @group Properties 
     */
    config?: {
        dragDropEnabled?: boolean;
        multiSelectEnabled?: boolean;
        virtualizationThreshold?: number;
        collisionPolicy?: string;
        rtl?: boolean;
    };

    /** 
     * Custom data service instance for the tree.
     * @group Services 
     */
    service?: ITreeService;
    /** 
     * Name of the global service to use for data operations.
     * @group Services 
     */
    serviceName?: string;
}

import type {
  Node,
  Edge,
  EdgeProps,
  NodeProps,
  NodeTypes,
  EdgeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

// ─── Node Category Enum ─────────────────────────────────────────────────────
export type EzFlowNodeCategory = 'flow_control' | 'logic' | 'execution' | 'human' | 'structural';

// ─── Base Node Data (shared across all nodes) ───────────────────────────────
export interface EzFlowBaseNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}

// ─── Node-specific Data Interfaces ──────────────────────────────────────────
export interface StartNodeData extends EzFlowBaseNodeData {
  triggerType?: 'manual' | 'scheduled' | 'webhook';
}

export interface EndNodeData extends EzFlowBaseNodeData {
  outcome?: 'success' | 'failure' | 'cancelled';
}

export interface DecisionNodeData extends EzFlowBaseNodeData {
  condition?: string;
  branches?: Array<{ id: string; label: string; condition?: string }>;
}

export interface LoopNodeData extends EzFlowBaseNodeData {
  iteratorSource?: string;
  maxIterations?: number;
}

export interface ActionNodeData extends EzFlowBaseNodeData {
  actionType?: string;
  config?: Record<string, unknown>;
}

export interface RequestNodeData extends EzFlowBaseNodeData {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url?: string;
  headers?: Record<string, string>;
}

export interface DelayNodeData extends EzFlowBaseNodeData {
  duration?: number;
  unit?: 'seconds' | 'minutes' | 'hours' | 'days';
}

export interface ApprovalNodeData extends EzFlowBaseNodeData {
  approverRole?: string;
  escalationRole?: string;
  slaHours?: number;
}

export interface GroupNodeData extends EzFlowBaseNodeData {
  collapsed?: boolean;
}

// ─── Union of all node data types ───────────────────────────────────────────
export type EzFlowNodeData =
  | StartNodeData
  | EndNodeData
  | DecisionNodeData
  | LoopNodeData
  | ActionNodeData
  | RequestNodeData
  | DelayNodeData
  | ApprovalNodeData
  | GroupNodeData;

// ─── Custom Node Type Keys ──────────────────────────────────────────────────
export type EzFlowNodeType =
  | 'startNode'
  | 'endNode'
  | 'decisionNode'
  | 'loopNode'
  | 'actionNode'
  | 'requestNode'
  | 'delayNode'
  | 'approvalNode'
  | 'groupNode';

// ─── Toolbox / Node Library ─────────────────────────────────────────────────
export interface EzFlowNodeLibraryItem {
  type: EzFlowNodeType;
  labelKey: string;
  descriptionKey?: string;
  category: EzFlowNodeCategory;
  icon: React.ReactNode;
  defaultData?: Partial<EzFlowNodeData>;
}

export interface EzFlowNodeLibraryCategory {
  categoryKey: string;
  category: EzFlowNodeCategory;
  items: EzFlowNodeLibraryItem[];
}

export interface EzFlowToolboxProps {
  categories: EzFlowNodeLibraryCategory[];
  title?: string;
  className?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onNodeActivate?: (item: EzFlowNodeLibraryItem) => void;
}

// ─── Canvas Props ───────────────────────────────────────────────────────────
export interface EzFlowCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  onDrop?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onNodeDoubleClick?: (event: React.MouseEvent, node: Node) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
  onEdgeDelete?: (edgeId: string) => void;
  onPaneClick?: (event: React.MouseEvent) => void;
  isValidConnection?: (connection: { source: string | null; target: string | null }) => boolean;
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  showGrid?: boolean;
  fitView?: boolean;
  readOnly?: boolean;
}

// ─── Header / Control Bar ───────────────────────────────────────────────────
export type EzFlowStatus = 'draft' | 'live' | 'archived';

export interface EzFlowHeaderProps {
  title: string;
  description?: string;
  status?: EzFlowStatus;
  isDirty?: boolean;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onSave?: () => void;
  onPublish?: () => void;
  onCancel?: () => void;
  showGrid?: boolean;
  onShowGridChange?: (show: boolean) => void;
  snapToGrid?: boolean;
  onSnapToGridChange?: (snap: boolean) => void;
  className?: string;
}

// ─── Edge Props ─────────────────────────────────────────────────────────────
export type EzFlowEdgeProps = EdgeProps & {
  onDelete?: (id: string) => void;
};

// ─── Serialization ──────────────────────────────────────────────────────────
export interface EzFlowSerializedState {
  nodes: Node[];
  edges: Edge[];
  viewport?: { x: number; y: number; zoom: number };
  metadata?: {
    title?: string;
    description?: string;
    status?: EzFlowStatus;
    version?: number;
    updatedAt?: string;
    publishedAt?: string;
  };
}

export type EzWorkflowValidationSeverity = 'error' | 'warning';

export type EzWorkflowValidationCode =
  | 'missing_start'
  | 'missing_end'
  | 'missing_end_path'
  | 'orphan_node'
  | 'invalid_cycle'
  | 'missing_required_config'
  | 'missing_decision_branch';

export interface EzWorkflowValidationIssue {
  code: EzWorkflowValidationCode;
  severity: EzWorkflowValidationSeverity;
  message: string;
  nodeId?: string;
  edgeId?: string;
  field?: string;
}

export interface EzWorkflowValidationResult {
  valid: boolean;
  issues: EzWorkflowValidationIssue[];
}

export interface EzWorkflowNodeInput<TData extends EzFlowBaseNodeData = EzFlowNodeData> {
  id?: string;
  type: EzFlowNodeType | string;
  data?: Partial<TData>;
  position?: { x: number; y: number };
}

export interface EzWorkflowNodeEvent<TData extends EzFlowBaseNodeData = EzFlowNodeData> {
  node: Node<TData>;
  workflow: EzFlowSerializedState;
}

export interface EzWorkflowConnectionEvent {
  edge: Edge;
  sourceId: string;
  targetId: string;
  workflow: EzFlowSerializedState;
}

export interface EzWorkflowNodeEditorProps<TData extends EzFlowBaseNodeData = EzFlowNodeData> {
  node: Node<TData>;
  data: TData;
  onChange: (updates: Partial<TData>) => void;
  readOnly?: boolean;
  issues?: EzWorkflowValidationIssue[];
}

export interface EzWorkflowNodeRegistryItem<TData extends EzFlowBaseNodeData = EzFlowNodeData> {
  type: EzFlowNodeType | string;
  label: string;
  description?: string;
  category: EzFlowNodeCategory;
  icon?: React.ReactNode;
  component?: React.ComponentType<NodeProps<Node<TData>>>;
  defaultData: TData;
  requiredDataKeys?: readonly (keyof TData & string)[];
  validate?: (node: Node<TData>, workflow: EzFlowSerializedState) => EzWorkflowValidationIssue[];
  editor?: React.ComponentType<EzWorkflowNodeEditorProps<TData>>;
}

export type EzWorkflowNodeRegistry = Record<string, EzWorkflowNodeRegistryItem>;

export interface IWorkflowService {
  loadWorkflow(id: string): Promise<EzFlowSerializedState>;
  saveWorkflow(id: string, workflow: EzFlowSerializedState): Promise<void>;
  publishWorkflow(id: string, workflow: EzFlowSerializedState): Promise<void>;
  validateWorkflow(workflow: EzFlowSerializedState): Promise<EzWorkflowValidationResult>;
}

export interface EzWorkflowRestServiceOptions {
  baseUrl: string;
  fetcher?: typeof fetch;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
}

export interface EzWorkflowPerformanceSample {
  nodeCount: number;
  edgeCount: number;
  validateMs: number;
  valid: boolean;
  issueCount: number;
}

export interface EzWorkflowRef {
  getWorkflow(): EzFlowSerializedState;
  setWorkflow(workflow: EzFlowSerializedState): void;
  validate(): EzWorkflowValidationResult;
  addNode(node: EzWorkflowNodeInput): void;
  updateNode(id: string, updates: Partial<EzFlowNodeData>): void;
  deleteNode(id: string): void;
  connect(sourceId: string, targetId: string): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  fitView(): void;
  exportJson(): string;
  importJson(json: string): void;
}

export interface EzWorkflowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError'> {
  workflow?: EzFlowSerializedState;
  defaultWorkflow?: EzFlowSerializedState;
  workflowId?: string;
  service?: IWorkflowService;
  nodeRegistry?: EzWorkflowNodeRegistry;
  onWorkflowChange?: (workflow: EzFlowSerializedState) => void;
  onNodeAdd?: (args: EzWorkflowNodeEvent) => void;
  onNodeUpdate?: (args: EzWorkflowNodeEvent) => void;
  onNodeDelete?: (args: EzWorkflowNodeEvent) => void;
  onConnectionCreate?: (args: EzWorkflowConnectionEvent) => void;
  onValidationChange?: (result: EzWorkflowValidationResult) => void;
  onSave?: (workflow: EzFlowSerializedState) => void | Promise<void>;
  onPublish?: (workflow: EzFlowSerializedState) => void | Promise<void>;
  onError?: (error: Error, action: 'load' | 'save' | 'publish' | 'import' | 'validate') => void;
  title?: string;
  description?: string;
  status?: EzFlowStatus;
  toolboxTitle?: string;
  showHeader?: boolean;
  showToolbox?: boolean;
  showInspector?: boolean;
  showValidationPanel?: boolean;
  showActionBar?: boolean;
  autoValidate?: boolean;
  readOnly?: boolean;
  showGrid?: boolean;
  snapToGrid?: boolean;
  fitView?: boolean;
  exportFileName?: string;
  classNames?: {
    root?: string;
    header?: string;
    body?: string;
    toolbox?: string;
    canvas?: string;
    inspector?: string;
    validationPanel?: string;
    actionBar?: string;
  };
}

export type EzFlowProps = EzWorkflowProps;
export type EzFlowRef = EzWorkflowRef;

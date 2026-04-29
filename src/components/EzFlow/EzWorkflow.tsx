import React from 'react';
import {
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from '@xyflow/react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Redo2,
  RefreshCw,
  Trash2,
  Undo2,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EzFlowCanvas } from './EzFlowCanvas';
import { EzFlowHeader } from './EzFlowHeader';
import { EzFlowToolbox } from './EzFlowToolbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type {
  EzFlowBaseNodeData,
  EzFlowNodeData,
  EzFlowProps,
  EzFlowRef,
  EzFlowSerializedState,
  EzWorkflowNodeInput,
  EzWorkflowNodeRegistry,
  EzWorkflowProps,
  EzWorkflowRef,
  EzWorkflowValidationIssue,
  EzWorkflowValidationResult,
} from './EzFlow.types';
import {
  cloneWorkflow,
  createEzWorkflowNodeLibrary,
  emptyWorkflow,
  ezWorkflowDefaultNodeRegistry,
  validateEzWorkflow,
} from './EzWorkflowValidation';

export {
  createEzWorkflowNodeLibrary,
  ezWorkflowDefaultNodeRegistry,
  validateEzWorkflow,
  validateWorkflow,
} from './EzWorkflowValidation';

const asString = (value: unknown) => (value === undefined || value === null ? '' : String(value));

const parseHeaders = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((headers, line) => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) headers[key.trim()] = rest.join(':').trim();
      return headers;
    }, {});

const formatHeaders = (headers: unknown) =>
  headers && typeof headers === 'object'
    ? Object.entries(headers as Record<string, string>).map(([key, value]) => `${key}: ${value}`).join('\n')
    : '';

const NodeInspector = ({
  node,
  registry,
  issues,
  readOnly,
  onChange,
  onDelete,
  onClose,
  className,
}: {
  node?: Node;
  registry: EzWorkflowNodeRegistry;
  issues: EzWorkflowValidationIssue[];
  readOnly?: boolean;
  onChange: (updates: Partial<EzFlowNodeData>) => void;
  onDelete: () => void;
  onClose: () => void;
  className?: string;
}) => {
  if (!node) {
    return (
      <aside className={cn('w-80 border-l border-border bg-card/35 p-4', className)} aria-label="Workflow inspector">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Inspector</div>
        <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          Select a node to edit its configuration.
        </div>
      </aside>
    );
  }

  const registryItem = registry[String(node.type ?? '')];
  const data = node.data as EzFlowNodeData;
  const Editor = registryItem?.editor;

  const field = (
    label: string,
    control: React.ReactNode,
    issueField?: string
  ) => {
    const hasIssue = issueField ? issues.some((issue) => issue.field === issueField) : false;
    return (
      <label className="grid gap-1.5">
        <span className={cn('text-[11px] font-semibold uppercase tracking-wide text-muted-foreground', hasIssue && 'text-destructive')}>
          {label}
        </span>
        {control}
      </label>
    );
  };

  const update = (updates: Partial<EzFlowNodeData>) => onChange(updates);

  const renderTypeFields = () => {
    if (Editor) {
      return <Editor node={node as Node<EzFlowBaseNodeData>} data={data} onChange={update as (updates: Partial<EzFlowBaseNodeData>) => void} readOnly={readOnly} issues={issues} />;
    }

    switch (node.type) {
      case 'startNode':
        return field(
          'Trigger',
          <Select value={asString('triggerType' in data ? data.triggerType : 'manual')} onValueChange={readOnly ? undefined : (value) => update({ triggerType: value as 'manual' | 'scheduled' | 'webhook' })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'endNode':
        return field(
          'Outcome',
          <Select value={asString('outcome' in data ? data.outcome : 'success')} onValueChange={readOnly ? undefined : (value) => update({ outcome: value as 'success' | 'failure' | 'cancelled' })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'decisionNode':
        return (
          <>
            {field('Condition', <Textarea value={asString('condition' in data ? data.condition : '')} onChange={(event) => update({ condition: event.target.value })} disabled={readOnly} />)}
            {field(
              'Branches',
              <Textarea
                value={('branches' in data && Array.isArray(data.branches) ? data.branches : []).map((branch) => branch.label).join('\n')}
                onChange={(event) => update({ branches: event.target.value.split('\n').filter(Boolean).map((label, index) => ({ id: `branch-${index + 1}`, label })) })}
                disabled={readOnly}
              />,
              'branches'
            )}
          </>
        );
      case 'loopNode':
        return (
          <>
            {field('Iterator source', <Input value={asString('iteratorSource' in data ? data.iteratorSource : '')} onChange={(event) => update({ iteratorSource: event.target.value })} disabled={readOnly} />, 'iteratorSource')}
            {field('Max iterations', <Input type="number" min={1} value={asString('maxIterations' in data ? data.maxIterations : 10)} onChange={(event) => update({ maxIterations: Number(event.target.value) })} disabled={readOnly} />)}
          </>
        );
      case 'actionNode':
        return field('Action type', <Input value={asString('actionType' in data ? data.actionType : '')} onChange={(event) => update({ actionType: event.target.value })} disabled={readOnly} />, 'actionType');
      case 'requestNode':
        return (
          <>
            {field(
              'Method',
              <Select value={asString('method' in data ? data.method : 'GET')} onValueChange={readOnly ? undefined : (value) => update({ method: value as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            )}
            {field('URL', <Input value={asString('url' in data ? data.url : '')} onChange={(event) => update({ url: event.target.value })} disabled={readOnly} />, 'url')}
            {field('Headers', <Textarea value={formatHeaders('headers' in data ? data.headers : undefined)} onChange={(event) => update({ headers: parseHeaders(event.target.value) })} disabled={readOnly} />)}
          </>
        );
      case 'delayNode':
        return (
          <>
            {field('Duration', <Input type="number" min={1} value={asString('duration' in data ? data.duration : 1)} onChange={(event) => update({ duration: Number(event.target.value) })} disabled={readOnly} />, 'duration')}
            {field(
              'Unit',
              <Select value={asString('unit' in data ? data.unit : 'hours')} onValueChange={readOnly ? undefined : (value) => update({ unit: value as 'seconds' | 'minutes' | 'hours' | 'days' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            )}
          </>
        );
      case 'approvalNode':
        return (
          <>
            {field('Approver role', <Input value={asString('approverRole' in data ? data.approverRole : '')} onChange={(event) => update({ approverRole: event.target.value })} disabled={readOnly} />, 'approverRole')}
            {field('Escalation role', <Input value={asString('escalationRole' in data ? data.escalationRole : '')} onChange={(event) => update({ escalationRole: event.target.value })} disabled={readOnly} />)}
            {field('SLA hours', <Input type="number" min={1} value={asString('slaHours' in data ? data.slaHours : '')} onChange={(event) => update({ slaHours: Number(event.target.value) })} disabled={readOnly} />)}
          </>
        );
      default:
        return field('Description', <Textarea value={asString(data.description)} onChange={(event) => update({ description: event.target.value })} disabled={readOnly} />);
    }
  };

  return (
    <aside className={cn('w-80 border-l border-border bg-card/35 p-4 overflow-y-auto', className)} aria-label="Workflow inspector">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Inspector</div>
          <div className="truncate text-sm font-semibold">{registryItem?.label ?? node.type ?? 'Node'}</div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close inspector">
          <X size={16} />
        </Button>
      </div>
      <div className="mt-4 grid gap-4">
        {field('Label', <Input value={asString(data.label)} onChange={(event) => update({ label: event.target.value })} disabled={readOnly} />, 'label')}
        {field('Description', <Textarea value={asString(data.description)} onChange={(event) => update({ description: event.target.value })} disabled={readOnly} />)}
        {renderTypeFields()}
      </div>
      {issues.length > 0 && (
        <div className="mt-4 grid gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          {issues.map((issue, index) => (
            <div key={`${issue.code}-${index}`} className="flex gap-2 text-xs text-destructive">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}
      {!readOnly && (
        <Button variant="destructive" className="mt-4 w-full gap-2" onClick={onDelete}>
          <Trash2 size={14} />
          Delete node
        </Button>
      )}
    </aside>
  );
};

const EzWorkflowInner = React.forwardRef<EzWorkflowRef, EzWorkflowProps>((props, ref) => {
  const {
    workflow,
    defaultWorkflow = emptyWorkflow,
    workflowId,
    service,
    nodeRegistry,
    onWorkflowChange,
    onNodeAdd,
    onNodeUpdate,
    onNodeDelete,
    onConnectionCreate,
    onValidationChange,
    onSave,
    onPublish,
    onError,
    title,
    description,
    status,
    toolboxTitle = 'Node Library',
    showHeader = true,
    showToolbox = true,
    showInspector = true,
    showValidationPanel = true,
    showActionBar = true,
    autoValidate = true,
    readOnly = false,
    showGrid: showGridProp = true,
    snapToGrid: snapToGridProp = true,
    fitView = true,
    exportFileName = 'workflow.json',
    className,
    classNames,
    ...htmlProps
  } = props;

  const mergedRegistry = React.useMemo<EzWorkflowNodeRegistry>(
    () => ({ ...ezWorkflowDefaultNodeRegistry, ...nodeRegistry }),
    [nodeRegistry]
  );
  const nodeTypes = React.useMemo<NodeTypes>(() => {
    const types: NodeTypes = {};
    Object.values(mergedRegistry).forEach((item) => {
      if (item.component) types[item.type] = item.component;
    });
    return types;
  }, [mergedRegistry]);
  const categories = React.useMemo(() => createEzWorkflowNodeLibrary(mergedRegistry), [mergedRegistry]);
  const controlled = workflow !== undefined;
  const [internalWorkflow, setInternalWorkflow] = React.useState(() => cloneWorkflow(defaultWorkflow));
  const [showGrid, setShowGrid] = React.useState(showGridProp);
  const [snapToGrid, setSnapToGrid] = React.useState(snapToGridProp);
  const [toolboxCollapsed, setToolboxCollapsed] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [validationResult, setValidationResult] = React.useState<EzWorkflowValidationResult>(() => validateEzWorkflow(workflow ?? internalWorkflow, mergedRegistry));
  const [isLoadingWorkflow, setIsLoadingWorkflow] = React.useState(false);
  const [isSavingWorkflow, setIsSavingWorkflow] = React.useState(false);
  const [isPublishingWorkflow, setIsPublishingWorkflow] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | undefined>(undefined);
  const [workflowError, setWorkflowError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const workflowRef = React.useRef<EzFlowSerializedState>(workflow ?? internalWorkflow);
  const historyRef = React.useRef<EzFlowSerializedState[]>([]);
  const futureRef = React.useRef<EzFlowSerializedState[]>([]);
  const { fitView: fitReactFlowView, screenToFlowPosition } = useReactFlow();
  const currentWorkflow = workflow ?? internalWorkflow;

  React.useEffect(() => {
    workflowRef.current = currentWorkflow;
  }, [currentWorkflow]);

  React.useEffect(() => setShowGrid(showGridProp), [showGridProp]);
  React.useEffect(() => setSnapToGrid(snapToGridProp), [snapToGridProp]);

  const validateCurrent = React.useCallback(
    (nextWorkflow: EzFlowSerializedState = workflowRef.current) => validateEzWorkflow(nextWorkflow, mergedRegistry),
    [mergedRegistry]
  );

  const emitWorkflow = React.useCallback(
    (next: EzFlowSerializedState, track = true) => {
      const normalized = cloneWorkflow({
        ...next,
        metadata: { ...next.metadata, updatedAt: new Date().toISOString() },
      });

      if (track) {
        historyRef.current = [...historyRef.current, cloneWorkflow(workflowRef.current)];
        futureRef.current = [];
      }
      workflowRef.current = normalized;
      if (!controlled) setInternalWorkflow(normalized);
      onWorkflowChange?.(normalized);
      if (autoValidate) {
        const result = validateCurrent(normalized);
        setValidationResult(result);
        onValidationChange?.(result);
      }
    },
    [autoValidate, controlled, onValidationChange, onWorkflowChange, validateCurrent]
  );

  const addNode = React.useCallback(
    (input: EzWorkflowNodeInput) => {
      const registryItem = mergedRegistry[String(input.type)];
      const node: Node = {
        id: input.id ?? `${input.type}-${Date.now()}`,
        type: input.type,
        position: input.position ?? { x: 120, y: 120 },
        data: {
          ...(registryItem?.defaultData ?? { label: input.type }),
          ...(input.data ?? {}),
        } as EzFlowNodeData,
      };
      const next = { ...workflowRef.current, nodes: [...workflowRef.current.nodes, node] };
      emitWorkflow(next);
      onNodeAdd?.({ node: node as Node<EzFlowNodeData>, workflow: cloneWorkflow(next) });
    },
    [emitWorkflow, mergedRegistry, onNodeAdd]
  );

  const updateNode = React.useCallback(
    (id: string, updates: Partial<EzFlowNodeData>) => {
      let updatedNode: Node | undefined;
      const nodes = workflowRef.current.nodes.map((node) => {
        if (node.id !== id) return node;
        updatedNode = { ...node, data: { ...node.data, ...updates } };
        return updatedNode;
      });
      if (!updatedNode) return;
      const next = { ...workflowRef.current, nodes };
      emitWorkflow(next);
      onNodeUpdate?.({ node: updatedNode as Node<EzFlowNodeData>, workflow: cloneWorkflow(next) });
    },
    [emitWorkflow, onNodeUpdate]
  );

  const deleteNode = React.useCallback(
    (id: string) => {
      const deleted = workflowRef.current.nodes.find((node) => node.id === id);
      if (!deleted) return;
      const next = {
        ...workflowRef.current,
        nodes: workflowRef.current.nodes.filter((node) => node.id !== id),
        edges: workflowRef.current.edges.filter((edge) => edge.source !== id && edge.target !== id),
      };
      setSelectedNodeId((current) => (current === id ? null : current));
      emitWorkflow(next);
      onNodeDelete?.({ node: deleted as Node<EzFlowNodeData>, workflow: cloneWorkflow(next) });
    },
    [emitWorkflow, onNodeDelete]
  );

  const connect = React.useCallback(
    (sourceId: string, targetId: string) => {
      const edge: Edge = { id: `${sourceId}-${targetId}-${Date.now()}`, source: sourceId, target: targetId, type: 'ezEdge', animated: true };
      const next = { ...workflowRef.current, edges: addEdge(edge, workflowRef.current.edges) };
      emitWorkflow(next);
      onConnectionCreate?.({ edge, sourceId, targetId, workflow: cloneWorkflow(next) });
    },
    [emitWorkflow, onConnectionCreate]
  );

  React.useEffect(() => {
    if (!service || !workflowId || controlled) return;
    let active = true;
    setIsLoadingWorkflow(true);
    setWorkflowError(null);
    service.loadWorkflow(workflowId).then((loaded) => {
      if (active) emitWorkflow(loaded, false);
    }).catch((error: Error) => {
      if (!active) return;
      setWorkflowError(error.message);
      onError?.(error, 'load');
    }).finally(() => {
      if (active) setIsLoadingWorkflow(false);
    });
    return () => {
      active = false;
    };
  }, [controlled, emitWorkflow, onError, service, workflowId]);

  React.useEffect(() => {
    const result = validateCurrent(currentWorkflow);
    setValidationResult(result);
    onValidationChange?.(result);
  }, [currentWorkflow, onValidationChange, validateCurrent]);

  React.useImperativeHandle(
    ref,
    () => ({
      getWorkflow: () => cloneWorkflow(workflowRef.current),
      setWorkflow: (next) => emitWorkflow(next),
      validate: () => validateCurrent(),
      addNode,
      updateNode,
      deleteNode,
      connect,
      undo: () => {
        const previous = historyRef.current[historyRef.current.length - 1];
        if (!previous) return;
        historyRef.current = historyRef.current.slice(0, -1);
        futureRef.current = [cloneWorkflow(workflowRef.current), ...futureRef.current];
        emitWorkflow(previous, false);
      },
      redo: () => {
        const next = futureRef.current[0];
        if (!next) return;
        futureRef.current = futureRef.current.slice(1);
        historyRef.current = [...historyRef.current, cloneWorkflow(workflowRef.current)];
        emitWorkflow(next, false);
      },
      canUndo: () => historyRef.current.length > 0,
      canRedo: () => futureRef.current.length > 0,
      fitView: () => fitReactFlowView(),
      exportJson: () => JSON.stringify(workflowRef.current, null, 2),
      importJson: (json) => {
        try {
          emitWorkflow(JSON.parse(json) as EzFlowSerializedState);
          setWorkflowError(null);
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Invalid workflow JSON.');
          setWorkflowError(err.message);
          onError?.(err, 'import');
        }
      },
    }),
    [addNode, connect, deleteNode, emitWorkflow, fitReactFlowView, onError, updateNode, validateCurrent]
  );

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => {
      const nextNodes = applyNodeChanges(changes, workflowRef.current.nodes);
      emitWorkflow({ ...workflowRef.current, nodes: nextNodes });
    },
    [emitWorkflow]
  );

  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) => {
      emitWorkflow({ ...workflowRef.current, edges: applyEdgeChanges(changes, workflowRef.current.edges) });
    },
    [emitWorkflow]
  );

  const deleteEdge = React.useCallback(
    (id: string) => {
      emitWorkflow({ ...workflowRef.current, edges: workflowRef.current.edges.filter((edge) => edge.id !== id) });
    },
    [emitWorkflow]
  );

  const onConnect = React.useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) connect(connection.source, connection.target);
    },
    [connect]
  );

  const onDrop = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') || event.dataTransfer.getData('text/plain');
      if (!type) return;
      addNode({ type, position: screenToFlowPosition({ x: event.clientX, y: event.clientY }) });
    },
    [addNode, screenToFlowPosition]
  );

  const saveWorkflow = React.useCallback(async () => {
    const next = cloneWorkflow(workflowRef.current);
    const result = validateCurrent(next);
    setValidationResult(result);
    onValidationChange?.(result);
    if (!result.valid) return;

    setIsSavingWorkflow(true);
    setWorkflowError(null);
    try {
      if (service && workflowId) await service.saveWorkflow(workflowId, next);
      await onSave?.(next);
      setLastSavedAt(new Date().toISOString());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to save workflow.');
      setWorkflowError(err.message);
      onError?.(err, 'save');
    } finally {
      setIsSavingWorkflow(false);
    }
  }, [onError, onSave, onValidationChange, service, validateCurrent, workflowId]);

  const publishWorkflow = React.useCallback(async () => {
    const next = cloneWorkflow({
      ...workflowRef.current,
      metadata: { ...workflowRef.current.metadata, status: 'live', publishedAt: new Date().toISOString() },
    });
    const result = validateCurrent(next);
    setValidationResult(result);
    onValidationChange?.(result);
    if (!result.valid) return;

    setIsPublishingWorkflow(true);
    setWorkflowError(null);
    try {
      if (service && workflowId) await service.publishWorkflow(workflowId, next);
      await onPublish?.(next);
      emitWorkflow(next, false);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to publish workflow.');
      setWorkflowError(err.message);
      onError?.(err, 'publish');
    } finally {
      setIsPublishingWorkflow(false);
    }
  }, [emitWorkflow, onError, onPublish, onValidationChange, service, validateCurrent, workflowId]);

  const runValidation = React.useCallback(() => {
    try {
      const result = validateCurrent();
      setValidationResult(result);
      onValidationChange?.(result);
      setWorkflowError(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to validate workflow.');
      setWorkflowError(err.message);
      onError?.(err, 'validate');
    }
  }, [onError, onValidationChange, validateCurrent]);

  const importWorkflowFile = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        emitWorkflow(JSON.parse(text) as EzFlowSerializedState);
        setWorkflowError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Invalid workflow JSON.');
        setWorkflowError(err.message);
        onError?.(err, 'import');
      } finally {
        event.target.value = '';
      }
    });
  }, [emitWorkflow, onError]);

  const exportWorkflowFile = React.useCallback(() => {
    const blob = new Blob([JSON.stringify(workflowRef.current, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = exportFileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [exportFileName]);

  const workflowTitle = title ?? currentWorkflow.metadata?.title ?? 'Untitled Workflow';
  const workflowDescription = description ?? currentWorkflow.metadata?.description;
  const selectedNode = selectedNodeId ? currentWorkflow.nodes.find((node) => node.id === selectedNodeId) : undefined;
  const selectedNodeIssues = selectedNodeId ? validationResult.issues.filter((issue) => issue.nodeId === selectedNodeId) : [];
  const errorCount = validationResult.issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = validationResult.issues.filter((issue) => issue.severity === 'warning').length;
  const canUndo = historyRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  return (
    <div className={cn('ez-workflow flex h-full min-h-[560px] flex-col overflow-hidden bg-background', classNames?.root, className)} {...htmlProps}>
      <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={importWorkflowFile} />
      {showHeader && (
        <EzFlowHeader
          title={workflowTitle}
          description={workflowDescription}
          status={status ?? currentWorkflow.metadata?.status}
          isDirty={historyRef.current.length > 0}
          onTitleChange={(nextTitle) => emitWorkflow({ ...workflowRef.current, metadata: { ...workflowRef.current.metadata, title: nextTitle } })}
          onDescriptionChange={(nextDescription) =>
            emitWorkflow({ ...workflowRef.current, metadata: { ...workflowRef.current.metadata, description: nextDescription } })
          }
          onSave={saveWorkflow}
          onPublish={publishWorkflow}
          showGrid={showGrid}
          onShowGridChange={setShowGrid}
          snapToGrid={snapToGrid}
          onSnapToGridChange={setSnapToGrid}
          className={classNames?.header}
        />
      )}
      <div className={cn('flex min-h-0 flex-1', classNames?.body)}>
        {showToolbox && (
          <EzFlowToolbox
            categories={categories}
            title={toolboxTitle}
            collapsed={toolboxCollapsed}
            onCollapsedChange={setToolboxCollapsed}
            onNodeActivate={(item) => addNode({ type: item.type })}
            className={classNames?.toolbox}
          />
        )}
        <EzFlowCanvas
          nodes={currentWorkflow.nodes}
          edges={currentWorkflow.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onNodeDoubleClick={(_, node) => setSelectedNodeId(node.id)}
          onEdgeDelete={deleteEdge}
          onPaneClick={() => setSelectedNodeId(null)}
          nodeTypes={nodeTypes}
          showGrid={showGrid}
          snapToGrid={snapToGrid}
          fitView={fitView}
          readOnly={readOnly}
          className={cn('flex-1', classNames?.canvas)}
        />
        {showInspector && (
          <NodeInspector
            node={selectedNode}
            registry={mergedRegistry}
            issues={selectedNodeIssues}
            readOnly={readOnly}
            onChange={(updates) => selectedNode && updateNode(selectedNode.id, updates)}
            onDelete={() => selectedNode && deleteNode(selectedNode.id)}
            onClose={() => setSelectedNodeId(null)}
            className={classNames?.inspector}
          />
        )}
      </div>
      {(showActionBar || showValidationPanel) && (
        <footer className={cn('flex min-h-14 items-center justify-between gap-3 border-t border-border bg-card/50 px-4 py-2', classNames?.actionBar)} aria-label="Workflow actions">
          <div className="flex min-w-0 items-center gap-2">
            {showActionBar && (
              <>
                <Button variant="outline" size="sm" className="gap-2" disabled={!canUndo || readOnly} onClick={() => {
                  const previous = historyRef.current[historyRef.current.length - 1];
                  if (!previous) return;
                  historyRef.current = historyRef.current.slice(0, -1);
                  futureRef.current = [cloneWorkflow(workflowRef.current), ...futureRef.current];
                  emitWorkflow(previous, false);
                }}>
                  <Undo2 size={14} />
                  Undo
                </Button>
                <Button variant="outline" size="sm" className="gap-2" disabled={!canRedo || readOnly} onClick={() => {
                  const next = futureRef.current[0];
                  if (!next) return;
                  futureRef.current = futureRef.current.slice(1);
                  historyRef.current = [...historyRef.current, cloneWorkflow(workflowRef.current)];
                  emitWorkflow(next, false);
                }}>
                  <Redo2 size={14} />
                  Redo
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={runValidation}>
                  <Wand2 size={14} />
                  Validate
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()} disabled={readOnly}>
                  <Upload size={14} />
                  Import
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={exportWorkflowFile}>
                  <Download size={14} />
                  Export
                </Button>
              </>
            )}
          </div>
          {showValidationPanel && (
            <div className={cn('flex min-w-0 items-center gap-3 text-xs', classNames?.validationPanel)}>
              {isLoadingWorkflow || isSavingWorkflow || isPublishingWorkflow ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <RefreshCw size={14} className="animate-spin" />
                  {isLoadingWorkflow ? 'Loading' : isPublishingWorkflow ? 'Publishing' : 'Saving'}
                </span>
              ) : validationResult.valid ? (
                <span className="inline-flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={14} />
                  Valid
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-destructive">
                  <AlertCircle size={14} />
                  {errorCount} error{errorCount === 1 ? '' : 's'}{warningCount > 0 ? `, ${warningCount} warning${warningCount === 1 ? '' : 's'}` : ''}
                </span>
              )}
              {lastSavedAt && <span className="hidden text-muted-foreground md:inline">Saved {new Date(lastSavedAt).toLocaleTimeString()}</span>}
              {workflowError && <span className="max-w-[320px] truncate text-destructive">{workflowError}</span>}
              {validationResult.issues.slice(0, 2).map((issue, index) => (
                <button
                  key={`${issue.code}-${issue.nodeId ?? index}`}
                  type="button"
                  className="hidden max-w-[260px] truncate rounded border border-border px-2 py-1 text-left text-muted-foreground hover:bg-muted lg:block"
                  aria-label={`Go to validation issue: ${issue.message}`}
                  onClick={() => issue.nodeId && setSelectedNodeId(issue.nodeId)}
                >
                  {issue.message}
                </button>
              ))}
            </div>
          )}
        </footer>
      )}
    </div>
  );
});

EzWorkflowInner.displayName = 'EzWorkflowInner';

export const EzWorkflow = React.forwardRef<EzWorkflowRef, EzWorkflowProps>((props, ref) => (
  <ReactFlowProvider>
    <EzWorkflowInner {...props} ref={ref} />
  </ReactFlowProvider>
));

EzWorkflow.displayName = 'EzWorkflow';

export const EzFlow = React.forwardRef<EzFlowRef, EzFlowProps>((props, ref) => <EzWorkflow {...props} ref={ref} />);

EzFlow.displayName = 'EzFlow';

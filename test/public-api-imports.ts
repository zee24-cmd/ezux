import {
  EzProvider,
  EzTable as RootEzTable,
  EzWorkflow as RootEzWorkflow,
  type EzTableProps,
  type EzWorkflowProps,
  type EzWorkflowRef,
  type SchedulerEvent,
} from 'ezux';
import { EzTable } from 'ezux/table';
import { EzScheduler } from 'ezux/scheduler';
import { EzKanban } from 'ezux/kanban';
import { EzLayout } from 'ezux/layout';
import { EzTreeView } from 'ezux/treeview';
import { EzSignature } from 'ezux/signature';
import {
  EzWorkflow,
  EzFlow,
  EzFlowCanvas,
  EzFlowToolbox,
  EzFlowHeader,
  StartNode,
  EndNode,
  EzWorkflowRestService,
  createLargeEzWorkflow,
  createLocalEzWorkflowService,
  measureEzWorkflowValidation,
  validateEzWorkflow,
  approvalWorkflowExample,
  type EzFlowSerializedState,
  type EzWorkflowNodeRegistry,
  type IWorkflowService,
  type EzWorkflowPerformanceSample,
  type EzWorkflowValidationResult,
} from 'ezux/flow';
import { Button, EzTableToolbar } from 'ezux/advanced';
import { TableService, TreeService } from 'ezux/mock-services';

type Row = {
  id: string;
  name: string;
};

const tableProps: EzTableProps<Row> = {
  data: [],
  columns: [],
};

const schedulerEvent: SchedulerEvent = {
  id: 'event-1',
  title: 'Planning',
  start: new Date('2026-01-01T09:00:00Z'),
  end: new Date('2026-01-01T10:00:00Z'),
};

const flowState: EzFlowSerializedState = {
  nodes: [],
  edges: [],
};

const flowProps: EzWorkflowProps = {
  defaultWorkflow: flowState,
  onWorkflowChange: () => undefined,
};

const flowRegistry: EzWorkflowNodeRegistry = {};
const flowService: IWorkflowService = createLocalEzWorkflowService({ flowState });
const flowValidation: EzWorkflowValidationResult = validateEzWorkflow(approvalWorkflowExample);
const flowPerfSample: EzWorkflowPerformanceSample = measureEzWorkflowValidation(100);
const flowRef = null as EzWorkflowRef | null;
const restService = new EzWorkflowRestService({ baseUrl: 'https://example.com' });

const publicComponents = {
  EzProvider,
  RootEzTable,
  EzTable,
  EzScheduler,
  EzKanban,
  EzLayout,
  EzTreeView,
  EzSignature,
  RootEzWorkflow,
  EzWorkflow,
  EzFlow,
  EzFlowCanvas,
  EzFlowToolbox,
  EzFlowHeader,
  StartNode,
  EndNode,
  Button,
  EzTableToolbar,
};

void tableProps;
void schedulerEvent;
void flowState;
void flowProps;
void flowRegistry;
void flowService;
void flowValidation;
void flowPerfSample;
void flowRef;
void restService;
void TableService;
void TreeService;
void createLargeEzWorkflow;
void publicComponents;

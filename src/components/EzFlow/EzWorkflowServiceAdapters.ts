import { validateEzWorkflow } from './EzWorkflow';
import type {
  EzFlowSerializedState,
  EzWorkflowRestServiceOptions,
  EzWorkflowValidationResult,
  IWorkflowService,
} from './EzFlow.types';

const workflowHeaders = async (headers?: EzWorkflowRestServiceOptions['headers']): Promise<HeadersInit> => {
  const resolved = typeof headers === 'function' ? await headers() : headers;
  return {
    'content-type': 'application/json',
    ...(resolved ?? {}),
  };
};

const assertOk = async (response: Response, action: string) => {
  if (response.ok) return;
  const message = await response.text().catch(() => '');
  throw new Error(message || `Workflow ${action} failed with ${response.status}.`);
};

export class EzWorkflowRestService implements IWorkflowService {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly headers?: EzWorkflowRestServiceOptions['headers'];

  constructor(options: EzWorkflowRestServiceOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.fetcher = options.fetcher ?? fetch;
    this.headers = options.headers;
  }

  async loadWorkflow(id: string): Promise<EzFlowSerializedState> {
    const response = await this.fetcher(`${this.baseUrl}/workflows/${encodeURIComponent(id)}`);
    await assertOk(response, 'load');
    return response.json() as Promise<EzFlowSerializedState>;
  }

  async saveWorkflow(id: string, workflow: EzFlowSerializedState): Promise<void> {
    const response = await this.fetcher(`${this.baseUrl}/workflows/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: await workflowHeaders(this.headers),
      body: JSON.stringify(workflow),
    });
    await assertOk(response, 'save');
  }

  async publishWorkflow(id: string, workflow: EzFlowSerializedState): Promise<void> {
    const response = await this.fetcher(`${this.baseUrl}/workflows/${encodeURIComponent(id)}/publish`, {
      method: 'POST',
      headers: await workflowHeaders(this.headers),
      body: JSON.stringify(workflow),
    });
    await assertOk(response, 'publish');
  }

  async validateWorkflow(workflow: EzFlowSerializedState): Promise<EzWorkflowValidationResult> {
    const response = await this.fetcher(`${this.baseUrl}/workflows/validate`, {
      method: 'POST',
      headers: await workflowHeaders(this.headers),
      body: JSON.stringify(workflow),
    });
    await assertOk(response, 'validate');
    return response.json() as Promise<EzWorkflowValidationResult>;
  }
}

export class EzWorkflowOptimisticService implements IWorkflowService {
  private lastStableWorkflow?: EzFlowSerializedState;

  constructor(private readonly service: IWorkflowService) {}

  getRollbackWorkflow() {
    return this.lastStableWorkflow;
  }

  async loadWorkflow(id: string): Promise<EzFlowSerializedState> {
    const workflow = await this.service.loadWorkflow(id);
    this.lastStableWorkflow = workflow;
    return workflow;
  }

  async saveWorkflow(id: string, workflow: EzFlowSerializedState): Promise<void> {
    const previous = this.lastStableWorkflow;
    this.lastStableWorkflow = workflow;
    try {
      await this.service.saveWorkflow(id, workflow);
    } catch (error) {
      this.lastStableWorkflow = previous;
      throw error;
    }
  }

  async publishWorkflow(id: string, workflow: EzFlowSerializedState): Promise<void> {
    const previous = this.lastStableWorkflow;
    this.lastStableWorkflow = workflow;
    try {
      await this.service.publishWorkflow(id, workflow);
    } catch (error) {
      this.lastStableWorkflow = previous;
      throw error;
    }
  }

  validateWorkflow(workflow: EzFlowSerializedState): Promise<EzWorkflowValidationResult> {
    return this.service.validateWorkflow(workflow);
  }
}

export const createLocalEzWorkflowService = (
  initial: Record<string, EzFlowSerializedState> = {}
): IWorkflowService & { workflows: Map<string, EzFlowSerializedState> } => {
  const workflows = new Map(Object.entries(initial));

  return {
    workflows,
    async loadWorkflow(id) {
      const workflow = workflows.get(id);
      if (!workflow) throw new Error(`Workflow ${id} was not found.`);
      return workflow;
    },
    async saveWorkflow(id, workflow) {
      workflows.set(id, workflow);
    },
    async publishWorkflow(id, workflow) {
      workflows.set(id, {
        ...workflow,
        metadata: { ...workflow.metadata, status: 'live', publishedAt: workflow.metadata?.publishedAt ?? new Date().toISOString() },
      });
    },
    async validateWorkflow(workflow) {
      return validateEzWorkflow(workflow);
    },
  };
};

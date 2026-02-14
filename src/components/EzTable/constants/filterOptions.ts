export const FILTER_OPERATORS = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'gt', label: '>' },
    { value: 'lt', label: '<' },
    { value: 'gte', label: '>=' },
    { value: 'lte', label: '<=' },
    { value: 'between', label: 'Between' },
    { value: 'empty', label: 'Is Empty' },
    { value: 'notEmpty', label: 'Not Empty' },
    { value: 'doesNotContain', label: 'Does Not Contain' },
    { value: 'doesNotEqual', label: 'Does Not Equal' },
    { value: 'notEquals', label: 'Not Equal' },
    { value: 'shouldContain', label: 'Should Contain' }
] as const;

export const FILTER_OPERATORS_MAP = new Map(
    FILTER_OPERATORS.map(op => [op.value, op.label])
);

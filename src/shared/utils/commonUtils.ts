import { TreeNode, FilterGroup, FilterRule } from '../types/commonTypes';
import { validateRequired as vReq } from './validationUtils';
import * as formatters from './formatUtils';

/**
 * Data Transformation Utilities
 */
export function transformData<T>(data: any[], transformFn: (item: any) => T): T[] {
    return data.map(transformFn);
}

/**
 * Validation Utilities
 */
export const validateRequired = vReq;

/**
 * Formatting Utilities
 */
export const currencyFormatter = formatters.currencyFormatter;
export const numberFormatter = formatters.numberFormatter;
export const percentFormatter = formatters.percentFormatter;
export const formatNumber = formatters.formatNumber;
export const formatDate = formatters.formatDate;





/**
 * Tree Manipulation Utilities
 */
export const findNodeById = (nodes: TreeNode[], id: string): TreeNode | undefined => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return undefined;
};

export const updateNodeInNodes = (nodes: TreeNode[], id: string, updates: Partial<TreeNode>): TreeNode[] => {
    return nodes.map(node => {
        if (node.id === id) {
            return { ...node, ...updates };
        }
        if (node.children) {
            return { ...node, children: updateNodeInNodes(node.children, id, updates) };
        }
        return node;
    });
};

/**
 * Filter Utilities
 */
export const checkRule = (rule: FilterRule, getValue: (field: string) => any): boolean => {
    const value = getValue(rule.field);
    const filterVal = rule.value;

    // Normalize for comparison
    const valStr = String(value ?? '').toLowerCase();
    const filterStr = String(filterVal ?? '').toLowerCase();
    const valNum = Number(value);
    const filterNum = Number(filterVal);

    switch (rule.operator) {
        case 'contains': return valStr.includes(filterStr);
        case 'doesNotContain': return !valStr.includes(filterStr);
        case 'equals': return valStr === filterStr;
        case 'notEquals':
        case 'doesNotEqual': return valStr !== filterStr;
        case 'startsWith': return valStr.startsWith(filterStr);
        case 'endsWith': return valStr.endsWith(filterStr);
        case 'empty': return value === null || value === undefined || value === '';
        case 'notEmpty': return !(value === null || value === undefined || value === '');

        case 'gt':
        case 'greaterThan': return !isNaN(valNum) && !isNaN(filterNum) && valNum > filterNum;
        case 'lt':
        case 'lessThan': return !isNaN(valNum) && !isNaN(filterNum) && valNum < filterNum;
        case 'gte':
        case 'greaterThanOrEqual': return !isNaN(valNum) && !isNaN(filterNum) && valNum >= filterNum;
        case 'lte':
        case 'lessThanOrEqual': return !isNaN(valNum) && !isNaN(filterNum) && valNum <= filterNum;
        case 'between': {
            if (Array.isArray(filterVal) && filterVal.length === 2) {
                const [min, max] = filterVal;
                return !isNaN(valNum) && valNum >= Number(min) && valNum <= Number(max);
            }
            return false;
        }
        case 'shouldContain': {
            if (Array.isArray(value) && Array.isArray(filterVal)) {
                return filterVal.some(v => value.includes(v));
            }
            if (Array.isArray(value)) {
                return value.includes(filterVal);
            }
            return false;
        }

        default: return true;
    }
};

export const checkGroup = (
    group: FilterGroup,
    getValue: (field: string) => any
): boolean => {
    if (!group.filters || group.filters.length === 0) return true;

    if (group.logic === 'AND') {
        return group.filters.every(item => {
            if (item.kind === 'group') return checkGroup(item, getValue);
            return checkRule(item, getValue);
        });
    } else {
        return group.filters.some(item => {
            if (item.kind === 'group') return checkGroup(item, getValue);
            return checkRule(item, getValue);
        });
    }
};

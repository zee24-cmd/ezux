import { FilterGroup, FilterRule } from '../EzTable.types';

export const isFilterGroup = (item: any): item is FilterGroup => item?.kind === 'group';
export const isFilterRule = (item: any): item is FilterRule => item?.kind === 'rule';

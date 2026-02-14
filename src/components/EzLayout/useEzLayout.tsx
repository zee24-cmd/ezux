import React from 'react';
import { renderInjected } from '../../shared/utils/renderUtils';
import { EzLayoutProps, EzLayoutRef } from './EzLayout.types';
import { useLayoutState } from './hooks/useLayoutState';
import { useLayoutImperative } from './hooks/useLayoutImperative';
import { useBaseComponent } from '../../shared/hooks/useBaseComponent';

/**
 * The orchestrator hook for the EzLayout component.
 * 
 * Consolidates base component infrastructure, specialized layout state,
 * and the imperative API.
 * 
 * @param props The EzLayout configuration props.
 * @param ref Forwarded ref for the imperative API.
 * @group Hooks
 */
export const useEzLayout = (props: EzLayoutProps, ref: React.Ref<EzLayoutRef>) => {
    // 1. Base component functionality
    const base = useBaseComponent(props);
    const { api: baseApi } = base;

    // 2. Specialized layout state
    const layout = useLayoutState(props);
    const {
        layoutState,
        i18nState,
        isPending,
        layoutService,
        serviceRegistry,
        focusManager
    } = layout;

    // 3. Imperative API
    useLayoutImperative(ref, props, { layoutService, serviceRegistry });

    return {
        ...baseApi,
        layoutState,
        i18nState,
        isPending,
        layoutService,
        serviceRegistry,
        focusManager,
        renderInjected
    };
};

import { useMemo, useState, useEffect } from 'react';
import { Resource, ResourceModel } from '../EzScheduler.types';

interface UseSchedulerResourcesProps {
    resources: Resource[] | ResourceModel[] | undefined;
}

export const useSchedulerResources = ({ resources }: UseSchedulerResourcesProps) => {
    const processedResources = useMemo(() => {
        if (!resources || resources.length === 0) return [];
        if ('dataSource' in resources[0]) {
            return (resources as ResourceModel[]).flatMap(r => r.dataSource as unknown as Resource[]);
        }
        return resources as Resource[];
    }, [resources]);

    const [internalResources, setInternalResources] = useState<Resource[]>(processedResources);

    useEffect(() => {
        setInternalResources(processedResources);
    }, [processedResources]);

    return { resources: processedResources, internalResources, setInternalResources };
};
import { useEffect, useRef, useState } from 'react';

export interface PerformanceMetrics {
    renderCount: number;
    lastRenderTime: number;
    averageRenderTime: number;
    memoryUsage?: number;
}

/**
 * Hook for monitoring component performance
 * Tracks render count, render time, and memory usage
 */
export const usePerformanceMonitor = (componentName: string) => {
    const renderCount = useRef(0);
    const renderTimes = useRef<number[]>([]);
    const lastRenderStart = useRef(performance.now());
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        renderCount: 0,
        lastRenderTime: 0,
        averageRenderTime: 0,
    });

    useEffect(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - lastRenderStart.current;

        renderCount.current += 1;
        renderTimes.current.push(renderTime);

        // Keep only last 100 render times
        if (renderTimes.current.length > 100) {
            renderTimes.current.shift();
        }

        const averageRenderTime =
            renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;

        const newMetrics: PerformanceMetrics = {
            renderCount: renderCount.current,
            lastRenderTime: renderTime,
            averageRenderTime,
        };

        // Add memory usage if available
        if ('memory' in performance && (performance as any).memory) {
            newMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // MB
        }

        setMetrics(newMetrics);

        // Log to console in development
        if (process.env.NODE_ENV === 'development' && renderCount.current % 10 === 0) {
            console.log(`[Performance] ${componentName}:`, newMetrics);
        }

        lastRenderStart.current = performance.now();
    });

    return metrics;
};

/**
 * Hook for tracking expensive computations
 */
export const useComputationTime = (label: string) => {
    const start = useRef(performance.now());

    useEffect(() => {
        return () => {
            const duration = performance.now() - start.current;
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Computation] ${label}: ${duration.toFixed(2)}ms`);
            }
        };
    }, [label]);
};

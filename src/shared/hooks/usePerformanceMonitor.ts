import { useEffect, useRef, useState } from 'react';

export interface PerformanceMetrics {
    renderCount: number;
    lastRenderTime: number;
    averageRenderTime: number;
    memoryUsage?: number;
}

export interface PerformanceMonitorOptions {
    /**
     * Publish metrics to React state on this interval.
     * Disabled by default to avoid monitor-driven render loops.
     */
    updateIntervalMs?: number;
}

const initialMetrics: PerformanceMetrics = {
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
};

/**
 * Hook for monitoring component performance
 * Tracks render count, render time, and memory usage
 */
export const usePerformanceMonitor = (
    componentName: string,
    options: PerformanceMonitorOptions = {}
) => {
    const renderCount = useRef(0);
    const renderTimes = useRef<number[]>([]);
    const metricsRef = useRef<PerformanceMetrics>(initialMetrics);
    const renderStart = performance.now();
    const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);
    const { updateIntervalMs } = options;

    useEffect(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;

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

        metricsRef.current = newMetrics;

        // Log to console in development
        if (process.env.NODE_ENV === 'development' && renderCount.current % 10 === 0) {
            console.log(`[Performance] ${componentName}:`, newMetrics);
        }
    });

    useEffect(() => {
        if (!updateIntervalMs || updateIntervalMs <= 0) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setMetrics(metricsRef.current);
        }, updateIntervalMs);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [updateIntervalMs]);

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

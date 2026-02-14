import { useEffect } from 'react';

interface UseContainerResizeOptions {
    containerRef: React.RefObject<HTMLDivElement | null>;
    containerSizeRef: React.RefObject<{ width: number; height: number }>;
    resizeTimeoutRef: React.RefObject<NodeJS.Timeout | null>;
    onResize: () => void;
}

export const useContainerResize = ({
    containerRef,
    containerSizeRef,
    resizeTimeoutRef,
    onResize
}: UseContainerResizeOptions, deps: React.DependencyList) => {
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        
        // Force the container to have a defined height
        container.style.height = '100%';
        container.style.minHeight = '0';
        container.style.height = ''; // Reset to allow flexbox to calculate

        // Debounced ResizeObserver to prevent infinite loops during scrolling
        const resizeObserver = new ResizeObserver((entries) => {
            // Clear any pending timeout
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            // Debounce the measure call
            resizeTimeoutRef.current = setTimeout(() => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    // Only trigger if size actually changed significantly
                    if (Math.abs(width - containerSizeRef.current.width) > 1 ||
                        Math.abs(height - containerSizeRef.current.height) > 1) {
                        containerSizeRef.current = { width, height };
                        // Trigger virtualizer to recalculate
                        onResize();
                    }
                }
            }, 100); // 100ms debounce
        });

        resizeObserver.observe(container);
        
        return () => {
            resizeObserver.disconnect();
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, deps);
};
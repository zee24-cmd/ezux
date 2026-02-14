import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';

// --- Progress Renderer ---

export interface ProgressCellProps {
    value: number; // 0-100
    showLabel?: boolean;
    color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const ProgressCell: React.FC<ProgressCellProps> = ({
    value,
    showLabel = true,
    color = 'default',
    size = 'md',
    className
}) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.max(0, Math.min(100, value));

    // Get color classes
    const getColorClass = () => {
        switch (color) {
            case 'success':
                return 'bg-emerald-500 dark:bg-emerald-600';
            case 'warning':
                return 'bg-amber-500 dark:bg-amber-600';
            case 'danger':
                return 'bg-rose-500 dark:bg-rose-600';
            case 'info':
                return 'bg-blue-500 dark:bg-blue-600';
            case 'default':
            default:
                return 'bg-primary';
        }
    };

    // Get size classes
    const getHeightClass = () => {
        switch (size) {
            case 'sm':
                return 'h-1.5';
            case 'lg':
                return 'h-3';
            case 'md':
            default:
                return 'h-2';
        }
    };

    return (
        <div className={cn("flex items-center gap-2 w-full", className)}>
            <div className="flex-1 bg-muted rounded-full overflow-hidden min-w-[60px]">
                <div
                    className={cn(
                        "transition-all duration-300 rounded-full",
                        getHeightClass(),
                        getColorClass()
                    )}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-xs font-medium text-muted-foreground tabular-nums min-w-[42px] text-right">
                    {clampedValue.toFixed(0)}%
                </span>
            )}
        </div>
    );
};

// --- Sparkline Renderer ---

export interface SparklineCellProps {
    value?: number[]; // renamed from values for SmartCell compatibility
    values?: number[]; // keep for backward compatibility if needed
    color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    height?: number;
    width?: number;
    showDots?: boolean;
    className?: string;
}

export const SparklineCell: React.FC<SparklineCellProps> = ({
    value,
    values: valuesProp,
    color = 'default',
    height = 32,
    width = 100,
    showDots = false,
    className
}) => {
    const values = value || valuesProp || [];
    const pathData = useMemo(() => {
        if (!values || values.length === 0) return '';

        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1; // Avoid division by zero

        const points = values.map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    }, [values, height, width]);

    const dotPoints = useMemo(() => {
        if (!values || values.length === 0 || !showDots) return [];

        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;

        return values.map((value, index) => ({
            x: (index / (values.length - 1)) * width,
            y: height - ((value - min) / range) * height,
        }));
    }, [values, height, width, showDots]);

    // Get color class
    const getStrokeColor = () => {
        switch (color) {
            case 'success':
                return 'stroke-emerald-500 dark:stroke-emerald-400';
            case 'warning':
                return 'stroke-amber-500 dark:stroke-amber-400';
            case 'danger':
                return 'stroke-rose-500 dark:stroke-rose-400';
            case 'info':
                return 'stroke-blue-500 dark:stroke-blue-400';
            case 'default':
            default:
                return 'stroke-primary';
        }
    };

    const getFillColor = () => {
        switch (color) {
            case 'success':
                return 'fill-emerald-500 dark:fill-emerald-400';
            case 'warning':
                return 'fill-amber-500 dark:fill-amber-400';
            case 'danger':
                return 'fill-rose-500 dark:fill-rose-400';
            case 'info':
                return 'fill-blue-500 dark:fill-blue-400';
            case 'default':
            default:
                return 'fill-primary';
        }
    };

    if (!values || values.length === 0) {
        return (
            <div className="text-muted-foreground text-xs italic">
                No data
            </div>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            className={cn("inline-block", className)}
            viewBox={`0 0 ${width} ${height}`}
        >
            <path
                d={pathData}
                fill="none"
                className={cn("transition-colors", getStrokeColor())}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {showDots &&
                dotPoints.map((point: any, index: number) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="2"
                        className={cn("transition-colors", getFillColor())}
                    />
                ))}
        </svg>
    );
};

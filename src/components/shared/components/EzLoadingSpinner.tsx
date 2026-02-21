import React from 'react';
import { cn } from '../../../lib/utils';

export type LoadingSpinnerVariant = 'primary' | 'secondary';

export interface EzLoadingSpinnerProps {
    variant?: LoadingSpinnerVariant;
    text?: string;
    className?: string;
}

export const EzLoadingSpinner: React.FC<EzLoadingSpinnerProps> = ({
    variant = 'primary',
    text = 'Loading',
    className
}) => {
    const baseStyles = "absolute inset-0 bg-background/40 backdrop-blur-[2px] z-[100] flex items-center justify-center transition-all duration-300";
    const spinnerSizes = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12"
    };
    const spinnerBorderColors = {
        primary: "border-primary/20 border-t-primary",
        secondary: "border-muted-foreground/20 border-t-muted-foreground"
    };

    return (
        <div className={cn(baseStyles, className)}>
            <div className="flex flex-col items-center gap-3">
                <div className={cn(
                    spinnerSizes.md,
                    spinnerBorderColors[variant],
                    "rounded-full animate-spin"
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                    {text}
                </span>
            </div>
        </div>
    );
};
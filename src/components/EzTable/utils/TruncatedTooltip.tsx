import React, { useRef, useState, useEffect } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../ui/tooltip"

interface TruncatedTooltipProps {
    children: React.ReactNode;
    text?: string;
}

export const TruncatedTooltip = ({ children, text }: TruncatedTooltipProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const checkTruncation = () => {
        if (ref.current) {
            return ref.current.scrollWidth > ref.current.clientWidth + 1; // 1px buffer
        }
        return false;
    };

    useEffect(() => {
        checkTruncation();
        // Use ResizeObserver for more reliable detection than window resize
        if (ref.current) {
            const observer = new ResizeObserver(checkTruncation);
            observer.observe(ref.current);
            return () => observer.disconnect();
        }
    }, [children, text]);

    const handleMouseEnter = () => {
        const truncated = checkTruncation();
        if (truncated) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300} open={isOpen}>
                <TooltipTrigger asChild>
                    <div
                        ref={ref}
                        className="truncate w-full cursor-default min-w-0"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-sm break-words">{text || children}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

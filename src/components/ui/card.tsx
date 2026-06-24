import * as React from "react"
import { cn } from "../../lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.Ref<HTMLDivElement>;
}

export function Card({ className, ref, ...props }: CardProps) {
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-xl border bg-card text-card-foreground shadow",
                className
            )}
            {...props}
        />
    )
}

export function CardHeader({ className, ref, ...props }: CardProps) {
    return (
        <div
            ref={ref}
            className={cn("flex flex-col space-y-1.5 p-6", className)}
            {...props}
        />
    )
}

export function CardTitle({ className, ref, ...props }: CardProps) {
    return (
        <div
            ref={ref}
            className={cn("font-semibold leading-none tracking-tight", className)}
            {...props}
        />
    )
}

export function CardDescription({ className, ref, ...props }: CardProps) {
    return (
        <div
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

export function CardContent({ className, ref, ...props }: CardProps) {
    return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
}

export function CardFooter({ className, ref, ...props }: CardProps) {
    return (
        <div
            ref={ref}
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
        />
    )
}

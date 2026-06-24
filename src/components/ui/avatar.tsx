import * as React from "react"
import { cn } from "../../lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.Ref<HTMLDivElement>;
}

export function Avatar({ className, ref, ...props }: AvatarProps) {
    return (
        <div
            ref={ref}
            className={cn(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        />
    )
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    ref?: React.Ref<HTMLImageElement>;
}

export function AvatarImage({ className, ref, ...props }: AvatarImageProps) {
    return (
        <img
            ref={ref}
            className={cn("aspect-square h-full w-full", className)}
            {...props}
        />
    )
}

export function AvatarFallback({ className, ref, ...props }: AvatarProps) {
    return (
        <div
            ref={ref}
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
                className
            )}
            {...props}
        />
    )
}

import * as React from "react"
import { cn } from "../../lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'> {
    checked?: boolean | 'indeterminate';
    onCheckedChange?: (checked: boolean | 'indeterminate') => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        const innerRef = React.useRef<HTMLInputElement>(null);

        React.useImperativeHandle(ref, () => innerRef.current!);

        React.useEffect(() => {
            if (innerRef.current) {
                innerRef.current.indeterminate = checked === 'indeterminate';
            }
        }, [checked]);

        return (
            <input
                type="checkbox"
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-zinc-200 border-zinc-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:border-zinc-800 dark:border-zinc-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900",
                    "accent-zinc-900 dark:accent-zinc-50",
                    className
                )}
                ref={innerRef}
                checked={checked === 'indeterminate' ? false : checked}
                onChange={(e) => {
                    onCheckedChange?.(e.target.checked);
                }}
                {...props}
            />
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

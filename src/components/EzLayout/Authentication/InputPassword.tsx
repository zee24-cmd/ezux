'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { cn } from '../../../lib/utils'

interface PasswordInputProps extends React.ComponentProps<"input"> {
    label?: string
    error?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, label, error, ...props }, ref) => {
        const [isVisible, setIsVisible] = React.useState(false)
        const generatedId = React.useId()
        const id = props.id ?? generatedId

        return (
            <div className="w-full space-y-2 text-left">
                {label && (
                    <Label htmlFor={id} className={cn(error && "text-destructive")}>
                        {label}
                    </Label>
                )}
                <div className="relative">
                    <Input
                        id={id}
                        type={isVisible ? 'text' : 'password'}
                        className={cn(
                            'pr-10',
                            error && "border-destructive focus-visible:ring-destructive",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsVisible((prev) => !prev)}
                        className="absolute inset-y-0 right-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground focus-visible:ring-ring/50"
                    >
                        {isVisible ? (
                            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <EyeIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                            {isVisible ? 'Hide password' : 'Show password'}
                        </span>
                    </Button>
                </div>
                {error && (
                    <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
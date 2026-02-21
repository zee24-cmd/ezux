import React, { useId, useState, useRef } from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { cn } from '../../../lib/utils';
import { PasswordInput } from './InputPassword';
import { Upload, User, Mail, Github, Facebook } from 'lucide-react';

interface SignUpFormValues {
    name: string;
    email: string;
    password: string;
}

/**
 * Props for the sign-up form.
 * @group Properties
 */
export interface SignUpFormProps {
    /** Callback triggered upon successful form validation and submission. @group Events */
    onSubmit?: (values: SignUpFormValues) => Promise<void>;
}

/**
 * Enterprise sign-up form with profile picture upload and validation.
 * @group Authentication
 */
export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
    const nameId = useId();
    const emailId = useId();
    const passwordId = useId();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
        validators: {
            onChange: () => undefined
        },
        onSubmit: async ({ value }: { value: SignUpFormValues }) => {
            if (onSubmit) {
                await onSubmit(value);
            } else if (process.env.NODE_ENV !== 'production') {
                // In development, we can log this, but in production we should avoid it
                // unless it's a dedicated logging service.
                // console.log('Sign Up Values:', value);
            }
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="w-full max-w-sm mx-auto space-y-6"
        >
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-3 tracking-tight text-zinc-900 dark:text-white">Create Account</h1>

                <div className="flex justify-center gap-4 my-4">
                    <Button type="button" variant="outline" size="icon" className="rounded-full w-10 h-10 border-border hover:bg-background-secondary dark:border-zinc-800 dark:hover:bg-zinc-900">
                        <Facebook className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="rounded-full w-10 h-10 border-border hover:bg-background-secondary dark:border-zinc-800 dark:hover:bg-zinc-900">
                        <Github className="w-4 h-4 text-zinc-900 dark:text-white" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="rounded-full w-10 h-10 border-border hover:bg-background-secondary dark:border-zinc-800 dark:hover:bg-zinc-900">
                        <span className="font-bold text-xs">G</span>
                    </Button>
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-zinc-950 px-2 text-muted-foreground">Or use email for registration</span>
                    </div>
                </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex justify-center mb-6">
                <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    aria-label="Upload Profile Picture"
                >
                    <Avatar className="w-20 h-20 border-2 border-dashed border-border/50 dark:border-zinc-700 hover:border-indigo-500 transition-colors">
                        <AvatarImage src={preview || undefined} className="object-cover" />
                        <AvatarFallback className="bg-background-secondary dark:bg-zinc-900">
                            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary/90 transition-colors" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] font-medium">Edit</span>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            <div className="space-y-4">
                {/* Name Field */}
                {/* Name Field */}
                <form.Field
                    name="name"
                    validators={{
                        onChange: ({ value }) =>
                            !value
                                ? 'Name is required'
                                : value.length < 2
                                    ? 'Name must be at least 2 characters'
                                    : undefined,
                    }}
                    children={(field) => (
                        <div className="space-y-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id={nameId}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={cn(
                                        "pl-10 bg-background-secondary dark:bg-zinc-900/50 border-border dark:border-zinc-800 h-11 focus-visible:ring-primary/20",
                                        field.state.meta.errors.length > 0 && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    placeholder="Full Name"
                                />
                            </div>
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-xs text-red-500 px-1">{field.state.meta.errors.join(', ')}</p>
                            )}
                        </div>
                    )}
                />

                {/* Email Field */}
                {/* Email Field */}
                <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) =>
                            !value
                                ? 'Email is required'
                                : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
                                    ? 'Invalid email address'
                                    : undefined,
                    }}
                    children={(field) => (
                        <div className="space-y-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id={emailId}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={cn(
                                        "pl-10 bg-background-secondary dark:bg-zinc-900/50 border-border dark:border-zinc-800 h-11 focus-visible:ring-primary/20",
                                        field.state.meta.errors.length > 0 && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    placeholder="Email Address"
                                />
                            </div>
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-xs text-red-500 px-1">{field.state.meta.errors.join(', ')}</p>
                            )}
                        </div>
                    )}
                />

                {/* Password Field */}
                {/* Password Field */}
                <form.Field
                    name="password"
                    validators={{
                        onChange: ({ value }) =>
                            !value
                                ? 'Password is required'
                                : value.length < 8
                                    ? 'Password must be at least 8 characters'
                                    : undefined,
                    }}
                    children={(field) => (
                        <div className="space-y-1">
                            <PasswordInput
                                id={passwordId}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className={cn(
                                    "bg-background-secondary dark:bg-zinc-900/50 border-border dark:border-zinc-800 h-11 focus-visible:ring-primary/20",
                                    field.state.meta.errors.length > 0 && "border-red-500 focus-visible:ring-red-500"
                                )}
                                placeholder="Password"
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-xs text-red-500 px-1">{field.state.meta.errors.join(', ')}</p>
                            )}
                        </div>
                    )}
                />
            </div>

            <Button
                type="submit"
                disabled={form.state.isSubmitting}
                className="w-full mt-6 rounded-lg h-11 bg-primary hover:bg-primary/90 text-white font-semibold uppercase tracking-wide text-xs shadow-lg shadow-primary/20 transition-all"
            >
                {form.state.isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
        </form>
    );
};

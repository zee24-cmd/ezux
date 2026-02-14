import React, { useId } from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import { PasswordInput } from './InputPassword';
import { Github, Facebook, Mail } from 'lucide-react';

interface SignInFormValues {
    email: string;
    password: string;
}

/**
 * Props for the sign-in form.
 * @group Properties
 */
export interface SignInFormProps {
    /** Callback triggered upon successful form validation and submission. @group Events */
    onSubmit?: (values: SignInFormValues) => Promise<void>;
    /** Initial values for the form fields. @group Properties */
    defaultValues?: Partial<SignInFormValues>;
}

/**
 * Enterprise sign-in form with social login support and validation.
 * @group Authentication
 */
export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, defaultValues }) => {
    const emailId = useId();
    const passwordId = useId();

    const form = useForm({
        defaultValues: {
            email: defaultValues?.email || '',
            password: defaultValues?.password || '',
        },
        validators: {
            onChange: () => undefined
        },
        onSubmit: async ({ value }: { value: SignInFormValues }) => {
            if (onSubmit) await onSubmit(value);
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="w-full max-w-sm mx-auto space-y-6"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 tracking-tight text-zinc-900 dark:text-white">Sign In</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Use your social account or email to login</p>

                <div className="flex justify-center gap-4 mt-6">
                    <Button type="button" variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                        <Facebook className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                        <Github className="w-4 h-4 text-zinc-900 dark:text-white" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                        <span className="font-bold text-xs">G</span>
                    </Button>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-400">Or use your email</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2 text-left">
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
                                        <Mail className="h-4 w-4 text-zinc-400" />
                                    </div>
                                    <Input
                                        id={emailId}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={cn(
                                            "pl-10 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-11 focus-visible:ring-indigo-500",
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
                </div>

                <div className="space-y-2 text-left">
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
                                        "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-11 focus-visible:ring-indigo-500",
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
                    <div className="flex justify-end pt-1">
                        <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={form.state.isSubmitting}
                className="w-full mt-6 rounded-lg h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold uppercase tracking-wide text-xs shadow-lg shadow-indigo-500/20 transition-all"
            >
                {form.state.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
        </form>
    );
};
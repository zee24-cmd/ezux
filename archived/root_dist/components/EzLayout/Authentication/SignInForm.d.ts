import { default as React } from 'react';
import { z } from 'zod';
declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type SignInFormValues = z.infer<typeof signInSchema>;
export interface SignInFormProps {
    onSubmit?: (values: SignInFormValues) => Promise<void>;
}
export declare const SignInForm: React.FC<SignInFormProps>;
export {};

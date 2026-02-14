import { default as React } from 'react';
import { z } from 'zod';
declare const signUpSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
export interface SignUpFormProps {
    onSubmit?: (values: SignUpFormValues) => Promise<void>;
}
export declare const SignUpForm: React.FC<SignUpFormProps>;
export {};

import * as React from 'react';
interface PasswordInputProps extends React.ComponentProps<"input"> {
    label?: string;
    error?: string;
}
declare const PasswordInput: React.ForwardRefExoticComponent<Omit<PasswordInputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export { PasswordInput };

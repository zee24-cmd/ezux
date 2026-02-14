import * as React from "react";
interface SelectProps {
    value?: any;
    onValueChange?: (value: any) => void;
    children: React.ReactNode;
}
export declare const Select: React.FC<SelectProps>;
export declare const SelectTrigger: React.FC<{
    className?: string;
    children: React.ReactNode;
}>;
export declare const SelectValue: React.FC<{
    placeholder?: string;
}>;
export declare const SelectContent: React.FC<{
    children: React.ReactNode;
}>;
export declare const SelectItem: React.FC<{
    value: any;
    children: React.ReactNode;
}>;
export {};

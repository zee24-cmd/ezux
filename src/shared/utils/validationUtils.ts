/**
 * Shared validation utilities for components.
 */

export type ValidationResult = boolean | string;

export interface ValidationProps<T = any> {
    fieldName: string;
    value: any;
    data: T;
}

export const validateRequired = (value: any): ValidationResult => {
    if (value === undefined || value === null || value === '') {
        return 'This field is required';
    }
    return true;
};

export const validateEmail = (value: string): ValidationResult => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !re.test(value)) {
        return 'Invalid email address';
    }
    return true;
};

export const validateNumber = (value: any): ValidationResult => {
    if (value && isNaN(Number(value))) {
        return 'Must be a number';
    }
    return true;
};

/**
 * Helper to combine multiple validation results
 */
export const combineValidation = (...results: ValidationResult[]): ValidationResult => {
    for (const result of results) {
        if (result !== true && result !== '') {
            return result;
        }
    }
    return true;
};

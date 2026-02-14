import { useCallback } from 'react';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface ValidationParams<T = any> {
    fieldName: string;
    value: any;
    data: T;
}

export interface FieldValidationProps<T = any> {
    validateField?: (params: ValidationParams<T>) => boolean | string;
    editSettings?: {
        requiredFields?: string[];
        validationRules?: Record<string, (value: any, data: T) => boolean | string>;
    };
}

/**
 * Shared hook for field validation logic.
 * Consolidates validation patterns and reduces duplication.
 */
export const useFieldValidation = <T = any>(props: FieldValidationProps<T>) => {
    const { validateField: customValidate, editSettings } = props;

    /**
     * Validates a single field
     */
    const validate = useCallback((fieldName: string, value: any, data: T): ValidationResult => {
        // 1. Check required fields from settings
        if (editSettings?.requiredFields?.includes(fieldName)) {
            if (value === undefined || value === null || value === '') {
                return { isValid: false, error: 'Field is required' };
            }
        }

        // 2. Check predefined validation rules
        const rule = editSettings?.validationRules?.[fieldName];
        if (rule) {
            const ruleResult = rule(value, data);
            if (ruleResult !== true && ruleResult !== '') {
                return {
                    isValid: false,
                    error: typeof ruleResult === 'string' ? ruleResult : `Invalid value for ${fieldName}`
                };
            }
        }

        // 3. Execute custom validation function from props
        if (customValidate) {
            const result = customValidate({ fieldName, value, data });
            if (result !== true && result !== '') {
                return {
                    isValid: false,
                    error: typeof result === 'string' ? result : `Validation failed for ${fieldName}`
                };
            }
        }

        return { isValid: true };
    }, [customValidate, editSettings]);

    /**
     * Validates an entire object (e.g., a row or form)
     */
    const validateForm = useCallback((data: T, fieldsToValidate: string[]): Record<string, ValidationResult> => {
        const results: Record<string, ValidationResult> = {};
        let isFormValid = true;

        fieldsToValidate.forEach(field => {
            const result = validate(field, (data as any)[field], data);
            results[field] = result;
            if (!result.isValid) isFormValid = false;
        });

        results['__form'] = { isValid: isFormValid };
        return results;
    }, [validate]);

    return {
        validate,
        validateForm
    };
};

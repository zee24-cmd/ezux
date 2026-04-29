import DOMPurify from 'dompurify';
import type React from 'react';

/**
 * Sanitizes HTML content using DOMPurify
 * @param html - The HTML string to sanitize
 * @param enabled - Whether sanitization is enabled
 * @returns Sanitized HTML string or original if disabled
 */
export function sanitizeHtml(html: string, enabled: boolean = true): string {
    if (!enabled) {
        return html;
    }

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'u', 'span', 'div', 'p', 'br',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li',
            'a', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ],
        ALLOWED_ATTR: ['class', 'href', 'src', 'alt', 'title'],
        ALLOW_DATA_ATTR: false,
    });
}

/**
 * Renders template content safely.
 * @param template - Template content (React node or HTML string)
 * @param data - Data to pass to template function
 * @param _enableSanitizer - Deprecated. String templates are always sanitized before dangerouslySetInnerHTML.
 * @returns Rendered content
 */
export function renderTemplate(
    template: ((data: any) => React.ReactNode) | string | undefined,
    data: any,
    _enableSanitizer: boolean = true
): React.ReactNode | { __html: string } | null {
    if (!template) return null;

    // If template is a function, call it
    if (typeof template === 'function') {
        const result = template(data);

        // String results are rendered with dangerouslySetInnerHTML by scheduler views.
        if (typeof result === 'string') {
            return { __html: sanitizeHtml(result, true) };
        }

        return result;
    }

    // String templates are rendered with dangerouslySetInnerHTML by scheduler views.
    if (typeof template === 'string') {
        return { __html: sanitizeHtml(template, true) };
    }

    return null;
}

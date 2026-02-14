import DOMPurify from 'dompurify';

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
        ALLOWED_ATTR: ['class', 'style', 'href', 'src', 'alt', 'title'],
        ALLOW_DATA_ATTR: false,
    });
}

/**
 * Renders template content safely
 * @param template - Template content (React node or HTML string)
 * @param data - Data to pass to template function
 * @param enableSanitizer - Whether to sanitize HTML strings
 * @returns Rendered content
 */
export function renderTemplate(
    template: ((data: any) => React.ReactNode) | string | undefined,
    data: any,
    enableSanitizer: boolean = true
): React.ReactNode | { __html: string } | null {
    if (!template) return null;

    // If template is a function, call it
    if (typeof template === 'function') {
        const result = template(data);

        // If result is a string, sanitize it
        if (typeof result === 'string') {
            return { __html: sanitizeHtml(result, enableSanitizer) };
        }

        return result;
    }

    // If template is a string, sanitize it
    if (typeof template === 'string') {
        return { __html: sanitizeHtml(template, enableSanitizer) };
    }

    return null;
}

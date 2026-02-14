import { getStroke } from '../../lib/perfect-freehand';

/**
 * Helper to convert stroke points to SVG path data (Quadratic Bezier).
 */
export function getSvgPathFromStroke(stroke: number[][]): string {
    if (!stroke.length) return '';

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ['M', ...stroke[0], 'Q']
    );

    d.push('Z');
    return d.join(' ');
}

/**
 * Standardized way to get a stroke path string from an outline or points with options.
 */
export function getStrokePath(
    stroke: number[][],
    options?: {
        size?: number;
        thinning?: number;
        smoothing?: number;
        streamline?: number;
        simulatePressure?: boolean;
        start?: any;
        end?: any;
    }
): string {
    if (options) {
        const outline = getStroke(stroke, options);
        return getSvgPathFromStroke(outline);
    }
    return getSvgPathFromStroke(stroke);
}

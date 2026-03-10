import { getTextWidth } from './TextMeasurer';

/**
 * Systemic column width calculator for EzTable.
 * Accounts for font metrics, padding, and interactive library icons.
 */
export const calculateColWidth = (
    text: string,
    options: {
        fontSize?: string;
        fontWeight?: string;
        fontFamily?: string;
        padding?: number;
        hasIcons?: boolean;
    } = {}
): number => {
    // Default to common enterprise utility font styling
    const {
        fontSize = '14px',
        fontWeight = '600',
        fontFamily = 'Inter, sans-serif',
        padding = 32, // Left (16px) + Right (16px)
        hasIcons = true
    } = options;

    const fontStr = `${fontWeight} ${fontSize} ${fontFamily}`;
    const textWidth = getTextWidth(text, fontStr);

    // Systematic buffer for EzTable interactive elements:
    // 1. Drag Handle (Left): ~20px
    // 2. Sort Indicator (Right): ~20px
    // 3. Filter Toggle (Right): ~20px
    // 4. Extra Margin: ~10px
    const iconBuffer = hasIcons ? 70 : 0;

    return Math.ceil(textWidth + padding + iconBuffer);
};


import { SharedBaseProps } from '../../shared/types/BaseProps';

/**
 * Props for the EzSignature component.
 * @group Properties
 */
export interface EzSignatureProps extends SharedBaseProps {
    /**
     * Width of the signature canvas.
     * @default '100%'
     * @group Properties
     */
    width?: string | number;

    /**
     * Height of the signature canvas.
     * @default 300
     * @group Properties
     */
    height?: string | number;

    /**
     * Background color of the signature pad.
     * @default 'transparent'
     * @group Properties
     */
    backgroundColor?: string;

    /**
     * Stroke color of the signature.
     * @default 'currentColor' (uses theme foreground)
     * @group Properties
     */
    strokeColor?: string;

    /**
     * Minimum stroke width.
     * @default 2
     * @group Properties
     */
    minStrokeWidth?: number;

    /**
     * Maximum stroke width.
     * @default 4
     * @group Properties
     */
    maxStrokeWidth?: number;

    /**
     * Factor to smooth the stroke.
     * @default 0.5
     * @group Properties
     */
    smoothing?: number;

    /**
     * Effect of pressure on the stroke's size.
     * @default 0.5
     * @group Properties
     */
    thinning?: number;

    /**
     * Callback when signature stroke ends.
     * @group Events
     */
    onEnd?: (event: React.PointerEvent<SVGSVGElement>) => void;

    /**
     * Callback when signature changes (after each stroke).
     * @group Events
     */
    onChange?: (signature: string[]) => void;

    /**
     * Callback when signature is saved.
     * @group Events
     */
    onSave?: (signature: string, format: string) => void;

    /**
     * Read only mode.
     * @group Properties
     */
    readOnly?: boolean;

    /**
     * Disabled mode.
     * @group Properties
     */
    disabled?: boolean;
}

/**
 * Imperative API for EzSignature.
 * @group Methods
 */
export interface EzSignatureRef {
    /**
     * Clears the signature pad.
     * @group Methods
     */
    clear: () => void;
    /**
     * Undoes the last stroke.
     * @group Methods
     */
    undo: () => void;
    /**
     * Redoes the last undone stroke.
     * @group Methods
     */
    redo: () => void;
    /**
     * Checks if undo is possible.
     * @group Methods
     */
    canUndo: () => boolean;
    /**
     * Checks if redo is possible.
     * @group Methods
     */
    canRedo: () => boolean;
    /**
     * Saves the signature to a Base64 string.
     * @group Methods
     */
    save: (format?: 'png' | 'jpeg' | 'svg') => Promise<string>;
    /**
     * Loads a signature from a JSON string of points or Base64 (if supported).
     * Currently supports loading array of Point arrays.
     * @group Methods
     */
    load: (data: number[][][] | string) => void;
    /**
     * Checks if signature is empty.
     * @group Methods
     */
    isEmpty: () => boolean;
    /**
     * Returns the geometric data of the signature.
     * @group Methods
     */
    getSignature: () => number[][][];
}

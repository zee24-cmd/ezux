import React, { useRef, useState, useMemo, useCallback } from 'react';
import { getStroke } from '../../lib/perfect-freehand';
import { useBaseComponent } from '../../shared/hooks/useBaseComponent';
import { useImperativeAPI } from '../../shared/hooks';
import { EzSignatureProps, EzSignatureRef } from './EzSignature.types';
import { cn } from '../../lib/utils';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { NotificationService } from '../../shared/services/NotificationService';
import { useInitCoreServices } from '../../shared/hooks';

import { useServiceState } from '../../shared/hooks/useServiceState';
import { I18nState } from '../../shared/services/I18nService';

import { getSvgPathFromStroke } from '../../shared/utils/canvasUtils';
interface StrokeOptions {
    size?: number;
    thinning?: number;
    smoothing?: number;
    streamline?: number;
    easing?: (t: number) => number;
    start?: {
        taper?: number | boolean;
        easing?: (t: number) => number;
        cap?: boolean;
    };
    end?: {
        taper?: number | boolean;
        easing?: (t: number) => number;
        cap?: boolean;
    };
    simulatePressure?: boolean;
}

const MemoizedStroke = React.memo(({ stroke, options, color }: { stroke: number[][], options: StrokeOptions, color: string }) => {
    const outline = getStroke(stroke, options);
    return <path d={getSvgPathFromStroke(outline)} fill={color} />;
});

/**
 * EzSignature is a high-fidelity digital ink and signature capture engine.
 * It provides a smooth, pressure-sensitive drawing experience using SVG 
 * and perfect-freehand algorithms, suitable for legal and formal validations.
 * 

 * ### Key Features
 * - **Natural Ink Flow**: Advanced smoothing and streamlining for professional-looking signatures.
 * - **Pressure Sensitivity**: Dynamically adjusts stroke width based on pointer pressure.
 * - **Multi-Format Export**: Save signatures as high-resolution `PNG`, `JPEG`, or vector `SVG`.
 * - **Vector Persistence**: Stores signatures as geometric point data for lossless scaling and reproduction.
 * - **Undo/Redo Stack**: Full transactional history for correcting mistakes during capture.
 * - **Theme Aware**: Automatically adjusts stroke colors based on active theme or custom palettes.
 * 
 * ### Minimal Example
 * ```tsx
 * <EzSignature
 *   width={400}
 *   height={200}
 *   onSave={(dataUrl) => submitSignature(dataUrl)}
 * />
 * ```
 * 
 * ### Imperative Control
 * ```tsx
 * const sigRef = useRef<EzSignatureRef>(null);
 * 
 * return (
 *   <>
 *     <EzSignature ref={sigRef} />
 *     <button onClick={() => sigRef.current?.clear()}>Clear</button>
 *     <button onClick={() => sigRef.current?.save('png')}>Download</button>
 *   </>
 * );
 * ```
 * 
 * @group Core Components
 */
const EzSignature = React.forwardRef<EzSignatureRef, EzSignatureProps>((props, ref) => {
    const {
        width = '100%',
        height = 300,
        backgroundColor = 'transparent',
        strokeColor,
        minStrokeWidth = 2.5,
        maxStrokeWidth = 5,
        smoothing = 0.5,
        thinning = 0, // No thinning by default (consistent width)
        readOnly = false,
        disabled = false,
        className,
        style,
        onEnd,
        onChange,
        onSave,
        dir: propsDir,
        ...rest
    } = props;

    // Reactively track I18n state for global direction
    const i18nState = useServiceState<I18nState>('I18nService');
    const globalDir = i18nState?.dir || 'ltr';

    // Determine direction: prop > global
    const dir = (propsDir === 'auto' || !propsDir) ? globalDir : propsDir;

    // Use shared hooks
    useBaseComponent(props); // Initializes base component logic
    useInitCoreServices(); // Ensures core services are registered

    // State
    const [points, setPoints] = useState<number[][]>([]); // Current stroke
    const [strokes, setStrokes] = useState<number[][][]>([]); // Completed strokes
    const [history, setHistory] = useState<number[][][][]>([]); // For undo/redo (stack of strokes arrays)
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    const svgRef = useRef<SVGSVGElement>(null);

    // Derived theme color default
    const effectiveStrokeColor = strokeColor || '#000f55'; // Ink Blue default

    // Helper to add to history
    const pushToHistory = useCallback((newStrokes: number[][][]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newStrokes);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        if (onChange) onChange(newStrokes.map(s => JSON.stringify(s)));
    }, [history, historyIndex, onChange]);

    // Pointer Events
    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (readOnly || disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const point = [e.nativeEvent.offsetX, e.nativeEvent.offsetY, e.pressure];
        setPoints([point]);
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (readOnly || disabled) return;
        if (e.buttons !== 1) return;
        const point = [e.nativeEvent.offsetX, e.nativeEvent.offsetY, e.pressure];
        setPoints(prev => [...prev, point]);
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        if (readOnly || disabled) return;
        if (points.length > 0) {
            const newStrokes = [...strokes, points];
            setStrokes(newStrokes);
            pushToHistory(newStrokes);
            setPoints([]);
            if (onEnd) onEnd(e);
        }
    };

    // Imperative API
    const api = useMemo(() => ({
        clear: () => {
            setStrokes([]);
            setPoints([]);
            pushToHistory([]);
            globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                type: 'info',
                message: 'Signature Cleared',
                duration: 2000
            });
        },
        undo: () => {
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setStrokes(history[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setStrokes([]);
            }
        },
        redo: () => {
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setStrokes(history[newIndex]);
            }
        },
        canUndo: () => historyIndex >= 0,
        canRedo: () => historyIndex < history.length - 1,
        isEmpty: () => strokes.length === 0 && points.length === 0,
        getSignature: () => strokes,
        load: (data: number[][][] | string) => {
            if (typeof data === 'string') {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        setStrokes(parsed);
                        pushToHistory(parsed);
                    }
                } catch (e) {
                    console.error("Failed to parse signature data", e);
                }
                return;
            }
            if (Array.isArray(data)) {
                setStrokes(data);
                pushToHistory(data);
            }
        },
        save: async (format = 'png'): Promise<string> => {
            if (!svgRef.current) return '';

            // Serialization logic
            const svgData = new XMLSerializer().serializeToString(svgRef.current);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Set canvas dimensions
            const box = svgRef.current.getBoundingClientRect();
            canvas.width = box.width;
            canvas.height = box.height;

            return new Promise<string>((resolve, reject) => {

                img.onload = () => {
                    if (ctx) {
                        if (backgroundColor && backgroundColor !== 'transparent') {
                            ctx.fillStyle = backgroundColor;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL(`image/${format}`);
                        if (onSave) onSave(dataUrl, format);
                        globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                            type: 'success',
                            message: 'Signature Saved Successfully',
                            duration: 3000
                        });
                        resolve(dataUrl);
                    } else {
                        const error = new Error("Canvas context not defined");
                        globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                            type: 'error',
                            message: 'Failed to Save Signature',
                            duration: 3000
                        });
                        reject(error);
                    }
                };
                img.onerror = (e) => {
                    globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                        type: 'error',
                        message: 'Failed to Process Signature Image',
                        duration: 3000
                    });
                    reject(e);
                };
                img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
            });
        }
    }), [history, historyIndex, strokes, points, backgroundColor, onSave, pushToHistory]);

    useImperativeAPI(ref, api);

    // Rendering strokes
    const strokeOptions = useMemo(() => ({
        size: maxStrokeWidth,
        thinning,
        smoothing,
        start: { cap: true, taper: false },
        end: { cap: true, taper: true }
    }), [maxStrokeWidth, thinning, smoothing]);

    // Rendering strokes
    // Rendering strokes
    const renderedStrokes = useMemo(() => strokes.map((stroke, i) => (
        <MemoizedStroke
            key={i}
            stroke={stroke}
            options={strokeOptions}
            color={effectiveStrokeColor}
        />
    )), [strokes, strokeOptions, effectiveStrokeColor]);

    const currentStroke = points.length > 0 && (
        <path
            d={getSvgPathFromStroke(getStroke(points, {
                size: maxStrokeWidth,
                thinning,
                smoothing,
                simulatePressure: points.length > 2, // only simulate if we have some movement
            }))}
            fill={effectiveStrokeColor}
            opacity={0.8}
        />
    );

    return (
        <div
            className={cn("ez-signature-container relative overflow-hidden select-none touch-none", className)}
            style={{ width, height, ...style }}
            dir={dir}
            {...rest}
        >
            <svg
                ref={svgRef}
                className="w-full h-full"
                // Removed viewBox to ensure 1:1 pixel mapping with offsetX/Y
                style={{ backgroundColor, touchAction: 'none' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {renderedStrokes}
                {currentStroke}
            </svg>

        </div>
    );
});

EzSignature.displayName = 'EzSignature';

export default EzSignature;

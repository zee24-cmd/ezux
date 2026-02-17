import React, { useEffect, memo, useRef, useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { EzContextMenu } from '../../shared/components/EzContextMenu';
import { TreeNode } from './EzTreeView.types';
import { ChevronRight, ChevronDown, Loader2, Check, Minus } from 'lucide-react';
import { HighlightText } from '../../shared/components/HighlightText';
import { cn } from '../../lib/utils';

/**
 * Props for the EzTreeViewItem component.
 * @group Properties
 */
interface EzTreeViewItemProps {
    /** The node data to render. @group Data */
    node: TreeNode;
    /** The nesting level of the node (0-based). @group Data */
    level: number;
    /** Whether the node is currently expanded. @group State */
    isExpanded: boolean;
    /** Whether the node is currently selected. @group State */
    isSelected: boolean;
    /** Whether the node is checked. @group State */
    isChecked: boolean;
    /** Whether the node has an indeterminate check state. @group State */
    isIndeterminate: boolean;
    /** Whether the node is currently loading children. @group State */
    isLoading: boolean;
    /** Whether the node has children (visible or potentially lazy-loaded). @group Data */
    hasChildren: boolean;
    /** Callback to toggle expansion state. @group Events */
    onToggleExpand: (id: string) => void;
    /** Callback to toggle selection state. @group Events */
    onToggleSelect: (id: string) => void;
    /** Callback to toggle check state. @group Events */
    onToggleCheck: (id: string) => void;
    /** Callback triggered when the node is renamed. @group Events */
    onRename: (id: string, newLabel: string) => void;
    /** Whether to show checkboxes. @group Appearance */
    showCheckboxes?: boolean;
    /** Whether inline editing is allowed. @group Appearance */
    allowEditing?: boolean;
    /** Current search term for highlighting. @group Data */
    searchTerm?: string;
    /** Virtualized style object. @group Appearance */
    style: React.CSSProperties;
    /** Keyboard event handler. @group Events */
    onKeyDown: (e: React.KeyboardEvent, id: string) => void;
    /** Tab index for keyboard navigation. @group Properties */
    tabIndex: number;
    /** Whether to automatically focus this item when mounted. @group Properties */
    autoFocus?: boolean;

    /** Slots for modular composition. @group Extensibility */
    slots?: any;
    /** Props for slots. @group Extensibility */
    slotProps?: any;

    /** Whether text wrapping is allowed. @group Appearance */
    allowTextWrap?: boolean;
    /** Animation configuration. @group Appearance */
    animation?: boolean | { expand?: boolean; collapse?: boolean };
    /** Whether to check on click. @group Properties */
    checkOnClick?: boolean;
    /** Whether full row selection is enabled. @group Appearance */
    fullRowSelect?: boolean;
    /** Whether full row navigation is enabled. @group Appearance */
    fullRowNavigable?: boolean;
    /** Callback triggered when the node is clicked. @group Events */
    onNodeClicked?: (nodeId: string) => void;
    /** Callback triggered before drawing the node. @group Events */
    onDrawNode?: (node: TreeNode) => void;
    /** Whether the node is currently in editing mode. @group State */
    isEditing?: boolean;
    /** Callback triggered when editing mode changes. @group Events */
    onEditingChange?: (editing: boolean) => void;
    /** Text direction. @group Appearance */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * Renders a single row in the tree with support for expansion, checkbox, icons, and inline editing.
 * @group Components
 */
export const EzTreeViewItem = memo(({
    node, level, isExpanded, isSelected, isChecked, isIndeterminate, isLoading, hasChildren,
    onToggleExpand, onToggleSelect, onToggleCheck, onRename,
    showCheckboxes, allowEditing, searchTerm,
    style, onKeyDown, tabIndex, autoFocus,
    slots, slotProps,
    allowTextWrap, animation, checkOnClick, fullRowSelect: _fullRowSelect, fullRowNavigable: _fullRowNavigable,
    onNodeClicked, onDrawNode,
    isEditing: externalIsEditing, onEditingChange, dir
}: EzTreeViewItemProps) => {
    const isRtl = dir === 'rtl';
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(node.label);

    // Sync external editing state with internal
    useEffect(() => {
        if (externalIsEditing !== undefined && externalIsEditing !== isEditing) {
            setIsEditing(externalIsEditing);
            if (externalIsEditing) {
                setEditValue(node.label);
            }
        }
    }, [externalIsEditing, isEditing, node.label]);

    // Call onDrawNode during render if provided
    useEffect(() => {
        onDrawNode?.(node);
    }, [node, onDrawNode]);

    const { setNodeRef, transform, isDragging, attributes, listeners } = useDraggable({
        id: node.id,
        data: { node, type: 'tree-item' }
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: node.id,
        data: { node, level }
    });

    const elementRef = useRef<HTMLDivElement | null>(null);
    const setRefs = (el: HTMLDivElement | null) => {
        setDroppableRef(el);
        setNodeRef(el);
        elementRef.current = el;
    };

    useEffect(() => {
        if (autoFocus && elementRef.current && !isEditing) {
            elementRef.current.focus({ preventScroll: true });
        }
    }, [autoFocus, isEditing]);

    const handleDoubleClick = () => {
        if (allowEditing) {
            setIsEditing(true);
            setEditValue(node.label);
            onEditingChange?.(true);
        }
    };

    const handleEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onRename(node.id, editValue);
            setIsEditing(false);
            onEditingChange?.(false);
        } else if (e.key === 'Escape') {
            setEditValue(node.label);
            setIsEditing(false);
            onEditingChange?.(false);
        }
    };

    const paddingStart = level * 20 + (hasChildren ? 0 : 20);

    const combinedStyle: React.CSSProperties = {
        ...style,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };

    const CustomNode = slots?.node;
    const CustomExpandIcon = slots?.expandIcon;
    const CustomCheckbox = slots?.checkbox;

    const renderExpandIcon = () => {
        if (isLoading) return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
        if (!hasChildren) return null;

        if (CustomExpandIcon) {
            const IconComp = CustomExpandIcon as any;
            return <IconComp isExpanded={isExpanded} isLoading={isLoading} {...slotProps?.expandIcon} />;
        }

        if (isExpanded) return <ChevronDown className="w-4 h-4" />;
        return isRtl ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />;
    };

    const renderCheckbox = () => {
        if (!showCheckboxes) return null;

        if (CustomCheckbox) {
            const CheckComp = CustomCheckbox;
            return <CheckComp checked={isChecked} indeterminate={isIndeterminate} onChange={() => onToggleCheck(node.id)} {...slotProps?.checkbox} />;
        }

        return (
            <div
                data-testid={`tree-checkbox-${node.id}`}
                onClick={(e) => { e.stopPropagation(); onToggleCheck(node.id); }}
                className={`w-4 h-4 me-2 flex items-center justify-center rounded border transition-colors cursor-pointer
                    ${(isChecked || isIndeterminate) ? 'bg-primary border-primary text-primary-foreground' :
                        'bg-background border-input'}`}
            >
                {isChecked && <Check className="w-3 h-3" />}
                {isIndeterminate && <Minus className="w-3 h-3" />}
            </div>
        );
    };

    const handleAction = (action: string) => {
        if (action === 'edit' && allowEditing) {
            setIsEditing(true);
            setEditValue(node.label);
        }
    };

    return (
        <EzContextMenu contextId="tree-node" data={node} onAction={handleAction}>
            <div
                ref={setRefs}
                {...attributes}
                {...listeners}
                role="treeitem"
                data-testid={`tree-item-${node.id}`}
                aria-expanded={hasChildren ? isExpanded : undefined}
                aria-selected={isSelected}
                tabIndex={tabIndex}
                onKeyDown={(e) => {
                    if (allowEditing && e.key === 'F2') {
                        e.stopPropagation();
                        setIsEditing(true);
                        setEditValue(node.label);
                    }
                    if (listeners?.onKeyDown) {
                        listeners.onKeyDown(e);
                    }
                    onKeyDown(e, node.id);
                }}
                onClick={() => {
                    onToggleSelect(node.id);
                    onNodeClicked?.(node.id);
                    if (checkOnClick && showCheckboxes) {
                        onToggleCheck(node.id);
                    }
                }}
                className={cn(
                    "flex items-center py-1.5 px-2 cursor-pointer hover:bg-muted/50 rounded-md w-full group outline-none focus:ring-1 focus:ring-primary/30 select-none",
                    isSelected ? 'bg-primary/10 text-primary' : 'text-foreground',
                    isOver ? 'bg-primary/20 ring-2 ring-primary' : '',
                    animation ? 'transition-all duration-200' : ''
                )}
                style={{ ...combinedStyle, paddingInlineStart: `${paddingStart}px` }}
            >
                {CustomNode ? (
                    <CustomNode
                        node={node}
                        level={level}
                        isExpanded={isExpanded}
                        isSelected={isSelected}
                        isChecked={isChecked}
                        isIndeterminate={isIndeterminate}
                        onToggleExpand={() => onToggleExpand(node.id)}
                        onToggleSelect={() => onToggleSelect(node.id)}
                        onToggleCheck={() => onToggleCheck(node.id)}
                        {...slotProps?.node}
                    />
                ) : (
                    <>
                        {hasChildren || isLoading ? (
                            <button
                                data-testid="expand-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleExpand(node.id);
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-5 h-5 flex items-center justify-center me-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded focus:outline-none transition-colors"
                                tabIndex={-1}
                            >
                                {renderExpandIcon()}
                            </button>
                        ) : null}

                        {renderCheckbox()}

                        {node.icon && <span className="me-2 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">{node.icon}</span>}

                        {isEditing ? (
                            <input
                                data-testid="tree-item-edit-input"
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleEditKeyDown}
                                onBlur={() => setIsEditing(false)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-background border border-primary rounded px-1 text-sm outline-none"
                            />
                        ) : (
                            <span
                                className={`text-sm font-medium flex-1 ${allowTextWrap ? 'whitespace-normal' : 'truncate'}`}
                                onDoubleClick={(e) => {
                                    e.stopPropagation(); // Stop propagation to prevent conflict with parent handlers if any
                                    handleDoubleClick();
                                }}
                            >
                                <HighlightText text={node.label} highlight={searchTerm} />
                            </span>
                        )}
                    </>
                )}
            </div>
        </EzContextMenu>
    );
});

EzTreeViewItem.displayName = 'EzTreeViewItem';

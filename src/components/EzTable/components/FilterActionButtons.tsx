import React from 'react';
import { Button } from '../../ui/button';
import { PlusIcon, XIcon } from 'lucide-react';

interface FilterActionButtonsProps {
    onClear?: () => void;
    onApply?: () => void;
    onAddRule?: () => void;
    onAddGroup?: () => void;
    onRemove?: () => void;
    showClear?: boolean;
    showApply?: boolean;
    showAddRule?: boolean;
    showAddGroup?: boolean;
    showRemove?: boolean;
    className?: string;
}

export const FilterActionButtons: React.FC<FilterActionButtonsProps> = React.memo(({
    onClear,
    onApply,
    onAddRule,
    onAddGroup,
    onRemove,
    showClear = true,
    showApply = true,
    showAddRule = false,
    showAddGroup = false,
    showRemove = false,
    className
}) => (
    <div className={`p-2 border-t flex justify-between bg-popover text-popover-foreground flex-shrink-0 sticky bottom-0 z-20 ${className || ''}`}>
        <div className="flex gap-2">
            {showClear && onClear && (
                <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-xs">
                    Clear
                </Button>
            )}
            {showAddRule && onAddRule && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddRule} title="Add Rule">
                    <PlusIcon className="w-4 h-4" />
                </Button>
            )}
            {showAddGroup && onAddGroup && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddGroup} title="Add Group">
                    <span className="font-bold text-xs">( )</span>
                </Button>
            )}
        </div>
        <div className="flex gap-2">
            {showRemove && onRemove && (
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={onRemove}>
                    <XIcon className="w-4 h-4" />
                </Button>
            )}
            {showApply && onApply && (
                <Button size="sm" onClick={onApply} className="min-w-[70px] h-8 text-xs font-semibold">
                    OK
                </Button>
            )}
        </div>
    </div>
));

FilterActionButtons.displayName = 'FilterActionButtons';

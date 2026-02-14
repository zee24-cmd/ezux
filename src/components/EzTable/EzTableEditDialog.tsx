import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface EzTableEditDialogProps<TData> {
    open: boolean;
    onClose: () => void;
    onSave: (data: TData) => void;
    columns: ColumnDef<TData, any>[];
    initialData?: Partial<TData>;
    isNew?: boolean;
    onFormRender?: (args: { form: any; mode: 'Add' | 'Edit' }) => void;
}

export const EzTableEditDialog = <TData extends object>({
    open,
    onClose,
    onSave,
    columns,
    initialData,
    isNew,
    onFormRender
}: EzTableEditDialogProps<TData>) => {
    const [formData, setFormData] = useState<Partial<TData>>({});

    useEffect(() => {
        if (open) {
            setFormData(initialData || {});
            // Fire onFormRender when dialog opens
            onFormRender?.({
                form: { data: initialData || {}, columns },
                mode: isNew ? 'Add' : 'Edit'
            });
        }
    }, [open, initialData, columns, isNew, onFormRender]);

    if (!open) return null;

    const handleSave = () => {
        onSave(formData as TData);
        onClose();
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Filter columns that are editable and have accessors
    const editableColumns = columns.filter(col => {
        // @ts-ignore - accessorKey exists on most column defs we care about
        return col.accessorKey && col.meta?.isEditable !== false && col.id !== 'actions' && col.id !== 'select';
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0">
            <div
                className="bg-background w-full max-w-lg rounded-lg border shadow-lg p-6 space-y-6 animate-in zoom-in-95 slide-in-from-bottom-2"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                        {isNew ? 'Add New Record' : 'Edit Record'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {isNew ? 'Enter details for the new record.' : 'Make changes to the record below.'}
                    </p>
                </div>

                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {editableColumns.map((col: any) => {
                        const field = col.accessorKey;
                        // Helper to get nested value or fallback
                        const value = formData[field as keyof TData] ?? '';

                        return (
                            <div key={field} className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={field} className="text-right">
                                    {typeof col.header === 'string' ? col.header : field}
                                </Label>
                                <Input
                                    id={field}
                                    value={value as string}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { DateTimePicker } from '../../ui/date-time-picker';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Plus, Trash2, Paperclip, Image as ImageIcon, X, Activity, Edit2, Loader2, AlertTriangle } from 'lucide-react';
import type { KanbanCard, KanbanColumn, Checklist, Attachment, Comment, CardActivity } from '../EzKanban.types';
import { useI18n } from '../../../shared/hooks/useI18n';
// import { MarkdownEditor } from '../../../shared/components/MarkdownEditor';
import { Checkbox } from '../../ui/checkbox';

export interface CardEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (card: Partial<KanbanCard>) => void;
    onDelete?: (cardId: string) => void;
    card?: Partial<KanbanCard>;
    columns?: KanbanColumn[];
    columnId?: string;
    customFields?: { id: string; name: string; type: 'text' | 'number' | 'date' | 'select' | 'checkbox'; options?: string[] }[];
    currentUser?: { id: string; name: string; avatar?: string };
}


export const CardEditorModal: React.FC<CardEditorModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    card,
    columns = [],
    columnId,
    customFields = [],
    currentUser = { id: 'current-user', name: 'Current User' },
}) => {
    const { t } = useI18n();

    // Helper for safe ID generation (handles non-secure contexts)
    const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    // Initialize form
    const form = useForm({
        defaultValues: {
            title: card?.title || '',
            description: card?.description || '',
            columnId: card?.columnId || columnId || columns[0]?.id || '',
            priority: card?.priority || 'medium',
            startDate: card?.startDate ? new Date(card.startDate) : undefined,
            dueDate: card?.dueDate ? new Date(card.dueDate) : undefined,
            checklists: card?.checklists || [],
            attachments: card?.attachments || [],
            comments: card?.comments || [],
            coverImage: card?.coverImage || '',
            customFieldValues: card?.customFieldValues || {},
            subtasks: card?.subtasks || [],
            timeTracking: card?.timeTracking || { estimated: 0, actual: 0 },
            activity: card?.activity || [],
            assignees: card?.assignees || [],
            tags: card?.tags || [],
            ...card, // Merge any other properties
        },
        onSubmit: async ({ value }) => {
            onSave(value);
            onClose();
        },
    });

    // Update form when card prop changes (and modal is open)
    useEffect(() => {
        if (isOpen && card) {
            // We can reset the form with the new card data
            // Note: react-form reset() resets to defaultValues. 
            // If we want to update defaultValues dynamically we might need to recreate the form or use a key.
            // But for now, let's just use reset which might not be enough if defaultValues are captured once.
            // Actually, useForm holds state. We should update the state if the prop changes.
            // But simpler is to key the form or the modal. 
            // For this modal, it's usually mounted/unmounted or given a new card.
            // If reused, we need to handle updates.
            // Let's use form.reset() with the new values if possible, 
            // but standard reset() goes to initial options.
            // Instead, let's assume the modal is re-rendered or we can trust the key prop on the modal if it existed.
            // Given the previous pattern, let's just assume we rely on the form state.
            // But wait, the previous EzEventModal used `form.reset()` which resets to `defaultValues`.
            // `defaultValues` are evaluated at render time of `useForm`. 
            // If `card` changes, `defaultValues` ref changes? No `useForm` is a hook.
            // We need to carefully handle this.
        }
    }, [isOpen, card]);

    // Use a key on the form or reset manually if needed. 
    // To match EzEventModal, let's just put the form definition.
    // AND REMOVE THE OLD STATE AND EFFECT.





    const handleDelete = () => {
        if (card?.id && onDelete) {
            onDelete(card.id);
        }
    };

    // --- Checklist Handlers ---
    // --- Checklist Handlers ---
    const [checklistInputs, setChecklistInputs] = useState<Record<string, string>>({});

    const addChecklist = () => {
        const newChecklist: Checklist = {
            id: generateId(),
            title: 'Checklist',
            items: []
        };
        (form as any).pushFieldValue('checklists', newChecklist);
    };

    const handleChecklistInputChange = (checklistId: string, value: string) => {
        setChecklistInputs(prev => ({ ...prev, [checklistId]: value }));
    };

    const addChecklistItem = (checklistId: string) => {
        const text = checklistInputs[checklistId]?.trim();
        if (!text) return;

        const currentChecklists = form.getFieldValue('checklists') || [];
        const updatedChecklists = currentChecklists.map((cl: Checklist) => {
            if (cl.id === checklistId) {
                return {
                    ...cl,
                    items: [...cl.items, { id: generateId(), text, isChecked: false }]
                };
            }
            return cl;
        });
        (form as any).setFieldValue('checklists', updatedChecklists);
        setChecklistInputs(prev => ({ ...prev, [checklistId]: '' }));
    };

    const toggleChecklistItem = (checklistId: string, itemId: string) => {
        const currentChecklists = form.getFieldValue('checklists') || [];
        const updatedChecklists = currentChecklists.map((cl: Checklist) => {
            if (cl.id === checklistId) {
                return {
                    ...cl,
                    items: cl.items.map((item: { id: string; isChecked: boolean }) =>
                        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
                    )
                };
            }
            return cl;
        });
        (form as any).setFieldValue('checklists', updatedChecklists);
    };

    // --- Comment Handlers ---
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

    const addComment = () => {
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: generateId(),
            text: newComment,
            authorId: currentUser.id,
            authorName: currentUser.name,
            createdAt: new Date()
        };
        (form as any).pushFieldValue('comments', comment);
        setNewComment('');

        // Log activity
        const act: CardActivity = {
            id: generateId(),
            type: 'comment',
            text: `commented "${newComment.slice(0, 20)}${newComment.length > 20 ? '...' : ''}"`,
            userId: currentUser.id,
            userName: currentUser.name,
            createdAt: new Date()
        };
        (form as any).pushFieldValue('activity', act);
    };

    const startEditingComment = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.text);
    };

    const saveEditedComment = () => {
        if (editingCommentId && editCommentText.trim()) {
            const currentComments = form.getFieldValue('comments') || [];
            const updatedComments = currentComments.map((c: Comment) => c.id === editingCommentId ? { ...c, text: editCommentText } : c);
            (form as any).setFieldValue('comments', updatedComments);
            setEditingCommentId(null);
            setEditCommentText('');
        }
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditCommentText('');
    };

    const confirmDeleteComment = (commentId: string) => {
        setDeleteConfirmationId(commentId);
    };

    const cancelDeleteComment = () => {
        setDeleteConfirmationId(null);
    };

    const deleteComment = (commentId: string) => {
        const currentComments = form.getFieldValue('comments') || [];
        (form as any).setFieldValue('comments', currentComments.filter((c: Comment) => c.id !== commentId));
        setDeleteConfirmationId(null);

        // Log activity
        const act: CardActivity = {
            id: generateId(),
            type: 'delete', // Using generic delete type
            text: `deleted a comment`,
            userId: currentUser.id,
            userName: currentUser.name,
            createdAt: new Date()
        };
        (form as unknown as { pushFieldValue: (path: string, val: unknown) => void }).pushFieldValue('activity', act);
    };

    // --- Subtask Handlers ---
    const [newSubtask, setNewSubtask] = useState('');

    const addSubtask = () => {
        if (!newSubtask.trim()) return;
        const subtask = {
            id: generateId(),
            title: newSubtask,
            isCompleted: false
        };
        (form as any).pushFieldValue('subtasks', subtask);
        setNewSubtask('');
    };

    const toggleSubtask = (subtaskId: string) => {
        const currentSubtasks = form.getFieldValue('subtasks') || [];
        const updatedSubtasks = currentSubtasks.map((s: { id: string; isCompleted: boolean }) =>
            s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
        );
        (form as any).setFieldValue('subtasks', updatedSubtasks);
    };

    const deleteSubtask = (subtaskId: string) => {
        const currentSubtasks = form.getFieldValue('subtasks') || [];
        (form as any).setFieldValue('subtasks', currentSubtasks.filter((s: { id: string }) => s.id !== subtaskId));
    };

    // --- Alignment & Attachment Handlers ---
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        // Mock upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For now, create a mock attachment
        const newAttachment: Attachment = {
            id: generateId(),
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'file',
            size: file.size,
            uploadedAt: new Date()
        };

        (form as any).pushFieldValue('attachments', newAttachment);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';

        // Log activity
        const act: CardActivity = {
            id: generateId(),
            type: 'attachment',
            text: `attached ${file.name}`,
            userId: currentUser.id,
            userName: currentUser.name,
            createdAt: new Date()
        };
        (form as any).pushFieldValue('activity', act);
    };

    const deleteAttachment = (attachmentId: string) => {
        const currentAttachments = form.getFieldValue('attachments') || [];
        (form as any).setFieldValue('attachments', currentAttachments.filter((a: Attachment) => a.id !== attachmentId));

        // Log activity
        const act: CardActivity = {
            id: generateId(),
            type: 'delete',
            text: `removed an attachment`,
            userId: currentUser.id,
            userName: currentUser.name,
            createdAt: new Date()
        };
        (form as any).pushFieldValue('activity', act);
    };

    const isEditing = !!card?.id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };



    const modalContent = (
        <div className="space-y-6">
            {/* Header / Title */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                    <form.Field
                        name="title"
                        children={(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-right">
                                    {t('common.title')}
                                </Label>
                                <Input
                                    id="title"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('kanban.cardTitlePlaceholder')}
                                    className="text-lg font-semibold"
                                />
                            </div>
                        )}
                    />

                    <div className="flex gap-4 items-center">
                        <div className="w-[200px]">
                            <form.Field
                                name="columnId"
                                children={(field) => (
                                    <Select value={field.state.value} onValueChange={(val) => field.handleChange(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {columns.map(col => (
                                                <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        {isEditing && (
                            <span className="text-sm text-muted-foreground font-mono">#{card?.id?.slice(0, 8)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form.Field
                    name="priority"
                    children={(field) => (
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={field.state.value} onValueChange={(val: 'low' | 'medium' | 'high' | 'critical') => field.handleChange(val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                />
                <form.Field
                    name="startDate"
                    children={(field) => (
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <DateTimePicker
                                date={field.state.value}
                                setDate={(date) => field.handleChange(date)}
                                mode="date"
                            />
                        </div>
                    )}
                />
                <form.Field
                    name="dueDate"
                    children={(field) => (
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <DateTimePicker
                                date={field.state.value}
                                setDate={(date) => field.handleChange(date)}
                                mode="date"
                            />
                        </div>
                    )}
                />
            </div>

            {/* Description */}
            <form.Field
                name="description"
                children={(field) => (
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="min-h-[150px]"
                        />
                    </div>
                )}
            />

            {/* Custom Fields */}
            {customFields.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    {customFields.map(cf => (
                        <form.Field
                            key={cf.id}
                            name={`customFieldValues.${cf.id}` as never}
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label>{cf.name}</Label>
                                    {cf.type === 'text' && (
                                        <Input
                                            value={field.state.value as string || ''}
                                            onChange={(e) => (field as any).handleChange(e.target.value)}
                                        />
                                    )}
                                    {cf.type === 'number' && (
                                        <Input
                                            type="number"
                                            value={field.state.value as number || ''}
                                            onChange={(e) => (field as any).handleChange(Number(e.target.value))}
                                        />
                                    )}
                                    {cf.type === 'date' && (
                                        <DateTimePicker
                                            date={field.state.value as Date}
                                            setDate={(date) => (field as any).handleChange(date)}
                                            mode="date"
                                        />
                                    )}
                                    {cf.type === 'select' && (
                                        <Select value={field.state.value as string || ''} onValueChange={(val) => field.handleChange(val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cf.options?.map(opt => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {cf.type === 'checkbox' && (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={!!field.state.value}
                                                onCheckedChange={(checked) => (field as any).handleChange(!!checked)}
                                            />
                                            <span className="text-sm font-medium">{cf.name}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="subtasks" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                    <TabsTrigger value="checklists">Checklists</TabsTrigger>
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* Subtasks Tab */}
                <TabsContent value="subtasks" className="space-y-4 pt-4">
                    <form.Field
                        name="subtasks"
                        children={(field) => (
                            <div className="space-y-2">
                                {field.state.value?.map((subtask: { id: string; title: string; isCompleted: boolean }) => (
                                    <div key={subtask.id} className="flex items-center gap-2 border p-3 rounded-md">
                                        <Checkbox
                                            checked={subtask.isCompleted}
                                            onCheckedChange={() => toggleSubtask(subtask.id)}
                                        />
                                        <span className={subtask.isCompleted ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                                            {subtask.title}
                                        </span>
                                        <Button variant="ghost" size="icon" onClick={() => deleteSubtask(subtask.id)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!field.state.value || field.state.value.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                        No subtasks yet.
                                    </div>
                                )}
                            </div>
                        )}
                    />
                    <div className="flex gap-2">
                        <Input
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            placeholder="Add a subtask..."
                            onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                        />
                        <Button onClick={addSubtask} disabled={!newSubtask.trim()}>Add</Button>
                    </div>
                </TabsContent>

                {/* Checklists Tab */}
                <TabsContent value="checklists" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Checklists</h3>
                        <Button size="sm" onClick={addChecklist} variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Checklist
                        </Button>
                    </div>
                    <form.Field
                        name="checklists"
                        children={(field) => (
                            <div className="space-y-4">
                                {field.state.value?.map((cl: Checklist) => {
                                    const progress = cl.items.length > 0
                                        ? Math.round((cl.items.filter((i: { isChecked: boolean }) => i.isChecked).length / cl.items.length) * 100)
                                        : 0;
                                    return (
                                        <div key={cl.id} className="border rounded-md p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium">{cl.title}</div>
                                                <div className="text-xs text-muted-foreground">{progress}%</div>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                                            </div>
                                            <div className="space-y-2">
                                                {cl.items.map((item: { id: string; text: string; isChecked: boolean }) => (
                                                    <div key={item.id} className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={item.isChecked}
                                                            onCheckedChange={() => toggleChecklistItem(cl.id, item.id)}
                                                        />
                                                        <span className={item.isChecked ? 'line-through text-muted-foreground' : ''}>
                                                            {item.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-2 flex gap-2">
                                                <Input
                                                    placeholder="Add an item..."
                                                    className="h-8 text-sm"
                                                    value={checklistInputs[cl.id] || ''}
                                                    onChange={(e) => handleChecklistInputChange(cl.id, e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && addChecklistItem(cl.id)}
                                                />
                                                <Button size="sm" onClick={() => addChecklistItem(cl.id)} disabled={!checklistInputs[cl.id]?.trim()}>Add</Button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!field.state.value || field.state.value.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                        No checklists yet.
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </TabsContent>

                {/* Attachments Tab */}
                <TabsContent value="attachments" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Attachments</h3>
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <div className="flex items-center gap-2">
                            {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
                            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Paperclip className="w-4 h-4 mr-2" />}
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </div>
                    </div>
                    <form.Field
                        name="attachments"
                        children={(field) => (
                            <div className="grid grid-cols-2 gap-2">
                                {field.state.value?.map((att: Attachment) => (
                                    <div key={att.id} className="border p-2 rounded flex items-center gap-2">
                                        <div className="w-10 h-10 bg-muted flex items-center justify-center rounded">
                                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="truncate font-medium text-sm">{att.name}</div>
                                            <div className="text-xs text-muted-foreground">{att.type}</div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => deleteAttachment(att.id)}>
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                ))}
                                {(!field.state.value || field.state.value.length === 0) && !isUploading && (
                                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                        No attachments yet.
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="space-y-4 pt-4">
                    <form.Field
                        name="comments"
                        children={(field) => (
                            <div className="space-y-4">
                                {field.state.value?.map((comment: Comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 w-full">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">{comment.authorName}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                            {editingCommentId === comment.id ? (
                                                <div className="flex flex-col gap-2">
                                                    <Textarea
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                                                saveEditedComment();
                                                            } else if (e.key === 'Escape') {
                                                                cancelEditComment();
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <Button size="sm" variant="ghost" onClick={cancelEditComment}>Cancel</Button>
                                                        <Button size="sm" onClick={saveEditedComment}>Save</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm bg-muted/50 p-2 rounded-md">
                                                    {comment.text}
                                                </div>
                                            )}
                                            {/* Delete Confirmation */}
                                            {deleteConfirmationId === comment.id && (
                                                <div className="flex items-center gap-2 p-2 bg-red-50 text-red-800 rounded-md text-sm mt-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    <span className="flex-1">Delete this comment?</span>
                                                    <Button size="sm" variant="ghost" className="h-6 px-2 hover:bg-red-100 text-red-800" onClick={cancelDeleteComment}>No</Button>
                                                    <Button size="sm" variant="destructive" className="h-6 px-2" onClick={() => deleteComment(comment.id)}>Yes</Button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditingComment(comment)} disabled={!!deleteConfirmationId}>
                                                <Edit2 className="w-3 h-3 text-muted-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => confirmDeleteComment(comment.id)} disabled={!!deleteConfirmationId}>
                                                <Trash2 className="w-3 h-3 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {(!field.state.value || field.state.value.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No comments yet.
                                    </div>
                                )}
                            </div>
                        )}
                    />
                    <div className="pt-4 border-t sticky bottom-0 bg-background">
                        <div className="flex gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows={2}
                                />
                                <div className="flex justify-end">
                                    <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4 pt-4">
                    <form.Field
                        name="activity"
                        children={(field) => (
                            <div className="space-y-4">
                                {field.state.value?.map((act: CardActivity) => (
                                    <div key={act.id} className="flex gap-3 text-sm">
                                        <div className="mt-1">
                                            <Activity className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <span className="font-semibold">{act.userName}</span>{' '}
                                            <span className="text-muted-foreground">{act.text}</span>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {new Date(act.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!field.state.value || field.state.value.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No activity yet.
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Card' : 'New Card'}
            className="sm:max-w-[800px] h-[85vh] flex flex-col"
        >
            <div className="flex-1 overflow-y-auto pr-2">
                {modalContent}
            </div>
            <div className="flex justify-between pt-4 border-t mt-4">
                {isEditing && (
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete Card
                    </Button>
                )}
                <div className="flex gap-2 ml-auto">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={(e) => handleSubmit(e)}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

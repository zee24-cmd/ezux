import React, { useState } from 'react';
import { SchedulerEvent } from '../EzScheduler.types';

/**
 * Props for the EditorTemplate component.
 */
export interface EditorTemplateProps {
    /** 
     * The event being edited or created.
     * @group Properties 
     */
    event?: Partial<SchedulerEvent>;
    /** 
     * Callback when the event is saved.
     * @group Events 
     */
    onSave: (event: SchedulerEvent) => void;
    /** 
     * Callback when editing is cancelled.
     * @group Events 
     */
    onCancel: () => void;
    /** 
     * Callback when the event is deleted.
     * @group Events 
     */
    onDelete?: (id: string) => void;
}

/**
 * Default template for the event editor dialog.
 * @group Models
 */
export const EditorTemplate: React.FC<EditorTemplateProps> = ({
    event,
    onSave,
    onCancel,
    onDelete
}) => {
    const [title, setTitle] = useState<string>((event?.title || event?.subject || '') as string);
    const [start, setStart] = useState<string>(event?.start ? new Date(event.start).toISOString().slice(0, 16) : '');
    const [end, setEnd] = useState<string>(event?.end ? new Date(event.end).toISOString().slice(0, 16) : '');
    const [description, setDescription] = useState<string>((event?.description || '') as string);

    const handleSave = () => {
        if (!title || !start || !end) return;

        const newEvent: any = {
            ...event,
            title,
            subject: title,
            start: new Date(start),
            end: new Date(end),
            description
        };
        onSave(newEvent);
    };

    return (
        <div className="ez-event-editor p-4 bg-background rounded shadow-lg border border-border">
            <h3 className="text-lg font-bold mb-4">{event?.id ? 'Edit Event' : 'New Event'}</h3>

            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 dark:bg-muted dark:border-border"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start</label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded p-2 dark:bg-muted dark:border-border"
                            value={start}
                            onChange={e => setStart(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End</label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded p-2 dark:bg-muted dark:border-border"
                            value={end}
                            onChange={e => setEnd(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full border rounded p-2 dark:bg-muted dark:border-border"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    {event?.id && onDelete && (
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-auto"
                            onClick={() => onDelete(event.id as string)}
                        >
                            Delete
                        </button>
                    )}
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-primary hover:bg-primary/90"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

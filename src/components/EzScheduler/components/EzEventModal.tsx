import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { createPortal } from 'react-dom';
import { SchedulerEvent, Resource, EditorMode, Recurrence } from '../EzScheduler.types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { X, Paperclip, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DateTimePicker } from '../../ui/date-time-picker';

interface EzEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: EditorMode;
    event?: Partial<SchedulerEvent>;
    onSave: (event: Partial<SchedulerEvent>) => void;
    onDelete?: (eventId: string) => void;
    resources?: Resource[];
    locale?: string;
    // Template properties
    editorTemplate?: (event: Partial<SchedulerEvent>) => React.ReactNode;
    headerTemplate?: (event: Partial<SchedulerEvent>, mode: string) => React.ReactNode;
    footerTemplate?: (event: Partial<SchedulerEvent>, mode: string, onSave: () => void, onClose: () => void) => React.ReactNode;
}

const WEEK_DAYS = [
    { label: 'S', value: 'SU' },
    { label: 'M', value: 'MO' },
    { label: 'T', value: 'TU' },
    { label: 'W', value: 'WE' },
    { label: 'T', value: 'TH' },
    { label: 'F', value: 'FR' },
    { label: 'S', value: 'SA' }
];

export const EzEventModal: React.FC<EzEventModalProps> = ({
    isOpen,
    onClose,
    mode,
    event,
    onSave,
    onDelete,
    locale,
    editorTemplate,
    headerTemplate,
    footerTemplate,
}) => {
    // Form implementation
    const form = useForm({
        defaultValues: {
            title: event?.title || '',
            start: event?.start,
            end: event?.end,
            resourceIds: event?.resourceIds || (event?.resourceId ? [event.resourceId] : []) || [],
            location: event?.location || '',
            isAllDay: !!event?.allDay || !!event?.isAllDay || false,
            description: event?.description || '',
            isTimezoneEnabled: !!event?.timezone,
            startTimezone: event?.timezone?.start || 'Asia/Calcutta',
            endTimezone: event?.timezone?.end || 'Asia/Calcutta',
            repeatFrequency: event?.recurrence?.frequency || 'Never',
            repeatInterval: event?.recurrence?.interval || 1,
            repeatDays: event?.recurrence?.days || [],
            repeatBy: event?.recurrence?.repeatBy || 'day',
            repeatEndLevel: event?.recurrence?.end || 'Never',
            repeatEndCount: event?.recurrence?.endCount || 1,
            repeatEndUntil: event?.recurrence?.endUntil,
            attachments: event?.attachments || [],
        },
        onSubmit: async ({ value }) => {
            onSave({
                ...event,
                title: value.title,
                start: value.start,
                end: value.end,
                resourceId: value.resourceIds[0],
                resourceIds: value.resourceIds,
                location: value.location,
                allDay: value.isAllDay,
                description: value.description,
                timezone: value.isTimezoneEnabled ? { start: value.startTimezone, end: value.endTimezone } : undefined,
                recurrence: value.repeatFrequency !== 'Never' ? {
                    frequency: value.repeatFrequency as Recurrence['frequency'],
                    interval: value.repeatInterval,
                    unit: value.repeatFrequency.replace('ly', '') + '(s)',
                    end: value.repeatEndLevel as Recurrence['end'],
                    endCount: value.repeatEndLevel === 'Count' ? value.repeatEndCount : undefined,
                    endUntil: value.repeatEndLevel === 'Until' ? value.repeatEndUntil : undefined,
                    days: value.repeatFrequency === 'Weekly' ? value.repeatDays : undefined,
                    repeatBy: (value.repeatFrequency === 'Monthly' || value.repeatFrequency === 'Yearly') ? value.repeatBy as Recurrence['repeatBy'] : undefined
                } : undefined,
                attachments: value.attachments,
            });
            onClose();
        },
    });

    // Reset form when event/isOpen changes
    useEffect(() => {
        if (isOpen) {
            form.reset();
        }
    }, [isOpen, event, form]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    const isReadOnly = mode === 'view';

    const modalContent = (
        <div
            data-testid="ez-event-modal"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(2px)',
                pointerEvents: 'auto'
            }}
        >
            {/* Backdrop */}
            <div
                style={{ position: 'absolute', inset: 0 }}
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div
                className={cn(
                    "bg-background rounded-xl shadow-2xl flex flex-col border border-border overflow-hidden",
                    "animate-in zoom-in-95 fade-in duration-300 ease-out"
                )}
                style={{
                    backgroundColor: 'white',
                    width: '650px',
                    maxWidth: '95vw',
                    maxHeight: '92vh',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10001
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between shrink-0 bg-background"
                    style={{ padding: '16px 40px' }}
                >
                    {headerTemplate ? (
                        headerTemplate(event || {}, mode)
                    ) : (
                        <>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                {mode === 'create' && 'New Event'}
                                {mode === 'edit' && 'Edit Event'}
                                {mode === 'view' && 'Event Details'}
                            </h2>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted text-muted-foreground mr-[-8px]" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Form Content */}
                {editorTemplate ? (
                    <div className="overflow-y-auto custom-scrollbar flex-1 bg-background" style={{ padding: '8px 40px 32px 40px' }}>
                        {editorTemplate(event || {})}
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-background"
                        style={{ padding: '8px 40px 32px 40px' }}
                    >

                        {/* Row 1: Title & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field
                                name="title"
                                validators={{
                                    onChange: ({ value }) => !value ? 'Title is required' : undefined,
                                }}
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-[13px] font-semibold text-foreground/70">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Add title"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            disabled={isReadOnly}
                                            className={cn(
                                                "h-10 rounded-md border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 bg-background transition-all",
                                                field.state.meta.errors.length > 0 && "border-destructive focus-visible:border-destructive ring-destructive/20"
                                            )}
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-[12px] font-medium text-destructive mt-1.5 animate-in fade-in slide-in-from-top-1">
                                                {field.state.meta.errors.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                            <form.Field
                                name="location"
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-[13px] font-semibold text-foreground/70">Location</Label>
                                        <Input
                                            id="location"
                                            placeholder="Add location"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            disabled={isReadOnly}
                                            className="h-10 rounded-md border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 bg-background transition-all"
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        {/* Row 2: Date/Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field
                                name="start"
                                validators={{
                                    onChange: ({ value }) => !value ? 'Start date is required' : undefined,
                                }}
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-semibold text-foreground/70">Start</Label>
                                        <DateTimePicker
                                            date={field.state.value}
                                            setDate={(date) => field.handleChange(date)}
                                            disabled={isReadOnly}
                                            required
                                            locale={locale}
                                            mode={form.getFieldValue('isAllDay') ? 'date' : 'datetime'}
                                            className="border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-[12px] font-medium text-destructive mt-1.5">
                                                {field.state.meta.errors.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                            <form.Field
                                name="end"
                                validators={{
                                    onChange: ({ value, fieldApi }) => {
                                        if (!value) return 'End date is required';
                                        const start = fieldApi.form.getFieldValue('start');
                                        if (start && value <= start) return 'End time must be after start time';
                                        return undefined;
                                    },
                                }}
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-semibold text-foreground/70">End</Label>
                                        <DateTimePicker
                                            date={field.state.value}
                                            setDate={(date) => field.handleChange(date)}
                                            disabled={isReadOnly}
                                            required
                                            locale={locale}
                                            mode={form.getFieldValue('isAllDay') ? 'date' : 'datetime'}
                                            minDate={form.getFieldValue('start')}
                                            className={cn(
                                                "border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20",
                                                field.state.meta.errors.length > 0 && "border-destructive focus-visible:border-destructive ring-destructive/20"
                                            )}
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-[12px] font-medium text-destructive mt-1.5 animate-in fade-in slide-in-from-top-1">
                                                {field.state.meta.errors.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Row 3: All Day & Timezone Selectors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field
                                name="isAllDay"
                                children={(field) => (
                                    <div className="flex items-center h-10">
                                        <label className="flex items-center space-x-3 cursor-pointer group select-none">
                                            <input
                                                type="checkbox"
                                                checked={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.checked)}
                                                disabled={isReadOnly}
                                                className="h-4 w-4 rounded border-border/50 text-primary focus:ring-primary/30 accent-primary transition-all cursor-pointer"
                                            />
                                            <span className="text-[14px] font-medium text-foreground/70 group-hover:text-foreground">All day event</span>
                                        </label>
                                    </div>
                                )}
                            />
                            <form.Field
                                name="isTimezoneEnabled"
                                children={(field) => (
                                    <div className="flex items-center h-10">
                                        <label className="flex items-center space-x-3 cursor-pointer group select-none">
                                            <input
                                                type="checkbox"
                                                checked={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.checked)}
                                                disabled={isReadOnly}
                                                className="h-4 w-4 rounded border-border/50 text-primary focus:ring-primary/30 accent-primary transition-all cursor-pointer"
                                            />
                                            <span className="text-[14px] font-medium text-foreground/70 group-hover:text-foreground">Enable timezone</span>
                                        </label>
                                    </div>
                                )}
                            />
                        </div>

                        {/* Conditional Row: Timezone Fields */}
                        {/* Conditional Row: Timezone Fields */}
                        <form.Subscribe
                            selector={(state) => [state.values.isTimezoneEnabled]}
                            children={([isTimezoneEnabled]) => isTimezoneEnabled && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-highlight/50 rounded-lg border border-border animate-in slide-in-from-top-2 duration-300">
                                    <form.Field
                                        name="startTimezone"
                                        children={(field) => (
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-semibold text-foreground/70">Start Timezone</Label>
                                                <select
                                                    className="w-full h-10 px-3 rounded-md border-border bg-background text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xlmns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat transition-all"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                >
                                                    <option value="Asia/Calcutta">Asia/Calcutta</option>
                                                    <option value="UTC">UTC</option>
                                                    <option value="America/New_York">America/New_York</option>
                                                </select>
                                            </div>
                                        )}
                                    />
                                    <form.Field
                                        name="endTimezone"
                                        children={(field) => (
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-semibold text-foreground/70">End Timezone</Label>
                                                <select
                                                    className="w-full h-10 px-3 rounded-md border-border bg-background text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xlmns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat transition-all"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                >
                                                    <option value="Asia/Calcutta">Asia/Calcutta</option>
                                                    <option value="UTC">UTC</option>
                                                    <option value="America/New_York">America/New_York</option>
                                                </select>
                                            </div>
                                        )}
                                    />
                                </div>
                            )}
                        />

                        {/* Row 4: Repeat Frequency & End */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field
                                name="repeatFrequency"
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-semibold text-foreground/70">Repeat</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border-border bg-background text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xlmns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat transition-all"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value as any)}
                                        >
                                            <option value="Never">Never</option>
                                            <option value="Daily">Daily</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Monthly">Monthly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                    </div>
                                )}
                            />

                            <form.Subscribe
                                selector={(state) => [state.values.repeatFrequency]}
                                children={([repeatFrequency]) => repeatFrequency !== 'Never' && (
                                    <form.Field
                                        name="repeatEndLevel"
                                        children={(field) => (
                                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                                <Label className="text-[13px] font-semibold text-foreground/70">End</Label>
                                                <select
                                                    className="w-full h-10 px-3 rounded-md border-border bg-background text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xlmns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat transition-all"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value as any)}
                                                >
                                                    <option value="Never">Never</option>
                                                    <option value="Until">Until</option>
                                                    <option value="Count">Count</option>
                                                </select>
                                            </div>
                                        )}
                                    />
                                )}
                            />
                        </div>

                        {/* Row 5: Repeat Interval / Conditional Fields */}
                        <form.Subscribe
                            selector={(state) => [state.values.repeatFrequency, state.values.repeatEndLevel]}
                            children={([repeatFrequency, repeatEndLevel]) => repeatFrequency !== 'Never' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                                    <form.Field
                                        name="repeatInterval"
                                        children={(field) => (
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-semibold text-foreground/70">Repeat every</Label>
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        className="flex-1 h-10 px-3 rounded-md border-border bg-background text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xlmns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat transition-all"
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                                        {repeatFrequency === 'Daily' ? 'Day(s)' : repeatFrequency.replace('ly', '') + '(s)'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    />

                                    {/* Conditional End Fields */}
                                    {repeatEndLevel === 'Until' && (
                                        <form.Field
                                            name="repeatEndUntil"
                                            children={(field) => (
                                                <div className="space-y-2 animate-in slide-in-from-top-1">
                                                    <Label className="text-[13px] font-semibold text-foreground/70">Until</Label>
                                                    <DateTimePicker
                                                        date={field.state.value}
                                                        setDate={(date) => field.handleChange(date)}
                                                        disabled={isReadOnly}
                                                        locale={locale}
                                                        mode="date"
                                                        minDate={form.getFieldValue('start')}
                                                        className="border-border focus:border-primary"
                                                    />
                                                </div>
                                            )}
                                        />
                                    )}
                                    {repeatEndLevel === 'Count' && (
                                        <form.Field
                                            name="repeatEndCount"
                                            children={(field) => (
                                                <div className="space-y-2 animate-in slide-in-from-top-1">
                                                    <Label className="text-[13px] font-semibold text-foreground/70">Occurrences</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                        className="h-10 rounded-md border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 bg-background transition-all"
                                                    />
                                                </div>
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {/* Row 6: Weekly Day Selector */}
                        <form.Subscribe
                            selector={(state) => [state.values.repeatFrequency]}
                            children={([repeatFrequency]) => repeatFrequency === 'Weekly' && (
                                <form.Field
                                    name="repeatDays"
                                    children={(field) => (
                                        <div className="space-y-3 animate-in fade-in duration-300">
                                            <Label className="text-[13px] font-semibold text-foreground/70">Repeat On</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {WEEK_DAYS.map(day => (
                                                    <button
                                                        key={day.value}
                                                        type="button"
                                                        onClick={() => {
                                                            const currentDays = field.state.value || [];
                                                            if (currentDays.includes(day.value)) {
                                                                field.handleChange(currentDays.filter((d: string) => d !== day.value));
                                                            } else {
                                                                field.handleChange([...currentDays, day.value]);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border",
                                                            (field.state.value || []).includes(day.value)
                                                                ? "bg-primary text-white border-primary shadow-sm"
                                                                : "bg-background text-foreground/60 border-border/60 hover:border-primary/40 hover:text-primary"
                                                        )}
                                                    >
                                                        {day.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                />
                            )}
                        />

                        {/* Row 7: Monthly/Yearly Repeat By */}
                        <form.Subscribe
                            selector={(state) => [state.values.repeatFrequency]}
                            children={([repeatFrequency]) => (repeatFrequency === 'Monthly' || repeatFrequency === 'Yearly') && (
                                <form.Field
                                    name="repeatBy"
                                    children={(field) => (
                                        <div className="space-y-4 animate-in fade-in duration-300">
                                            <Label className="text-[13px] font-semibold text-foreground/70">Repeat On</Label>
                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="repeatBy"
                                                        checked={field.state.value === 'day'}
                                                        onChange={() => field.handleChange('day')}
                                                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-foreground/80">Day of the month</span>
                                                </label>
                                                <label className="flex items-center space-x-3 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="repeatBy"
                                                        checked={field.state.value === 'ordinal'}
                                                        onChange={() => field.handleChange('ordinal')}
                                                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-foreground/80">Ordinal position</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                />
                            )}
                        />

                        {/* Row 8: Description */}
                        <form.Field
                            name="description"
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-[13px] font-semibold text-foreground/70">Description</Label>
                                    <textarea
                                        id="description"
                                        placeholder="Add description"
                                        className="flex min-h-[100px] w-full rounded-md border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all hover:border-border"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        disabled={isReadOnly}
                                    />
                                </div>
                            )}
                        />

                        {/* Row 9: Attachments */}
                        <form.Field
                            name="attachments"
                            children={(field) => (
                                <div className="space-y-4 pt-4 pb-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[13px] font-semibold text-foreground/70 flex items-center gap-2">
                                            <Paperclip className="w-4 h-4" /> Attachments
                                        </Label>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    field.handleChange([...(field.state.value || []), ...Array.from(e.target.files)]);
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs font-semibold gap-2 border-dashed border-border/50 hover:border-primary/40 hover:text-primary transition-all"
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                        >
                                            <Paperclip className="w-3 h-3" /> Add Files
                                        </Button>
                                    </div>

                                    {(field.state.value || []).length > 0 && (
                                        <div className="grid grid-cols-1 gap-3">
                                            {(field.state.value || []).map((file: File, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-highlight border border-border group hover:border-border transition-all">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-9 h-9 rounded-md bg-white border border-border flex items-center justify-center shrink-0 shadow-sm">
                                                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="text-[13px] font-medium text-foreground truncate">{file.name}</span>
                                                            <span className="text-[11px] text-muted-foreground font-medium">{(file.size / 1024).toFixed(1)} KB</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={() => field.handleChange((field.state.value || []).filter((_: any, i: number) => i !== idx))}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </form>
                )}

                {/* Footer */}
                {footerTemplate ? (
                    footerTemplate(event || {}, mode, () => handleSubmit({} as React.FormEvent), onClose)
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: '24px 40px',
                        backgroundColor: 'var(--highlight)',
                        gap: '12px',
                        width: '100%',
                        flexShrink: 0
                    }}>
                        {!isReadOnly && onDelete && mode === 'edit' && (
                            <Button type="button" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 px-5 font-bold mr-auto" onClick={() => { onDelete(event?.id!); onClose(); }}>
                                Delete
                            </Button>
                        )}



                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {!isReadOnly && (
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <Button
                                            type="submit"
                                            variant="default"
                                            className="h-10 px-10 font-bold rounded-md shrink-0 flex items-center justify-center transition-all hover:opacity-90"
                                            style={{ minWidth: '120px' }}
                                            disabled={!canSubmit || isSubmitting}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.handleSubmit();
                                            }}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </Button>
                                    )}
                                />
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 px-8 font-bold border border-border hover:bg-highlight text-foreground shrink-0 rounded-md transition-all"
                                style={{ minWidth: '100px' }}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

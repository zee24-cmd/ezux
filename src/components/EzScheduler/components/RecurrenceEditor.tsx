import React, { useState, useEffect } from 'react';
import { RRule, Frequency } from 'rrule';

export interface RecurrenceEditorProps {
    value?: string; // RRULE string
    onChange: (rrule: string) => void;
    startDate?: Date;
}

export const RecurrenceEditor: React.FC<RecurrenceEditorProps> = ({ value, onChange, startDate = new Date() }) => {
    // Determine frequency from string or default to null (None)
    const [freq, setFreq] = useState<Frequency | null>(null);
    const [interval, setInterval] = useState(1);

    useEffect(() => {
        if (value) {
            try {
                const options = RRule.parseString(value);
                setFreq(options.freq ?? null);
                setInterval(options.interval || 1);
            } catch (e) {
                console.warn('Invalid recurrence rule', e);
            }
        } else {
            setFreq(null);
            setInterval(1);
        }
    }, [value]);

    const updateRule = (newFreq: Frequency | null, newInterval: number) => {
        setFreq(newFreq);
        setInterval(newInterval);

        if (newFreq === null) {
            onChange('');
            return;
        }

        const rule = new RRule({
            freq: newFreq,
            interval: newInterval,
            dtstart: startDate
        });
        onChange(rule.toString());
    };

    return (
        <div className="ez-recurrence-editor p-2 border rounded">
            <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">Repeat</label>
                <select
                    className="border rounded p-1 text-sm dark:bg-muted dark:border-border"
                    value={freq === null ? 'none' : freq}
                    onChange={(e) => {
                        const val = e.target.value;
                        const f = val === 'none' ? null : parseInt(val) as Frequency;
                        updateRule(f, interval);
                    }}
                >
                    <option value="none">None</option>
                    <option value={RRule.DAILY}>Daily</option>
                    <option value={RRule.WEEKLY}>Weekly</option>
                    <option value={RRule.MONTHLY}>Monthly</option>
                    <option value={RRule.YEARLY}>Yearly</option>
                </select>
            </div>

            {freq !== null && (
                <div className="flex gap-2 items-center">
                    <label className="text-sm">Every</label>
                    <input
                        type="number"
                        min="1"
                        className="w-16 border rounded p-1 text-sm dark:bg-muted dark:border-border"
                        value={interval}
                        onChange={(e) => updateRule(freq, parseInt(e.target.value) || 1)}
                    />
                    <span className="text-sm">
                        {freq === RRule.DAILY && 'days'}
                        {freq === RRule.WEEKLY && 'weeks'}
                        {freq === RRule.MONTHLY && 'months'}
                        {freq === RRule.YEARLY && 'years'}
                    </span>
                </div>
            )}

            {/* More complex options (Days of week, etc.) could be added here */}
        </div>
    );
};

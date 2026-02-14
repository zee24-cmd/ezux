import React, { useState, useEffect, useMemo, useRef } from "react";
import { isValid, format as formatDateFns, parse, startOfDay, addMinutes, isSameDay } from "date-fns";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import { Calendar } from "./calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover";

interface DateTimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    locale?: string;
    className?: string;
    mode?: 'date' | 'datetime';
    minDate?: Date;
}

export function DateTimePicker({ date, setDate, disabled, id, locale, className, mode = 'datetime', minDate }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [pickerView, setPickerView] = useState<'date' | 'time'>('date');
    const [inputValue, setInputValue] = useState("");
    const timeListRef = useRef<HTMLDivElement>(null);

    // Format: 8/2/21 9:00 AM (M/d/yy h:mm a)
    const displayFormat = mode === 'datetime' ? "M/d/yy h:mm a" : "M/d/yy";

    useEffect(() => {
        if (date && isValid(date)) {
            setInputValue(formatDateFns(date, displayFormat));
        } else {
            setInputValue("");
        }
    }, [date, displayFormat]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        const parsed = parse(val, displayFormat, new Date());
        if (isValid(parsed)) {
            setDate(parsed);
        }
    };

    const handleSelectDate = (newDate: Date | undefined) => {
        if (!newDate) {
            setDate(undefined);
            return;
        }

        const current = date || new Date();
        const updated = new Date(newDate);
        if (mode === 'datetime') {
            updated.setHours(current.getHours());
            updated.setMinutes(current.getMinutes());
        } else {
            updated.setHours(0);
            updated.setMinutes(0);
        }
        setDate(updated);
        setIsOpen(false);
    };

    const handleSelectTime = (hours: number, minutes: number) => {
        const current = date || new Date();
        const updated = new Date(current);
        updated.setHours(hours);
        updated.setMinutes(minutes);
        setDate(updated);
        setIsOpen(false);
    };

    const togglePicker = (e: React.MouseEvent, view: 'date' | 'time') => {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen && pickerView === view) {
            setIsOpen(false);
        } else {
            setPickerView(view);
            setIsOpen(true);
        }
    };

    const timeOptions = useMemo(() => {
        const options = [];
        let curr = startOfDay(new Date());
        for (let i = 0; i < 48; i++) {
            options.push({
                label: formatDateFns(curr, "h:mm a"),
                hh: curr.getHours(),
                mm: curr.getMinutes()
            });
            curr = addMinutes(curr, 30);
        }

        if (minDate && date && isSameDay(date, minDate)) {
            return options.filter(t => {
                const optMinutes = t.hh * 60 + t.mm;
                const minMinutes = minDate.getHours() * 60 + minDate.getMinutes();
                return optMinutes > minMinutes;
            });
        }

        return options;
    }, [date, minDate]);

    useEffect(() => {
        if (isOpen && pickerView === 'time' && timeListRef.current && date) {
            const index = timeOptions.findIndex(t => t.hh === date.getHours() && t.mm === (date.getMinutes() >= 30 ? 30 : 0));
            if (index !== -1) {
                const item = timeListRef.current.children[index] as HTMLElement;
                if (item) {
                    timeListRef.current.scrollTop = item.offsetTop - 80;
                }
            }
        }
    }, [isOpen, pickerView, date, timeOptions]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className={cn(
                    "group flex items-center w-full h-10 rounded-md border border-slate-200 bg-background transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}>
                    <input
                        id={id}
                        className="flex-1 min-w-0 h-full px-3 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={mode === 'datetime' ? "M/D/YY H:MM AM" : "M/D/YY"}
                        disabled={disabled}
                        autoComplete="off"
                    />

                    {inputValue && !disabled && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDate(undefined);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="h-full px-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    <div className="h-6 w-[1px] bg-slate-200" />

                    <button
                        type="button"
                        onClick={(e) => togglePicker(e, 'date')}
                        onPointerDown={(e) => e.stopPropagation()}
                        disabled={disabled}
                        className={cn(
                            "h-full px-3 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors",
                            pickerView === 'date' && isOpen && "text-primary"
                        )}
                    >
                        <CalendarIcon className="w-4 h-4" />
                    </button>

                    {mode === 'datetime' && (
                        <>
                            <div className="h-6 w-[1px] bg-slate-200" />
                            <button
                                type="button"
                                onClick={(e) => togglePicker(e, 'time')}
                                onPointerDown={(e) => e.stopPropagation()}
                                disabled={disabled}
                                className={cn(
                                    "h-full px-3 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors rounded-r-md",
                                    pickerView === 'time' && isOpen && "text-primary"
                                )}
                            >
                                <Clock className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0 shadow-xl border border-border bg-popover text-popover-foreground overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                style={{ zIndex: 11000, maxWidth: '300px', width: 'auto' }}
                align="start"
                sideOffset={4}
            >
                {pickerView === 'date' ? (
                    <Calendar
                        selected={date}
                        onSelect={handleSelectDate}
                        locale={locale}
                        minDate={minDate}
                    />
                ) : (
                    <div
                        ref={timeListRef}
                        className="w-[180px] overflow-y-auto py-1 custom-scrollbar"
                        style={{ height: '363px' }}
                    >
                        {timeOptions.map((option) => {
                            const isSelected = date && date.getHours() === option.hh && date.getMinutes() === option.mm;
                            return (
                                <button
                                    key={option.label}
                                    type="button"
                                    onClick={() => handleSelectTime(option.hh, option.mm)}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-[14px] transition-colors",
                                        isSelected
                                            ? "bg-primary text-white font-bold"
                                            : "text-slate-700 hover:bg-primary/5 hover:text-primary"
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}

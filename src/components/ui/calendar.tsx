import { useState, useMemo } from "react";
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    isBefore,
    startOfDay
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";

export type CalendarProps = {
    selected?: Date;
    onSelect?: (date: Date | undefined) => void;
    className?: string;
    locale?: string;
    minDate?: Date;
    modifiers?: {
        [date: string]: {
            className?: string;
            tooltip?: string;
            disabled?: boolean;
        }
    };
}

export function Calendar({ selected, onSelect, className, locale, minDate, modifiers = {} }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const monthFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);
    const dayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { day: 'numeric' }), [locale]);

    // Su Mo Tu We Th Fr Sa headers
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className={cn("p-4 bg-background text-foreground select-none", className)} style={{ minWidth: '280px' }}>
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="font-bold text-lg text-foreground">
                    {monthFormatter.format(currentMonth)}
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div
                className="grid gap-0 mb-2"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
            >
                {weekDays.map((day, i) => (
                    <div key={i} className="text-center text-[13px] text-muted-foreground/60 font-medium h-8 flex items-center justify-center">
                        {day}
                    </div>
                ))}
            </div>

            <div
                className="grid gap-y-1"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
            >
                {days.map((day) => {
                    const isSelected = selected && isSameDay(day, selected);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isDisabled = minDate ? isBefore(day, startOfDay(minDate)) : false;

                    const dateKey = day.toISOString().split('T')[0];
                    const modifier = modifiers[dateKey];
                    // const isModified = !!modifier;
                    const isModifierDisabled = modifier?.disabled;
                    const finalDisabled = isDisabled || isModifierDisabled;

                    const DayButton = (
                        <button
                            onClick={() => !finalDisabled && onSelect && onSelect(day)}
                            disabled={finalDisabled}
                            className={cn(
                                "h-9 w-9 p-0 text-[14px] rounded-md flex items-center justify-center transition-all duration-150 relative",
                                "hover:bg-accent text-foreground",
                                isSelected
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm z-10"
                                    : "",
                                !isCurrentMonth && "text-muted-foreground/30",
                                isToday(day) && !isSelected && "text-primary font-bold border-b-2 border-primary rounded-none",
                                finalDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent text-muted-foreground",
                                modifier?.className
                            )}
                        >
                            <time dateTime={day.toISOString()}>{dayFormatter.format(day)}</time>
                        </button>
                    );

                    return (
                        <div key={day.toString()} className="flex items-center justify-center">
                            {modifier?.tooltip ? (
                                <TooltipProvider>
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <span className="cursor-default">{DayButton}</span>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs font-semibold px-2 py-1">
                                            {modifier.tooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                DayButton
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-2 pt-2 border-t border-border/30 flex justify-center">
                <Button
                    variant="ghost"
                    className="text-primary font-bold hover:bg-primary/5 w-full h-10 text-[15px]"
                    onClick={() => {
                        const today = new Date();
                        setCurrentMonth(today);
                        onSelect && onSelect(today);
                    }}
                >
                    Today
                </Button>
            </div>
        </div>
    );
}

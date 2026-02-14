import { memo } from 'react';
import { ChevronLeft, ChevronRight, Settings, Clock, Search, Globe, Calendar as CalendarIcon, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { ViewType, View, ToolbarItemModel, ViewsModel } from './EzScheduler.types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { EzNotificationDropdown } from '../../shared/components/EzNotificationDropdown';

// Helper for formatting view names
const formatViewName = (view: View): string => {
    return view.replace(/([A-Z])/g, ' $1').trim();
};

// Helper for formatting date ranges (simplified)
const formatDateRange = (date: Date, _view: ViewType | View): string => {
    // Basic implementation - can be expanded based on view type
    return format(date, 'MMMM yyyy');
};

/**
 * Props for the EzSchedulerToolbar component.
 */
interface EzSchedulerToolbarProps {
    /** 
     * The current date displayed in the scheduler.
     * @group Properties 
     */
    currentDate: Date;
    /** 
     * Current view type (legacy support).
     * @group Properties 
     */
    view: ViewType;
    /** 
     * Sets the view type (legacy support).
     * @group Methods 
     */
    setView: (view: ViewType) => void;
    /** 
     * Navigates to the next period (legacy support).
     * @group Methods 
     */
    next: () => void;
    /** 
     * Navigates to the previous period (legacy support).
     * @group Methods 
     */
    prev: () => void;
    /** 
     * Navigates to today (legacy support).
     * @group Methods 
     */
    today: () => void;
    /** 
     * Callback when the "Add" button is clicked.
     * @group Events 
     */
    onAddClick: () => void;
    /** 
     * Duration of each time slot in minutes.
     * @group Properties 
     */
    slotDuration: number;
    /** 
     * Sets the duration of each time slot.
     * @group Methods 
     */
    setSlotDuration: (duration: number) => void;
    /** 
     * Sets the current date.
     * @group Methods 
     */
    setCurrentDate: (date: Date) => void;
    /** 
     * Callback to navigate to the previous period.
     * @group Events 
     */
    onPrev: () => void;
    /** 
     * Callback to navigate to the next period.
     * @group Events 
     */
    onNext: () => void;
    /** 
     * Callback to navigate to today.
     * @group Events 
     */
    onToday: () => void;
    /** 
     * The currently active view mode.
     * @group Properties 
     */
    currentView: View;
    /** 
     * Callback when the view mode changes.
     * @group Events 
     */
    onViewChange: (view: View) => void;
    /** 
     * List of available views.
     * @group Properties 
     */
    views: (View | ViewsModel)[];
    /** 
     * Callback for Excel export.
     * @group Events 
     */
    onExportExcel?: () => void;
    /** 
     * Callback for CSV export.
     * @group Events 
     */
    onExportCSV?: () => void;
    /** 
     * Callback for ICS export.
     * @group Events 
     */
    /** 
     * Callback for ICS export.
     * @group Events 
     */
    onExportICS?: () => void;
    /** 
     * Text direction.
     * @group Appearance 
     */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * Toolbar component for the EzScheduler.
 * Provides navigation, view switching, and action buttons.
 * @group Subcomponents
 */
export const EzSchedulerToolbar = memo(({
    currentDate,
    next,
    prev,
    today,
    slotDuration,
    setSlotDuration,
    setCurrentDate,
    // view, // Unused in this component logic currently, kept in interface for compatibility
    // Destructure new props
    onPrev,
    onNext,
    onToday,
    currentView,
    onViewChange,
    views = [], // Default to empty array
    onExportExcel,
    onExportCSV,
    onExportICS,
    dir
}: EzSchedulerToolbarProps) => {
    const isRtl = dir === 'rtl';

    // Define renderCustomItem function inside the component
    const renderCustomItem = (item: ToolbarItemModel | string, index: number) => {
        if (typeof item === 'string') {
            // Handle preset string items
            switch (item) {
                case 'Previous':
                    return (
                        <Button key={index} variant="ghost" size="icon" onClick={onPrev}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    );
                case 'Next':
                    return (
                        <Button key={index} variant="ghost" size="icon" onClick={onNext}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    );
                case 'Today':
                    return (
                        <Button key={index} variant="outline" onClick={onToday}>
                            Today
                        </Button>
                    );
                case 'DateRange':
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-lg font-semibold min-w-[200px] text-center">
                                {formatDateRange(currentDate, currentView)}
                            </span>
                        </div>
                    );
                case 'Search':
                    return (
                        <div key={index} className="relative w-48 hidden md:block">
                            <Search className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", isRtl ? "right-2" : "left-2")} />
                            <Input placeholder="Search..." className="ps-8 h-9" />
                        </div>
                    );
                case 'Timezone':
                    // Simple timezone indicator/selector placeholder
                    return (
                        <Button key={index} variant="ghost" size="sm" className="hidden lg:flex gap-1 text-xs text-muted-foreground">
                            <Globe className="h-3.5 w-3.5" />
                            <span>UTC</span>
                        </Button>
                    );
                case 'ActiveView':
                    // Handled separately usually, but good for custom layouts
                    return (
                        <Select value={currentView} onValueChange={(v) => onViewChange(v as View)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                                {views.map((viewItem) => { // Renamed 'view' to 'viewItem' to avoid conflict with prop 'view'
                                    const viewValue = typeof viewItem === 'string' ? viewItem : viewItem.option;
                                    // const viewLabel = typeof viewItem === 'string' ? viewItem : (viewItem.displayName || viewItem.option);
                                    return (
                                        <SelectItem key={viewValue} value={viewValue}>
                                            {formatViewName(viewValue)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    );
                default:
                    return null;
            }
        }

        // Handle custom model items
        return (
            <div key={index} className={item.cssClass}>
                {item.text}
            </div>
        );
    };

    // Example usage of renderCustomItem (this part is not in the instruction but necessary for context)
    // For the purpose of this edit, we'll integrate the new items into the existing structure
    // as per the instruction's implied placement.
    // The instruction seems to want to add the new items to the right section,
    // but the `renderCustomItem` function itself is a general utility.
    // I will add the Search and Timezone items to the right section as implied by the context.

    return (
        <div data-testid="scheduler-toolbar" className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-background h-16">
            {/* Left Section: Navigation and Date */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 ">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prev}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                        {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={next}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                        {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                                <CalendarIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                selected={currentDate}
                                onSelect={(date) => date && setCurrentDate(date)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    className="text-xl font-bold tracking-tight text-foreground cursor-pointer hover:text-primary transition-colors ms-4"
                    onClick={() => {
                        // Optional: trigger the popover or just let the button handle it
                        // For now we just make the label stylish and consistent
                    }}
                >
                    {format(currentDate, 'EEEE, MMM d yyyy')}
                </div>
            </div>

            {/* Right Section: Today, Time Interval and Settings */}
            <div className="flex items-center gap-4">
                {renderCustomItem('Search', 0)} {/* Added Search */}
                {renderCustomItem('Timezone', 1)} {/* Added Timezone */}
                {renderCustomItem('ActiveView', 2)}

                <Button
                    variant="outline"
                    onClick={today}
                    className="h-9 px-4 text-xs font-bold uppercase tracking-wider border-border hover:bg-muted transition-colors rounded-md"
                >
                    TODAY
                </Button>

                <div className="flex items-center gap-2 bg-muted/30 px-2 py-1 rounded-lg border border-border/50">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <Select value={String(slotDuration)} onValueChange={(v) => setSlotDuration(Number(v))}>
                        <SelectTrigger className="h-7 w-[90px] text-[10px] font-bold uppercase tracking-tight bg-transparent border-none shadow-none focus:ring-0">
                            <SelectValue placeholder="Interval" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <EzNotificationDropdown />

                <div className="flex items-center gap-1 border-s border-border ps-2">
                    {onExportExcel && (
                        <Button variant="ghost" size="icon" onClick={onExportExcel} title="Export to Excel">
                            <Download className="w-4 h-4" />
                        </Button>
                    )}
                    {onExportCSV && (
                        <Button variant="ghost" size="icon" onClick={onExportCSV} title="Export to CSV">
                            <Download className="w-4 h-4 text-primary" />
                        </Button>
                    )}
                    {onExportICS && (
                        <Button variant="ghost" size="icon" onClick={onExportICS} title="Export to ICS">
                            <CalendarIcon className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                    <Settings className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
});

EzSchedulerToolbar.displayName = 'EzSchedulerToolbar';

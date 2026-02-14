export type CalendarProps = {
    selected?: Date;
    onSelect?: (date: Date | undefined) => void;
    className?: string;
    locale?: string;
};
export declare function Calendar({ selected, onSelect, className, locale }: CalendarProps): import("react/jsx-runtime").JSX.Element;

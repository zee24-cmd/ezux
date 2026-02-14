interface DateTimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    locale?: string;
}
export declare function DateTimePicker({ date, setDate, disabled, id, locale }: DateTimePickerProps): import("react/jsx-runtime").JSX.Element;
export {};

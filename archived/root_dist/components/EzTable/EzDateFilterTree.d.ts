interface EzDateFilterTreeProps {
    uniqueValues: Map<any, number>;
    selectedValues: Set<any> | null;
    onBulkSelect: (values: any[], checked: boolean) => void;
}
export declare function EzDateFilterTree({ uniqueValues, selectedValues, onBulkSelect }: EzDateFilterTreeProps): import("react/jsx-runtime").JSX.Element;
export {};

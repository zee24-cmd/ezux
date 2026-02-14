import { useMemo, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface EzDateTreeNodeProps {
    node: DateNode;
    selectedValues: Set<any> | null;
    onBulkSelect: (values: any[], checked: boolean) => void;
}

interface DateNode {
    key: string;
    label: string;
    level: number;
    fullValues: any[];
    children?: DateNode[];
}

function EzDateTreeNode({ node, selectedValues, onBulkSelect }: EzDateTreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate Checked State
    let checkedState: boolean | 'indeterminate' = false;

    if (selectedValues === null) {
        checkedState = true;
    } else {
        const count = node.fullValues.filter(v => selectedValues.has(v)).length;
        if (count === node.fullValues.length && node.fullValues.length > 0) checkedState = true;
        else if (count > 0) checkedState = 'indeterminate';
        else checkedState = false;
    }

    const handleCheck = (c: boolean) => {
        onBulkSelect(node.fullValues, c);
    };

    return (
        <div className="pl-4">
            <div className="flex items-center space-x-2 py-1 hover:bg-muted/50 rounded">
                {node.children && node.children.length > 0 ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="p-0.5 hover:bg-muted rounded mr-1 text-muted-foreground"
                    >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                ) : <span className="w-5 mr-1" />}

                <Checkbox
                    checked={checkedState === 'indeterminate' ? 'indeterminate' : checkedState}
                    onCheckedChange={(c) => handleCheck(c === true)}
                    id={`node-${node.key}`}
                />
                <label htmlFor={`node-${node.key}`} className="text-sm flex-1 cursor-pointer select-none text-foreground">
                    {node.label}
                    <span className="ml-2 text-xs text-muted-foreground">({node.fullValues.length})</span>
                </label>
            </div>

            {node.children && isExpanded && (
                <div className="border-l border-border ml-2">
                    {node.children.map(child => (
                        <EzDateTreeNode
                            key={child.key}
                            node={child}
                            selectedValues={selectedValues}
                            onBulkSelect={onBulkSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface EzDateFilterTreeProps {
    uniqueValues: Map<any, number>;
    selectedValues: Set<any> | null;
    onBulkSelect: (values: any[], checked: boolean) => void;
}

export function EzDateFilterTree({ uniqueValues, selectedValues, onBulkSelect }: EzDateFilterTreeProps) {
    const tree = useMemo(() => {
        const root: DateNode[] = [];
        const mapped = Array.from(uniqueValues.keys())
            .map(k => {
                // Determine if key is parseable
                const d = k instanceof Date ? k : new Date(k);
                return { date: d, original: k, valid: !isNaN(d.getTime()) };
            })
            .filter(item => item.valid);

        mapped.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Group by Year
        const years = new Map<number, typeof mapped>();
        mapped.forEach(item => {
            const y = item.date.getFullYear();
            if (!years.has(y)) years.set(y, []);
            years.get(y)!.push(item);
        });

        years.forEach((itemsInYear, year) => {
            const yearNode: DateNode = {
                key: String(year),
                label: String(year),
                level: 0,
                fullValues: itemsInYear.map(i => i.original),
                children: []
            };

            // Group by Month
            const months = new Map<number, typeof mapped>();
            itemsInYear.forEach(item => {
                const m = item.date.getMonth();
                if (!months.has(m)) months.set(m, []);
                months.get(m)!.push(item);
            });

            months.forEach((itemsInMonth, monthIndex) => {
                const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long' });
                const monthNode: DateNode = {
                    key: `${year}-${monthIndex}`,
                    label: monthName,
                    level: 1,
                    fullValues: itemsInMonth.map(i => i.original),
                    children: []
                };

                // Group by Day
                const days = new Map<number, typeof mapped>();
                itemsInMonth.forEach(item => {
                    const d = item.date.getDate();
                    if (!days.has(d)) days.set(d, []);
                    days.get(d)!.push(item);
                });

                days.forEach((itemsInDay, day) => {
                    const dayNode: DateNode = {
                        key: `${year}-${monthIndex}-${day}`,
                        label: String(day),
                        level: 2,
                        fullValues: itemsInDay.map(i => i.original),
                        children: []
                    };
                    monthNode.children!.push(dayNode);
                });

                yearNode.children!.push(monthNode);
            });

            root.push(yearNode);
        });

        return root;
    }, [uniqueValues]);

    return (
        <div className="space-y-1">
            {tree.length === 0 && <div className="p-2 text-sm text-muted-foreground">No dates found</div>}
            {tree.map(node => (
                <EzDateTreeNode
                    key={node.key}
                    node={node}
                    selectedValues={selectedValues}
                    onBulkSelect={onBulkSelect}
                />
            ))}
        </div>
    );
}

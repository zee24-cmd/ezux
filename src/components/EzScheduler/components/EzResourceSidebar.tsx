import React from 'react';
import { Resource } from '../EzScheduler.types';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Search } from 'lucide-react';


/**
 * Props for the EzResourceSidebar component.
 */
interface EzResourceSidebarProps {
    /** 
     * List of available resources. 
     * @group Properties 
     */
    resources: Resource[];
    /** 
     * List of selected resource IDs. 
     * @group Properties 
     */
    selectedResourceIds: string[];
    /** 
     * Callback when selection changes. 
     * @group Events 
     */
    onSelectionChange: (selectedIds: string[]) => void;
    /** 
     * Custom class name. 
     * @group Properties 
     */
    className?: string;
}

/**
 * Sidebar component for filtering resources.
 * @group Subcomponents
 */
export const EzResourceSidebar: React.FC<EzResourceSidebarProps> = ({
    resources,
    selectedResourceIds,
    onSelectionChange,
    className = ""
}) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    // Filter logic
    const filteredResources = React.useMemo(() => {
        if (!searchTerm) return resources;
        return resources.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [resources, searchTerm]);

    const handleToggle = (id: string) => {
        if (selectedResourceIds.includes(id)) {
            onSelectionChange(selectedResourceIds.filter(rid => rid !== id));
        } else {
            onSelectionChange([...selectedResourceIds, id]);
        }
    };

    const handleSelectAll = () => {
        // If all filtered resources are selected, deselect them. Otherwise select all filtered.
        const allFilteredSelected = filteredResources.every(r => selectedResourceIds.includes(r.id));

        if (allFilteredSelected) {
            // Remove filtered IDs from selection
            const newSelection = selectedResourceIds.filter(id => !filteredResources.find(r => r.id === id));
            onSelectionChange(newSelection);
        } else {
            // Add all filtered IDs to selection (deduplicated)
            const newIds = filteredResources.map(r => r.id);
            const combined = Array.from(new Set([...selectedResourceIds, ...newIds]));
            onSelectionChange(combined);
        }
    };

    return (
        <div className={`p-4 border-r border-border bg-background flex flex-col gap-4 overflow-y-auto ${className}`}>
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search resources..."
                        className="pl-9 h-9 text-sm"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        {filteredResources.length} Found
                    </h3>
                    <button
                        onClick={handleSelectAll}
                        className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                        Select All
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2 min-h-0 flex-1 overflow-y-auto">
                {filteredResources.map(resource => (
                    <div key={resource.id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded transition-colors">
                        <Checkbox
                            id={`res-${resource.id}`}
                            checked={selectedResourceIds.includes(resource.id)}
                            onCheckedChange={() => handleToggle(resource.id)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label
                            htmlFor={`res-${resource.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer flex-1 py-1"
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: resource.color || '#ccc' }}
                            />
                            <span className="truncate">{resource.name}</span>
                        </Label>
                    </div>
                ))}
                {filteredResources.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        No resources found.
                    </div>
                )}
            </div>
        </div>
    );
};

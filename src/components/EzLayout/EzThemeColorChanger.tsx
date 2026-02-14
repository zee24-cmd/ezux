import React, { useEffect, useState } from 'react';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { ThemeService, ThemeColor } from '../../shared/services/ThemeService';
import { cn } from '../../lib/utils';
import { Palette } from 'lucide-react';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '../ui/dropdown-menu';

/**
 * Advanced theme customization component.
 * Allows users to change the primary brand color and the layout border radius.
 * @group Components
 */
export const EzThemeColorChanger: React.FC<{ className?: string }> = ({ className }) => {
    if (!globalServiceRegistry.get('ThemeService')) {
        globalServiceRegistry.register('ThemeService', new ThemeService());
    }
    const themeService = globalServiceRegistry.getOrThrow<ThemeService>('ThemeService');
    const [state, setState] = useState(themeService.getState());

    useEffect(() => {
        return themeService.subscribe((newState) => {
            setState({ ...newState });
        });
    }, [themeService]);

    const colors: { name: ThemeColor; label: string; colorClass: string }[] = [
        { name: 'Zinc', label: 'Zinc', colorClass: 'bg-zinc-900 dark:bg-zinc-100' },
        { name: 'Blue', label: 'Blue', colorClass: 'bg-blue-600' },
        { name: 'Green', label: 'Green', colorClass: 'bg-green-600' },
        { name: 'Orange', label: 'Orange', colorClass: 'bg-orange-500' },
        { name: 'Rose', label: 'Rose', colorClass: 'bg-rose-500' },
    ];

    const radiuses = [0, 0.3, 0.5, 0.75, 1.0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)}>
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Change theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
                <div className="p-4 space-y-4">
                    <div>
                        <DropdownMenuLabel className="px-0 pt-0">Color</DropdownMenuLabel>
                        <div className="grid grid-cols-3 gap-2 py-2">
                            {colors.map((color) => (
                                <Button
                                    key={color.name}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => themeService.setThemeColor(color.name)}
                                    className={cn(
                                        "flex flex-col items-center justify-center h-14 w-full p-0 rounded-md border-2",
                                        state.themeColor === color.name ? "border-primary" : "border-transparent"
                                    )}
                                >
                                    <span className={cn("h-4 w-4 rounded-full shadow-sm mb-1", color.colorClass)} />
                                    <span className="text-[10px] font-medium">{color.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div>
                        <DropdownMenuLabel className="px-0">Radius</DropdownMenuLabel>
                        <div className="grid grid-cols-5 gap-2 py-2">
                            {radiuses.map((r) => (
                                <Button
                                    key={r}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => themeService.setRadius(r)}
                                    className={cn(
                                        "h-8 px-0 text-xs font-medium",
                                        state.radius === r ? "border-primary bg-primary/5" : "border-transparent"
                                    )}
                                >
                                    {r}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

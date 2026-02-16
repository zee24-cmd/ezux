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
    DropdownMenuLabel
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

    const colors: { name: ThemeColor; label: string; colorValue: string }[] = [
        { name: 'Zinc', label: 'Zinc', colorValue: 'oklch(0.25 0 0)' },
        { name: 'Blue', label: 'Blue', colorValue: 'oklch(0.55 0.18 260)' },
        { name: 'Green', label: 'Green', colorValue: 'oklch(0.60 0.18 150)' },
        { name: 'Orange', label: 'Orange', colorValue: 'oklch(0.65 0.18 70)' },
        { name: 'Rose', label: 'Rose', colorValue: 'oklch(0.60 0.18 350)' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)}>
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Change theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-4 space-y-4">
                    <div>
                        <DropdownMenuLabel className="px-0 pt-0 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Theme Color</DropdownMenuLabel>
                        <div className="grid grid-cols-1 gap-1.5 py-2">
                            {colors.map((color) => (
                                <Button
                                    key={color.name}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => themeService.setThemeColor(color.name)}
                                    className={cn(
                                        "flex items-center justify-start h-10 w-full px-3 rounded-lg border border-transparent transition-all duration-200",
                                        state.themeColor === color.name ? "bg-primary/10 border-primary/20 text-primary" : "hover:bg-muted"
                                    )}
                                >
                                    <span
                                        className="h-4 w-4 rounded-full shadow-sm mr-3 border border-black/5 dark:border-white/10"
                                        style={{ backgroundColor: color.colorValue }}
                                    />
                                    <span className="text-sm font-semibold">{color.label}</span>
                                    {state.themeColor === color.name && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

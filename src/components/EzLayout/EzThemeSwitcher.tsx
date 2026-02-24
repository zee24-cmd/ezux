import React, { useEffect, useState } from 'react';
import { useThemeService } from '../../shared/contexts/EzProvider';

import { ThemeMode } from '../../shared/services/ThemeService';
import { cn } from '../../lib/utils';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Utility component to toggle between Light and Dark theme modes.
 * @group Components
 */
export const EzThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    // Ensure service is registered
    
    const themeService = useThemeService();
    const [mode, setMode] = useState<ThemeMode>(themeService.getState().mode);

    useEffect(() => {
        return themeService.subscribe((state) => {
            setMode(state.mode);
        });
    }, [themeService]);

    const toggleTheme = () => {
        themeService.toggleMode();
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", className)}
            onClick={toggleTheme}
            title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        >
            {mode === 'light' ? (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

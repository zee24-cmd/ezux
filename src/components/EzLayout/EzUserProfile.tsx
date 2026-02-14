import React, { useEffect, useState } from 'react';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { ThemeService, ThemeColor } from '../../shared/services/ThemeService';
import { I18nService } from '../../shared/services/I18nService';
import { cn } from '../../lib/utils';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

/**
 * Props for the user profile dropdown component.
 * @group Properties
 */
export interface EzUserProfileProps {
    /** Basic user details to display in the menu. @group Data */
    user: {
        /** Display name of the user. @group Data */
        name: string;
        /** Email address for secondary identification. @group Data */
        email?: string;
        /** URL to the user's avatar image. @group Appearance */
        avatarUrl?: string;
        /** Fallback initials if avatar is missing. @group Appearance */
        initials?: string;
    };
    /** Callback triggered when the user clicks 'Sign Out'. @group Events */
    onLogout?: () => void;
    /** Custom CSS class for the profile trigger button. @group Appearance */
    className?: string;
}

export const EzUserProfile: React.FC<EzUserProfileProps> = ({ user, onLogout, className }) => {
    // Theme Service logic for Color Changer
    if (!globalServiceRegistry.get('ThemeService')) {
        globalServiceRegistry.register('ThemeService', new ThemeService());
    }
    const themeService = globalServiceRegistry.getOrThrow<ThemeService>('ThemeService');
    const i18nService = globalServiceRegistry.getOrThrow<I18nService>('I18nService');
    const [currentColor, setCurrentColor] = useState<ThemeColor>(themeService.getState().themeColor);
    const [_, setTick] = useState(0);

    useEffect(() => {
        const unsubTheme = themeService.subscribe((state) => {
            setCurrentColor(state.themeColor);
        });
        const unsubI18n = i18nService.subscribe(() => setTick(t => t + 1));
        return () => { unsubTheme(); unsubI18n(); };
    }, [themeService, i18nService]);

    const colors: { name: ThemeColor; class: string }[] = [
        { name: 'Zinc', class: 'bg-zinc-900 dark:bg-zinc-100' },
        { name: 'Blue', class: 'bg-blue-600' },
        { name: 'Green', class: 'bg-emerald-600' },
        { name: 'Orange', class: 'bg-orange-500' },
        { name: 'Rose', class: 'bg-rose-500' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("relative h-10 w-10 rounded-full", className)}>
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.initials || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email || 'user@example.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>{i18nService.t('profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{i18nService.t('nav_settings')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{i18nService.t('theme_color')}</DropdownMenuLabel>
                <div className="grid grid-cols-6 gap-2 p-2 pt-0">
                    {colors.map((color) => (
                        <div
                            key={color.name}
                            onClick={() => themeService.setThemeColor(color.name)}
                            className={cn(
                                "h-6 w-6 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-110",
                                color.class,
                                currentColor === color.name ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                            )}
                            title={color.name}
                        />
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{i18nService.t('sign_out')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

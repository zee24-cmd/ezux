import React, { useState, useEffect } from 'react';
import { I18nService } from '../../shared/services/I18nService';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { cn } from '../../lib/utils';
import * as Flags from 'country-flag-icons/react/3x2';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Globe } from 'lucide-react';

export const EzLanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    const i18nService = globalServiceRegistry.getOrThrow<I18nService>('I18nService');
    const [currentLocale, setCurrentLocale] = useState(i18nService.locale);

    useEffect(() => {
        const unsubscribe = i18nService.subscribe((state) => {
            setCurrentLocale(state.locale);
        });
        return () => { unsubscribe(); };
    }, [i18nService]);

    const languages = i18nService.supportedLanguages;
    const currentLang = languages.find(l => l.code === currentLocale);
    // @ts-ignore
    const CurrentFlag = currentLang ? Flags[currentLang.country] : null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)}>
                    {CurrentFlag ? (
                        <CurrentFlag className="w-5 h-5 rounded-sm shadow-sm" />
                    ) : (
                        <Globe className="h-[1.2rem] w-[1.2rem]" />
                    )}
                    <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>{i18nService.t('switch_language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => {
                    // @ts-ignore
                    const FlagComponent = Flags[lang.country];
                    return (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => i18nService.setLocale(lang.code)}
                            className={cn(currentLocale === lang.code ? 'bg-accent' : '')}
                        >
                            {FlagComponent && <FlagComponent className="mr-2 w-5 h-5 rounded-sm shadow-sm" />}
                            {lang.name}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

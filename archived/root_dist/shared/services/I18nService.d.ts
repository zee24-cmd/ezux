import { IService } from './ServiceRegistry';
export declare class I18nService implements IService {
    name: string;
    private _locale;
    private _dir;
    private subscribers;
    readonly supportedLanguages: {
        code: string;
        name: string;
        country: string;
    }[];
    private translations;
    constructor(defaultLocale?: string);
    setLocale(locale: string): void;
    get locale(): string;
    get dir(): "ltr" | "rtl";
    registerTranslations(locale: string, da: Record<string, string>): void;
    t(key: string): string;
    subscribe(callback: (state: {
        locale: string;
        dir: 'ltr' | 'rtl';
    }) => void): () => boolean;
    private notify;
}

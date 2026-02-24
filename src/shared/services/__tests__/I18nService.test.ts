import { describe, it, expect, beforeEach } from 'vitest';
import { I18nService } from '../I18nService';

describe('I18nService', () => {
    let service: I18nService;

    beforeEach(() => {
        service = new I18nService();
    });

    it('should initialize with en locale', () => {
        expect(service.locale).toBe('en');
    });

    it('should fall back to key if translation missing', () => {
        expect(service.t('missing.key')).toBe('missing.key');
    });

    it('should return translation from real keys', () => {
        const tr = service.t('next_page');
        expect(tr).not.toBe('next_page');
        expect(tr).toBeTruthy();
    });

    it('should update locale', () => {
        service.setLocale('fr');
        expect(service.locale).toBe('fr');
    });

    it('should update custom translations', () => {
        service.registerTranslations('en', { greeting: 'Hello World' });
        expect(service.t('greeting')).toBe('Hello World');
    });
});

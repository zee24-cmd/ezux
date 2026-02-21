import { BaseService } from './BaseService';
import * as formatUtils from '../utils/formatUtils';

/**
 * Current state of the internationalization service.
 * @group State
 */
export interface I18nState {
    /** Current locale code (e.g., 'en', 'fr'). @group Data */
    locale: string;
    /** Text direction associated with the locale (ltr or rtl). @group Data */
    dir: 'ltr' | 'rtl';
    /** Map of all registered translations. @group Data */
    translations: Record<string, Record<string, string>>;
}

/**
 * A reactive internationalization service for EzUX.
 * 
 * Manages locale changes, text direction (RTL support), and translation lookups.
 * Supports dynamic registration of component-specific translation strings.
 * 
 * @group Services
 */
export class I18nService extends BaseService<I18nState> {
    name = 'I18nService';

    readonly supportedLanguages = [
        { code: 'en', name: 'English', country: 'US' },
        { code: 'fr', name: 'Français', country: 'FR' },
        { code: 'de', name: 'Deutsch', country: 'DE' },
        { code: 'es', name: 'Español', country: 'ES' },
        { code: 'zh', name: '中文', country: 'CN' },
        { code: 'ar', name: 'العربية', country: 'SA' },
    ];

    private initialTranslations: Record<string, Record<string, string>> = {
        en: {
            // EzSignature
            'controls': 'Controls',
            'customize_stroke': 'Customize the stroke.',
            'stroke_color': 'Stroke Color',
            'stroke_width': 'Stroke Width',
            'actions': 'Actions',
            'undo': 'Undo',
            'redo': 'Redo',
            'clear': 'Clear',
            'capture': 'Capture',
            'download_png': 'Download PNG',
            'captured_output': 'Captured Output',
            'download': 'Download',
            // EzKanban
            'add_card': 'Add Card',
            'add_column': 'Add Column',
            'add_swimlane': 'Add Swimlane',
            'search_placeholder': 'Search cards...',
            'view_standard': 'Standard',
            'view_swimlane': 'Swimlane',
            'view_timeline': 'Timeline',
            'view_analytics': 'Analytics',
            'uncategorized': 'Uncategorized',
            'no_cards': 'No cards in this column',
            'items': 'items',
            'switch_language': 'Switch Language',
            'reload_dataset': 'Reload Dataset',
            // EzTable
            'no_rows': 'No records to display',
            'loading': 'Loading...',
            'rows_per_page': 'Rows per page',
            'of': 'of',
            'page': 'Page',
            'go_to_page': 'Go to page',
            'first_page': 'First page',
            'last_page': 'Last page',
            'next_page': 'Next page',
            'previous_page': 'Previous page',
            'filter': 'Filter',
            'sort_asc': 'Sort ascending',
            'sort_desc': 'Sort descending',
            'clear_filter': 'Clear filter',
            'column_settings': 'Column settings',
            'group_by': 'Group by',
            'ungroup': 'Ungroup',
            'pin_left': 'Pin left',
            'pin_right': 'Pin right',
            'unpin': 'Unpin',
            'hide_column': 'Hide column',
            'selected_rows': 'selected rows',
            'total_rows': 'Total rows',
            // EzScheduler
            'day_view': 'Day',
            'week_view': 'Week',
            'month_view': 'Month',
            'agenda_view': 'Agenda',
            'today': 'Today',
            'add_event': 'Add Event',
            'edit_event': 'Edit Event',
            'delete_event': 'Delete Event',
            'all_day': 'All day',
            'no_events': 'No events',
            // EzLayout
            'sign_in': 'Sign In',
            'sign_out': 'Sign Out',
            'profile': 'Profile',
            'settings': 'Settings',
            'toggle_theme': 'Toggle theme',
            'toggle_sidebar': 'Toggle sidebar',
        },
        fr: {
            'controls': 'Contrôles',
            'customize_stroke': 'Personnaliser le trait.',
            'stroke_color': 'Couleur du trait',
            'stroke_width': 'Largeur du trait',
            'actions': 'Actions',
            'undo': 'Annuler',
            'redo': 'Rétablir',
            'clear': 'Effacer',
            'capture': 'Capturer',
            'download_png': 'Télécharger PNG',
            'captured_output': 'Sortie capturée',
            'download': 'Télécharger',
            // Kanban
            'add_card': 'Ajouter une carte',
            'add_column': 'Ajouter une colonne',
            'add_swimlane': 'Ajouter un couloir',
            'search_placeholder': 'Rechercher des cartes...',
            'view_standard': 'Standard',
            'view_swimlane': 'Couloir',
            'view_timeline': 'Chronologie',
            'view_analytics': 'Analytique',
            'uncategorized': 'Non catégorisé',
            'no_cards': 'Aucune carte dans cette colonne',
            'items': 'éléments',
            'switch_language': 'Changer de langue',
            'reload_dataset': 'Recharger l\'ensemble de données',
        },
        de: {
            'controls': 'Steuerung',
            'customize_stroke': 'Strich anpassen.',
            'stroke_color': 'Strichfarbe',
            'stroke_width': 'Strichbreite',
            'actions': 'Aktionen',
            'undo': 'Rückgängig',
            'redo': 'Wiederholen',
            'clear': 'Löschen',
            'capture': 'Erfassen',
            'download_png': 'Herunterladen PNG',
            'captured_output': 'Erfasste Ausgabe',
            'download': 'Herunterladen',
            // Kanban
            'add_card': 'Karte hinzufügen',
            'add_column': 'Spalte hinzufügen',
            'add_swimlane': 'Schwimmbahn hinzufügen',
            'search_placeholder': 'Karten suchen...',
            'view_standard': 'Standard',
            'view_swimlane': 'Schwimmbahn',
            'view_timeline': 'Zeitplan',
            'view_analytics': 'Analytik',
            'uncategorized': 'Nicht kategorisiert',
            'no_cards': 'Keine Karten in dieser Spalte',
            'items': 'Elemente',
            'switch_language': 'Sprache wechseln',
            'reload_dataset': 'Chipsatz neu laden',
        },
        es: {
            'controls': 'Controles',
            'customize_stroke': 'Personalizar el trazo.',
            'stroke_color': 'Color del trazo',
            'stroke_width': 'Ancho del trazo',
            'actions': 'Acciones',
            'undo': 'Deshacer',
            'redo': 'Rehacer',
            'clear': 'Limpiar',
            'capture': 'Capturar',
            'download_png': 'Descargar PNG',
            'captured_output': 'Salida capturada',
            'download': 'Descargar',
            // Kanban
            'add_card': 'Añadir tarjeta',
            'add_column': 'Añadir columna',
            'add_swimlane': 'Añadir carril',
            'search_placeholder': 'Buscar tarjetas...',
            'view_standard': 'Estándar',
            'view_swimlane': 'Carril',
            'view_timeline': 'Línea de tiempo',
            'view_analytics': 'Analítica',
            'uncategorized': 'Sin categoría',
            'no_cards': 'No hay tarjetas en esta columna',
            'items': 'elementos',
            'switch_language': 'Cambiar idioma',
            'reload_dataset': 'Recargar conjunto de datos',
        },
        zh: {
            'controls': '控制',
            'customize_stroke': '自定义笔触。',
            'stroke_color': '笔触颜色',
            'stroke_width': '笔触宽度',
            'actions': '操作',
            'undo': '撤销',
            'redo': '重做',
            'clear': '清除',
            'capture': '捕获',
            'download_png': '下载 PNG',
            'captured_output': '捕获输出',
            'download': '下载',
            // Kanban
            'add_card': '添加卡片',
            'add_column': '添加列',
            'add_swimlane': '添加泳道',
            'search_placeholder': '搜索卡片...',
            'view_standard': '标准',
            'view_swimlane': '泳道',
            'view_timeline': '时间轴',
            'view_analytics': '分析',
            'uncategorized': '未分类',
            'no_cards': '此列中没有卡片',
            'items': '项',
            'switch_language': '切换语言',
            'reload_dataset': '重新加载数据集',
        },
        ar: {
            'controls': 'عناصر التحكم',
            'customize_stroke': 'تخصيص الضربة.',
            'stroke_color': 'لون الضربة',
            'stroke_width': 'عرض الضربة',
            'actions': 'إجراءات',
            'undo': 'تراجع',
            'redo': 'إعادة',
            'clear': 'مسح',
            'capture': 'التقاط',
            'download_png': 'تحميل PNG',
            'captured_output': 'المخرجات الملتقطة',
            'download': 'تحميل',
            // Kanban
            'add_card': 'أضف بطاقة',
            'add_column': 'أضف عمود',
            'add_swimlane': 'أضف مسار',
            'search_placeholder': 'بحث عن البطاقات...',
            'view_standard': 'قياسي',
            'view_swimlane': 'مسار',
            'view_timeline': 'الجدول الزمني',
            'view_analytics': 'تحليلات',
            'uncategorized': 'غير مصنف',
            'no_cards': 'لا توجد بطاقات في هذا العمود',
            'items': 'عناصر',
            'switch_language': 'تغيير اللغة',
            'reload_dataset': 'إعادة تحميل البيانات',
        },
    };

    private _locale: string = 'en';
    private _translations: Record<string, Record<string, string>> = {};

    constructor(defaultLocale = 'en') {
        super({
            locale: defaultLocale,
            dir: ['ar', 'he', 'fa'].includes(defaultLocale) ? 'rtl' : 'ltr',
            translations: {}
        });

        this._locale = defaultLocale;
        this._translations = this.initialTranslations;

        this.setState({
            translations: this.initialTranslations
        });
    }

    get locale() { return this.state.locale; }
    get dir() { return this.state.dir; }

    /**
     * Sets the active locale and updates text direction.
     * @param locale The locale code to switch to.
     * @group Methods
     */
    setLocale = (locale: string): void => {
        this._locale = locale;
        this.setState({
            locale,
            dir: ['ar', 'he', 'fa'].includes(locale) ? 'rtl' : 'ltr'
        });
    };

    /**
     * Dynamically registers custom translations for a specific locale.
     * @param locale The locale to add translations for.
     * @param da Key-value pairs of translation strings.
     * @group Methods
     */
    registerTranslations = (locale: string, da: Record<string, string>): void => {
        this._translations[locale] = { ...this._translations[locale], ...da };
        this.setState(prev => ({
            translations: {
                ...(prev?.translations || {}),
                [locale]: { ...(prev?.translations?.[locale] || {}), ...da }
            }
        }));
    };

    /**
     * Translates a key based on the current active locale.
     * Falls back to English, then returns the key itself if not found.
     * @param key The translation key to lookup.
     * @returns The localized string or the key if not found.
     * @group Methods
     */
    t = (key: string): string => {
        const localeData = this._translations[this._locale] || this._translations['en'];
        return localeData?.[key] ?? key;
    };

    /**
     * Formats a date based on the current active locale.
     * @param value The date to format.
     * @param options Formatting options.
     * @group Formatting
     */
    formatDate = (value: Date | string | null | undefined, options: { format?: 'short' | 'long' | 'relative' | 'iso' } = {}) => {
        return formatUtils.formatDate(value, { ...options, locale: this.state.locale });
    }

    /**
     * Formats a number based on the current active locale.
     * @param value The number to format.
     * @param options Formatting options.
     * @group Formatting
     */
    formatNumber = (value: number | null | undefined, options: { format?: 'integer' | 'float' | 'currency' | 'percentage', decimals?: number, currency?: string } = {}) => {
        return formatUtils.formatNumber(value, { ...options, locale: this.state.locale });
    }

    /**
     * Formats a currency based on the current active locale.
     * @param value The amount to format.
     * @param currency The currency code (default: USD).
     * @group Formatting
     */
    formatCurrency = (value: number, currency = 'USD') => {
        return formatUtils.formatCurrency(value, this.state.locale, currency);
    }
}

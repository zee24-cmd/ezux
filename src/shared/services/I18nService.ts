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
            'nav_settings': 'Settings',
            'theme_color': 'Theme Color',
            'toggle_theme': 'Toggle theme',
            'toggle_sidebar': 'Toggle sidebar',
            // EzFlow
            'flow_node_library': 'Node Library',
            'flow_cat_flow_control': 'Flow Control',
            'flow_cat_logic': 'Logic',
            'flow_cat_execution': 'Execution',
            'flow_cat_human': 'Human',
            'flow_cat_structural': 'Structural',
            'flow_start_node': 'Start',
            'flow_start_node_desc': 'Entry point of the workflow',
            'flow_end_node': 'End',
            'flow_end_node_desc': 'Termination point',
            'flow_decision_node': 'Decision',
            'flow_decision_node_desc': 'If/Else branching logic',
            'flow_loop_node': 'Loop',
            'flow_loop_node_desc': 'Iterate over data',
            'flow_action_node': 'Action',
            'flow_action_node_desc': 'Execute a task',
            'flow_request_node': 'HTTP Request',
            'flow_request_node_desc': 'REST API integration',
            'flow_delay_node': 'Delay',
            'flow_delay_node_desc': 'Time-based pause',
            'flow_approval_node': 'Approval',
            'flow_approval_node_desc': 'Human approval step',
            'flow_group_node': 'Group',
            'flow_group_node_desc': 'Sub-process container',
            'flow_save': 'Save',
            'flow_cancel': 'Cancel',
            'flow_status_draft': 'Draft',
            'flow_status_live': 'Live',
            'flow_status_archived': 'Archived',
            'flow_discard_warning': 'You have unsaved changes. Discard and exit?',
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
            // EzFlow
            'flow_node_library': 'Bibliothèque de nœuds',
            'flow_cat_flow_control': 'Contrôle de flux',
            'flow_cat_logic': 'Logique',
            'flow_cat_execution': 'Exécution',
            'flow_cat_human': 'Humain',
            'flow_cat_structural': 'Structurel',
            'flow_start_node': 'Début',
            'flow_end_node': 'Fin',
            'flow_decision_node': 'Décision',
            'flow_loop_node': 'Boucle',
            'flow_action_node': 'Action',
            'flow_request_node': 'Requête HTTP',
            'flow_delay_node': 'Délai',
            'flow_approval_node': 'Approbation',
            'flow_group_node': 'Groupe',
            'flow_save': 'Enregistrer',
            'flow_cancel': 'Annuler',
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
            // EzFlow
            'flow_node_library': 'Knotenbibliothek',
            'flow_cat_flow_control': 'Flusskontrolle',
            'flow_cat_logic': 'Logik',
            'flow_cat_execution': 'Ausführung',
            'flow_cat_human': 'Menschlich',
            'flow_cat_structural': 'Strukturell',
            'flow_start_node': 'Start',
            'flow_end_node': 'Ende',
            'flow_decision_node': 'Entscheidung',
            'flow_loop_node': 'Schleife',
            'flow_action_node': 'Aktion',
            'flow_request_node': 'HTTP-Anfrage',
            'flow_delay_node': 'Verzögerung',
            'flow_approval_node': 'Genehmigung',
            'flow_group_node': 'Gruppe',
            'flow_save': 'Speichern',
            'flow_cancel': 'Abbrechen',
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
            // EzFlow
            'flow_node_library': 'Biblioteca de nodos',
            'flow_cat_flow_control': 'Control de flujo',
            'flow_cat_logic': 'Lógica',
            'flow_cat_execution': 'Ejecución',
            'flow_cat_human': 'Humano',
            'flow_cat_structural': 'Estructural',
            'flow_start_node': 'Inicio',
            'flow_end_node': 'Fin',
            'flow_decision_node': 'Decisión',
            'flow_loop_node': 'Bucle',
            'flow_action_node': 'Acción',
            'flow_request_node': 'Solicitud HTTP',
            'flow_delay_node': 'Retraso',
            'flow_approval_node': 'Aprobación',
            'flow_group_node': 'Grupo',
            'flow_save': 'Guardar',
            'flow_cancel': 'Cancelar',
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
            // EzFlow
            'flow_node_library': '节点库',
            'flow_cat_flow_control': '流程控制',
            'flow_cat_logic': '逻辑',
            'flow_cat_execution': '执行',
            'flow_cat_human': '人工',
            'flow_cat_structural': '结构',
            'flow_start_node': '开始',
            'flow_end_node': '结束',
            'flow_decision_node': '决策',
            'flow_loop_node': '循环',
            'flow_action_node': '操作',
            'flow_request_node': 'HTTP请求',
            'flow_delay_node': '延迟',
            'flow_approval_node': '审批',
            'flow_group_node': '分组',
            'flow_save': '保存',
            'flow_cancel': '取消',
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
            // EzFlow
            'flow_node_library': 'مكتبة العقد',
            'flow_cat_flow_control': 'التحكم في التدفق',
            'flow_cat_logic': 'المنطق',
            'flow_cat_execution': 'التنفيذ',
            'flow_cat_human': 'بشري',
            'flow_cat_structural': 'هيكلي',
            'flow_start_node': 'بداية',
            'flow_end_node': 'نهاية',
            'flow_decision_node': 'قرار',
            'flow_loop_node': 'حلقة',
            'flow_action_node': 'إجراء',
            'flow_request_node': 'طلب HTTP',
            'flow_delay_node': 'تأخير',
            'flow_approval_node': 'موافقة',
            'flow_group_node': 'مجموعة',
            'flow_save': 'حفظ',
            'flow_cancel': 'إلغاء',
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
     * Falls back to the provided defaultValue, then to English, then returns the key itself.
     * @param key The translation key to lookup.
     * @param defaultValue Optional fallback string if the key is not found.
     * @returns The localized string or the fallback/key if not found.
     * @group Methods
     */
    t = (key: string, defaultValue?: string): string => {
        const localeData = this._translations[this._locale] || this._translations['en'];
        return localeData?.[key] ?? defaultValue ?? key;
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

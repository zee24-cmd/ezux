import { memo, CSSProperties } from 'react';
import { cn } from '../../lib/utils';
import { 
    CheckCircle2, XCircle, Clock, AlertCircle, FileText, 
    Lock, Unlock, ShieldAlert, Globe, Users, Settings, 
    Archive, HelpCircle, PlayCircle, StopCircle, RefreshCcw,
    LucideIcon 
} from 'lucide-react';

export type Status = 
    | 'Active' | 'Inactive' | 'Pending' | 'Verified' | 'Unverified' 
    | 'On Leave' | 'Completed' | 'In Progress' | 'Archived'
    | 'Under Review' | 'Approved' | 'Rejected' | 'Draft'
    | 'Published' | 'Expired' | 'Scheduled' | 'Cancelled'
    | 'Resolved' | 'Unresolved' | 'Open' | 'Closed' | 'Default'
    | 'Disapproved' | 'Returned' | 'Public' | 'Private' 
    | 'Restricted' | 'Internal' | 'External' | 'System';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: LucideIcon }> = {
    Active: { color: 'emerald', label: 'Active', icon: CheckCircle2 },
    Verified: { color: 'emerald', label: 'Verified', icon: CheckCircle2 },
    Approved: { color: 'emerald', label: 'Approved', icon: CheckCircle2 },
    Published: { color: 'teal', label: 'Published', icon: CheckCircle2 },
    Resolved: { color: 'teal', label: 'Resolved', icon: CheckCircle2 },
    Completed: { color: 'indigo', label: 'Completed', icon: CheckCircle2 },
    'In Progress': { color: 'sky', label: 'In Progress', icon: PlayCircle },
    Open: { color: 'sky', label: 'Open', icon: Unlock },
    Pending: { color: 'amber', label: 'Pending', icon: Clock },
    'Under Review': { color: 'amber', label: 'Under Review', icon: FileText },
    Scheduled: { color: 'orange', label: 'Scheduled', icon: Clock },
    Returned: { color: 'orange', label: 'Returned', icon: RefreshCcw },
    Rejected: { color: 'red', label: 'Rejected', icon: XCircle },
    Disapproved: { color: 'red', label: 'Disapproved', icon: XCircle },
    Unresolved: { color: 'red', label: 'Unresolved', icon: AlertCircle },
    Expired: { color: 'red', label: 'Expired', icon: StopCircle },
    Cancelled: { color: 'rose', label: 'Cancelled', icon: XCircle },
    Unverified: { color: 'rose', label: 'Unverified', icon: HelpCircle },
    Inactive: { color: 'slate', label: 'Inactive', icon: XCircle },
    'On Leave': { color: 'blue', label: 'On Leave', icon: Clock },
    Archived: { color: 'gray', label: 'Archived', icon: Archive },
    Draft: { color: 'gray', label: 'Draft', icon: FileText },
    Closed: { color: 'gray', label: 'Closed', icon: Lock },
    Public: { color: 'blue', label: 'Public', icon: Globe },
    Private: { color: 'slate', label: 'Private', icon: Lock },
    Restricted: { color: 'amber', label: 'Restricted', icon: ShieldAlert },
    Internal: { color: 'indigo', label: 'Internal', icon: Users },
    External: { color: 'blue', label: 'External', icon: Globe },
    System: { color: 'violet', label: 'System', icon: Settings },
    Default: { color: 'gray', label: 'Default', icon: HelpCircle },
};

const GLOW_MAP = {
    none: 'none',
    low: '0 0 10px -5px',
    medium: '0 0 20px -8px',
    high: '0 0 30px -4px',
};

export interface StatusBadgeProps {
    status: Status | string;
    className?: string;
    showDot?: boolean;
    showIcon?: boolean;
    iconPosition?: 'left' | 'right';
    hideLabel?: boolean;
    showTooltip?: boolean;
    variant?: 'solid' | 'outline';
    customWidth?: string;
    customHeight?: string;
    customFontSize?: string;
    customBgColor?: string;
    customTextColor?: string;
    showBorder?: boolean;
    borderThickness?: string;
    customBorderColor?: string;
    glowIntensity?: 'none' | 'low' | 'medium' | 'high';
}

export const StatusBadge = memo<StatusBadgeProps>(({
    status,
    className,
    showDot = false,
    showIcon = false,
    iconPosition = 'left',
    hideLabel = false,
    showTooltip = true,
    variant = 'solid',
    customWidth,
    customHeight,
    customFontSize = '11px',
    customBgColor,
    customTextColor,
    showBorder = false,
    borderThickness = '1px',
    customBorderColor,
    glowIntensity = 'medium'
}) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Default;
    const colorClass = config.color;
    const StatusIcon = config.icon;
    const isNeutral = colorClass === 'gray' || colorClass === 'slate';

    const dynamicStyle: CSSProperties = {
        width: customWidth || undefined,
        height: customHeight || undefined,
        fontSize: customFontSize,
        backgroundColor: customBgColor || undefined,
        color: customTextColor || undefined,
        borderWidth: showBorder ? borderThickness : '0px',
        borderColor: customBorderColor || (showBorder ? 'currentColor' : 'transparent'),
        borderStyle: showBorder ? 'solid' : 'none',
        boxShadow: glowIntensity !== 'none' && !customBgColor 
            ? `${GLOW_MAP[glowIntensity]} var(--tw-shadow-color)` 
            : undefined,
    };

    return (
        <div
            style={dynamicStyle}
            title={showTooltip ? config.label : undefined}
            className={cn(
                'inline-flex items-center justify-center gap-2 transition-all duration-300 rounded-full font-bold',
                hideLabel ? 'p-1.5 w-[28px] h-[28px]' : 'px-3 py-1',
                !customWidth && !hideLabel && 'min-w-[120px]',
                !customHeight && !hideLabel && 'min-h-[28px]',
                !customBgColor && (variant === 'solid' ? `bg-${colorClass}-100` : 'bg-transparent'),
                !customTextColor && `text-${colorClass}-950`,
                !customBgColor && `dark:bg-${colorClass}-300`, 
                !customTextColor && (isNeutral ? 'dark:text-white dark:bg-gray-800' : 'dark:text-black'),
                `shadow-${colorClass}-500/40`,
                showTooltip && 'cursor-help',
                className
            )}
        >
            {iconPosition === 'left' && showIcon && (
                <StatusIcon className={cn("shrink-0 stroke-[3px]", hideLabel ? "w-4 h-4" : "w-3.5 h-3.5")} />
            )}
            
            {showDot && !showIcon && !hideLabel && (
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    `bg-${colorClass}-700`,
                    isNeutral ? 'dark:bg-white' : 'dark:bg-black/70'
                )} />
            )}

            {!hideLabel && (
                <span className="uppercase tracking-widest font-black leading-none">
                    {config.label}
                </span>
            )}

            {iconPosition === 'right' && showIcon && (
                <StatusIcon className={cn("shrink-0 stroke-[3px]", hideLabel ? "w-4 h-4" : "w-3.5 h-3.5")} />
            )}
        </div>
    );
});

StatusBadge.displayName = 'StatusBadge';
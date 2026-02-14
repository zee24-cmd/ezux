import { default as React } from 'react';
export interface EzUserProfileProps {
    user: {
        name: string;
        email?: string;
        avatarUrl?: string;
        initials?: string;
    };
    onLogout?: () => void;
    className?: string;
}
export declare const EzUserProfile: React.FC<EzUserProfileProps>;

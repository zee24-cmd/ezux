import { default as React } from 'react';
interface AuthSliderProps {
    signInSlot?: React.ReactNode;
    signUpSlot?: React.ReactNode;
    initialMode?: 'signin' | 'signup';
}
export declare const AuthSlider: React.FC<AuthSliderProps>;
export {};

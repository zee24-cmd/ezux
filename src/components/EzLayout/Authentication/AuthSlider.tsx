import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';

import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';

import { useService } from '../../../shared/hooks/useService';
import { NotificationService } from '../../../shared/services/NotificationService';

interface AuthSliderProps {
    signInSlot?: React.ReactNode;
    signUpSlot?: React.ReactNode;
    initialMode?: 'signin' | 'signup';
}

/**
 * A component that provides a sliding animation between sign-in and sign-up forms.
 * It supports custom form slots and handles basic authentication flow simulation.
 * @group Components
 */
export const AuthSlider: React.FC<AuthSliderProps> = ({
    signInSlot,
    signUpSlot,
    initialMode = 'signin'
}) => {
    // Sync local state with initialMode
    const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
    const notificationService = useService<NotificationService>('NotificationService', () => new NotificationService());

    const toggleMode = () => setIsSignUp(!isSignUp);

    const handleSignIn = async (values: any) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (values.email.includes('error')) {
            notificationService?.add({
                type: 'error',
                message: 'Invalid credentials. Please try again.',
                duration: 5000
            });
            throw new Error('Invalid credentials');
        } else {
            notificationService?.add({
                type: 'success',
                message: `Welcome back! Successfully signed in as ${values.email}`,
                duration: 3000
            });
        }
    };

    const handleSignUp = async (values: any) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        notificationService?.add({
            type: 'success',
            message: `Account created! Welcome, ${values.name}.`,
            duration: 3000
        });

        // Switch to Sign In mode
        setTimeout(() => setIsSignUp(false), 1000);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-900">
            {/* Main Wrapper */}
            <div className="relative w-full max-w-[900px] min-h-[600px] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-950 flex transition-all duration-300">

                {/* --- FORMS SECTION --- */}

                {/* 1. Sign In Form (Always on the LEFT half) */}
                <div className={cn(
                    "absolute top-0 left-0 h-full w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-950 transition-all duration-700 ease-in-out z-10",
                    isSignUp ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                )}>
                    {signInSlot || (
                        <SignInForm onSubmit={handleSignIn} />
                    )}
                </div>

                {/* 2. Sign Up Form (Always on the RIGHT half) */}
                <div className={cn(
                    "absolute top-0 left-0 md:left-1/2 h-full w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-950 transition-all duration-700 ease-in-out z-10",
                    isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    // On Mobile: Both occupy full width/height, but we toggle opacity/pointer-events.
                    // On Desktop: Positioned physically on Left/Right.
                )}>
                    {signUpSlot || (
                        <SignUpForm onSubmit={handleSignUp} />
                    )}
                </div>

                {/* --- THE SLIDING OVERLAY (Desktop Only) --- */}
                <div className={cn(
                    "hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 rounded-l-2xl shadow-xl",
                    isSignUp ? "-translate-x-full rounded-r-2xl rounded-l-none" : "translate-x-0"
                )}>
                    {/* Inner Content of Overlay */}
                    <div className={cn(
                        "relative -left-full h-full w-[200%] bg-gradient-to-br from-indigo-600 to-blue-700 text-white transition-transform duration-700 ease-in-out",
                        isSignUp ? "translate-x-1/2" : "translate-x-0"
                    )}>
                        <div className="flex h-full w-full">
                            {/* Overlay Left (Shows when on Sign Up page - moves to cover SignIn) */}
                            <div className="flex flex-col items-center justify-center w-1/2 px-12 text-center h-full">
                                <h2 className="text-3xl font-bold mb-4 tracking-tight">Welcome Back!</h2>
                                <p className="mb-8 text-sm opacity-90 leading-relaxed text-indigo-100">
                                    To keep connected with us please login with your personal info
                                </p>
                                <Button
                                    variant="outline"
                                    className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-indigo-600 px-10 py-6 font-semibold tracking-wide transition-all backdrop-blur-sm shadow-md"
                                    onClick={toggleMode}
                                >
                                    Sign In
                                </Button>
                            </div>

                            {/* Overlay Right (Shows when on Sign In page - moves to cover SignUp) */}
                            <div className="flex flex-col items-center justify-center w-1/2 px-12 text-center h-full">
                                <h2 className="text-3xl font-bold mb-4 tracking-tight">Hello, Friend!</h2>
                                <p className="mb-8 text-sm opacity-90 leading-relaxed text-indigo-100">
                                    Enter your personal details and start your journey with us
                                </p>
                                <Button
                                    variant="outline"
                                    className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-indigo-600 px-10 py-6 font-semibold tracking-wide transition-all backdrop-blur-sm shadow-md"
                                    onClick={toggleMode}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MOBILE TOGGLE BUTTON (Visible only on small screens) --- */}
                <div className="md:hidden absolute bottom-6 w-full text-center z-50">
                    <button
                        onClick={toggleMode}
                        type="button"
                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors animate-pulse"
                    >
                        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};
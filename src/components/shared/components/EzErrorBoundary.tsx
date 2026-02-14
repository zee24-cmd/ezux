import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface EzErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface EzErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class EzErrorBoundary extends Component<EzErrorBoundaryProps, EzErrorBoundaryState> {
    constructor(props: EzErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): EzErrorBoundaryState {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({
            errorInfo
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="flex flex-col items-center gap-4 max-w-md w-full">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h2 className="text-lg font-semibold">Something went wrong</h2>
                            <p className="text-sm text-muted-foreground">
                                An unexpected error occurred. Please try again.
                            </p>
                        </div>
                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default EzErrorBoundary;
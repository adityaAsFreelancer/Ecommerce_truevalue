import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorBoundary = ({ children }) => {
    // This is a class component equivalent using a wrapper or we can use a simple class component.
    // Since we are in a functional component project, we can't use hooks in a class component error boundary easily without a wrapper.
    // However, for simplicity and standard React patterns, a Class component is required for getDerivedStateFromError.
    return (
        <ErrorBoundaryClass>
            {children}
        </ErrorBoundaryClass>
    );
};

class ErrorBoundaryClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
                    <p className="text-gray-500 max-w-md mb-8">
                        We apologize for the inconvenience. The application has encountered an unexpected error.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                    >
                        Return Home
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="mt-8 p-4 bg-gray-100 rounded-xl text-xs text-left overflow-auto max-w-2xl w-full text-red-600">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Button from './Button';
import Card from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-deep-void flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card glow>
              <div className="text-center">
                <div className="p-4 bg-red-500/10 rounded-lg inline-block mb-4">
                  <ExclamationTriangleIcon className="w-12 h-12 text-red-400" />
                </div>
                
                <h2 className="text-xl font-mono uppercase text-text-primary mb-2 tracking-wider">
                  Something went wrong
                </h2>
                
                <p className="text-text-secondary mb-6">
                  An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>

                {this.state.error && (
                  <details className="mb-6 text-left">
                    <summary className="text-text-secondary text-sm cursor-pointer hover:text-text-primary transition-colors">
                      Error Details
                    </summary>
                    <pre className="mt-2 p-3 bg-deep-void/50 rounded text-xs text-red-400 overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}

                <div className="flex space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => window.location.reload()}
                    icon={<ArrowPathIcon className="w-4 h-4" />}
                  >
                    Refresh Page
                  </Button>
                  <Button
                    variant="primary"
                    onClick={this.handleReset}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
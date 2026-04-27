"use client";

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 border-2 border-red-200 rounded-2xl max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Quelque chose s'est mal passé</h2>
          <pre className="text-red-600 text-sm bg-red-100 p-4 rounded-lg mb-4 font-mono text-left max-h-40 overflow-auto">
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-all font-medium"
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


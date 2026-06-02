"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI error boundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-red-600 dark:text-red-300">
              {this.state.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm text-white hover:bg-red-700"
              onClick={() => this.setState({ hasError: false, message: "" })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

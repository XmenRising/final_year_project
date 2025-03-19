import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error Boundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
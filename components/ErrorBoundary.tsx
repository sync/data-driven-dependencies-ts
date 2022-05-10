import React from 'react';

interface Props {
  children: React.ReactNode;
  renderError: (error: Error, resetError: () => void) => React.ReactNode;
  shouldCatchError: (error: Error) => boolean;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error) {
    if (!this.props.shouldCatchError || this.props.shouldCatchError(error)) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state && this.state.error) {
      return this.props.renderError(this.state.error, this._resetError);
    }
    return this.props.children;
  }

  _resetError = () => {
    this.setState({ error: null });
  };
}

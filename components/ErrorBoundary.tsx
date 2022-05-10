import React from 'react';

interface Props {
  shouldCatchError: (error: Error) => boolean;
  renderError: (error: Error, resetError: () => void) => React.ReactNode;
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error) {
    if (!this.props.shouldCatchError || this.props.shouldCatchError(error)) {
      this.setState({error});
    }
  }

  render() {
    if (this.state && this.state.error) {
      return this.props.renderError(this.state.error, this._resetError);
    }
    return this.props.children;
  }

  _resetError = () => {
    this.setState({error: null});
  };
}

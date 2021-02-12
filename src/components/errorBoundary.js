import { Component } from "react";
import PropTypes from "prop-types";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return fallback;
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.any,
};

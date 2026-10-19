import { Component, type ReactNode } from 'react';

/**
 * Error boundary for 3D views: a failed chunk download (e.g. after a redeploy), a missing model,
 * a shader compile error or a lost GPU context all fall back to the still image / SVG.
 */
export default class Guard extends Component<{ fallback: ReactNode; onError?: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('3D view unavailable; showing the still version instead.', error);
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

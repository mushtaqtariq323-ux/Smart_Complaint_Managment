import React from 'react'

/**
 * App-level error boundary — koi bhi render-time crash poore app ko black
 * screen pe le jane ke bajaye ek friendly retry screen dikhata hai.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false, msg: '' }
  }

  static getDerivedStateFromError(err) {
    return { failed: true, msg: err?.message || 'Unknown error' }
  }

  componentDidCatch(err) {
    // SAFE log: message only — kabhi tokens/secrets nahi
    console.error('[AFC] render crash:', err?.message || 'unknown')
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="grid min-h-dvh place-items-center bg-zinc-950 px-6 text-center text-white">
          <div className="max-w-sm">
            <div className="mb-3 text-4xl">💪</div>
            <h1 className="mb-2 font-display text-lg font-bold">Something went wrong</h1>
            <p className="mb-5 text-[13.5px] leading-relaxed text-zinc-400">
              Part of the app crashed. Reload for a fresh start — your data is safe.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950"
            >
              🔄 Reload App
            </button>
            {this.state.msg && (
              <p className="mt-4 rounded-lg bg-white/[.04] px-3 py-2 text-[11px] leading-relaxed text-zinc-500">{this.state.msg}</p>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

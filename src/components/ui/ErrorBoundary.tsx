'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-2">
          <p className="text-2xl" aria-hidden="true">⚠️</p>
          <p className="text-sm font-semibold text-red-700">Algo deu errado</p>
          <p className="text-xs text-red-500">
            Recarregue a página ou tente novamente mais tarde.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 rounded-lg border border-red-300 px-4 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

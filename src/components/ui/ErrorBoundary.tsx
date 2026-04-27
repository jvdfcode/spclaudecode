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

  componentDidCatch(error: Error) {
    const digest = (error as Error & { digest?: string }).digest
    console.error('[ErrorBoundary]', digest ?? error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-[16px] border border-loss-200 bg-loss-50 p-6 text-center space-y-2">
          <p className="text-2xl" aria-hidden="true">⚠️</p>
          <p className="text-sm font-semibold text-loss-500">Algo deu errado</p>
          <p className="text-xs text-loss-500 opacity-80">
            Recarregue a página ou tente novamente mais tarde.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 rounded-[10px] border border-loss-200 px-4 py-1.5 text-xs font-medium text-loss-500 hover:bg-loss-50 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

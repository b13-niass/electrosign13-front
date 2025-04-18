import React from "react"

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by error boundary:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please try again later.</div>
        }
        return this.props.children
    }
}

export default ErrorBoundary
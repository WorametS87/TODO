import React, { ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box p={3}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <Typography variant="h6">Something went wrong</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Typography>
                    </Alert>
                    <Button variant="contained" onClick={this.handleReset}>
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

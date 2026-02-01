import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from './components';
import { MainLayout } from './layout';
import TodoController from './features/Todo/Controller/TodoController';
import CategoryController from './features/Category/Controller/CategoryController';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<TodoController />} />
                            <Route path="categories" element={<CategoryController />} />
                        </Route>
                    </Routes>

                </BrowserRouter>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
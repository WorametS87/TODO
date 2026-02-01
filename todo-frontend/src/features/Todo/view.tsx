import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Box, Typography, Button, TextField, IconButton, Checkbox,
    Paper, Chip, Pagination, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { todoController } from './controller';
import { categoryController } from '../Category/controller';
import { TodoDto, CreateTodoDto, UpdateTodoDto } from './dto';
import { TodoStatus } from '../../constants';

export const TodoView = observer(() => {
    const [formOpen, setFormOpen] = useState(false);
    const [editTodo, setEditTodo] = useState<TodoDto | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', categoryId: '' });

    useEffect(() => {
        // Fetch todos - required
        todoController.fetchTodos();
        
        // Fetch category list - optional, doesn't block if it fails
        categoryController.fetchCategoryList().catch(err => {
            console.warn('Failed to load categories:', err);
        });
    }, []);

    const handleCreate = () => {
        setEditTodo(null);
        setFormData({ title: '', description: '', categoryId: '' });
        setFormOpen(true);
    };

    const handleEdit = (todo: TodoDto) => {
        setEditTodo(todo);
        setFormData({
            title: todo.title,
            description: todo.description || '',
            categoryId: todo.category?.id?.toString() || ''
        });
        setFormOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('Title is required');
            return;
        }

        const data: CreateTodoDto | UpdateTodoDto = {
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
            categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        };

        try {
            if (editTodo) {
                await todoController.updateTodo(editTodo.id, data);
            } else {
                await todoController.createTodo(data as CreateTodoDto);
            }
            setFormOpen(false);
            setFormData({ title: '', description: '', categoryId: '' });
        } catch (error) {
            console.error('Failed to submit todo:', error);
        }
    };

    const handlePageChange = (_: unknown, page: number) => {
        todoController.setPageOptions({ page });
        todoController.fetchTodos();
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Todos</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
                    Add Todo
                </Button>
            </Box>

            {todoController.error && (
                <Alert severity="error" sx={{ mb: 2 }}>{todoController.error}</Alert>
            )}

            {todoController.isLoading && todoController.todos.length === 0 ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : todoController.todos && todoController.todos.length > 0 ? (
                <>
                    {todoController.todos.map((todo) => (
                        <Paper key={todo.id} sx={{ p: 2, mb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Checkbox
                                checked={todo.status === TodoStatus.DONE}
                                onChange={() => todoController.toggleStatus(todo.id)}
                            />
                            <Box flex={1}>
                                <Typography
                                    sx={{ textDecoration: todo.status === TodoStatus.DONE ? 'line-through' : 'none' }}
                                >
                                    {todo.title}
                                </Typography>
                                {todo.description && (
                                    <Typography variant="body2" color="text.secondary">{todo.description}</Typography>
                                )}
                                {todo.category && <Chip label={todo.category.name} size="small" sx={{ mt: 1 }} />}
                            </Box>
                            <IconButton onClick={() => handleEdit(todo)}><Edit /></IconButton>
                            <IconButton onClick={() => todoController.deleteTodo(todo.id)}><Delete /></IconButton>
                        </Paper>
                    ))}

                    {todoController.meta.pageCount > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={todoController.meta.pageCount}
                                page={todoController.meta.page}
                                onChange={handlePageChange}
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        No todos yet. Create one to get started!
                    </Typography>
                </Paper>
            )}

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editTodo ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <TextField
                        select
                        label="Category"
                        fullWidth
                        margin="normal"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="">None</option>
                        {categoryController.categoryList && categoryController.categoryList.length > 0 && categoryController.categoryList.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={!formData.title}>
                        {editTodo ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});
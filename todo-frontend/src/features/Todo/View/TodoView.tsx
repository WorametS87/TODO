// View/TodoView.tsx
import {
  Box, Typography, Button, TextField, IconButton, Checkbox,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { UseFormReturn } from 'react-hook-form';

// ✅ DTO จาก backend/shared เท่านั้น
import { TodoDto, CreateTodoDto } from '@shared/todo';

interface Props {
  todos: TodoDto[];
  loading: boolean;
  error: string | null;
  form: UseFormReturn<CreateTodoDto>;
  dialogOpen: boolean;
  editingTodo: TodoDto | null;
  onOpenCreate: () => void;
  onOpenEdit: (todo: TodoDto) => void;
  onCloseDialog: () => void;
  onSubmit: (data: CreateTodoDto) => void;
  onDelete: (id: number) => void;
  onToggle: (todo: TodoDto) => void;
}

export function TodoView({
  todos,
  loading,
  error,
  form,
  dialogOpen,
  editingTodo,
  onOpenCreate,
  onOpenEdit,
  onCloseDialog,
  onSubmit,
  onDelete,
  onToggle,
}: Props) {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Todos</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onOpenCreate}>
          Add Todo
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        todos.map(todo => (
          <Paper key={todo.id} sx={{ p: 2, mb: 1, display: 'flex', gap: 2 }}>
            <Checkbox
              checked={todo.status === 'DONE'}
              onChange={() => onToggle(todo)}
            />
            <Box flex={1}>
              <Typography sx={{ textDecoration: todo.status === 'DONE' ? 'line-through' : 'none' }}>
                {todo.title}
              </Typography>
              {todo.description && (
                <Typography variant="body2">{todo.description}</Typography>
              )}
            </Box>
            <IconButton onClick={() => onOpenEdit(todo)}><Edit /></IconButton>
            <IconButton onClick={() => onDelete(todo.id)}><Delete /></IconButton>
          </Paper>
        ))
      )}

      <Dialog open={dialogOpen} onClose={onCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingTodo ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            {...register('description')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            {editingTodo ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
